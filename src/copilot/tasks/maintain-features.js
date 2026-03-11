// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// src/copilot/tasks/maintain-features.js — Feature lifecycle (shared)

import { existsSync } from "fs";
import {
  runCopilotTask, readOptionalFile, scanDirectory, formatPathsSection,
  extractFeatureSummary, extractNarrative, NARRATIVE_INSTRUCTION,
} from "../session.js";
import { defaultLogger } from "../logger.js";

export async function maintainFeatures(context) {
  const { config, instructions, writablePaths, model, logger = defaultLogger } = context;
  const t = config.tuning || {};

  if (existsSync("MISSION_COMPLETE.md") && config.supervisor !== "maintenance") {
    return { outcome: "nop", details: "Mission already complete" };
  }

  const mission = readOptionalFile(config.paths.mission.path);
  const featuresPath = config.paths.features.path;
  const featureLimit = config.paths.features.limit;
  const features = scanDirectory(featuresPath, ".md", { fileLimit: t.featuresScan || 10 }, logger);

  features.sort((a, b) => {
    const aInc = /- \[ \]/.test(a.content) ? 0 : 1;
    const bInc = /- \[ \]/.test(b.content) ? 0 : 1;
    return aInc - bInc || a.name.localeCompare(b.name);
  });

  const libraryDocs = scanDirectory(config.paths.library.path, ".md", { contentLimit: t.documentSummary || 1000 }, logger);

  const prompt = [
    "## Instructions", instructions || "Maintain the feature set by creating, updating, or pruning features.", "",
    "## Mission", mission, "",
    `## Current Features (${features.length}/${featureLimit} max)`,
    ...features.map((f) => `### ${f.name}\n${f.content}`), "",
    ...(libraryDocs.length > 0 ? [
      `## Library Documents (${libraryDocs.length})`,
      ...libraryDocs.map((d) => `### ${d.name}\n${d.content}`), "",
    ] : []),
    "## Your Task",
    `1. Review each existing feature — delete if implemented or irrelevant.`,
    `2. If fewer than ${featureLimit} features, create new ones aligned with the mission.`,
    "3. Ensure each feature has clear, testable acceptance criteria.", "",
    formatPathsSection(writablePaths, config.readOnlyPaths, config), "",
    "## Constraints", `- Maximum ${featureLimit} feature files`,
  ].join("\n");

  const { content: resultContent, tokensUsed, inputTokens, outputTokens, cost } = await runCopilotTask({
    model,
    systemMessage: "You are a feature lifecycle manager. Create, update, and prune feature specification files to keep the project focused on its mission." + NARRATIVE_INSTRUCTION,
    prompt, writablePaths, tuning: t, logger,
  });

  return {
    outcome: "features-maintained", tokensUsed, inputTokens, outputTokens, cost, model,
    details: `Maintained features (${features.length} existing, limit ${featureLimit})`,
    narrative: extractNarrative(resultContent, `Maintained ${features.length} features.`),
  };
}
