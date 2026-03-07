// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
//
// Vitest wrapper for scripts/spike-local-llm.js — exercises local LLM function calling
// via node-llama-cpp with Llama-3.2-3B-Instruct.
//
// This test is slow (~30-90s) because it loads a real LLM and runs inference.
// It is NOT included in the default `npm test` suite — run via `npm run test:spike-llm`.

import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");
const SPIKE_SCRIPT = resolve(PROJECT_ROOT, "scripts/spike-local-llm.js");

describe("spike-local-llm", () => {
  it("runs the spike script and exits with code 0 (function calling works)", () => {
    // The spike script:
    // 1. Loads Llama-3.2-3B-Instruct via node-llama-cpp
    // 2. Creates a temp workspace with a placeholder main.js
    // 3. Defines read_file and write_file tools
    // 4. Prompts the model to read main.js and rewrite it with a hello() function
    // 5. Verifies tool calls were made and file was changed
    // 6. Exits 0 on pass, 1 on fail
    const output = execSync(`node ${SPIKE_SCRIPT}`, {
      cwd: PROJECT_ROOT,
      encoding: "utf8",
      timeout: 300_000, // 5 minutes — model download + inference
      env: { ...process.env, NODE_NO_WARNINGS: "1" },
    });

    // Verify key phases completed
    expect(output).toContain("Phase 1: Load Model");
    expect(output).toContain("Phase 2: Set Up Workspace");
    expect(output).toContain("Phase 3: Define Tools");
    expect(output).toContain("Phase 4: Run Prompt");
    expect(output).toContain("Phase 5: Results");
    expect(output).toContain("Verdict");

    // The script exits 0 only if tool calls >= 2 and file changed
    expect(output).toContain("SPIKE PASSED");
  }, 300_000); // 5 minute timeout for vitest too
});
