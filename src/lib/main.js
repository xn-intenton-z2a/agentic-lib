#!/usr/bin/env node
// src/lib/main.js - Enhanced version with improved flag processing, consolidated exit routine, and refined comments for clarity.
// This update improves code consistency, adds ASCII art for a friendly welcome, and enhances maintainability.

import { fileURLToPath } from "url";
import chalk from "chalk";
import figlet from "figlet";

// Helper function to handle application exit in a consistent manner
function exitApplication() {
  console.log("Exiting application.");
  // Prevent exiting during tests
  if (process.env.NODE_ENV !== "test") {
    process.exit(0);
  }
}

// Main function
export function main(args = []) {
  // Display ASCII art welcome if not in test environment
  if (process.env.NODE_ENV !== "test") {
    console.log(chalk.green(figlet.textSync("agentic-lib", { horizontalLayout: "full" })));
  }

  const usage = generateUsage();
  console.log(usage);
  console.log("");

  // If no arguments or a help/usage flag is provided, show demo and exit
  if (args.length === 0 || args.includes("--help") || args.includes("--usage")) {
    console.log("Demo: Demonstration of agentic-lib functionality:");
    console.log(enhancedDemo());
    console.log("No additional arguments provided.");
    exitApplication();
    return;
  }

  // Split arguments into flags and non-flag arguments
  const { flagArgs, nonFlagArgs } = splitArguments(args);

  // If the version flag is provided, display the version and exit
  if (flagArgs.includes("--version")) {
    console.log(showVersion());
    exitApplication();
    return;
  }

  // Process the flags sequentially
  const flagProcessingResult = processFlags(flagArgs);
  console.log(flagProcessingResult);

  if (nonFlagArgs.length > 0) {
    console.log("Non-flag arguments:", nonFlagArgs.join(", "));
  }

  exitApplication();
}

export function generateUsage() {
  return "Usage: npm run start [--usage|--help] [--version] [args...]";
}

export function getIssueNumberFromBranch(branch = "", prefix = "issue-") {
  // Regex captures one or more digits following the prefix; note the double backslash for digit class
  const regex = new RegExp(prefix + "(\\d+)");
  const match = branch.match(regex);
  return match ? parseInt(match[1], 10) : null;
}

export function sanitizeCommitMessage(message = "") {
  // Remove special characters except allowed ones and trim extra spaces
  return message
    .replace(/[^A-Za-z0-9 \-_.~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Splits command line arguments into flag and non-flag arrays
export function splitArguments(args = []) {
  const flagArgs = [];
  const nonFlagArgs = [];
  for (const arg of args) {
    if (arg.startsWith("--")) {
      flagArgs.push(arg);
    } else {
      nonFlagArgs.push(arg);
    }
  }
  return { flagArgs, nonFlagArgs };
}

// Processes an array of flags and returns a summary message
export function processFlags(flags = []) {
  if (flags.length === 0) return "No flags to process.";
  return `Processed flags: ${flags.join(", ")}`;
}

// Provides an enhanced demo output including environmental details
export function enhancedDemo() {
  const envDetails = logEnvironmentDetails();
  return `Enhanced Demo: Agentic-lib now supports additional argument processing.\n${envDetails}`;
}

// Logs current environment details
export function logEnvironmentDetails() {
  return `NODE_ENV: ${process.env.NODE_ENV || "undefined"}`;
}

// Returns the current version of the library
export function showVersion() {
  const version = process.env.npm_package_version || "unknown";
  return `Version: ${version}`;
}

export function reviewIssue({
  sourceFileContent,
  _testFileContent,
  readmeFileContent,
  _dependenciesFileContent,
  _issueTitle,
  _issueDescription,
  _issueComments,
  _dependenciesListOutput,
  _buildOutput,
  _testOutput,
  _mainOutput,
}) {
  const fixed =
    sourceFileContent.includes("Usage: npm run start") && readmeFileContent.includes("intentïon agentic-lib")
      ? "true"
      : "false";
  const message = fixed === "true" ? "The issue has been resolved." : "Issue not resolved.";
  return { fixed, message, refinement: "None" };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
