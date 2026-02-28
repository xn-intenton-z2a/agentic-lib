import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const FIXTURES_DIR = join(import.meta.dirname, "copilot-responses");
const GOLDEN_DIR = join(import.meta.dirname, "golden-prompts");

describe("copilot response fixtures", () => {
  const fixtureFiles = readdirSync(FIXTURES_DIR).filter((f) => f.endsWith(".json"));

  it("has fixture files", () => {
    expect(fixtureFiles.length).toBeGreaterThan(0);
  });

  describe.each(fixtureFiles)("%s", (filename) => {
    const fixture = JSON.parse(readFileSync(join(FIXTURES_DIR, filename), "utf8"));

    it("has data.content field", () => {
      expect(fixture.data).toBeDefined();
      expect(typeof fixture.data.content).toBe("string");
    });

    it("has data.usage.totalTokens field", () => {
      expect(fixture.data.usage).toBeDefined();
      expect(typeof fixture.data.usage.totalTokens).toBe("number");
      expect(fixture.data.usage.totalTokens).toBeGreaterThanOrEqual(0);
    });
  });

  describe("response parsing patterns", () => {
    it("parses RESOLVED verdict", () => {
      const fixture = JSON.parse(readFileSync(join(FIXTURES_DIR, "review-issue-resolved.json"), "utf8"));
      expect(fixture.data.content.toUpperCase().startsWith("RESOLVED")).toBe(true);
    });

    it("parses OPEN verdict", () => {
      const fixture = JSON.parse(readFileSync(join(FIXTURES_DIR, "review-issue-open.json"), "utf8"));
      expect(fixture.data.content.toUpperCase().startsWith("OPEN")).toBe(true);
    });

    it("parses ACTION:nop from discussion response", () => {
      const fixture = JSON.parse(readFileSync(join(FIXTURES_DIR, "discussions-action-nop.json"), "utf8"));
      const actionMatch = fixture.data.content.match(/\[ACTION:(\S+?)\](.+)?/);
      expect(actionMatch).toBeTruthy();
      expect(actionMatch[1]).toBe("nop");
    });

    it("parses ACTION:create-feature with argument", () => {
      const fixture = JSON.parse(readFileSync(join(FIXTURES_DIR, "discussions-action-create-feature.json"), "utf8"));
      const actionMatch = fixture.data.content.match(/\[ACTION:(\S+?)\](.+)?/);
      expect(actionMatch).toBeTruthy();
      expect(actionMatch[1]).toBe("create-feature");
      expect(actionMatch[2].trim()).toBe("HTTP_SERVER");
    });

    it("handles empty response content", () => {
      const fixture = JSON.parse(readFileSync(join(FIXTURES_DIR, "empty-response.json"), "utf8"));
      expect(fixture.data.content).toBe("");
    });

    it("extracts code blocks from response", () => {
      const fixture = JSON.parse(readFileSync(join(FIXTURES_DIR, "resolve-issue-success.json"), "utf8"));
      const codeBlockMatch = fixture.data.content.match(/```(\w+)\n([\s\S]*?)```/);
      expect(codeBlockMatch).toBeTruthy();
      expect(codeBlockMatch[1]).toBe("javascript");
    });
  });
});

describe("golden prompt fixtures", () => {
  const goldenFiles = readdirSync(GOLDEN_DIR).filter((f) => f.endsWith(".json"));

  it("has golden prompt files for all 8 tasks", () => {
    expect(goldenFiles).toHaveLength(8);
  });

  describe.each(goldenFiles)("%s", (filename) => {
    const golden = JSON.parse(readFileSync(join(GOLDEN_DIR, filename), "utf8"));

    it("has a systemMessage field", () => {
      expect(typeof golden.systemMessage).toBe("string");
      expect(golden.systemMessage.length).toBeGreaterThan(0);
    });

    it("has promptSections array", () => {
      expect(Array.isArray(golden.promptSections)).toBe(true);
      expect(golden.promptSections.length).toBeGreaterThan(0);
    });

    it("all prompt sections start with ##", () => {
      for (const section of golden.promptSections) {
        expect(section.startsWith("##")).toBe(true);
      }
    });

    it("system message does not contain secrets or tokens", () => {
      const forbidden = ["GITHUB_TOKEN", "API_KEY", "SECRET", "PASSWORD", "ghp_", "ghu_"];
      for (const term of forbidden) {
        expect(golden.systemMessage).not.toContain(term);
      }
    });
  });
});
