import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import yaml from "js-yaml";

const WORKFLOWS_DIR = join(import.meta.dirname, "../../src/workflows");

const workflowFiles = readdirSync(WORKFLOWS_DIR)
  .filter((f) => f.endsWith(".yml"))
  .sort();

/**
 * Strip GitHub Actions template expressions and problematic inline strings
 * before YAML parsing. GitHub Actions uses a custom YAML parser that handles
 * ${{ }} natively; standard js-yaml cannot.
 */
function stripForYaml(content) {
  return (
    content
      // Replace ${{ ... }} expressions with a safe placeholder
      .replace(/\$\{\{[^}]*\}\}/g, "x")
      // Quote bare `run:` values that contain colons (would break YAML parsing)
      .replace(/^(\s*run:\s*)(?!['"|>])([^\n]*:[^\n]*)$/gm, "$1'$2'") // eslint-disable-line sonarjs/slow-regex
  );
}

describe("src/workflows", () => {
  it("has 13 workflow files", () => {
    expect(workflowFiles).toHaveLength(13);
  });

  describe.each(workflowFiles)("%s", (filename) => {
    it("is valid YAML (after stripping GHA expressions)", () => {
      const content = readFileSync(join(WORKFLOWS_DIR, filename), "utf8");
      const doc = yaml.load(stripForYaml(content));
      expect(doc).toBeTruthy();
    });

    it("has a name field", () => {
      const content = readFileSync(join(WORKFLOWS_DIR, filename), "utf8");
      const doc = yaml.load(stripForYaml(content));
      expect(doc.name).toBeTruthy();
    });

    it("has an on trigger", () => {
      const content = readFileSync(join(WORKFLOWS_DIR, filename), "utf8");
      const doc = yaml.load(stripForYaml(content));
      // js-yaml parses bare `on:` as `true:` (YAML spec), so check both
      expect(doc.on || doc.true).toBeTruthy();
    });

    it("has a jobs field", () => {
      const content = readFileSync(join(WORKFLOWS_DIR, filename), "utf8");
      const doc = yaml.load(stripForYaml(content));
      expect(doc.jobs).toBeTruthy();
    });

    it("uses ubuntu-latest for runs-on", () => {
      const content = readFileSync(join(WORKFLOWS_DIR, filename), "utf8");
      const doc = yaml.load(stripForYaml(content));
      for (const [, job] of Object.entries(doc.jobs)) {
        if (job["runs-on"]) {
          expect(job["runs-on"]).toBe("ubuntu-latest");
        }
      }
    });

    it("uses node 24 (not older versions)", () => {
      const content = readFileSync(join(WORKFLOWS_DIR, filename), "utf8");
      const nodeVersionMatches = content.match(/node-version:\s*['"]?(\d+)['"]?/g);
      if (nodeVersionMatches) {
        for (const match of nodeVersionMatches) {
          const version = match.match(/(\d+)/)?.[1];
          expect(Number(version)).toBe(24);
        }
      }
    });
  });
});
