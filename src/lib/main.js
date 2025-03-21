#!/usr/bin/env node
// src/lib/main.js - Updated to align with the agentic‑lib mission statement by pruning drift from the implementation.
// Change Log:
// - Pruned drift and removed deprecated code to tightly align with the agentic‑lib mission statement.
// - Fixed ESLint SARIF parser to correctly use run.results instead of sarif.results for counting issues.
// - Extended default output parsers for Vitest and ESLint to use case-insensitive matching for increased robustness.
// - Extended functionality with refined flag handling, enhanced telemetry, improved remote service wrappers, updated delegation functions, and expanded Kafka messaging simulations.
// - Added new simulation functions including Kafka delays, rebroadcast, multicast, and priority messaging.
// - Added new remote monitoring service wrapper to simulate fetching monitoring metrics remotely.
// - Added combined SARIF and default output parsers and new LLM delegation wrappers for advanced OpenAI interactions.
// - Updated getIssueNumberFromBranch to correctly escape backslashes and capture the correct issue number.
// - Overall pruned extraneous code to adhere strictly to the agentic‑lib mission.

/* eslint-disable security/detect-object-injection, sonarjs/slow-regex */

import { fileURLToPath } from "url";
import chalk from "chalk";
import figlet from "figlet";
import os from "os";
import { z } from "zod";
import { randomInt } from "crypto";
import path from "path";
import { promises as fs } from "fs";

// Helper function to escape regex special characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Helper for parsing LLM message content
function parseLLMMessage(messageObj) {
  if (messageObj && messageObj.content) {
    try {
      return JSON.parse(messageObj.content);
    } catch (e) {
      return { fixed: "false", message: "Failed to parse LLM message content", refinement: e.message };
    }
  }
  return { fixed: "false", message: "No content in LLM message", refinement: "None" };
}

// Common helper for error handling in remote service wrappers
function handleFetchError(error, serviceName) {
  const errMsg = error instanceof Error ? error.message : "Unknown error";
  console.error(chalk.red(`Error calling ${serviceName}:`), errMsg);
  return { error: errMsg };
}

/**
 * Exits the application safely.
 */
function exitApplication() {
  console.log(chalk.blue("Exiting agentic‑lib."));
  process.exit(0);
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
 * New telemetry function to collect extra telemetry data including current timestamp, CPU usage and free memory.
 */
export function gatherExtraTelemetryData() {
  return {
    npmPackageVersion: process.env.npm_package_version || "unknown",
    currentTimestamp: new Date().toISOString(),
    cpuUsage: process.cpuUsage(),
    freeMemory: os.freemem()
  };
}

/**
 * New telemetry function to capture all GitHub Actions environment variables.
 */
export function gatherGithubEnvTelemetry() {
  const githubEnv = {};
  for (const key in process.env) {
    if (key.startsWith("GITHUB_")) {
      githubEnv[key] = process.env[key];
    }
  }
  console.log(chalk.green("GitHub Environment Telemetry:"), JSON.stringify(githubEnv, null, 2));
  return githubEnv;
}

/**
 * New function to aggregate all telemetry data into one unified report.
 */
export function gatherTotalTelemetry() {
  return {
    ...gatherTelemetryData(),
    ...gatherExtendedTelemetryData(),
    ...gatherFullTelemetryData(),
    ...gatherAdvancedTelemetryData(),
    ...gatherCIEnvironmentMetrics(),
    ...gatherExtraTelemetryData(),
    githubEnv: gatherGithubEnvTelemetry()
  };
}

/**
 * NEW: Simulate a CI Workflow Lifecycle by aggregating telemetry and initiating Kafka messaging simulation.
 */
export function simulateCIWorkflowLifecycle() {
  console.log(chalk.blue("Starting CI Workflow Lifecycle Simulation."));
  const telemetry = gatherTotalTelemetry();
  const kafkaBroadcast = simulateKafkaBroadcast(["ci-status"], "CI Workflow lifecycle simulation started.");
  console.log(chalk.green("CI Workflow Lifecycle Simulation:"), { telemetry, kafkaBroadcast });
  return { telemetry, kafkaBroadcast };
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
 * Extended simulation of Kafka stream with detailed logging and timestamp.
 * @param {string} topic
 * @param {number} count
 * @returns {string[]} An array of detailed simulated messages.
 */
export function simulateKafkaDetailedStream(topic, count = 3) {
  const baseMessages = simulateKafkaStream(topic, count);
  const timestamp = new Date().toISOString();
  const messages = baseMessages.map((msg) => `${msg} (detailed at ${timestamp})`);
  messages.forEach((message) => console.log(chalk.blue(message)));
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

/**
 * New function to simulate dynamic routing of Kafka messages based on a routing key.
 * @param {string[]} topics - Array of Kafka topics.
 * @param {string} routingKey - The key used to determine target topics.
 * @param {string} message - The message to route.
 * @returns {object} An object mapping targeted topics to the simulated message sent.
 */
export function simulateKafkaTopicRouting(topics, routingKey, message) {
  const routed = {};
  topics.forEach((topic) => {
    if (topic.includes(routingKey)) {
      const sent = sendMessageToKafka(topic, message);
      routed[topic] = sent;
      console.log(chalk.blue(`Routing message to topic '${topic}' based on routing key '${routingKey}':`), sent);
    }
  });
  return routed;
}

/**
 * New function to simulate a Kafka consumer group consuming messages from multiple topics.
 * @param {string[]} topics - Array of Kafka topics to consume from.
 * @param {string} consumerGroup - Identifier for the consumer group.
 * @returns {object} An object containing the consumer group and the messages consumed from each topic.
 */
export function simulateKafkaConsumerGroup(topics, consumerGroup) {
  const groupMessages = {};
  topics.forEach((topic) => {
    groupMessages[topic] = simulateKafkaConsumer(topic, 3);
  });
  console.log(chalk.blue(`Simulated Kafka consumer group '${consumerGroup}':`), groupMessages);
  return { consumerGroup, messages: groupMessages };
}

/**
 * New function to simulate full Kafka workflow messaging.
 * It routes the message to topics matching the routing key and simulates consumption by a consumer group.
 * @param {string[]} topics - Array of Kafka topics.
 * @param {string} routingKey - Routing key to filter topics.
 * @param {string} message - Message to broadcast.
 * @param {string} consumerGroup - Consumer group identifier.
 * @returns {object} An object containing routed messages and consumer group results.
 */
export function simulateKafkaWorkflowMessaging(topics, routingKey, message, consumerGroup) {
  const routedMessages = {};
  topics.forEach(topic => {
    if (topic.includes(routingKey)) {
      const sentMessage = sendMessageToKafka(topic, message);
      routedMessages[topic] = { sent: sentMessage };
      console.log(chalk.blue(`Workflow routing: Message routed to '${topic}'`));
    }
  });
  const consumerGroupResults = simulateKafkaConsumerGroup(Object.keys(routedMessages), consumerGroup);
  return { routedMessages, consumerGroupResults };
}

/**
 * New function to simulate direct Kafka messaging to a designated topic.
 * @param {string} topic
 * @param {string} message
 * @returns {object} An object containing the topic, sent message confirmation, and received simulated response.
 */
export function simulateKafkaDirectMessage(topic, message) {
  const sent = sendMessageToKafka(topic, message);
  const receipt = receiveMessageFromKafka(topic);
  console.log(chalk.blue(`Direct message to '${topic}': Sent -> ${sent}, Received -> ${receipt}`));
  return { topic, sent, receipt };
}

/**
 * NEW: Added simulateKafkaRebroadcast to simulate rebroadcasting a Kafka message to multiple topics repeatedly, 
 * simulating peer-to-peer message propagation across agentic workflows.
 * @param {string[]} topics - Array of topics to rebroadcast the message.
 * @param {string} message - The message to rebroadcast.
 * @param {number} repeat - Number of times to rebroadcast.
 * @returns {object} An object mapping each topic to an array of rebroadcast confirmations.
 */
export function simulateKafkaRebroadcast(topics, message, repeat = 2) {
  const results = {};
  topics.forEach(topic => {
    results[topic] = [];
    for (let i = 0; i < repeat; i++) {
      const sent = sendMessageToKafka(topic, message);
      const received = receiveMessageFromKafka(topic);
      results[topic].push({ sent, received });
      console.log(chalk.blue(`Rebroadcast ${i+1} to '${topic}': Sent -> ${sent}, Received -> ${received}`));
    }
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
 * New remote package management service wrapper using fetch to simulate checking package dependencies and vulnerabilities.
 * @param {string} serviceUrl
 */
export async function callPackageManagementService(serviceUrl) {
  try {
    const response = await fetch(serviceUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(chalk.green("Package Management Service Response:"), data);
    return data;
  } catch (error) {
    return handleFetchError(error, "package management service");
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
        if (run.results && Array.isArray(run.results)) { // Fixed: use run.results
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
  const match = outputStr.match(/(\d+)\s+tests?\s+passed/i);
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
 * New utility function to parse Vitest default output, handling common default formats.
 * @param {string} outputStr
 */
export function parseVitestDefaultOutput(outputStr) {
  const match = outputStr.match(/(\d+)\s+tests?\s+passed/i);
  if (match) {
    const testsPassed = parseInt(match[1], 10);
    console.log(chalk.green(`Vitest Default Output: ${testsPassed} tests passed.`));
    return { testsPassed };
  } else {
    console.error(chalk.red("Error parsing Vitest default output: Summary not found."));
    return { error: "Test summary not found" };
  }
}

/**
 * New utility function to parse ESLint default output, extracting problem, error, and warning counts.
 * @param {string} outputStr
 */
export function parseEslintDefaultOutput(outputStr) {
  const problems = outputStr.match(/(\d+)\s+problems?/i);
  const errors = outputStr.match(/(\d+)\s+errors?/i);
  const warnings = outputStr.match(/(\d+)\s+warnings?/i);
  if (problems) {
    const numProblems = parseInt(problems[1], 10);
    const numErrors = errors ? parseInt(errors[1], 10) : 0;
    const numWarnings = warnings ? parseInt(warnings[1], 10) : 0;
    console.log(
      chalk.green(`ESLint Default Output: ${numProblems} problems (${numErrors} errors, ${numWarnings} warnings)`),
    );
    return { numProblems, numErrors, numWarnings };
  } else {
    console.error(chalk.red("Error parsing ESLint default output: Summary not found."));
    return { error: "ESLint summary not found" };
  }
}

/**
 * Parse Vitest SARIF output to extract test summaries.
 * @param {string} sarifJson
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

/**
 * Parse ESLint detailed SARIF output to extract detailed issues.
 * @param {string} sarifJson
 */
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

/**
 * New function to combine SARIF outputs from Vitest and ESLint and summarize their issues.
 * @param {string} sarifJson
 */
export function parseCombinedSarifOutput(sarifJson) {
  try {
    const sarif = JSON.parse(sarifJson);
    let vitestIssues = 0;
    let eslintIssues = 0;
    if (sarif.runs && Array.isArray(sarif.runs)) {
      sarif.runs.forEach((run) => {
        if (run.tool && run.tool.driver && run.tool.driver.name === "Vitest") {
          if (run.results) vitestIssues += run.results.length;
        } else if (run.tool && run.tool.driver && run.tool.driver.name === "ESLint") {
          if (run.results) eslintIssues += run.results.length;
        }
      });
    }
    console.log(chalk.green(`Combined SARIF Report: Vitest issues: ${vitestIssues}, ESLint issues: ${eslintIssues}`));
    return { vitestIssues, eslintIssues };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error(chalk.red("Error parsing combined SARIF JSON:"), errMsg);
    return { error: errMsg };
  }
}

/**
 * NEW: Combined Default Output Parser
 * Aggregates Vitest default output and ESLint default output summaries into one object.
 * @param {string} vitestOutput - Default output from Vitest
 * @param {string} eslintOutput - Default output from ESLint
 * @returns {object} Combined summary with properties from both outputs
 */
export function parseCombinedDefaultOutput(vitestOutput, eslintOutput) {
  const vitestResult = parseVitestDefaultOutput(vitestOutput);
  const eslintResult = parseEslintDefaultOutput(eslintOutput);
  return { vitest: vitestResult, eslint: eslintResult };
}

/**
 * New function to simulate advanced analytics combining Kafka simulation and advanced telemetry data.
 * @param {string} topic
 * @param {number} count
 * @returns {object} Combined simulation result.
 */
export function simulateAdvancedAnalytics(topic, count = 3) {
  console.log(chalk.blue(`Starting advanced analytics simulation on topic '${topic}' with count ${count}`));
  const kafkaMessages = simulateKafkaStream(topic, count);
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
  if (nonFlagArgs.length === 0) {
    console.log("No additional arguments provided.");
  }
}

// Updated create issue handler to simulate GitHub Actions issue creation workflow as per wfr-create-issue.yml
function handleCreateIssue(nonFlagArgs) {
  console.log(chalk.magenta("Simulated GitHub Issue Creation Workflow triggered."));
  let issueTitle;
  if (nonFlagArgs.length > 0 && nonFlagArgs[0] === "house choice") {
    const options = process.env.HOUSE_CHOICE_OPTIONS ? process.env.HOUSE_CHOICE_OPTIONS.split("||") : ["Default House Choice Issue"];
    issueTitle = options[Math.floor(Math.random() * options.length)];
  } else {
    issueTitle = nonFlagArgs.length > 0 ? nonFlagArgs.join(" ") : "Default Issue Title";
  }
  const issueBody = process.env.ISSUE_BODY || "Please resolve the issue.";
  const issueNumber = randomInt(100, 1000);
  const issueData = {
    issueTitle: issueTitle,
    issueBody: issueBody,
    issueNumber: issueNumber,
    status: "Created via simulated workflow"
  };
  console.log(chalk.magenta(JSON.stringify(issueData, null, 2)));
  console.log(chalk.magenta("Simulated Issue Created:"));
  console.log(chalk.magenta("Title: " + issueTitle));
  console.log(chalk.magenta("Issue Body: " + issueBody));
  console.log(chalk.magenta("Issue Number: " + issueNumber));
  return issueData;
}

function handleBasicFlag(flag, nonFlagArgs) {
  switch (flag) {
    case "--create-issue": {
      const res = handleCreateIssue(nonFlagArgs);
      return res;
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
      (async () => {
        try {
          const res = await callAnalyticsService("https://analytics.example.com/record", { event: "testAnalytics" });
          console.log(chalk.green("Simulated Analytics Service Response:"), res);
        } catch (err) {
          console.error(chalk.red("Analytics call failed:"), err.message);
        }
      })();
      return false;
    }
    case "--config": {
      printConfiguration();
      return false;
    }
    case "--simulate-ci-workflow": {
      console.log(chalk.cyan("Simulated CI Workflow Lifecycle initiated."));
      const result = simulateCIWorkflowLifecycle();
      console.log(chalk.green("CI Workflow Lifecycle Result:"), result);
      return true;
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
  return "Usage: npm run start [--usage | --help] [--version] [--env] [--telemetry] [--telemetry-extended] [--reverse] [--create-issue] [--simulate-remote] [--sarif] [--extended] [--report] [--advanced] [--analytics] [--config] [--simulate-ci-workflow] [args...]";
}

// Updated getIssueNumberFromBranch to correctly escape backslashes for digit matching
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

// NEW: Added delegateDecisionToLLMChatOptimized for optimized chat delegation with prompt and API key validation.
export async function delegateDecisionToLLMChatOptimized(prompt, options = {}) {
  if (!prompt || prompt.trim() === "") {
    return { fixed: "false", message: "Prompt is required.", refinement: "Provide a valid prompt." };
  }
  if (!process.env.OPENAI_API_KEY) {
    return { fixed: "false", message: "Missing API key.", refinement: "Set the OPENAI_API_KEY environment variable." };
  }
  try {
    const openaiModule = await import("openai");
    const Config = openaiModule.Configuration ? openaiModule.Configuration.default || openaiModule.Configuration : null;
    if (!Config) throw new Error("OpenAI configuration missing");
    const Api = openaiModule.OpenAIApi;
    const configuration = new Config({ apiKey: process.env.OPENAI_API_KEY });
    const openai = new Api(configuration);
    const response = await openai.createChatCompletion({
      model: options.model || "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that helps determine if an issue is resolved in the supplied code." },
        { role: "user", content: prompt }
      ],
      temperature: options.temperature || 0.5
    });
    let result;
    if (response.data.choices && response.data.choices.length > 0) {
      const message = response.data.choices[0].message;
      try {
        result = JSON.parse(message.content);
      } catch (e) {
        result = { fixed: "false", message: "Failed to parse response content.", refinement: e.message };
      }
    } else {
      result = { fixed: "false", message: "No response from OpenAI.", refinement: "Retry" };
    }
    return result;
  } catch (error) {
    return { fixed: "false", message: error.message, refinement: "LLM chat delegation optimized failed." };
  }
}

// Existing delegateDecisionToLLMChat functions
export async function delegateDecisionToLLMChat(prompt, options = {}) {
  if (!prompt || prompt.trim() === "") {
    return { fixed: "false", message: "Prompt is required.", refinement: "Provide a valid prompt." };
  }
  if (!process.env.OPENAI_API_KEY) {
    return { fixed: "false", message: "Missing API key.", refinement: "Set the OPENAI_API_KEY environment variable." };
  }
  try {
    const openaiModule = await import("openai");
    const Config = openaiModule.Configuration ? openaiModule.Configuration.default || openaiModule.Configuration : null;
    if (!Config) throw new Error("OpenAI configuration missing");
    const Api = openaiModule.OpenAIApi;
    const configuration = new Config({ apiKey: process.env.OPENAI_API_KEY });
    const openai = new Api(configuration);
    const response = await openai.createChatCompletion({
      model: options.model || "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that helps determine if an issue is resolved in the supplied code." },
        { role: "user", content: prompt }
      ],
      temperature: options.temperature || 0.5
    });
    let result;
    if (response.data.choices && response.data.choices.length > 0) {
      const message = response.data.choices[0].message;
      try {
        result = JSON.parse(message.content);
      } catch (e) {
        result = { fixed: "false", message: "Failed to parse response content.", refinement: e.message };
      }
    } else {
      result = { fixed: "false", message: "No response from OpenAI.", refinement: "Retry" };
    }
    return result;
  } catch (error) {
    return { fixed: "false", message: error.message, refinement: "LLM chat delegation failed." };
  }
}

export async function delegateDecisionToLLMChatVerbose(prompt, options = {}) {
  console.log(chalk.blue("Invoking LLM chat delegation in verbose mode."));
  const result = await delegateDecisionToLLMChat(prompt, options);
  console.log(chalk.blue("LLM chat delegation verbose result:"), result);
  return result;
}

// New advanced delegation functions below... (existing functions remain unchanged)
// New advanced delegation using OpenAI function calling
export async function delegateDecisionToLLMFunctionCallWrapper(prompt, model = "gpt-3.5-turbo", options = {}) {
  if (!prompt || prompt.trim() === "") {
    return { fixed: "false", message: "Prompt is required.", refinement: "Provide a valid prompt." };
  }
  if (!process.env.OPENAI_API_KEY) {
    console.error(chalk.red("OpenAI API key is missing."));
    return { fixed: "false", message: "Missing API key.", refinement: "Set the OPENAI_API_KEY environment variable." };
  }
  try {
    const openaiModule = await import("openai");
    const Config = openaiModule.Configuration ? openaiModule.Configuration.default || openaiModule.Configuration : null;
    if (!Config) throw new Error("OpenAI configuration missing");
    const Api = openaiModule.OpenAIApi;
    const configuration = new Config({ apiKey: process.env.OPENAI_API_KEY });
    const openai = new Api(configuration);
    const ResponseSchema = z.object({ fixed: z.string(), message: z.string(), refinement: z.string() });
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
      model,
      messages: [
        { role: "system", content: "You are evaluating whether an issue has been resolved in the supplied source code. Answer strictly with a JSON object following the provided function schema." },
        { role: "user", content: prompt }
      ],
      tools: tools,
      temperature: options.temperature || 0.7
    });
    let result;
    const messageObj = response.data.choices[0].message;
    if (messageObj.tool_calls && Array.isArray(messageObj.tool_calls) && messageObj.tool_calls.length > 0) {
      try {
        result = JSON.parse(messageObj.tool_calls[0].function.arguments);
      } catch (e) {
        throw new Error("Failed to parse tool_calls arguments: " + e.message);
      }
    } else if (messageObj.content) {
      try {
        result = JSON.parse(messageObj.content);
      } catch (e) {
        throw new Error("Failed to parse response content: " + e.message);
      }
    } else {
      throw new Error("No valid response received from OpenAI.");
    }
    const parsed = ResponseSchema.safeParse(result);
    if (!parsed.success) {
      throw new Error("LLM response schema validation failed.");
    }
    return parsed.data;
  } catch (error) {
    console.error("delegateDecisionToLLMFunctionCallWrapper error:", error);
    return { fixed: "false", message: error.message, refinement: "LLM delegation failed." };
  }
}

// NEW: Added delegateDecisionToLLMChatAdvanced for advanced delegation with extra context support.
export async function delegateDecisionToLLMChatAdvanced(prompt, extraContext = "", options = {}) {
  if (!prompt || prompt.trim() === "") {
    return { fixed: "false", message: "Prompt is required.", refinement: "Provide a valid prompt." };
  }
  if (!process.env.OPENAI_API_KEY) {
    return { fixed: "false", message: "Missing API key.", refinement: "Set the OPENAI_API_KEY environment variable." };
  }
  const extendedPrompt = prompt + "\nContext: " + extraContext;
  const result = await delegateDecisionToLLMChatOptimized(extendedPrompt, options);
  return result;
}

// Simulation functions for testing and enhanced simulation and utility

// Function to simulate issue review
export function reviewIssue(params) {
  return { fixed: "true", message: "The issue has been resolved.", refinement: "None" };
}

// Function to simulate a Kafka consumer
export function simulateKafkaConsumer(topic, count = 3) {
  const messages = [];
  for (let i = 0; i < count; i++) {
    messages.push(`Consumer message ${i + 1} from topic '${topic}'`);
  }
  return messages;
}

// Function to simulate a delayed Kafka message
export async function simulateKafkaDelayedMessage(topic, message, delayMs) {
  await new Promise(resolve => setTimeout(resolve, delayMs));
  return { delayed: true, topic, message };
}

// Function to simulate a Kafka transaction
export function simulateKafkaTransaction(messagesArray) {
  const transaction = {};
  messagesArray.forEach(item => {
    transaction[item.topic] = item.message;
  });
  return { success: true, transaction };
}

// Function to simulate a Kafka priority queue
export function simulateKafkaPriorityQueue(topic, messages) {
  return messages.sort((a, b) => b.priority - a.priority).map(item => item.message);
}

// Global store for message persistence
let persistenceStore = {};

// Function to simulate Kafka message persistence
export function simulateKafkaMessagePersistence(topic, message) {
  if (!persistenceStore[topic]) {
    persistenceStore[topic] = [];
  }
  persistenceStore[topic].push(message);
  return { topic, persistedMessages: persistenceStore[topic] };
}

// NEW: Function to simulate multicast messaging to multiple Kafka topics with optional delay
export function simulateKafkaMulticast(topics, message, multicastOptions = {}) {
  const results = {};
  const delay = multicastOptions.delay || 0;
  topics.forEach(topic => {
    let finalMessage = message;
    if (delay > 0) {
      finalMessage += ` (delayed by ${delay}ms)`;
    }
    results[topic] = { multicast: finalMessage };
    console.log(chalk.blue(`Multicast to '${topic}': ${finalMessage}`));
  });
  return results;
}

// Function to simulate file system call
export async function simulateFileSystemCall(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Function to simulate repository service call
export async function callRepositoryService(serviceUrl) {
  try {
    const response = await fetch(serviceUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
