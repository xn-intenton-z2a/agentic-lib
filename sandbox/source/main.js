#!/usr/bin/env node
// sandbox/source/main.js

import { fileURLToPath } from "url";

export function main(args = process.argv.slice(2)) {
  // Print Hello World! and exit immediately when --hello flag is present
  if (args.includes("--hello")) {
    console.log("Hello World!");
    return;
  }

  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
