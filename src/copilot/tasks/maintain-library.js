// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// src/copilot/tasks/maintain-library.js — Library management (shared)

import { existsSync } from "fs";
import {
  runCopilotTask, readOptionalFile, scanDirectory, formatPathsSection,
  extractNarrative, NARRATIVE_INSTRUCTION,
} from "../session.js";
import { defaultLogger } from "../logger.js";

export async function maintainLibrary(context) {
  const { config, instructions, writablePaths, model, logger = defaultLogger } = context;
  const t = config.tuning || {};

  if (existsSync("MISSION_COMPLETE.md") && config.supervisor !== "maintenance") {
    logger.info("Mission complete — skipping library maintenance");
    return { outcome: "nop", details: "Mission already complete" };
  }

  const sourcesPath = config.paths.librarySources.path;
  const sources = readOptionalFile(sourcesPath);
  const mission = readOptionalFile(config.paths.mission.path);
  const hasUrls = /https?:\/\//.test(sources);

  const libraryPath = config.paths.library.path;
  const libraryLimit = config.paths.library.limit;
  const libraryDocs = scanDirectory(libraryPath, ".md", { contentLimit: t.documentSummary || 500 }, logger);

  let prompt;
  if (!hasUrls) {
    prompt = [
      "## Instructions", instructions || "Maintain the library by updating documents from sources.", "",
      "## Mission", mission || "(no mission)", "",
      "## Current SOURCES.md", sources || "(empty)", "",
      "## Your Task",
      `Populate ${sourcesPath} with 3-8 relevant reference URLs.`, "",
      formatPathsSection(writablePaths, config.readOnlyPaths, config),
    ].join("\n");
  } else {
    prompt = [
      "## Instructions", instructions || "Maintain the library by updating documents from sources.", "",
      "## Sources", sources, "",
      `## Current Library Documents (${libraryDocs.length}/${libraryLimit} max)`,
      ...libraryDocs.map((d) => `### ${d.name}\n${d.content}`), "",
      "## Your Task",
      "1. Read each URL in SOURCES.md and extract technical content.",
      "2. Create or update library documents.", "",
      formatPathsSection(writablePaths, config.readOnlyPaths, config), "",
      "## Constraints", `- Maximum ${libraryLimit} library documents`,
    ].join("\n");
  }

  const { content: resultContent, tokensUsed, inputTokens, outputTokens, cost } = await runCopilotTask({
    model,
    systemMessage: "You are a knowledge librarian. Maintain a library of technical documents extracted from web sources." + NARRATIVE_INSTRUCTION,
    prompt, writablePaths, tuning: t, logger,
  });

  return {
    outcome: hasUrls ? "library-maintained" : "sources-discovered",
    tokensUsed, inputTokens, outputTokens, cost, model,
    details: hasUrls ? `Maintained library (${libraryDocs.length} docs)` : "Discovered sources from mission",
    narrative: extractNarrative(resultContent, hasUrls ? "Maintained library." : "Discovered sources."),
  };
}
