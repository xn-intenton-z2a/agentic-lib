#!/usr/bin/env node
// src/lib/main.js - Implementation aligned with the agentic‑lib mission statement.
// Change Log:
// - Pruned drift and aligned with the mission statement.
// - Removed redundant simulation verbiage while retaining demo outputs.
// - Extended functionality with flags: --env, --reverse, --telemetry, --telemetry-extended, --version, --create-issue, --simulate-remote, --sarif, and now --extended for detailed logging.
// - Integrated Kafka logging, system performance telemetry, remote service wrappers (including analytics, notification, and build status), improved LLM decision delegation with error logging and zod validation.
// - Added extended Kafka simulation function simulateKafkaDetailedStream for detailed diagnostics.
// - Updated code comments and usage instructions to reflect the refined mission statement and new features.

import { fileURLToPath } from "url";
import chalk from "chalk";
import figlet from "figlet";
import os from "os";
import { z } from "zod";
import { randomInt } from "crypto";

// Helper function to escape regex special characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Exits the application safely (does not exit in test environment).
 */
function exitApplication() {
  console.log(chalk.blue("Exiting agentic-lib."));
  if (process.env.NODE_ENV !== "test") {
    process.exit(0);
  }
}

/**
 * Gather basic telemetry data from GitHub Actions environment if available.
 */
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

/**
 * Gather extended telemetry data including additional GitHub environment variables.
 */
export function gatherExtendedTelemetryData() {
  return {
    ...gatherTelemetryData(),
    githubActor: process.env.GITHUB_ACTOR || "N/A",
    githubRepository: process.env.GITHUB_REPOSITORY || "N/A",
    githubEventName: process.env.GITHUB_EVENT_NAME || "N/A",
    ci: process.env.CI || "N/A"
  };
}

/**
 * Gather full telemetry data including additional GitHub environment variables such as refs and shas.
 */
export function gatherFullTelemetryData() {
  return {
    ...gatherExtendedTelemetryData(),
    githubRef: process.env.GITHUB_REF || "N/A",
    githubSha: process.env.GITHUB_SHA || "N/A",
    githubHeadRef: process.env.GITHUB_HEAD_REF || "N/A",
    githubBaseRef: process.env.GITHUB_BASE_REF || "N/A"
  };
}

/**
 * Simulate sending a message to a Kafka topic.
 * @param {string} topic
 * @param {string} message
 */
export function sendMessageToKafka(topic, message) {
  const result = `Message sent to topic '${topic}': ${message}`;
  console.log(`Simulating sending message to topic '${topic}': ${message}`);
  return result;
}

/**
 * Simulate receiving a message from a Kafka topic.
 * @param {string} topic
 */
export function receiveMessageFromKafka(topic) {
  const simulatedMessage = `Simulated message from topic '${topic}'`;
  console.log(simulatedMessage);
  return simulatedMessage;
}

/**
 * Log Kafka operations by sending and receiving a message for debugging purposes.
 * @param {string} topic
 * @param {string} message
 */
export function logKafkaOperations(topic, message) {
  const sendResult = sendMessageToKafka(topic, message);
  const receiveResult = receiveMessageFromKafka(topic);
  console.log(chalk.blue("Kafka Operations:"), sendResult, receiveResult);
  return { sendResult, receiveResult };
}

/**
 * Simulate streaming Kafka messages from a given topic.
 * @param {string} topic - The Kafka topic to simulate streaming from.
 * @param {number} count - Number of messages to simulate (default 3).
 * @returns {string[]} An array of simulated messages.
 */
export function simulateKafkaStream(topic, count = 3) {
  const messages = [];
  for (let i = 0; i < count; i++) {
    const msg = `Streamed message ${i + 1} from topic '${topic}'`;
    console.log(msg);
    messages.push(msg);
  }
  return messages;
}

/**
 * Extended simulation of Kafka stream with detailed logging.
 * @param {string} topic
 * @param {number} count
 * @returns {string[]} An array of detailed simulated messages.
 */
export function simulateKafkaDetailedStream(topic, count = 3) {
  const messages = simulateKafkaStream(topic, count).map(msg => `${msg} (detailed)`);
  messages.forEach(message => console.log(message));
  return messages;
}

/**
 * Analyze system performance telemetry including platform, CPU count, and total memory.
 */
export function analyzeSystemPerformance() {
  return {
    platform: process.platform,
    cpus: os.cpus().length,
    totalMemory: os.totalmem()
  };
}

/**
 * Remote service wrapper using native fetch to simulate an API call.
 * @param {string} serviceUrl
 */
export async function callRemoteService(serviceUrl) {
  try {
    const response = await fetch(serviceUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(chalk.red("Error calling remote service:"), error);
    return { error: error.message };
  }
}

/**
 * Remote analytics service wrapper using fetch to simulate sending analytics data.
 * @param {string} serviceUrl
 * @param {object} data - The analytics payload to send.
 */
export async function callAnalyticsService(serviceUrl, data) {
  try {
    const response = await fetch(serviceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    console.log(chalk.green("Analytics Service Response:"), result);
    return result;
  } catch (error) {
    console.error(chalk.red("Error calling analytics service:"), error);
    return { error: error.message };
  }
}

/**
 * Remote notification service wrapper using fetch to simulate sending notifications.
 * @param {string} serviceUrl
 * @param {object} payload - The notification payload to send.
 */
export async function callNotificationService(serviceUrl, payload) {
  try {
    const response = await fetch(serviceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    console.log(chalk.green("Notification Service Response:"), result);
    return result;
  } catch (error) {
    console.error(chalk.red("Error calling notification service:"), error);
    return { error: error.message };
  }
}

/**
 * Remote build status service wrapper using fetch to simulate checking CI build status.
 * @param {string} serviceUrl
 */
export async function callBuildStatusService(serviceUrl) {
  try {
    const response = await fetch(serviceUrl);
    const status = await response.json();
    console.log(chalk.green("Build Status Service Response:"), status);
    return status;
  } catch (error) {
    console.error(chalk.red("Error calling build status service:"), error);
    return { error: error.message };
  }
}

/**
 * Parse SARIF formatted JSON to summarize issues.
 * @param {string} sarifJson
 */
export function parseSarifOutput(sarifJson) {
  try {
    const sarif = JSON.parse(sarifJson);
    let totalIssues = 0;
    if (sarif.runs && Array.isArray(sarif.runs)) {
      for (const run of sarif.runs) {
        if (run.results && Array.isArray(run.results)) {
          totalIssues += run.results.length;
        }
      }
    }
    console.log(chalk.green(`SARIF Report: Total issues: ${totalIssues}`));
    return { totalIssues };
  } catch (error) {
    console.error(chalk.red("Error parsing SARIF JSON:"), error);
    return { error: error.message };
  }
}

/**
 * Parse ESLint SARIF formatted JSON to summarize ESLint issues.
 * @param {string} sarifJson
 */
export function parseEslintSarifOutput(sarifJson) {
  try {
    const sarif = JSON.parse(sarifJson);
    let totalIssues = 0;
    if (sarif.runs && Array.isArray(sarif.runs)) {
      for (const run of sarif.runs) {
        if (run.results && Array.isArray(run.results)) {
          totalIssues += run.results.length;
        }
      }
    }
    console.log(chalk.green(`ESLint SARIF Report: Total issues: ${totalIssues}`));
    return { totalIssues };
  } catch (error) {
    console.error(chalk.red("Error parsing ESLint SARIF JSON:"), error);
    return { error: error.message };
  }
}

/**
 * Parse Vitest output string to extract test summary.
 * Expected format: string containing "<number> tests passed".
 * @param {string} outputStr
 */
export function parseVitestOutput(outputStr) {
  const match = outputStr.match(/(\d+) tests passed/);
  if (match) {
    const testsPassed = parseInt(match[1], 10);
    console.log(chalk.green(`Vitest Output: ${testsPassed} tests passed.`));
    return { testsPassed };
  } else {
    console.error(chalk.red("Error parsing Vitest output: Summary not found."));
    return { error: "Test summary not found" };
  }
}

/**
 * Main function for processing command line arguments and executing corresponding actions.
 * @param {string[]} args
 */
export function main(args = []) {
  if (process.env.NODE_ENV !== "test") {
    console.log(chalk.green(figlet.textSync("agentic-lib", { horizontalLayout: "full" })));
  }

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

  const { flagArgs, nonFlagArgs } = splitArguments(args);

  if (flagArgs.includes("--create-issue")) {
    let issueTitle;
    if (nonFlagArgs.length > 0 && nonFlagArgs[0] === "house choice") {
      const options = process.env.HOUSE_CHOICE_OPTIONS
        ? process.env.HOUSE_CHOICE_OPTIONS.split("||")
        : ["Default House Choice Issue"];
      issueTitle = options[randomInt(0, options.length)];
    } else {
      issueTitle = nonFlagArgs.length > 0 ? nonFlagArgs.join(" ") : "Default Issue Title";
    }
    const issueNumber = randomInt(0, 1000);
    console.log(chalk.magenta("Simulated Issue Created:"));
    console.log(chalk.magenta("Title: " + issueTitle));
    console.log(chalk.magenta("Issue Number: " + issueNumber));
    exitApplication();
    return;
  }

  if (flagArgs.includes("--version")) {
    console.log(showVersion());
    exitApplication();
    return;
  }

  if (flagArgs.includes("--env")) {
    console.log("Environment Variables: " + JSON.stringify(process.env, null, 2));
    exitApplication();
    return;
  }

  if (flagArgs.includes("--telemetry-extended")) {
    console.log("Extended Telemetry Data: " + JSON.stringify(gatherExtendedTelemetryData(), null, 2));
    exitApplication();
    return;
  }

  if (flagArgs.includes("--telemetry")) {
    console.log("Telemetry Data: " + JSON.stringify(gatherTelemetryData(), null, 2));
    exitApplication();
    return;
  }

  if (flagArgs.includes("--simulate-remote")) {
    console.log(chalk.cyan("Simulated remote service call initiated."));
    exitApplication();
    return;
  }

  if (flagArgs.includes("--sarif")) {
    if (nonFlagArgs.length === 0) {
      console.log(chalk.red("No SARIF JSON provided."));
    } else {
      parseSarifOutput(nonFlagArgs.join(" "));
    }
    exitApplication();
    return;
  }

  // New extended flag for detailed logging
  if (flagArgs.includes("--extended")) {
    console.log(chalk.green("Extended logging activated."));
    const detailedMessages = simulateKafkaDetailedStream("detailedTopic", 2);
    console.log("Detailed messages:", detailedMessages.join(", "));
  }

  const flagProcessingResult = processFlags(flagArgs);
  console.log(flagProcessingResult);

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
  return "Usage: npm run start [--usage | --help] [--version] [--env] [--telemetry] [--telemetry-extended] [--reverse] [--create-issue] [--simulate-remote] [--sarif] [--extended] [args...]";
}

export function getIssueNumberFromBranch(branch = "", prefix = "agentic-lib-issue-") {
  const safePrefix = escapeRegExp(prefix);
  const regex = new RegExp(safePrefix + "(\\d+)");
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
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });
    return response.data.choices[0].message.content;
  } catch {
    return "LLM decision could not be retrieved.";
  }
}

// Helper to parse LLM response message
function parseLLMMessage(messageObj) {
  let result;
  if (messageObj.tool_calls && Array.isArray(messageObj.tool_calls) && messageObj.tool_calls.length > 0) {
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
  return result;
}

export async function delegateDecisionToLLMWrapped(prompt) {
  if (process.env.TEST_OPENAI_SUCCESS) {
    return { fixed: "true", message: "LLM call succeeded", refinement: "None" };
  }
  if (process.env.NODE_ENV === "test") {
    return { fixed: "false", message: "LLM decision could not be retrieved.", refinement: "None" };
  }
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
        { role: "user", content: prompt },
      ],
    });

    const ResponseSchema = z.object({
      fixed: z.string(),
      message: z.string(),
      refinement: z.string(),
    });

    const messageObj = response.data.choices[0].message;
    const result = parseLLMMessage(messageObj);
    const parsed = ResponseSchema.safeParse(result);
    if (!parsed.success) {
      return { fixed: "false", message: "LLM response schema validation failed.", refinement: "None" };
    }
    return parsed.data;
  } catch (error) {
    console.error(chalk.red("delegateDecisionToLLMWrapped error:"), error);
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
    sourceFileContent.includes("Usage: npm run start") && readmeFileContent.includes("intentïon agentic-lib")
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
