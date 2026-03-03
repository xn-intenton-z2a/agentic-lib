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
const ALL_COMMANDS = [...INIT_COMMANDS, ...TASK_COMMANDS, "version"];

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

Options:
  --purge              Full reset — clear features, activity log, source code
  --reseed             Clear features + activity log (keep source code)
  --dry-run            Show what would be done without making changes
  --target <path>      Target repository (default: current directory)
  --model <name>       Copilot SDK model (default: claude-sonnet-4)

Examples:
  npx @xn-intenton-z2a/agentic-lib init
  npx @xn-intenton-z2a/agentic-lib transform
  npx @xn-intenton-z2a/agentic-lib maintain-features --model gpt-5-mini
  npx @xn-intenton-z2a/agentic-lib reset --dry-run
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

// ─── Task Commands ───────────────────────────────────────────────────

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

  console.log(`[config] schedule=${config.schedule}`);
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
    schedule: toml.schedule?.tier || "schedule-1",
    missionPath: toml.paths?.mission || "MISSION.md",
    sourcePath: toml.paths?.source || "src/lib/",
    testsPath: toml.paths?.tests || "tests/unit/",
    featuresPath: toml.paths?.features || "features/",
    libraryPath: toml.paths?.docs || "library/",
    sourcesPath: toml.paths?.["library-sources"] || "SOURCES.md",
    readmePath: toml.paths?.readme || "README.md",
    depsPath: toml.paths?.dependencies || "package.json",
    buildScript: toml.execution?.build || "npm run build",
    testScript: toml.execution?.test || "npm test",
    mainScript: toml.execution?.start || "npm run start",
    featureLimit: toml.limits?.["feature-issues"] || 2,
    intentionPath: toml.bot?.["log-file"] || "intentïon.md",
  };
}

function getWritablePathsFromConfig(config) {
  return [
    config.sourcePath,
    config.testsPath,
    config.featuresPath,
    config.libraryPath,
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
  const workflowsDir = resolve(srcDir, "workflows");
  if (!existsSync(workflowsDir)) return;
  const templateWorkflows = new Set();
  for (const f of readdirSync(workflowsDir)) {
    if (f.endsWith(".yml")) {
      templateWorkflows.add(f);
      initCopyFile(resolve(workflowsDir, f), resolve(target, ".github/workflows", f), `workflows/${f}`);
    }
  }
  const seedTest = resolve(srcDir, "seeds/test.yml");
  if (existsSync(seedTest)) {
    templateWorkflows.add("test.yml");
    initCopyFile(seedTest, resolve(target, ".github/workflows/test.yml"), "workflows/test.yml (from seeds)");
  }
  const seedInit = resolve(srcDir, "seeds/init.yml");
  if (existsSync(seedInit)) {
    templateWorkflows.add("init.yml");
    initCopyFile(seedInit, resolve(target, ".github/workflows/init.yml"), "workflows/init.yml (from seeds)");
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
  for (const f of readdirSync(dir)) {
    initCopyFile(resolve(dir, f), resolve(dstDir, f), `${srcSubdir}/${f}`);
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
  const tomlSeed = resolve(seedsDir, "zero-agentic-lib.toml");
  const tomlTarget = resolve(target, "agentic-lib.toml");
  if (existsSync(tomlSeed) && !existsSync(tomlTarget)) {
    initCopyFile(tomlSeed, tomlTarget, "agentic-lib.toml (new)");
  } else if (existsSync(tomlTarget)) {
    console.log("  SKIP: agentic-lib.toml already exists");
  } else {
    console.log("  SKIP: seed TOML not found");
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

function initReseed() {
  console.log("\n--- Reseed: Clear Features + Activity Log ---");
  removeFile(resolve(target, "intentïon.md"), "intentïon.md");
  clearDirContents(resolve(target, "features"), "features");

  // Clear old features location if it exists
  const oldFeaturesDir = resolve(target, ".github/agentic-lib/features");
  clearDirContents(oldFeaturesDir, ".github/agentic-lib/features (old location)");
  if (existsSync(oldFeaturesDir)) {
    if (!dryRun) rmdirSync(oldFeaturesDir);
    console.log("  REMOVE: .github/agentic-lib/features/ (old location)");
  }

  clearDirContents(resolve(target, "library"), "library");

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
  const tomlTarget = resolve(target, "agentic-lib.toml");
  if (existsSync(tomlTarget)) {
    try {
      const tomlContent = readFileSync(tomlTarget, "utf8");
      const sourceMatch = tomlContent.match(/^source\s*=\s*"([^"]+)"/m);
      const testsMatch = tomlContent.match(/^tests\s*=\s*"([^"]+)"/m);
      if (sourceMatch) sourcePath = sourceMatch[1];
      if (testsMatch) testsPath = testsMatch[1];
    } catch (err) {
      console.log(`  WARN: Could not read TOML for paths, using defaults: ${err.message}`);
    }
  }
  return { sourcePath, testsPath };
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

function initPurge(seedsDir) {
  console.log("\n--- Purge: Reset Source Files to Seed State ---");

  const { sourcePath, testsPath } = readTomlPaths();
  clearAndRecreateDir(sourcePath, sourcePath);
  clearAndRecreateDir(testsPath, testsPath);

  // Copy seed files (including config TOML)
  const SEED_MAP = {
    "zero-main.js": "src/lib/main.js",
    "zero-main.test.js": "tests/unit/main.test.js",
    "zero-MISSION.md": "MISSION.md",
    "zero-SOURCES.md": "SOURCES.md",
    "zero-package.json": "package.json",
    "zero-README.md": "README.md",
    "zero-agentic-lib.toml": "agentic-lib.toml",
  };
  for (const [seedFile, targetRel] of Object.entries(SEED_MAP)) {
    const src = resolve(seedsDir, seedFile);
    if (existsSync(src)) {
      initCopyFile(src, resolve(target, targetRel), `SEED: ${seedFile} → ${targetRel}`);
    }
  }
}

function initPurgeGitHub() {
  console.log("\n--- Purge: Close GitHub Issues + Lock Discussions ---");

  // Detect the GitHub repo from git remote
  let repoSlug = "";
  try {
    const remoteUrl = execSync("git remote get-url origin", {
      cwd: target,
      encoding: "utf8",
      timeout: 10000,
    }).trim();
    // Parse owner/repo from git@github.com:owner/repo.git or https://github.com/owner/repo.git
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

  // Check gh CLI is available
  try {
    execSync("gh --version", { encoding: "utf8", timeout: 5000, stdio: "pipe" });
  } catch {
    console.log("  SKIP: gh CLI not found — skipping GitHub purge");
    return;
  }

  // Close all open issues
  try {
    const issuesJson = execSync(
      `gh issue list --repo ${repoSlug} --state open --json number,title --limit 100`,
      { cwd: target, encoding: "utf8", timeout: 30000, stdio: ["pipe", "pipe", "pipe"] },
    );
    const issues = JSON.parse(issuesJson || "[]");
    if (issues.length === 0) {
      console.log("  No open issues to close");
    } else {
      for (const issue of issues) {
        console.log(`  CLOSE: issue #${issue.number} — ${issue.title}`);
        if (!dryRun) {
          try {
            execSync(
              `gh issue close ${issue.number} --repo ${repoSlug} --comment "Closed by init --purge (mission reset)"`,
              { cwd: target, encoding: "utf8", timeout: 15000, stdio: "pipe" },
            );
            initChanges++;
          } catch (err) {
            console.log(`  WARN: Failed to close issue #${issue.number}: ${err.message}`);
          }
        } else {
          initChanges++;
        }
      }
    }
  } catch (err) {
    console.log(`  WARN: Could not list issues: ${err.message}`);
  }

  // Close open discussions
  const [owner, repo] = repoSlug.split("/");
  try {
    const query = JSON.stringify({
      query: `{ repository(owner:"${owner}", name:"${repo}") { discussions(first:50, states:OPEN) { nodes { id number title } } } }`,
    });
    const result = execSync(`gh api graphql --input -`, {
      cwd: target,
      encoding: "utf8",
      timeout: 30000,
      input: query,
      stdio: ["pipe", "pipe", "pipe"],
    });
    const parsed = JSON.parse(result);
    const discussions = parsed?.data?.repository?.discussions?.nodes || [];
    if (discussions.length === 0) {
      console.log("  No open discussions to close");
    } else {
      for (const disc of discussions) {
        console.log(`  CLOSE: discussion #${disc.number} — ${disc.title}`);
        if (!dryRun) {
          try {
            const mutation = JSON.stringify({
              query: `mutation { closeDiscussion(input: { discussionId: "${disc.id}" }) { discussion { number } } }`,
            });
            execSync(`gh api graphql --input -`, {
              cwd: target,
              encoding: "utf8",
              timeout: 15000,
              input: mutation,
              stdio: ["pipe", "pipe", "pipe"],
            });
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
  console.log(`Mode:    ${dryRun ? "DRY RUN" : "LIVE"}`);
  console.log("");

  initWorkflows();
  initActions(agenticDir);
  initDirContents("agents", resolve(agenticDir, "agents"), "Agents");
  initDirContents("seeds", resolve(agenticDir, "seeds"), "Seeds");
  initScripts(agenticDir);
  initConfig(seedsDir);
  if (reseed) initReseed();
  if (purge) initPurge(seedsDir);
  if (purge) initPurgeGitHub();

  console.log(`\n${initChanges} change(s)${dryRun ? " (dry run)" : ""}`);

  if (!dryRun && initChanges > 0) {
    console.log("\nNext steps:");
    if (purge) console.log(`  cd ${target} && npm install`);
    console.log(`  cd ${resolve(agenticDir, "actions/agentic-step")} && npm ci`);
    console.log("  npm test");
  }
}
