#!/usr/bin/env node
// src/lib/main.js - Improved version with enhanced flag processing, explicit exit messages, new reviewIssue utility, and added seeded shuffle functionality.
// Consolidated transformation pipeline for improved consistency between source and tests, with added sort, duplicate, count, shuffle, and seeded shuffle functionalities.

import { fileURLToPath } from "url";
import figlet from "figlet";
import dayjs from "dayjs";
import chalk from "chalk";
import seedrandom from "seedrandom";
import { capitalCase, camelCase, paramCase, constantCase } from "change-case";

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
  let nonFlagArgs = [];
  for (const arg of args) {
    if (arg.startsWith("--")) {
      flagSet.add(arg);
    } else {
      nonFlagArgs.push(arg);
    }
  }

  if (flagSet.has("--fancy")) {
    const art = figlet.textSync("Agentic Lib");
    console.log(art);
    console.log("Agentic Lib");
  }

  if (flagSet.has("--time")) {
    const currentTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
    console.log(`Current Time: ${currentTime}`);
  }

  // Process reversal flag
  if (flagSet.has("--reverse")) {
    nonFlagArgs = [...nonFlagArgs].reverse();
    console.log("Reversed Args: " + JSON.stringify(nonFlagArgs));
  } else {
    console.log("Run with: " + JSON.stringify(nonFlagArgs));
  }

  // Conflict detection: Do not allow both --upper and --lower
  if (flagSet.has("--upper") && flagSet.has("--lower")) {
    console.log("Warning: Conflicting flags --upper and --lower. No case transformation applied.");
  } else {
    if (flagSet.has("--upper")) {
      nonFlagArgs = nonFlagArgs.map(arg => arg.toUpperCase());
      console.log("Uppercase Args: " + JSON.stringify(nonFlagArgs));
    }

    if (flagSet.has("--lower")) {
      nonFlagArgs = nonFlagArgs.map(arg => arg.toLowerCase());
      console.log("Lowercase Args: " + JSON.stringify(nonFlagArgs));
    }
  }

  if (flagSet.has("--color")) {
    console.log(chalk.green("Colored Args: " + JSON.stringify(nonFlagArgs)));
  }

  if (flagSet.has("--append")) {
    const appended = nonFlagArgs.join(" ") + "!";
    console.log("Appended Output: " + appended);
  }

  if (flagSet.has("--capitalize")) {
    const capitalized = nonFlagArgs.map(arg => capitalCase(arg));
    console.log("Capitalized Args: " + JSON.stringify(capitalized));
  }

  if (flagSet.has("--camel")) {
    nonFlagArgs = nonFlagArgs.map(arg => camelCase(arg));
    console.log("CamelCase Args: " + JSON.stringify(nonFlagArgs));
  }

  // New Shuffle Mode: Randomly shuffles the order of non-flag arguments
  if (flagSet.has("--shuffle")) {
    for (let i = nonFlagArgs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nonFlagArgs[i], nonFlagArgs[j]] = [nonFlagArgs[j], nonFlagArgs[i]];
    }
    console.log("Shuffled Args: " + JSON.stringify(nonFlagArgs));
  }

  // New Sort Mode
  if (flagSet.has("--sort")) {
    const sorted = nonFlagArgs.slice().sort();
    console.log("Sorted Args: " + JSON.stringify(sorted));
  }

  // Extended Functionality: Duplicate each argument
  if (flagSet.has("--duplicate")) {
    const duplicated = nonFlagArgs.map(arg => arg + arg);
    console.log("Duplicated Args: " + JSON.stringify(duplicated));
  }

  // Added Count Mode: Display the count of non-flag arguments
  if (flagSet.has("--count")) {
    console.log("Count of Args: " + nonFlagArgs.length);
  }

  // New Seeded Shuffle Mode: Shuffle arguments deterministically based on provided seed.
  if (flagSet.has("--seeded-shuffle")) {
    if (nonFlagArgs.length === 0) {
      console.log("No seed provided for seeded shuffle.");
    } else {
      const seed = nonFlagArgs[0];
      const remaining = nonFlagArgs.slice(1);
      const seededShuffled = seededShuffleArgs(remaining, seed);
      console.log("Seeded Shuffled Args: " + JSON.stringify(seededShuffled));
    }
  }

  if (process.env.NODE_ENV !== "test") {
    console.log("Exiting application.");
    process.exit(0);
  }
}

// New wrapper function for OpenAI chat completions.
export async function openaiChatCompletions(options) {
  const { default: OpenAI } = await import("openai");
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });
  return openai.chat.completions.create(options);
}

// New Exported Utility Functions

// 1. Generates the usage message
export function generateUsage() {
  return "Usage: npm run start [--fancy] [--time] [--reverse] [--upper] [--color] [--lower] [--append] [--capitalize] [--camel] [--shuffle] [--sort] [--duplicate] [--count] [--seeded-shuffle] [args...]";
}

// 2. Returns the reversed array of arguments
export function reverseArgs(args = []) {
  return args.slice().reverse();
}

// 3. Converts all arguments to uppercase
export function toUpperCaseArgs(args = []) {
  return args.map(arg => arg.toUpperCase());
}

// 4. Converts all arguments to lowercase
export function toLowerCaseArgs(args = []) {
  return args.map(arg => arg.toLowerCase());
}

// 5. Randomly shuffles the arguments array
export function shuffleArgs(args = []) {
  const result = args.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 6. Returns a sorted (alphabetically) copy of the arguments array
export function sortArgs(args = []) {
  return args.slice().sort();
}

// 7. Returns a new array with each argument duplicated
export function duplicateArgs(args = []) {
  return args.map(arg => arg + arg);
}

// 8. Returns the count of arguments
export function countArgs(args = []) {
  return args.length;
}

// 9. Extracts an issue number from a branch name given a prefix (default is 'issue-')
export function getIssueNumberFromBranch(branch = "", prefix = "issue-") {
  const regex = new RegExp(prefix + "(\\d+)");
  const match = branch.match(regex);
  return match ? parseInt(match[1], 10) : null;
}

// 10. Sanitizes a commit message to remove unwanted characters
export function sanitizeCommitMessage(message = "") {
  return message.replace(/[^A-Za-z0-9 \-\_\.\~]/g, '').replace(/\s+/g, ' ').trim();
}

// 11. Review Issue function to duplicate workflow functionality
export function reviewIssue({
  sourceFileContent,
  testFileContent,
  readmeFileContent,
  dependenciesFileContent,
  issueTitle,
  issueDescription,
  issueComments,
  dependenciesListOutput,
  buildOutput,
  testOutput,
  mainOutput
}) {
  // A simple heuristic: if the source file contains the expected usage message and the readme contains 'intentïon agentic-lib', then consider the issue resolved.
  const fixed = sourceFileContent.includes("Usage: npm run start") && readmeFileContent.includes("intentïon agentic-lib") ? "true" : "false";
  const message = fixed === "true" ? "The issue has been resolved." : "Issue not resolved.";
  return { fixed, message, refinement: "None" };
}

// 12. Appends index to each argument
export function appendIndexArgs(args = []) {
  return args.map((arg, index) => `${arg}${index}`);
}

// 13. Filters unique arguments
export function uniqueArgs(args = []) {
  return Array.from(new Set(args));
}

// 14. Trims whitespace from each argument
export function trimArgs(args = []) {
  return args.map(arg => arg.trim());
}

// 15. Converts arguments to kebab-case
export function kebabCaseArgs(args = []) {
  return args.map(arg => paramCase(arg));
}

// 16. Converts arguments to CONSTANT_CASE
export function constantCaseArgs(args = []) {
  return args.map(arg => constantCase(arg));
}

// 17. Seeded Shuffle: Returns a new array with arguments shuffled deterministically using provided seed
export function seededShuffleArgs(args = [], seed = "") {
  const result = args.slice();
  const rng = seedrandom(seed);
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
