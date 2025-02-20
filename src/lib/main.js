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
      - multiply: multiplies numeric values (if no arguments are provided, returns 0).
      - subtract: subtracts subsequent numbers from the first number provided.
      - divide: divides the first number by subsequent numbers (aborts on division by zero).
      - power: computes power (first number raised to the second).
      - mod: computes the modulo (first number mod each subsequent number, aborts on modulo by zero).
      - demo: demonstrates all available commands with sample outputs.
      - githubscript: reads extended environment variables and file contents as per GitHub Script fragment.
      - interactive: launches interactive mode for dynamic command input.
      - help: displays detailed usage information.

  Usage:
    node src/lib/main.js <command> [arguments...]
    If no command is provided, available commands will be listed.

  License:
    Apache-2.0
*/

import { fileURLToPath } from "url";
import fs from "fs";
import readline from "readline";

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

const parseNumber = (arg) => {
  const num = parseFloat(arg);
  if (isNaN(num)) {
    console.warn("Non-numeric argument encountered: " + arg);
  }
  return num;
};

// Generic reducer for operations that use all arguments (e.g., add, multiply)
const reduceAll = (args, initial, operator) => {
  let result = initial;
  for (const arg of args) {
    const num = parseNumber(arg);
    if (!isNaN(num)) {
      result = operator(result, num);
    }
  }
  return result;
};

// Generic reducer for operations that start with the first argument (e.g., subtract, divide, mod)
// errorCheck is an optional function that, given a number, returns true if an error condition is met.
// errorMsg is a function that returns an error message given the argument string.
const reduceFromFirst = (args, fallback, operator, errorCheck, errorMsg) => {
  let result = parseNumber(args[0]);
  if (isNaN(result)) {
    result = fallback;
  }
  for (const arg of args.slice(1)) {
    const num = parseNumber(arg);
    if (!isNaN(num)) {
      if (errorCheck && errorCheck(num)) {
        console.error(errorMsg(arg));
        return null;
      }
      result = operator(result, num);
    }
  }
  return result;
};

// -----------------------------------------------------------------------------
// New helper functions to reduce duplication in arithmetic commands
// -----------------------------------------------------------------------------

const runReduceAllCommand = (args, initial, operator, emptyResult) => {
  if (args.length === 0) {
    console.log(emptyResult);
    return;
  }
  const result = reduceAll(args, initial, operator);
  console.log(result);
};

const runReduceFromFirstCommand = (args, fallback, operator, errorCheck, errorMsg, emptyResult) => {
  if (args.length === 0) {
    console.log(emptyResult);
    return;
  }
  const result = reduceFromFirst(args, fallback, operator, errorCheck, errorMsg);
  if (result === null) return;
  console.log(result);
};

// -----------------------------------------------------------------------------
// Command implementations
// -----------------------------------------------------------------------------

const echoCommand = (args) => {
  console.log(args.join(" "));
};

const addCommand = (args) => {
  runReduceAllCommand(args, 0, (acc, num) => acc + num, 0);
};

const multiplyCommand = (args) => {
  // As per README, if no arguments, returns 0
  runReduceAllCommand(args, 1, (acc, num) => acc * num, 0);
};

const subtractCommand = (args) => {
  runReduceFromFirstCommand(args, 0, (acc, num) => acc - num, undefined, undefined, 0);
};

const divideCommand = (args) => {
  runReduceFromFirstCommand(
    args,
    0,
    (acc, num) => acc / num,
    (num) => num === 0,
    (arg) => "Error: Division by zero encountered with argument " + arg,
    0,
  );
};

const powerCommand = (args) => {
  if (args.length < 2) {
    console.log("Usage: power <base> <exponent>");
    return;
  }
  const base = parseNumber(args[0]);
  const exponent = parseNumber(args[1]);
  if (isNaN(base) || isNaN(exponent)) {
    console.warn("Invalid numeric arguments for power command");
    return;
  }
  const result = base ** exponent;
  console.log(result);
};

const modCommand = (args) => {
  if (args.length < 2) {
    console.log("Usage: mod <dividend> <divisor> [divisor ...]");
    return;
  }
  runReduceFromFirstCommand(
    args,
    0,
    (acc, num) => acc % num,
    (num) => num === 0,
    (arg) => "Error: Modulo by zero encountered with argument " + arg,
    undefined,
  );
};

// -----------------------------------------------------------------------------
// Demo command to showcase features via main execution
// -----------------------------------------------------------------------------

const demoCommand = (_args) => {
  console.log("--- Demo: Showcasing available commands ---");
  console.log("\n> Echo Command Demo:");
  echoCommand(["Hello", "world"]);

  console.log("\n> Add Command Demo (2 + 3):");
  addCommand(["2", "3"]);

  console.log("\n> Multiply Command Demo (2 * 3):");
  multiplyCommand(["2", "3"]);

  console.log("\n> Subtract Command Demo (10 - 4):");
  subtractCommand(["10", "4"]);

  console.log("\n> Divide Command Demo (20 / 4):");
  divideCommand(["20", "4"]);

  console.log("\n> Power Command Demo (2 ^ 3):");
  powerCommand(["2", "3"]);

  console.log("\n> Mod Command Demo (10 mod 3):");
  modCommand(["10", "3"]);
  console.log("--- End of Demo ---");
};

// -----------------------------------------------------------------------------
// Self Test command kept for export but removed from CLI commands
// -----------------------------------------------------------------------------

const selfTestCommand = (_args) => {
  console.log("=== Self Test: Demonstrating features with expected outputs ===");

  console.log('\n> Test Echo Command (expected output: "Hello Test")');
  echoCommand(["Hello", "Test"]);

  console.log("\n> Test Add Command (2 + 3, expected output: 5)");
  addCommand(["2", "3"]);

  console.log("\n> Test Multiply Command (4 * 5, expected output: 20)");
  multiplyCommand(["4", "5"]);

  console.log("\n> Test Subtract Command (10 - 3, expected output: 7)");
  subtractCommand(["10", "3"]);

  console.log("\n> Test Divide Command (20 / 4, expected output: 5)");
  divideCommand(["20", "4"]);

  console.log("\n> Test Power Command (2 ^ 4, expected output: 16)");
  powerCommand(["2", "4"]);

  console.log("\n> Test Mod Command (10 mod 3, expected output: 1)");
  modCommand(["10", "3"]);

  console.log("\n=== Self Test Completed ===");
};

// -----------------------------------------------------------------------------
// GitHub Script Command Implementation
// -----------------------------------------------------------------------------

const githubScriptCommand = (_args) => {
  // Read extended environment variables that mimic the GitHub Script fragment
  const target = process.env.TARGET || "";
  const testFile = process.env.TESTFILE || "";
  const readmeFile = process.env.READMEFILE || "";
  const contributingFile = process.env.CONTRIBUTINGFILE || "";
  const dependenciesFile = process.env.DEPENDENCIESFILE || "";
  const model = process.env.MODEL || "";
  const apiKey = process.env.CHATGPT_API_SECRET_KEY || "";
  const issueNumber = process.env.ISSUENUMBER ? parseInt(process.env.ISSUENUMBER) : NaN;
  const dependenciesListOutput = process.env.DEPENDENCIESLISTOUTPUT || "";
  const buildScript = process.env.BUILDSCRIPT || "";
  const buildOutput = process.env.BUILDOUTPUT || "";
  const testScript = process.env.TESTSCRIPT || "";
  const testOutput = process.env.TESTOUTPUT || "";
  const mainScript = process.env.MAINSCRIPT || "";
  const mainOutput = process.env.MAINOUTPUT || "";

  console.log('TARGET: "' + target + '"');
  console.log('TESTFILE: "' + testFile + '"');
  console.log('READMEFILE: "' + readmeFile + '"');
  console.log('CONTRIBUTINGFILE: "' + contributingFile + '"');
  console.log('DEPENDENCIESFILE: "' + dependenciesFile + '"');
  console.log('MODEL: "' + model + '"');
  console.log('CHATGPT_API_SECRET_KEY: "' + (apiKey ? "***" : "") + '"');
  console.log('ISSUENUMBER: "' + issueNumber + '"');
  console.log('DEPENDENCIESLISTOUTPUT: "' + dependenciesListOutput + '"');
  console.log('BUILDSCRIPT: "' + buildScript + '"');
  console.log('BUILDOUTPUT: "' + buildOutput + '"');
  console.log('TESTSCRIPT: "' + testScript + '"');
  console.log('TESTOUTPUT: "' + testOutput + '"');
  console.log('MAINSCRIPT: "' + mainScript + '"');
  console.log('MAINOUTPUT: "' + mainOutput + '"');

  // Helper function to log file status
  const logFileStatus = (label, filePath) => {
    if (filePath) {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf8");
        console.log(label + ' "' + filePath + '" loaded with length ' + content.length + ".");
      } else {
        console.log(label + ' "' + filePath + '" does not exist.');
      }
    }
  };

  logFileStatus("Target file", target);
  logFileStatus("Test file", testFile);
  logFileStatus("README file", readmeFile);
  logFileStatus("Contributing file", contributingFile);
  logFileStatus("Dependencies file", dependenciesFile);

  console.log("GitHub API calls, OpenAI integration, and issue comment creation are not implemented in this command.");
};

// -----------------------------------------------------------------------------
// Interactive Command Implementation
// -----------------------------------------------------------------------------

const interactiveCommand = (_args) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "agentic-lib> ",
  });
  console.log("Entering interactive mode. Type 'exit' to quit.");
  rl.prompt();
  rl.on("line", (line) => {
    const input = line.trim();
    if (input.toLowerCase() === "exit") {
      rl.close();
      return;
    }
    const tokens = input.split(/\s+/);
    const command = tokens[0];
    const commandArgs = tokens.slice(1);
    const commands = {
      echo: echoCommand,
      add: addCommand,
      multiply: multiplyCommand,
      subtract: subtractCommand,
      divide: divideCommand,
      power: powerCommand,
      mod: modCommand,
      demo: demoCommand,
      help: helpCommand,
      githubscript: githubScriptCommand,
    };
    if (commands[command]) {
      commands[command](commandArgs);
    } else {
      console.error("Unknown command: " + command);
    }
    rl.prompt();
  });
  rl.on("close", () => {
    console.log("Exiting interactive mode.");
  });
};

// -----------------------------------------------------------------------------
// Detailed help display
// -----------------------------------------------------------------------------

const displayUsage = () => {
  console.log("Usage: node src/lib/main.js <command> [arguments...]");
  console.log("Available commands:");
  console.log("  - echo: Prints the provided arguments as a string.");
  console.log("  - add: Sums numeric values. Returns 0 if no arguments provided.");
  console.log("  - multiply: Multiplies numeric values. Returns 0 if no arguments provided.");
  console.log("  - subtract: Subtracts subsequent numbers from the first provided number.");
  console.log(
    "  - divide: Divides the first number by each subsequent number sequentially. Aborts on division by zero.",
  );
  console.log("  - power: Raises the first number (base) to the power of the second (exponent).");
  console.log(
    "  - mod: Computes the modulo of the first number with each subsequent number. Aborts on modulo by zero.",
  );
  console.log("  - demo: Demonstrates all available commands with sample outputs.");
  console.log("  - githubscript: Reads extended environment variables and file contents.");
  console.log("  - interactive: Launches interactive mode for dynamic command input.");
  console.log("  - help: Displays this help message.");
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
    githubscript: githubScriptCommand,
    interactive: interactiveCommand,
  };

  if (args.length === 0) {
    displayUsage();
  } else {
    const [command, ...commandArgs] = args;
    const action = commands[command];
    if (action) {
      action(commandArgs);
    } else {
      console.error("Unknown command: " + command + ". Available commands: " + Object.keys(commands).join(", "));
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
  interactiveCommand,
  displayUsage,
  helpCommand,
};
