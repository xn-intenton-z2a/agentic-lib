import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import MarkdownIt from "markdown-it";
import { createRequire } from "module";
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
        `<div class="interactive-example">\n${md.render(
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
 * Main CLI entrypoint for sandbox mode
 * @param {string[]} args - CLI arguments
 */
export async function main(args = process.argv.slice(2)) {
  if (await processGenerateInteractiveExamples(args)) {
    return;
  }
  if (await processValidateFeatures(args)) {
    return;
  }
  console.log("No validate-features flag supplied.");
}

// Auto-execute when run directly
if (
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1].endsWith("sandbox/source/main.js")
) {
  main().catch((error) => {
    console.error(
      JSON.stringify({
        level: "error",
        message: "Fatal error in sandbox CLI",
        error: error.message,
      }),
    );
    process.exit(1);
  });
}
