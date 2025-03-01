#!/usr/bin/env node
// src/lib/main.js - Enhanced version with a sequential transformation and extended utility functions for improved flag processing and additional functionalities.
// This version now includes new functions: splitArguments, processFlags, enhancedDemo, and logEnvironmentDetails.

import { fileURLToPath } from "url";

// Main function
export function main(args = []) {
  console.log(generateUsage());
  console.log("");

  if (args.length === 0) {
    console.log("Demo: This is a demonstration of agentic-lib's functionality.");
    console.log(enhancedDemo());
    console.log("No additional arguments provided.");
    if (process.env.NODE_ENV !== "test") {
      console.log("Exiting application.");
      process.exit(0);
    }
    return;
  }

  // Split arguments into flags and non-flag arguments using the new utility function
  const { flagArgs, nonFlagArgs } = splitArguments(args);
  // Process the flags sequentially
  const flagProcessingResult = processFlags(flagArgs);
  console.log(flagProcessingResult);

  if (nonFlagArgs.length > 0) {
    console.log("Non-flag arguments:", nonFlagArgs.join(", "));
  }

  if (process.env.NODE_ENV !== "test") {
    console.log("Exiting application.");
    process.exit(0);
  }
}

export function generateUsage() {
  return "Usage: npm run start [--usage] [args...]";
}

export function getIssueNumberFromBranch(branch = "", prefix = "issue-") {
  // Fixed regex to avoid unnecessary escape
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
    sourceFileContent.includes("Usage: npm run start") &&
    readmeFileContent.includes("intentïon agentic-lib")
      ? "true"
      : "false";
  const message = fixed === "true" ? "The issue has been resolved." : "Issue not resolved.";
  return { fixed, message, refinement: "None" };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
