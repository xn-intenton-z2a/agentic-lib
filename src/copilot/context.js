// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// src/copilot/context.js — Context gathering and user prompt assembly
//
// Builds user prompts for each agent type from available local and GitHub context.
// Works with or without GitHub data — local-only context is always sufficient.

import { resolve } from "path";
import { execSync } from "child_process";
import { scanDirectory, readOptionalFile, extractFeatureSummary, formatPathsSection, summariseIssue, filterIssues } from "./session.js";
import { defaultLogger } from "./logger.js";

/**
 * Context requirements per agent. Defines what context each agent needs.
 * All fields are optional — the builder includes whatever is available.
 */
const AGENT_CONTEXT = {
  "agent-iterate": { mission: true, source: true, tests: true, features: true },
  "agent-discovery": { source: true, tests: true },
  "agent-issue-resolution": { mission: true, source: true, tests: true, features: true, issues: true },
  "agent-apply-fix": { source: true, tests: true },
  "agent-maintain-features": { mission: true, features: true, issues: true },
  "agent-maintain-library": { library: true, librarySources: true },
  "agent-ready-issue": { mission: true, features: true, issues: true },
  "agent-review-issue": { source: true, tests: true, issues: true },
  "agent-discussion-bot": { mission: true, features: true },
  "agent-supervisor": { mission: true, features: true, issues: true },
  "agent-director": { mission: true, features: true, issues: true, source: true, tests: true },
};

/**
 * Gather local context from the workspace filesystem.
 *
 * @param {string} workspacePath - Path to the workspace
 * @param {Object} config - Parsed agentic config (from config.js)
 * @param {Object} [options]
 * @param {Object} [options.logger]
 * @returns {Object} Context object with all available local data
 */
export function gatherLocalContext(workspacePath, config, { logger = defaultLogger } = {}) {
  const wsPath = resolve(workspacePath);
  const paths = config.paths || {};
  const tuning = config.tuning || {};

  const context = {};

  // Mission
  const missionPath = paths.mission?.path || "MISSION.md";
  context.mission = readOptionalFile(resolve(wsPath, missionPath));

  // Source files
  const sourcePath = paths.source?.path || "src/lib/";
  const sourceDir = resolve(wsPath, sourcePath);
  context.sourceFiles = scanDirectory(sourceDir, [".js", ".ts", ".mjs", ".cjs"], {
    fileLimit: tuning.sourceScan || 10,
    contentLimit: tuning.sourceContent || 5000,
    sortByMtime: true,
    clean: true,
    outline: true,
  }, logger);

  // Test files
  const testsPath = paths.tests?.path || "tests/";
  const testsDir = resolve(wsPath, testsPath);
  context.testFiles = scanDirectory(testsDir, [".js", ".ts", ".test.js", ".test.ts", ".spec.js"], {
    fileLimit: tuning.sourceScan || 10,
    contentLimit: tuning.testContent || 3000,
    sortByMtime: true,
    clean: true,
  }, logger);

  // Features
  const featuresPath = paths.features?.path || "features/";
  const featuresDir = resolve(wsPath, featuresPath);
  const featureFiles = scanDirectory(featuresDir, [".md"], {
    fileLimit: tuning.featuresScan || 10,
    sortByMtime: true,
  }, logger);
  context.features = featureFiles.map((f) => extractFeatureSummary(f.content, f.name));

  // Library
  const libraryPath = paths.library?.path || "library/";
  const libraryDir = resolve(wsPath, libraryPath);
  context.libraryFiles = scanDirectory(libraryDir, [".md"], {
    fileLimit: 10,
    contentLimit: tuning.documentSummary || 2000,
  }, logger);

  // Library sources
  const sourcesPath = paths.librarySources?.path || "SOURCES.md";
  context.librarySources = readOptionalFile(resolve(wsPath, sourcesPath));

  // Contributing guide
  const contributingPath = paths.contributing?.path || "CONTRIBUTING.md";
  context.contributing = readOptionalFile(resolve(wsPath, contributingPath), 2000);

  // Package.json
  context.packageJson = config.packageJson || readOptionalFile(resolve(wsPath, "package.json"), 3000);

  // Config TOML
  context.configToml = config.configToml || "";

  // Paths
  context.writablePaths = config.writablePaths || [];
  context.readOnlyPaths = config.readOnlyPaths || [];

  // Initial test output
  try {
    context.testOutput = execSync("npm test 2>&1", { cwd: wsPath, encoding: "utf8", timeout: 120000 });
  } catch (err) {
    context.testOutput = `STDOUT:\n${err.stdout || ""}\nSTDERR:\n${err.stderr || ""}`;
  }

  return context;
}

/**
 * Fetch GitHub context using the `gh` CLI.
 * Returns null fields when gh is unavailable or data can't be fetched.
 *
 * @param {Object} options
 * @param {number} [options.issueNumber] - Issue number to fetch
 * @param {number} [options.prNumber] - PR number to fetch
 * @param {string} [options.discussionUrl] - Discussion URL to fetch
 * @param {string} [options.workspacePath] - CWD for gh commands
 * @param {Object} [options.logger]
 * @returns {Object} GitHub context
 */
export function gatherGitHubContext({ issueNumber, prNumber, discussionUrl, workspacePath, logger = defaultLogger } = {}) {
  const github = { issues: [], issueDetail: null, prDetail: null, discussionDetail: null };
  const cwd = workspacePath || process.cwd();

  try {
    // Fetch open issues list
    const issuesJson = execSync("gh issue list --state open --limit 20 --json number,title,labels,body,createdAt,updatedAt", {
      cwd,
      encoding: "utf8",
      timeout: 30000,
    });
    const rawIssues = JSON.parse(issuesJson);
    github.issues = filterIssues(rawIssues.map((i) => ({
      number: i.number,
      title: i.title,
      body: i.body,
      labels: i.labels,
      created_at: i.createdAt,
      updated_at: i.updatedAt,
    })));
  } catch (err) {
    logger.info(`[context] Could not fetch issues: ${err.message}`);
  }

  // Fetch specific issue detail
  if (issueNumber) {
    try {
      const issueJson = execSync(`gh issue view ${issueNumber} --json number,title,body,labels,comments,createdAt`, {
        cwd,
        encoding: "utf8",
        timeout: 30000,
      });
      github.issueDetail = JSON.parse(issueJson);
    } catch (err) {
      logger.info(`[context] Could not fetch issue #${issueNumber}: ${err.message}`);
    }
  }

  // Fetch specific PR detail
  if (prNumber) {
    try {
      const prJson = execSync(`gh pr view ${prNumber} --json number,title,body,files,statusCheckRollup`, {
        cwd,
        encoding: "utf8",
        timeout: 30000,
      });
      github.prDetail = JSON.parse(prJson);
    } catch (err) {
      logger.info(`[context] Could not fetch PR #${prNumber}: ${err.message}`);
    }
  }

  // Fetch discussion
  if (discussionUrl) {
    try {
      // Extract discussion number from URL
      const match = discussionUrl.match(/discussions\/(\d+)/);
      if (match) {
        const num = match[1];
        const discussionJson = execSync(
          `gh api graphql -f query='{ repository(owner:"{owner}", name:"{repo}") { discussion(number: ${num}) { title body comments(last: 10) { nodes { body author { login } createdAt } } } } }'`,
          { cwd, encoding: "utf8", timeout: 30000 },
        );
        github.discussionDetail = JSON.parse(discussionJson);
      }
    } catch (err) {
      logger.info(`[context] Could not fetch discussion: ${err.message}`);
    }
  }

  return github;
}

/**
 * Build a user prompt for the given agent from available context.
 *
 * @param {string} agentName - Agent name (e.g. "agent-iterate")
 * @param {Object} localContext - From gatherLocalContext()
 * @param {Object} [githubContext] - From gatherGitHubContext() (optional)
 * @param {Object} [options]
 * @param {Object} [options.tuning] - Tuning config for limits
 * @returns {string} Assembled user prompt
 */
export function buildUserPrompt(agentName, localContext, githubContext, { tuning } = {}) {
  const needs = AGENT_CONTEXT[agentName] || AGENT_CONTEXT["agent-iterate"];
  const sections = [];

  // Mission
  if (needs.mission && localContext.mission) {
    sections.push(`# Mission\n\n${localContext.mission}`);
  }

  // Current test state
  if (localContext.testOutput) {
    const testPreview = localContext.testOutput.substring(0, 4000);
    sections.push(`# Current Test State\n\n\`\`\`\n${testPreview}\n\`\`\``);
  }

  // Source files
  if (needs.source && localContext.sourceFiles?.length > 0) {
    const sourceSection = [`# Source Files (${localContext.sourceFiles.length})`];
    for (const f of localContext.sourceFiles) {
      sourceSection.push(`## ${f.name}\n\`\`\`\n${f.content}\n\`\`\``);
    }
    sections.push(sourceSection.join("\n\n"));
  }

  // Test files
  if (needs.tests && localContext.testFiles?.length > 0) {
    const testSection = [`# Test Files (${localContext.testFiles.length})`];
    for (const f of localContext.testFiles) {
      testSection.push(`## ${f.name}\n\`\`\`\n${f.content}\n\`\`\``);
    }
    sections.push(testSection.join("\n\n"));
  }

  // Features
  if (needs.features && localContext.features?.length > 0) {
    const featureSection = [`# Features (${localContext.features.length})`];
    for (const f of localContext.features) {
      featureSection.push(f);
    }
    sections.push(featureSection.join("\n\n"));
  }

  // Library
  if (needs.library && localContext.libraryFiles?.length > 0) {
    const libSection = [`# Library Files (${localContext.libraryFiles.length})`];
    for (const f of localContext.libraryFiles) {
      libSection.push(`## ${f.name}\n${f.content}`);
    }
    sections.push(libSection.join("\n\n"));
  }

  // Library sources
  if (needs.librarySources && localContext.librarySources) {
    sections.push(`# Sources\n\n${localContext.librarySources}`);
  }

  // Issues (from GitHub context)
  if (needs.issues && githubContext?.issues?.length > 0) {
    const issueSection = [`# Open Issues (${githubContext.issues.length})`];
    for (const issue of githubContext.issues) {
      issueSection.push(summariseIssue(issue, tuning?.issueBodyLimit || 500));
    }
    sections.push(issueSection.join("\n\n"));
  }

  // Specific issue detail
  if (githubContext?.issueDetail) {
    const issue = githubContext.issueDetail;
    const issueSection = [`# Issue #${issue.number}: ${issue.title}\n\n${issue.body || "(no body)"}`];
    if (issue.comments?.length > 0) {
      issueSection.push("## Comments");
      for (const c of issue.comments.slice(-10)) {
        issueSection.push(`**${c.author?.login || "unknown"}**: ${c.body}`);
      }
    }
    sections.push(issueSection.join("\n\n"));
  }

  // Specific PR detail
  if (githubContext?.prDetail) {
    const pr = githubContext.prDetail;
    const prSection = [`# PR #${pr.number}: ${pr.title}\n\n${pr.body || "(no body)"}`];
    if (pr.files?.length > 0) {
      prSection.push(`## Changed Files\n${pr.files.map((f) => `- ${f.path}`).join("\n")}`);
    }
    sections.push(prSection.join("\n\n"));
  }

  // File paths section
  if (localContext.writablePaths?.length > 0 || localContext.readOnlyPaths?.length > 0) {
    sections.push(formatPathsSection(
      localContext.writablePaths || [],
      localContext.readOnlyPaths || [],
      { configToml: localContext.configToml, packageJson: localContext.packageJson },
    ));
  }

  // Instructions
  sections.push([
    "Implement this mission. Read the existing source code and tests,",
    "make the required changes, run run_tests to verify, and iterate until all tests pass.",
    "",
    "Start by reading the existing files, then implement the solution.",
  ].join("\n"));

  return sections.join("\n\n");
}
