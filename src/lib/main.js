#!/usr/bin/env node
// src/lib/main.js - Implementation aligned with the agentic‑lib mission statement.
// Change Log: Pruned drift and aligned with the mission statement. Extended functionality with flags:
// --env, --reverse, --telemetry, --version, --create-issue, and --simulate-remote for simulating remote service calls.

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
  console.log(`Simulating sending message to topic '${topic}': ${message}`);
  return `Message sent to topic '${topic}': ${message}`;
}

export function receiveMessageFromKafka(topic) {
  // Simulate receiving a message from a Kafka topic.
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

  // New feature: Simulate a remote service call when --simulate-remote is provided
  if (flagArgs.includes("--simulate-remote")) {
    console.log(chalk.cyan("Simulated remote service call initiated."));
    exitApplication();
    return;
  }

  // Process the flags sequentially and output the result
  const flagProcessingResult = processFlags(flagArgs);
  console.log(flagProcessingResult);

  // New feature: Reverse the non-flag arguments if '--reverse' flag is provided
  if (flagArgs.includes("--reverse")) {
    const reversedInput = nonFlagArgs.join(" ").split("").reverse().join("");
    console.log(chalk.yellow("Reversed input: " + reversedInput));
  }

  if (nonFlagArgs.length > 0) {
    console.log("Non-flag arguments:", nonFlagArgs.join(", "));
  }

  exitApplication();
}

export function generateUsage() {
  return "Usage: npm run start [--usage | --help] [--version] [--env] [--telemetry] [--reverse] [--create-issue] [--simulate-remote] [args...]";
}

export function getIssueNumberFromBranch(branch = "", prefix = "agentic-lib-issue-") {
  const regex = new RegExp(prefix + "(\\d+)");
  const match = branch.match(regex);
  return match ? parseInt(match[1], 10) : null;
}

export function sanitizeCommitMessage(message = "") {
  return message
    .replace(/[^A-Za-z0-9 \-_.~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

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

export function processFlags(flags = []) {
  if (flags.length === 0) return "No flags to process.";
  let result = `Processed flags: ${flags.join(", ")}`;
  if (flags.includes("--verbose")) {
    result += " | Verbose mode enabled.";
  }
  if (flags.includes("--debug")) {
    result += " | Debug mode enabled.";
  }
  return result;
}

export function enhancedDemo() {
  const envDetails = logEnvironmentDetails();
  const debugStatus = process.env.DEBUG_MODE ? `DEBUG_MODE: ${process.env.DEBUG_MODE}` : "DEBUG_MODE: off";
  return `Enhanced Demo: Agentic-lib now supports additional argument processing.\n${envDetails}\n${debugStatus}`;
}

export function logEnvironmentDetails() {
  return `NODE_ENV: ${process.env.NODE_ENV || "undefined"}`;
}

export function showVersion() {
  const version = process.env.npm_package_version || "unknown";
  return `Version: ${version}`;
}

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

export async function delegateDecisionToLLMWrapped(prompt) {
  try {
    const { Configuration, OpenAIApi } = await import("openai");
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY || ""
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are evaluating whether an issue has been resolved in the supplied source code. Answer strictly with a JSON object following the provided function schema." },
        { role: "user", content: prompt }
      ]
    });

    let result;
    const message = response.data.choices[0].message;
    if (message) {
      if (message.tool_calls && message.tool_calls.length > 0) {
        try {
          result = JSON.parse(message.tool_calls[0].function.arguments);
        } catch (e) {
          result = { fixed: "false", message: "Failed to parse tool_calls arguments.", refinement: "None" };
        }
      } else if (message.content) {
        try {
          result = JSON.parse(message.content);
        } catch (e) {
          result = { fixed: "false", message: "Failed to parse response content.", refinement: "None" };
        }
      } else {
        result = { fixed: "false", message: "No valid response received.", refinement: "None" };
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
