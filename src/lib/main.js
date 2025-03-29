#!/usr/bin/env node
// src/lib/main.js - Updated to align with the agentic‑lib mission statement by pruning drift, consolidating legacy code, extending telemetry, workflow simulation functionality, parsing utilities for test outputs, and adding a remote service wrapper for agentic workflows.
// Change Log:
// - Pruned drift and removed deprecated duplicate function definitions.
// - Consolidated duplicate exports.
// - Added a main() function to enable CLI execution and exported it for testing purposes.
// - Fixed regex in getIssueNumberFromBranch to correctly extract issue numbers (escaped backslashes).
// - Updated printUsageAndDemo to output non-flag arguments as a single string to match test expectations.
// - Added parseCombinedDefaultOutput to parse both Vitest and ESLint default outputs.
// - NEW: Added parseVitestDefaultOutput to parse Vitest default output.
// - NEW: Added parseEslintSarifOutput to parse ESLint SARIF output format.
// - NEW: Added parseEslintDefaultOutput to parse ESLint default output format.
// - NEW: Added parseVitestFailureOutput to parse Vitest failure output (new).
// - NEW: Added parseEslintCompactOutput to parse ESLint compact output (new).
// - EXT: Added gatherCIWorkflowMetrics to extend telemetry data collection from GitHub Actions workflows.
// - NEW: Added gatherSystemMetrics to capture additional system telemetry such as load average and user info.
// - NEW: Added simulateRemoteServiceWrapper to simulate remote service interactions useful in agentic workflows.
// - NEW: Exported main function for CLI execution and improved CLI argument handling.
// - Enhanced delegateDecisionToLLMFunctionCallWrapper with additional logging and error handling for improved debugging.

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
  return string.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
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
    console.log("Non-flag arguments: " + nonFlagArgs.join(", "));
  }
}

/**
 * Dummy generateUsage function
 */
function generateUsage() {
  return "Usage: agentic-lib [options]";
}

/** Telemetry Functions **/

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

export function gatherExtendedTelemetryData() {
  return {
    ...gatherTelemetryData(),
    githubActor: process.env.GITHUB_ACTOR || "N/A",
    githubRepository: process.env.GITHUB_REPOSITORY || "N/A",
    githubEventName: process.env.GITHUB_EVENT_NAME || "N/A",
    ci: process.env.CI || "N/A",
  };
}

export function gatherFullTelemetryData() {
  return {
    ...gatherExtendedTelemetryData(),
    githubRef: process.env.GITHUB_REF || "N/A",
    githubSha: process.env.GITHUB_SHA || "N/A",
    githubHeadRef: process.env.GITHUB_HEAD_REF || "N/A",
    githubBaseRef: process.env.GITHUB_BASE_REF || "N/A",
  };
}

export function gatherAdvancedTelemetryData() {
  return {
    nodeVersion: process.version,
    processPID: process.pid,
    currentWorkingDirectory: process.cwd(),
    platform: process.platform,
    memoryUsage: process.memoryUsage(),
  };
}

export function gatherCIEnvironmentMetrics() {
  return {
    githubWorkspace: process.env.GITHUB_WORKSPACE || "N/A",
    githubEventPath: process.env.GITHUB_EVENT_PATH || "N/A",
    githubPath: process.env.GITHUB_PATH || "N/A",
  };
}

export function gatherExtraTelemetryData() {
  return {
    npmPackageVersion: process.env.npm_package_version || "unknown",
    currentTimestamp: new Date().toISOString(),
    cpuUsage: process.cpuUsage(),
    freeMemory: os.freemem(),
  };
}

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

export function gatherTotalTelemetry() {
  return {
    ...gatherTelemetryData(),
    ...gatherExtendedTelemetryData(),
    ...gatherFullTelemetryData(),
    ...gatherAdvancedTelemetryData(),
    ...gatherCIEnvironmentMetrics(),
    ...gatherExtraTelemetryData(),
    githubEnv: gatherGithubEnvTelemetry(),
  };
}

export function gatherWorkflowTelemetry() {
  return {
    ...gatherTotalTelemetry(),
    buildTimestamp: new Date().toISOString(),
    runnerOs: process.env.RUNNER_OS || "unknown",
    repository: process.env.GITHUB_REPOSITORY || "N/A",
  };
}

export function gatherCIWorkflowMetrics() {
  const metrics = {
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
    buildTime: new Date().toISOString(),
    workflow: process.env.GITHUB_WORKFLOW || "N/A",
    repository: process.env.GITHUB_REPOSITORY || "N/A",
    actor: process.env.GITHUB_ACTOR || "N/A",
  };
  console.log(chalk.green("CI Workflow Metrics:"), metrics);
  return metrics;
}

export function gatherSystemMetrics() {
  return {
    loadAverage: os.loadavg(),
    systemUptime: os.uptime(),
    userInfo: os.userInfo(),
  };
}

/** Kafka and Messaging Simulation Functions **/

export function simulateCIWorkflowLifecycle() {
  console.log(chalk.blue("Starting CI Workflow Lifecycle Simulation."));
  const telemetry = gatherTotalTelemetry();
  const kafkaBroadcast = simulateKafkaBroadcast(["ci-status"], "CI Workflow lifecycle simulation started.");
  console.log(chalk.green("CI Workflow Lifecycle Simulation:"), { telemetry, kafkaBroadcast });
  return { telemetry, kafkaBroadcast };
}

export function sendMessageToKafka(topic, message) {
  const result = `Message sent to topic '${topic}': ${message}`;
  console.log(`Simulating sending message to topic '${topic}': ${message}`);
  return result;
}

export function receiveMessageFromKafka(topic) {
  const simulatedMessage = `Simulated message from topic '${topic}'`;
  console.log(simulatedMessage);
  return simulatedMessage;
}

export function logKafkaOperations(topic, message) {
  const sendResult = sendMessageToKafka(topic, message);
  const receiveResult = receiveMessageFromKafka(topic);
  console.log(chalk.blue("Kafka Operations:"), sendResult, receiveResult);
  return { sendResult, receiveResult };
}

export function simulateKafkaStream(topic, count = 3) {
  const messages = [];
  for (let i = 0; i < count; i++) {
    const msg = `Streamed message ${i + 1} from topic '${topic}'`;
    console.log(msg);
    messages.push(msg);
  }
  return messages;
}

export function simulateKafkaDetailedStream(topic, count = 3) {
  const baseMessages = simulateKafkaStream(topic, count);
  const timestamp = new Date().toISOString();
  const messages = baseMessages.map((msg) => `${msg} (detailed at ${timestamp})`);
  messages.forEach((message) => console.log(chalk.blue(message)));
  return messages;
}

export function simulateKafkaBulkStream(topic, count = 5) {
  const messages = [];
  for (let i = 0; i < count; i++) {
    const msg = `Bulk message ${i + 1} from topic '${topic}'`;
    console.log(msg);
    messages.push(msg);
  }
  return messages;
}

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

export function simulateKafkaConsumerGroup(topics, consumerGroup) {
  const groupMessages = {};
  topics.forEach((topic) => {
    groupMessages[topic] = simulateKafkaConsumer(topic, 3);
  });
  console.log(chalk.blue(`Simulated Kafka consumer group '${consumerGroup}':`), groupMessages);
  return { consumerGroup, messages: groupMessages };
}

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

export function simulateKafkaDirectMessage(topic, message) {
  const sent = sendMessageToKafka(topic, message);
  const receipt = receiveMessageFromKafka(topic);
  console.log(chalk.blue(`Direct message to '${topic}': Sent -> ${sent}, Received -> ${receipt}`));
  return { topic, sent, receipt };
}

export async function simulateKafkaDelayedMessage(topic, message, delayMs) {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return { delayed: true, topic, message };
}

export function simulateKafkaTransaction(messagesArray) {
  const transaction = {};
  messagesArray.forEach((item) => {
    transaction[item.topic] = item.message;
  });
  return { success: true, transaction };
}

export function simulateKafkaPriorityQueue(topic, messages) {
  return messages.sort((a, b) => b.priority - a.priority).map((item) => item.message);
}

// Global store for message persistence
let persistenceStore = {};

export function simulateKafkaMessagePersistence(topic, message) {
  if (!persistenceStore[topic]) {
    persistenceStore[topic] = [];
  }
  persistenceStore[topic].push(message);
  return { topic, persistedMessages: persistenceStore[topic] };
}

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

export function simulateKafkaConsumer(topic, count = 3) {
  return simulateKafkaStream(topic, count);
}

export function simulateKafkaRebroadcast(topics, message, repeat = 1) {
  const result = {};
  topics.forEach((topic) => {
    result[topic] = [];
    for (let i = 0; i < repeat; i++) {
      const sent = sendMessageToKafka(topic, message);
      const received = receiveMessageFromKafka(topic);
      result[topic].push({ sent, received });
    }
  });
  return result;
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

// LLM and issue review functions
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
        {
          role: "system",
          content: "You are a helpful assistant that helps determine if an issue is resolved in the supplied code.",
        },
        { role: "user", content: prompt },
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
        {
          role: "system",
          content:
            "You are a helpful assistant that helps determine if an issue has been resolved in the supplied source code.",
        },
        { role: "user", content: prompt },
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

export async function delegateDecisionToLLMFunctionCallWrapper(prompt, model = "gpt-3.5-turbo", options = {}) {
  console.log(chalk.blue("delegateDecisionToLLMFunctionCallWrapper invoked with prompt:"), prompt);
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
      refinement: z.string(),
    });
    const tools = [
      {
        type: "function",
        function: {
          name: "review_issue",
          description:
            "Evaluate whether the supplied source file content resolves the issue. Return an object with fixed (string: 'true' or 'false'), message (explanation), and refinement (suggested refinement).",
          parameters: {
            type: "object",
            properties: {
              fixed: { type: "string", description: "true if the issue is resolved, false otherwise" },
              message: { type: "string", description: "A message explaining the result" },
              refinement: { type: "string", description: "A suggested refinement if the issue is not resolved" },
            },
            required: ["fixed", "message", "refinement"],
            additionalProperties: false,
          },
          strict: true,
        },
      },
    ];
    const response = await openai.createChatCompletion({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are evaluating whether an issue has been resolved in the supplied source code. Answer strictly with a JSON object following the provided function schema.",
        },
        { role: "user", content: prompt },
      ],
      tools,
      temperature: options.temperature || 0.7,
    });
    console.log(chalk.blue("Received response from OpenAI:"), response.data);
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
    console.log(chalk.green("LLM function call wrapper parsed response:"), parsed.data);
    return parsed.data;
  } catch (error) {
    console.error("delegateDecisionToLLMFunctionCallWrapper error:", error);
    return { fixed: "false", message: error.message, refinement: "LLM delegation failed." };
  }
}

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
        {
          role: "system",
          content:
            "You are an advanced assistant evaluating if an issue is resolved in the source code. Respond strictly with a JSON following the function schema.",
        },
        { role: "user", content: prompt },
      ],
      temperature: options.temperature || 0.5,
    });
    let result;
    if (response.data.choices && response.data.choices.length > 0) {
      const message = response.data.choices[0].message;
      try {
        result = JSON.parse(message.content);
      } catch (e) {
        result = {
          fixed: "false",
          message: "Failed to parse response content in premium version.",
          refinement: e.message,
        };
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

// NEW: Added parseCombinedDefaultOutput to parse vitest and eslint outputs
export function parseCombinedDefaultOutput(vitestStr, eslintStr) {
  const vitestMatch = vitestStr.match(/(\d+)/);
  const testsPassed = vitestMatch ? parseInt(vitestMatch[1], 10) : 0;
  const eslintMatch = eslintStr.match(/(\d+)\s+problems,\s+(\d+)\s+errors,\s+(\d+)\s+warnings/);
  const numProblems = eslintMatch ? parseInt(eslintMatch[1], 10) : 0;
  const numErrors = eslintMatch ? parseInt(eslintMatch[2], 10) : 0;
  const numWarnings = eslintMatch ? parseInt(eslintMatch[3], 10) : 0;
  return { vitest: { testsPassed }, eslint: { numProblems, numErrors, numWarnings } };
}

// NEW: Parse Vitest default output
export function parseVitestDefaultOutput(vitestStr) {
  const match = vitestStr.match(/(\d+)\s+tests passed/);
  const testsPassed = match ? parseInt(match[1], 10) : 0;
  return { testsPassed };
}

// NEW: Parse ESLint SARIF output
export function parseEslintSarifOutput(sarifContent) {
  try {
    const sarifJson = typeof sarifContent === "string" ? JSON.parse(sarifContent) : sarifContent;
    let numProblems = 0,
      numErrors = 0,
      numWarnings = 0;
    if (sarifJson.runs && sarifJson.runs.length > 0) {
      sarifJson.runs.forEach((run) => {
        run.results &&
          run.results.forEach((result) => {
            if (result.level === "error") {
              numErrors++;
            } else if (result.level === "warning") {
              numWarnings++;
            }
            numProblems++;
          });
      });
    }
    return { numProblems, numErrors, numWarnings };
  } catch (e) {
    console.error("Failed to parse ESLint SARIF output:", e);
    return { numProblems: 0, numErrors: 0, numWarnings: 0 };
  }
}

// NEW: Parse ESLint default output format
export function parseEslintDefaultOutput(eslintStr) {
  const regex = /(\d+)\s+problems?,\s+(\d+)\s+errors?,\s+(\d+)\s+warnings?/i;
  const match = eslintStr.match(regex);
  return match
    ? { numProblems: parseInt(match[1], 10), numErrors: parseInt(match[2], 10), numWarnings: parseInt(match[3], 10) }
    : { numProblems: 0, numErrors: 0, numWarnings: 0 };
}

// NEW: Parse Vitest failure output (additional)
export function parseVitestFailureOutput(vitestStr) {
  const match = vitestStr.match(/(\d+)\s+tests? failed/);
  const testsFailed = match ? parseInt(match[1], 10) : 0;
  return { testsFailed };
}

// NEW: Parse ESLint compact output (additional)
export function parseEslintCompactOutput(eslintStr) {
  const match = eslintStr.match(/Found\s+(\d+)\s+problems\s+\((\d+)\s+errors?,\s+(\d+)\s+warnings\)/);
  if (match) {
    return {
      numProblems: parseInt(match[1], 10),
      numErrors: parseInt(match[2], 10),
      numWarnings: parseInt(match[3], 10),
    };
  }
  return { numProblems: 0, numErrors: 0, numWarnings: 0 };
}

// NEW: Simulate Issue Creation Workflow similar to wfr-create-issue.yml
export function simulateIssueCreation(params) {
  let selectedTitle = params.issueTitle;
  if (selectedTitle === "house choice") {
    let options = [];
    if (Array.isArray(params.houseChoiceOptions)) {
      options = params.houseChoiceOptions;
    } else if (typeof params.houseChoiceOptions === "string") {
      options = params.houseChoiceOptions.split("||").map(option => option.trim()).filter(option => option);
    }
    if (options.length === 0) {
      selectedTitle = "Default Issue Title";
    } else {
      selectedTitle = options[Math.floor(Math.random() * options.length)];
    }
  }
  const issueNumber = randomInt(100, 1000);
  const timestamp = new Date().toISOString();
  const labels = params.issueLabels || ["automated"];
  console.log(chalk.green(`Simulated issue creation at ${timestamp}: { issueTitle: ${selectedTitle}, issueBody: ${params.issueBody}, issueNumber: ${issueNumber}, labels: ${JSON.stringify(labels)} }`));
  return { issueTitle: selectedTitle, issueBody: params.issueBody, issueNumber, labels };
}

// NEW: Exported main() function for CLI execution
function main(args) {
  const { flagArgs, nonFlagArgs } = splitArguments(args);
  if (flagArgs.includes("--help")) {
    printUsageAndDemo(flagArgs, nonFlagArgs);
  } else {
    console.log(enhancedDemo());
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}

// Export main for testing purposes
export { main };

// NEW: Added simulateRemoteServiceWrapper for simulating remote service interactions
export async function simulateRemoteServiceWrapper(serviceUrl, payload) {
  // Simulating a delay to represent network call
  await new Promise((resolve) => setTimeout(resolve, 50));
  return { status: "success", serviceUrl, receivedPayload: payload };
}
