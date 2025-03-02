#!/usr/bin/env node
// src/lib/main.js - Enhanced version with default usage and demo output when no arguments are provided, and consolidated exit routine for clarity.
// This update improves consistency between source and test files, extends functionality with a new --reverse flag, refines log messages, and ensures that the program exits when no user input is provided.

import { fileURLToPath } from "url";
import chalk from "chalk";
import figlet from "figlet";

// Helper function to handle application exit in a consistent manner
function exitApplication() {
  console.log(chalk.blue("Exiting agentic-lib."));
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

  // If no arguments or a help/usage flag is provided, show usage info and demo, then exit
  if (args.length === 0 || args.includes("--help") || args.includes("--usage")) {
    const usage = generateUsage();
    console.log(usage);
    console.log("");
    console.log("Demo: Demonstration of agentic-lib functionality:");
    console.log(enhancedDemo());
    if (args.length === 0) {
      console.log("No additional arguments provided.");
    }
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

  // New feature: If the env flag is provided, display environment variables and exit
  if (flagArgs.includes("--env")) {
    console.log("Environment Variables: " + JSON.stringify(process.env, null, 2));
    exitApplication();
    return;
  }

  // Process the flags sequentially and output the result
  const flagProcessingResult = processFlags(flagArgs);
  console.log(flagProcessingResult);

  // New feature: Reverse the non-flag arguments if '--reverse' flag is provided
  if (flagArgs.includes("--reverse")) {
    const reversedInput = nonFlagArgs.join(" ").split("").reverse().join("");
    console.log(chalk.yellow("Reversed input: " + reversedInput));
  }

  if (nonFlagArgs.length > 0) {
    console.log("Non-flag arguments:", nonFlagArgs.join(", "));
  }

  exitApplication();
}

export function generateUsage() {
  return "Usage: npm run start [--usage | --help] [--version] [--env] [--reverse] [args...]";
}

export function getIssueNumberFromBranch(branch = "", prefix = "issue-") {
  // Regex captures one or more digits following the prefix
  const regex = new RegExp(prefix + "(\d+)");
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
  let result = `Processed flags: ${flags.join(", ")}`;
  // Extended functionality: append verbose mode activation message if --verbose flag is present
  if (flags.includes("--verbose")) {
    result += " | Verbose mode enabled.";
  }
  // New enhancement: add support for debug mode
  if (flags.includes("--debug")) {
    result += " | Debug mode enabled.";
  }
  return result;
}

// Provides an enhanced demo output including environmental details
export function enhancedDemo() {
  const envDetails = logEnvironmentDetails();
  const debugStatus = process.env.DEBUG_MODE ? `DEBUG_MODE: ${process.env.DEBUG_MODE}` : "DEBUG_MODE: off";
  return `Enhanced Demo: Agentic-lib now supports additional argument processing.\n${envDetails}\n${debugStatus}`;
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
  _mainOutput
}) {
  const fixed =
    sourceFileContent.includes("Usage: npm run start") &&
    readmeFileContent.includes("intentïon agentic-lib")
      ? "true"
      : "false";
  const message = fixed === "true" ? "The issue has been resolved." : "Issue not resolved.";
  return {
    fixed,
    message,
    refinement: "None"
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
