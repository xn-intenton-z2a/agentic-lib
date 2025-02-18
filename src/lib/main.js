#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from 'url';

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

const parseNumber = (arg) => {
  const num = parseFloat(arg);
  if (isNaN(num)) {
    console.warn(`Non-numeric argument encountered: ${arg}`);
  }
  return num;
};

// -----------------------------------------------------------------------------
// Command implementations
// -----------------------------------------------------------------------------

const echoCommand = (args) => {
  // Print the arguments joined by a space
  console.log(args.join(' '));
};

const addCommand = (args) => {
  // Sum numeric arguments
  const sum = args.reduce((acc, arg) => {
    const num = parseNumber(arg);
    return isNaN(num) ? acc : acc + num;
  }, 0);
  console.log(sum);
};

const multiplyCommand = (args) => {
  // Multiply numeric arguments
  if (args.length === 0) {
    console.log(0);
    return;
  }
  const product = args.reduce((acc, arg) => {
    const num = parseNumber(arg);
    return isNaN(num) ? acc : acc * num;
  }, 1);
  console.log(product);
};

const subtractCommand = (args) => {
  // Subtract numeric arguments: subtract each subsequent number from the first one
  if (args.length === 0) {
    console.log(0);
    return;
  }
  let result = parseNumber(args[0]);
  if (isNaN(result)) {
    result = 0;
  }
  args.slice(1).forEach(arg => {
    const num = parseNumber(arg);
    if (!isNaN(num)) {
      result -= num;
    }
  });
  console.log(result);
};

const divideCommand = (args) => {
  // Divide numeric arguments: divide the first number by each of the subsequent numbers sequentially
  if (args.length === 0) {
    console.log(0);
    return;
  }
  let result = parseNumber(args[0]);
  if (isNaN(result)) {
    result = 0;
  }
  args.slice(1).forEach(arg => {
    const num = parseNumber(arg);
    if (isNaN(num)) {
      return;
    } else if (num === 0) {
      console.warn(`Division by zero encountered: ${arg}`);
    } else {
      result /= num;
    }
  });
  console.log(result);
};

const powerCommand = (args) => {
  // Raises the first number to the power of the second number
  if (args.length < 2) {
    console.log('Usage: power <base> <exponent>');
    return;
  }
  const base = parseNumber(args[0]);
  const exponent = parseNumber(args[1]);
  if (isNaN(base) || isNaN(exponent)) {
    console.warn('Invalid numeric arguments for power command');
    return;
  }
  const result = Math.pow(base, exponent);
  console.log(result);
};

const displayUsage = () => {
  console.log('No command provided. Available commands: echo, add, multiply, subtract, divide, power');
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
      case 'divide':
        divideCommand(commandArgs);
        break;
      case 'power':
        powerCommand(commandArgs);
        break;
      default:
        console.error(`Unknown command: ${command}. Available commands: echo, add, multiply, subtract, divide, power`);
        process.exit(1);
    }
  }
}
