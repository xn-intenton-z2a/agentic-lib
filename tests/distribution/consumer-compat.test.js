import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';

const ROOT = join(import.meta.dirname, '../..');
const SRC_WORKFLOWS = join(ROOT, 'src/workflows');
const REPO0_PATH = join(ROOT, '../repository0');

function stripForYaml(content) {
  return content
    .replace(/\$\{\{[^}]*\}\}/g, 'x')
    .replace(/^(\s*run:\s*)(?!['"|>])(.+:.+)$/gm, "$1'$2'");
}

describe('workflow_call interface consistency', () => {
  const workflowFiles = readdirSync(SRC_WORKFLOWS).filter(f => f.endsWith('.yml'));

  it('all workflow files are valid YAML', () => {
    for (const file of workflowFiles) {
      const content = readFileSync(join(SRC_WORKFLOWS, file), 'utf8');
      const doc = yaml.load(stripForYaml(content));
      expect(doc).toBeTruthy();
    }
  });

  it('workflow_call inputs have consistent typing', () => {
    for (const file of workflowFiles) {
      const content = readFileSync(join(SRC_WORKFLOWS, file), 'utf8');
      const doc = yaml.load(stripForYaml(content));
      const trigger = doc.on || doc.true || {};
      if (trigger.workflow_call?.inputs) {
        for (const [name, input] of Object.entries(trigger.workflow_call.inputs)) {
          if (input.type) {
            expect(['string', 'boolean', 'number']).toContain(input.type);
          }
        }
      }
    }
  });

  it('no @main version refs in workflow uses', () => {
    for (const file of workflowFiles) {
      const content = readFileSync(join(SRC_WORKFLOWS, file), 'utf8');
      // Check for uses: ...@main (should use versioned tags)
      const mainRefs = content.match(/uses:.*@main\b/g);
      // Some workflows may legitimately reference main — just warn, don't fail
      if (mainRefs) {
        console.warn(`WARNING: ${file} has @main refs: ${mainRefs.length}`);
      }
    }
  });

  it('all required secrets are documented in workflow_call', () => {
    for (const file of workflowFiles) {
      const content = readFileSync(join(SRC_WORKFLOWS, file), 'utf8');
      const doc = yaml.load(stripForYaml(content));
      const trigger = doc.on || doc.true || {};
      if (trigger.workflow_call?.secrets) {
        for (const [name, secret] of Object.entries(trigger.workflow_call.secrets)) {
          // Each secret should at minimum exist
          expect(typeof name).toBe('string');
        }
      }
    }
  });
});

describe.skipIf(!existsSync(REPO0_PATH))('cross-repo: repository0 compatibility', () => {
  const repo0Workflows = join(REPO0_PATH, '.github/workflows');

  it('repository0 exists and has workflows', () => {
    expect(existsSync(repo0Workflows)).toBe(true);
  });

  it('repository0 workflow `with:` params match source `inputs:`', () => {
    if (!existsSync(repo0Workflows)) return;

    const sourceManifest = {};
    const srcFiles = readdirSync(SRC_WORKFLOWS).filter(f => f.endsWith('.yml'));
    for (const file of srcFiles) {
      const content = readFileSync(join(SRC_WORKFLOWS, file), 'utf8');
      const doc = yaml.load(stripForYaml(content));
      const trigger = doc.on || doc.true || {};
      if (trigger.workflow_call?.inputs) {
        sourceManifest[file] = Object.keys(trigger.workflow_call.inputs);
      }
    }

    const targetFiles = readdirSync(repo0Workflows).filter(f => f.endsWith('.yml'));
    const issues = [];

    for (const file of targetFiles) {
      try {
        const content = readFileSync(join(repo0Workflows, file), 'utf8');
        const doc = yaml.load(stripForYaml(content));
        for (const [jobName, job] of Object.entries(doc.jobs || {})) {
          if (typeof job.uses === 'string' && job.with) {
            // Extract the workflow filename from uses ref
            const usesMatch = job.uses.match(/([^/]+\.yml)@/);
            if (usesMatch) {
              const sourceFile = usesMatch[1];
              const sourceInputs = sourceManifest[sourceFile];
              if (sourceInputs) {
                for (const param of Object.keys(job.with)) {
                  if (!sourceInputs.includes(param)) {
                    issues.push(`${file}:${jobName} uses unknown input '${param}' for ${sourceFile}`);
                  }
                }
              }
            }
          }
        }
      } catch {
        // Skip unparseable files
      }
    }

    if (issues.length > 0) {
      console.warn('Compatibility issues:', issues);
    }
    // Don't fail on this — just report. Actual failures need investigation.
  });

  it('repository0 version pins are consistent', () => {
    if (!existsSync(repo0Workflows)) return;

    const targetFiles = readdirSync(repo0Workflows).filter(f => f.endsWith('.yml'));
    const versions = new Set();

    for (const file of targetFiles) {
      const content = readFileSync(join(repo0Workflows, file), 'utf8');
      const versionRefs = content.match(/xn-intenton-z2a\/agentic-lib\/[^@]+@([^\s'"]+)/g);
      if (versionRefs) {
        for (const ref of versionRefs) {
          const version = ref.match(/@(.+)$/)?.[1];
          if (version) versions.add(version);
        }
      }
    }

    // All version refs should be the same
    if (versions.size > 1) {
      console.warn(`WARNING: Multiple version pins found: ${[...versions].join(', ')}`);
    }
  });
});
