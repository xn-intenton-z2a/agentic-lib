#!/usr/bin/env node

/*
  Minimal CLI for agentic-lib
  ============================
  This file is part of the agentic-lib project and provides a minimal command-line interface.

  Available Commands:
    - self-test: Runs the self-test suite (placeholder implementation).
    - demo: Runs a demonstration of functionalities (placeholder implementation).
    - help: Displays this help message.

  Usage:
    node src/lib/main.js <command> [arguments...]
    If no command is provided, a help message is displayed.

  License:
    GPL-3.0
*/

const displayUsage = () => {
  console.log("Usage: node src/lib/main.js <command> [arguments...]");
  console.log("Available commands:");
  console.log("  - self-test: Runs the self test suite.");
  console.log("  - demo: Runs a demonstration of functionalities.");
  console.log("  - help: Displays this help message.");
};

const selfTestCommand = () => {
  console.log("Running self-test...");
  // Placeholder: Add self-test functionality here if needed
};

const demoCommand = () => {
  console.log("Running demo...");
  // Placeholder: Add demo functionality here if needed
};

if (process.argv.length <= 2) {
  displayUsage();
} else {
  const command = process.argv[2];
  const args = process.argv.slice(3);
  switch (command) {
    case "self-test":
      selfTestCommand();
      break;
    case "demo":
      demoCommand();
      break;
    case "help":
      displayUsage();
      break;
    default:
      console.error("Unknown command:", command);
      displayUsage();
      process.exit(1);
  }
}
