#!/usr/bin/env node
// src/lib/main.js - Updated to align with the agentic‑lib mission statement by pruning drift, consolidating legacy code, and extending workflow simulation functionality.
// Change Log:
// - Pruned drift and removed deprecated duplicate function definitions.
// - Consolidated duplicate exports (simulateKafkaConsumer, simulateKafkaDelayedMessage, simulateKafkaTransaction, simulateKafkaPriorityQueue, simulateKafkaMessagePersistence, simulateKafkaMulticast, simulateFileSystemCall, callRepositoryService).
// - Added a main() function to enable CLI execution.
// - Fixed regex in getIssueNumberFromBranch to correctly extract issue numbers.
// - Added parseCombinedDefaultOutput to parse both Vitest and ESLint default outputs.
// - NEW: Added simulateIssueCreation to mimic the behavior of the wfr-create-issue.yml workflow.

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
 * Dummy generateUsage function
 */
function generateUsage() {
  return "Usage: agentic-lib [options]";
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
 * Enhanced telemetry function to gather additional workflow-specific metrics from GitHub Actions.
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

// --- Consolidated single declarations below (duplicates removed) ---

// Simulate a Kafka consumer
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

// LLM and issue review functions
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

// NEW: Added parseCombinedDefaultOutput to parse vitest and eslint default outputs
export function parseCombinedDefaultOutput(vitestStr, eslintStr) {
  const vitestMatch = vitestStr.match(/(\d+)/);
  const testsPassed = vitestMatch ? parseInt(vitestMatch[1], 10) : 0;
  const eslintMatch = eslintStr.match(/(\d+)\s+problems,\s+(\d+)\s+errors,\s+(\d+)\s+warnings/);
  const numProblems = eslintMatch ? parseInt(eslintMatch[1], 10) : 0;
  const numErrors = eslintMatch ? parseInt(eslintMatch[2], 10) : 0;
  const numWarnings = eslintMatch ? parseInt(eslintMatch[3], 10) : 0;
  return { vitest: { testsPassed }, eslint: { numProblems, numErrors, numWarnings } };
}

// NEW: Simulate Issue Creation Workflow similar to wfr-create-issue.yml
export function simulateIssueCreation(params) {
  // params: { issueTitle, issueBody, houseChoiceOptions }
  let selectedTitle = params.issueTitle;
  if (params.issueTitle === "house choice" && Array.isArray(params.houseChoiceOptions) && params.houseChoiceOptions.length > 0) {
    const randomIndex = randomInt(0, params.houseChoiceOptions.length);
    selectedTitle = params.houseChoiceOptions[randomIndex];
  }
  // Generate a simulated issue number
  const issueNumber = randomInt(100, 1000);
  console.log(chalk.green(`Simulated issue creation: { issueTitle: ${selectedTitle}, issueBody: ${params.issueBody}, issueNumber: ${issueNumber} }`));
  return { issueTitle: selectedTitle, issueBody: params.issueBody, issueNumber };
}

// --- Added main() function for CLI execution ---
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
