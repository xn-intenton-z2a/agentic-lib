#!/usr/bin/env node
// src/lib/main.js - Updated to include usage info and demo output by default.

import { fileURLToPath } from "url";
import figlet from "figlet";

export function main(args = []) {
  console.log("Usage: npm run start [--fancy] [args...]");
  if (args.includes("--fancy")) {
    const art = figlet.textSync("Agentic Lib");
    console.log(art);
    console.log("Agentic Lib");
    args = args.filter(arg => arg !== "--fancy");
  }
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
