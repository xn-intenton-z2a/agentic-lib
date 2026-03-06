// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// config-loader.js — Parse agentic-lib.toml and resolve paths
//
// TOML-only configuration. The config file is required.
// All defaults are defined here in one place.

import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { parse as parseToml } from "smol-toml";

/**
 * @typedef {Object} PathConfig
 * @property {string} path - The filesystem path
 * @property {string[]} permissions - Access permissions (e.g. ['write'])
 * @property {number} [limit] - Maximum number of files allowed
 */

/**
 * @typedef {Object} AgenticConfig
 * @property {string} schedule - Schedule identifier
 * @property {string} supervisor - Supervisor frequency (off | weekly | daily | hourly | continuous)
 * @property {string} model - Copilot SDK model for LLM requests
 * @property {Object<string, PathConfig>} paths - Mapped paths with permissions
 * @property {string} buildScript - Build command
 * @property {string} testScript - Test command
 * @property {string} mainScript - Main entry command
 * @property {number} featureDevelopmentIssuesWipLimit - Max concurrent feature issues
 * @property {number} maintenanceIssuesWipLimit - Max concurrent maintenance issues
 * @property {number} attemptsPerBranch - Max attempts per branch
 * @property {number} attemptsPerIssue - Max attempts per issue
 * @property {Object} seeding - Seed file configuration
 * @property {Object} intentionBot - Bot configuration
 * @property {boolean} tdd - Whether TDD mode is enabled
 * @property {string[]} writablePaths - All paths with write permission
 * @property {string[]} readOnlyPaths - All paths without write permission
 */

// Keys whose paths are writable by agents
const WRITABLE_KEYS = ["source", "tests", "features", "dependencies", "docs", "readme", "examples"];

// Default paths — every key that task handlers might access
const PATH_DEFAULTS = {
  mission: "MISSION.md",
  source: "src/lib/",
  tests: "tests/unit/",
  features: "features/",
  docs: "docs/",
  examples: "examples/",
  readme: "README.md",
  dependencies: "package.json",
  library: "library/",
  librarySources: "SOURCES.md",
  contributing: "CONTRIBUTING.md",
};

// Default limits for path-specific constraints
const LIMIT_DEFAULTS = {
  features: 4,
  library: 32,
};

// Tuning profiles: min (fast/cheap), recommended (balanced), max (thorough)
const TUNING_PROFILES = {
  min: {
    reasoningEffort: "low",
    infiniteSessions: false,
    transformationBudget: 4,
    featuresScan: 3,
    sourceScan: 3,
    sourceContent: 1000,
    testContent: 500,
    issuesScan: 5,
    issueBodyLimit: 200,
    staleDays: 14,
    documentSummary: 500,
    discussionComments: 5,
  },
  recommended: {
    reasoningEffort: "medium",
    infiniteSessions: true,
    transformationBudget: 8,
    featuresScan: 10,
    sourceScan: 10,
    sourceContent: 5000,
    testContent: 3000,
    issuesScan: 20,
    issueBodyLimit: 500,
    staleDays: 30,
    documentSummary: 2000,
    discussionComments: 10,
  },
  max: {
    reasoningEffort: "high",
    infiniteSessions: true,
    transformationBudget: 32,
    featuresScan: 50,
    sourceScan: 50,
    sourceContent: 20000,
    testContent: 15000,
    issuesScan: 100,
    issueBodyLimit: 2000,
    staleDays: 90,
    documentSummary: 10000,
    discussionComments: 25,
  },
};

// Limits profiles: scale WIP limits and constraints with tuning profile
const LIMITS_PROFILES = {
  min: {
    featureIssues: 1,
    maintenanceIssues: 1,
    attemptsPerBranch: 2,
    attemptsPerIssue: 1,
    featuresLimit: 2,
    libraryLimit: 8,
  },
  recommended: {
    featureIssues: 2,
    maintenanceIssues: 1,
    attemptsPerBranch: 3,
    attemptsPerIssue: 2,
    featuresLimit: 4,
    libraryLimit: 32,
  },
  max: {
    featureIssues: 4,
    maintenanceIssues: 2,
    attemptsPerBranch: 5,
    attemptsPerIssue: 4,
    featuresLimit: 8,
    libraryLimit: 64,
  },
};

/**
 * Read package.json from the project root, returning empty string if not found.
 * @param {string} tomlPath - Path to the TOML config (used to derive project root)
 * @param {string} depsRelPath - Relative path to package.json (from config)
 * @returns {string} Raw package.json content or empty string
 */
function readPackageJson(tomlPath, depsRelPath) {
  try {
    const projectRoot = dirname(tomlPath);
    const pkgPath = join(projectRoot, depsRelPath);
    return existsSync(pkgPath) ? readFileSync(pkgPath, "utf8") : "";
  } catch {
    return "";
  }
}

/**
 * Resolve tuning configuration: start from profile defaults, apply explicit overrides.
 */
function resolveTuning(tuningSection) {
  const profileName = tuningSection.profile || "recommended";
  const profile = TUNING_PROFILES[profileName] || TUNING_PROFILES.recommended;
  const tuning = { ...profile, profileName };

  // "none" explicitly disables reasoning-effort regardless of profile
  if (tuningSection["reasoning-effort"]) {
    tuning.reasoningEffort = tuningSection["reasoning-effort"] === "none" ? "" : tuningSection["reasoning-effort"];
  }
  if (tuningSection["infinite-sessions"] === true || tuningSection["infinite-sessions"] === false) {
    tuning.infiniteSessions = tuningSection["infinite-sessions"];
  }
  const numericOverrides = {
    "transformation-budget": "transformationBudget",
    "features-scan": "featuresScan",
    "source-scan": "sourceScan",
    "source-content": "sourceContent",
    "test-content": "testContent",
    "issues-scan": "issuesScan",
    "issue-body-limit": "issueBodyLimit",
    "stale-days": "staleDays",
    "document-summary": "documentSummary",
    "discussion-comments": "discussionComments",
  };
  for (const [tomlKey, jsKey] of Object.entries(numericOverrides)) {
    if (tuningSection[tomlKey] > 0) tuning[jsKey] = tuningSection[tomlKey];
  }

  return tuning;
}

/**
 * Resolve limits configuration: start from profile defaults, apply explicit overrides.
 */
function resolveLimits(limitsSection, profileName) {
  const profile = LIMITS_PROFILES[profileName] || LIMITS_PROFILES.recommended;
  return {
    featureIssues: limitsSection["feature-issues"] || profile.featureIssues,
    maintenanceIssues: limitsSection["maintenance-issues"] || profile.maintenanceIssues,
    attemptsPerBranch: limitsSection["attempts-per-branch"] || profile.attemptsPerBranch,
    attemptsPerIssue: limitsSection["attempts-per-issue"] || profile.attemptsPerIssue,
    featuresLimit: limitsSection["features-limit"] || profile.featuresLimit,
    libraryLimit: limitsSection["library-limit"] || profile.libraryLimit,
  };
}

/**
 * Load configuration from agentic-lib.toml.
 *
 * If configPath ends in .toml, it is used directly.
 * Otherwise, the project root is derived (3 levels up from configPath)
 * and agentic-lib.toml is loaded from there.
 *
 * @param {string} configPath - Path to config file or YAML path (for project root derivation)
 * @returns {AgenticConfig} Parsed configuration object
 * @throws {Error} If no TOML config file is found
 */
export function loadConfig(configPath) {
  let tomlPath;
  if (configPath.endsWith(".toml")) {
    tomlPath = configPath;
  } else {
    const configDir = dirname(configPath);
    const projectRoot = join(configDir, "..", "..", "..");
    tomlPath = join(projectRoot, "agentic-lib.toml");
  }

  if (!existsSync(tomlPath)) {
    throw new Error(`Config file not found: ${tomlPath}. Create agentic-lib.toml in the project root.`);
  }

  const rawToml = readFileSync(tomlPath, "utf8");
  const toml = parseToml(rawToml);

  // Merge TOML paths with defaults, normalising library-sources → librarySources
  const rawPaths = { ...toml.paths };
  if (rawPaths["library-sources"]) {
    rawPaths.librarySources = rawPaths["library-sources"];
    delete rawPaths["library-sources"];
  }
  const mergedPaths = { ...PATH_DEFAULTS, ...rawPaths };

  // Build path objects with permissions
  const paths = {};
  const writablePaths = [];
  const readOnlyPaths = [];

  for (const [key, value] of Object.entries(mergedPaths)) {
    const isWritable = WRITABLE_KEYS.includes(key);
    paths[key] = { path: value, permissions: isWritable ? ["write"] : [] };
    if (isWritable) {
      writablePaths.push(value);
    } else {
      readOnlyPaths.push(value);
    }
  }

  const tuning = resolveTuning(toml.tuning || {});
  const limitsSection = toml.limits || {};
  const resolvedLimits = resolveLimits(limitsSection, tuning.profileName);

  // Apply resolved limits to path objects
  paths.features.limit = resolvedLimits.featuresLimit;
  paths.library.limit = resolvedLimits.libraryLimit;

  const execution = toml.execution || {};
  const bot = toml.bot || {};

  return {
    supervisor: toml.schedule?.supervisor || "daily",
    model: toml.tuning?.model || toml.schedule?.model || "gpt-5-mini",
    tuning,
    paths,
    buildScript: execution.build || "npm run build",
    testScript: execution.test || "npm test",
    mainScript: execution.start || "npm run start",
    featureDevelopmentIssuesWipLimit: resolvedLimits.featureIssues,
    maintenanceIssuesWipLimit: resolvedLimits.maintenanceIssues,
    attemptsPerBranch: resolvedLimits.attemptsPerBranch,
    attemptsPerIssue: resolvedLimits.attemptsPerIssue,
    transformationBudget: tuning.transformationBudget,
    seeding: toml.seeding || {},
    intentionBot: {
      intentionFilepath: bot["log-file"] || "intentïon.md",
    },
    tdd: toml.tdd === true,
    writablePaths,
    readOnlyPaths,
    configToml: rawToml,
    packageJson: readPackageJson(tomlPath, mergedPaths.dependencies),
  };
}

/**
 * Get the writable paths from config, optionally overridden by an input string.
 *
 * @param {AgenticConfig} config - Parsed config
 * @param {string} [override] - Semicolon-separated override paths
 * @returns {string[]} Array of writable paths
 */
export function getWritablePaths(config, override) {
  if (override) {
    return override
      .split(";")
      .map((p) => p.trim())
      .filter(Boolean);
  }
  return config.writablePaths;
}
