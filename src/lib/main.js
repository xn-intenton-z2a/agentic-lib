#!/usr/bin/env node
// src/lib/main.js - Improved version with enhanced flag processing and sequential transformations.

// This file processes CLI flags including --fancy, --time, --reverse, --upper, --color, --lower, --append, and --capitalize.
// Flags are extracted separately from non-flag arguments to ensure proper sequential transformations.
// If both --upper and --lower are provided, the transformation applied will be that of --lower (since it is processed later).
// New feature: --capitalize flag that capitalizes each provided argument using the change-case module.

import { fileURLToPath } from "url";
import figlet from "figlet";
import dayjs from "dayjs";
import chalk from "chalk";
import { capitalCase } from "change-case";

export function main(args = []) {
  console.log("Usage: npm run start [--fancy] [--time] [--reverse] [--upper] [--color] [--lower] [--append] [--capitalize] [args...]");
  console.log("");

  if (args.length === 0) {
    console.log("Demo: This is a demonstration of agentic-lib's functionality.");
    console.log("No additional arguments provided.");
    if (process.env.NODE_ENV !== "test") {
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
    const reversed = [...nonFlagArgs].reverse();
    console.log("Reversed Args: " + JSON.stringify(reversed));
    nonFlagArgs.splice(0, nonFlagArgs.length, ...reversed);
  } else {
    console.log("Run with: " + JSON.stringify(nonFlagArgs));
  }

  if (flagSet.has("--upper")) {
    const upperArgs = nonFlagArgs.map(arg => arg.toUpperCase());
    console.log("Uppercase Args: " + JSON.stringify(upperArgs));
    nonFlagArgs.splice(0, nonFlagArgs.length, ...upperArgs);
  }

  if (flagSet.has("--color")) {
    console.log(chalk.green("Colored Args: " + JSON.stringify(nonFlagArgs)));
  }

  if (flagSet.has("--lower")) {
    const lowerArgs = nonFlagArgs.map(arg => arg.toLowerCase());
    console.log("Lowercase Args: " + JSON.stringify(lowerArgs));
    nonFlagArgs.splice(0, nonFlagArgs.length, ...lowerArgs);
  }

  if (flagSet.has("--append")) {
    const appended = nonFlagArgs.join(" ") + "!";
    console.log("Appended Output: " + appended);
  }

  if (flagSet.has("--capitalize")) {
    const capitalized = nonFlagArgs.map(arg => capitalCase(arg));
    console.log("Capitalized Args: " + JSON.stringify(capitalized));
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
