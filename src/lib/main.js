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

// Using mathjs to simplify arithmetic operations and reduce boilerplate code
import { sum, prod, mod as mathMod, pow as mathPow } from 'mathjs';
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

// Filter and parse numbers, skipping non-numeric values
const getNumbers = (args) => args.map(parseNumber).filter(n => !isNaN(n));

// -----------------------------------------------------------------------------
// Command implementations
// -----------------------------------------------------------------------------

const echoCommand = (args) => {
  console.log(args.join(" "));
};

const addCommand = (args) => {
  if (args.length === 0) {
    console.log(0);
    return;
  }
  const numbers = getNumbers(args);
  console.log(sum(numbers));
};

const multiplyCommand = (args) => {
  if (args.length === 0) {
    console.log(0);
    return;
  }
  const numbers = getNumbers(args);
  console.log(prod(numbers));
};

const subtractCommand = (args) => {
  if (args.length === 0) {
    console.log(0);
    return;
  }
  const numbers = getNumbers(args);
  if (numbers.length === 0) {
    console.log(0);
    return;
  }
  const result = numbers[0] - sum(numbers.slice(1));
  console.log(result);
};

const divideCommand = (args) => {
  if (args.length === 0) {
    console.log(0);
    return;
  }
  const numbers = getNumbers(args);
  if (numbers.length === 0) {
    console.log(0);
    return;
  }
  // Check division by zero in subsequent numbers
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] === 0) {
      console.error("Error: Division by zero encountered with argument " + args[i]);
      return;
    }
  }
  const divisor = prod(numbers.slice(1));
  console.log(numbers[0] / divisor);
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
  console.log(mathPow(base, exponent));
};

const modCommand = (args) => {
  if (args.length < 2) {
    console.log("Usage: mod <dividend> <divisor> [divisor ...]");
    return;
  }
  const numbers = getNumbers(args);
  if (numbers.length === 0) {
    console.log(0);
    return;
  }
  let result = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] === 0) {
      console.error("Error: Modulo by zero encountered with argument " + args[i]);
      return;
    }
    result = mathMod(result, numbers[i]);
  }
  console.log(result);
};

// -----------------------------------------------------------------------------
// Demo command to showcase features
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
// Self Test command for export
// -----------------------------------------------------------------------------

const selfTestCommand = (_args) => {
  console.log("=== Self Test: Demonstrating features with expected outputs ===");

  console.log("\n> Test Echo Command (expected output: \"Hello Test\")");
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
  /* eslint-disable security/detect-non-literal-fs-filename */
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
  /* eslint-enable security/detect-non-literal-fs-filename */

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
    switch (command) {
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
      case "divide":
        divideCommand(commandArgs);
        break;
      case "power":
        powerCommand(commandArgs);
        break;
      case "mod":
        modCommand(commandArgs);
        break;
      case "demo":
        demoCommand(commandArgs);
        break;
      case "help":
        helpCommand();
        break;
      case "githubscript":
        githubScriptCommand(commandArgs);
        break;
      case "interactive":
        console.log("Already in interactive mode.");
        break;
      default:
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
  console.log("  - divide: Divides the first number by each subsequent number sequentially. Aborts on division by zero.");
  console.log("  - power: Raises the first number (base) to the power of the second (exponent).");
  console.log("  - mod: Computes the modulo of the first number with each subsequent number. Aborts on modulo by zero.");
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
  if (args.length === 0) {
    displayUsage();
  } else {
    const [command, ...commandArgs] = args;
    switch (command) {
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
      case "divide":
        divideCommand(commandArgs);
        break;
      case "power":
        powerCommand(commandArgs);
        break;
      case "mod":
        modCommand(commandArgs);
        break;
      case "demo":
        demoCommand(commandArgs);
        break;
      case "help":
        helpCommand();
        break;
      case "githubscript":
        githubScriptCommand(commandArgs);
        break;
      case "interactive":
        interactiveCommand(commandArgs);
        break;
      default:
        console.error(
          "Unknown command: " + command + ". Available commands: echo, add, multiply, subtract, divide, power, mod, demo, help, githubscript, interactive"
        );
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
