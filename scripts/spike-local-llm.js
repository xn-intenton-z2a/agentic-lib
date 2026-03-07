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
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MODELS_DIR = resolve(__dirname, "../models");
// Model URI — override via LOCAL_LLM_MODEL_URI env var
const MODEL_URI = process.env.LOCAL_LLM_MODEL_URI || "hf:bartowski/Llama-3.2-3B-Instruct-GGUF:Q4_K_M";

// ── Phase 1: Load Model ─────────────────────────────────────────────

console.log("=== Phase 1: Load Model ===");
const t0 = Date.now();

mkdirSync(MODELS_DIR, { recursive: true });
console.log(`Resolving model: ${MODEL_URI}`);
console.log(`Models dir: ${MODELS_DIR}`);
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
const initialContent = '// placeholder\nexport function placeholder() { return null; }\n';
writeFileSync(join(workspace, "main.js"), initialContent);
console.log(`Workspace: ${workspace}`);
console.log(`Initial main.js:\n${initialContent.trim()}`);

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
      console.log(`  [tool] read_file("${path}")`);
      toolCalls.push({ tool: "read_file", path });
      if (!existsSync(resolved)) return JSON.stringify({ error: `Not found: ${path}` });
      return JSON.stringify({ content: readFileSync(resolved, "utf8") });
    }
  }),

  write_file: defineChatSessionFunction({
    description: "Write raw text content to a file. The 'content' parameter should be the actual file text, NOT JSON. For example, to write JavaScript, the content should be the JavaScript source code directly.",
    params: {
      type: "object",
      properties: {
        path: { type: "string" },
        content: { type: "string", description: "The raw file content to write (not JSON-encoded)" }
      }
    },
    async handler({ path, content }) {
      const resolved = resolve(workspace, path);
      const preview = content.length > 120 ? content.substring(0, 120) + "..." : content;
      console.log(`  [tool] write_file("${path}", ${content.length} chars): ${JSON.stringify(preview)}`);
      toolCalls.push({ tool: "write_file", path, contentLength: content.length, content });
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
  "You MUST use your tools to complete this task. Do NOT write code in your response.",
  "Step 1: Call the read_file function with path 'main.js'.",
  "Step 2: Call the write_file function with path 'main.js' and content that exports a hello() function returning 'Hello, World!'.",
].join("\n");

console.log(`Prompt: ${prompt}`);
console.log("Sending...");

let response;
try {
  response = await session.prompt(prompt, {
    functions,
    maxParallelFunctionCalls: 1,
    maxTokens: 512,
    temperature: 0.3,
  });
} catch (err) {
  console.error(`ERROR during prompt: ${err.message}`);
  if (err.stack) console.error(err.stack);
  response = null;
}

const promptTime = ((Date.now() - t1) / 1000).toFixed(1);

// ── Phase 5: Report ─────────────────────────────────────────────────

console.log("\n=== Phase 5: Results ===");
console.log(`Response: ${response || "(no response)"}`);
console.log(`Prompt time: ${promptTime}s`);
console.log(`Tool calls made: ${toolCalls.length}`);
for (const tc of toolCalls) {
  console.log(`  - ${tc.tool}("${tc.path}"${tc.contentLength !== undefined ? `, ${tc.contentLength} chars` : ""})`);
}

const finalContent = existsSync(join(workspace, "main.js"))
  ? readFileSync(join(workspace, "main.js"), "utf8")
  : "(file not found)";
console.log(`\nFinal main.js:\n${finalContent}`);

const fileChanged = finalContent !== initialContent;
const hasHello = finalContent.includes("hello") || finalContent.includes("Hello");
let validJs = false;
try {
  execSync(`node --check ${join(workspace, "main.js")}`, { stdio: "pipe" });
  validJs = true;
} catch { /* invalid JS */ }

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

process.exit(pass ? 0 : 1);
