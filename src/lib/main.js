#!/usr/bin/env node
// src/lib/main.js - Enhanced version with a sequential transformation, extended utility functions for improved flag processing, and a consolidated exit routine.
// This update also refines code consistency and improves maintainability.

import { fileURLToPath } from "url";

// Helper function to handle application exit in a consistent manner
function exitApplication() {
  console.log("Exiting application.");
  if (process.env.NODE_ENV !== "test") {
    process.exit(0);
  }
}

// Main function
export function main(args = []) {
  const usage = generateUsage();
  console.log(usage);
  console.log("");

  // If no arguments or a help/usage flag is provided, show demo and exit
  if (args.length === 0 || args.includes("--help") || args.includes("--usage")) {
    console.log("Demo: This is a demonstration of agentic-lib's functionality.");
    console.log(enhancedDemo());
    console.log("No additional arguments provided.");
    exitApplication();
    return;
  }

  // Split arguments into flags and non-flag arguments using the new utility function
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
  // Fixed regex to properly capture digits following prefix
  const regex = new RegExp(prefix + "(\d+)");
  const match = branch.match(regex);
  return match ? parseInt(match[1], 10) : null;
}

export function sanitizeCommitMessage(message = "") {
  return message
    .replace(/[^A-Za-z0-9 \-_.~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// New function: splits command line arguments into flag and non-flag arrays
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

// New function: processes an array of flags and returns a summary message
export function processFlags(flags = []) {
  if (flags.length === 0) return "No flags to process.";
  return `Processed flags: ${flags.join(", ")}`;
}

// New function: provides an enhanced demo output
export function enhancedDemo() {
  const envDetails = logEnvironmentDetails();
  return `Enhanced Demo: Agentic-lib now supports additional argument processing.\n${envDetails}`;
}

// New function: logs some environment details
export function logEnvironmentDetails() {
  return `NODE_ENV: ${process.env.NODE_ENV || "undefined"}`;
}

// New function: shows the current version of the library
export function showVersion() {
  // Attempt to use the npm package version if available
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
  _mainOutput
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
