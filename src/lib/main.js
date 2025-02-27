#!/usr/bin/env node
// src/lib/main.js - Updated to include usage info, demo output, and automatic termination when no arguments are provided.

import { fileURLToPath } from "url";
import figlet from "figlet";
import dayjs from "dayjs";

export function main(args = []) {
  console.log("Usage: npm run start [--fancy] [--time] [args...]");

  // If no arguments are provided, display demo output and terminate
  if (args.length === 0) {
    console.log("Demo: This is a demonstration of agentic-lib's functionality.");
    console.log("No additional arguments provided.");
    // Terminate immediately when no user input is provided
    process.exit(0);
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

  // Process remaining arguments
  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
