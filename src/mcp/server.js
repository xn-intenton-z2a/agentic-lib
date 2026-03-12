#!/usr/bin/env node
// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// src/mcp/server.js — MCP server for agentic-lib
//
// Exposes agentic-lib capabilities as MCP tools for Claude Code and other MCP clients.
// Usage: npx @xn-intenton-z2a/agentic-lib mcp

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";
import { tmpdir, homedir } from "os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(__dirname, "../..");
const binPath = resolve(pkgRoot, "bin/agentic-lib.js");
const seedsDir = resolve(pkgRoot, "src/seeds/missions");

// Workspace base directory
const workspacesBase =
  process.env.AGENTIC_LIB_WORKSPACES || join(homedir(), ".agentic-lib", "workspaces");

// ─── Workspace Helpers ──────────────────────────────────────────────

function ensureWorkspacesDir() {
  if (!existsSync(workspacesBase)) {
    mkdirSync(workspacesBase, { recursive: true });
  }
}

function workspacePath(id) {
  return join(workspacesBase, id);
}

function metadataPath(wsPath) {
  return join(wsPath, ".agentic-lib-workspace.json");
}

function readMetadata(wsPath) {
  const mp = metadataPath(wsPath);
  if (!existsSync(mp)) return null;
  return JSON.parse(readFileSync(mp, "utf8"));
}

function writeMetadata(wsPath, metadata) {
  writeFileSync(metadataPath(wsPath), JSON.stringify(metadata, null, 2));
}

function listWorkspaces() {
  ensureWorkspacesDir();
  const entries = readdirSync(workspacesBase, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => {
      const wsPath = workspacePath(e.name);
      const meta = readMetadata(wsPath);
      return meta || { id: e.name, status: "unknown" };
    })
    .filter((m) => m.status !== "unknown");
}

function runCli(args, wsPath, timeoutMs = 300000) {
  const cmd = `node ${binPath} ${args}`;
  try {
    const stdout = execSync(cmd, {
      cwd: wsPath || pkgRoot,
      encoding: "utf8",
      timeout: timeoutMs,
      env: { ...process.env },
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { success: true, output: stdout };
  } catch (err) {
    return {
      success: false,
      output: `STDOUT:\n${err.stdout || ""}\nSTDERR:\n${err.stderr || ""}`,
      exitCode: err.status || 1,
    };
  }
}

function runInWorkspace(command, wsPath, timeoutMs = 120000) {
  try {
    const stdout = execSync(command, {
      cwd: wsPath,
      encoding: "utf8",
      timeout: timeoutMs,
      env: { ...process.env },
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { success: true, output: stdout, exitCode: 0 };
  } catch (err) {
    return {
      success: false,
      output: `STDOUT:\n${err.stdout || ""}\nSTDERR:\n${err.stderr || ""}`,
      exitCode: err.status || 1,
    };
  }
}

// ─── Tool Definitions ───────────────────────────────────────────────

const TOOLS = [
  {
    name: "list_missions",
    description:
      "List available mission seeds that can be used to create workspaces. Each mission is a MISSION.md template describing what the autonomous code should build.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "workspace_create",
    description:
      "Create a new workspace from a mission seed. Runs init --purge, npm install, and sets up the Copilot SDK. Returns the workspace ID and path.",
    inputSchema: {
      type: "object",
      properties: {
        mission: {
          type: "string",
          description: "Mission seed name (e.g. '6-kyu-understand-hamming-distance', '7-kyu-understand-fizz-buzz')",
        },
        profile: {
          type: "string",
          enum: ["min", "recommended", "max"],
          description: "Tuning profile: min (fast/cheap), recommended (balanced), max (thorough). Default: min",
        },
        model: {
          type: "string",
          description: "LLM model override (e.g. 'gpt-5-mini', 'claude-sonnet-4'). Uses profile default if omitted.",
        },
      },
      required: ["mission"],
    },
  },
  {
    name: "workspace_list",
    description: "List all active workspaces with their current status, mission, profile, and iteration count.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "workspace_status",
    description:
      "Get detailed status of a workspace: mission content, features, test results, iteration history, and current configuration.",
    inputSchema: {
      type: "object",
      properties: {
        workspace: { type: "string", description: "Workspace ID" },
      },
      required: ["workspace"],
    },
  },
  {
    name: "workspace_destroy",
    description: "Delete a workspace and all its contents.",
    inputSchema: {
      type: "object",
      properties: {
        workspace: { type: "string", description: "Workspace ID" },
      },
      required: ["workspace"],
    },
  },
  {
    name: "iterate",
    description:
      "Run N cycles of the autonomous development loop (maintain-features -> transform -> test -> fix-code). Stops early if tests pass for 2 consecutive iterations or if no files change for 2 consecutive iterations. Returns iteration-by-iteration results.",
    inputSchema: {
      type: "object",
      properties: {
        workspace: { type: "string", description: "Workspace ID" },
        cycles: {
          type: "number",
          description: "Maximum number of iterations to run. Default: 3",
        },
        steps: {
          type: "array",
          items: { type: "string", enum: ["maintain-features", "transform", "fix-code"] },
          description:
            "Which steps to run per cycle. Default: ['maintain-features', 'transform', 'fix-code']. Use ['transform'] for transform-only cycles.",
        },
      },
      required: ["workspace"],
    },
  },
  {
    name: "run_tests",
    description: "Run tests in a workspace and return pass/fail status with output.",
    inputSchema: {
      type: "object",
      properties: {
        workspace: { type: "string", description: "Workspace ID" },
      },
      required: ["workspace"],
    },
  },
  {
    name: "config_get",
    description: "Read the agentic-lib.toml configuration from a workspace.",
    inputSchema: {
      type: "object",
      properties: {
        workspace: { type: "string", description: "Workspace ID" },
      },
      required: ["workspace"],
    },
  },
  {
    name: "config_set",
    description:
      "Update configuration in a workspace. Can change the tuning profile, model, or individual tuning knobs. Changes take effect on the next iteration.",
    inputSchema: {
      type: "object",
      properties: {
        workspace: { type: "string", description: "Workspace ID" },
        profile: {
          type: "string",
          enum: ["min", "recommended", "max"],
          description: "Tuning profile to switch to",
        },
        model: {
          type: "string",
          description: "LLM model to use (e.g. 'gpt-5-mini', 'claude-sonnet-4', 'gpt-4.1')",
        },
        overrides: {
          type: "object",
          description:
            "Individual tuning knob overrides. Keys: reasoning-effort, infinite-sessions, max-feature-files, max-source-files, max-source-chars, max-issues, max-summary-chars, max-discussion-comments",
        },
      },
      required: ["workspace"],
    },
  },
  {
    name: "prepare_iteration",
    description:
      "Gather full context for a workspace iteration: mission, features, source code, test results, and transformation instructions. Use this when YOU (Claude/the MCP client) are the LLM — read the returned context, write code via workspace_write_file, then verify with run_tests. No Copilot token needed.",
    inputSchema: {
      type: "object",
      properties: {
        workspace: { type: "string", description: "Workspace ID" },
        focus: {
          type: "string",
          enum: ["transform", "maintain-features", "fix-code"],
          description: "What kind of iteration to prepare context for. Default: transform",
        },
      },
      required: ["workspace"],
    },
  },
  {
    name: "workspace_read_file",
    description: "Read a file from a workspace. Use with prepare_iteration when Claude is the LLM.",
    inputSchema: {
      type: "object",
      properties: {
        workspace: { type: "string", description: "Workspace ID" },
        path: { type: "string", description: "Relative path within the workspace (e.g. 'src/lib/main.js')" },
      },
      required: ["workspace", "path"],
    },
  },
  {
    name: "workspace_write_file",
    description:
      "Write a file to a workspace. Parent directories are created automatically. Use with prepare_iteration when Claude is the LLM.",
    inputSchema: {
      type: "object",
      properties: {
        workspace: { type: "string", description: "Workspace ID" },
        path: { type: "string", description: "Relative path within the workspace (e.g. 'src/lib/main.js')" },
        content: { type: "string", description: "File content to write" },
      },
      required: ["workspace", "path", "content"],
    },
  },
  {
    name: "workspace_exec",
    description:
      "Run a shell command in a workspace. Use for builds, custom test commands, or inspecting workspace state. Git write commands are blocked.",
    inputSchema: {
      type: "object",
      properties: {
        workspace: { type: "string", description: "Workspace ID" },
        command: { type: "string", description: "Shell command to execute" },
      },
      required: ["workspace", "command"],
    },
  },
];

// ─── Tool Handlers ──────────────────────────────────────────────────

async function handleListMissions() {
  if (!existsSync(seedsDir)) {
    return text("No missions directory found.");
  }
  const missions = readdirSync(seedsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const name = f.replace(/\.md$/, "");
      const content = readFileSync(join(seedsDir, f), "utf8");
      const firstLine = content.split("\n").find((l) => l.trim()) || "";
      return `- **${name}**: ${firstLine.replace(/^#\s*/, "")}`;
    });
  return text(`Available missions (${missions.length}):\n\n${missions.join("\n")}`);
}

async function handleWorkspaceCreate({ mission, profile = "min", model }) {
  // Validate mission exists
  const missionFile = join(seedsDir, `${mission}.md`);
  if (!existsSync(missionFile)) {
    const available = readdirSync(seedsDir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""));
    return text(`Unknown mission "${mission}". Available: ${available.join(", ")}`);
  }

  // Create workspace
  ensureWorkspacesDir();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "").substring(0, 15);
  const id = `${mission}-${timestamp}`;
  const wsPath = workspacePath(id);
  mkdirSync(wsPath, { recursive: true });

  // Initialize git repo (required for init)
  runInWorkspace("git init", wsPath);

  // Run init --purge
  const initResult = runCli(`init --purge --mission ${mission} --target ${wsPath}`, wsPath);
  if (!initResult.success) {
    return text(`Failed to initialize workspace:\n${initResult.output}`);
  }

  // Update config with profile and model
  const tomlPath = join(wsPath, "agentic-lib.toml");
  if (existsSync(tomlPath)) {
    let toml = readFileSync(tomlPath, "utf8");
    toml = toml.replace(/^profile\s*=\s*"[^"]*"/m, `profile = "${profile}"`);
    if (model) {
      toml = toml.replace(/^model\s*=\s*"[^"]*"/m, `model = "${model}"`);
    }
    writeFileSync(tomlPath, toml);
  }

  // npm install
  const npmResult = runInWorkspace("npm install --ignore-scripts 2>&1", wsPath, 120000);

  // Install Copilot SDK in action dir
  const actionDir = join(wsPath, ".github/agentic-lib/actions/agentic-step");
  let sdkResult = { success: true, output: "skipped" };
  if (existsSync(join(actionDir, "package.json"))) {
    sdkResult = runInWorkspace(`cd "${actionDir}" && npm ci 2>&1`, wsPath, 120000);
  }

  // Write metadata
  const metadata = {
    id,
    mission,
    created: new Date().toISOString(),
    profile,
    model: model || profileDefaultModel(profile),
    iterations: [],
    status: "ready",
    path: wsPath,
  };
  writeMetadata(wsPath, metadata);

  const summary = [
    `Workspace created: **${id}**`,
    `Path: ${wsPath}`,
    `Mission: ${mission}`,
    `Profile: ${profile}`,
    `Model: ${metadata.model}`,
    "",
    `Init: ${initResult.success ? "OK" : "FAILED"}`,
    `npm install: ${npmResult.success ? "OK" : "FAILED"}`,
    `Copilot SDK: ${sdkResult.success ? "OK" : "FAILED"}`,
    "",
    "Ready for `iterate` or `run_tests`.",
  ];
  return text(summary.join("\n"));
}

async function handleWorkspaceList() {
  const workspaces = listWorkspaces();
  if (workspaces.length === 0) {
    return text("No workspaces found. Use `workspace_create` to create one.");
  }
  const lines = workspaces.map((w) => {
    const iters = w.iterations?.length || 0;
    return `- **${w.id}** | mission: ${w.mission} | profile: ${w.profile} | model: ${w.model} | iterations: ${iters} | status: ${w.status}`;
  });
  return text(`Workspaces (${workspaces.length}):\n\n${lines.join("\n")}`);
}

async function handleWorkspaceStatus({ workspace }) {
  const wsPath = workspacePath(workspace);
  const meta = readMetadata(wsPath);
  if (!meta) {
    return text(`Workspace "${workspace}" not found.`);
  }

  const sections = [`# Workspace: ${meta.id}`, ""];

  // Mission
  const missionPath = join(wsPath, "MISSION.md");
  if (existsSync(missionPath)) {
    const mission = readFileSync(missionPath, "utf8");
    sections.push("## Mission", mission.substring(0, 1000), "");
  }

  // Config
  sections.push("## Configuration");
  sections.push(`- Profile: ${meta.profile}`);
  sections.push(`- Model: ${meta.model}`);
  sections.push(`- Status: ${meta.status}`);
  sections.push("");

  // Features
  const featuresDir = join(wsPath, "features");
  if (existsSync(featuresDir)) {
    const features = readdirSync(featuresDir).filter((f) => f.endsWith(".md"));
    sections.push(`## Features (${features.length})`);
    for (const f of features.slice(0, 10)) {
      const content = readFileSync(join(featuresDir, f), "utf8");
      sections.push(`### ${f}`, content.substring(0, 300), "");
    }
  }

  // Source files
  const srcDir = join(wsPath, "src/lib");
  if (existsSync(srcDir)) {
    const srcFiles = readdirSync(srcDir, { recursive: true }).filter((f) =>
      String(f).match(/\.(js|ts)$/),
    );
    sections.push(`## Source files (${srcFiles.length})`);
    for (const f of srcFiles.slice(0, 5)) {
      const content = readFileSync(join(srcDir, String(f)), "utf8");
      sections.push(`### ${f}`, "```js", content.substring(0, 2000), "```", "");
    }
  }

  // Iteration history
  if (meta.iterations && meta.iterations.length > 0) {
    sections.push(`## Iteration History (${meta.iterations.length} cycles)`);
    for (const iter of meta.iterations) {
      sections.push(
        `### Iteration ${iter.number} (${iter.profile}/${iter.model})`,
        `- Steps: ${iter.steps?.map((s) => `${s.step}: ${s.success ? "OK" : "FAIL"}`).join(", ") || "none"}`,
        `- Tests: ${iter.testsPassed ? "PASS" : "FAIL"}`,
        `- Elapsed: ${iter.elapsed || "?"}s`,
        "",
      );
    }
  }

  // Run tests for current status
  const testResult = runInWorkspace("npm test 2>&1", wsPath, 60000);
  sections.push("## Current Test Status");
  sections.push(testResult.success ? "All tests passing." : "Tests failing.");
  sections.push("```", testResult.output.substring(0, 2000), "```");

  return text(sections.join("\n"));
}

async function handleWorkspaceDestroy({ workspace }) {
  const wsPath = workspacePath(workspace);
  if (!existsSync(wsPath)) {
    return text(`Workspace "${workspace}" not found.`);
  }
  rmSync(wsPath, { recursive: true, force: true });
  return text(`Workspace "${workspace}" destroyed.`);
}

async function handleIterate({ workspace, cycles = 3, steps }) {
  const wsPath = workspacePath(workspace);
  const meta = readMetadata(wsPath);
  if (!meta) {
    return text(`Workspace "${workspace}" not found.`);
  }

  const { runHybridSession } = await import("../copilot/hybrid-session.js");

  let config;
  try {
    const { loadConfig } = await import("../copilot/config.js");
    config = loadConfig(join(wsPath, "agentic-lib.toml"));
  } catch {
    config = { tuning: {}, model: meta.model || "gpt-5-mini" };
  }

  meta.status = "iterating";
  writeMetadata(wsPath, meta);

  const result = await runHybridSession({
    workspacePath: wsPath,
    model: meta.model || config.model || "gpt-5-mini",
    tuning: config.tuning || {},
    timeoutMs: 600000,
  });

  const iterNum = (meta.iterations?.length || 0) + 1;
  meta.iterations.push({
    number: iterNum,
    profile: meta.profile,
    model: meta.model,
    testsPassed: result.testsPassed,
    toolCalls: result.toolCalls,
    testRuns: result.testRuns,
    filesWritten: result.filesWritten,
    elapsed: `${result.totalTime}`,
    endReason: result.endReason,
  });
  meta.status = "ready";
  writeMetadata(wsPath, meta);

  const lines = [
    `# Iterate: ${workspace}`,
    "",
    `- Success: ${result.success}`,
    `- Tests passed: ${result.testsPassed}`,
    `- Session time: ${result.sessionTime}s`,
    `- Total time: ${result.totalTime}s`,
    `- Tool calls: ${result.toolCalls}`,
    `- Test runs: ${result.testRuns}`,
    `- Files written: ${result.filesWritten}`,
    `- Tokens: ${result.tokensIn + result.tokensOut} (in=${result.tokensIn} out=${result.tokensOut})`,
    `- End reason: ${result.endReason}`,
    "",
    `- Total iterations for this workspace: ${meta.iterations.length}`,
    `- Profile: ${meta.profile} | Model: ${meta.model}`,
  ];
  return text(lines.join("\n"));
}

async function handleRunTests({ workspace }) {
  const wsPath = workspacePath(workspace);
  if (!readMetadata(wsPath)) {
    return text(`Workspace "${workspace}" not found.`);
  }
  const result = runInWorkspace("npm test 2>&1", wsPath, 120000);
  return text(
    [
      `## Test Results: ${workspace}`,
      "",
      result.success ? "**PASS** — all tests passing." : "**FAIL** — tests are failing.",
      "",
      "```",
      result.output.substring(0, 5000),
      "```",
    ].join("\n"),
  );
}

async function handleConfigGet({ workspace }) {
  const wsPath = workspacePath(workspace);
  if (!readMetadata(wsPath)) {
    return text(`Workspace "${workspace}" not found.`);
  }
  const tomlPath = join(wsPath, "agentic-lib.toml");
  if (!existsSync(tomlPath)) {
    return text("No agentic-lib.toml found in workspace.");
  }
  const content = readFileSync(tomlPath, "utf8");
  return text(`## Configuration: ${workspace}\n\n\`\`\`toml\n${content}\n\`\`\``);
}

async function handleConfigSet({ workspace, profile, model, overrides }) {
  const wsPath = workspacePath(workspace);
  const meta = readMetadata(wsPath);
  if (!meta) {
    return text(`Workspace "${workspace}" not found.`);
  }

  const tomlPath = join(wsPath, "agentic-lib.toml");
  if (!existsSync(tomlPath)) {
    return text("No agentic-lib.toml found in workspace.");
  }

  let toml = readFileSync(tomlPath, "utf8");
  const changes = [];

  if (profile) {
    toml = toml.replace(/^profile\s*=\s*"[^"]*"/m, `profile = "${profile}"`);
    meta.profile = profile;
    if (!model) {
      meta.model = profileDefaultModel(profile);
    }
    changes.push(`profile -> ${profile}`);
  }

  if (model) {
    toml = toml.replace(/^model\s*=\s*"[^"]*"/m, `model = "${model}"`);
    meta.model = model;
    changes.push(`model -> ${model}`);
  }

  if (overrides) {
    for (const [key, value] of Object.entries(overrides)) {
      const regex = new RegExp(`^${key}\\s*=\\s*.*$`, "m");
      const line = typeof value === "string" ? `${key} = "${value}"` : `${key} = ${value}`;
      if (regex.test(toml)) {
        toml = toml.replace(regex, line);
      } else {
        // Add under [tuning] section
        toml = toml.replace(/^\[tuning\]/m, `[tuning]\n${line}`);
      }
      changes.push(`${key} -> ${value}`);
    }
  }

  writeFileSync(tomlPath, toml);
  writeMetadata(wsPath, meta);

  return text(`Configuration updated for ${workspace}:\n${changes.map((c) => `- ${c}`).join("\n")}`);
}

async function handlePrepareIteration({ workspace, focus = "transform" }) {
  const wsPath = workspacePath(workspace);
  const meta = readMetadata(wsPath);
  if (!meta) {
    return text(`Workspace "${workspace}" not found.`);
  }

  const sections = [];
  const iterNum = (meta.iterations?.length || 0) + 1;

  sections.push(`# Iteration ${iterNum} — ${focus}`);
  sections.push(`Workspace: ${meta.id} | Profile: ${meta.profile}`);
  sections.push("");

  // Mission
  const missionFile = join(wsPath, "MISSION.md");
  if (existsSync(missionFile)) {
    sections.push("## Mission", readFileSync(missionFile, "utf8"), "");
  }

  // Features
  const featuresDir = join(wsPath, "features");
  if (existsSync(featuresDir)) {
    const features = readdirSync(featuresDir).filter((f) => f.endsWith(".md"));
    if (features.length > 0) {
      sections.push(`## Features (${features.length})`);
      for (const f of features.slice(0, 10)) {
        sections.push(`### ${f}`, readFileSync(join(featuresDir, f), "utf8"), "");
      }
    }
  }

  // Source files
  const srcDir = join(wsPath, "src/lib");
  if (existsSync(srcDir)) {
    const srcFiles = readdirSync(srcDir, { recursive: true })
      .filter((f) => String(f).match(/\.(js|ts)$/))
      .slice(0, 20);
    sections.push(`## Source Files (${srcFiles.length})`);
    for (const f of srcFiles) {
      const content = readFileSync(join(srcDir, String(f)), "utf8");
      sections.push(`### src/lib/${f}`, "```js", content.substring(0, 5000), "```", "");
    }
  }

  // Test files
  const testsDir = join(wsPath, "tests/unit");
  if (existsSync(testsDir)) {
    const testFiles = readdirSync(testsDir, { recursive: true })
      .filter((f) => String(f).match(/\.(js|ts)$/))
      .slice(0, 10);
    sections.push(`## Test Files (${testFiles.length})`);
    for (const f of testFiles) {
      const content = readFileSync(join(testsDir, String(f)), "utf8");
      sections.push(`### tests/unit/${f}`, "```js", content.substring(0, 3000), "```", "");
    }
  }

  // Current test results
  const testResult = runInWorkspace("npm test 2>&1", wsPath, 60000);
  sections.push("## Current Test Results");
  sections.push(testResult.success ? "**All tests passing.**" : "**Tests failing.**");
  sections.push("```", testResult.output.substring(0, 3000), "```", "");

  // Instructions based on focus
  sections.push("## Your Task");
  if (focus === "transform") {
    sections.push(
      "Analyze the mission, features, and source code above.",
      "Determine the single most impactful next step to advance the code toward the mission.",
      "Then implement it by calling `workspace_write_file` to modify source files.",
      "After writing, call `run_tests` to verify your changes.",
    );
  } else if (focus === "maintain-features") {
    sections.push(
      "Review the mission and current features.",
      "Create, update, or prune feature files to keep the project focused on its mission.",
      "Use `workspace_write_file` to write feature files to `features/<name>.md`.",
      "Each feature should have clear, testable acceptance criteria.",
    );
  } else if (focus === "fix-code") {
    sections.push(
      "The test output above shows failing tests.",
      "Analyze the failures and fix the source code.",
      "Make minimal, targeted changes using `workspace_write_file`.",
      "Then call `run_tests` to verify the fix.",
    );
  }
  sections.push("");
  sections.push("## Writable Paths");
  sections.push("- src/lib/ (source code)");
  sections.push("- tests/unit/ (test files)");
  sections.push("- features/ (feature specs)");
  sections.push("- examples/ (output artifacts)");
  sections.push("- README.md, package.json");

  return text(sections.join("\n"));
}

async function handleWorkspaceReadFile({ workspace, path }) {
  const wsPath = workspacePath(workspace);
  if (!readMetadata(wsPath)) {
    return text(`Workspace "${workspace}" not found.`);
  }
  const filePath = resolve(wsPath, path);
  // Prevent path traversal
  if (!filePath.startsWith(wsPath)) {
    return text(`Path traversal not allowed: ${path}`);
  }
  if (!existsSync(filePath)) {
    return text(`File not found: ${path}`);
  }
  const content = readFileSync(filePath, "utf8");
  return text(`## ${path}\n\n\`\`\`\n${content}\n\`\`\``);
}

async function handleWorkspaceWriteFile({ workspace, path, content }) {
  const wsPath = workspacePath(workspace);
  if (!readMetadata(wsPath)) {
    return text(`Workspace "${workspace}" not found.`);
  }
  const filePath = resolve(wsPath, path);
  if (!filePath.startsWith(wsPath)) {
    return text(`Path traversal not allowed: ${path}`);
  }
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(filePath, content, "utf8");
  return text(`Written ${content.length} chars to ${path}`);
}

async function handleWorkspaceExec({ workspace, command }) {
  const wsPath = workspacePath(workspace);
  if (!readMetadata(wsPath)) {
    return text(`Workspace "${workspace}" not found.`);
  }
  // Block git write commands
  const blocked = /\bgit\s+(commit|push|add|reset|checkout|rebase|merge|stash)\b/;
  if (blocked.test(command)) {
    return text(`Git write commands are not allowed: ${command}`);
  }
  const result = runInWorkspace(command, wsPath, 120000);
  return text(
    [
      `## exec: ${command}`,
      `Exit code: ${result.exitCode || 0}`,
      "```",
      result.output.substring(0, 5000),
      "```",
    ].join("\n"),
  );
}

// ─── Helpers ────────────────────────────────────────────────────────

function text(content) {
  return { content: [{ type: "text", text: content }] };
}

function profileDefaultModel(profile) {
  const models = { min: "gpt-5-mini", recommended: "claude-sonnet-4", max: "gpt-4.1" };
  return models[profile] || "gpt-5-mini";
}

// ─── MCP Server ─────────────────────────────────────────────────────

const toolHandlers = {
  list_missions: handleListMissions,
  workspace_create: handleWorkspaceCreate,
  workspace_list: handleWorkspaceList,
  workspace_status: handleWorkspaceStatus,
  workspace_destroy: handleWorkspaceDestroy,
  iterate: handleIterate,
  run_tests: handleRunTests,
  config_get: handleConfigGet,
  config_set: handleConfigSet,
  prepare_iteration: handlePrepareIteration,
  workspace_read_file: handleWorkspaceReadFile,
  workspace_write_file: handleWorkspaceWriteFile,
  workspace_exec: handleWorkspaceExec,
};

export async function startServer() {
  const pkg = JSON.parse(readFileSync(join(pkgRoot, "package.json"), "utf8"));

  const server = new Server(
    { name: "agentic-lib", version: pkg.version },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const handler = toolHandlers[name];
    if (!handler) {
      return text(`Unknown tool: ${name}`);
    }
    try {
      return await handler(args || {});
    } catch (err) {
      return text(`Error in ${name}: ${err.message}\n${err.stack || ""}`);
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
