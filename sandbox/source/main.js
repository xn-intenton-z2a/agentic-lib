import { readdir, readFile } from "fs/promises";
import path from "path";

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
  if (await processValidateFeatures(args)) {
    return;
  }
  console.log("No validate-features flag supplied.");
}

// Auto-execute when run directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith("sandbox/source/main.js")) {
  main().catch((error) => {
    console.error(
      JSON.stringify({
        level: "error",
        message: "Fatal error in validate-features",
        error: error.message,
      }),
    );
    process.exit(1);
  });
}
