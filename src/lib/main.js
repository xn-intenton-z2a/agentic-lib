#!/usr/bin/env node
// src/lib/main.js - Updated to include usage info, demo output, automatic termination when no arguments are provided, extended functionality,
// and a new --color flag that prints the remaining arguments in green color using the chalk dependency, and a new --lower flag that prints the remaining arguments in lowercase.

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

  // Process --upper flag (new feature: converts the remaining arguments to uppercase)
  if (args.includes("--upper")) {
    args = args.filter(arg => arg !== "--upper");
    const upperArgs = args.map(arg => arg.toUpperCase());
    console.log(`Uppercase Args: ${JSON.stringify(upperArgs)}`);
  }

  // Process --color flag (new feature: prints the remaining arguments in green color)
  if (args.includes("--color")) {
    args = args.filter(arg => arg !== "--color");
    console.log(chalk.green(`Colored Args: ${JSON.stringify(args)}`));
  }

  // Process --lower flag (new feature: converts the remaining arguments to lowercase)
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
