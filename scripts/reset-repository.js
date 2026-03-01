#!/usr/bin/env node
// reset-repository.js — Reset a target repository to the seed template state
//
// Copies seed files from agentic-lib to a target repository, removing
// evolved artifacts like the activity log and features.
//
// Usage:
//   node scripts/reset-repository.js [target-path]
//   node scripts/reset-repository.js ../repository0
//   node scripts/reset-repository.js --dry-run ../repository0

import { copyFileSync, existsSync, rmSync, readdirSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedsDir = resolve(__dirname, "../src/seeds");

// Seed file mapping: seed filename → target path (relative to target repo)
const SEED_MAP = {
  "zero-main.js": "src/lib/main.js",
  "zero-main.test.js": "tests/unit/main.test.js",
  "zero-MISSION.md": "MISSION.md",
  "zero-package.json": "package.json",
  "zero-README.md": "README.md",
};

// Files to remove during reset
const REMOVE_FILES = ["intentïon.md"];

// Directories to clear during reset (remove all contents)
const CLEAR_DIRS = [".github/agentic-lib/features"];

function usage() {
  console.log("Usage: node scripts/reset-repository.js [--dry-run] <target-path>");
  console.log("");
  console.log("Resets a target repository to the clean seed template state.");
  console.log("");
  console.log("Options:");
  console.log("  --dry-run    Show what would be done without making changes");
  console.log("");
  console.log("Examples:");
  console.log("  node scripts/reset-repository.js ../repository0");
  console.log("  node scripts/reset-repository.js --dry-run ../repository0");
  process.exit(1);
}

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const targetPath = args.filter((a) => a !== "--dry-run")[0];

if (!targetPath) {
  usage();
}

const target = resolve(targetPath);

if (!existsSync(target)) {
  console.error(`ERROR: Target path does not exist: ${target}`);
  process.exit(1);
}

if (!existsSync(resolve(target, "package.json"))) {
  console.error(`ERROR: Target does not look like a repository (no package.json): ${target}`);
  process.exit(1);
}

console.log(`\n=== Reset Repository to Seed Template ===`);
console.log(`Seeds: ${seedsDir}`);
console.log(`Target: ${target}`);
console.log(`Mode: ${dryRun ? "DRY RUN" : "LIVE"}\n`);

let changes = 0;

// Copy seed files
for (const [seedFile, targetRelPath] of Object.entries(SEED_MAP)) {
  const src = resolve(seedsDir, seedFile);
  const dst = resolve(target, targetRelPath);

  if (!existsSync(src)) {
    console.log(`  SKIP: ${seedFile} (seed file not found)`);
    continue;
  }

  // Ensure target directory exists
  const dstDir = dirname(dst);
  if (!existsSync(dstDir)) {
    if (dryRun) {
      console.log(`  MKDIR: ${dstDir}`);
    } else {
      mkdirSync(dstDir, { recursive: true });
    }
  }

  if (dryRun) {
    console.log(`  COPY: ${seedFile} → ${targetRelPath}`);
  } else {
    copyFileSync(src, dst);
    console.log(`  COPY: ${seedFile} → ${targetRelPath}`);
  }
  changes++;
}

// Remove evolved artifacts
for (const file of REMOVE_FILES) {
  const filePath = resolve(target, file);
  if (existsSync(filePath)) {
    if (dryRun) {
      console.log(`  REMOVE: ${file}`);
    } else {
      rmSync(filePath);
      console.log(`  REMOVE: ${file}`);
    }
    changes++;
  }
}

// Clear feature directories
for (const dir of CLEAR_DIRS) {
  const dirPath = resolve(target, dir);
  if (existsSync(dirPath)) {
    const files = readdirSync(dirPath);
    for (const f of files) {
      const fp = resolve(dirPath, f);
      if (dryRun) {
        console.log(`  REMOVE: ${dir}/${f}`);
      } else {
        rmSync(fp);
        console.log(`  REMOVE: ${dir}/${f}`);
      }
      changes++;
    }
  }
}

console.log(`\n${changes} change(s)${dryRun ? " (dry run)" : ""}`);

if (!dryRun && changes > 0) {
  console.log("\nNext steps:");
  console.log(`  cd ${target}`);
  console.log("  npm install        # regenerate package-lock.json");
  console.log("  npm test           # verify clean state");
  console.log("  git add -A && git commit -m 'Reset to seed template'");
}
