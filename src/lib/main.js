#!/usr/bin/env node
// src/lib/main.js - Enhanced version with default usage, demo output, improved exit routine, new LLM delegation functionality, and Kafka messaging simulation.
// Added instrumentation to help in test coverage improvement by exposing behavior via additional flags.
// This update improves consistency between source and test files, extends functionality with new flags (--reverse, --env, --telemetry, --version, --create-issue), adds a new function to delegate decisions to an advanced LLM using OpenAI's chat completions API, refines log messages, and ensures proper exit behavior in both production and test environments.
// Additionally, a new wrapper function (delegateDecisionToLLMWrapped) has been implemented to mimic an enhanced OpenAI function using a function calling style as per contributor guidelines.
// New Kafka messaging simulation functions have been added to simulate inter-workflow communication via Kafka-like behavior.
// Ref: Updated documentation examples to correctly reflect supported flags and behaviors.

import { fileURLToPath } from "url";
import chalk from "chalk";
import figlet from "figlet";

// Helper function to handle application exit in a consistent manner
function exitApplication() {
  console.log(chalk.blue("Exiting agentic-lib."));
  // Prevent exiting during tests
  if (process.env.NODE_ENV !== "test") {
    process.exit(0);
  }
}

// New function: Gather telemetry data from GitHub Actions environment if available
export function gatherTelemetryData() {
  return {
    githubWorkflow: process.env.GITHUB_WORKFLOW || "N/A",
    githubRunId: process.env.GITHUB_RUN_ID || "N/A",
    githubRunNumber: process.env.GITHUB_RUN_NUMBER || "N/A",
    githubJob: process.env.GITHUB_JOB || "N/A",
    githubAction: process.env.GITHUB_ACTION || "N/A",
    nodeEnv: process.env.NODE_ENV || "undefined"
  };
}

// Kafka messaging simulation functions
export function sendMessageToKafka(topic, message) {
  // Simulate sending a message to a Kafka topic.
  // In a real implementation, you might use a library like kafkajs to connect to Kafka brokers.
  console.log(`Simulating sending message to topic '${topic}': ${message}`);
  return `Message sent to topic '${topic}': ${message}`;
}

export function receiveMessageFromKafka(topic) {
  // Simulate receiving a message from a Kafka topic.
  // In a real implementation, proper consumer logic would be applied.
  const simulatedMessage = `Simulated message from topic '${topic}'`;
  console.log(simulatedMessage);
  return simulatedMessage;
}

// Main function
export function main(args = []) {
  // Display ASCII art welcome if not in test environment
  if (process.env.NODE_ENV !== "test") {
    console.log(chalk.green(figlet.textSync("agentic-lib", { horizontalLayout: "full" })));
  }

  // If no arguments or a help/usage flag is provided, show usage info and demo, then exit
  if (args.length === 0 || args.includes("--help") || args.includes("--usage")) {
    const usage = generateUsage();
    console.log(usage);
    console.log("");
    console.log("Demo: Demonstration of agentic-lib functionality:");
    console.log(enhancedDemo());
    if (args.length === 0) {
      console.log("No additional arguments provided.");
    }
    exitApplication();
    return;
  }

  // Split arguments into flags and non-flag arguments
  const { flagArgs, nonFlagArgs } = splitArguments(args);

  // New feature: Simulate issue creation similar to the GitHub workflow (wfr-create-issue.yml)
  if (flagArgs.includes("--create-issue")) {
    const issueTitle = nonFlagArgs.length > 0 ? nonFlagArgs.join(" ") : "Default Issue Title";
    const issueNumber = Math.floor(Math.random() * 1000);
    console.log(chalk.magenta("Simulated Issue Created:"));
    console.log(chalk.magenta("Title: " + issueTitle));
    console.log(chalk.magenta("Issue Number: " + issueNumber));
    exitApplication();
    return;
  }

  // If the version flag is provided, display the version and exit
  if (flagArgs.includes("--version")) {
    console.log(showVersion());
    exitApplication();
    return;
  }

  // New feature: If the env flag is provided, display environment variables and exit
  if (flagArgs.includes("--env")) {
    console.log("Environment Variables: " + JSON.stringify(process.env, null, 2));
    exitApplication();
    return;
  }

  // New feature: If the telemetry flag is provided, display gathered telemetry data and exit
  if (flagArgs.includes("--telemetry")) {
    console.log("Telemetry Data: " + JSON.stringify(gatherTelemetryData(), null, 2));
    exitApplication();
    return;
  }

  // Process the flags sequentially and output the result
  const flagProcessingResult = processFlags(flagArgs);
  console.log(flagProcessingResult);

  // New feature: Reverse the non-flag arguments if '--reverse' flag is provided
  if (flagArgs.includes("--reverse")) {
    // Join non-flag args into a single string, then reverse the entire string
    const reversedInput = nonFlagArgs.join(" ").split("").reverse().join("");
    console.log(chalk.yellow("Reversed input: " + reversedInput));
  }

  if (nonFlagArgs.length > 0) {
    console.log("Non-flag arguments:", nonFlagArgs.join(", "));
  }

  exitApplication();
}

export function generateUsage() {
  return "Usage: npm run start [--usage | --help] [--version] [--env] [--telemetry] [--reverse] [--create-issue] [args...]";
}

export function getIssueNumberFromBranch(branch = "", prefix = "agentic-lib-issue-") {
  // Regex captures one or more digits following the prefix
  const regex = new RegExp(prefix + "(\\d+)");
  const match = branch.match(regex);
  return match ? parseInt(match[1], 10) : null;
}

export function sanitizeCommitMessage(message = "") {
  // Remove special characters except allowed ones and trim extra spaces
  return message
    .replace(/[^A-Za-z0-9 \-_.~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Splits command line arguments into flag and non-flag arrays
export function splitArguments(args = []) {
  const flagArgs = [];
  const nonFlagArgs = [];
  for (const arg of args) {
    if (arg.startsWith("--")) {
      flagArgs.push(arg);
    } else {
      nonFlagArgs.push(arg);
    }
  }
  return { flagArgs, nonFlagArgs };
}

// Processes an array of flags and returns a summary message
export function processFlags(flags = []) {
  if (flags.length === 0) return "No flags to process.";
  let result = `Processed flags: ${flags.join(", ")}`;
  // Extended functionality: append verbose mode activation message if --verbose flag is present
  if (flags.includes("--verbose")) {
    result += " | Verbose mode enabled.";
  }
  // New enhancement: add support for debug mode
  if (flags.includes("--debug")) {
    result += " | Debug mode enabled.";
  }
  return result;
}

// Provides an enhanced demo output including environmental details
export function enhancedDemo() {
  const envDetails = logEnvironmentDetails();
  const debugStatus = process.env.DEBUG_MODE ? `DEBUG_MODE: ${process.env.DEBUG_MODE}` : "DEBUG_MODE: off";
  return `Enhanced Demo: Agentic-lib now supports additional argument processing.\n${envDetails}\n${debugStatus}`;
}

// Logs current environment details
export function logEnvironmentDetails() {
  return `NODE_ENV: ${process.env.NODE_ENV || "undefined"}`;
}

// Returns the current version of the library
export function showVersion() {
  const version = process.env.npm_package_version || "unknown";
  return `Version: ${version}`;
}

// New function: Delegate a decision to an advanced LLM using OpenAI chat completions API
export async function delegateDecisionToLLM(prompt) {
  try {
    const { Configuration, OpenAIApi } = await import("openai");
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY || ""
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt }
      ]
    });
    return response.data.choices[0].message.content;
  } catch (err) {
    return "LLM decision could not be retrieved.";
  }
}

// New function: A wrapped version of the OpenAI delegation function that mimics function calling behavior
export async function delegateDecisionToLLMWrapped(prompt) {
  try {
    const { Configuration, OpenAIApi } = await import("openai");
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY || ""
    });
    const openai = new OpenAIApi(configuration);
    
    // Simulate tools usage as in the example
    const tools = [{
      type: "function",
      function: {
        name: "review_issue",
        description: "Evaluate whether the supplied source file content resolves the issue. Return an object with fixed (string: 'true' or 'false'), message (explanation), and refinement (suggested refinement).",
        parameters: {
          type: "object",
          properties: {
            fixed: { type: "string", description: "true if the issue is resolved, false otherwise" },
            message: { type: "string", description: "A message explaining the result" },
            refinement: { type: "string", description: "A suggested refinement if the issue is not resolved" }
          },
          required: ["fixed", "message", "refinement"],
          additionalProperties: false
        },
        strict: true
      }
    }];

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are evaluating whether an issue has been resolved in the supplied source code. Answer strictly with a JSON object following the provided function schema." },
        { role: "user", content: prompt }
      ]
      // Note: The actual 'tools' argument is not supported; this is a simulated behavior for demonstration purposes.
    });

    let result;
    if (response.data.choices[0].message && response.data.choices[0].message.content) {
      try {
        result = JSON.parse(response.data.choices[0].message.content);
      } catch (e) {
        result = { fixed: "false", message: "Failed to parse response content.", refinement: "None" };
      }
    } else {
      result = { fixed: "false", message: "No valid response received.", refinement: "None" };
    }
    return result;
  } catch (err) {
    return { fixed: "false", message: "LLM decision could not be retrieved.", refinement: "None" };
  }
}

export function reviewIssue({
  sourceFileContent,
  _testFileContent,
  readmeFileContent,
  _dependenciesFileContent,
  _issueTitle,
  _issueDescription,
  _issueComments,
  _dependenciesListOutput,
  _buildOutput,
  _testOutput,
  _mainOutput
}) {
  const fixed =
    sourceFileContent.includes("Usage: npm run start") &&
    readmeFileContent.includes("intentïon agentic-lib")
      ? "true"
      : "false";
  const message = fixed === "true" ? "The issue has been resolved." : "Issue not resolved.";
  return {
    fixed,
    message,
    refinement: "None"
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
