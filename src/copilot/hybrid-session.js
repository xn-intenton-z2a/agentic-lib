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
 * Format tool arguments for human-readable logging.
 */
function formatToolArgs(toolName, args) {
  if (!args) return "";
  switch (toolName) {
    case "view":
      return args.filePath ? ` → ${args.filePath}` : (args.path ? ` → ${args.path}` : "");
    case "bash":
      return args.command ? ` → ${args.command.substring(0, 120)}` : "";
    case "write_file":
    case "create_file":
    case "edit_file":
      return args.file_path ? ` → ${args.file_path}` : (args.path ? ` → ${args.path}` : "");
    case "read_file":
      return args.file_path ? ` → ${args.file_path}` : (args.path ? ` → ${args.path}` : "");
    case "run_tests":
      return "";
    case "report_intent":
      return args.intent ? ` → "${args.intent.substring(0, 80)}"` : "";
    default: {
      // Generic: show first string-valued arg
      const firstVal = Object.values(args).find((v) => typeof v === "string");
      return firstVal ? ` → ${firstVal.substring(0, 100)}` : "";
    }
  }
}

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

  // Run initial tests to capture baseline
  let initialTestOutput;
  try {
    initialTestOutput = execSync("npm test 2>&1", { cwd: wsPath, encoding: "utf8", timeout: 120000 });
  } catch (err) {
    initialTestOutput = `STDOUT:\n${err.stdout || ""}\nSTDERR:\n${err.stderr || ""}`;
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
    "",
    "Your goal: implement the MISSION described below. This means:",
    "1. Write the implementation code in src/lib/main.js (keep existing exports, add new ones)",
    "2. Write comprehensive unit tests in tests/unit/ that cover all acceptance criteria",
    "3. Make ALL tests pass (both existing seed tests and your new tests)",
    "",
    "Strategy:",
    "1. Read MISSION.md to understand what needs to be built",
    "2. Read the current source code and tests",
    "3. Write the implementation in src/lib/main.js",
    "4. Write dedicated tests in a new test file (e.g. tests/unit/hamming.test.js) covering all acceptance criteria",
    "5. Run run_tests to verify everything passes",
    "6. If tests fail, read the error output carefully, fix the code, and repeat",
    "",
    "Important:",
    "- Keep existing exports in src/lib/main.js (main, getIdentity, name, version, description)",
    "- Add new named exports as specified in the mission",
    "- Write tests that import from src/lib/main.js",
    "- Do NOT modify existing test files — create new test files for mission-specific tests",
    "- Keep going until all tests pass or you've exhausted your options",
  ].join("\n");

  const sessionConfig = {
    model,
    systemMessage: { mode: "replace", content: systemPrompt },
    tools: [runTestsTool],
    onPermissionRequest: approveAll,
    workingDirectory: wsPath,
    hooks: {
      onPreToolUse: (input) => {
        const n = metrics.toolCalls.length + 1;
        const elapsed = ((Date.now() - metrics.startTime) / 1000).toFixed(0);
        metrics.toolCalls.push({ tool: input.toolName, time: Date.now(), args: input.toolArgs });
        const detail = formatToolArgs(input.toolName, input.toolArgs);
        logger.info(`  [tool #${n} +${elapsed}s] ${input.toolName}${detail}`);
      },
      onPostToolUse: (input) => {
        if (/write|edit|create/i.test(input.toolName)) {
          const path = input.toolArgs?.file_path || input.toolArgs?.path || "unknown";
          metrics.filesWritten.add(path);
          logger.info(`    → wrote ${path}`);
        }
        if (input.toolName === "run_tests" || input.toolName === "bash") {
          const result = input.toolResult?.textResultForLlm || input.toolResult || "";
          const resultStr = typeof result === "string" ? result : JSON.stringify(result);
          const passed = /TESTS PASSED|passed|✓|0 fail/i.test(resultStr);
          const failed = /TESTS FAILED|failed|✗|FAIL/i.test(resultStr);
          if (passed && !failed) {
            logger.info(`    → tests PASSED`);
          } else if (failed) {
            const failMatch = resultStr.match(/(\d+)\s*(failed|fail)/i);
            logger.info(`    → tests FAILED${failMatch ? ` (${failMatch[1]} failures)` : ""}`);
          }
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
    const inTok = event.data?.inputTokens || 0;
    const outTok = event.data?.outputTokens || 0;
    tokensIn += inTok;
    tokensOut += outTok;
    if (inTok || outTok) {
      logger.info(`  [tokens] +${inTok} in / +${outTok} out (cumulative: ${tokensIn} in / ${tokensOut} out)`);
    }
  });
  session.on("assistant.message", (event) => {
    const content = (event.data?.content || "").trim();
    if (content) {
      // Show first line or first 200 chars, whichever is shorter
      const firstLine = content.split("\n")[0];
      const preview = firstLine.length > 200 ? firstLine.substring(0, 200) + "..." : firstLine;
      logger.info(`  [assistant] ${preview}`);
    }
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
    `# Current test state (seed tests)\n\n\`\`\`\n${initialTestOutput.substring(0, 4000)}\n\`\`\``,
    "",
    "Implement this mission. You need to:",
    "1. Read the existing source code (src/lib/main.js) and tests",
    "2. Add the required functions to src/lib/main.js as named exports",
    "3. Create dedicated test files in tests/unit/ covering ALL acceptance criteria",
    "4. Run run_tests to verify everything passes",
    "5. Fix any failures and iterate until all tests pass",
    "",
    "Start by reading the existing files, then implement the solution.",
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
