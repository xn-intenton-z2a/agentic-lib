#!/usr/bin/env node
// src/lib/main.js - Updated to align with the agentic‑lib mission statement by pruning drift and adding enhanced telemetry functions for GitHub Actions.
// Change Log:
// - Pruned drift and removed deprecated code to strictly align with the mission statement.
// - Fixed ESLint SARIF parser to use run.results properly.
// - Extended output parsers for Vitest and ESLint with case‑insensitive improvements.
// - Enhanced flag handling and telemetry functions.
// - Added dummy implementations for printReport and printConfiguration.
// - Removed unused imports and functions for cleanup.
// - NEW: Added gatherWorkflowTelemetry() to capture additional GitHub Actions workflow telemetry data.

import { fileURLToPath } from "url";
import chalk from "chalk";
import figlet from "figlet";
import os from "os";
import { z } from "zod";
import { randomInt } from "crypto";
// Removed unused 'path' import
import { promises as fs } from "fs";

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
 * Exits the application safely.
 */
function exitApplication() {
  console.log(chalk.blue("Exiting agentic‑lib."));
  process.exit(0);
}

/**
 * Dummy implementation for printReport
 */
function printReport() {
  console.log("Report: Not implemented.");
}

/**
 * Dummy implementation for printConfiguration
 */
function printConfiguration() {
  console.log("Configuration: Not implemented.");
}

/**
 * Function to print usage information and demo.
 */
function printUsageAndDemo(flagArgs, nonFlagArgs) {
  console.log(generateUsage());
  if (nonFlagArgs.length > 0) {
    console.log("Non-flag arguments:", nonFlagArgs.join(", "));
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
 * Gather full telemetry data including additional ref variables.
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
 * New telemetry function to capture additional CI environment metrics.
 */
export function gatherCIEnvironmentMetrics() {
  return {
    githubWorkspace: process.env.GITHUB_WORKSPACE || "N/A",
    githubEventPath: process.env.GITHUB_EVENT_PATH || "N/A",
    githubPath: process.env.GITHUB_PATH || "N/A"
  };
}

/**
 * New telemetry function to collect extra telemetry data.
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
 * New function to aggregate all telemetry data.
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
 * NEW: Enhanced telemetry function to gather additional workflow-specific metrics from GitHub Actions.
 */
export function gatherWorkflowTelemetry() {
  return {
    ...gatherTotalTelemetry(),
    buildTimestamp: new Date().toISOString(),
    runnerOs: process.env.RUNNER_OS || 'unknown',
    repository: process.env.GITHUB_REPOSITORY || 'N/A'
  };
}

/**
 * Simulate a CI Workflow Lifecycle.
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
 */
export function sendMessageToKafka(topic, message) {
  const result = `Message sent to topic '${topic}': ${message}`;
  console.log(`Simulating sending message to topic '${topic}': ${message}`);
  return result;
}

/**
 * Simulate receiving a message from a Kafka topic.
 */
export function receiveMessageFromKafka(topic) {
  const simulatedMessage = `Simulated message from topic '${topic}'`;
  console.log(simulatedMessage);
  return simulatedMessage;
}

/**
 * Log Kafka operations by sending and receiving messages.
 */
export function logKafkaOperations(topic, message) {
  const sendResult = sendMessageToKafka(topic, message);
  const receiveResult = receiveMessageFromKafka(topic);
  console.log(chalk.blue("Kafka Operations:"), sendResult, receiveResult);
  return { sendResult, receiveResult };
}

/**
 * Simulate streaming Kafka messages.
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
 * Extended Kafka stream simulation with detailed logging.
 */
export function simulateKafkaDetailedStream(topic, count = 3) {
  const baseMessages = simulateKafkaStream(topic, count);
  const timestamp = new Date().toISOString();
  const messages = baseMessages.map((msg) => `${msg} (detailed at ${timestamp})`);
  messages.forEach((message) => console.log(chalk.blue(message)));
  return messages;
}

/**
 * Simulate sending a bulk stream of Kafka messages.
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
 * Simulate inter-workflow Kafka communication.
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
 * Simulate dynamic routing of Kafka messages.
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
 * Simulate a Kafka consumer group consuming messages.
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
 * Simulate full Kafka workflow messaging.
 */
export function simulateKafkaWorkflowMessaging(topics, routingKey, message, consumerGroup) {
  const routedMessages = {};
  topics.forEach((topic) => {
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
 * Simulate direct Kafka messaging.
 */
export function simulateKafkaDirectMessage(topic, message) {
  const sent = sendMessageToKafka(topic, message);
  const receipt = receiveMessageFromKafka(topic);
  console.log(chalk.blue(`Direct message to '${topic}': Sent -> ${sent}, Received -> ${receipt}`));
  return { topic, sent, receipt };
}

/**
 * Simulate rebroadcasting a Kafka message.
 */
export function simulateKafkaRebroadcast(topics, message, repeat = 2) {
  const results = {};
  topics.forEach((topic) => {
    results[topic] = [];
    for (let i = 0; i < repeat; i++) {
      const sent = sendMessageToKafka(topic, message);
      const received = receiveMessageFromKafka(topic);
      results[topic].push({ sent, received });
      console.log(chalk.blue(`Rebroadcast ${i + 1} to '${topic}': Sent -> ${sent}, Received -> ${received}`));
    }
  });
  return results;
}

/**
 * Simulate dynamic routing of Kafka messages.
 */

/**
 * Parse SARIF formatted JSON to summarize issues.
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
 * Parse Vitest default output.
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
 * Parse ESLint default output.
 */
export function parseEslintDefaultOutput(outputStr) {
  const problems = outputStr.match(/(\d+)\s+problems?/i);
  const errors = outputStr.match(/(\d+)\s+errors?/i);
  const warnings = outputStr.match(/(\d+)\s+warnings?/i);
  if (problems) {
    const numProblems = parseInt(problems[1], 10);
    const numErrors = errors ? parseInt(errors[1], 10) : 0;
    const numWarnings = warnings ? parseInt(warnings[1], 10) : 0;
    console.log(chalk.green(`ESLint Default Output: ${numProblems} problems (${numErrors} errors, ${numWarnings} warnings)`));
    return { numProblems, numErrors, numWarnings };
  } else {
    console.error(chalk.red("Error parsing ESLint default output: Summary not found."));
    return { error: "ESLint summary not found" };
  }
}

/**
 * Parse Vitest SARIF output.
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
 * Parse ESLint detailed SARIF output.
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
 * Combined SARIF output parser.
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
 * Combined Default Output Parser.
 */
export function parseCombinedDefaultOutput(vitestOutput, eslintOutput) {
  const vitestResult = parseVitestDefaultOutput(vitestOutput);
  const eslintResult = parseEslintDefaultOutput(eslintOutput);
  return { vitest: vitestResult, eslint: eslintResult };
}

/**
 * Simulate advanced analytics combining Kafka simulation and telemetry.
 */
export function simulateAdvancedAnalytics(topic, count = 3) {
  console.log(chalk.blue(`Starting advanced analytics simulation on topic '${topic}' with count ${count}`));
  const kafkaMessages = simulateKafkaStream(topic, count);
  const advancedData = gatherAdvancedTelemetryData();
  console.log(chalk.blue(`Advanced analytics data: ${JSON.stringify(advancedData, null, 2)}`));
  return { kafkaMessages, advancedData };
}

/**
 * Handle create issue command simulation.
 */
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

/**
 * Handle basic flag commands.
 */
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
 * Refactored flag handling to reduce complexity.
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
 * Main function for processing command line arguments.
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

export function getIssueNumberFromBranch(branch = "", prefix = "agentic-lib-issue-") {
  const safePrefix = escapeRegExp(prefix);
  const regex = new RegExp(safePrefix + "(\\d{1,10})(?!\\d)");
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

// NEW: Optimized LLM Chat Delegation
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
      temperature: options.temperature || 0.5,
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

// Existing LLM Chat Delegation
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
      temperature: options.temperature || 0.5,
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

// NEW: Function calling wrapper
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
    const ResponseSchema = z.object({
      fixed: z.string(),
      message: z.string(),
      refinement: z.string()
    });
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
      tools,
      temperature: options.temperature || 0.7,
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

// NEW: Advanced delegation with extra context.
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

// NEW: Premium OpenAI delegation.
export async function delegateDecisionToLLMChatPremium(prompt, options = {}) {
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
    const configuration = new Config({
      apiKey: process.env.OPENAI_API_KEY,
      basePath: process.env.OPENAI_API_BASE || "https://api.openai.com/v1",
    });
    const openai = new Api(configuration);
    const response = await openai.createChatCompletion({
      model: options.model || "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an advanced assistant evaluating if an issue is resolved in the source code. Respond strictly with a JSON following the function schema." },
        { role: "user", content: prompt }
      ],
      temperature: options.temperature || 0.5,
    });
    let result;
    if (response.data.choices && response.data.choices.length > 0) {
      const message = response.data.choices[0].message;
      try {
        result = JSON.parse(message.content);
      } catch (e) {
        result = { fixed: "false", message: "Failed to parse response content in premium version.", refinement: e.message };
      }
    } else {
      result = { fixed: "false", message: "No response from OpenAI in premium variant.", refinement: "Retry" };
    }
    return result;
  } catch (error) {
    return { fixed: "false", message: error.message, refinement: "LLM chat premium delegation failed." };
  }
}

// Simulation for issue review
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

// Simulate a delayed Kafka message
export async function simulateKafkaDelayedMessage(topic, message, delayMs) {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return { delayed: true, topic, message };
}

// Simulate a Kafka transaction
export function simulateKafkaTransaction(messagesArray) {
  const transaction = {};
  messagesArray.forEach((item) => {
    transaction[item.topic] = item.message;
  });
  return { success: true, transaction };
}

// Simulate a Kafka priority queue
export function simulateKafkaPriorityQueue(topic, messages) {
  return messages.sort((a, b) => b.priority - a.priority).map((item) => item.message);
}

// Global store for message persistence
let persistenceStore = {};

// Simulate Kafka message persistence
export function simulateKafkaMessagePersistence(topic, message) {
  if (!persistenceStore[topic]) {
    persistenceStore[topic] = [];
  }
  persistenceStore[topic].push(message);
  return { topic, persistedMessages: persistenceStore[topic] };
}

// NEW: Simulate multicast messaging.
export function simulateKafkaMulticast(topics, message, multicastOptions = {}) {
  const results = {};
  const delay = multicastOptions.delay || 0;
  topics.forEach((topic) => {
    let finalMessage = message;
    if (delay > 0) {
      finalMessage += ` (delayed by ${delay}ms)`;
    }
    results[topic] = { multicast: finalMessage };
    console.log(chalk.blue(`Multicast to '${topic}': ${finalMessage}`));
  });
  return results;
}

// Simulate file system call
export async function simulateFileSystemCall(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Simulate repository service call
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
    return { error: error.message };
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
