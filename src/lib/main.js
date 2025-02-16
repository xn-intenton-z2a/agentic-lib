#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";

// -----------------------------------------------------------------------------
// Command implementations
// -----------------------------------------------------------------------------

function echoCommand(args) {
  // Print the arguments joined by a space
  console.log(args.join(" "));
}

function addCommand(args) {
  // Sum numeric arguments
  let sum = 0;
  args.forEach(arg => {
    const num = parseFloat(arg);
    if (!isNaN(num)) {
      sum += num;
    } else {
      console.warn(`Non-numeric argument encountered: ${arg}`);
    }
  });
  console.log(sum);
}

// -----------------------------------------------------------------------------
// Run main if executed directly.
// -----------------------------------------------------------------------------

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log("No command provided. Available commands: echo, add");
  } else {
    const command = args[0];
    const commandArgs = args.slice(1);
    switch(command) {
      case "echo":
        echoCommand(commandArgs);
        break;
      case "add":
        addCommand(commandArgs);
        break;
      default:
        console.error(`Unknown command: ${command}. Available commands: echo, add`);
        process.exit(1);
    }
  }
}
