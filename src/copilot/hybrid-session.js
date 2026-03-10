// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// src/copilot/hybrid-session.js — Single-session hybrid iterator (Phase 2)
//
// Replaces the old multi-session runIterationLoop with a single persistent
// Copilot SDK session that drives its own tool loop. Hooks provide
// observability and budget control.

import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { execSync } from "child_process";
import { defaultLogger } from "./logger.js";
import { getSDK } from "./sdk.js";
import { isPathWritable } from "./tools.js";
import { readOptionalFile } from "./session.js";

/**
 * Run a hybrid iteration: single Copilot SDK session drives mission to completion.
 *
 * @param {Object} options
 * @param {string} options.workspacePath - Path to the workspace
 * @param {string} [options.model="gpt-5-mini"] - Copilot SDK model
 * @param {string} [options.githubToken] - COPILOT_GITHUB_TOKEN
 * @param {Object} [options.tuning] - Tuning config (reasoningEffort, infiniteSessions)
 * @param {number} [options.timeoutMs=600000] - Session timeout
 * @param {Object} [options.logger]
 * @returns {Promise<HybridResult>}
 */
export async function runHybridSession({
  workspacePath,
  model = "gpt-5-mini",
  githubToken,
  tuning = {},
  timeoutMs = 600000,
  logger = defaultLogger,
}) {
  const { CopilotClient, approveAll, defineTool } = await getSDK();

  const copilotToken = githubToken || process.env.COPILOT_GITHUB_TOKEN;
  if (!copilotToken) {
    throw new Error("COPILOT_GITHUB_TOKEN is required. Set it in your environment.");
  }

  const wsPath = resolve(workspacePath);

  // ── Read mission context ────────────────────────────────────────────
  const missionPath = resolve(wsPath, "MISSION.md");
  const missionText = existsSync(missionPath) ? readFileSync(missionPath, "utf8") : "No MISSION.md found";

  // Run initial tests
  let initialTestOutput;
  let initialTestsPassed = false;
  try {
    initialTestOutput = execSync("npm test 2>&1", { cwd: wsPath, encoding: "utf8", timeout: 120000 });
    initialTestsPassed = true;
  } catch (err) {
    initialTestOutput = `STDOUT:\n${err.stdout || ""}\nSTDERR:\n${err.stderr || ""}`;
  }

  if (initialTestsPassed) {
    logger.info("Tests already pass — nothing to do");
    return {
      success: true, testsPassed: true, sessionTime: 0, totalTime: 0,
      toolCalls: 0, testRuns: 0, filesWritten: 0,
      tokensIn: 0, tokensOut: 0, errors: [],
      endReason: "already-passing", model,
    };
  }

  // ── Metrics ─────────────────────────────────────────────────────────
  const metrics = {
    toolCalls: [],
    testRuns: 0,
    filesWritten: new Set(),
    errors: [],
    startTime: Date.now(),
  };

  // ── Define run_tests tool ───────────────────────────────────────────
  const runTestsTool = defineTool("run_tests", {
    description: "Run the test suite (npm test) and return pass/fail with output. Call this after making changes to verify correctness.",
    parameters: { type: "object", properties: {}, required: [] },
    handler: async () => {
      metrics.testRuns++;
      try {
        const stdout = execSync("npm test 2>&1", { cwd: wsPath, encoding: "utf8", timeout: 120000 });
        return { textResultForLlm: `TESTS PASSED:\n${stdout}`, resultType: "success" };
      } catch (err) {
        const output = `STDOUT:\n${err.stdout || ""}\nSTDERR:\n${err.stderr || ""}`;
        return { textResultForLlm: `TESTS FAILED:\n${output}`, resultType: "success" };
      }
    },
  });

  // ── Create session ──────────────────────────────────────────────────
  logger.info(`[hybrid] Creating session (model=${model}, workspace=${wsPath})`);

  const client = new CopilotClient({
    env: { ...process.env, GITHUB_TOKEN: copilotToken, GH_TOKEN: copilotToken },
  });

  const systemPrompt = [
    "You are an autonomous code transformation agent.",
    "Your workspace is a Node.js project with source code in src/lib/ and tests in tests/.",
    "Your goal: make ALL tests pass. Read the failing tests, understand what they expect, write the implementation.",
    "",
    "Strategy:",
    "1. Run the run_tests tool to see what's failing",
    "2. Read the test files to understand expected behaviour",
    "3. Read the current source code",
    "4. Write the implementation that makes the tests pass",
    "5. Run run_tests again to verify",
    "6. If tests still fail, read the error output carefully, fix the code, and repeat",
    "",
    "Do NOT modify test files. Only modify source files in src/lib/.",
    "Keep going until all tests pass or you've exhausted your options.",
  ].join("\n");

  const sessionConfig = {
    model,
    systemMessage: { mode: "replace", content: systemPrompt },
    tools: [runTestsTool],
    onPermissionRequest: approveAll,
    workingDirectory: wsPath,
    hooks: {
      onPreToolUse: (input) => {
        metrics.toolCalls.push({ tool: input.toolName, time: Date.now() });
        logger.info(`  [tool] ${input.toolName}`);
      },
      onPostToolUse: (input) => {
        if (/write|edit/i.test(input.toolName)) {
          const path = input.toolArgs?.file_path || input.toolArgs?.path || "unknown";
          metrics.filesWritten.add(path);
        }
      },
      onErrorOccurred: (input) => {
        metrics.errors.push({ error: input.error, context: input.errorContext, time: Date.now() });
        logger.error(`  [error] ${input.errorContext}: ${input.error}`);
        if (input.recoverable) return { errorHandling: "retry", retryCount: 2 };
        return { errorHandling: "abort" };
      },
    },
  };

  // Infinite sessions for context management
  if (tuning.infiniteSessions !== false) {
    sessionConfig.infiniteSessions = { enabled: true };
  }

  // Reasoning effort
  if (tuning.reasoningEffort && tuning.reasoningEffort !== "none") {
    const SUPPORTED = new Set(["gpt-5-mini", "o4-mini"]);
    if (SUPPORTED.has(model)) {
      sessionConfig.reasoningEffort = tuning.reasoningEffort;
    }
  }

  let session;
  try {
    session = await client.createSession(sessionConfig);
    logger.info(`[hybrid] Session: ${session.sessionId}`);
  } catch (err) {
    logger.error(`[hybrid] Failed to create session: ${err.message}`);
    await client.stop();
    throw err;
  }

  // ── Token tracking ──────────────────────────────────────────────────
  let tokensIn = 0;
  let tokensOut = 0;

  session.on("assistant.usage", (event) => {
    tokensIn += event.data?.inputTokens || 0;
    tokensOut += event.data?.outputTokens || 0;
  });
  session.on("assistant.message", (event) => {
    const preview = (event.data?.content || "").substring(0, 200);
    logger.info(`  [assistant] ${preview}...`);
  });

  // ── Try autopilot mode ──────────────────────────────────────────────
  try {
    await session.rpc.mode.set({ mode: "autopilot" });
    logger.info("[hybrid] Autopilot mode: active");
  } catch {
    logger.info("[hybrid] Autopilot mode not available — using default mode");
  }

  // ── Send mission prompt ─────────────────────────────────────────────
  logger.info("[hybrid] Sending mission...\n");

  const prompt = [
    `# Mission\n\n${missionText}`,
    `# Current test state\n\n\`\`\`\n${initialTestOutput.substring(0, 4000)}\n\`\`\``,
    "",
    "Make all the tests pass. Work autonomously — read files, write code, run tests, iterate.",
    "Use the run_tests tool to verify your changes after each modification.",
  ].join("\n\n");

  const t0 = Date.now();
  let response;
  let endReason = "complete";
  try {
    response = await session.sendAndWait({ prompt }, timeoutMs);
  } catch (err) {
    logger.error(`[hybrid] Session error: ${err.message}`);
    response = null;
    endReason = "error";
  }
  const sessionTime = (Date.now() - t0) / 1000;

  // ── Final test run ──────────────────────────────────────────────────
  let finalTestsPassed = false;
  try {
    execSync("npm test 2>&1", { cwd: wsPath, encoding: "utf8", timeout: 120000 });
    finalTestsPassed = true;
  } catch {
    // Tests still failing
  }

  // ── Cleanup ─────────────────────────────────────────────────────────
  await client.stop();

  const totalTime = (Date.now() - metrics.startTime) / 1000;

  return {
    success: finalTestsPassed,
    testsPassed: finalTestsPassed,
    sessionTime: Math.round(sessionTime),
    totalTime: Math.round(totalTime),
    toolCalls: metrics.toolCalls.length,
    testRuns: metrics.testRuns,
    filesWritten: metrics.filesWritten.size,
    tokensIn,
    tokensOut,
    errors: metrics.errors,
    endReason,
    model,
    agentMessage: response?.data?.content?.substring(0, 500) || null,
  };
}
