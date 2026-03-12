// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
//
// Phase 3c: Verify every Action task has a CLI equivalent that produces
// a comparable prompt via buildUserPrompt + the correct agent.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

// Mock child_process.execSync to avoid running real commands
vi.mock("child_process", () => ({
  execSync: vi.fn(() => "mock test output"),
}));

// Mock telemetry to avoid filesystem reads for cumulative cost
vi.mock("../../src/copilot/telemetry.js", () => ({
  readCumulativeCost: vi.fn(() => 0),
}));

const { gatherLocalContext, buildUserPrompt } = await import("../../src/copilot/context.js");
const { loadAgentPrompt, listAgents } = await import("../../src/copilot/agents.js");

// The mapping from Action tasks → CLI agent names
const TASK_AGENT_MAP = {
  transform: "agent-issue-resolution",
  "fix-code": "agent-apply-fix",
  "maintain-features": "agent-maintain-features",
  "maintain-library": "agent-maintain-library",
  "resolve-issue": "agent-issue-resolution",
  "enhance-issue": "agent-ready-issue",
  "review-issue": "agent-review-issue",
  discussions: "agent-discussion-bot",
  supervise: "agent-supervisor",
  direct: "agent-director",
};

describe("Agent ↔ Context Mapping (Phase 3c)", () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "mapping-test-"));
    writeFileSync(join(tmpDir, "MISSION.md"), "# Test Mission\nDo something useful.");
    mkdirSync(join(tmpDir, "src/lib"), { recursive: true });
    writeFileSync(join(tmpDir, "src/lib/main.js"), "export function hello() { return 'hello'; }");
    mkdirSync(join(tmpDir, "tests"), { recursive: true });
    writeFileSync(join(tmpDir, "tests/main.test.js"), "test('works', () => {});");
    mkdirSync(join(tmpDir, "features"), { recursive: true });
    writeFileSync(join(tmpDir, "features/feature-1.md"), "# Feature 1\n- [x] Done\n- [ ] TODO");
    mkdirSync(join(tmpDir, "library"), { recursive: true });
    writeFileSync(join(tmpDir, "library/doc.md"), "# Library Doc\nSome content.");
    writeFileSync(join(tmpDir, "SOURCES.md"), "# Sources\nhttps://example.com");
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it("all 10 Action tasks have agent entries", () => {
    expect(Object.keys(TASK_AGENT_MAP)).toHaveLength(10);
  });

  it("all mapped agents exist as loadable prompt files", () => {
    const uniqueAgents = [...new Set(Object.values(TASK_AGENT_MAP))];
    for (const agentName of uniqueAgents) {
      expect(() => loadAgentPrompt(agentName)).not.toThrow();
    }
  });

  it("all mapped agents are in the listAgents() output", () => {
    const allAgents = listAgents();
    const uniqueAgents = [...new Set(Object.values(TASK_AGENT_MAP))];
    for (const agentName of uniqueAgents) {
      expect(allAgents).toContain(agentName);
    }
  });

  // transform → agent-issue-resolution: mission, source, tests, features, issues
  it("transform → agent-issue-resolution: includes mission + source + tests + features", () => {
    const config = {
      paths: { source: { path: "src/lib/" }, tests: { path: "tests/" }, features: { path: "features/" } },
      tuning: {},
      writablePaths: [],
      readOnlyPaths: [],
    };
    const ctx = gatherLocalContext(tmpDir, config);
    const { prompt } = buildUserPrompt("agent-issue-resolution", ctx);
    expect(prompt).toContain("# Mission");
    expect(prompt).toContain("# Source Files");
    expect(prompt).toContain("# Test Files");
    expect(prompt).toContain("# Features");
  });

  // fix-code → agent-apply-fix: source, tests
  it("fix-code → agent-apply-fix: includes source + tests, no mission", () => {
    const config = {
      paths: { source: { path: "src/lib/" }, tests: { path: "tests/" } },
      tuning: {},
      writablePaths: [],
      readOnlyPaths: [],
    };
    const ctx = gatherLocalContext(tmpDir, config);
    const { prompt } = buildUserPrompt("agent-apply-fix", ctx);
    expect(prompt).toContain("# Source Files");
    expect(prompt).toContain("# Test Files");
    expect(prompt).not.toContain("# Mission");
  });

  // fix-code + PR → agent-apply-fix: source, tests, PR detail
  it("fix-code + PR → agent-apply-fix: includes PR detail when provided", () => {
    const config = {
      paths: { source: { path: "src/lib/" }, tests: { path: "tests/" } },
      tuning: {},
      writablePaths: [],
      readOnlyPaths: [],
    };
    const ctx = gatherLocalContext(tmpDir, config);
    const github = {
      issues: [],
      prDetail: { number: 123, title: "Fix tests", body: "PR body", files: [{ path: "src/main.js" }] },
    };
    const { prompt } = buildUserPrompt("agent-apply-fix", ctx, github);
    expect(prompt).toContain("# PR #123: Fix tests");
    expect(prompt).toContain("src/main.js");
  });

  // maintain-features → agent-maintain-features: mission, features, issues
  it("maintain-features → agent-maintain-features: includes mission + features", () => {
    const config = {
      paths: { features: { path: "features/" } },
      tuning: {},
      writablePaths: [],
      readOnlyPaths: [],
    };
    const ctx = gatherLocalContext(tmpDir, config);
    const { prompt } = buildUserPrompt("agent-maintain-features", ctx);
    expect(prompt).toContain("# Mission");
    expect(prompt).toContain("# Features");
    expect(prompt).not.toContain("# Source Files");
  });

  // maintain-library → agent-maintain-library: library, sources
  it("maintain-library → agent-maintain-library: includes library + sources, no source scan", () => {
    const config = {
      paths: { library: { path: "library/" }, librarySources: { path: "SOURCES.md" } },
      tuning: {},
      writablePaths: [],
      readOnlyPaths: [],
    };
    const ctx = gatherLocalContext(tmpDir, config);
    const { prompt } = buildUserPrompt("agent-maintain-library", ctx);
    expect(prompt).toContain("# Library Files");
    expect(prompt).toContain("# Sources");
    expect(prompt).not.toContain("# Source Files");
    expect(prompt).not.toContain("# Mission");
  });

  // resolve-issue → agent-issue-resolution + issue detail
  it("resolve-issue → agent-issue-resolution + --issue: includes issue detail", () => {
    const config = {
      paths: { source: { path: "src/lib/" }, tests: { path: "tests/" }, features: { path: "features/" } },
      tuning: {},
      writablePaths: [],
      readOnlyPaths: [],
    };
    const ctx = gatherLocalContext(tmpDir, config);
    const github = {
      issues: [{ number: 42, title: "Fix bug", body: "broken", labels: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() }],
      issueDetail: { number: 42, title: "Fix bug", body: "Details here", comments: [] },
    };
    const { prompt } = buildUserPrompt("agent-issue-resolution", ctx, github);
    expect(prompt).toContain("# Target Issue #42: Fix bug");
    expect(prompt).toContain("Details here");
  });

  // enhance-issue → agent-ready-issue: mission, features, issues
  it("enhance-issue → agent-ready-issue: includes mission + features", () => {
    const config = {
      paths: { features: { path: "features/" } },
      tuning: {},
      writablePaths: [],
      readOnlyPaths: [],
    };
    const ctx = gatherLocalContext(tmpDir, config);
    const github = {
      issues: [{ number: 10, title: "Enhancement", body: "details", labels: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() }],
      issueDetail: { number: 10, title: "Enhancement", body: "Enhance this", comments: [] },
    };
    const { prompt } = buildUserPrompt("agent-ready-issue", ctx, github);
    expect(prompt).toContain("# Mission");
    expect(prompt).toContain("# Features");
    expect(prompt).toContain("# Issue #10");
  });

  // review-issue → agent-review-issue: source, tests, issues
  it("review-issue → agent-review-issue: includes source + tests + issues", () => {
    const config = {
      paths: { source: { path: "src/lib/" }, tests: { path: "tests/" } },
      tuning: {},
      writablePaths: [],
      readOnlyPaths: [],
    };
    const ctx = gatherLocalContext(tmpDir, config);
    const github = {
      issues: [{ number: 5, title: "Review this", body: "review body", labels: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() }],
    };
    const { prompt } = buildUserPrompt("agent-review-issue", ctx, github);
    expect(prompt).toContain("# Source Files");
    expect(prompt).toContain("# Test Files");
    expect(prompt).toContain("# Open Issues");
    expect(prompt).not.toContain("# Mission");
  });

  // discussions → agent-discussion-bot: mission, features
  it("discussions → agent-discussion-bot: includes mission + features", () => {
    const config = {
      paths: { features: { path: "features/" } },
      tuning: {},
      writablePaths: [],
      readOnlyPaths: [],
    };
    const ctx = gatherLocalContext(tmpDir, config);
    const { prompt } = buildUserPrompt("agent-discussion-bot", ctx);
    expect(prompt).toContain("# Mission");
    expect(prompt).toContain("# Features");
    expect(prompt).not.toContain("# Source Files");
  });

  // supervise → agent-supervisor: mission, features, issues
  it("supervise → agent-supervisor: includes mission + features + issues", () => {
    const config = {
      paths: { features: { path: "features/" } },
      tuning: {},
      writablePaths: [],
      readOnlyPaths: [],
    };
    const ctx = gatherLocalContext(tmpDir, config);
    const github = {
      issues: [{ number: 1, title: "Open issue", body: "body", labels: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() }],
    };
    const { prompt } = buildUserPrompt("agent-supervisor", ctx, github);
    expect(prompt).toContain("# Mission");
    expect(prompt).toContain("# Features");
    expect(prompt).toContain("# Open Issues");
  });

  // direct → agent-director: mission, features, issues, source, tests
  it("direct → agent-director: includes mission + features + source + tests + issues", () => {
    const config = {
      paths: { source: { path: "src/lib/" }, tests: { path: "tests/" }, features: { path: "features/" } },
      tuning: {},
      writablePaths: [],
      readOnlyPaths: [],
    };
    const ctx = gatherLocalContext(tmpDir, config);
    const github = {
      issues: [{ number: 99, title: "Director issue", body: "body", labels: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() }],
    };
    const { prompt } = buildUserPrompt("agent-director", ctx, github);
    expect(prompt).toContain("# Mission");
    expect(prompt).toContain("# Source Files");
    expect(prompt).toContain("# Test Files");
    expect(prompt).toContain("# Features");
    expect(prompt).toContain("# Open Issues");
  });

  // buildUserPrompt produces non-empty prompts for all agent/context combos
  it("buildUserPrompt produces non-empty prompts for all 10 agent names", () => {
    const config = {
      paths: {
        source: { path: "src/lib/" },
        tests: { path: "tests/" },
        features: { path: "features/" },
        library: { path: "library/" },
        librarySources: { path: "SOURCES.md" },
      },
      tuning: {},
      writablePaths: [],
      readOnlyPaths: [],
    };
    const ctx = gatherLocalContext(tmpDir, config);
    const uniqueAgents = [...new Set(Object.values(TASK_AGENT_MAP))];
    for (const agentName of uniqueAgents) {
      const { prompt } = buildUserPrompt(agentName, ctx);
      expect(prompt.length).toBeGreaterThan(50);
    }
  });
});
