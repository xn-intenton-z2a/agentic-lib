// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// src/copilot/tasks/fix-code.js — Fix failing tests (shared)
//
// In CLI/local mode: runs tests, feeds failures to agent.
// In Actions mode: can also resolve merge conflicts and PR check failures.

import { execSync } from "child_process";
import {
  runCopilotTask, readOptionalFile, scanDirectory, formatPathsSection,
  extractNarrative, NARRATIVE_INSTRUCTION,
} from "../session.js";
import { defaultLogger } from "../logger.js";

/**
 * Fix failing code — local mode (no GitHub context needed).
 * Runs tests, feeds failure output to the agent.
 */
export async function fixCode(context) {
  const { config, instructions, writablePaths, testCommand, model, logger = defaultLogger } = context;
  const t = config.tuning || {};
  const workDir = context.workingDirectory || process.cwd();

  // Run tests to get failure output
  let testOutput;
  let testsPassed = false;
  try {
    testOutput = execSync(testCommand, { cwd: workDir, encoding: "utf8", timeout: 120000 });
    testsPassed = true;
  } catch (err) {
    testOutput = `STDOUT:\n${err.stdout || ""}\nSTDERR:\n${err.stderr || ""}`;
  }

  if (testsPassed) {
    logger.info("Tests already pass — nothing to fix");
    return { outcome: "nop", details: "Tests already pass" };
  }

  const mission = readOptionalFile(config.paths.mission.path);
  const sourceFiles = scanDirectory(config.paths.source.path, [".js", ".ts"], {
    fileLimit: t.sourceScan || 10,
    contentLimit: t.sourceContent || 5000,
    recursive: true, sortByMtime: true, clean: true,
  }, logger);

  const agentInstructions = instructions || "Fix the failing tests by modifying the source code.";

  const prompt = [
    "## Instructions", agentInstructions, "",
    ...(mission ? ["## Mission", mission, ""] : []),
    "## Failing Test Output",
    "```", testOutput.substring(0, 8000), "```", "",
    `## Current Source Files (${sourceFiles.length})`,
    ...sourceFiles.map((f) => `### ${f.name}\n\`\`\`\n${f.content}\n\`\`\``), "",
    formatPathsSection(writablePaths, config.readOnlyPaths, config), "",
    "## Constraints",
    `- Run \`${testCommand}\` to validate your fixes`,
    "- Make minimal changes to fix the failing tests",
    "- Do not introduce new features — focus on making the build green",
  ].join("\n");

  const { content: resultContent, tokensUsed, inputTokens, outputTokens, cost } = await runCopilotTask({
    model,
    systemMessage: "You are an autonomous coding agent fixing failing tests. Analyze the error output and make minimal, targeted changes to fix it." + NARRATIVE_INSTRUCTION,
    prompt, writablePaths, tuning: t, logger, workingDirectory: workDir,
  });

  return {
    outcome: "fix-applied", tokensUsed, inputTokens, outputTokens, cost, model,
    details: `Applied fix based on test failures`,
    narrative: extractNarrative(resultContent, "Fixed failing tests."),
  };
}
