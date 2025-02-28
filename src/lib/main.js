#!/usr/bin/env node
// src/lib/main.js - Improved version with enhanced flag processing and explicit exit messages for clear termination.
// Consolidated transformation pipeline for improved consistency between source and tests, with added sort and duplicate functionality.

import { fileURLToPath } from "url";
import figlet from "figlet";
import dayjs from "dayjs";
import chalk from "chalk";
import { capitalCase, camelCase } from "change-case";

export function main(args = []) {
  console.log("Usage: npm run start [--fancy] [--time] [--reverse] [--upper] [--color] [--lower] [--append] [--capitalize] [--camel] [--sort] [--duplicate] [args...]");
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

  if (flagSet.has("--upper")) {
    nonFlagArgs = nonFlagArgs.map(arg => arg.toUpperCase());
    console.log("Uppercase Args: " + JSON.stringify(nonFlagArgs));
  }

  if (flagSet.has("--color")) {
    console.log(chalk.green("Colored Args: " + JSON.stringify(nonFlagArgs)));
  }

  if (flagSet.has("--lower")) {
    nonFlagArgs = nonFlagArgs.map(arg => arg.toLowerCase());
    console.log("Lowercase Args: " + JSON.stringify(nonFlagArgs));
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

  // New Sort Mode: Sort arguments alphabetically if --sort flag is provided
  if (flagSet.has("--sort")) {
    const sorted = nonFlagArgs.slice().sort();
    console.log("Sorted Args: " + JSON.stringify(sorted));
  }

  // Extended Functionality: Duplicate each argument if --duplicate flag is provided
  if (flagSet.has("--duplicate")) {
    const duplicated = nonFlagArgs.map(arg => arg + arg);
    console.log("Duplicated Args: " + JSON.stringify(duplicated));
  }

  if (process.env.NODE_ENV !== "test") {
    console.log("Exiting application.");
    process.exit(0);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
