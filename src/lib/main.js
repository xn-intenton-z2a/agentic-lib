#!/usr/bin/env node
// src/lib/main.js - Improved version with clarifying comments and maintained functionality.
// 
// This file processes CLI flags including --fancy, --time, --reverse, --upper, --color, and --lower.
// The flags are processed in sequence. If both --upper and --lower are provided, the transformation applied
// will be that of --lower (since it is processed last), so use them carefully as they override each other.

import { fileURLToPath } from "url";
import figlet from "figlet";
import dayjs from "dayjs";
import chalk from "chalk";

export function main(args = []) {
  console.log("Usage: npm run start [--fancy] [--time] [--reverse] [--upper] [--color] [--lower] [args...]");
  console.log("");

  // If no arguments are provided, display demo output and terminate
  if (args.length === 0) {
    console.log("Demo: This is a demonstration of agentic-lib's functionality.");
    console.log("No additional arguments provided.");
    if (process.env.NODE_ENV !== "test") {
      process.exit(0);
    }
    return;
  }

  // Process --fancy flag
  if (args.includes("--fancy")) {
    const art = figlet.textSync("Agentic Lib");
    console.log(art);
    console.log("Agentic Lib");
    args = args.filter(arg => arg !== "--fancy");
  }

  // Process --time flag
  if (args.includes("--time")) {
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    console.log(`Current Time: ${currentTime}`);
    args = args.filter(arg => arg !== "--time");
  }

  // Process --reverse flag (new feature: reverses the order of the remaining arguments)
  if (args.includes("--reverse")) {
    args = args.filter(arg => arg !== "--reverse");
    args = args.reverse();
    console.log(`Reversed Args: ${JSON.stringify(args)}`);
  } else {
    console.log(`Run with: ${JSON.stringify(args)}`);
  }

  // Process --upper flag (converts arguments to uppercase)
  if (args.includes("--upper")) {
    args = args.filter(arg => arg !== "--upper");
    const upperArgs = args.map(arg => arg.toUpperCase());
    console.log(`Uppercase Args: ${JSON.stringify(upperArgs)}`);
  }

  // Process --color flag (prints the remaining arguments in green color)
  if (args.includes("--color")) {
    args = args.filter(arg => arg !== "--color");
    console.log(chalk.green(`Colored Args: ${JSON.stringify(args)}`));
  }

  // Process --lower flag (converts arguments to lowercase)
  if (args.includes("--lower")) {
    args = args.filter(arg => arg !== "--lower");
    const lowerArgs = args.map(arg => arg.toLowerCase());
    console.log(`Lowercase Args: ${JSON.stringify(lowerArgs)}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
