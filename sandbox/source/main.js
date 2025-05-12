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
 * Processes the --validate-package flag by reading and validating root package.json
 * @param {string[]} args - CLI arguments
 */
export async function processValidatePackage(
  args = process.argv.slice(2),
) {
  if (!args.includes("--validate-package")) {
    return false;
  }
  const pkgPath = path.resolve("package.json");
  let content;
  try {
    content = await readFile(pkgPath, "utf8");
  } catch (error) {
    console.error(
      JSON.stringify({ level: "error", message: "Failed to read package.json", error: error.message }),
    );
    process.exit(1);
  }
  let pkg;
  try {
    pkg = JSON.parse(content);
  } catch (error) {
    console.error(
      JSON.stringify({ level: "error", message: "Failed to parse package.json", error: error.message }),
    );
    process.exit(1);
  }
  const errors = [];
  if (typeof pkg.name !== "string" || pkg.name.trim() === "") {
    errors.push({ level: "error", message: "Package manifest missing or invalid field", field: "name" });
  }
  const semverRegex = /^\d+\.\d+\.\d+(-[\w\.\+]+)?(\+[\w\.\+]+)?$/;
  if (typeof pkg.version !== "string" || !semverRegex.test(pkg.version)) {
    errors.push({ level: "error", message: "Package manifest missing or invalid field", field: "version" });
  }
  if (typeof pkg.description !== "string" || pkg.description.trim() === "") {
    errors.push({ level: "error", message: "Package manifest missing or invalid field", field: "description" });
  }
  if (typeof pkg.main !== "string" || pkg.main.trim() === "") {
    errors.push({ level: "error", message: "Package manifest missing or invalid field", field: "main" });
  }
  if (!pkg.scripts || typeof pkg.scripts.test !== "string" || pkg.scripts.test.trim() === "") {
    errors.push({ level: "error", message: "Package manifest missing or invalid field", field: "scripts.test" });
  }
  if (!pkg.engines || typeof pkg.engines.node !== "string") {
    errors.push({ level: "error", message: "Package manifest missing or invalid field", field: "engines.node" });
  } else {
    const enginesRegex = /^>=\s*20(\.\d+){0,2}$/;
    if (!enginesRegex.test(pkg.engines.node)) {
      errors.push({ level: "error", message: "Package manifest missing or invalid field", field: "engines.node" });
    }
  }
  if (errors.length > 0) {
    errors.forEach((err) => console.error(JSON.stringify(err)));
    process.exit(1);
  }
  console.log(JSON.stringify({ level: "info", message: "Package manifest validation passed" }));
  process.exit(0);
}

/**
 * Processes the --validate-tests flag by reading coverage summary JSON and validating coverage thresholds.
 * @param {string[]} args - CLI arguments
 * @returns {Promise<boolean>} - True if flag processed, false otherwise
 */
export async function processValidateTests(args = process.argv.slice(2)) {
  if (!args.includes("--validate-tests")) {
    return false;
  }
  const summaryPath = path.resolve("coverage/coverage-summary.json");
  let content;
  try {
    content = await readFile(summaryPath, "utf8");
  } catch (error) {
    console.error(
      JSON.stringify({ level: "error", message: "Failed to read coverage summary", error: error.message }),
    );
    process.exit(1);
  }
  let summary;
  try {
    summary = JSON.parse(content);
  } catch (error) {
    console.error(
      JSON.stringify({ level: "error", message: "Failed to parse coverage summary", error: error.message }),
    );
    process.exit(1);
  }
  const thresholds = { statements: 80, branches: 80, functions: 80, lines: 80 };
  const failed = [];
  const coverageOutput = {};
  Object.keys(thresholds).forEach((metric) => {
    const data = summary[metric];
    const actual = data && typeof data.pct === 'number' ? data.pct : 0;
    coverageOutput[metric] = actual;
    if (actual < thresholds[metric]) {
      console.error(
        JSON.stringify({ level: "error", metric, threshold: thresholds[metric], actual }),
      );
      failed.push(metric);
    }
  });
  if (failed.length > 0) {
    process.exit(1);
  }
  console.log(
    JSON.stringify({ level: "info", message: "Test coverage validation passed", coverage: coverageOutput }),
  );
  process.exit(0);
}

/**
 * Processes the --validate-lint flag by running ESLint and reporting violations.
 * @param {string[]} args - CLI arguments
 * @returns {Promise<boolean>} - True if flag processed, false otherwise
 */
export async function processValidateLint(args = process.argv.slice(2)) {
  if (!args.includes("--validate-lint")) {
    return false;
  }
  let result;
  try {
    result = spawnSync("eslint", ["sandbox/source/", "sandbox/tests/"], { encoding: "utf8" });
  } catch (error) {
    console.error(
      JSON.stringify({ level: "error", message: "Lint process failed", error: error.message }),
    );
    process.exit(1);
  }
  if (result.error) {
    console.error(
      JSON.stringify({ level: "error", message: "Lint process failed", error: result.error.message }),
    );
    process.exit(1);
  }
  if (result.status !== 0) {
    const output = `${result.stdout || ''}${result.stderr || ''}`;
    const lines = output.split("\n").filter((l) => l.trim());
    lines.forEach((line) => {
      const m = line.match(/^(.*?):(\d+):(\d+)\s+(.*?)\s+\[(.*?)\]$/);
      if (m) {
        const [, file, lineNum, colNum, msg, ruleId] = m;
        console.error(
          JSON.stringify({ level: "error", file, line: Number(lineNum), column: Number(colNum), ruleId, message: msg }),
        );
      }
    });
    process.exit(1);
  }
  console.log(JSON.stringify({ level: "info", message: "Lint validation passed" }));
  process.exit(0);
}

/**
 * Processes the --validate-license flag by ensuring LICENSE.md exists and has valid SPDX identifier.
 * @param {string[]} args - CLI arguments
 * @returns {Promise<boolean>} - True if flag processed, false otherwise
 */
export async function processValidateLicense(args = process.argv.slice(2)) {
  if (!args.includes("--validate-license")) {
    return false;
  }
  const licensePath = path.resolve("LICENSE.md");
  let content;
  try {
    content = await readFile(licensePath, "utf8");
  } catch (error) {
    console.error(
      JSON.stringify({ level: "error", message: "Failed to read license file", error: error.message }),
    );
    process.exit(1);
  }
  const lines = content
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l);
  if (lines.length === 0) {
    console.error(
      JSON.stringify({ level: "error", message: "License missing or invalid SPDX identifier" }),
    );
    process.exit(1);
  }
  const first = lines[0];
  const valid = /^(MIT|ISC|Apache-2\.0|GPL-3\.0)/.test(first);
  if (!valid) {
    console.error(
      JSON.stringify({ level: "error", message: "License missing or invalid SPDX identifier" }),
    );
    process.exit(1);
  }
  console.log(JSON.stringify({ level: "info", message: "License validation passed" }));
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
