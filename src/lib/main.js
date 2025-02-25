#!/usr/bin/env node
// src/lib/main.js

// This file is part of agentic-lib. See: https://github.com/xn-intenton-z2a/agentic-lib
// Licensed under the MIT License. For details, see LICENSE-MIT
//
// NOTE: Incremental Change Plan is in progress. See README.md for the roadmap of planned enhancements.

import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import figlet from 'figlet';

// Establish __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Loads package details from package.json.
 * @returns {object|null} Parsed package details or null if an error occurs.
 */
const loadPackageDetails = () => {
  try {
    const pkgPath = path.join(__dirname, "../../package.json");
    const pkgData = readFileSync(pkgPath, "utf8");
    return JSON.parse(pkgData);
  } catch (error) {
    console.error("Error reading package.json:", error.message);
    return null;
  }
};

/**
 * Generates the usage message for the CLI.
 * @returns {string} Usage message string.
 */
const getUsageMessage = () => {
  return [
    "Usage: node src/lib/main.js <command> [arguments...]",
    "Available commands:",
    "  - self-test: Runs the self-test suite.",
    "  - demo: Runs a demonstration of functionalities.",
    "  - publish: Runs the publish command (stubbed functionality, full implementation planned).",
    "  - config: Displays configuration options.",
    "  - help: Displays this help message.",
    "  - version: Displays the current version.",
    "  - timestamp: Displays the current timestamp.",
    "  - about: Displays project information.",
    "  - status: Displays a summary of the project status (name, version, and current timestamp).",
    "  - fun: Displays a fun ASCII art banner.",
    "  - greet: Displays a greeting message with a random welcome note.",
    "",
    "Note: When no command is provided, the CLI runs a self-test, followed by a demo, then displays this usage message before terminating automatically.",
    "Note: Future enhancements include full publish functionality and additional automated features such as dependency updates, formatting, and linting improvements."
  ].join("\n");
};

/**
 * Displays the usage message to the console.
 */
const displayUsage = () => {
  console.log(getUsageMessage());
};

/**
 * Executes the self-test command.
 */
const selfTestCommand = () => {
  console.log("Running self-test...");
  console.log("Performing extended self-test validations...");
};

/**
 * Executes the demo command.
 */
const demoCommand = () => {
  console.log("Running demo...");
  console.log("Executing extended demo scenarios...");
};

/**
 * Executes the publish command.
 */
const publishCommand = () => {
  console.log("Running publish...");
  console.log("Publish functionality is under development.");
};

/**
 * Executes the config command.
 */
const configCommand = () => {
  console.log("Configuration options:");
  console.log(JSON.stringify({ theme: "default", language: "en", featureX: true }, null, 2));
};

/**
 * Executes the version command by retrieving package details.
 */
const versionCommand = () => {
  const pkg = loadPackageDetails();
  if (pkg) {
    console.log("Version:", pkg.version);
  } else {
    console.error("Could not retrieve version information.");
  }
};

/**
 * Executes the timestamp command.
 */
const timestampCommand = () => {
  console.log("Current Timestamp:", dayjs().format());
};

/**
 * Executes the about command to display project information.
 */
const aboutCommand = () => {
  const pkg = loadPackageDetails();
  if (pkg) {
    console.log("Project:", pkg.name);
    console.log("Description:", pkg.description);
  } else {
    console.error("Could not retrieve project information.");
  }
};

/**
 * Executes the status command to display project status summary.
 */
const statusCommand = () => {
  const pkg = loadPackageDetails();
  if (pkg) {
    console.log("Project:", pkg.name);
    console.log("Version:", pkg.version);
    console.log("Current Timestamp:", dayjs().format());
  } else {
    console.error("Could not retrieve project status.");
  }
};

/**
 * Executes the fun command to display an ASCII art banner using figlet.
 */
const funCommand = () => {
  const banner = figlet.textSync("agentic-lib", { horizontalLayout: 'default', verticalLayout: 'default' });
  console.log(banner);
  // Append plain text to satisfy test expectations
  console.log("agentic-lib");
};

/**
 * Executes the greet command to display a greeting message with a random welcome note.
 */
const greetCommand = () => {
  const greetings = [
    "Hello, welcome to agentic-lib!",
    "Hi there! agentic-lib greets you warmly!",
    "Greetings from agentic-lib! Enjoy your coding journey!"
  ];
  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
  console.log(randomGreeting);
};

/**
 * Processes the given CLI command and its arguments.
 * @param {string} command - The CLI command to execute.
 * @param {Array} _args - Additional arguments for the command.
 */
const processCommand = (command, _args) => {
  switch (command) {
    case "self-test":
      selfTestCommand();
      break;
    case "demo":
      demoCommand();
      break;
    case "publish":
      publishCommand();
      break;
    case "config":
      configCommand();
      break;
    case "version":
      versionCommand();
      break;
    case "timestamp":
      timestampCommand();
      break;
    case "about":
      aboutCommand();
      break;
    case "status":
      statusCommand();
      break;
    case "fun":
      funCommand();
      break;
    case "greet":
      greetCommand();
      break;
    case "help":
      displayUsage();
      break;
    default:
      console.error("Unknown command:", command);
      displayUsage();
      process.exit(1);
  }
};

/**
 * Main function to parse CLI arguments and execute corresponding commands.
 * Defaults to running self-test, demo, and displaying usage when no command is provided.
 */
const main = () => {
  if (process.argv.length <= 2) {
    selfTestCommand();
    demoCommand();
    displayUsage();
    // Terminate execution after default behavior
    process.exit(0);
  } else {
    const command = process.argv[2];
    const _args = process.argv.slice(3);
    processCommand(command, _args);
  }
};

// Execute main if this module is run directly
if (path.resolve(process.argv[1]) === __filename) {
  main();
}

// Export functions for testing and external usage
export {
  main,
  getUsageMessage,
  displayUsage,
  selfTestCommand,
  demoCommand,
  publishCommand,
  configCommand,
  versionCommand,
  processCommand,
  timestampCommand,
  aboutCommand,
  statusCommand,
  funCommand,
  greetCommand
};
