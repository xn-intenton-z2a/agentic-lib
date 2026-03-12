// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// src/copilot/tasks/transform.js — Transform task (shared)
//
// Ported from src/actions/agentic-step/tasks/transform.js.
// GitHub context (octokit, issues) is optional for local CLI use.

import { existsSync } from "fs";
import {
  runCopilotTask, readOptionalFile, scanDirectory, formatPathsSection,
  filterIssues, summariseIssue, extractFeatureSummary, extractNarrative, NARRATIVE_INSTRUCTION,
} from "../session.js";
import { defaultLogger } from "../logger.js";

export async function transform(context) {
  const { config, instructions, writablePaths, testCommand, model, logger = defaultLogger } = context;
  // octokit + repo are optional (absent in CLI mode)
  const octokit = context.octokit || null;
  const repo = context.repo || null;
  const issueNumber = context.issueNumber || null;
  const t = config.tuning || {};

  const mission = readOptionalFile(config.paths.mission.path);
  if (!mission) {
    logger.warning(`No mission file found at ${config.paths.mission.path}`);
    return { outcome: "nop", details: "No mission file found" };
  }

  if (existsSync("MISSION_COMPLETE.md") && config.supervisor !== "maintenance") {
    logger.info("Mission complete — skipping transformation");
    return { outcome: "nop", details: "Mission already complete" };
  }

  const features = scanDirectory(config.paths.features.path, ".md", { fileLimit: t.featuresScan || 10 }, logger);
  const sourceFiles = scanDirectory(config.paths.source.path, [".js", ".ts"], {
    fileLimit: t.sourceScan || 10,
    contentLimit: t.sourceContent || 5000,
    recursive: true, sortByMtime: true, clean: true, outline: true,
  }, logger);
  const webFiles = scanDirectory(config.paths.web?.path || "src/web/", [".html", ".css", ".js"], {
    fileLimit: t.sourceScan || 10,
    contentLimit: t.sourceContent || 5000,
    recursive: true, sortByMtime: true, clean: true,
  }, logger);

  // GitHub issues (optional)
  let openIssues = [];
  let rawIssuesCount = 0;
  if (octokit && repo) {
    const { data: rawIssues } = await octokit.rest.issues.listForRepo({ ...repo, state: "open", per_page: t.issuesScan || 20 });
    rawIssuesCount = rawIssues.length;
    openIssues = filterIssues(rawIssues, { staleDays: t.staleDays || 30 });
  }

  let targetIssue = null;
  if (issueNumber && octokit && repo) {
    try {
      const { data: issue } = await octokit.rest.issues.get({ ...repo, issue_number: Number(issueNumber) });
      targetIssue = issue;
    } catch (err) {
      logger.warning(`Could not fetch target issue #${issueNumber}: ${err.message}`);
    }
  }

  const agentInstructions = instructions || "Transform the repository toward its mission by identifying the next best action.";

  const prompt = [
    "## Instructions", agentInstructions, "",
    ...(targetIssue ? [
      `## Target Issue #${targetIssue.number}: ${targetIssue.title}`,
      targetIssue.body || "(no description)",
      `Labels: ${targetIssue.labels.map((l) => l.name).join(", ") || "none"}`,
      "", "**Focus your transformation on resolving this specific issue.**", "",
    ] : []),
    "## Mission", mission, "",
    `## Current Features (${features.length})`,
    ...features.map((f) => `### ${f.name}\n${extractFeatureSummary(f.content, f.name)}`), "",
    `## Current Source Files (${sourceFiles.length})`,
    ...sourceFiles.map((f) => `### ${f.name}\n\`\`\`\n${f.content}\n\`\`\``), "",
    ...(webFiles.length > 0 ? [
      `## Website Files (${webFiles.length})`,
      ...webFiles.map((f) => `### ${f.name}\n\`\`\`\n${f.content}\n\`\`\``), "",
    ] : []),
    ...(openIssues.length > 0 ? [
      `## Open Issues (${openIssues.length})`,
      ...openIssues.slice(0, t.issuesScan || 20).map((i) => summariseIssue(i, t.issueBodyLimit || 500)), "",
    ] : []),
    "## Output Artifacts",
    `Save output artifacts to \`${config.paths.examples?.path || "examples/"}\`.`, "",
    "## Your Task",
    "Analyze the mission, features, source code, and open issues.",
    "Determine the single most impactful next step to transform this repository.", "Then implement that step.", "",
    "## When NOT to make changes",
    "If the existing code already satisfies all requirements:", "- Do NOT make cosmetic changes", "- Instead, report that the mission is satisfied", "",
    formatPathsSection(writablePaths, config.readOnlyPaths, config), "",
    "## Constraints", `- Run \`${testCommand}\` to validate your changes`,
  ].join("\n");

  logger.info(`Transform prompt length: ${prompt.length} chars`);

  const { content: resultContent, tokensUsed, inputTokens, outputTokens, cost } = await runCopilotTask({
    model,
    systemMessage: "You are an autonomous code transformation agent. Your goal is to advance the repository toward its mission by making the most impactful change possible in a single step." + NARRATIVE_INSTRUCTION,
    prompt, writablePaths, tuning: t, logger,
  });

  const promptBudget = [
    { section: "mission", size: mission.length, files: "1", notes: "full" },
    { section: "features", size: features.reduce((s, f) => s + f.content.length, 0), files: `${features.length}`, notes: "" },
    { section: "source", size: sourceFiles.reduce((s, f) => s + f.content.length, 0), files: `${sourceFiles.length}`, notes: "" },
    { section: "issues", size: openIssues.length * 80, files: `${openIssues.length}`, notes: `${rawIssuesCount - openIssues.length} filtered` },
  ];

  return {
    outcome: "transformed", tokensUsed, inputTokens, outputTokens, cost, model,
    details: resultContent.substring(0, 500),
    narrative: extractNarrative(resultContent, "Transformation step completed."),
    promptBudget,
  };
}
