#!/usr/bin/env node
// distribute.js — Distribute agentic-lib workflows to consumer repositories
//
// Reads src/workflows/*.yml, builds a manifest of workflow_call interfaces,
// and copies/updates workflow files in a target repository.
//
// Usage:
//   node scripts/distribute.js [--dry-run] [--commit] <target-repo-path>
//
// Options:
//   --dry-run   Show what would change without writing files
//   --commit    Create a branch and commit changes in the target repo

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { join, basename } from 'path';
import yaml from 'js-yaml';

const ROOT = join(import.meta.dirname, '..');
const SRC_WORKFLOWS = join(ROOT, 'src/workflows');

function stripForYaml(content) {
  return content
    .replace(/\$\{\{[^}]*\}\}/g, 'x')
    .replace(/^(\s*run:\s*)(?!['"|>])(.+:.+)$/gm, "$1'$2'");
}

/**
 * Build a manifest of all workflow_call interfaces in src/workflows/.
 */
export function buildManifest() {
  const manifest = {};
  const files = readdirSync(SRC_WORKFLOWS).filter(f => f.endsWith('.yml'));

  for (const file of files) {
    const content = readFileSync(join(SRC_WORKFLOWS, file), 'utf8');
    const doc = yaml.load(stripForYaml(content));
    const trigger = doc.on || doc.true || {};
    const workflowCall = trigger.workflow_call || {};

    manifest[file] = {
      name: doc.name || file,
      inputs: workflowCall.inputs ? Object.keys(workflowCall.inputs) : [],
      outputs: workflowCall.outputs ? Object.keys(workflowCall.outputs) : [],
      secrets: workflowCall.secrets ? Object.keys(workflowCall.secrets) : [],
      hasWorkflowCall: !!trigger.workflow_call,
    };
  }

  return manifest;
}

/**
 * Check compatibility between source workflows and a target repo's workflow files.
 */
export function checkCompatibility(manifest, targetPath) {
  const targetWorkflows = join(targetPath, '.github/workflows');
  const report = { compatible: [], incompatible: [], missing: [], extra: [] };

  if (!existsSync(targetWorkflows)) {
    report.missing = Object.keys(manifest);
    return report;
  }

  const targetFiles = readdirSync(targetWorkflows).filter(f => f.endsWith('.yml'));

  for (const [file, info] of Object.entries(manifest)) {
    if (!info.hasWorkflowCall) continue; // Not a reusable workflow

    const targetFile = targetFiles.find(f => f === file);
    if (!targetFile) {
      report.missing.push(file);
      continue;
    }

    try {
      const targetContent = readFileSync(join(targetWorkflows, targetFile), 'utf8');
      const targetDoc = yaml.load(stripForYaml(targetContent));

      // Check if target uses `with:` params that match source `inputs:`
      let compatible = true;
      const issues = [];

      for (const [, job] of Object.entries(targetDoc.jobs || {})) {
        if (typeof job.uses === 'string' && job.with) {
          const usedParams = Object.keys(job.with);
          for (const param of usedParams) {
            if (!info.inputs.includes(param)) {
              issues.push(`Unknown input: ${param}`);
              compatible = false;
            }
          }
        }
      }

      if (compatible) {
        report.compatible.push(file);
      } else {
        report.incompatible.push({ file, issues });
      }
    } catch (err) {
      report.incompatible.push({ file, issues: [`Parse error: ${err.message}`] });
    }
  }

  // Extra files in target not in source
  for (const file of targetFiles) {
    if (!manifest[file]) {
      report.extra.push(file);
    }
  }

  return report;
}

/**
 * Distribute workflow files to target repository.
 */
export function distribute(targetPath, { dryRun = false, version = '7.0.0' } = {}) {
  const manifest = buildManifest();
  const targetWorkflows = join(targetPath, '.github/workflows');
  const actions = [];

  if (!dryRun) {
    mkdirSync(targetWorkflows, { recursive: true });
  }

  for (const [file, info] of Object.entries(manifest)) {
    if (!info.hasWorkflowCall) continue; // Only distribute reusable workflows

    const srcFile = join(SRC_WORKFLOWS, file);
    const destFile = join(targetWorkflows, file);

    if (existsSync(destFile)) {
      actions.push({ action: 'update', file });
    } else {
      actions.push({ action: 'create', file });
    }

    if (!dryRun) {
      let content = readFileSync(srcFile, 'utf8');
      // Update version refs
      content = content.replace(
        /uses:\s+xn-intenton-z2a\/agentic-lib\/[^@]+@\S+/g,
        (match) => match.replace(/@\S+$/, `@v${version}`)
      );
      writeFileSync(destFile, content);
    }
  }

  // Also distribute agent configs and seeds
  const agentsSrc = join(ROOT, 'src/agents');
  const agentsDest = join(targetPath, '.github/agentic-lib/agents');
  if (existsSync(agentsSrc)) {
    if (!dryRun) mkdirSync(agentsDest, { recursive: true });
    for (const file of readdirSync(agentsSrc)) {
      actions.push({ action: existsSync(join(agentsDest, file)) ? 'update' : 'create', file: `agents/${file}` });
      if (!dryRun) copyFileSync(join(agentsSrc, file), join(agentsDest, file));
    }
  }

  return { manifest, actions, report: checkCompatibility(manifest, targetPath) };
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const targetPath = args.filter(a => !a.startsWith('--'))[0];

  if (!targetPath) {
    console.error('Usage: node scripts/distribute.js [--dry-run] [--commit] <target-repo-path>');
    process.exit(1);
  }

  if (!existsSync(targetPath)) {
    console.error(`Target path not found: ${targetPath}`);
    process.exit(1);
  }

  const { manifest, actions, report } = distribute(targetPath, { dryRun });

  console.log(`\nManifest: ${Object.keys(manifest).length} workflows`);
  console.log(`Actions: ${actions.length}`);
  for (const a of actions) {
    console.log(`  ${a.action}: ${a.file}`);
  }

  console.log(`\nCompatibility:`);
  console.log(`  Compatible: ${report.compatible.length}`);
  console.log(`  Incompatible: ${report.incompatible.length}`);
  for (const item of report.incompatible) {
    console.log(`    ${item.file}: ${item.issues.join(', ')}`);
  }
  console.log(`  Missing: ${report.missing.length}`);
  console.log(`  Extra: ${report.extra.length}`);

  if (dryRun) {
    console.log('\n(dry-run mode — no files written)');
  }
}
