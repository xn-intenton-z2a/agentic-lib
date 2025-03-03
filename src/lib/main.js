#!/usr/bin/env node
// src/lib/main.js - Implementation aligned with the agentic‑lib mission statement.
// Change Log:
// - Pruned drift and aligned with the mission statement.
// - Extended functionality with flags: --env, --reverse, --telemetry, --telemetry-extended, --version, --create-issue, --simulate-remote.
// - Added Kafka logging functions and a new function analyzeSystemPerformance for system performance telemetry.
// - Enhanced delegated decision functions for improved parsing support.
// - Extended delegateDecisionToLLMWrapped with zod schema validation for improved response validation from OpenAI.

import { fileURLToPath } from "url";
import chalk from "chalk";
import figlet from "figlet";
import os from "os";
import { z } from "zod";

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
    nodeEnv: process.env.NODE_ENV || "undefined",
  };
}

// New function: Gather extended telemetry data including additional GitHub environment variables
export function gatherExtendedTelemetryData() {
  return {
    ...gatherTelemetryData(),
    githubActor: process.env.GITHUB_ACTOR || "N/A",
    githubRepository: process.env.GITHUB_REPOSITORY || "N/A",
    githubEventName: process.env.GITHUB_EVENT_NAME || "N/A",
    ci: process.env.CI || "N/A",
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

// New function: Log Kafka operations by sending and receiving a message for debugging purposes
export function logKafkaOperations(topic, message) {
  const sendResult = sendMessageToKafka(topic, message);
  const receiveResult = receiveMessageFromKafka(topic);
  console.log(chalk.blue("Kafka Operations:"), sendResult, receiveResult);
  return { sendResult, receiveResult };
}

// New function: Analyze system performance telemetry
export function analyzeSystemPerformance() {
  return {
    platform: process.platform,
    cpus: os.cpus().length,
    totalMemory: os.totalmem(),
  };
}

// Main function
export function main(args = []) {
  // Display ASCII art welcome if not in test environment
  if (process.env.NODE_ENV !== "test") {
    console.log(
      chalk.green(
        figlet.textSync("agentic-lib", { horizontalLayout: "full" })
      )
    );
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

  // New feature: If the telemetry-extended flag is provided, display extended telemetry data and exit
  if (flagArgs.includes("--telemetry-extended")) {
    console.log("Extended Telemetry Data: " + JSON.stringify(gatherExtendedTelemetryData(), null, 2));
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
  return "Usage: npm run start [--usage | --help] [--version] [--env] [--telemetry] [--telemetry-extended] [--reverse] [--create-issue] [--simulate-remote] [args...]";
}

export function getIssueNumberFromBranch(branch = "", prefix = "agentic-lib-issue-") {
  const regex = new RegExp(prefix + "(\d+)");
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
      apiKey: process.env.OPENAI_API_KEY || "",
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        { role: "user", content: prompt }
      ],
    });
    return response.data.choices[0].message.content;
  } catch {
    return "LLM decision could not be retrieved.";
  }
}

export async function delegateDecisionToLLMWrapped(prompt) {
  try {
    const { Configuration, OpenAIApi } = await import("openai");
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY || "",
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are evaluating whether an issue has been resolved in the supplied source code. Answer strictly with a JSON object following the provided function schema.",
        },
        { role: "user", content: prompt }
      ],
    });

    const ResponseSchema = z.object({
      fixed: z.string(),
      message: z.string(),
      refinement: z.string(),
    });

    let result;
    const messageObj = response.data.choices[0].message;
    if (messageObj) {
      if (messageObj.tool_calls && messageObj.tool_calls.length > 0) {
        try {
          result = JSON.parse(messageObj.tool_calls[0].function.arguments);
        } catch {
          result = { fixed: "false", message: "Failed to parse tool_calls arguments.", refinement: "None" };
        }
      } else if (messageObj.content) {
        try {
          result = JSON.parse(messageObj.content);
        } catch {
          result = { fixed: "false", message: "Failed to parse response content.", refinement: "None" };
        }
      } else {
        result = { fixed: "false", message: "No valid response received.", refinement: "None" };
      }
    } else {
      result = { fixed: "false", message: "No valid response received.", refinement: "None" };
    }

    const parsed = ResponseSchema.safeParse(result);
    if (!parsed.success) {
      return { fixed: "false", message: "LLM response schema validation failed.", refinement: "None" };
    }
    return parsed.data;
  } catch {
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
  _mainOutput,
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
    refinement: "None",
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
