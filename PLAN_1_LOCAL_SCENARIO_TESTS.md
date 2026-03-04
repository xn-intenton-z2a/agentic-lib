# Plan: Local Scenario Tests with Tiny LLM

## Problem Statement

Today, testing the full agentic iteration loop requires: merge agentic-lib → npm publish → npm update in repository0 → run init workflow → multiple workflow cycles. This takes 30+ minutes and many round-trips. The 277 unit tests mock `runCopilotTask()` entirely — they prove the plumbing but never exercise a real LLM calling real tools on real files.

We want to prove the iteration loop works locally in ~30 seconds using a tiny local LLM, with deliberately simple test missions. Non-determinism is expected and desired — the point is proving the mechanics, not producing great code.

## Architecture

### High-Level Flow

```
npm run test:scenario
  → scripts/scenario-runner.js
    → creates temp workspace (mktemp -d)
    → runs: node bin/agentic-lib.js init --purge --target <workspace>
    → writes MISSION.md into workspace
    → runs: node bin/agentic-lib.js <task> --target <workspace> --local-llm
    → checks assertions (file exists, file changed, valid JS)
    → cleans up workspace
```

### Key Design Decision: CLI Extension

The `--local-llm` flag routes through the same CLI path as `--model claude-sonnet-4`, but swaps the Copilot SDK backend for a local node-llama-cpp backend. This means:

- The same `buildTaskPrompt()` functions construct the prompt (lines 320-494 of `bin/agentic-lib.js`)
- The same tool definitions (`read_file`, `write_file`, `list_files`, `run_command`) are used
- Only the "send prompt, get response, execute tool calls" loop changes
- Scenarios exercise the real CLI end-to-end, just with a different LLM

### Why Not Just Mock

Mocking `runCopilotTask()` (which the 277 unit tests do) proves the task handlers, config loading, prompt building, and tool definitions work. But it cannot prove:

1. The tool call JSON the LLM produces is actually parseable by our tool handlers
2. The tool handlers correctly read/write files when called in sequence
3. The prompt is coherent enough that *any* model can follow it
4. The `--target` path resolution works end-to-end through tools
5. The safety checks (path writability, blocked git commands) fire correctly in practice

## LLM Backend: node-llama-cpp

### Why node-llama-cpp

| Option | Pros | Cons |
|--------|------|------|
| **node-llama-cpp** | npm-installable, prebuilt macOS binaries (Intel + Apple Silicon), built-in function calling with grammar-constrained generation, in-process (no HTTP) | Large-ish devDependency (~50MB native addon) |
| Ollama | Well-known, model management | External service dependency, HTTP overhead, user reports slow on their Mac |
| Siri/macOS LLM | Free, on-device | No programmatic API for tool-use conversations |
| Direct llama.cpp binding | Lightweight | Manual JSON schema enforcement, more code to maintain |

**Grammar-constrained generation** is the killer feature: node-llama-cpp forces the model to output valid JSON matching the tool call schema, even from tiny models. Without this, a 360M parameter model would produce malformed tool calls most of the time.

### Model Selection

**Primary: SmolLM2-360M-Instruct Q8_0** (~386MB GGUF)
- Smallest viable instruction-following model
- Q8_0 quantisation preserves tool-calling ability
- Source: HuggingFace (bartowski/SmolLM2-360M-Instruct-GGUF or similar)
- Performance: ~10-30 tokens/sec on 2019 Intel Mac CPU

**Fallback: Qwen2.5-0.5B-Instruct Q4_K_M** (~400MB GGUF)
- Better instruction following if SmolLM2 is too unreliable
- Slightly larger but still fast on CPU

**Model download strategy:**
- Models are NOT committed to git (they're ~400MB)
- `npm run scenario:download-model` downloads the model to `models/` (gitignored)
- Scenario runner checks for model file and prints helpful error if missing
- CI can cache the model directory between runs

### Performance Budget

| Phase | Target | Notes |
|-------|--------|-------|
| Model load | 2-5s | One-time per test run, cached in memory |
| Prompt tokenisation | <1s | Prompts are ~2-4KB |
| Generation (per tool call) | 2-5s | ~50-200 tokens per response at 10-30 tok/s |
| Tool execution | <0.5s | File I/O, no network |
| Total per scenario | 10-20s | 2-4 tool call rounds typical |
| Full suite (3 scenarios) | 30-45s | Model loaded once, reused |

## File Inventory

### New Files

#### `src/actions/agentic-step/local-llm.js`

Purpose: Drop-in replacement for `runCopilotTask()` that uses node-llama-cpp.

```js
// local-llm.js — Local LLM backend using node-llama-cpp
//
// Provides runLocalLlmTask() with the same interface as runCopilotTask():
//   { model, systemMessage, prompt, writablePaths }
//   → { content, tokensUsed }
//
// Uses grammar-constrained generation to force valid tool call JSON.

import { getLlama, LlamaChatSession } from "node-llama-cpp";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MODELS_DIR = resolve(__dirname, "../../../models");

// Model resolution: check env var, then default path
function resolveModelPath() {
  if (process.env.LOCAL_LLM_MODEL) return resolve(process.env.LOCAL_LLM_MODEL);
  const defaultModel = resolve(MODELS_DIR, "smollm2-360m-instruct-q8_0.gguf");
  if (!existsSync(defaultModel)) {
    throw new Error(
      `Model not found at ${defaultModel}.\n` +
      `Run: npm run scenario:download-model\n` +
      `Or set LOCAL_LLM_MODEL=/path/to/model.gguf`
    );
  }
  return defaultModel;
}

let _llama = null;   // singleton — expensive to create
let _model = null;

async function getOrLoadModel() {
  if (_model) return _model;
  const modelPath = resolveModelPath();
  console.log(`[local-llm] Loading model from ${modelPath}`);
  _llama = await getLlama();
  _model = await _llama.loadModel({ modelPath });
  console.log(`[local-llm] Model loaded`);
  return _model;
}

export async function runLocalLlmTask({
  systemMessage, prompt, writablePaths, tools
}) {
  const model = await getOrLoadModel();
  const context = await model.createContext();
  const session = new LlamaChatSession({ contextSequence: context.getSequence() });

  // Register tools using node-llama-cpp's function calling
  // (details depend on exact API — see implementation section below)

  // The conversation loop:
  // 1. Send system message + prompt
  // 2. Model responds with text or tool call
  // 3. If tool call: execute tool, feed result back
  // 4. Repeat until model responds with final text (no tool call)
  // 5. Return { content, tokensUsed }
}
```

Key implementation details:
- **Singleton model**: The model is loaded once and reused across scenarios. Loading takes 2-5s; we don't want to pay that per-scenario.
- **Tool calling loop**: node-llama-cpp's `LlamaChatSession` supports function calling via `defineChatSessionFunction()`. The grammar engine constrains generation to valid JSON matching the function schemas.
- **Max iterations**: Cap at 10 tool call rounds to prevent infinite loops from confused tiny models.
- **Timeout**: 60s total per task invocation as a safety net.

#### `src/actions/agentic-step/local-tools.js`

Purpose: Bridge between the tool definitions in `tools.js` (which use Copilot SDK's `defineTool()`) and node-llama-cpp's `defineChatSessionFunction()`.

```js
// local-tools.js — Adapt our tool handlers for node-llama-cpp
//
// The existing tools.js uses Copilot SDK's defineTool() format.
// This module wraps the same handler logic for node-llama-cpp's
// defineChatSessionFunction() format.

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "fs";
import { execSync } from "child_process";
import { dirname, resolve } from "path";
import { isPathWritable } from "./safety.js";

/**
 * Register filesystem tools on a LlamaChatSession.
 *
 * @param {LlamaChatSession} session - node-llama-cpp chat session
 * @param {string} targetDir - The workspace root (absolute path)
 * @param {string[]} writablePaths - Relative paths that are writable
 */
export function registerLocalTools(session, targetDir, writablePaths) {
  // read_file
  session.defineChatSessionFunction({
    name: "read_file",
    description: "Read the contents of a file.",
    params: {
      type: "object",
      properties: { path: { type: "string" } },
      required: ["path"],
    },
    handler: ({ path }) => {
      const resolved = resolve(targetDir, path);
      if (!existsSync(resolved)) return JSON.stringify({ error: `Not found: ${path}` });
      return JSON.stringify({ content: readFileSync(resolved, "utf8") });
    },
  });

  // write_file
  session.defineChatSessionFunction({
    name: "write_file",
    description: "Write content to a file.",
    params: {
      type: "object",
      properties: {
        path: { type: "string" },
        content: { type: "string" },
      },
      required: ["path", "content"],
    },
    handler: ({ path, content }) => {
      const resolved = resolve(targetDir, path);
      const absWritable = writablePaths.map(wp => resolve(targetDir, wp));
      if (!isPathWritable(resolved, absWritable)) {
        return JSON.stringify({ error: `Not writable: ${path}` });
      }
      const dir = dirname(resolved);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      writeFileSync(resolved, content, "utf8");
      return JSON.stringify({ success: true });
    },
  });

  // list_files
  session.defineChatSessionFunction({
    name: "list_files",
    description: "List files in a directory.",
    params: {
      type: "object",
      properties: { path: { type: "string" } },
      required: ["path"],
    },
    handler: ({ path }) => {
      const resolved = resolve(targetDir, path);
      if (!existsSync(resolved)) return JSON.stringify({ error: `Not found: ${path}` });
      const entries = readdirSync(resolved, { withFileTypes: true });
      return JSON.stringify({ files: entries.map(e => e.isDirectory() ? `${e.name}/` : e.name) });
    },
  });

  // run_command
  session.defineChatSessionFunction({
    name: "run_command",
    description: "Run a shell command.",
    params: {
      type: "object",
      properties: { command: { type: "string" } },
      required: ["command"],
    },
    handler: ({ command }) => {
      const blocked = /\bgit\s+(commit|push|add|reset|checkout|rebase|merge|stash)\b/;
      if (blocked.test(command)) {
        return JSON.stringify({ error: "Git write commands blocked" });
      }
      try {
        const stdout = execSync(command, { cwd: targetDir, encoding: "utf8", timeout: 30000 });
        return JSON.stringify({ stdout, exitCode: 0 });
      } catch (err) {
        return JSON.stringify({ stderr: err.stderr || "", exitCode: err.status || 1 });
      }
    },
  });
}
```

Note: The exact `defineChatSessionFunction` API may differ from the sketch above. The node-llama-cpp docs should be consulted during implementation. The key point is that we reuse the same handler logic from `tools.js` and `safety.js`.

#### `scripts/scenario-runner.js`

Purpose: Orchestrate scenario execution. Creates temp workspaces, invokes the CLI, checks assertions.

```js
// scripts/scenario-runner.js — Run local LLM scenario tests
//
// Usage:
//   node scripts/scenario-runner.js                    # all scenarios
//   node scripts/scenario-runner.js maintain-features   # single scenario
//   node scripts/scenario-runner.js transform
//   node scripts/scenario-runner.js full-loop

import { mkdtempSync, rmSync, existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { execSync } from "child_process";
import { resolve, join } from "path";
import { tmpdir } from "os";

const PKG_ROOT = resolve(import.meta.dirname, "..");
const CLI = resolve(PKG_ROOT, "bin/agentic-lib.js");
const SCENARIOS = {
  "maintain-features": runMaintainFeatures,
  "transform": runTransform,
  "full-loop": runFullLoop,
};

// Parse args
const requested = process.argv[2];
const toRun = requested ? { [requested]: SCENARIOS[requested] } : SCENARIOS;
if (requested && !SCENARIOS[requested]) {
  console.error(`Unknown scenario: ${requested}`);
  console.error(`Available: ${Object.keys(SCENARIOS).join(", ")}`);
  process.exit(1);
}

let passed = 0;
let failed = 0;

for (const [name, fn] of Object.entries(toRun)) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`SCENARIO: ${name}`);
  console.log("=".repeat(60));

  const workspace = mkdtempSync(join(tmpdir(), "scenario-"));
  try {
    // Init workspace
    initWorkspace(workspace);

    // Run scenario
    const startTime = Date.now();
    const result = await fn(workspace);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    if (result.pass) {
      console.log(`  PASS (${elapsed}s)`);
      passed++;
    } else {
      console.log(`  FAIL: ${result.reason} (${elapsed}s)`);
      failed++;
    }
  } catch (err) {
    console.error(`  ERROR: ${err.message}`);
    failed++;
  } finally {
    rmSync(workspace, { recursive: true, force: true });
  }
}

console.log(`\n${"=".repeat(60)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);

// ── Helpers ───────────────────────────────────────────────────

function initWorkspace(workspace) {
  // Create minimal git repo (some tools expect it)
  execSync("git init --quiet", { cwd: workspace });
  execSync('git config user.email "test@test.com"', { cwd: workspace });
  execSync('git config user.name "Test"', { cwd: workspace });

  // Run init --purge
  execSync(`node ${CLI} init --purge --target ${workspace}`, {
    cwd: workspace,
    stdio: "pipe",
  });
}

function writeMission(workspace, missionText) {
  writeFileSync(resolve(workspace, "MISSION.md"), missionText, "utf8");
}

function runCli(workspace, task) {
  return execSync(
    `node ${CLI} ${task} --target ${workspace} --local-llm`,
    { cwd: workspace, encoding: "utf8", timeout: 60000 }
  );
}

// ── Assertions ────────────────────────────────────────────────

function assertFileExists(workspace, relPath) {
  return existsSync(resolve(workspace, relPath));
}

function assertFileChanged(workspace, relPath, originalContent) {
  const current = readFileSync(resolve(workspace, relPath), "utf8");
  return current !== originalContent;
}

function assertValidJs(workspace, relPath) {
  // Check that the file is parseable JavaScript
  try {
    const content = readFileSync(resolve(workspace, relPath), "utf8");
    // Use Node's built-in parser via dynamic import check
    // or just check for basic syntax with a subprocess
    execSync(`node --check ${resolve(workspace, relPath)}`, { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

function assertDirHasFiles(workspace, relDir, extension, minCount = 1) {
  const dir = resolve(workspace, relDir);
  if (!existsSync(dir)) return false;
  const { readdirSync } = await import("fs");
  const files = readdirSync(dir).filter(f => f.endsWith(extension));
  return files.length >= minCount;
}
```

#### `scenarios/scenario-maintain-features.js`

Note: The scenarios are defined inline in `scenario-runner.js` as functions, not as separate files. This keeps the implementation simple — each scenario is a function that takes a workspace path and returns `{ pass, reason }`. If scenarios grow complex, they can be extracted to `scenarios/` later.

The scenarios in `scenario-runner.js`:

```js
async function runMaintainFeatures(workspace) {
  // Mission: deliberately simple so even a tiny model can follow it
  writeMission(workspace, [
    "# Mission: String Reverser",
    "",
    "Build a function that reverses a string.",
    "",
    "## Requirements",
    "- Export a function `reverseString(s)` that returns the reversed input",
    "- Handle empty string input",
  ].join("\n"));

  // Capture state before
  const featuresBefore = existsSync(resolve(workspace, "features"))
    ? readdirSync(resolve(workspace, "features")).length
    : 0;

  // Run maintain-features
  runCli(workspace, "maintain-features");

  // Assert: at least one feature file was created
  const featuresDir = resolve(workspace, "features");
  if (!existsSync(featuresDir)) {
    return { pass: false, reason: "features/ directory does not exist" };
  }
  const featureFiles = readdirSync(featuresDir).filter(f => f.endsWith(".md"));
  if (featureFiles.length <= featuresBefore) {
    return { pass: false, reason: `No new feature files (before=${featuresBefore}, after=${featureFiles.length})` };
  }

  return { pass: true };
}

async function runTransform(workspace) {
  writeMission(workspace, [
    "# Mission: Hello World",
    "",
    "Make src/lib/main.js export a function `hello()` that returns 'Hello, World!'.",
  ].join("\n"));

  // Write a simple feature file to guide the transform
  mkdirSync(resolve(workspace, "features"), { recursive: true });
  writeFileSync(resolve(workspace, "features/hello.md"), [
    "# Feature: Hello Function",
    "",
    "Export a function `hello()` from `src/lib/main.js` that returns the string 'Hello, World!'.",
  ].join("\n"), "utf8");

  // Capture original source
  const originalSource = readFileSync(resolve(workspace, "src/lib/main.js"), "utf8");

  // Run transform
  runCli(workspace, "transform");

  // Assert: source file was modified
  const newSource = readFileSync(resolve(workspace, "src/lib/main.js"), "utf8");
  if (newSource === originalSource) {
    return { pass: false, reason: "src/lib/main.js was not modified" };
  }

  // Assert: result is valid JS (parseable)
  try {
    execSync(`node --check ${resolve(workspace, "src/lib/main.js")}`, { stdio: "pipe" });
  } catch {
    return { pass: false, reason: "src/lib/main.js is not valid JavaScript" };
  }

  return { pass: true };
}

async function runFullLoop(workspace) {
  writeMission(workspace, [
    "# Mission: Add Function",
    "",
    "Make src/lib/main.js export a function `add(a, b)` that returns a + b.",
  ].join("\n"));

  // Step 1: maintain-features
  runCli(workspace, "maintain-features");
  const featuresDir = resolve(workspace, "features");
  if (!existsSync(featuresDir) || readdirSync(featuresDir).length === 0) {
    return { pass: false, reason: "maintain-features did not create any features" };
  }

  // Step 2: transform
  const originalSource = readFileSync(resolve(workspace, "src/lib/main.js"), "utf8");
  runCli(workspace, "transform");
  const newSource = readFileSync(resolve(workspace, "src/lib/main.js"), "utf8");
  if (newSource === originalSource) {
    return { pass: false, reason: "transform did not modify source" };
  }

  // Step 3: source is valid JS
  try {
    execSync(`node --check ${resolve(workspace, "src/lib/main.js")}`, { stdio: "pipe" });
  } catch {
    return { pass: false, reason: "source is not valid JS after transform" };
  }

  return { pass: true };
}
```

### Modified Files

#### `bin/agentic-lib.js`

Add `--local-llm` flag. Changes to the `runTask()` function:

```diff
 // Parse flags
 const dryRun = flags.includes("--dry-run");
+const localLlm = flags.includes("--local-llm");
 const targetIdx = flags.indexOf("--target");
```

In the `runTask()` function, after building the prompt (line ~152), add a branch:

```diff
   if (dryRun) {
     console.log("=== DRY RUN — prompt constructed but not sent ===");
     console.log("");
     console.log(prompt);
     return 0;
   }

+  if (localLlm) {
+    console.log("=== LOCAL LLM MODE ===");
+    const { runLocalLlmTask } = await import("../src/actions/agentic-step/local-llm.js");
+    try {
+      const result = await runLocalLlmTask({
+        systemMessage,
+        prompt,
+        writablePaths: writablePaths.map(wp => resolve(target, wp)),
+        targetDir: target,
+      });
+      console.log(`\n=== ${taskName} completed (${result.tokensUsed} tokens) ===`);
+      console.log(result.content);
+      return 0;
+    } catch (err) {
+      console.error(`\n=== ${taskName} FAILED ===`);
+      console.error(err.message);
+      return 1;
+    }
+  }
+
   // Find the Copilot SDK (existing code continues...)
```

Update the HELP text:

```diff
 Options:
   --purge              Full reset — clear features, activity log, source code
   --reseed             Clear features + activity log (keep source code)
   --dry-run            Show what would be done without making changes
   --target <path>      Target repository (default: current directory)
   --model <name>       Copilot SDK model (default: claude-sonnet-4)
+  --local-llm          Use local LLM (node-llama-cpp) instead of Copilot SDK
```

#### `package.json`

```diff
 "devDependencies": {
+  "node-llama-cpp": "^3.0.0",
   "@microsoft/eslint-formatter-sarif": "^3.1.0",
   ...
 },
 "scripts": {
+  "test:scenario": "node scripts/scenario-runner.js",
+  "test:scenario:maintain": "node scripts/scenario-runner.js maintain-features",
+  "test:scenario:transform": "node scripts/scenario-runner.js transform",
+  "test:scenario:loop": "node scripts/scenario-runner.js full-loop",
+  "scenario:download-model": "node scripts/download-model.js",
   ...
 }
```

#### `.gitignore`

```diff
+# Local LLM models (large binary files)
+models/
+*.gguf
```

### Optional New File

#### `scripts/download-model.js`

Purpose: Download the GGUF model file from HuggingFace.

```js
// scripts/download-model.js — Download SmolLM2-360M model for local scenario tests
//
// Downloads to models/smollm2-360m-instruct-q8_0.gguf (~386MB)

import { mkdirSync, existsSync, createWriteStream } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { get } from "https";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MODELS_DIR = resolve(__dirname, "../models");
const MODEL_FILE = "smollm2-360m-instruct-q8_0.gguf";
const MODEL_PATH = resolve(MODELS_DIR, MODEL_FILE);

// HuggingFace direct download URL (to be confirmed during implementation)
const MODEL_URL =
  "https://huggingface.co/bartowski/SmolLM2-360M-Instruct-GGUF/resolve/main/SmolLM2-360M-Instruct-Q8_0.gguf";

if (existsSync(MODEL_PATH)) {
  console.log(`Model already exists: ${MODEL_PATH}`);
  process.exit(0);
}

mkdirSync(MODELS_DIR, { recursive: true });
console.log(`Downloading ${MODEL_FILE} (~386MB)...`);
console.log(`From: ${MODEL_URL}`);
console.log(`To:   ${MODEL_PATH}`);

// Download with progress reporting
// (implementation: follow redirects, report MB downloaded)
```

## Three Test Scenarios

### 1. maintain-features (~10-15s)

**Mission:** "Build a function that reverses a string."

**What it exercises:**
- CLI flag parsing and config loading
- `buildMaintainFeaturesPrompt()` prompt construction
- Local LLM receives prompt and makes tool calls
- `write_file` tool creates markdown files in `features/`
- Path writability check allows writing to `features/`

**Assertions (deliberately loose):**
- `features/` directory exists
- At least 1 `.md` file was created in `features/`

**Why this mission:** Short, concrete, unambiguous. Even a 360M model can understand "create a feature file about string reversal" given the structured prompt from `buildMaintainFeaturesPrompt()`.

### 2. transform (~10-20s)

**Mission:** "Make src/lib/main.js export a function `hello()` that returns 'Hello, World!'."

**What it exercises:**
- `buildTransformPrompt()` prompt construction with existing source code context
- `read_file` tool reads current source
- `write_file` tool modifies source
- Path writability check allows `src/lib/`
- `run_command` tool runs `npm test` (seed test will pass with echo stub)

**Assertions:**
- `src/lib/main.js` content changed from seed state
- `src/lib/main.js` is valid JavaScript (`node --check`)

**Why this mission:** "Write a function that returns a string" is one of the simplest possible code generation tasks. The seed `main.js` is a near-empty placeholder, so any modification is detectable.

### 3. full-loop (~20-30s)

**Mission:** "Make src/lib/main.js export a function `add(a, b)` that returns a + b."

**What it exercises:**
- Both `maintain-features` and `transform` in sequence
- The transform task sees features created by maintain-features
- Model reloading is avoided (singleton pattern)

**Assertions:**
- Feature files exist after maintain-features
- Source changed after transform
- Source is valid JavaScript

**Why this mission:** Different from scenario 2 to avoid any caching effects. Tests the full pipeline: mission → features → code.

## npm Scripts

```
test:scenario              — Run all 3 scenarios (~30-45s)
test:scenario:maintain     — Just maintain-features (~10-15s)
test:scenario:transform    — Just transform (~10-20s)
test:scenario:loop         — Full loop (~20-30s)
scenario:download-model    — Pre-download the GGUF model (~386MB)
```

## Risks and Mitigations

### Risk 1: Tiny model produces garbage tool calls
**Likelihood:** Medium — 360M is very small
**Mitigation:** Grammar-constrained generation in node-llama-cpp forces valid JSON. The tool schemas are simple (just `path` and `content` strings). If SmolLM2 is unreliable, fall back to Qwen2.5-0.5B.
**Detection:** Scenario assertions fail. Error messages from the tool call loop are logged.

### Risk 2: Model writes correct JSON but semantically wrong content
**Likelihood:** High — tiny models are not good coders
**Mitigation:** Assertions are deliberately loose. We check "file was modified" and "file is valid JS", not "function works correctly". The point is proving mechanics, not code quality.

### Risk 3: node-llama-cpp API has changed or doesn't work as expected
**Likelihood:** Low-medium — node-llama-cpp v3 is actively maintained
**Mitigation:** Implementation should consult the actual node-llama-cpp docs. The code sketches in this plan are illustrative, not exact API usage. Pin the dependency version.

### Risk 4: node-llama-cpp native addon doesn't build on all platforms
**Likelihood:** Low on macOS (prebuilt binaries exist), medium on Linux CI
**Mitigation:** It's a devDependency only. Scenario tests are optional (not part of `npm test`). CI can skip them if the dependency isn't available. Add `|| true` or check for model presence before running.

### Risk 5: Model download is slow or URL changes
**Likelihood:** Medium
**Mitigation:** The download script is idempotent (skip if file exists). HuggingFace URLs are stable. CI can cache `models/`. A `LOCAL_LLM_MODEL` env var allows pointing to any model file.

### Risk 6: 60s timeout is too short for slow machines
**Likelihood:** Low — even at 10 tok/s, 60s = 600 tokens, enough for 2-3 simple tool calls
**Mitigation:** The timeout is configurable via an env var (`LOCAL_LLM_TIMEOUT`). Log timing for each phase so slow steps are visible.

## What This Tests vs What It Doesn't

### Tests (proves mechanics work)
- CLI flag parsing, config loading, TOML parsing
- Prompt construction for maintain-features and transform
- Tool definitions are callable and produce correct responses
- Path writability enforcement works end-to-end
- Blocked git command detection works
- `--target` path resolution through the entire stack
- File I/O tools create/modify real files on real filesystem
- The task pipeline (maintain-features → transform) works in sequence

### Does NOT Test
- Copilot SDK authentication or session management
- Copilot SDK's tool calling protocol (different from node-llama-cpp's)
- Model quality or code correctness
- GitHub Actions workflow integration
- Network connectivity or API availability
- Concurrent execution or race conditions
- Large codebases or complex missions

## Implementation Order

1. **Add `node-llama-cpp` devDependency** — `npm install --save-dev node-llama-cpp`
2. **Create `scripts/download-model.js`** — model download script
3. **Download model** — `npm run scenario:download-model`
4. **Create `src/actions/agentic-step/local-llm.js`** — local LLM backend
5. **Create `src/actions/agentic-step/local-tools.js`** — tool bridge
6. **Modify `bin/agentic-lib.js`** — add `--local-llm` flag
7. **Create `scripts/scenario-runner.js`** — scenario orchestrator
8. **Run first scenario** — `npm run test:scenario:maintain`
9. **Debug and iterate** — expect 2-3 rounds of adjusting prompts/timeouts
10. **Add remaining scenarios** — transform, full-loop
11. **Update `.gitignore`** — add `models/` and `*.gguf`
12. **Update `package.json` scripts** — add all `test:scenario:*` entries

## Open Questions for Implementation

1. **Exact node-llama-cpp function calling API** — The `defineChatSessionFunction` API in the sketches above is approximate. The implementer should check the node-llama-cpp v3 docs for the exact method signatures and tool calling protocol.

2. **HuggingFace model URL** — The exact download URL for SmolLM2-360M-Instruct Q8_0 should be verified. The bartowski GGUF collection on HuggingFace is the most likely source.

3. **CI integration** — Should scenario tests run in CI? If so, the model needs to be cached. This can be deferred to a follow-up.

4. **node-llama-cpp minimum version** — Pin to the exact version that's verified to work. The v3 API may have breaking changes between minor versions.
