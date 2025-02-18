#!/usr/bin/env node
/*
  intention agentic-lib
  =====================
  This file is part of the intention agentic-lib project.

  Description:
    Implements a command-line interface with various arithmetic and echo commands.
    Commands available:
      - echo: prints input arguments.
      - add: sums numeric values.
      - multiply: multiplies numeric values.
      - subtract: subtracts subsequent numbers from the first.
      - divide: divides the first number by subsequent numbers (aborts on division by zero).
      - power: computes power (first number raised to the second).
      - mod: computes the modulo (first number mod each subsequent number, aborts on modulo by zero).
      - demo: demonstrates all available commands with sample outputs.
      - help: displays usage information.
      - githubscript: reads environment variables and file contents as per GitHub Script fragment.

  Usage:
    node src/lib/main.js <command> [arguments...]
    If no command is provided, available commands will be listed.

  License:
    Apache-2.0
*/

import { fileURLToPath } from 'url';
import fs from 'fs';

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
  console.log(args.join(' '));
};

const addCommand = (args) => {
  const sum = args.reduce((acc, arg) => {
    const num = parseNumber(arg);
    return isNaN(num) ? acc : acc + num;
  }, 0);
  console.log(sum);
};

const multiplyCommand = (args) => {
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
  if (args.length === 0) {
    console.log(0);
    return;
  }
  let result = parseNumber(args[0]);
  if (isNaN(result)) {
    result = 0;
  }
  for (let i = 1; i < args.length; i++) {
    const num = parseNumber(args[i]);
    if (isNaN(num)) {
      continue;
    } else if (num === 0) {
      console.error(`Error: Division by zero encountered with argument ${args[i]}`);
      return;
    } else {
      result /= num;
    }
  }
  console.log(result);
};

const powerCommand = (args) => {
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
  const result = base ** exponent;
  console.log(result);
};

const modCommand = (args) => {
  if (args.length < 2) {
    console.log('Usage: mod <dividend> <divisor> [divisor ...]');
    return;
  }
  let result = parseNumber(args[0]);
  if (isNaN(result)) {
    result = 0;
  }
  for (let i = 1; i < args.length; i++) {
    const num = parseNumber(args[i]);
    if (isNaN(num)) {
      continue;
    } else if (num === 0) {
      console.error(`Error: Modulo by zero encountered with argument ${args[i]}`);
      return;
    } else {
      result %= num;
    }
  }
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

// -----------------------------------------------------------------------------
// Self Test command kept for export but removed from CLI commands
// -----------------------------------------------------------------------------

const selfTestCommand = (args) => {
  console.log('=== Self Test: Demonstrating features with expected outputs ===');

  console.log('\n> Test Echo Command (expected output: "Hello Test")');
  echoCommand(['Hello', 'Test']);

  console.log('\n> Test Add Command (2 + 3, expected output: 5)');
  addCommand(['2', '3']);

  console.log('\n> Test Multiply Command (4 * 5, expected output: 20)');
  multiplyCommand(['4', '5']);

  console.log('\n> Test Subtract Command (10 - 3, expected output: 7)');
  subtractCommand(['10', '3']);

  console.log('\n> Test Divide Command (20 / 4, expected output: 5)');
  divideCommand(['20', '4']);

  console.log('\n> Test Power Command (2 ^ 4, expected output: 16)');
  powerCommand(['2', '4']);

  console.log('\n> Test Mod Command (10 mod 3, expected output: 1)');
  modCommand(['10', '3']);

  console.log('\n=== Self Test Completed ===');
};

// -----------------------------------------------------------------------------
// GitHub Script Command Implementation
// -----------------------------------------------------------------------------

const githubScriptCommand = (args) => {
  // Read environment variables that mimic the GitHub Script fragment
  const target = process.env.TARGET || '';
  const testFile = process.env.TESTFILE || '';
  const readmeFile = process.env.READMEFILE || '';
  const contributingFile = process.env.CONTRIBUTINGFILE || '';
  const dependenciesFile = process.env.DEPENDENCIESFILE || '';

  console.log(`TARGET: "${target}"`);
  console.log(`TESTFILE: "${testFile}"`);
  console.log(`READMEFILE: "${readmeFile}"`);
  console.log(`CONTRIBUTINGFILE: "${contributingFile}"`);
  console.log(`DEPENDENCIESFILE: "${dependenciesFile}"`);

  if (target) {
    if (fs.existsSync(target)) {
      const sourceContent = fs.readFileSync(target, 'utf8');
      console.log(`Target file '${target}' loaded with length ${sourceContent.length}.`);
    } else {
      console.log(`Target file '${target}' does not exist.`);
    }
  }

  if (testFile) {
    if (fs.existsSync(testFile)) {
      const testContent = fs.readFileSync(testFile, 'utf8');
      console.log(`Test file '${testFile}' loaded with length ${testContent.length}.`);
    } else {
      console.log(`Test file '${testFile}' does not exist.`);
    }
  }

  if (readmeFile) {
    if (fs.existsSync(readmeFile)) {
      const readmeContent = fs.readFileSync(readmeFile, 'utf8');
      console.log(`README file '${readmeFile}' loaded with length ${readmeContent.length}.`);
    } else {
      console.log(`README file '${readmeFile}' does not exist.`);
    }
  }

  if (contributingFile) {
    if (fs.existsSync(contributingFile)) {
      const contributingContent = fs.readFileSync(contributingFile, 'utf8');
      console.log(`Contributing file '${contributingFile}' loaded with length ${contributingContent.length}.`);
    } else {
      console.log(`Contributing file '${contributingFile}' does not exist.`);
    }
  }

  if (dependenciesFile) {
    if (fs.existsSync(dependenciesFile)) {
      const dependenciesContent = fs.readFileSync(dependenciesFile, 'utf8');
      console.log(`Dependencies file '${dependenciesFile}' loaded with length ${dependenciesContent.length}.`);
    } else {
      console.log(`Dependencies file '${dependenciesFile}' does not exist.`);
    }
  }

  console.log('GitHub API calls, OpenAI integration, and issue comment creation are not implemented in this command.');
};

// -----------------------------------------------------------------------------
// Usage display
// -----------------------------------------------------------------------------

const displayUsage = () => {
  console.log('No command provided. Available commands: echo, add, multiply, subtract, divide, power, mod, demo, githubscript, help');
};

const helpCommand = () => {
  displayUsage();
};

// -----------------------------------------------------------------------------
// Main execution
// -----------------------------------------------------------------------------

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [, , ...args] = process.argv;

  const commands = {
    echo: echoCommand,
    add: addCommand,
    multiply: multiplyCommand,
    subtract: subtractCommand,
    divide: divideCommand,
    power: powerCommand,
    mod: modCommand,
    demo: demoCommand,
    // selfTest command removed from CLI to move testing to unit tests
    help: helpCommand,
    githubscript: githubScriptCommand
  };

  if (args.length === 0) {
    displayUsage();
  } else {
    const [command, ...commandArgs] = args;
    const action = commands[command];
    if (action) {
      action(commandArgs);
    } else {
      console.error(`Unknown command: ${command}. Available commands: ${Object.keys(commands).join(', ')}`);
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
  selfTestCommand,
  githubScriptCommand,
  displayUsage,
  helpCommand
};
