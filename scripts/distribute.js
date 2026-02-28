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

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, copyFileSync } from "fs";
import { join } from "path";
import yaml from "js-yaml";

const ROOT = join(import.meta.dirname, "..");
const SRC_WORKFLOWS = join(ROOT, "src/workflows");

function stripForYaml(content) {
  return content.replace(/\$\{\{[^}]*\}\}/g, "x").replace(/^(\s*run:\s*)(?!['"|>])([^\n]*:[^\n]*)$/gm, "$1'$2'"); // eslint-disable-line sonarjs/slow-regex
}

/**
 * Build a manifest of all workflow_call interfaces in src/workflows/.
 */
export function buildManifest() {
  const manifest = {};
  const files = readdirSync(SRC_WORKFLOWS).filter((f) => f.endsWith(".yml"));

  for (const file of files) {
    const content = readFileSync(join(SRC_WORKFLOWS, file), "utf8");
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

function checkWorkflowCompat(targetWorkflows, targetFile, info) {
  const targetContent = readFileSync(join(targetWorkflows, targetFile), "utf8");
  const targetDoc = yaml.load(stripForYaml(targetContent));
  const issues = [];

  for (const [, job] of Object.entries(targetDoc.jobs || {})) {
    if (typeof job.uses === "string" && job.with) {
      for (const param of Object.keys(job.with)) {
        if (!info.inputs.includes(param)) {
          issues.push(`Unknown input: ${param}`);
        }
      }
    }
  }

  return issues;
}

/**
 * Check compatibility between source workflows and a target repo's workflow files.
 */
export function checkCompatibility(manifest, targetPath) {
  const targetWorkflows = join(targetPath, ".github/workflows");
  const report = { compatible: [], incompatible: [], missing: [], extra: [] };

  if (!existsSync(targetWorkflows)) {
    report.missing = Object.keys(manifest);
    return report;
  }

  const targetFiles = readdirSync(targetWorkflows).filter((f) => f.endsWith(".yml"));

  for (const [file, info] of Object.entries(manifest)) {
    if (!info.hasWorkflowCall) continue;

    if (!targetFiles.includes(file)) {
      report.missing.push(file);
      continue;
    }

    try {
      const issues = checkWorkflowCompat(targetWorkflows, file, info);
      if (issues.length === 0) {
        report.compatible.push(file);
      } else {
        report.incompatible.push({ file, issues });
      }
    } catch (err) {
      report.incompatible.push({ file, issues: [`Parse error: ${err.message}`] });
    }
  }

  for (const file of targetFiles) {
    if (!manifest[file]) {
      report.extra.push(file);
    }
  }

  return report;
}

const USES_REF_RE = /uses:\s+xn-intenton-z2a\/agentic-lib\/[^@]+@\S+/g;

function rewriteVersionRefs(content, version) {
  return content.replace(USES_REF_RE, (match) => match.replace(/@\S+$/, `@v${version}`)); // eslint-disable-line sonarjs/slow-regex
}

function distributeAgents(targetPath, dryRun) {
  const agentsSrc = join(ROOT, "src/agents");
  const agentsDest = join(targetPath, ".github/agentic-lib/agents");
  const actions = [];

  if (!existsSync(agentsSrc)) return actions;
  if (!dryRun) mkdirSync(agentsDest, { recursive: true });

  for (const file of readdirSync(agentsSrc)) {
    actions.push({ action: existsSync(join(agentsDest, file)) ? "update" : "create", file: `agents/${file}` });
    if (!dryRun) copyFileSync(join(agentsSrc, file), join(agentsDest, file));
  }

  return actions;
}

/**
 * Distribute workflow files to target repository.
 */
export function distribute(targetPath, { dryRun = false, version = "7.0.0" } = {}) {
  const manifest = buildManifest();
  const targetWorkflows = join(targetPath, ".github/workflows");
  const actions = [];

  if (!dryRun) mkdirSync(targetWorkflows, { recursive: true });

  for (const [file, info] of Object.entries(manifest)) {
    if (!info.hasWorkflowCall) continue;

    const destFile = join(targetWorkflows, file);
    actions.push({ action: existsSync(destFile) ? "update" : "create", file });

    if (!dryRun) {
      const content = readFileSync(join(SRC_WORKFLOWS, file), "utf8");
      writeFileSync(destFile, rewriteVersionRefs(content, version));
    }
  }

  actions.push(...distributeAgents(targetPath, dryRun));
  return { manifest, actions, report: checkCompatibility(manifest, targetPath) };
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const targetPath = args.filter((a) => !a.startsWith("--"))[0];

  if (!targetPath) {
    console.error("Usage: node scripts/distribute.js [--dry-run] [--commit] <target-repo-path>");
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
    console.log(`    ${item.file}: ${item.issues.join(", ")}`);
  }
  console.log(`  Missing: ${report.missing.length}`);
  console.log(`  Extra: ${report.extra.length}`);

  if (dryRun) {
    console.log("\n(dry-run mode — no files written)");
  }
}
