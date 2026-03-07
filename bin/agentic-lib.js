#!/usr/bin/env node
// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// bin/agentic-lib.js — CLI for @xn-intenton-z2a/agentic-lib
//
// Infrastructure commands:
//   npx @xn-intenton-z2a/agentic-lib init           # set up agentic infrastructure
//   npx @xn-intenton-z2a/agentic-lib init --purge    # also reset source files to seeds
//   npx @xn-intenton-z2a/agentic-lib reset           # alias for init --purge
//
// Task commands (run Copilot SDK transformations locally):
//   npx @xn-intenton-z2a/agentic-lib transform
//   npx @xn-intenton-z2a/agentic-lib maintain-features
//   npx @xn-intenton-z2a/agentic-lib maintain-library
//   npx @xn-intenton-z2a/agentic-lib fix-code

import { copyFileSync, existsSync, mkdirSync, rmSync, rmdirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { applyDistTransform } from "../src/dist-transform.js";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(__dirname, "..");
const srcDir = resolve(pkgRoot, "src");

const args = process.argv.slice(2);
const command = args[0];
const flags = args.slice(1);

let initChanges = 0;
const TASK_COMMANDS = ["transform", "maintain-features", "maintain-library", "fix-code"];
const INIT_COMMANDS = ["init", "update", "reset"];
const ALL_COMMANDS = [...INIT_COMMANDS, ...TASK_COMMANDS, "version", "mcp", "iterate"];

const HELP = `
@xn-intenton-z2a/agentic-lib — Agentic Coding Systems SDK

Infrastructure:
  init                 Update workflows, actions, agents, seeds, scripts
  init --reseed        Also clear features + activity log (keep source code)
  init --purge         Full reset — reseed + replace source files with seeds
  update               Alias for init
  reset                Alias for init --purge
  version              Show version

Tasks (run Copilot SDK transformations):
  transform            Transform code toward the mission
  maintain-features    Generate feature files from mission
  maintain-library     Update library docs from SOURCES.md
  fix-code             Fix failing tests

Iterator:
  iterate              Run N cycles of maintain → transform → fix with budget tracking

MCP Server:
  mcp                  Start MCP server (for Claude Code, Cursor, etc.)

Options:
  --purge              Full reset — clear features, activity log, source code
  --reseed             Clear features + activity log (keep source code)
  --dry-run            Show what would be done without making changes
  --target <path>      Target repository (default: current directory)
  --mission <name>     Mission seed name (default: hamming-distance) [purge only]
  --model <name>       Copilot SDK model (default: claude-sonnet-4)
  --cycles <N>         Max iteration cycles (default: from transformation-budget)
  --steps <list>       Steps per cycle: maintain-features,transform,fix-code

Examples:
  npx @xn-intenton-z2a/agentic-lib init
  npx @xn-intenton-z2a/agentic-lib transform
  npx @xn-intenton-z2a/agentic-lib maintain-features --model gpt-5-mini
  npx @xn-intenton-z2a/agentic-lib reset --dry-run
  npx @xn-intenton-z2a/agentic-lib iterate --mission fizz-buzz --cycles 4
  npx @xn-intenton-z2a/agentic-lib iterate --steps transform,fix-code --cycles 2
`.trim();

if (!command || command === "--help" || command === "-h" || command === "help") {
  console.log(HELP);
  process.exit(0);
}

if (command === "version" || command === "--version" || command === "-v") {
  const pkg = JSON.parse(readFileSync(resolve(pkgRoot, "package.json"), "utf8"));
  console.log(pkg.version);
  process.exit(0);
}

// Parse flags
const dryRun = flags.includes("--dry-run");
const targetIdx = flags.indexOf("--target");
const targetPath = targetIdx >= 0 ? flags[targetIdx + 1] : process.cwd();
const target = resolve(targetPath);
const modelIdx = flags.indexOf("--model");
const model = modelIdx >= 0 ? flags[modelIdx + 1] : "claude-sonnet-4";
const missionIdx = flags.indexOf("--mission");
const mission = missionIdx >= 0 ? flags[missionIdx + 1] : "hamming-distance";
const cyclesIdx = flags.indexOf("--cycles");
const cycles = cyclesIdx >= 0 ? parseInt(flags[cyclesIdx + 1], 10) : 0;
const stepsIdx = flags.indexOf("--steps");
const stepsFlag = stepsIdx >= 0 ? flags[stepsIdx + 1] : "";

// ─── Task Commands ───────────────────────────────────────────────────

if (command === "mcp") {
  const { startServer } = await import("../src/mcp/server.js");
  await startServer();
  // Server runs until stdin closes — don't exit
  await new Promise(() => {}); // block forever
}

if (command === "iterate") {
  process.exit(await runIterate());
}

if (TASK_COMMANDS.includes(command)) {
  process.exit(await runTask(command));
}

// ─── Init Commands ───────────────────────────────────────────────────

let purge = flags.includes("--purge");
let reseed = flags.includes("--reseed") || purge;
if (command === "reset") {
  purge = true;
  reseed = true;
}

if (!ALL_COMMANDS.includes(command)) {
  console.error(`Unknown command: ${command}`);
  console.error("Run with --help for usage.");
  process.exit(1);
}

runInit();

// ─── Iterator ────────────────────────────────────────────────────────

async function runIterate() {
  const { runIterationLoop, formatIterationResults } = await import("../src/iterate.js");

  // If --mission is specified, run init --purge first
  if (missionIdx >= 0) {
    console.log(`\n=== Init with mission: ${mission} ===\n`);
    const initResult = execSync(
      `node ${resolve(pkgRoot, "bin/agentic-lib.js")} init --purge --mission ${mission} --target ${target}`,
      { encoding: "utf8", timeout: 60000, stdio: "inherit" },
    );
  }

  const iterSteps = stepsFlag
    ? stepsFlag.split(",").map((s) => s.trim())
    : ["maintain-features", "transform", "fix-code"];

  console.log("");
  console.log("=== agentic-lib iterate ===");
  console.log(`Target:  ${target}`);
  console.log(`Model:   ${model}`);
  console.log(`Cycles:  ${cycles || "(from budget)"}`);
  console.log(`Steps:   ${iterSteps.join(", ")}`);
  console.log(`Dry-run: ${dryRun}`);
  console.log("");

  const { results, totalCost, budget } = await runIterationLoop({
    targetPath: target,
    model,
    maxCycles: cycles,
    steps: iterSteps,
    dryRun,
    onCycleComplete: (record) => {
      if (record.stopped) return;
      const status = record.testsPassed ? "PASS" : "FAIL";
      console.log(
        `  Cycle ${record.cycle}: ${record.filesChanged} files changed, tests ${status}, cost ${record.totalCost}/${record.budget} (${record.elapsed}s)`,
      );
    },
  });

  console.log("");
  console.log(formatIterationResults(results, totalCost, budget));
  console.log("");

  const lastCycle = results.filter((r) => !r.stopped).slice(-1)[0];
  return lastCycle?.testsPassed ? 0 : 1;
}

// ─── Task Runner ─────────────────────────────────────────────────────

async function runTask(taskName) {
  console.log("");
  console.log(`=== agentic-lib ${taskName} ===`);
  console.log(`Target:  ${target}`);
  console.log(`Model:   ${model}`);
  console.log(`Dry-run: ${dryRun}`);
  console.log("");

  // Find the Copilot SDK
  const sdkLocations = [
    resolve(pkgRoot, "node_modules/@github/copilot-sdk/dist/index.js"),
    resolve(pkgRoot, "src/actions/agentic-step/node_modules/@github/copilot-sdk/dist/index.js"),
    resolve(target, ".github/agentic-lib/actions/agentic-step/node_modules/@github/copilot-sdk/dist/index.js"),
  ];
  const sdkPath = sdkLocations.find((p) => existsSync(p));
  if (!sdkPath) {
    console.error("ERROR: @github/copilot-sdk not found.");
    console.error("Run: cd .github/agentic-lib/actions/agentic-step && npm ci");
    return 1;
  }
  const { CopilotClient, approveAll, defineTool } = await import(sdkPath);

  // Load config
  const config = await loadTaskConfig();
  const writablePaths = getWritablePathsFromConfig(config);
  const readOnlyPaths = getReadOnlyPathsFromConfig(config);

  console.log(`[config] supervisor=${config.supervisor || "daily"}`);
  console.log(`[config] writable=${writablePaths.join(", ")}`);
  console.log(`[config] test=${config.testScript}`);
  console.log("");

  // Build task-specific prompt
  const { systemMessage, prompt } = buildTaskPrompt(taskName, config, writablePaths, readOnlyPaths);

  if (!prompt) {
    return 0; // buildTaskPrompt already logged why
  }

  console.log(`[prompt] ${prompt.length} chars`);
  console.log("");

  if (dryRun) {
    console.log("=== DRY RUN — prompt constructed but not sent ===");
    console.log("");
    console.log(prompt);
    return 0;
  }

  // Create tools
  const tools = createCliTools(writablePaths, defineTool);

  // Set up auth
  const copilotToken = process.env.COPILOT_GITHUB_TOKEN;
  if (!copilotToken) {
    console.error("ERROR: COPILOT_GITHUB_TOKEN is required. Set it in your environment.");
    return 1;
  }
  console.log("[auth] Using COPILOT_GITHUB_TOKEN");
  const clientOptions = {};
  const env = { ...process.env };
  env.GITHUB_TOKEN = copilotToken;
  env.GH_TOKEN = copilotToken;
  clientOptions.env = env;

  const client = new CopilotClient(clientOptions);

  try {
    console.log("[copilot] Creating session...");
    const session = await client.createSession({
      model,
      systemMessage: { content: systemMessage },
      tools,
      onPermissionRequest: approveAll,
      workingDirectory: target,
    });
    console.log(`[copilot] Session: ${session.sessionId}`);

    // Verbose event logging
    session.on((event) => {
      const type = event?.type || "unknown";
      if (type === "assistant.message") {
        const preview = event?.data?.content?.substring(0, 120) || "";
        console.log(`[event] ${type}: ${preview}...`);
      } else if (type === "tool.call") {
        const name = event?.data?.name || "?";
        const args = JSON.stringify(event?.data?.arguments || {}).substring(0, 200);
        console.log(`[event] tool.call: ${name}(${args})`);
      } else if (type === "session.error") {
        console.error(`[event] ERROR: ${JSON.stringify(event?.data || event)}`);
      } else if (type !== "session.idle") {
        console.log(`[event] ${type}`);
      }
    });

    const startTime = Date.now();
    console.log("[copilot] Sending prompt...");
    const response = await session.sendAndWait({ prompt }, 300000);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    const content = response?.data?.content || "(no content)";
    const tokens = response?.data?.usage?.totalTokens || 0;

    console.log("");
    console.log(`=== ${taskName} completed in ${elapsed}s (${tokens} tokens) ===`);
    console.log("");
    console.log(content);
    console.log("");

    return 0;
  } catch (err) {
    console.error("");
    console.error(`=== ${taskName} FAILED ===`);
    console.error(err.message);
    if (err.stack) console.error(err.stack);
    return 1;
  } finally {
    await client.stop();
  }
}

// ─── Task Config + Prompts ───────────────────────────────────────────

async function loadTaskConfig() {
  const tomlPath = resolve(target, "agentic-lib.toml");

  if (!existsSync(tomlPath)) {
    throw new Error(`Config file not found: ${tomlPath}. Create agentic-lib.toml in the project root.`);
  }

  console.log(`[config] Loading ${tomlPath}`);
  const { parse } = await import("smol-toml");
  const toml = parse(readFileSync(tomlPath, "utf8"));
  return {
    missionPath: toml.paths?.mission || "MISSION.md",
    sourcePath: toml.paths?.source || "src/lib/",
    testsPath: toml.paths?.tests || "tests/unit/",
    featuresPath: toml.paths?.features || "features/",
    libraryPath: toml.paths?.docs || "library/",
    sourcesPath: toml.paths?.["library-sources"] || "SOURCES.md",
    examplesPath: toml.paths?.examples || "examples/",
    readmePath: toml.paths?.readme || "README.md",
    depsPath: toml.paths?.dependencies || "package.json",
    testScript: toml.execution?.test || "npm ci && npm test",
    featureLimit: toml.limits?.["max-feature-issues"] || 2,
    intentionPath: toml.bot?.["log-file"] || "intentïon.md",
  };
}

function getWritablePathsFromConfig(config) {
  return [
    config.sourcePath,
    config.testsPath,
    config.featuresPath,
    config.libraryPath,
    config.examplesPath,
    config.readmePath,
    config.depsPath,
  ].filter(Boolean);
}

function getReadOnlyPathsFromConfig(config) {
  return [config.missionPath, config.sourcesPath].filter(Boolean);
}

function readOptional(relPath) {
  try {
    return readFileSync(resolve(target, relPath), "utf8");
  } catch (err) {
    console.debug(`[readOptional] ${relPath}: ${err.message}`);
    return "";
  }
}

function scanDir(relPath, extensions, opts = {}) {
  const { fileLimit = 10, contentLimit } = opts;
  const dir = resolve(target, relPath);
  const exts = Array.isArray(extensions) ? extensions : [extensions];
  if (!existsSync(dir)) return [];
  try {
    return readdirSync(dir, { recursive: true })
      .filter((f) => exts.some((ext) => String(f).endsWith(ext)))
      .slice(0, fileLimit)
      .map((f) => {
        try {
          const content = readFileSync(resolve(dir, String(f)), "utf8");
          return { name: String(f), content: contentLimit ? content.substring(0, contentLimit) : content };
        } catch (err) {
          console.debug(`[scanDir] ${dir}/${f}: ${err.message}`);
          return { name: String(f), content: "" };
        }
      });
  } catch (err) {
    console.debug(`[scanDir] ${dir}: ${err.message}`);
    return [];
  }
}

function formatPaths(writable, readOnly) {
  return [
    "## File Paths",
    "### Writable (you may modify these)",
    writable.length > 0 ? writable.map((p) => `- ${p}`).join("\n") : "- (none)",
    "",
    "### Read-Only (for context only, do NOT modify)",
    readOnly.length > 0 ? readOnly.map((p) => `- ${p}`).join("\n") : "- (none)",
  ].join("\n");
}

function buildTaskPrompt(taskName, config, writablePaths, readOnlyPaths) {
  const pathsSection = formatPaths(writablePaths, readOnlyPaths);

  switch (taskName) {
    case "transform":
      return buildTransformPrompt(config, pathsSection);
    case "maintain-features":
      return buildMaintainFeaturesPrompt(config, pathsSection);
    case "maintain-library":
      return buildMaintainLibraryPrompt(config, pathsSection);
    case "fix-code":
      return buildFixCodePrompt(config, pathsSection);
    default:
      console.error(`Unknown task: ${taskName}`);
      return { systemMessage: "", prompt: null };
  }
}

function buildTransformPrompt(config, pathsSection) {
  const mission = readOptional(config.missionPath);
  if (!mission) {
    console.error(`No mission file found at ${config.missionPath}`);
    return { systemMessage: "", prompt: null };
  }
  console.log(`[context] Mission: ${mission.substring(0, 80).trim()}...`);

  const features = scanDir(config.featuresPath, ".md");
  const sourceFiles = scanDir(config.sourcePath, [".js", ".ts"], { contentLimit: 2000 });
  console.log(`[context] Features: ${features.length}, Source files: ${sourceFiles.length}`);

  return {
    systemMessage:
      "You are an autonomous code transformation agent. Your goal is to advance the repository toward its mission by making the most impactful change possible in a single step.",
    prompt: [
      "## Instructions",
      "Transform the repository toward its mission by identifying the next best action.",
      "",
      "## Mission",
      mission,
      "",
      `## Current Features (${features.length})`,
      ...features.map((f) => `### ${f.name}\n${f.content.substring(0, 500)}`),
      "",
      `## Current Source Files (${sourceFiles.length})`,
      ...sourceFiles.map((f) => `### ${f.name}\n\`\`\`\n${f.content}\n\`\`\``),
      "",
      "## Output Artifacts",
      "If your changes produce output artifacts (plots, visualizations, data files, usage examples),",
      `save them to the \`${config.examplesPath || "examples/"}\` directory.`,
      "This directory is for demonstrating what the code can do.",
      "",
      "## Your Task",
      "Analyze the mission, features, and source code.",
      "Determine the single most impactful next step.",
      "Then implement that step by writing files.",
      "",
      pathsSection,
      "",
      "## Constraints",
      `- Run \`${config.testScript}\` to validate your changes`,
    ].join("\n"),
  };
}

function buildMaintainFeaturesPrompt(config, pathsSection) {
  const mission = readOptional(config.missionPath);
  if (!mission) {
    console.error(`No mission file found at ${config.missionPath}`);
    return { systemMessage: "", prompt: null };
  }

  const features = scanDir(config.featuresPath, ".md");
  const libraryDocs = scanDir(config.libraryPath, ".md", { contentLimit: 1000 });
  console.log(`[context] Mission loaded, features: ${features.length}, library: ${libraryDocs.length}`);

  return {
    systemMessage:
      "You are a feature lifecycle manager. Create, update, and prune feature specification files to keep the project focused on its mission.",
    prompt: [
      "## Instructions",
      "Maintain the feature set by creating, updating, or pruning features.",
      "",
      "## Mission",
      mission,
      "",
      `## Current Features (${features.length}/${config.featureLimit} max)`,
      ...features.map((f) => `### ${f.name}\n${f.content}`),
      "",
      libraryDocs.length > 0 ? `## Library Documents (${libraryDocs.length})` : "",
      ...libraryDocs.map((d) => `### ${d.name}\n${d.content}`),
      "",
      "## Your Task",
      `1. Review each existing feature — if it is already implemented or irrelevant, delete it.`,
      `2. If there are fewer than ${config.featureLimit} features, create new features aligned with the mission.`,
      "3. Ensure each feature has clear, testable acceptance criteria.",
      "",
      pathsSection,
      "",
      "## Constraints",
      `- Maximum ${config.featureLimit} feature files`,
      "- Feature files must be markdown with a descriptive filename",
    ].join("\n"),
  };
}

function buildMaintainLibraryPrompt(config, pathsSection) {
  const sources = readOptional(config.sourcesPath);
  if (!sources.trim()) {
    console.log("No SOURCES.md or empty — nothing to maintain.");
    return { systemMessage: "", prompt: null };
  }

  const libraryDocs = scanDir(config.libraryPath, ".md", { contentLimit: 500 });
  console.log(`[context] Sources loaded, library: ${libraryDocs.length}`);

  return {
    systemMessage:
      "You are a knowledge librarian. Maintain a library of technical documents extracted from web sources.",
    prompt: [
      "## Instructions",
      "Maintain the library by updating documents from sources.",
      "",
      "## Sources",
      sources,
      "",
      `## Current Library Documents (${libraryDocs.length})`,
      ...libraryDocs.map((d) => `### ${d.name}\n${d.content}`),
      "",
      "## Your Task",
      "1. Read each URL in SOURCES.md and extract technical content.",
      "2. Create or update library documents based on the source content.",
      "3. Remove library documents that no longer have corresponding sources.",
      "",
      pathsSection,
    ].join("\n"),
  };
}

function buildFixCodePrompt(config, pathsSection) {
  // Run tests and capture output
  console.log(`[fix-code] Running: ${config.testScript}`);
  let testOutput;
  try {
    testOutput = execSync(config.testScript, { cwd: target, encoding: "utf8", timeout: 120000 });
    console.log("[fix-code] Tests pass — nothing to fix.");
    return { systemMessage: "", prompt: null };
  } catch (err) {
    testOutput = `STDOUT:\n${err.stdout || ""}\nSTDERR:\n${err.stderr || ""}`;
    console.log(`[fix-code] Tests failing — ${testOutput.length} chars of output`);
  }

  const sourceFiles = scanDir(config.sourcePath, [".js", ".ts"], { contentLimit: 2000 });
  const testFiles = scanDir(config.testsPath, [".js", ".ts", ".test.js"], { contentLimit: 2000 });

  return {
    systemMessage:
      "You are an autonomous coding agent fixing failing tests. Make minimal, targeted changes to fix the test failures.",
    prompt: [
      "## Instructions",
      "Fix the failing tests by modifying the source code.",
      "",
      "## Test Output (failing)",
      "```",
      testOutput.substring(0, 5000),
      "```",
      "",
      `## Source Files (${sourceFiles.length})`,
      ...sourceFiles.map((f) => `### ${f.name}\n\`\`\`\n${f.content}\n\`\`\``),
      "",
      `## Test Files (${testFiles.length})`,
      ...testFiles.map((f) => `### ${f.name}\n\`\`\`\n${f.content}\n\`\`\``),
      "",
      pathsSection,
      "",
      "## Constraints",
      `- Run \`${config.testScript}\` to validate your fixes`,
      "- Make minimal changes to fix the failing tests",
    ].join("\n"),
  };
}

// ─── CLI Tools for Copilot SDK ───────────────────────────────────────

function createCliTools(writablePaths, defineTool) {
  const readFile = defineTool("read_file", {
    description: "Read the contents of a file.",
    parameters: {
      type: "object",
      properties: { path: { type: "string", description: "File path to read" } },
      required: ["path"],
    },
    handler: ({ path }) => {
      const resolved = resolve(target, path);
      console.log(`  [tool] read_file: ${resolved}`);
      if (!existsSync(resolved)) return { error: `File not found: ${resolved}` };
      try {
        return { content: readFileSync(resolved, "utf8") };
      } catch (err) {
        return { error: err.message };
      }
    },
  });

  const writeFile = defineTool("write_file", {
    description: "Write content to a file. Parent directories are created automatically.",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string", description: "File path to write" },
        content: { type: "string", description: "Content to write" },
      },
      required: ["path", "content"],
    },
    handler: ({ path, content }) => {
      const resolved = resolve(target, path);
      const isWritable = writablePaths.some((wp) => path.startsWith(wp) || resolved.startsWith(resolve(target, wp)));
      console.log(`  [tool] write_file: ${resolved} (${content.length} chars, writable=${isWritable})`);
      if (!isWritable && !dryRun) {
        return { error: `Path not writable: ${path}. Writable: ${writablePaths.join(", ")}` };
      }
      if (dryRun) {
        console.log(`  [tool] DRY RUN — would write ${content.length} chars to ${resolved}`);
        return { success: true, dryRun: true };
      }
      try {
        const dir = dirname(resolved);
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
        writeFileSync(resolved, content, "utf8");
        return { success: true, path: resolved };
      } catch (err) {
        return { error: err.message };
      }
    },
  });

  const listFiles = defineTool("list_files", {
    description: "List files and directories at the given path.",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string", description: "Directory path to list" },
        recursive: { type: "boolean", description: "List recursively" },
      },
      required: ["path"],
    },
    handler: ({ path, recursive }) => {
      const resolved = resolve(target, path);
      console.log(`  [tool] list_files: ${resolved}`);
      if (!existsSync(resolved)) return { error: `Not found: ${resolved}` };
      try {
        const entries = readdirSync(resolved, { withFileTypes: true, recursive: !!recursive });
        return { files: entries.map((e) => (e.isDirectory() ? `${e.name}/` : e.name)) };
      } catch (err) {
        return { error: err.message };
      }
    },
  });

  const runCommand = defineTool("run_command", {
    description: "Run a shell command and return stdout/stderr.",
    parameters: {
      type: "object",
      properties: {
        command: { type: "string", description: "Shell command to execute" },
        cwd: { type: "string", description: "Working directory" },
      },
      required: ["command"],
    },
    handler: ({ command: cmd, cwd }) => {
      const workDir = cwd ? resolve(target, cwd) : target;
      console.log(`  [tool] run_command: ${cmd} (cwd=${workDir})`);
      const blocked = /\bgit\s+(commit|push|add|reset|checkout|rebase|merge|stash)\b/;
      if (blocked.test(cmd)) {
        console.log(`  [tool] BLOCKED git write command: ${cmd}`);
        return { error: "Git write commands are not allowed. Use read_file/write_file tools instead." };
      }
      try {
        const stdout = execSync(cmd, { cwd: workDir, encoding: "utf8", timeout: 120000 });
        return { stdout, exitCode: 0 };
      } catch (err) {
        return { stdout: err.stdout || "", stderr: err.stderr || "", exitCode: err.status || 1 };
      }
    },
  });

  return [readFile, writeFile, listFiles, runCommand];
}

// ─── Init Runner ─────────────────────────────────────────────────────

function initTransformFile(src, dst, label) {
  const content = readFileSync(src, "utf8");
  const transformed = applyDistTransform(content);
  if (dryRun) {
    console.log(`  TRANSFORM: ${label}`);
  } else {
    mkdirSync(dirname(dst), { recursive: true });
    writeFileSync(dst, transformed);
    console.log(`  TRANSFORM: ${label}`);
  }
  initChanges++;
}

function initCopyFile(src, dst, label) {
  if (dryRun) {
    console.log(`  COPY: ${label}`);
  } else {
    mkdirSync(dirname(dst), { recursive: true });
    copyFileSync(src, dst);
    console.log(`  COPY: ${label}`);
  }
  initChanges++;
}

function initCopyDirRecursive(srcPath, dstPath, label, excludes = []) {
  if (!existsSync(srcPath)) {
    console.log(`  SKIP: ${label} (not found)`);
    return;
  }
  const entries = readdirSync(srcPath, { withFileTypes: true });
  for (const entry of entries) {
    const srcFull = join(srcPath, entry.name);
    const dstFull = join(dstPath, entry.name);
    const relLabel = `${label}/${entry.name}`;
    if (excludes.some((ex) => entry.name === ex)) continue;
    if (entry.isDirectory()) {
      initCopyDirRecursive(srcFull, dstFull, relLabel, excludes);
    } else {
      initCopyFile(srcFull, dstFull, relLabel);
    }
  }
}

function removeStaleWorkflows(templateWorkflows) {
  const targetWorkflowsDir = resolve(target, ".github/workflows");
  if (!existsSync(targetWorkflowsDir)) return;
  for (const f of readdirSync(targetWorkflowsDir)) {
    if (f.endsWith(".yml") && !templateWorkflows.has(f)) {
      if (!dryRun) rmSync(resolve(targetWorkflowsDir, f));
      console.log(`  REMOVE stale: workflows/${f}`);
      initChanges++;
    }
  }
}

function initWorkflows() {
  console.log("--- Workflows ---");
  // Distributable workflows live in .github/workflows/agentic-lib-*.yml
  // and are transformed via #@dist markers during init
  const ownWorkflowsDir = resolve(pkgRoot, ".github/workflows");
  if (!existsSync(ownWorkflowsDir)) return;
  const templateWorkflows = new Set();
  for (const f of readdirSync(ownWorkflowsDir)) {
    if (f.startsWith("agentic-lib-") && f.endsWith(".yml")) {
      templateWorkflows.add(f);
      initTransformFile(resolve(ownWorkflowsDir, f), resolve(target, ".github/workflows", f), `workflows/${f}`);
    }
  }
  removeStaleWorkflows(templateWorkflows);
}

function initActions(agenticDir) {
  console.log("\n--- Actions ---");
  const actionsDir = resolve(srcDir, "actions");
  if (!existsSync(actionsDir)) return;
  for (const actionName of readdirSync(actionsDir, { withFileTypes: true })) {
    if (actionName.isDirectory()) {
      initCopyDirRecursive(
        resolve(actionsDir, actionName.name),
        resolve(agenticDir, "actions", actionName.name),
        `actions/${actionName.name}`,
        ["node_modules"],
      );
    }
  }
}

function initDirContents(srcSubdir, dstDir, label) {
  console.log(`\n--- ${label} ---`);
  const dir = resolve(srcDir, srcSubdir);
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      initCopyDirRecursive(resolve(dir, entry.name), resolve(dstDir, entry.name), `${srcSubdir}/${entry.name}`);
    } else {
      initCopyFile(resolve(dir, entry.name), resolve(dstDir, entry.name), `${srcSubdir}/${entry.name}`);
    }
  }
}

function initScripts(agenticDir) {
  console.log("\n--- Scripts ---");
  const scriptsDir = resolve(srcDir, "scripts");
  const DISTRIBUTED_SCRIPTS = [
    "accept-release.sh",
    "activate-schedule.sh",
    "clean.sh",
    "initialise.sh",
    "md-to-html.js",
    "update.sh",
  ];
  if (!existsSync(scriptsDir)) return;
  const distributedSet = new Set(DISTRIBUTED_SCRIPTS);
  for (const name of DISTRIBUTED_SCRIPTS) {
    const src = resolve(scriptsDir, name);
    if (existsSync(src)) {
      initCopyFile(src, resolve(agenticDir, "scripts", name), `scripts/${name}`);
    }
  }
  // Remove stale scripts not in the distributed set
  const targetScriptsDir = resolve(agenticDir, "scripts");
  if (existsSync(targetScriptsDir)) {
    for (const f of readdirSync(targetScriptsDir)) {
      if (!distributedSet.has(f)) {
        if (!dryRun) rmSync(resolve(targetScriptsDir, f));
        console.log(`  REMOVE stale: scripts/${f}`);
        initChanges++;
      }
    }
  }
}

function initConfig(seedsDir) {
  console.log("\n--- Config ---");
  // Config TOML lives at project root with #@dist markers — transform for distribution
  const tomlSource = resolve(pkgRoot, "agentic-lib.toml");
  const tomlTarget = resolve(target, "agentic-lib.toml");
  if (existsSync(tomlSource) && !existsSync(tomlTarget)) {
    initTransformFile(tomlSource, tomlTarget, "agentic-lib.toml (new)");
  } else if (existsSync(tomlTarget)) {
    console.log("  SKIP: agentic-lib.toml already exists");
  } else {
    console.log("  SKIP: source TOML not found");
  }

  const giSeed = resolve(seedsDir, "zero-.gitignore");
  const giTarget = resolve(target, ".gitignore");
  if (existsSync(giSeed) && !existsSync(giTarget)) {
    initCopyFile(giSeed, giTarget, ".gitignore (new)");
  } else if (existsSync(giTarget)) {
    console.log("  SKIP: .gitignore already exists");
  }
}

function removeFile(filePath, label) {
  if (existsSync(filePath)) {
    if (!dryRun) rmSync(filePath);
    console.log(`  REMOVE: ${label}`);
    initChanges++;
  }
}

function clearDirContents(dirPath, label) {
  if (!existsSync(dirPath)) return;
  for (const f of readdirSync(dirPath)) {
    if (!dryRun) rmSync(resolve(dirPath, f));
    console.log(`  REMOVE: ${label}/${f}`);
    initChanges++;
  }
}

function initReseed(initTimestamp) {
  console.log("\n--- Reseed: Clear Features + Activity Log ---");
  removeFile(resolve(target, "intentïon.md"), "intentïon.md");
  removeFile(resolve(target, "MISSION_COMPLETE.md"), "MISSION_COMPLETE.md");
  removeFile(resolve(target, "MISSION_FAILED.md"), "MISSION_FAILED.md");

  // Write init epoch header to the activity log
  const pkg = JSON.parse(readFileSync(resolve(pkgRoot, "package.json"), "utf8"));
  const mode = purge ? "purge" : "reseed";
  const initHeader = [
    `# intentïon activity log`,
    "",
    `**init ${mode}** at ${initTimestamp} (agentic-lib@${pkg.version})`,
    `**mission:** ${mission}`,
    "",
    "---",
    "",
  ].join("\n");
  if (!dryRun) {
    writeFileSync(resolve(target, "intentïon.md"), initHeader);
  }
  console.log("  WRITE: intentïon.md (init epoch header)");
  initChanges++;

  clearDirContents(resolve(target, "features"), "features");

  // Clear old features location if it exists
  const oldFeaturesDir = resolve(target, ".github/agentic-lib/features");
  clearDirContents(oldFeaturesDir, ".github/agentic-lib/features (old location)");
  if (existsSync(oldFeaturesDir)) {
    if (!dryRun) rmdirSync(oldFeaturesDir);
    console.log("  REMOVE: .github/agentic-lib/features/ (old location)");
  }

  clearDirContents(resolve(target, "library"), "library");
  clearDirContents(resolve(target, "examples"), "examples");

  // Remove old getting-started-guide if it exists
  const oldGuideDir = resolve(target, ".github/agentic-lib/getting-started-guide");
  if (existsSync(oldGuideDir)) {
    if (!dryRun) rmSync(oldGuideDir, { recursive: true });
    console.log("  REMOVE: .github/agentic-lib/getting-started-guide/ (obsolete)");
    initChanges++;
  }
}

function readTomlPaths() {
  let sourcePath = "src/lib/";
  let testsPath = "tests/unit/";
  let examplesPath = "examples/";
  let webPath = "src/web/";
  const tomlTarget = resolve(target, "agentic-lib.toml");
  if (existsSync(tomlTarget)) {
    try {
      const tomlContent = readFileSync(tomlTarget, "utf8");
      const sourceMatch = tomlContent.match(/^source\s*=\s*"([^"]+)"/m);
      const testsMatch = tomlContent.match(/^tests\s*=\s*"([^"]+)"/m);
      const examplesMatch = tomlContent.match(/^examples\s*=\s*"([^"]+)"/m);
      const webMatch = tomlContent.match(/^web\s*=\s*"([^"]+)"/m);
      if (sourceMatch) sourcePath = sourceMatch[1];
      if (testsMatch) testsPath = testsMatch[1];
      if (examplesMatch) examplesPath = examplesMatch[1];
      if (webMatch) webPath = webMatch[1];
    } catch (err) {
      console.log(`  WARN: Could not read TOML for paths, using defaults: ${err.message}`);
    }
  }
  return { sourcePath, testsPath, examplesPath, webPath };
}

function clearAndRecreateDir(dirPath, label) {
  const fullPath = resolve(target, dirPath);
  if (existsSync(fullPath)) {
    console.log(`  CLEAR: ${label}`);
    if (!dryRun) rmSync(fullPath, { recursive: true });
    initChanges++;
  }
  if (!dryRun) mkdirSync(fullPath, { recursive: true });
}

function initPurge(seedsDir, missionName, initTimestamp) {
  console.log("\n--- Purge: Reset Source Files to Seed State ---");

  const { sourcePath, testsPath, examplesPath, webPath } = readTomlPaths();
  clearAndRecreateDir(sourcePath, sourcePath);
  clearAndRecreateDir(testsPath, testsPath);
  clearAndRecreateDir(examplesPath, examplesPath);
  clearAndRecreateDir(webPath, webPath);
  clearAndRecreateDir("docs", "docs");

  // Copy seed files (including config TOML) — MISSION.md handled separately via mission seed
  const SEED_MAP = {
    "zero-main.js": "src/lib/main.js",
    "zero-main.test.js": "tests/unit/main.test.js",
    "zero-index.html": "src/web/index.html",
    "zero-web.test.js": "tests/unit/web.test.js",
    "zero-behaviour.test.js": "tests/behaviour/homepage.test.js",
    "zero-playwright.config.js": "playwright.config.js",
    "zero-SOURCES.md": "SOURCES.md",
    "zero-package.json": "package.json",
    "zero-README.md": "README.md",
    "zero-.gitignore": ".gitignore",
  };
  for (const [seedFile, targetRel] of Object.entries(SEED_MAP)) {
    const src = resolve(seedsDir, seedFile);
    if (existsSync(src)) {
      initCopyFile(src, resolve(target, targetRel), `SEED: ${seedFile} → ${targetRel}`);
    }
  }

  // Bootstrap docs/ for GitHub Pages — copy web seed so the site is available immediately
  const webSeed = resolve(seedsDir, "zero-index.html");
  if (existsSync(webSeed)) {
    const docsDir = resolve(target, "docs");
    if (!dryRun) {
      mkdirSync(docsDir, { recursive: true });
      writeFileSync(resolve(docsDir, ".nojekyll"), "");
    }
    initCopyFile(webSeed, resolve(docsDir, "index.html"), "SEED: zero-index.html → docs/index.html");
    console.log("  CREATE: docs/.nojekyll");
  }

  // Force-overwrite agentic-lib.toml during purge (transformed from root)
  const tomlSource = resolve(pkgRoot, "agentic-lib.toml");
  if (existsSync(tomlSource)) {
    initTransformFile(tomlSource, resolve(target, "agentic-lib.toml"), "SEED: agentic-lib.toml (transformed)");
  }

  // Copy mission seed file as MISSION.md
  const missionsDir = resolve(seedsDir, "missions");
  const missionFile = resolve(missionsDir, `${missionName}.md`);
  if (existsSync(missionFile)) {
    initCopyFile(missionFile, resolve(target, "MISSION.md"), `MISSION: missions/${missionName}.md → MISSION.md`);
  } else {
    // List available missions and error
    const available = existsSync(missionsDir)
      ? readdirSync(missionsDir)
          .filter((f) => f.endsWith(".md"))
          .map((f) => f.replace(/\.md$/, ""))
      : [];
    console.error(`\nERROR: Unknown mission "${missionName}".`);
    if (available.length > 0) {
      console.error(`Available missions: ${available.join(", ")}`);
    }
    process.exit(1);
  }

  // Write init metadata to agentic-lib.toml
  const tomlTarget = resolve(target, "agentic-lib.toml");
  if (existsSync(tomlTarget)) {
    let toml = readFileSync(tomlTarget, "utf8");
    const pkg = JSON.parse(readFileSync(resolve(pkgRoot, "package.json"), "utf8"));
    const initSection = [
      "",
      "[init]",
      `timestamp = "${initTimestamp}"`,
      `mode = "purge"`,
      `mission = "${missionName}"`,
      `version = "${pkg.version}"`,
    ].join("\n");
    // Replace existing [init] section or append
    if (/^\[init\]/m.test(toml)) {
      toml = toml.replace(/\n?\[init\][^\[]*/, initSection);
    } else {
      toml = toml.trimEnd() + "\n" + initSection + "\n";
    }
    if (!dryRun) {
      writeFileSync(tomlTarget, toml);
    }
    console.log("  WRITE: [init] section in agentic-lib.toml");
    initChanges++;
  }
}

function ghExec(cmd, input) {
  const opts = { cwd: target, encoding: "utf8", timeout: 30000, stdio: ["pipe", "pipe", "pipe"] };
  if (input) opts.input = input;
  return execSync(cmd, opts);
}

function ghGraphQL(query) {
  return JSON.parse(ghExec("gh api graphql --input -", JSON.stringify({ query })));
}

function initPurgeGitHub() {
  console.log("\n--- Purge: Clean Slate (Issues, PRs, Runs, Branches, Labels, Discussions) ---");

  // Detect the GitHub repo from git remote
  let repoSlug = "";
  try {
    const remoteUrl = execSync("git remote get-url origin", {
      cwd: target,
      encoding: "utf8",
      timeout: 10000,
    }).trim();
    const match = remoteUrl.match(/github\.com[:/]([^/]+\/[^/.]+)/);
    if (match) repoSlug = match[1].replace(/\.git$/, "");
  } catch {
    console.log("  SKIP: Not a git repo or no origin remote — skipping GitHub purge");
    return;
  }
  if (!repoSlug) {
    console.log("  SKIP: Could not detect GitHub repo from remote — skipping GitHub purge");
    return;
  }

  try {
    execSync("gh --version", { encoding: "utf8", timeout: 5000, stdio: "pipe" });
  } catch {
    console.log("  SKIP: gh CLI not found — skipping GitHub purge");
    return;
  }

  const [owner, repo] = repoSlug.split("/");

  // ── A1: Close + lock ALL issues (open and closed) ──────────────────
  console.log("\n  --- Issues: close open, lock all ---");
  try {
    // Close all open issues with not_planned reason
    const openIssuesJson = ghExec(`gh api repos/${repoSlug}/issues?state=open&per_page=100`);
    const openIssues = JSON.parse(openIssuesJson || "[]").filter((i) => !i.pull_request);
    for (const issue of openIssues) {
      console.log(`  CLOSE: issue #${issue.number} — ${issue.title}`);
      if (!dryRun) {
        try {
          ghExec(
            `gh api repos/${repoSlug}/issues/${issue.number} -X PATCH -f state=closed -f state_reason=not_planned`,
          );
          ghExec(
            `gh api repos/${repoSlug}/issues/${issue.number}/comments -X POST -f body="Closed by init --purge (mission reset)"`,
          );
          initChanges++;
        } catch (err) {
          console.log(`  WARN: Failed to close issue #${issue.number}: ${err.message}`);
        }
      } else {
        initChanges++;
      }
    }
    if (openIssues.length === 0) console.log("  No open issues to close");

    // Lock ALL issues (open and closed) to prevent bleed
    const allIssuesJson = ghExec(`gh api repos/${repoSlug}/issues?state=all&per_page=100`);
    const allIssues = JSON.parse(allIssuesJson || "[]").filter((i) => !i.pull_request && !i.locked);
    for (const issue of allIssues) {
      console.log(`  LOCK: issue #${issue.number} — ${issue.title}`);
      if (!dryRun) {
        try {
          ghExec(
            `gh api repos/${repoSlug}/issues/${issue.number}/lock -X PUT -f lock_reason=resolved`,
          );
          initChanges++;
        } catch (err) {
          console.log(`  WARN: Failed to lock issue #${issue.number}: ${err.message}`);
        }
      } else {
        initChanges++;
      }
    }
    if (allIssues.length === 0) console.log("  No unlocked issues to lock");
  } catch (err) {
    console.log(`  WARN: Issue cleanup failed: ${err.message}`);
  }

  // ── A2: Close all open PRs + delete branches ──────────────────────
  console.log("\n  --- PRs: close all open ---");
  try {
    const prsJson = ghExec(`gh pr list --repo ${repoSlug} --state open --json number,title,headRefName --limit 100`);
    const prs = JSON.parse(prsJson || "[]");
    for (const pr of prs) {
      console.log(`  CLOSE: PR #${pr.number} — ${pr.title} (${pr.headRefName})`);
      if (!dryRun) {
        try {
          ghExec(`gh pr close ${pr.number} --repo ${repoSlug} --delete-branch`);
          initChanges++;
        } catch (err) {
          console.log(`  WARN: Failed to close PR #${pr.number}: ${err.message}`);
        }
      } else {
        initChanges++;
      }
    }
    if (prs.length === 0) console.log("  No open PRs to close");
  } catch (err) {
    console.log(`  WARN: PR cleanup failed: ${err.message}`);
  }

  // ── A3: Delete old workflow runs ──────────────────────────────────
  console.log("\n  --- Workflow runs: delete old ---");
  try {
    const runsJson = ghExec(`gh api repos/${repoSlug}/actions/runs?per_page=100`);
    const runs = JSON.parse(runsJson || '{"workflow_runs":[]}').workflow_runs || [];
    let deleted = 0;
    for (const run of runs) {
      // Skip currently running workflows (in_progress or queued)
      if (run.status === "in_progress" || run.status === "queued") {
        console.log(`  SKIP: run ${run.id} (${run.name}) — ${run.status}`);
        continue;
      }
      if (!dryRun) {
        try {
          ghExec(`gh api repos/${repoSlug}/actions/runs/${run.id} -X DELETE`);
          deleted++;
        } catch (err) {
          console.log(`  WARN: Failed to delete run ${run.id}: ${err.message}`);
        }
      } else {
        deleted++;
      }
    }
    console.log(`  ${deleted > 0 ? `DELETE: ${deleted} workflow run(s)` : "No workflow runs to delete"}`);
    initChanges += deleted;
  } catch (err) {
    console.log(`  WARN: Workflow run cleanup failed: ${err.message}`);
  }

  // ── A4: Delete stale remote branches ──────────────────────────────
  console.log("\n  --- Branches: delete stale remotes ---");
  try {
    const branchesJson = ghExec(`gh api repos/${repoSlug}/branches?per_page=100`);
    const branches = JSON.parse(branchesJson || "[]");
    const currentBranch = execSync("git rev-parse --abbrev-ref HEAD", {
      cwd: target,
      encoding: "utf8",
      timeout: 5000,
    }).trim();
    const keepBranches = new Set(["main", "master", "template", "gh-pages", currentBranch]);
    let deletedBranches = 0;
    for (const branch of branches) {
      if (keepBranches.has(branch.name)) continue;
      if (branch.protected) continue;
      console.log(`  DELETE: branch ${branch.name}`);
      if (!dryRun) {
        try {
          ghExec(`gh api repos/${repoSlug}/git/refs/heads/${branch.name} -X DELETE`);
          deletedBranches++;
        } catch (err) {
          console.log(`  WARN: Failed to delete branch ${branch.name}: ${err.message}`);
        }
      } else {
        deletedBranches++;
      }
    }
    if (deletedBranches === 0) console.log("  No stale branches to delete");
    initChanges += deletedBranches;
  } catch (err) {
    console.log(`  WARN: Branch cleanup failed: ${err.message}`);
  }

  // ── A5: Reset labels ──────────────────────────────────────────────
  console.log("\n  --- Labels: reset to pipeline defaults ---");
  const GITHUB_DEFAULT_LABELS = new Set([
    "bug",
    "documentation",
    "duplicate",
    "enhancement",
    "good first issue",
    "help wanted",
    "invalid",
    "question",
    "wontfix",
  ]);
  const PIPELINE_LABELS = [
    { name: "automated", color: "0e8a16", description: "Created by the autonomous pipeline" },
    { name: "ready", color: "0075ca", description: "Issue is ready for transformation" },
    { name: "in-progress", color: "e4e669", description: "Work in progress" },
    { name: "merged", color: "6f42c1", description: "Associated PR has been merged" },
    { name: "automerge", color: "1d76db", description: "PR should be auto-merged when checks pass" },
  ];
  try {
    const labelsJson = ghExec(`gh api repos/${repoSlug}/labels?per_page=100`);
    const labels = JSON.parse(labelsJson || "[]");
    const pipelineNames = new Set(PIPELINE_LABELS.map((l) => l.name));
    // Delete non-default, non-pipeline labels
    for (const label of labels) {
      if (GITHUB_DEFAULT_LABELS.has(label.name)) continue;
      if (pipelineNames.has(label.name)) continue;
      console.log(`  DELETE: label "${label.name}"`);
      if (!dryRun) {
        try {
          ghExec(`gh api repos/${repoSlug}/labels/${encodeURIComponent(label.name)} -X DELETE`);
          initChanges++;
        } catch (err) {
          console.log(`  WARN: Failed to delete label "${label.name}": ${err.message}`);
        }
      } else {
        initChanges++;
      }
    }
    // Ensure pipeline labels exist with correct config
    const existingNames = new Set(labels.map((l) => l.name));
    for (const pl of PIPELINE_LABELS) {
      if (existingNames.has(pl.name)) {
        // Update to ensure correct color/description
        if (!dryRun) {
          try {
            ghExec(
              `gh api repos/${repoSlug}/labels/${encodeURIComponent(pl.name)} -X PATCH -f color=${pl.color} -f description="${pl.description}"`,
            );
          } catch { /* ignore */ }
        }
        console.log(`  UPDATE: label "${pl.name}"`);
      } else {
        console.log(`  CREATE: label "${pl.name}"`);
        if (!dryRun) {
          try {
            ghExec(
              `gh api repos/${repoSlug}/labels -X POST -f name="${pl.name}" -f color=${pl.color} -f description="${pl.description}"`,
            );
            initChanges++;
          } catch (err) {
            console.log(`  WARN: Failed to create label "${pl.name}": ${err.message}`);
          }
        } else {
          initChanges++;
        }
      }
    }
  } catch (err) {
    console.log(`  WARN: Label cleanup failed: ${err.message}`);
  }

  // ── Discussions: close all open, create fresh one ─────────────────
  console.log("\n  --- Discussions: close open, create fresh ---");
  try {
    const parsed = ghGraphQL(
      `{ repository(owner:"${owner}", name:"${repo}") { discussions(first:50, states:OPEN) { nodes { id number title } } } }`,
    );
    const discussions = parsed?.data?.repository?.discussions?.nodes || [];
    if (discussions.length === 0) {
      console.log("  No open discussions to close");
    } else {
      for (const disc of discussions) {
        console.log(`  CLOSE: discussion #${disc.number} — ${disc.title}`);
        if (!dryRun) {
          try {
            ghGraphQL(`mutation { closeDiscussion(input: { discussionId: "${disc.id}" }) { discussion { number } } }`);
            initChanges++;
          } catch {
            console.log(`  SKIP: Could not close discussion #${disc.number} (may need admin permissions)`);
          }
        } else {
          initChanges++;
        }
      }
    }
  } catch {
    console.log("  SKIP: Could not list discussions (feature may not be enabled)");
  }

  // Create a new "Talk to the repository" discussion
  try {
    const repoParsed = ghGraphQL(
      `{ repository(owner:"${owner}", name:"${repo}") { id discussionCategories(first:20) { nodes { id name } } } }`,
    );
    const repoId = repoParsed?.data?.repository?.id;
    const categories = repoParsed?.data?.repository?.discussionCategories?.nodes || [];
    const generalCat = categories.find((c) => c.name === "General");
    if (!repoId || !generalCat) {
      console.log('  SKIP: Could not find repository ID or "General" discussion category');
    } else {
      console.log('  CREATE: discussion "Talk to the repository" in General category');
      if (!dryRun) {
        const createParsed = ghGraphQL(
          `mutation { createDiscussion(input: { repositoryId: "${repoId}", categoryId: "${generalCat.id}", title: "Talk to the repository", body: "This discussion is the main channel for interacting with the repository's autonomous agents.\\n\\nUse this thread to:\\n- Submit feature requests or ideas\\n- Ask questions about the project\\n- Chat with the discussions bot\\n\\n---\\n*Created by init --purge*" }) { discussion { number url } } }`,
        );
        const newDisc = createParsed?.data?.createDiscussion?.discussion;
        if (newDisc) {
          console.log(`  CREATED: discussion #${newDisc.number} — ${newDisc.url}`);
          initChanges++;
        }
      } else {
        initChanges++;
      }
    }
  } catch (err) {
    console.log(`  SKIP: Could not create discussion (${err.message})`);
  }

  // ── Enable GitHub Pages ───────────────────────────────────────────
  console.log("\n--- Enable GitHub Pages ---");
  try {
    if (!dryRun) {
      execSync(
        `gh api repos/${repoSlug}/pages -X POST -f build_type=legacy -f "source[branch]=main" -f "source[path]=/docs"`,
        { cwd: target, encoding: "utf8", timeout: 15000, stdio: ["pipe", "pipe", "pipe"] },
      );
      console.log(`  ENABLED: GitHub Pages from docs/ on main`);
      console.log(`  URL: https://${owner}.github.io/${repo}/`);
      initChanges++;
    } else {
      console.log(`  ENABLE: GitHub Pages from docs/ on main (dry run)`);
      console.log(`  URL: https://${owner}.github.io/${repo}/`);
      initChanges++;
    }
  } catch (err) {
    if (err.message?.includes("409") || err.stderr?.includes("409")) {
      console.log("  SKIP: GitHub Pages already enabled");
    } else {
      console.log(`  SKIP: Could not enable GitHub Pages (${err.message})`);
      console.log(`  Manual: Settings → Pages → Source: Deploy from branch, Branch: main, Folder: /docs`);
    }
  }
}

function runInit() {
  if (!existsSync(target)) {
    console.error(`Target directory does not exist: ${target}`);
    process.exit(1);
  }
  if (!existsSync(srcDir)) {
    console.error(`Source directory not found: ${srcDir}`);
    process.exit(1);
  }

  const agenticDir = resolve(target, ".github/agentic-lib");
  const seedsDir = resolve(srcDir, "seeds");
  initChanges = 0;

  console.log("");
  console.log("=== @xn-intenton-z2a/agentic-lib init ===");
  console.log(`Source:  ${srcDir}`);
  console.log(`Target:  ${target}`);
  console.log(`Reseed:  ${reseed}`);
  console.log(`Purge:   ${purge}`);
  if (purge) console.log(`Mission: ${mission}`);
  console.log(`Mode:    ${dryRun ? "DRY RUN" : "LIVE"}`);
  console.log("");

  // Capture existing init timestamp before any destructive operations (for idempotency).
  // The TOML [init] section is the authoritative record. If it matches the current
  // mode/mission/version, reuse its timestamp so that re-running init is a no-op.
  const pkg = JSON.parse(readFileSync(resolve(pkgRoot, "package.json"), "utf8"));
  let initTimestamp = null;
  const tomlPath = resolve(target, "agentic-lib.toml");
  if (existsSync(tomlPath)) {
    const tomlContent = readFileSync(tomlPath, "utf8");
    const tm = tomlContent.match(/^\[init\]\s*\ntimestamp\s*=\s*"([^"]+)"\s*\nmode\s*=\s*"([^"]+)"\s*\nmission\s*=\s*"([^"]+)"\s*\nversion\s*=\s*"([^"]+)"/m);
    const mode = purge ? "purge" : reseed ? "reseed" : null;
    if (tm && mode && tm[2] === mode && tm[3] === mission && tm[4] === pkg.version) {
      initTimestamp = tm[1];
    }
  }
  // Use a single timestamp for the entire init run (for consistency across files)
  if (!initTimestamp) initTimestamp = new Date().toISOString();

  initWorkflows();
  initActions(agenticDir);
  initDirContents("agents", resolve(agenticDir, "agents"), "Agents");
  initDirContents("seeds", resolve(agenticDir, "seeds"), "Seeds");
  initScripts(agenticDir);
  initConfig(seedsDir);
  if (reseed) initReseed(initTimestamp);
  if (purge) initPurge(seedsDir, mission, initTimestamp);
  if (purge) initPurgeGitHub();

  console.log(`\n${initChanges} change(s)${dryRun ? " (dry run)" : ""}`);

  if (!dryRun && initChanges > 0) {
    console.log("\nNext steps:");
    if (purge) console.log(`  cd ${target} && npm install`);
    console.log(`  cd ${resolve(agenticDir, "actions/agentic-step")} && npm ci`);
    console.log("  npm test");
  }
}
