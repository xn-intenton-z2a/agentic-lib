#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from 'url';

// -----------------------------------------------------------------------------
// Command implementations
// -----------------------------------------------------------------------------

const echoCommand = (args) => {
  // Print the arguments joined by a space
  console.log(args.join(' '));
};

const addCommand = (args) => {
  // Sum numeric arguments using reduce for clarity
  const sum = args.reduce((acc, arg) => {
    const num = parseFloat(arg);
    if (isNaN(num)) {
      console.warn(`Non-numeric argument encountered: ${arg}`);
      return acc;
    }
    return acc + num;
  }, 0);
  console.log(sum);
};

const multiplyCommand = (args) => {
  // Multiply numeric arguments using reduce for clarity
  if (args.length === 0) {
    console.log(0);
    return;
  }
  const product = args.reduce((acc, arg) => {
    const num = parseFloat(arg);
    if (isNaN(num)) {
      console.warn(`Non-numeric argument encountered: ${arg}`);
      return acc;
    }
    return acc * num;
  }, 1);
  console.log(product);
};

const subtractCommand = (args) => {
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
  args.slice(1).forEach(arg => {
    const num = parseFloat(arg);
    if (isNaN(num)) {
      console.warn(`Non-numeric argument encountered: ${arg}`);
    } else {
      result -= num;
    }
  });
  console.log(result);
};

const displayUsage = () => {
  console.log('No command provided. Available commands: echo, add, multiply, subtract');
};

// -----------------------------------------------------------------------------
// Main execution
// -----------------------------------------------------------------------------

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [, , ...args] = process.argv;
  if (args.length === 0) {
    displayUsage();
  } else {
    const [command, ...commandArgs] = args;
    switch (command) {
      case 'echo':
        echoCommand(commandArgs);
        break;
      case 'add':
        addCommand(commandArgs);
        break;
      case 'multiply':
        multiplyCommand(commandArgs);
        break;
      case 'subtract':
        subtractCommand(commandArgs);
        break;
      default:
        console.error(`Unknown command: ${command}. Available commands: echo, add, multiply, subtract`);
        process.exit(1);
    }
  }
}
