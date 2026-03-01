#!/usr/bin/env node
// bin/agentic-lib.js — CLI for @xn-intenton-z2a/agentic-lib
//
// Usage:
//   npx @xn-intenton-z2a/agentic-lib init           # set up agentic infrastructure
//   npx @xn-intenton-z2a/agentic-lib init --purge    # also reset source files to seeds
//   npx @xn-intenton-z2a/agentic-lib update          # alias for init
//   npx @xn-intenton-z2a/agentic-lib reset           # alias for init --purge

import { copyFileSync, existsSync, mkdirSync, rmSync, readdirSync, readFileSync } from "fs";
import { resolve, dirname, join, relative } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(__dirname, "..");
const srcDir = resolve(pkgRoot, "src");

const args = process.argv.slice(2);
const command = args[0];
const flags = args.slice(1);

const HELP = `
@xn-intenton-z2a/agentic-lib — Agentic Coding Systems SDK

Commands:
  init [--purge]   Set up or update agentic infrastructure in the current repo
  update           Alias for init
  reset            Alias for init --purge
  version          Show version

Options:
  --purge          Also reset source files (main.js, tests, MISSION.md, etc.) to seed state
  --dry-run        Show what would be done without making changes
  --target <path>  Target repository (default: current directory)

Examples:
  npx @xn-intenton-z2a/agentic-lib init
  npx @xn-intenton-z2a/agentic-lib init --purge
  npx @xn-intenton-z2a/agentic-lib reset --dry-run
`.trim();

if (!command || command === "--help" || command === "-h" || command === "help") {
  console.log(HELP);
  process.exit(0);
}

if (command === "version" || command === "--version" || command === "-v") {
  const pkg = JSON.parse(readFileSync(resolve(pkgRoot, "package.json"), "utf8"));
  console.log(pkg.version);
  process.exit(0);
}

// Parse flags
const dryRun = flags.includes("--dry-run");
const targetIdx = flags.indexOf("--target");
const targetPath = targetIdx >= 0 ? flags[targetIdx + 1] : process.cwd();
const target = resolve(targetPath);

let purge = flags.includes("--purge");
if (command === "reset") purge = true;

if (!["init", "update", "reset"].includes(command)) {
  console.error(`Unknown command: ${command}`);
  console.error('Run with --help for usage.');
  process.exit(1);
}

// Verify target looks like a repo
if (!existsSync(target)) {
  console.error(`Target directory does not exist: ${target}`);
  process.exit(1);
}

// Verify source files exist
if (!existsSync(srcDir)) {
  console.error(`Source directory not found: ${srcDir}`);
  console.error("This package may not have been installed with full source files.");
  console.error("Check that the 'files' field in package.json includes 'src/'.");
  process.exit(1);
}

const agenticDir = resolve(target, ".github/agentic-lib");
let changes = 0;

function copyFile(src, dst, label) {
  if (dryRun) {
    console.log(`  COPY: ${label}`);
  } else {
    mkdirSync(dirname(dst), { recursive: true });
    copyFileSync(src, dst);
    console.log(`  COPY: ${label}`);
  }
  changes++;
}

function copyDirRecursive(srcPath, dstPath, label, excludes = []) {
  if (!existsSync(srcPath)) {
    console.log(`  SKIP: ${label} (not found)`);
    return;
  }
  const entries = readdirSync(srcPath, { withFileTypes: true });
  for (const entry of entries) {
    const srcFull = join(srcPath, entry.name);
    const dstFull = join(dstPath, entry.name);
    const relLabel = `${label}/${entry.name}`;

    if (excludes.some((ex) => entry.name === ex || srcFull.includes(ex))) continue;

    if (entry.isDirectory()) {
      copyDirRecursive(srcFull, dstFull, relLabel, excludes);
    } else {
      copyFile(srcFull, dstFull, relLabel);
    }
  }
}

console.log("");
console.log("=== @xn-intenton-z2a/agentic-lib init ===");
console.log(`Source:  ${srcDir}`);
console.log(`Target:  ${target}`);
console.log(`Purge:   ${purge}`);
console.log(`Mode:    ${dryRun ? "DRY RUN" : "LIVE"}`);
console.log("");

// 1. Workflows → .github/workflows/
console.log("--- Workflows ---");
const workflowsDir = resolve(srcDir, "workflows");
if (existsSync(workflowsDir)) {
  for (const f of readdirSync(workflowsDir)) {
    if (f.endsWith(".yml")) {
      copyFile(resolve(workflowsDir, f), resolve(target, ".github/workflows", f), `workflows/${f}`);
    }
  }
}

// 2. Actions → .github/agentic-lib/actions/
console.log("\n--- Actions ---");
const actionsDir = resolve(srcDir, "actions");
if (existsSync(actionsDir)) {
  for (const actionName of readdirSync(actionsDir, { withFileTypes: true })) {
    if (actionName.isDirectory()) {
      copyDirRecursive(
        resolve(actionsDir, actionName.name),
        resolve(agenticDir, "actions", actionName.name),
        `actions/${actionName.name}`,
        ["node_modules"],
      );
    }
  }
}

// 3. Agents → .github/agentic-lib/agents/
console.log("\n--- Agents ---");
const agentsDir = resolve(srcDir, "agents");
if (existsSync(agentsDir)) {
  for (const f of readdirSync(agentsDir)) {
    copyFile(resolve(agentsDir, f), resolve(agenticDir, "agents", f), `agents/${f}`);
  }
}

// 4. Seeds → .github/agentic-lib/seeds/
console.log("\n--- Seeds ---");
const seedsDir = resolve(srcDir, "seeds");
if (existsSync(seedsDir)) {
  for (const f of readdirSync(seedsDir)) {
    copyFile(resolve(seedsDir, f), resolve(agenticDir, "seeds", f), `seeds/${f}`);
  }
}

// 5. Scripts → .github/agentic-lib/scripts/ (selected scripts only)
console.log("\n--- Scripts ---");
const scriptsDir = resolve(srcDir, "scripts");
const DISTRIBUTED_SCRIPTS = [
  "accept-release.sh",
  "activate-schedule.sh",
  "clean.sh",
  "initialise.sh",
  "md-to-html.js",
  "update.sh",
];
if (existsSync(scriptsDir)) {
  for (const name of DISTRIBUTED_SCRIPTS) {
    const src = resolve(scriptsDir, name);
    if (existsSync(src)) {
      copyFile(src, resolve(agenticDir, "scripts", name), `scripts/${name}`);
    }
  }
}

// 6. Purge: reset source files to seed state
if (purge) {
  console.log("\n--- Reset Source Files to Seed State ---");

  const SEED_MAP = {
    "zero-main.js": "src/lib/main.js",
    "zero-main.test.js": "tests/unit/main.test.js",
    "zero-MISSION.md": "MISSION.md",
    "zero-package.json": "package.json",
    "zero-README.md": "README.md",
  };

  for (const [seedFile, targetRel] of Object.entries(SEED_MAP)) {
    const src = resolve(seedsDir, seedFile);
    if (existsSync(src)) {
      copyFile(src, resolve(target, targetRel), `SEED: ${seedFile} → ${targetRel}`);
    } else {
      console.log(`  SKIP: ${seedFile} (not found)`);
    }
  }

  // Remove activity log
  const intentionFile = resolve(target, "intentïon.md");
  if (existsSync(intentionFile)) {
    if (dryRun) {
      console.log("  REMOVE: intentïon.md");
    } else {
      rmSync(intentionFile);
      console.log("  REMOVE: intentïon.md");
    }
    changes++;
  }

  // Clear features
  const featuresDir = resolve(agenticDir, "features");
  if (existsSync(featuresDir)) {
    const files = readdirSync(featuresDir);
    for (const f of files) {
      if (dryRun) {
        console.log(`  REMOVE: features/${f}`);
      } else {
        rmSync(resolve(featuresDir, f));
        console.log(`  REMOVE: features/${f}`);
      }
      changes++;
    }
  }
}

console.log(`\n${changes} change(s)${dryRun ? " (dry run)" : ""}`);

if (!dryRun && changes > 0) {
  console.log("\nNext steps:");
  if (purge) {
    console.log(`  cd ${target} && npm install`);
  }
  console.log(`  cd ${resolve(agenticDir, "actions/agentic-step")} && npm ci`);
  console.log("  npm test");
}
