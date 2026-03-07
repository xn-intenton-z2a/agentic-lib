# Spike: Validate node-llama-cpp + SmolLM2 for Local Scenario Tests

## Purpose

De-risk the main plan (PLAN_1_LOCAL_SCENARIO_TESTS.md) by answering the critical unknowns before committing to the full implementation. The spike produces a standalone script that proves (or disproves) that a tiny local LLM can make valid tool calls through node-llama-cpp's function calling API.

## Questions to Answer

1. **Does `node-llama-cpp` install cleanly as a devDependency?** (prebuilt binaries for macOS Intel + Apple Silicon)
2. **Does SmolLM2-360M-Instruct produce usable tool calls** via node-llama-cpp's grammar-constrained function calling?
3. **What does the actual API look like?** The main plan's sketches used `session.defineChatSessionFunction()` — the real API is `defineChatSessionFunction()` as a standalone import, with functions passed to `session.prompt()`.
4. **What's the real performance?** Model load time, tokens/sec, total time for a simple tool-calling conversation.
5. **Can `local-llm.js` live in `src/actions/agentic-step/` while `node-llama-cpp` is in root `devDependencies`?** (Module resolution across nested package.json boundaries.)

## API Corrections from Research

The main plan's code sketches have several inaccuracies. The correct node-llama-cpp v3 API (verified against [docs](https://node-llama-cpp.withcat.ai/guide/function-calling)):

### Wrong (from main plan)
```js
// Plan assumed functions are registered on the session
session.defineChatSessionFunction({ name: "read_file", ... });
const response = await session.sendMessage("...");
```

### Correct (actual API)
```js
import { getLlama, LlamaChatSession, defineChatSessionFunction } from "node-llama-cpp";

// Functions are standalone objects, passed to prompt()
const functions = {
  read_file: defineChatSessionFunction({
    description: "Read the contents of a file.",
    params: {
      type: "object",
      properties: {
        path: { type: "string" }
      }
    },
    async handler({ path }) {
      return { content: readFileSync(resolve(targetDir, path), "utf8") };
    }
  })
};

// Session created with systemPrompt (string, not object)
const session = new LlamaChatSession({
  contextSequence: context.getSequence(),
  systemPrompt: "You are a code transformation agent..."
});

// Functions passed per-prompt call, not at session creation
const response = await session.prompt("Transform the code...", {
  functions,
  maxParallelFunctionCalls: 1
});
// response is a string (the final text after all tool calls complete)
```

### Key Differences from Main Plan

| Aspect | Main Plan Assumed | Actual API |
|--------|------------------|------------|
| Function registration | `session.defineChatSessionFunction()` | `defineChatSessionFunction()` standalone import |
| Function passing | Registered on session | Passed to `session.prompt(options.functions)` |
| System message | `{ content: "..." }` object | Plain string via `systemPrompt` constructor param |
| Response method | `session.sendMessage()` / `session.sendAndWait()` | `session.prompt()` returns string |
| Tool call loop | Manual loop in our code | Handled internally by node-llama-cpp |
| Conversation state | Manual management | Automatic — session maintains history |

### Critical Implication

node-llama-cpp **handles the tool call loop internally**. When the model generates a function call, node-llama-cpp:
1. Parses it (grammar-constrained to valid JSON)
2. Calls our handler
3. Feeds the result back to the model
4. Repeats until the model produces a final text response

This means `local-llm.js` is **much simpler** than the main plan anticipated — no manual conversation loop needed.

## Model Details

**SmolLM2-360M-Instruct Q8_0**
- Source: [bartowski/SmolLM2-360M-Instruct-GGUF](https://huggingface.co/bartowski/SmolLM2-360M-Instruct-GGUF)
- File: `SmolLM2-360M-Instruct-Q8_0.gguf`
- Size: 386 MB
- SmolLM2-Instruct was specifically trained on function calling datasets (Synth-APIGen-v0.1)
- Download: `npx node-llama-cpp pull --dir ./models hf:bartowski/SmolLM2-360M-Instruct-GGUF:Q8_0`

Alternative: node-llama-cpp has built-in model resolution via `resolveModelFile("hf:bartowski/SmolLM2-360M-Instruct-GGUF:Q8_0", modelsDir)` which auto-downloads on first use.

## Spike Script

A single self-contained script: `scripts/spike-local-llm.js`

### What It Does

1. Installs `node-llama-cpp` (if not already)
2. Downloads SmolLM2-360M-Instruct Q8_0 (if not already)
3. Creates a temp directory with a simple `main.js` file
4. Defines two tools: `read_file` and `write_file`
5. Sends a prompt: "Read main.js, then rewrite it to export a hello() function"
6. Reports: did it call the tools? did it produce valid output? how long did it take?

### Skeleton

```js
#!/usr/bin/env node
// scripts/spike-local-llm.js — Spike: validate node-llama-cpp function calling
//
// Run: node scripts/spike-local-llm.js
// Prereq: npm install --save-dev node-llama-cpp

import { getLlama, LlamaChatSession, defineChatSessionFunction, resolveModelFile } from "node-llama-cpp";
import { mkdtempSync, rmSync, readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";
import { tmpdir } from "os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MODELS_DIR = resolve(__dirname, "../models");
const MODEL_URI = "hf:bartowski/SmolLM2-360M-Instruct-GGUF:Q8_0";

// ── Phase 1: Load Model ─────────────────────────────────────────────

console.log("=== Phase 1: Load Model ===");
const t0 = Date.now();

mkdirSync(MODELS_DIR, { recursive: true });
const modelPath = await resolveModelFile(MODEL_URI, MODELS_DIR);
console.log(`Model path: ${modelPath}`);

const llama = await getLlama();
const model = await llama.loadModel({ modelPath });
const context = await model.createContext();

const loadTime = ((Date.now() - t0) / 1000).toFixed(1);
console.log(`Model loaded in ${loadTime}s`);

// ── Phase 2: Set Up Workspace ───────────────────────────────────────

console.log("\n=== Phase 2: Set Up Workspace ===");
const workspace = mkdtempSync(join(tmpdir(), "spike-llm-"));
writeFileSync(join(workspace, "main.js"), '// placeholder\nexport function placeholder() { return null; }\n');
console.log(`Workspace: ${workspace}`);
console.log(`Initial main.js: ${readFileSync(join(workspace, "main.js"), "utf8").trim()}`);

// ── Phase 3: Define Tools ───────────────────────────────────────────

console.log("\n=== Phase 3: Define Tools ===");
const toolCalls = [];

const functions = {
  read_file: defineChatSessionFunction({
    description: "Read the contents of a file at the given path, relative to the workspace root.",
    params: {
      type: "object",
      properties: {
        path: { type: "string" }
      }
    },
    async handler({ path }) {
      const resolved = resolve(workspace, path);
      console.log(`  [tool] read_file(${path})`);
      toolCalls.push({ tool: "read_file", path });
      if (!existsSync(resolved)) return JSON.stringify({ error: `Not found: ${path}` });
      return JSON.stringify({ content: readFileSync(resolved, "utf8") });
    }
  }),

  write_file: defineChatSessionFunction({
    description: "Write content to a file at the given path, relative to the workspace root.",
    params: {
      type: "object",
      properties: {
        path: { type: "string" },
        content: { type: "string" }
      }
    },
    async handler({ path, content }) {
      const resolved = resolve(workspace, path);
      console.log(`  [tool] write_file(${path}, ${content.length} chars)`);
      toolCalls.push({ tool: "write_file", path, contentLength: content.length });
      const dir = dirname(resolved);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      writeFileSync(resolved, content, "utf8");
      return JSON.stringify({ success: true });
    }
  })
};

console.log(`Defined ${Object.keys(functions).length} tools: ${Object.keys(functions).join(", ")}`);

// ── Phase 4: Run Prompt ─────────────────────────────────────────────

console.log("\n=== Phase 4: Run Prompt ===");
const session = new LlamaChatSession({
  contextSequence: context.getSequence(),
  systemPrompt: "You are a code transformation agent. You have tools to read and write files. Use them to complete the task."
});

const t1 = Date.now();
const prompt = [
  "Read the file 'main.js' to see its current contents.",
  "Then rewrite it to export a function hello() that returns the string 'Hello, World!'.",
  "Use the write_file tool to save your changes to 'main.js'.",
].join(" ");

console.log(`Prompt: ${prompt}`);
console.log("Sending...");

let response;
try {
  response = await session.prompt(prompt, {
    functions,
    maxParallelFunctionCalls: 1,
    maxTokens: 512,
    temperature: 0.3
  });
} catch (err) {
  console.error(`ERROR: ${err.message}`);
  response = null;
}

const promptTime = ((Date.now() - t1) / 1000).toFixed(1);

// ── Phase 5: Report ─────────────────────────────────────────────────

console.log("\n=== Phase 5: Results ===");
console.log(`Response: ${response || "(no response)"}`);
console.log(`Tool calls made: ${toolCalls.length}`);
for (const tc of toolCalls) {
  console.log(`  - ${tc.tool}(${tc.path}${tc.contentLength ? `, ${tc.contentLength} chars` : ""})`);
}

const finalContent = existsSync(join(workspace, "main.js"))
  ? readFileSync(join(workspace, "main.js"), "utf8")
  : "(file not found)";
console.log(`\nFinal main.js:\n${finalContent}`);

const fileChanged = finalContent !== '// placeholder\nexport function placeholder() { return null; }\n';
const hasHello = finalContent.includes("hello") || finalContent.includes("Hello");
const validJs = (() => {
  try {
    const { execSync } = await import("child_process");
    execSync(`node --check ${join(workspace, "main.js")}`, { stdio: "pipe" });
    return true;
  } catch { return false; }
})();

console.log("\n=== Verdict ===");
console.log(`Model load:    ${loadTime}s`);
console.log(`Prompt time:   ${promptTime}s`);
console.log(`Tool calls:    ${toolCalls.length} (expected: 2 — read + write)`);
console.log(`File changed:  ${fileChanged ? "YES" : "NO"}`);
console.log(`Has 'hello':   ${hasHello ? "YES" : "NO"}`);
console.log(`Valid JS:      ${validJs ? "YES" : "NO"}`);
console.log("");

const pass = toolCalls.length >= 2 && fileChanged;
console.log(pass
  ? "SPIKE PASSED — function calling works with this model"
  : "SPIKE FAILED — function calling did not produce expected results"
);

// ── Cleanup ─────────────────────────────────────────────────────────

rmSync(workspace, { recursive: true, force: true });
await context.dispose();
await model.dispose();
await llama.dispose();

process.exit(pass ? 0 : 1);
```

## Implementation Steps

1. **Install node-llama-cpp** — `npm install --save-dev node-llama-cpp` in agentic-lib root
2. **Add `models/` to `.gitignore`**
3. **Create `scripts/spike-local-llm.js`** — the script above
4. **Add npm script** — `"test:spike-llm": "node scripts/spike-local-llm.js"` in package.json
5. **Run the spike** — `npm run test:spike-llm`
6. **Record results** — update this document with actual timings and pass/fail
7. **If it fails with SmolLM2-360M**, try Qwen2.5-0.5B-Instruct Q4_K_M as fallback

## Success Criteria

| Criterion | Required | Notes |
|-----------|----------|-------|
| `node-llama-cpp` installs without errors | Yes | Prebuilt binaries for macOS |
| Model downloads successfully | Yes | Via `resolveModelFile` or `npx node-llama-cpp pull` |
| Model loads in < 10s | Yes | Singleton pattern makes this one-time cost |
| At least 2 tool calls made (read + write) | Yes | Proves function calling works |
| `main.js` content changed | Yes | Proves write_file tool executed |
| `main.js` is valid JavaScript | Nice to have | 360M model may write garbage JS |
| `main.js` contains "hello" | Nice to have | Proves semantic understanding |
| Total prompt time < 30s | Nice to have | Budget is 60s in the main plan |

## Risks Specific to the Spike

1. **`node-llama-cpp` postinstall downloads llama.cpp binaries** — this adds network dependency and time to `npm install`. The prebuilt platform packages (`@node-llama-cpp/mac-x64`, `@node-llama-cpp/mac-arm64-metal`) should handle this, but verify.

2. **SmolLM2-360M may not follow the function calling format** — node-llama-cpp's grammar-constrained generation should force valid JSON, but the model needs to *decide* to call a function rather than just generating text. SmolLM2 Instruct was trained on function calling data (Synth-APIGen), so this should work, but it's the #1 unknown.

3. **Module resolution** — `scripts/spike-local-llm.js` imports from the root `node_modules`, which is straightforward. The harder question (for the main plan) is whether `src/actions/agentic-step/local-llm.js` can import from root `node_modules` given that `src/actions/agentic-step/` has its own `package.json`. The spike can test this by also trying an import from that path.

4. **`resolveModelFile` may require network access on first run** — this is expected but should be documented. Subsequent runs use the cached model.

## What Happens After the Spike

**If the spike passes:**
- Proceed with the main plan (PLAN_1_LOCAL_SCENARIO_TESTS.md)
- Simplify `local-llm.js` based on the corrected API (no manual tool loop needed)
- Remove `local-tools.js` from the plan — tools are defined inline with `defineChatSessionFunction` and the loop is handled by node-llama-cpp internally

**If the spike fails (SmolLM2 doesn't call tools):**
- Try Qwen2.5-0.5B-Instruct as fallback (better instruction following, slightly larger)
- Try Llama-3.2-1B-Instruct (native function calling support in node-llama-cpp)
- If no small model works: consider using Ollama backend instead (HTTP API, supports larger models, user already has it)
- If nothing works locally: drop the local LLM approach and instead write scenario tests that mock the LLM response with canned tool-call sequences (proves the plumbing without a real model)

## Spike Results

_To be filled in after running the spike._

```
Date:
Platform:
node-llama-cpp version:
Model:
Model load time:
Prompt time:
Tool calls:
File changed:
Valid JS:
Verdict:
Notes:
```
