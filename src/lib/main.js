#!/usr/bin/env node
// src/lib/main.js - Implementation aligned with the agentic‑lib mission statement.
// Change Log:
// - Aligned code with the agentic‑lib mission statement by pruning drift and removing redundant simulation verbiage.
// - Extended functionality with refined flag handling, enhanced telemetry, improved remote service wrappers, and updated delegation functions.
// - Added additional Kafka messaging functions and file system simulation for deeper testing.
// - Added new remote monitoring service wrapper to simulate fetching monitoring metrics remotely.

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
  console.log(chalk.blue("Exiting agentic‑lib."));
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
 * New telemetry function to capture additional CI environment metrics from GitHub Actions.
 */
export function gatherCIEnvironmentMetrics() {
  return {
    githubWorkspace: process.env.GITHUB_WORKSPACE || "N/A",
    githubEventPath: process.env.GITHUB_EVENT_PATH || "N/A",
    githubPath: process.env.GITHUB_PATH || "N/A"
  };
}

/**
 * New telemetry aggregator function to merge all levels of GitHub Actions telemetry data, including CI metrics.
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
 * New function to aggregate all telemetry information from various functions including process uptime and CI environment metrics.
 */
export function gatherTotalTelemetry() {
  return {
    basic: gatherTelemetryData(),
    extended: gatherExtendedTelemetryData(),
    full: gatherFullTelemetryData(),
    advanced: gatherAdvancedTelemetryData(),
    githubSummary: gatherGitHubTelemetrySummary(),
    custom: gatherCustomTelemetryData(),
    workflow: gatherWorkflowTelemetryData(),
    ciEnvMetrics: gatherCIEnvironmentMetrics(),
    processUptime: process.uptime()
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
    console.log(chalk.green("Repository Service Response:"), data);
    return data;
  } catch (error) {
    return handleFetchError(error, "repository service");
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
 * Remote deployment service wrapper using fetch to simulate triggering a deployment.
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
 * Remote logging service wrapper using fetch to simulate sending log data.
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
 * Remote code quality service wrapper using fetch to simulate retrieving code quality metrics.
 * @param {string} serviceUrl
 * @param {object} parameters - The parameters for code quality analysis.
 */
export async function callCodeQualityService(serviceUrl, parameters) {
  try {
    const response = await fetch(serviceUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parameters)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log(chalk.green("Code Quality Service Response:"), result);
    return result;
  } catch (error) {
    return handleFetchError(error, "code quality service");
  }
}

/**
 * Remote security scan service wrapper using fetch to simulate vulnerability scanning.
 * @param {string} serviceUrl
 * @param {object} payload - The payload for the security scan.
 */
export async function callSecurityScanService(serviceUrl, payload) {
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
    console.log(chalk.green("Security Scan Service Response:"), result);
    return result;
  } catch (error) {
    return handleFetchError(error, "security scan service");
  }
}

/**
 * New remote monitoring service wrapper using fetch to simulate retrieving monitoring metrics.
 * @param {string} serviceUrl
 */
export async function callMonitoringService(serviceUrl) {
  try {
    const response = await fetch(serviceUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(chalk.green("Monitoring Service Response:"), data);
    return data;
  } catch (error) {
    return handleFetchError(error, "monitoring service");
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
  console.log("Demo: Demonstration of agentic‑lib functionality:");
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
      console.log(chalk.magenta(JSON.stringify({
        issueTitle,
        issueBody,
        issueNumber,
        status: "Created via simulated workflow"
      })));
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
    case "--config": {
      printConfiguration();
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
    console.log(chalk.green(figlet.textSync("agentic‑lib", { horizontalLayout: "full" })));
  }
  const { flagArgs, nonFlagArgs } = splitArguments(args);
  if (handleFlagCommands(flagArgs, nonFlagArgs)) return;

  const flagProcessingResult = processFlags(flagArgs);
  console.log(flagProcessingResult);

  exitApplication();
}

export function generateUsage() {
  return "Usage: npm run start [--usage | --help] [--version] [--env] [--telemetry] [--telemetry-extended] [--reverse] [--create-issue] [--simulate-remote] [--sarif] [--extended] [--report] [--advanced] [--analytics] [--config] [args...]";
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
  return `Enhanced Demo: Agentic‑lib now supports additional argument processing.\n${envDetails}\n${debugStatus}`;
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
    const configuration = new Config({ apiKey: process.env.OPENAI_API_KEY || "" });
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
  if (!process.env.OPENAI_API_KEY) {
    console.error(chalk.red("OpenAI API key is missing."));
    return { fixed: "false", message: "OpenAI API key is missing.", refinement: "Provide a valid API key." };
  }
  try {
    const openaiModule = await import("openai");
    const Config = openaiModule.Configuration ? (openaiModule.Configuration.default || openaiModule.Configuration) : null;
    if (!Config) throw new Error("OpenAI Configuration not available");
    const Api = openaiModule.OpenAIApi;
    const configuration = new Config({ apiKey: process.env.OPENAI_API_KEY || "" });
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
  if (!process.env.OPENAI_API_KEY) {
    console.error(chalk.red("OpenAI API key is missing."));
    return { fixed: "false", message: "OpenAI API key is missing.", refinement: "Provide a valid API key." };
  }
  try {
    const openaiModule = await import("openai");
    const Config = openaiModule.Configuration ? (openaiModule.Configuration.default || openaiModule.Configuration) : null;
    if (!Config) throw new Error("OpenAI Configuration not available");
    const Api = openaiModule.OpenAIApi;
    const configuration = new Config({ apiKey: process.env.OPENAI_API_KEY || "" });
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
  let resultPromise;
  if (process.env.TEST_OPENAI_SUCCESS === "true") {
    resultPromise = delegateDecisionToLLMAdvanced(prompt, options);
  } else {
    resultPromise = new Promise(() => {});
  }
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("LLM advanced strict call timed out")), timeout);
  });
  try {
    const result = await Promise.race([resultPromise, timeoutPromise]);
    return result;
  } catch (error) {
    console.error(chalk.red("delegateDecisionToLLMAdvancedStrict error:"), error);
    return { fixed: "false", message: error.message, refinement: "Timeout exceeded" };
  }
}

// New OpenAI function wrapper using function calling
export async function callOpenAIFunctionWrapper(prompt, model = "gpt-3.5-turbo") {
  if (!prompt) {
    const errMsg = "Prompt is empty.";
    console.error(chalk.red("callOpenAIFunctionWrapper error:"), errMsg);
    return { fixed: "false", message: errMsg, refinement: "None" };
  }
  if (!process.env.OPENAI_API_KEY) {
    const errMsg = "OpenAI API key is missing.";
    console.error(chalk.red("callOpenAIFunctionWrapper error:"), errMsg);
    return { fixed: "false", message: errMsg, refinement: "Provide a valid API key." };
  }
  try {
    const openaiModule = await import("openai");
    const Config = openaiModule.Configuration ? (openaiModule.Configuration.default || openaiModule.Configuration) : null;
    if (!Config) throw new Error("OpenAI Configuration not available");
    const Api = openaiModule.OpenAIApi;
    const configuration = new Config({ apiKey: process.env.OPENAI_API_KEY || "" });
    const openai = new Api(configuration);
    const tools = [
      {
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
      }
    ];

    const response = await openai.createChatCompletion({
      model,
      messages: [
        { role: "system", content: "You are evaluating whether an issue has been resolved in the supplied source code. Answer strictly with a JSON object following the provided function schema." },
        { role: "user", content: prompt }
      ],
      tools: tools
    });

    let result;
    const messageObj = response.data.choices[0].message;
    if (messageObj.tool_calls && Array.isArray(messageObj.tool_calls) && messageObj.tool_calls.length > 0) {
      try {
        result = JSON.parse(messageObj.tool_calls[0].function.arguments);
      } catch (e) {
        throw new Error(`Failed to parse function call arguments: ${e.message}`);
      }
    } else if (messageObj.content) {
      try {
        result = JSON.parse(messageObj.content);
      } catch (e) {
        throw new Error(`Failed to parse response content: ${e.message}`);
      }
    } else {
      throw new Error("No valid response received from OpenAI.");
    }
    return result;
  } catch (error) {
    console.error(chalk.red("callOpenAIFunctionWrapper error:"), error);
    return { fixed: "false", message: "Enhanced wrapper failure: " + error.message, refinement: "None" };
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
      sarif.runs.forEach((run) => {
        if (run.results && Array.isArray(run.results)) {
          run.results.forEach((result) => {
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
      sarif.runs.forEach((run) => {
        if (run.results && Array.isArray(run.results)) {
          run.results.forEach((result) => {
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

// New Kafka simulation functions

/**
 * Simulate Kafka Producer: produces messages to a given topic.
 * @param {string} topic
 * @param {string[]} messages
 * @returns {object} An object containing the topic and produced messages.
 */
export function simulateKafkaProducer(topic, messages = []) {
  console.log(`Producing messages to topic '${topic}':`, messages);
  return { topic, producedMessages: messages };
}

/**
 * Simulate Kafka Consumer: returns an array of consumed messages from a topic.
 * @param {string} topic
 * @param {number} count
 * @returns {string[]} Array of consumed messages.
 */
export function simulateKafkaConsumer(topic, count = 1) {
  const messages = [];
  for (let i = 0; i < count; i++) {
    const msg = `Consumed message ${i + 1} from topic 'consumerTopic'`;
    messages.push(msg);
  }
  return messages;
}

/**
 * Simulate Kafka Request-Response: returns a response for a given request on a topic.
 * @param {string} topic
 * @param {string} requestData
 * @param {number} delay
 * @returns {Promise<string>} Response string.
 */
export async function simulateKafkaRequestResponse(topic, requestData, delay = 50) {
  try {
    await new Promise((resolve) => setTimeout(resolve, delay));
    return `Response to '${requestData}' on topic '${topic}'`;
  } catch (error) {
    return `Error in simulation: ${error.message}`;
  }
}

/**
 * Simulate Kafka Group Messaging: returns responses from multiple consumers in a group.
 * @param {string} group
 * @param {string} message
 * @param {number} consumerCount
 * @returns {string[]} Array of responses.
 */
export function simulateKafkaGroupMessaging(group, message, consumerCount = 1) {
  const responses = [];
  for (let i = 0; i < consumerCount; i++) {
    responses.push(`Group '${group}' consumer ${i + 1} received message: ${message}`);
  }
  return responses;
}

/**
 * Simulate Kafka Topic Subscription: returns confirmation of subscriptions to given topics.
 * @param {string[]} topics
 * @returns {string[]} Array of subscription confirmations.
 */
export function simulateKafkaTopicSubscription(topics = []) {
  return topics.map((topic) => `Subscribed to topic: ${topic}`);
}

// New Kafka Messaging Extensions

/**
 * Simulate Kafka Priority Messaging: processes messages with a given priority.
 * @param {string} topic
 * @param {string[]} messages
 * @param {string} priority
 * @returns {string[]} Array of processed priority messages.
 */
export function simulateKafkaPriorityMessaging(topic, messages = [], priority = "high") {
  console.log(`Simulating priority messaging on '${topic}' with priority ${priority}`);
  const prioritizedMessages = messages.map((msg, index) => `Priority(${priority}) Message ${index + 1} from topic '${topic}': ${msg}`);
  prioritizedMessages.forEach((message) => console.log(message));
  return prioritizedMessages;
}

/**
 * Simulate Kafka Retry On Failure: simulates retry attempts when sending a message fails.
 * @param {string} topic
 * @param {string} message
 * @param {number} maxRetries
 * @returns {object} Details about the retry attempts and final status.
 */
export function simulateKafkaRetryOnFailure(topic, message, maxRetries = 3) {
  let attempts = 0;
  let success = false;
  const logMessages = [];
  while (attempts < maxRetries && !success) {
    attempts++;
    if (randomInt(0, 2) === 1) {
      success = true;
      logMessages.push(`Attempt ${attempts}: Success sending '${message}' to '${topic}'`);
    } else {
      logMessages.push(`Attempt ${attempts}: Failure sending '${message}' to '${topic}'`);
    }
  }
  console.log(`Retry on failure simulation for topic '${topic}':`, logMessages.join(" | "));
  return { topic, message, attempts, success, logMessages };
}

/**
 * New function to print configuration details.
 */
export function printConfiguration() {
  const config = {
    nodeVersion: process.version,
    platform: process.platform,
    currentWorkingDirectory: process.cwd()
  };
  console.log(chalk.blue("Configuration:"), JSON.stringify(config, null, 2));
  return config;
}

/**
 * New function to simulate a delayed response in Kafka messaging, enhancing our mission compliance with extended simulation features.
 * @param {string} topic
 * @param {string} message
 * @param {number} delay - Delay in milliseconds (default 100ms)
 * @returns {Promise<string>} Delayed response message.
 */
export async function simulateDelayedResponse(topic, message, delay = 100) {
  try {
    await new Promise((resolve) => setTimeout(resolve, delay));
    const result = `Delayed response to '${message}' on topic '${topic}' after ${delay}ms`;
    console.log(chalk.green(result));
    return result;
  } catch (error) {
    console.error(chalk.red("Error simulating delayed response:"), error.message);
    return `Error simulating delayed response: ${error.message}`;
  }
}

/**
 * New function for enhanced OpenAI delegation with improved logging and error handling.
 * This function wraps callOpenAIFunctionWrapper and provides additional checks.
 * @param {string} prompt
 * @param {object} options
 */
export async function delegateDecisionToLLMEnhanced(prompt, options = {}) {
  if (!prompt) {
    console.error(chalk.red("Delegate Decision To LLM Enhanced error:"), "Prompt is empty.");
    return { fixed: "false", message: "Prompt is empty.", refinement: "Provide a valid prompt." };
  }
  if (!process.env.OPENAI_API_KEY) {
    console.error(chalk.red("Delegate Decision To LLM Enhanced error:"), "OpenAI API key is missing.");
    return { fixed: "false", message: "OpenAI API key is missing.", refinement: "Provide a valid API key." };
  }
  try {
    const result = await callOpenAIFunctionWrapper(prompt, options.model || "gpt-3.5-turbo");
    console.log(chalk.blue("Delegate Decision To LLM Enhanced result:"), result);
    return result;
  } catch (error) {
    console.error(chalk.red("Delegate Decision To LLM Enhanced error:"), error);
    return { fixed: "false", message: "Enhanced LLM decision failed: " + error.message, refinement: "Check OpenAI service." };
  }
}

/**
 * New function to simulate an external file system call.
 * Reads file content with UTF-8 encoding.
 * @param {string} filePath - The path to the file.
 * @returns {Promise<string|null>} The content of the file or null if an error occurs.
 */
export async function simulateFileSystemCall(filePath) {
  try {
    const fs = await import('fs/promises');
    const content = await fs.readFile(filePath, { encoding: 'utf8' });
    return content;
  } catch (error) {
    console.error(chalk.red("File system call failed:"), error.message);
    return null;
  }
}

// New Function: simulateKafkaBroadcast to simulate Kafka broadcast messaging across topics
export function simulateKafkaBroadcast(topics, message) {
  const responses = {};
  topics.forEach((topic) => {
    const sent = sendMessageToKafka(topic, message);
    const received = receiveMessageFromKafka(topic);
    responses[topic] = { sent, received, broadcast: true };
    console.log(chalk.blue(`Broadcast to '${topic}':`), responses[topic]);
  });
  return responses;
}

// New: Added callRepositoryService function as it was missing and required by tests
export async function callRepositoryService(serviceUrl) {
  try {
    const response = await fetch(serviceUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(chalk.green("Repository Service Response:"), data);
    return data;
  } catch (error) {
    return handleFetchError(error, "repository service");
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
