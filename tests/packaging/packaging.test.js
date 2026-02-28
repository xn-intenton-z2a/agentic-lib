import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

const ROOT = join(import.meta.dirname, "../..");
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));

describe("package.json structure", () => {
  it("has a name field", () => {
    expect(pkg.name).toBe("@xn-intenton-z2a/agentic-lib");
  });

  it("has a version field", () => {
    expect(pkg.version).toMatch(/^\d+\.\d+\.\d+/);
  });

  it("has type: module", () => {
    expect(pkg.type).toBe("module");
  });

  it("has engines.node >= 24", () => {
    expect(pkg.engines).toBeDefined();
    expect(pkg.engines.node).toMatch(/24/);
  });

  it("has files field restricting what ships", () => {
    expect(Array.isArray(pkg.files)).toBe(true);
    expect(pkg.files.length).toBeGreaterThan(0);
  });

  it("has publishConfig pointing to GitHub registry", () => {
    expect(pkg.publishConfig).toBeDefined();
    expect(pkg.publishConfig.registry).toContain("npm.pkg.github.com");
  });

  it("has required scripts", () => {
    const required = ["test", "linting", "formatting", "security"];
    for (const script of required) {
      expect(pkg.scripts[script]).toBeDefined();
    }
  });
});

describe("npm pack --dry-run", () => {
  let packOutput;

  // Run once for all tests in this describe block
  try {
    packOutput = execSync("npm pack --dry-run 2>&1", { cwd: ROOT, encoding: "utf8" }); // eslint-disable-line sonarjs/no-os-command-from-path
  } catch (err) {
    packOutput = err.stdout || err.message;
  }

  it("lists expected files", () => {
    expect(packOutput).toContain("package.json");
  });

  it("does not include test files", () => {
    expect(packOutput).not.toMatch(/tests\//);
    expect(packOutput).not.toMatch(/\.test\.js/);
  });

  it("does not include source code (src/)", () => {
    expect(packOutput).not.toMatch(/src\//);
  });

  it("does not include dev files", () => {
    expect(packOutput).not.toMatch(/\.github\//);
    expect(packOutput).not.toMatch(/node_modules\//);
    expect(packOutput).not.toMatch(/coverage\//);
  });

  it("does not include secrets", () => {
    expect(packOutput).not.toMatch(/\.env/);
    expect(packOutput).not.toMatch(/secrets/);
    expect(packOutput).not.toMatch(/\.kdbx/);
  });
});

describe("package metadata", () => {
  it("has a description", () => {
    expect(typeof pkg.description).toBe("string");
    expect(pkg.description.length).toBeGreaterThan(10);
  });

  it("has an author", () => {
    expect(pkg.author).toBeDefined();
  });

  it("has a license", () => {
    expect(pkg.license).toBeDefined();
    expect(pkg.license).toContain("GPL");
  });
});
