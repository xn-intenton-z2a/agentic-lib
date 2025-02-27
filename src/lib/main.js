#!/usr/bin/env node
// src/lib/main.js - Updated to include usage info, fancy ASCII art, and current time display when requested.

import { fileURLToPath } from "url";
import figlet from "figlet";
import dayjs from "dayjs";

export function main(args = []) {
  console.log("Usage: npm run start [--fancy] [--time] [args...]");
  
  // Process --fancy flag to display ASCII art
  if (args.includes("--fancy")) {
    const art = figlet.textSync("Agentic Lib");
    console.log(art);
    args = args.filter(arg => arg !== "--fancy");
  }

  // New feature: Process --time flag to display the current time
  if (args.includes("--time")) {
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    console.log(`Current Time: ${currentTime}`);
    args = args.filter(arg => arg !== "--time");
  }

  // Process remaining arguments
  if (args.length > 0) {
    console.log(`Run with: ${JSON.stringify(args)}`);
  } else {
    console.log("No additional arguments provided.");
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
