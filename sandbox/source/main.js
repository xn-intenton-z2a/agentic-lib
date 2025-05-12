import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import MarkdownIt from "markdown-it";
import { createRequire } from "module";
import { spawnSync } from "child_process";
const requireModule = createRequire(import.meta.url);

/**
 * Processes the --generate-interactive-examples flag by scanning README for
 * mermaid-workflow code blocks and generating interactive HTML snippets.
 * @param {string[]} args - CLI arguments
 * @returns {Promise<boolean>} - True if flag processed, false otherwise
 */
export async function processGenerateInteractiveExamples(
  args = process.argv.slice(2),
) {
  if (!args.includes("--generate-interactive-examples")) {
    return false;
  }

  const readmePath = path.resolve("sandbox/README.md");
  let content;
  try {
    content = await readFile(readmePath, "utf8");
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        message: "Failed to read README.md",
        error: error.message,
      }),
    );
    process.exit(1);
  }

  const codeBlockRegex = /```mermaid-workflow\n([\s\S]*?)```/g;
  const blocks = [];
  let match;
  while ((match = codeBlockRegex.exec(content)) !== null) {
    blocks.push(match[1]);
  }

  if (blocks.length === 0) {
    console.log(
      JSON.stringify({
        level: "warn",
        message: "No mermaid-workflow blocks found",
      }),
    );
    process.exit(0);
  }

  // Initialize markdown-it with GitHub plugin
  let md;
  try {
    md = new MarkdownIt();
    const plugin = requireModule("markdown-it-github");
    md.use(plugin);
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        message: "Failed to initialize markdown renderer",
        error: error.message,
      }),
    );
    process.exit(1);
  }

  // Render each block into HTML
  let renderedSnippets;
  try {
    renderedSnippets = blocks.map(
      (block) =>
        `<div class=\"interactive-example\">\n${md.render(
          "```mermaid-workflow\n" + block + "\n```",
        )}</div>`,
    );
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        message: "Failed to render mermaid-workflow",
        error: error.message,
      }),
    );
    process.exit(1);
  }

  // Remove existing Examples section if present
  const exampleSectionRegex = /^## Examples[\s\S]*$/m;
  const mainContent = content.replace(exampleSectionRegex, "").trimEnd();

  // Construct new Examples section
  const examplesSection =
    "## Examples\n\n" + renderedSnippets.join("\n\n") + "\n";

  const newContent = mainContent + "\n\n" + examplesSection;

  // Write back README.md
  try {
    await writeFile(readmePath, newContent, "utf8");
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        message: "Failed to write README.md",
        error: error.message,
      }),
    );
    process.exit(1);
  }

  console.log(
    JSON.stringify({
      level: "info",
      message: "Interactive examples generated",
      updatedBlocks: blocks.length,
    }),
  );
  process.exit(0);
}

/**
 * Processes the --fix-features flag by injecting mission statement references into any markdown
 * files under sandbox/features that are missing one.
 * @param {string[]} args - CLI arguments
 * @returns {Promise<boolean>} - True if flag processed, false otherwise
 */
export async function processFixFeatures(
  args = process.argv.slice(2),
) {
  if (!args.includes("--fix-features")) {
    return false;
  }

  const featuresDir = path.resolve("sandbox/features");
  let files;
  try {
    files = await readdir(featuresDir);
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        message: "Failed to read features directory",
        error: error.message,
      }),
    );
    process.exit(1);
  }

  const mdFiles = files.filter((file) => file.endsWith(".md"));
  const modifiedFiles = [];

  for (const file of mdFiles) {
    const filePath = path.join(featuresDir, file);
    let content;
    try {
      content = await readFile(filePath, "utf8");
    } catch (error) {
      console.error(
        JSON.stringify({
          level: "error",
          message: "Failed to read feature file",
          file: filePath,
          error: error.message,
        }),
      );
      process.exit(1);
    }
    if (content.includes("MISSION.md") || content.includes("# Mission")) {
      continue;
    }
    const referenceLine = "> See our [Mission Statement](../../MISSION.md)\n\n";
    const newContent = referenceLine + content;
    try {
      await writeFile(filePath, newContent, "utf8");
    } catch (error) {
      console.error(
        JSON.stringify({
          level: "error",
          message: "Failed to fix feature files",
          error: error.message,
        }),
      );
      process.exit(1);
    }
    modifiedFiles.push(file);
  }

  console.log(
    JSON.stringify({
      level: "info",
      message: "Fixed feature files to include mission reference",
      filesModified: modifiedFiles,
    }),
  );
  process.exit(0);
}

/**
 * Processes the --validate-features flag by ensuring each markdown file in sandbox/features
 * references the mission statement (MISSION.md or # Mission).
 * @param {string[]} args - CLI arguments
 * @returns {Promise<boolean>} - True if flag processed, false otherwise
 */
export async function processValidateFeatures(args = process.argv.slice(2)) {
  if (!args.includes("--validate-features")) {
    return false;
  }

  const featuresDir = path.resolve("sandbox/features");
  let files;
  try {
    files = await readdir(featuresDir);
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        message: "Failed to read features directory",
        error: error.message,
      }),
    );
    process.exit(1);
  }

  const mdFiles = files.filter((file) => file.endsWith(".md"));
  const failedFiles = [];
  for (const file of mdFiles) {
    const filePath = path.join(featuresDir, file);
    let content;
    try {
      content = await readFile(filePath, "utf8");
    } catch (error) {
      console.error(
        JSON.stringify({
          level: "error",
          message: "Failed to read feature file",
          file: filePath,
          error: error.message,
        }),
      );
      failedFiles.push(filePath);
      continue;
    }
    if (!content.includes("MISSION.md") && !content.includes("# Mission")) {
      console.error(
        JSON.stringify({
          level: "error",
          message: "Feature file missing mission reference",
          file: filePath,
        }),
      );
      failedFiles.push(filePath);
    }
  }

  if (failedFiles.length > 0) {
    process.exit(1);
  }

  console.log(
    JSON.stringify({
      level: "info",
      message: "All feature files reference mission statement",
    }),
  );
  return true;
}

/**
 * Processes the --validate-readme flag by ensuring sandbox/README.md contains critical references.
 * @param {string[]} args - CLI arguments
 * @returns {Promise<boolean>} - True if flag processed, false otherwise
 */
export async function processValidateReadme(args = process.argv.slice(2)) {
  if (!args.includes("--validate-readme")) {
    return false;
  }

  const readmePath = path.resolve("sandbox/README.md");
  let content;
  try {
    content = await readFile(readmePath, "utf8");
  } catch (error) {
    console.error(
      JSON.stringify({ level: "error", message: "Failed to read README.md", error: error.message }),
    );
    process.exit(1);
  }

  const references = [
    "MISSION.md",
    "CONTRIBUTING.md",
    "LICENSE.md",
    "https://github.com/xn-intenton-z2a/agentic-lib",
  ];
  const missing = references.filter((ref) => !content.includes(ref));

  if (missing.length > 0) {
    for (const ref of missing) {
      console.error(
        JSON.stringify({ level: "error", message: `README missing reference: ${ref}` }),
      );
    }
    process.exit(1);
  }

  console.log(
    JSON.stringify({ level: "info", message: "README validation passed" }),
  );
  return true;
}

/**
 * Processes the --features-overview flag by generating a markdown summary of all sandbox CLI flags.
 * @param {string[]} args - CLI arguments
 * @returns {Promise<boolean>} - True if flag processed, false otherwise
 */
export async function processFeaturesOverview(args =process.argv.slice(2)) {
  if (!args.includes("--features-overview")) {
    return false;
  }
  const flags = [
    [
      "--generate-interactive-examples",
      "Scans sandbox/README.md for ```mermaid-workflow``` fenced code blocks and generates interactive HTML snippets in an Examples section.",
    ],
    [
      "--fix-features",
      "Injects mission statement references into markdown files under sandbox/features missing one.",
    ],
    [
      "--validate-features",
      "Ensures markdown files in sandbox/features reference mission statement.",
    ],
    [
      "--validate-readme",
      "Ensures sandbox/README.md contains references to MISSION.md, CONTRIBUTING.md, LICENSE.md, and the repository URL.",
    ],
    [
      "--features-overview",
      "Generates a markdown summary of all sandbox CLI flags and their descriptions.",
    ],
    [
      "--audit-dependencies",
      "Audits npm dependencies for vulnerabilities at or above the configured severity threshold (AUDIT_SEVERITY).",
    ],
    [
      "--validate-package",
      "Parses and validates the root package.json for required fields.",
    ],
    [
      "--validate-tests",
      "Validates test coverage metrics (statements, branches, functions, lines) meet the 80% threshold.",
    ],
    [
      "--validate-lint",
      "Runs ESLint on sandbox source and tests, reporting any lint violations.",
    ],
    [
      "--validate-license",
      "Ensures LICENSE.md exists and has a valid SPDX license identifier.",
    ],
  ];
  // Build markdown table
  const header = "| Flag | Description |";
  const separator = "| --- | --- |";
  const rows = flags.map(([f, d]) => `| ${f} | ${d} |`);
  const markdown = ["# Features Overview", "", header, separator, ...rows].join("\n");
  const docsPath = path.resolve("sandbox/docs/FEATURES_OVERVIEW.md");

  try {
    await writeFile(docsPath, markdown + "\n", "utf8");
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        message: "Failed to generate features overview",
        error: error.message,
      }),
    );
    process.exit(1);
  }

  console.log(JSON.stringify({ level: "info", featuresOverview: markdown }));
  process.exit(0);
}

/**
 * Processes the --audit-dependencies flag by running npm audit and enforcing a severity threshold.
 * @param {string[]} args - CLI arguments
 * @returns {Promise<boolean>} - True if flag processed, false otherwise
 */
export async function processAuditDependencies(args = process.argv.slice(2)) {
  if (!args.includes("--audit-dependencies")) {
    return false;
  }
  const severityEnv = process.env.AUDIT_SEVERITY;
  const allowed = ["low", "moderate", "high", "critical"];
  const threshold = allowed.includes(severityEnv) ? severityEnv : "moderate";
  let result;
  try {
    result = spawnSync("npm", ["audit", "--json"], { encoding: "utf8" });
  } catch (error) {
    console.error(
      JSON.stringify({ level: "error", message: "Failed to run or parse npm audit", error: error.message }),
    );
    process.exit(1);
  }
  if (result.error) {
    console.error(
      JSON.stringify({ level: "error", message: "Failed to run or parse npm audit", error: result.error.message }),
    );
    process.exit(1);
  }
  let audit;
  try {
    audit = JSON.parse(result.stdout);
  } catch (error) {
    console.error(
      JSON.stringify({ level: "error", message: "Failed to run or parse npm audit", error: error.message }),
    );
    process.exit(1);
  }
  const { metadata, advisories } = audit;
  const vulnCounts = (metadata && metadata.vulnerabilities) || { low: 0, moderate: 0, high: 0, critical: 0 };
  const severityOrder = ["low", "moderate", "high", "critical"];
  const thresholdIndex = severityOrder.indexOf(threshold);
  const items = Object.values(advisories || {});
  const filtered = items.filter((a) => severityOrder.indexOf(a.severity) >= thresholdIndex);
  if (filtered.length > 0) {
    filtered.forEach((a) => {
      console.error(
        JSON.stringify({
          level: "error",
          module: a.module_name,
          severity: a.severity,
          title: a.title,
          vulnerableVersions: a.vulnerable_versions,
          patchedVersions: a.patched_versions,
          url: a.url,
        }),
      );
    });
    process.exit(1);
  }
  console.log(
    JSON.stringify({ level: "info", message: "Dependency audit passed", counts: vulnCounts }),
  );
  process.exit(0);
}

/**
 * Main CLI entrypoint for sandbox mode
 * @param {string[]} args - CLI arguments
 */
export async function main(args = process.argv.slice(2)) {
  if (await processGenerateInteractiveExamples(args)) {
    return;
  }
  if (await processFixFeatures(args)) {
    return;
  }
  if (await processFeaturesOverview(args)) {
    return;
  }
  if (await processAuditDependencies(args)) {
    return;
  }
  if (await processValidatePackage(args)) {
    return;
  }
  if (await processValidateTests(args)) {
    return;
  }
  if (await processValidateLint(args)) {
    return;
  }
  if (await processValidateLicense(args)) {
    return;
  }
  const featureHandled = await processValidateFeatures(args);
  const readmeHandled = await processValidateReadme(args);
  if (featureHandled || readmeHandled) {
    return;
  }
  console.log("No validate-features or validate-readme flag supplied.");
}

// Auto-execute when run directly
if (
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1].endsWith("sandbox/source/main.js")
) {
  main().catch((error) => {
    console.error(
      JSON.stringify({ level: "error", message: "Fatal error in sandbox CLI", error: error.message }),
    );
    process.exit(1);
  });
}
