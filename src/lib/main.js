#!/usr/bin/env node
// src/lib/main.js - Improved version with clarifying comments and maintained functionality.

// This file processes CLI flags including --fancy, --time, --reverse, --upper, --color, --lower, --append, and now --capitalize.
// The flags are processed in sequence. If both --upper and --lower are provided, the transformation applied
// will be that of --lower (since it is processed last), so use them carefully as they override each other.
// New feature: --capitalize flag that capitalizes each provided argument using change-case module.

import { fileURLToPath } from "url";
import figlet from "figlet";
import dayjs from "dayjs";
import chalk from "chalk";
import _ from "lodash";
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

  if (args.includes("--fancy")) {
    const art = figlet.textSync("Agentic Lib");
    console.log(art);
    console.log("Agentic Lib");
    args = args.filter((arg) => arg !== "--fancy");
  }

  if (args.includes("--time")) {
    const currentTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
    console.log(`Current Time: ${currentTime}`);
    args = args.filter((arg) => arg !== "--time");
  }

  if (args.includes("--reverse")) {
    args = args.filter((arg) => arg !== "--reverse").reverse();
    console.log(`Reversed Args: ${JSON.stringify(args)}`);
  } else {
    console.log(`Run with: ${JSON.stringify(args)}`);
  }

  if (args.includes("--upper")) {
    args = args.filter((arg) => arg !== "--upper");
    const upperArgs = args.map((arg) => arg.toUpperCase());
    console.log(`Uppercase Args: ${JSON.stringify(upperArgs)}`);
  }

  if (args.includes("--color")) {
    args = args.filter((arg) => arg !== "--color");
    console.log(chalk.green(`Colored Args: ${JSON.stringify(args)}`));
  }

  if (args.includes("--lower")) {
    args = args.filter((arg) => arg !== "--lower");
    const lowerArgs = args.map((arg) => arg.toLowerCase());
    console.log(`Lowercase Args: ${JSON.stringify(lowerArgs)}`);
  }

  if (args.includes("--append")) {
    args = args.filter((arg) => arg !== "--append");
    const appended = _.join(args, " ") + "!";
    console.log(`Appended Output: ${appended}`);
  }

  if (args.includes("--capitalize")) {
    args = args.filter((arg) => arg !== "--capitalize");
    const capitalized = args.map((arg) => capitalCase(arg));
    console.log(`Capitalized Args: ${JSON.stringify(capitalized)}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
