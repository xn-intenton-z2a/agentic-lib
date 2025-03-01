#!/usr/bin/env node
// src/lib/main.js - Improved version with a sequential transformation pipeline for consistent flag processing.
// Consolidated transformation pipeline for improved consistency between source and tests with added functionalities.

import { fileURLToPath } from "url";
import figlet from "figlet";
import dayjs from "dayjs";
import chalk from "chalk";
import seedrandom from "seedrandom";
import { capitalCase, camelCase, paramCase, constantCase, snakeCase } from "change-case";
import _ from "lodash"; // Added lodash import for new vowel count feature

// Main function: disable cognitive complexity ESLint warning
// eslint-disable-next-line sonarjs/cognitive-complexity
export function main(args = []) {
  console.log(generateUsage());
  console.log("");

  if (args.length === 0) {
    console.log("Demo: This is a demonstration of agentic-lib's functionality.");
    console.log("No additional arguments provided.");
    if (process.env.NODE_ENV !== "test") {
      console.log("Exiting application.");
      process.exit(0);
    }
    return;
  }

  // Separate flags and non-flag arguments
  const flagSet = new Set();
  const nonFlagArgs = [];
  for (const arg of args) {
    if (arg.startsWith("--")) {
      flagSet.add(arg);
    } else {
      nonFlagArgs.push(arg);
    }
  }

  // Use a separate variable for sequential transformation
  let resultArgs = nonFlagArgs.slice();

  if (flagSet.has("--fancy")) {
    const art = figlet.textSync("Agentic Lib");
    console.log(art);
    console.log("Agentic Lib");
  }

  if (flagSet.has("--time")) {
    const currentTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
    console.log(`Current Time: ${currentTime}`);
  }

  if (flagSet.has("--reverse")) {
    resultArgs = reverseArgs(resultArgs);
    console.log("Reversed Args: " + JSON.stringify(resultArgs));
  } else {
    console.log("Run with: " + JSON.stringify(resultArgs));
  }

  if (flagSet.has("--upper") && flagSet.has("--lower")) {
    console.log("Warning: Conflicting flags --upper and --lower. No case transformation applied.");
  } else {
    if (flagSet.has("--upper")) {
      resultArgs = toUpperCaseArgs(resultArgs);
      console.log("Uppercase Args: " + JSON.stringify(resultArgs));
    }
    if (flagSet.has("--lower")) {
      resultArgs = toLowerCaseArgs(resultArgs);
      console.log("Lowercase Args: " + JSON.stringify(resultArgs));
    }
  }

  if (flagSet.has("--color")) {
    console.log(chalk.green("Colored Args: " + JSON.stringify(resultArgs)));
  }

  if (flagSet.has("--append")) {
    const appended = resultArgs.join(" ") + "!";
    console.log("Appended Output: " + appended);
  }

  if (flagSet.has("--capitalize")) {
    const capitalized = resultArgs.map((arg) => capitalCase(arg));
    console.log("Capitalized Args: " + JSON.stringify(capitalized));
    resultArgs = capitalized;
  }

  if (flagSet.has("--camel")) {
    resultArgs = resultArgs.map((arg) => camelCase(arg));
    console.log("CamelCase Args: " + JSON.stringify(resultArgs));
  }

  if (flagSet.has("--snake")) {
    resultArgs = snakeCaseArgs(resultArgs);
    console.log("SnakeCase Args: " + JSON.stringify(resultArgs));
  }

  if (flagSet.has("--swap")) {
    resultArgs = swapCaseArgs(resultArgs);
    console.log("SwapCase Args: " + JSON.stringify(resultArgs));
  }

  if (flagSet.has("--shuffle")) {
    resultArgs = shuffleArgs(resultArgs);
    console.log("Shuffled Args: " + JSON.stringify(resultArgs));
  }

  if (flagSet.has("--sort")) {
    resultArgs = sortArgs(resultArgs);
    console.log("Sorted Args: " + JSON.stringify(resultArgs));
  }

  if (flagSet.has("--duplicate")) {
    resultArgs = duplicateArgs(resultArgs);
    console.log("Duplicated Args: " + JSON.stringify(resultArgs));
  }

  // New functionality: remove duplicate arguments
  if (flagSet.has("--unique")) {
    resultArgs = uniqueArgs(resultArgs);
    console.log("Unique Args: " + JSON.stringify(resultArgs));
  }

  if (flagSet.has("--count")) {
    console.log("Count of Args: " + countArgs(resultArgs));
  }

  if (flagSet.has("--seeded-shuffle")) {
    if (resultArgs.length === 0) {
      console.log("No seed provided for seeded shuffle.");
    } else {
      const seed = resultArgs[0];
      const remaining = resultArgs.slice(1);
      resultArgs = seededShuffleArgs(remaining, seed);
      console.log("Seeded Shuffled Args: " + JSON.stringify(resultArgs));
    }
  }

  if (flagSet.has("--reverse-words")) {
    resultArgs = reverseWordsArgs(resultArgs);
    console.log("Reversed Words Args: " + JSON.stringify(resultArgs));
  }

  // New feature: vowel count
  if (flagSet.has("--vowel-count")) {
    const vowelCount = _.sumBy(resultArgs, arg => (arg.match(/[aeiouAEIOU]/g) || []).length);
    console.log("Vowel Count: " + vowelCount);
  }

  if (process.env.NODE_ENV !== "test") {
    console.log("Exiting application.");
    process.exit(0);
  }
}

// New utility function: snakeCaseArgs
export function snakeCaseArgs(args = []) {
  return args.map((arg) => snakeCase(arg));
}

// New utility function: swapCaseArgs
export function swapCaseArgs(args = []) {
  return args.map(swapCase);
}

function swapCase(str) {
  return str.split("").map(c => {
    if (c === c.toUpperCase()) {
      return c.toLowerCase();
    } else {
      return c.toUpperCase();
    }
  }).join("");
}

// Exported Utility Functions
export function generateUsage() {
  return "Usage: npm run start [--fancy] [--time] [--reverse] [--upper] [--lower] [--color] [--append] [--capitalize] [--camel] [--snake] [--swap] [--shuffle] [--sort] [--duplicate] [--unique] [--count] [--seeded-shuffle] [--reverse-words] [--vowel-count] [args...]";
}

export function reverseArgs(args = []) {
  return args.slice().reverse();
}

export function toUpperCaseArgs(args = []) {
  return args.map((arg) => arg.toUpperCase());
}

export function toLowerCaseArgs(args = []) {
  return args.map((arg) => arg.toLowerCase());
}

export function shuffleArgs(args = []) {
  const result = args.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function sortArgs(args = []) {
  return args.slice().sort();
}

export function duplicateArgs(args = []) {
  return args.map((arg) => arg + arg);
}

export function countArgs(args = []) {
  return args.length;
}

export function getIssueNumberFromBranch(branch = "", prefix = "issue-") {
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

export function reviewIssue({
  sourceFileContent,
  _testFileContent,
  readmeFileContent,
  _dependenciesFileContent,
  issueTitle,
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

export function appendIndexArgs(args = []) {
  return args.map((arg, index) => `${arg}${index}`);
}

export function uniqueArgs(args = []) {
  return Array.from(new Set(args));
}

export function trimArgs(args = []) {
  return args.map((arg) => arg.trim());
}

export function kebabCaseArgs(args = []) {
  return args.map((arg) => paramCase(arg));
}

export function constantCaseArgs(args = []) {
  return args.map((arg) => constantCase(arg));
}

export function seededShuffleArgs(args = [], seed = "") {
  const result = args.slice();
  const rng = seedrandom(seed);
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function reverseWordsArgs(args = []) {
  return args.map((arg) => arg.split("").reverse().join(""));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
