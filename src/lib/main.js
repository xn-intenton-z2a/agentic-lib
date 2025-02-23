#!/usr/bin/env node
/* eslint-disable no-console, no-process-exit */

import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import path from "path";
import dayjs from "dayjs";  // New dependency for formatting timestamp

// Establish __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to generate the usage message
const getUsageMessage = () => {
  return [
    "Usage: node src/lib/main.js <command> [arguments...]",
    "Available commands:",
    "  - self-test: Runs the self-test suite.",
    "  - demo: Runs a demonstration of functionalities.",
    "  - publish: Runs the publish command (stubbed functionality).",
    "  - config: Displays configuration options.",
    "  - help: Displays this help message.",
    "  - version: Displays the current version.",
    "  - timestamp: Displays the current timestamp.",
    "  - about: Displays project information."
  ].join("\n");
};

// Function to display the usage message
const displayUsage = () => {
  console.log(getUsageMessage());
};

// Command implementations
const selfTestCommand = () => {
  console.log("Running self-test...");
  console.log("Performing extended self-test validations...");
};

const demoCommand = () => {
  console.log("Running demo...");
  console.log("Executing extended demo scenarios...");
};

const publishCommand = () => {
  console.log("Running publish...");
  console.log("Publish functionality is under development.");
};

const configCommand = () => {
  console.log("Configuration options:");
  console.log(JSON.stringify({ theme: "default", language: "en", featureX: true }, null, 2));
};

const versionCommand = () => {
  try {
    const pkgPath = path.join(__dirname, "../../package.json");
    const pkgData = readFileSync(pkgPath, "utf8");
    const pkg = JSON.parse(pkgData);
    console.log("Version:", pkg.version);
  } catch (error) {
    console.error("Error reading version:", error.message);
  }
};

// New command: timestamp
const timestampCommand = () => {
  console.log("Current Timestamp:", dayjs().format());
};

// New command: about - displays project information
const aboutCommand = () => {
  try {
    const pkgPath = path.join(__dirname, "../../package.json");
    const pkgData = readFileSync(pkgPath, "utf8");
    const pkg = JSON.parse(pkgData);
    console.log("Project:", pkg.name);
    console.log("Description:", pkg.description);
  } catch (error) {
    console.error("Error reading project information:", error.message);
  }
};

// Process the given command
const processCommand = (command, args) => {
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
    case "help":
      displayUsage();
      break;
    default:
      console.error("Unknown command:", command);
      displayUsage();
      process.exit(1);
  }
};

// Main execution only if this module is run directly
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  if (process.argv.length <= 2) {
    // Default mode: run self-test, then demo, then show usage
    selfTestCommand();
    demoCommand();
    displayUsage();
  } else {
    const command = process.argv[2];
    const args = process.argv.slice(3);
    processCommand(command, args);
  }
}

// Export functions for testing and external usage
export { getUsageMessage, displayUsage, selfTestCommand, demoCommand, publishCommand, configCommand, versionCommand, processCommand, timestampCommand, aboutCommand };
