#!/usr/bin/env node
/*
  intentïon agentic-lib
  =====================
  This file is part of the intentïon agentic-lib project.
  
  Description:
    Implements a command-line interface with various arithmetic and echo commands.
    Commands available:
      - echo: prints input arguments.
      - add: sums numeric values.
      - multiply: multiplies numeric values.
      - subtract: subtracts subsequent numbers from the first.
      - divide: divides the first number by subsequent numbers.
      - power: computes power (first number raised to the second).
      - mod: computes the modulo (first number mod each subsequent number).
      - demo: demonstrates all available commands.
  
  Usage:
    node src/lib/main.js <command> [arguments...]
    If no command is provided, available commands will be listed.
  
  License:
    Apache-2.0
*/

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

const modCommand = (args) => {
  // Computes the modulo: first number mod each subsequent number sequentially
  if (args.length < 2) {
    console.log('Usage: mod <dividend> <divisor> [divisor ...]');
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
      console.warn(`Modulo by zero encountered: ${arg}`);
    } else {
      result %= num;
    }
  });
  console.log(result);
};

// -----------------------------------------------------------------------------
// Demo command to showcase features via main execution
// -----------------------------------------------------------------------------

const demoCommand = (args) => {
  console.log('--- Demo: Showcasing available commands ---');
  console.log('\n> Echo Command Demo:');
  echoCommand(['Hello', 'world']);

  console.log('\n> Add Command Demo (2 + 3):');
  addCommand(['2', '3']);

  console.log('\n> Multiply Command Demo (2 * 3):');
  multiplyCommand(['2', '3']);

  console.log('\n> Subtract Command Demo (10 - 4):');
  subtractCommand(['10', '4']);

  console.log('\n> Divide Command Demo (20 / 4):');
  divideCommand(['20', '4']);

  console.log('\n> Power Command Demo (2 ^ 3):');
  powerCommand(['2', '3']);

  console.log('\n> Mod Command Demo (10 mod 3):');
  modCommand(['10', '3']);
  console.log('--- End of Demo ---');
};

const displayUsage = () => {
  console.log('No command provided. Available commands: echo, add, multiply, subtract, divide, power, mod, demo');
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
      case 'mod':
        modCommand(commandArgs);
        break;
      case 'demo':
        demoCommand(commandArgs);
        break;
      default:
        console.error(`Unknown command: ${command}. Available commands: echo, add, multiply, subtract, divide, power, mod, demo`);
        process.exit(1);
    }
  }
}

// -----------------------------------------------------------------------------
// Exports for external usage
// -----------------------------------------------------------------------------

export {
  parseNumber,
  echoCommand,
  addCommand,
  multiplyCommand,
  subtractCommand,
  divideCommand,
  powerCommand,
  modCommand,
  demoCommand,
  displayUsage
};
