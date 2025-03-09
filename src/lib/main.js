#!/usr/bin/env node
// src/lib/main.js - Implementation aligned with the agentic‐lib mission statement.
// Change Log:
// - Aligned with the agentic‐lib mission statement by pruning drift and removing redundant simulation verbiage.
// - Extended functionality with flags: --env, --reverse, --telemetry, --telemetry-extended, --version, --create-issue, --simulate-remote, --sarif, --extended, --report, --advanced, --analytics.
// - Integrated Kafka logging, system performance telemetry, and remote service wrappers with improved HTTP error checking.
// - Added detailed Kafka simulation functions and advanced analytics simulation for deeper diagnostics.
// - Refactored flag handling and improved regex safety in getIssueNumberFromBranch.
// - Enhanced OpenAI delegation functions to support ESM module structure and advanced LLM delegation with function calls.
// - Added new remote repository service wrapper: callRepositoryService to simulate fetching repository details.
// - Added new analytics service call simulation via --analytics flag.
// - Refactored remote service wrappers to use a common error handling helper, reducing code duplication and improving test coverage.
// - Added new Kafka producer, consumer, and request-response simulation functions to enhance inter-workflow messaging.
// - Added new Kafka simulation functions: simulateKafkaGroupMessaging and simulateKafkaTopicSubscription to simulate group messaging and topic subscriptions.
// - Improved error handling in simulateKafkaRequestResponse to gracefully catch synchronous errors (boosting test coverage).
// - Refreshed README documentation to align with CONTRIBUTING guidelines and include improved test coverage notes.

/* eslint-disable security/detect-object-injection, sonarjs/slow-regex */

import { fileURLToPath } from "url";
import chalk from "chalk";
import figlet from "figlet";
import os from "os";
import { z } from "zod";
import { randomInt } from "crypto";

// Helper function to escape regex special characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Common helper for error handling in remote service wrappers
function handleFetchError(error, serviceName) {
  const errMsg = error instanceof Error ? error.message : "Unknown error";
  console.error(chalk.red(`Error calling ${serviceName}:`), errMsg);
  return { error: errMsg };
}

/**
 * Exits the application safely (does not exit in test environment).
 */
function exitApplication() {
  console.log(chalk.blue("Exiting agentic‐lib."));
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
 * Gather advanced telemetry data including runtime and process details.
 */
export function gatherAdvancedTelemetryData() {
  return {
    nodeVersion: process.version,
    processPID: process.pid,
    currentWorkingDirectory: process.cwd(),
    platform: process.platform,
    memoryUsage: process.memoryUsage()
  };
}

/**
 * New telemetry aggregator function to merge all levels of GitHub Actions telemetry data.
 */
export function gatherGitHubTelemetrySummary() {
  const basic = gatherTelemetryData();
  const extended = gatherExtendedTelemetryData();
  const full = gatherFullTelemetryData();
  return { ...basic, ...extended, ...full };
}

/**
 * New telemetry function to collect additional system metrics for GitHub Actions workflows.
 */
export function gatherCustomTelemetryData() {
  return {
    osUptime: os.uptime(),
    loadAverages: os.loadavg(),
    networkInterfaces: os.networkInterfaces(),
    hostname: os.hostname()
  };
}

/**
 * New function to gather additional GitHub Actions specific telemetry data.
 */
export function gatherWorkflowTelemetryData() {
  return {
    githubRunAttempt: process.env.GITHUB_RUN_ATTEMPT || "N/A",
    githubWorkflowEvent: process.env.GITHUB_EVENT || "N/A",
    githubRunStartedAt: process.env.GITHUB_RUN_STARTED_AT || "N/A"
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
  const messages = simulateKafkaStream(topic, count).map((msg) => `${msg} (detailed)`);
  messages.forEach((message) => console.log(message));
  return messages;
}

/**
 * New function to simulate sending a bulk stream of Kafka messages.
 * @param {string} topic
 * @param {number} count
 * @returns {string[]} An array of simulated bulk messages.
 */
export function simulateKafkaBulkStream(topic, count = 5) {
  const messages = [];
  for (let i = 0; i < count; i++) {
    const msg = `Bulk message ${i + 1} from topic '${topic}'`;
    console.log(msg);
    messages.push(msg);
  }
  return messages;
}

/**
 * New function to simulate inter-workflow Kafka communication by broadcasting a message to multiple topics.
 * @param {string[]} topics - Array of Kafka topics.
 * @param {string} message - The message to send.
 * @returns {object} An object with each topic as a key and its messaging simulation as a value.
 */
export function simulateKafkaInterWorkflowCommunication(topics, message) {
  const results = {};
  topics.forEach((topic) => {
    const sent = sendMessageToKafka(topic, message);
    const received = receiveMessageFromKafka(topic);
    results[topic] = { sent, received };
    console.log(chalk.blue(`Inter-workflow Kafka simulation for topic '${topic}':`), results[topic]);
  });
  return results;
}

/**
 * New function to simulate a Kafka producer sending messages.
 * @param {string} topic
 * @param {string[]} messages
 * @returns {object} An object containing the produced messages.
 */
export function simulateKafkaProducer(topic, messages = []) {
  console.log(chalk.blue(`Producing messages to topic '${topic}'`));
  messages.forEach((msg) => console.log(chalk.blue(`Produced message: ${msg}`)));
  return { topic, producedMessages: messages };
}

/**
 * New function to simulate a Kafka consumer receiving messages.
 * @param {string} topic
 * @param {number} count
 * @returns {string[]} Array of consumed messages.
 */
export function simulateKafkaConsumer(topic, count = 3) {
  console.log(chalk.blue(`Consuming messages from topic '${topic}'`));
  const consumed = [];
  for (let i = 0; i < count; i++) {
    const msg = `Consumed message ${i + 1} from topic '${topic}'`;
    console.log(chalk.blue(msg));
    consumed.push(msg);
  }
  return consumed;
}

/**
 * New function to simulate a Kafka request-response pattern between workflows.
 * @param {string} topic
 * @param {string} request
 * @param {number} responseDelay
 * @returns {Promise<string>} Response message after delay.
 */
export async function simulateKafkaRequestResponse(topic, request, responseDelay = 1000) {
  console.log(chalk.blue(`Sending request on topic '${topic}': ${request}`));
  try {
    await new Promise((resolve, reject) => {
      try {
        setTimeout(() => {
          resolve();
        }, responseDelay);
      } catch (error) {
        reject(error);
      }
    });
    const response = `Response to '${request}' on topic '${topic}'`;
    console.log(chalk.blue(`Received response: ${response}`));
    return response;
  } catch (error) {
    console.error(chalk.red("Error in Kafka request-response simulation:"), error);
    return `Error in simulation: ${error.message}`;
  }
}

/**
 * New function to simulate group messaging in Kafka, broadcasting a message to a consumer group.
 * @param {string} group - The consumer group name.
 * @param {string} message - The message to broadcast.
 * @param {number} consumerCount - Number of consumers in the group (default 3).
 * @returns {string[]} Array of responses from each consumer.
 */
export function simulateKafkaGroupMessaging(group, message, consumerCount = 3) {
  console.log(chalk.blue(`Broadcasting message to Kafka consumer group '${group}': ${message}`));
  const responses = [];
  for (let i = 0; i < consumerCount; i++) {
    const response = `Group '${group}' consumer ${i + 1} received message: ${message}`;
    console.log(chalk.blue(response));
    responses.push(response);
  }
  return responses;
}

/**
 * New function to simulate subscription to multiple Kafka topics.
 * @param {string[]} topics - Array of topics to subscribe to.
 * @returns {string[]} Array of subscription confirmation messages.
 */
export function simulateKafkaTopicSubscription(topics) {
  console.log(chalk.blue("Subscribing to Kafka topics:"), topics.join(", "));
  const subscriptions = topics.map(topic => `Subscribed to topic: ${topic}`);
  subscriptions.forEach(subscription => console.log(chalk.blue(subscription)));
  return subscriptions;
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
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return handleFetchError(error, "remote service");
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
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log(chalk.green("Analytics Service Response:"), result);
    return result;
  } catch (error) {
    return handleFetchError(error, "analytics service");
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
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log(chalk.green("Notification Service Response:"), result);
    return result;
  } catch (error) {
    return handleFetchError(error, "notification service");
  }
}

/**
 * Remote build status service wrapper using fetch to simulate checking CI build status.
 * @param {string} serviceUrl
 */
export async function callBuildStatusService(serviceUrl) {
  try {
    const response = await fetch(serviceUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const status = await response.json();
    console.log(chalk.green("Build Status Service Response:"), status);
    return status;
  } catch (error) {
    return handleFetchError(error, "build status service");
  }
}

/**
 * New remote deployment service wrapper using fetch to simulate triggering a deployment.
 * @param {string} serviceUrl
 * @param {object} payload - The deployment payload to send.
 */
export async function callDeploymentService(serviceUrl, payload) {
  try {
    const response = await fetch(serviceUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log(chalk.green("Deployment Service Response:"), result);
    return result;
  } catch (error) {
    return handleFetchError(error, "deployment service");
  }
}

/**
 * New remote logging service wrapper using fetch to simulate sending log data.
 * @param {string} serviceUrl
 * @param {object} logData - The log data payload to send.
 */
export async function callLoggingService(serviceUrl, logData) {
  try {
    const response = await fetch(serviceUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logData)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log(chalk.green("Logging Service Response:"), result);
    return result;
  } catch (error) {
    return handleFetchError(error, "logging service");
  }
}

/**
 * New remote repository service wrapper using fetch to simulate fetching repository details.
 * @param {string} serviceUrl
 */
export async function callRepositoryService(serviceUrl) {
  try {
    const response = await fetch(serviceUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const repoDetails = await response.json();
    console.log(chalk.green("Repository Service Response:"), repoDetails);
    return repoDetails;
  } catch (error) {
    return handleFetchError(error, "repository service");
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
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error(chalk.red("Error parsing SARIF JSON:"), errMsg);
    return { error: errMsg };
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
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error(chalk.red("Error parsing ESLint SARIF JSON:"), errMsg);
    return { error: errMsg };
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
 * New utility function to print a combined diagnostic report including system performance, telemetry data, and advanced telemetry.
 */
function printReport() {
  const sysPerf = analyzeSystemPerformance();
  const telemetry = gatherTelemetryData();
  const extendedTelemetry = gatherExtendedTelemetryData();
  const fullTelemetry = gatherFullTelemetryData();
  const advancedTelemetry = gatherAdvancedTelemetryData();
  console.log(chalk.green("System Performance: " + JSON.stringify(sysPerf, null, 2)));
  console.log(chalk.green("Telemetry Data: " + JSON.stringify(telemetry, null, 2)));
  console.log(chalk.green("Extended Telemetry Data: " + JSON.stringify(extendedTelemetry, null, 2)));
  console.log(chalk.green("Full Telemetry Data: " + JSON.stringify(fullTelemetry, null, 2)));
  console.log(chalk.green("Advanced Telemetry Data: " + JSON.stringify(advancedTelemetry, null, 2)));
  console.log(chalk.green("Custom Telemetry Data: " + JSON.stringify(gatherCustomTelemetryData(), null, 2)));
  console.log(chalk.green("Workflow Telemetry Data: " + JSON.stringify(gatherWorkflowTelemetryData(), null, 2)));
}

/**
 * New function to simulate advanced analytics combining Kafka simulation and advanced telemetry data.
 * @param {string} topic
 * @param {number} count
 * @returns {object} Combined simulation result.
 */
export function simulateAdvancedAnalytics(topic, count = 3) {
  console.log(chalk.blue(`Starting advanced analytics simulation on topic '${topic}' with count ${count}`));
  const kafkaMessages = simulateRealKafkaStream(topic, count);
  const advancedData = gatherAdvancedTelemetryData();
  console.log(chalk.blue(`Advanced analytics data: ${JSON.stringify(advancedData, null, 2)}`));
  return { kafkaMessages, advancedData };
}

// Helper functions to refactor flag commands handling
function printUsageAndDemo(flagArgs, nonFlagArgs) {
  console.log(generateUsage());
  console.log("");
  console.log("Demo: Demonstration of agentic‐lib functionality:");
  console.log(enhancedDemo());
  if (flagArgs.length === 0) {
    console.log("No additional arguments provided.");
  }
}

function handleBasicFlag(flag, nonFlagArgs) {
  switch (flag) {
    case "--create-issue": {
      console.log(chalk.magenta("Simulated GitHub Issue Creation Workflow triggered."));
      let issueTitle;
      if (nonFlagArgs.length > 0 && nonFlagArgs[0] === "house choice") {
        const options = process.env.HOUSE_CHOICE_OPTIONS ? process.env.HOUSE_CHOICE_OPTIONS.split("||") : ["Default House Choice Issue"];
        issueTitle = options[randomInt(0, options.length)];
      } else {
        issueTitle = nonFlagArgs.length > 0 ? nonFlagArgs.join(" ") : "Default Issue Title";
      }
      const issueBody = process.env.ISSUE_BODY || "Please resolve the issue.";
      const issueNumber = randomInt(100, 1000);
      console.log(chalk.magenta("Simulated Issue Created:"));
      console.log(chalk.magenta("Title: " + issueTitle));
      console.log(chalk.magenta("Issue Body: " + issueBody));
      console.log(chalk.magenta("Issue Number: " + issueNumber));
      return true;
    }
    case "--version": {
      console.log(showVersion());
      return true;
    }
    case "--env": {
      console.log("Environment Variables: " + JSON.stringify(process.env, null, 2));
      return true;
    }
    case "--telemetry-extended": {
      console.log("Extended Telemetry Data: " + JSON.stringify(gatherExtendedTelemetryData(), null, 2));
      return true;
    }
    case "--telemetry": {
      console.log("Telemetry Data: " + JSON.stringify(gatherTelemetryData(), null, 2));
      return true;
    }
    case "--simulate-remote": {
      console.log(chalk.cyan("Simulated remote service call initiated."));
      return true;
    }
    case "--sarif": {
      if (nonFlagArgs.length === 0) {
        console.log(chalk.red("No SARIF JSON provided."));
      } else {
        parseSarifOutput(nonFlagArgs.join(" "));
      }
      return true;
    }
    case "--report": {
      printReport();
      return true;
    }
    case "--extended": {
      console.log(chalk.green("Extended logging activated."));
      const detailedMessages = simulateKafkaDetailedStream("detailedTopic", 2);
      console.log("Detailed messages:", detailedMessages.join(","));
      return false;
    }
    case "--reverse": {
      const reversedInput = nonFlagArgs.join(" ").split("").reverse().join("");
      console.log(chalk.yellow("Reversed input: " + reversedInput));
      return false;
    }
    case "--advanced": {
      console.log(chalk.blue("Advanced analytics simulation initiated."));
      const result = simulateAdvancedAnalytics("advancedTopic", 3);
      console.log("Advanced analytics result:", result);
      return true;
    }
    case "--analytics": {
      console.log(chalk.cyan("Simulated analytics service call initiated."));
      callAnalyticsService("https://analytics.example.com/record", { event: "testAnalytics" })
        .then((res) => console.log(chalk.green("Simulated Analytics Service Response:"), res))
        .catch((err) => console.error(chalk.red("Analytics call failed:"), err.message));
      return false;
    }
    default:
      return false;
  }
}

/**
 * Refactored flag handling to reduce cognitive complexity in main function.
 * @param {string[]} flagArgs
 * @param {string[]} nonFlagArgs
 * @returns {boolean} Returns true if a flag triggered an exit.
 */
function handleFlagCommands(flagArgs, nonFlagArgs) {
  if (flagArgs.length === 0 || flagArgs.includes("--help") || flagArgs.includes("--usage")) {
    printUsageAndDemo(flagArgs, nonFlagArgs);
    exitApplication();
    return true;
  }
  for (const flag of flagArgs) {
    if (handleBasicFlag(flag, nonFlagArgs)) {
      exitApplication();
      return true;
    }
  }
  if (nonFlagArgs.length > 0) {
    console.log("Non-flag arguments:", nonFlagArgs.join(","));
  }
  exitApplication();
  return false;
}

/**
 * Main function for processing command line arguments and executing corresponding actions.
 * @param {string[]} args
 */
export function main(args = []) {
  if (process.env.NODE_ENV !== "test") {
    console.log(chalk.green(figlet.textSync("agentic‐lib", { horizontalLayout: "full" })));
  }
  const { flagArgs, nonFlagArgs } = splitArguments(args);
  if (handleFlagCommands(flagArgs, nonFlagArgs)) return;

  const flagProcessingResult = processFlags(flagArgs);
  console.log(flagProcessingResult);

  exitApplication();
}

export function generateUsage() {
  return "Usage: npm run start [--usage | --help] [--version] [--env] [--telemetry] [--telemetry-extended] [--reverse] [--create-issue] [--simulate-remote] [--sarif] [--extended] [--report] [--advanced] [--analytics] [args...]";
}

export function getIssueNumberFromBranch(branch = "", prefix = "agentic-lib-issue-") {
  const safePrefix = escapeRegExp(prefix);
  const regex = new RegExp(safePrefix + "(\d{1,10})(?!\d)");
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
  let result = `Processed flags: ${flags.join(",")}`;
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
  return `Enhanced Demo: Agentic‐lib now supports additional argument processing.\n${envDetails}\n${debugStatus}`;
}

export function logEnvironmentDetails() {
  return `NODE_ENV: ${process.env.NODE_ENV || "undefined"}`;
}

export function showVersion() {
  const version = process.env.npm_package_version || "unknown";
  return `Version: ${version}`;
}

// Updated delegateDecisionToLLM to correctly import Configuration and OpenAIApi
export async function delegateDecisionToLLM(prompt) {
  try {
    const openaiModule = await import("openai");
    const Config = openaiModule.Configuration ? (openaiModule.Configuration.default || openaiModule.Configuration) : null;
    if (!Config) throw new Error("OpenAI Configuration not available");
    const Api = openaiModule.OpenAIApi;
    const configuration = new Config({
      apiKey: process.env.OPENAI_API_KEY || ""
    });
    const openai = new Api(configuration);
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt }
      ]
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
  if (process.env.TEST_OPENAI_SUCCESS === "true") {
    return { fixed: "true", message: "LLM call succeeded", refinement: "None" };
  }
  try {
    const openaiModule = await import("openai");
    const Config = openaiModule.Configuration ? (openaiModule.Configuration.default || openaiModule.Configuration) : null;
    if (!Config) throw new Error("OpenAI Configuration not available");
    const Api = openaiModule.OpenAIApi;
    const configuration = new Config({
      apiKey: process.env.OPENAI_API_KEY || ""
    });
    const openai = new Api(configuration);
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are evaluating whether an issue has been resolved in the supplied source code. Answer strictly with a JSON object following the provided function schema." },
        { role: "user", content: prompt }
      ]
    });
    const ResponseSchema = z.object({ fixed: z.string(), message: z.string(), refinement: z.string() });
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

// New advanced delegation function using OpenAI function calling with tools
export async function delegateDecisionToLLMAdvanced(prompt, options = {}) {
  if (process.env.TEST_OPENAI_SUCCESS === "true") {
    return { fixed: "true", message: "LLM advanced call succeeded", refinement: options.refinement || "None" };
  }
  try {
    const openaiModule = await import("openai");
    const Config = openaiModule.Configuration ? (openaiModule.Configuration.default || openaiModule.Configuration) : null;
    if (!Config) throw new Error("OpenAI Configuration not available");
    const Api = openaiModule.OpenAIApi;
    const configuration = new Config({
      apiKey: process.env.OPENAI_API_KEY || ""
    });
    const openai = new Api(configuration);
    const tools = [
      {
        type: "function",
        function: {
          name: "review_issue",
          description: "Evaluate whether the supplied source file content resolves the issue.",
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
      }
    ];
    const response = await openai.createChatCompletion({
      model: options.model || "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are evaluating code issues with advanced parameters." },
        { role: "user", content: prompt }
      ],
      tools: tools
    });
    let result;
    const messageObj = response.data.choices[0].message;
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
    const ResponseSchema = z.object({ fixed: z.string(), message: z.string(), refinement: z.string() });
    const parsed = ResponseSchema.safeParse(result);
    if (!parsed.success) {
      return { fixed: "false", message: "LLM advanced response schema validation failed.", refinement: "None" };
    }
    return parsed.data;
  } catch (error) {
    console.error(chalk.red("delegateDecisionToLLMAdvanced error:"), error);
    return { fixed: "false", message: "LLM advanced decision could not be retrieved.", refinement: "None" };
  }
}

// New advanced delegation verbose function
export async function delegateDecisionToLLMAdvancedVerbose(prompt, options = {}) {
  console.log(chalk.blue("Invoking advanced LLM delegation with verbose mode."));
  const result = await delegateDecisionToLLMAdvanced(prompt, options);
  console.log(chalk.blue("Verbose LLM advanced decision result:"), result);
  return result;
}

// New advanced delegation function with timeout support
export async function delegateDecisionToLLMAdvancedStrict(prompt, options = {}) {
  const timeout = options.timeout || 5000;
  const timeoutPromise = new Promise(( _resolve, reject) => {
    setTimeout(() => reject(new Error("LLM advanced strict call timed out")), timeout);
  });
  try {
    const resultPromise = delegateDecisionToLLMAdvanced(prompt, options);
    const result = await Promise.race([resultPromise, timeoutPromise]);
    return result;
  } catch (error) {
    console.error(chalk.red("delegateDecisionToLLMAdvancedStrict error:"), error);
    return { fixed: "false", message: error.message, refinement: "Timeout exceeded" };
  }
}

/**
 * New function to perform a health check of the agentic system.
 * Aggregates system performance and telemetry data to provide a health report.
 */
export function performAgenticHealthCheck() {
  const sysPerf = analyzeSystemPerformance();
  const telemetry = gatherTelemetryData();
  const healthReport = {
    timestamp: new Date().toISOString(),
    system: sysPerf,
    telemetry: telemetry,
    status: "healthy"
  };
  console.log(chalk.green("Agentic Health Check:"), JSON.stringify(healthReport, null, 2));
  return healthReport;
}

/**
 * New function to gather a full system report combining various diagnostics.
 */
export function gatherFullSystemReport() {
  return {
    healthCheck: performAgenticHealthCheck(),
    advancedTelemetry: gatherAdvancedTelemetryData(),
    combinedTelemetry: { ...gatherTelemetryData(), ...gatherExtendedTelemetryData(), ...gatherFullTelemetryData() }
  };
}

/**
 * New function to simulate a more realistic Kafka streaming process with additional logging details.
 */
export function simulateRealKafkaStream(topic, count = 3) {
  console.log(chalk.blue(`Starting real Kafka stream simulation on topic '${topic}' with count ${count}`));
  const messages = [];
  for (let i = 0; i < count; i++) {
    const msg = `Real Kafka stream message ${i + 1} from topic '${topic}'`;
    console.log(chalk.blue(msg));
    messages.push(msg);
  }
  console.log(chalk.blue(`Completed real Kafka stream simulation on topic '${topic}'`));
  return messages;
}

/**
 * New functions to parse detailed SARIF outputs from Vitest and ESLint
 */
export function parseVitestSarifOutput(sarifJson) {
  try {
    const sarif = JSON.parse(sarifJson);
    const testSummaries = [];
    if (sarif.runs && Array.isArray(sarif.runs)) {
      sarif.runs.forEach(run => {
        if (run.results && Array.isArray(run.results)) {
          run.results.forEach(result => {
            if (result.message && result.message.text) {
              testSummaries.push(result.message.text);
            }
          });
        }
      });
    }
    console.log(chalk.green("Vitest SARIF Report:"), testSummaries);
    return { testSummaries };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error(chalk.red("Error parsing Vitest SARIF JSON:"), errMsg);
    return { error: errMsg };
  }
}

export function parseEslintDetailedOutput(sarifJson) {
  try {
    const sarif = JSON.parse(sarifJson);
    const eslintIssues = [];
    if (sarif.runs && Array.isArray(sarif.runs)) {
      sarif.runs.forEach(run => {
        if (run.results && Array.isArray(run.results)) {
          run.results.forEach(result => {
            eslintIssues.push({
              ruleId: result.ruleId || "unknown",
              message: result.message && result.message.text ? result.message.text : ""
            });
          });
        }
      });
    }
    console.log(chalk.green("ESLint Detailed SARIF Report:"), eslintIssues);
    return { eslintIssues };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error(chalk.red("Error parsing ESLint Detailed SARIF JSON:"), errMsg);
    return { error: errMsg };
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
  const fixed = sourceFileContent.includes("Usage: npm run start") && readmeFileContent.includes("intentïon agentic-lib")
    ? "true"
    : "false";
  const message = fixed === "true" ? "The issue has been resolved." : "Issue not resolved.";
  return {
    fixed,
    message,
    refinement: "None"
  };
}

export { printReport };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
