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

function multiplyCommand(args) {
  // Multiply numeric arguments
  let product = 1;
  if (args.length === 0) {
    console.log(0);
    return;
  }
  args.forEach(arg => {
    const num = parseFloat(arg);
    if (!isNaN(num)) {
      product *= num;
    } else {
      console.warn(`Non-numeric argument encountered: ${arg}`);
    }
  });
  console.log(product);
}

function subtractCommand(args) {
  // Subtract numeric arguments: subtract each subsequent number from the first one
  if (args.length === 0) {
    console.log(0);
    return;
  }
  let result = parseFloat(args[0]);
  if (isNaN(result)) {
    console.warn(`Non-numeric argument encountered: ${args[0]}`);
    result = 0;
  }
  for (let i = 1; i < args.length; i++) {
    const num = parseFloat(args[i]);
    if (!isNaN(num)) {
      result -= num;
    } else {
      console.warn(`Non-numeric argument encountered: ${args[i]}`);
    }
  }
  console.log(result);
}

// -----------------------------------------------------------------------------
// Run main if executed directly.
// -----------------------------------------------------------------------------

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log("No command provided. Available commands: echo, add, multiply, subtract");
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
      case "multiply":
        multiplyCommand(commandArgs);
        break;
      case "subtract":
        subtractCommand(commandArgs);
        break;
      default:
        console.error(`Unknown command: ${command}. Available commands: echo, add, multiply, subtract`);
        process.exit(1);
    }
  }
}
