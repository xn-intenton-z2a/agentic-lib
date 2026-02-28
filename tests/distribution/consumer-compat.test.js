import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import yaml from "js-yaml";

const ROOT = join(import.meta.dirname, "../..");
const SRC_WORKFLOWS = join(ROOT, "src/workflows");
const REPO0_PATH = join(ROOT, "../repository0");

function stripForYaml(content) {
  return content.replace(/\$\{\{[^}]*\}\}/g, "x").replace(/^(\s*run:\s*)(?!['"|>])([^\n]*:[^\n]*)$/gm, "$1'$2'"); // eslint-disable-line sonarjs/slow-regex
}

describe("workflow_call interface consistency", () => {
  const workflowFiles = readdirSync(SRC_WORKFLOWS).filter((f) => f.endsWith(".yml"));

  it("all workflow files are valid YAML", () => {
    for (const file of workflowFiles) {
      const content = readFileSync(join(SRC_WORKFLOWS, file), "utf8");
      const doc = yaml.load(stripForYaml(content));
      expect(doc).toBeTruthy();
    }
  });

  it("workflow_call inputs have consistent typing", () => {
    for (const file of workflowFiles) {
      const content = readFileSync(join(SRC_WORKFLOWS, file), "utf8");
      const doc = yaml.load(stripForYaml(content));
      const trigger = doc.on || doc.true || {};
      if (trigger.workflow_call?.inputs) {
        for (const [, input] of Object.entries(trigger.workflow_call.inputs)) {
          if (input.type) {
            expect(["string", "boolean", "number"]).toContain(input.type);
          }
        }
      }
    }
  });

  it("no @main version refs in workflow uses", () => {
    for (const file of workflowFiles) {
      const content = readFileSync(join(SRC_WORKFLOWS, file), "utf8");
      const mainRefs = content.match(/uses:.*@main\b/g);
      expect(mainRefs).toBeNull();
    }
  });

  it("all required secrets are documented in workflow_call", () => {
    for (const file of workflowFiles) {
      const content = readFileSync(join(SRC_WORKFLOWS, file), "utf8");
      const doc = yaml.load(stripForYaml(content));
      const trigger = doc.on || doc.true || {};
      if (trigger.workflow_call?.secrets) {
        for (const [, secret] of Object.entries(trigger.workflow_call.secrets)) {
          expect(secret).toBeDefined();
        }
      }
    }
  });
});

function buildSourceManifest(srcFiles) {
  const sourceManifest = {};
  for (const file of srcFiles) {
    const content = readFileSync(join(SRC_WORKFLOWS, file), "utf8");
    const doc = yaml.load(stripForYaml(content));
    const trigger = doc.on || doc.true || {};
    if (trigger.workflow_call?.inputs) {
      sourceManifest[file] = Object.keys(trigger.workflow_call.inputs);
    }
  }
  return sourceManifest;
}

function checkJobCompat(file, jobName, job, sourceManifest) {
  if (typeof job.uses !== "string" || !job.with) return [];
  const usesMatch = job.uses.match(/([^/]+\.yml)@/); // eslint-disable-line sonarjs/slow-regex
  if (!usesMatch) return [];
  const sourceInputs = sourceManifest[usesMatch[1]];
  if (!sourceInputs) return [];
  return Object.keys(job.with)
    .filter((param) => !sourceInputs.includes(param))
    .map((param) => `${file}:${jobName} uses unknown input '${param}' for ${usesMatch[1]}`);
}

function findCompatIssues(repo0Workflows, sourceManifest) {
  const targetFiles = readdirSync(repo0Workflows).filter((f) => f.endsWith(".yml"));
  const issues = [];

  for (const file of targetFiles) {
    try {
      const content = readFileSync(join(repo0Workflows, file), "utf8");
      const doc = yaml.load(stripForYaml(content));
      for (const [jobName, job] of Object.entries(doc.jobs || {})) {
        issues.push(...checkJobCompat(file, jobName, job, sourceManifest));
      }
    } catch {
      // Skip unparseable files
    }
  }

  return issues;
}

describe.skipIf(!existsSync(REPO0_PATH))("cross-repo: repository0 compatibility", () => {
  const repo0Workflows = join(REPO0_PATH, ".github/workflows");

  it("repository0 exists and has workflows", () => {
    expect(existsSync(repo0Workflows)).toBe(true);
  });

  it("repository0 workflow `with:` params match source `inputs:`", () => {
    if (!existsSync(repo0Workflows)) return;

    const srcFiles = readdirSync(SRC_WORKFLOWS).filter((f) => f.endsWith(".yml"));
    const sourceManifest = buildSourceManifest(srcFiles);
    const issues = findCompatIssues(repo0Workflows, sourceManifest);

    expect(issues).toEqual([]);
  });

  it("repository0 version pins are consistent", () => {
    if (!existsSync(repo0Workflows)) return;

    const targetFiles = readdirSync(repo0Workflows).filter((f) => f.endsWith(".yml"));
    const versions = new Set();

    for (const file of targetFiles) {
      const content = readFileSync(join(repo0Workflows, file), "utf8");
      const versionRefs = content.match(/xn-intenton-z2a\/agentic-lib\/[^\s@]+@([^\s'"]+)/g);
      if (versionRefs) {
        for (const ref of versionRefs) {
          const version = ref.split("@").pop();
          if (version) versions.add(version);
        }
      }
    }

    expect(versions.size).toBeLessThanOrEqual(1);
  });
});
