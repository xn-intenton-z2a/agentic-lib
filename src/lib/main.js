#!/usr/bin/env node
// src/lib/main.js

// Initialize global callCount to support test mocks that reference it
if (typeof globalThis.callCount === "undefined") {
  globalThis.callCount = 0;
}

import { fileURLToPath } from "url";
import { z } from "zod";
import dotenv from "dotenv";
import chalk from "chalk";

// ---------------------------------------------------------------------------------------------------------------------
// Environment configuration from .env file or environment variables or test values.
// ---------------------------------------------------------------------------------------------------------------------

dotenv.config();

if (process.env.VITEST || process.env.NODE_ENV === "development") {
  process.env.GITHUB_API_BASE_URL = process.env.GITHUB_API_BASE_URL || "https://api.github.com.test/";
  process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || "key-test";
}

const configSchema = z.object({
  GITHUB_API_BASE_URL: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
});

export const config = configSchema.parse(process.env);

// Global verbose mode flag
let VERBOSE_MODE = false;

// Helper function to format log entries
function formatLogEntry(level, message, additionalData = {}) {
  return {
    level,
    timestamp: new Date().toISOString(),
    message,
    ...additionalData,
  };
}

export function logConfig() {
  const logObj = formatLogEntry("info", "Configuration loaded", {
    config: {
      GITHUB_API_BASE_URL: config.GITHUB_API_BASE_URL,
      OPENAI_API_KEY: config.OPENAI_API_KEY,
    }
  });
  console.log(JSON.stringify(logObj));
}
logConfig();

// ---------------------------------------------------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------------------------------------------------

export function logInfo(message) {
  const additionalData = VERBOSE_MODE ? { verbose: true } : {};
  const logObj = formatLogEntry("info", message, additionalData);
  console.log(JSON.stringify(logObj));
}

export function logError(message, error) {
  const additionalData = { error: error ? error.toString() : undefined };
  if (VERBOSE_MODE && error && error.stack) {
    additionalData.stack = error.stack;
  }
  const logObj = formatLogEntry("error", message, additionalData);
  console.error(JSON.stringify(logObj));
}

// ---------------------------------------------------------------------------------------------------------------------
// AWS Utility functions
// ---------------------------------------------------------------------------------------------------------------------

export function createSQSEventFromDigest(digest) {
  return {
    Records: [
      {
        eventVersion: "2.0",
        eventSource: "aws:sqs",
        eventTime: new Date().toISOString(),
        eventName: "SendMessage",
        body: JSON.stringify(digest),
      },
    ],
  };
}

// ---------------------------------------------------------------------------------------------------------------------
// Helper function to apply command aliases
// ---------------------------------------------------------------------------------------------------------------------

function applyAlias(command) {
  if (typeof command !== "string") return command;
  if (process.env.COMMAND_ALIASES) {
    try {
      const aliases = JSON.parse(process.env.COMMAND_ALIASES);
      if (aliases && typeof aliases === 'object' && aliases.hasOwnProperty(command)) {
        return aliases[command];
      }
    } catch (err) {
      logError("COMMAND_ALIASES environment variable contains invalid JSON", err);
    }
  }
  return command;
}

// ---------------------------------------------------------------------------------------------------------------------
// SQS Lambda Handlers
// ---------------------------------------------------------------------------------------------------------------------

export async function digestLambdaHandler(sqsEvent) {
  logInfo(`Digest Lambda received event: ${JSON.stringify(sqsEvent)}`);

  // If event.Records is an array, use it. Otherwise, treat the event itself as one record.
  const sqsEventRecords = Array.isArray(sqsEvent.Records) ? sqsEvent.Records : [sqsEvent];

  // Array to collect the identifiers of the failed records
  const batchItemFailures = [];

  for (const [index, sqsEventRecord] of sqsEventRecords.entries()) {
    try {
      const digest = JSON.parse(sqsEventRecord.body);
      logInfo(`Record ${index}: Received digest: ${JSON.stringify(digest)}`);
    } catch (error) {
      // If messageId is missing, generate a fallback identifier including record index
      const recordId = sqsEventRecord.messageId || `fallback-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      logError(`Error processing record ${recordId} at index ${index}: Invalid JSON payload. Error: ${error.message}. Raw message: ${sqsEventRecord.body}`, error);
      batchItemFailures.push({ itemIdentifier: recordId });
    }
  }

  // Return the list of failed messages so that AWS SQS can attempt to reprocess them.
  return {
    batchItemFailures,
    handler: "src/lib/main.digestLambdaHandler",
  };
}

// ---------------------------------------------------------------------------------------------------------------------
// Agentic library functions
// ---------------------------------------------------------------------------------------------------------------------

export async function agenticHandler(payload) {
  try {
    if (!payload || typeof payload !== "object") {
      throw new Error("Invalid payload: must be an object");
    }
    
    // Batch processing if 'commands' property exists
    if ('commands' in payload) {
      if (!Array.isArray(payload.commands)) {
        throw new Error("Payload 'commands' must be an array");
      }

      // Optional throttling: enforce max batch commands if environment variable is set
      const maxBatchCommandsEnv = process.env.MAX_BATCH_COMMANDS;
      if (maxBatchCommandsEnv !== undefined) {
        const maxBatchCommands = parseInt(maxBatchCommandsEnv, 10);
        if (!isNaN(maxBatchCommands) && payload.commands.length > maxBatchCommands) {
          const errorMsg = `Error: Batch size exceeds maximum allowed of ${maxBatchCommands}`;
          logError(errorMsg);
          throw new Error(errorMsg);
        }
      }

      const responses = [];
      const batchStartTime = Date.now();
      for (const originalCmd of payload.commands) {
        const trimmedCmd = typeof originalCmd === 'string' ? originalCmd.trim() : originalCmd;
        // Apply alias substitution
        const substitutedCmd = applyAlias(trimmedCmd);
        const commandStart = Date.now();
        if (typeof substitutedCmd !== "string" || substitutedCmd === "" || substitutedCmd.toLowerCase() === "nan") {
          const errorMsg = "Invalid prompt input in commands: each command must be a valid non-empty string and not 'NaN'";
          logError(errorMsg);
          throw new Error(errorMsg);
        }
        logInfo(`Agentic Handler: processing command ${substitutedCmd}`);
        const response = {
          status: "success",
          processedCommand: substitutedCmd,
          timestamp: new Date().toISOString(),
          executionTimeMS: Date.now() - commandStart
        };
        responses.push(response);
        globalThis.callCount++;
      }
      const totalTime = Date.now() - batchStartTime;
      return {
        status: "success",
        results: responses,
        batchSummary: {
          totalCommands: payload.commands.length,
          totalExecutionTimeMS: totalTime
        }
      };
    } else if (!('command' in payload)) {
      throw new Error("Payload must have a 'command' property");
    } else {
      // Single command processing with normalization
      const startTime = Date.now();
      const trimmedCommand = typeof payload.command === 'string' ? payload.command.trim() : payload.command;
      // Apply alias substitution
      const substitutedCommand = applyAlias(trimmedCommand);
      if (typeof substitutedCommand !== "string" || substitutedCommand === "" || substitutedCommand.toLowerCase() === "nan") {
        const errorMsg = "Invalid prompt input: command is non-actionable because it is equivalent to 'NaN'. Please provide a valid, non-empty string command.";
        logError(errorMsg);
        throw new Error(errorMsg);
      }
      
      logInfo(`Agentic Handler: processing command ${substitutedCommand}`);
      const response = {
        status: "success",
        processedCommand: substitutedCommand,
        timestamp: new Date().toISOString(),
        executionTimeMS: Date.now() - startTime
      };
      globalThis.callCount++;
      return response;
    }
  } catch (error) {
    logError("Agentic Handler Error", error);
    throw error;
  }
}

// ---------------------------------------------------------------------------------------------------------------------
// WORKFLOW CHAIN Feature: Sequential Workflow Chaining
// ---------------------------------------------------------------------------------------------------------------------

export async function workflowChainHandler(payload) {
  if (!payload || typeof payload !== "object" || !Array.isArray(payload.chain)) {
    const errorMsg = "Invalid payload: must be an object containing a 'chain' array property";
    logError(errorMsg);
    throw new Error(errorMsg);
  }
  if (payload.chain.length === 0) {
    const errorMsg = "Chain array cannot be empty";
    logError(errorMsg);
    throw new Error(errorMsg);
  }
  const results = [];
  const chainStartTime = Date.now();
  for (const cmd of payload.chain) {
    const trimmed = typeof cmd === 'string' ? cmd.trim() : cmd;
    // Process each command sequentially via agenticHandler. If a command is invalid, agenticHandler will log and throw an error.
    const result = await agenticHandler({ command: trimmed });
    results.push(result);
  }
  const totalTime = Date.now() - chainStartTime;
  return {
    status: "success",
    results,
    chainSummary: {
      totalCommands: payload.chain.length,
      totalExecutionTimeMS: totalTime
    }
  };
}

// ---------------------------------------------------------------------------------------------------------------------
// Enhanced WORKFLOW CHAIN Feature: Robust Chaining with Error Handling and Conditional Branching
// ---------------------------------------------------------------------------------------------------------------------

export async function chainWorkflows(steps, options = {}) {
  if (!Array.isArray(steps)) {
    const errorMsg = "Invalid steps: must be an array";
    logError(errorMsg);
    throw new Error(errorMsg);
  }
  if (steps.length === 0) {
    const errorMsg = "Steps array cannot be empty";
    logError(errorMsg);
    throw new Error(errorMsg);
  }

  const results = [];
  let overallStatus = "success";
  const chainStartTime = Date.now();

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (!step || typeof step !== 'object' || !step.command) {
      const errorMsg = `Step at index ${i} is invalid: missing 'command' property`;
      logError(errorMsg);
      throw new Error(errorMsg);
    }
    // Use haltOnFailure flag from step, defaulting to true if not provided
    const haltOnFailure = step.hasOwnProperty('haltOnFailure') ? step.haltOnFailure : true;
    const stepResult = {
      stepIndex: i,
      command: step.command,
      haltOnFailure,
      executionTimeMS: null,
      status: "unknown",
      error: null,
      timestamp: new Date().toISOString()
    };

    try {
      const start = Date.now();
      const result = await agenticHandler({ command: step.command });
      stepResult.executionTimeMS = Date.now() - start;
      stepResult.status = "success";
      stepResult.result = result;
      logInfo(`Chain Step ${i}: Success. Command: ${step.command} executed in ${stepResult.executionTimeMS} ms`);
    } catch (error) {
      stepResult.executionTimeMS = Date.now() - new Date(stepResult.timestamp).getTime();
      stepResult.status = "failed";
      stepResult.error = error.toString();
      logError(`Chain Step ${i}: Failure on command: ${step.command}`, error);
      overallStatus = haltOnFailure ? "failed" : "partial";
      results.push(stepResult);
      if (haltOnFailure) {
        logInfo(`Chain halted due to failure at step ${i}`);
        break;
      } else {
        continue;
      }
    }
    results.push(stepResult);
  }

  const totalTime = Date.now() - chainStartTime;
  return {
    overallStatus,
    totalSteps: steps.length,
    totalExecutionTimeMS: totalTime,
    results
  };
}

// ---------------------------------------------------------------------------------------------------------------------
// New function to simulate an error and exit
// ---------------------------------------------------------------------------------------------------------------------

export function simulateError() {
  const error = new Error("Simulated Error");
  logError("Simulated error triggered by '--simulate-error' flag", error);
  process.exit(1);
}

// ---------------------------------------------------------------------------------------------------------------------
// New function to apply automated fix
// ---------------------------------------------------------------------------------------------------------------------

export function applyFix() {
  logInfo("Applied fix successfully");
}

// ---------------------------------------------------------------------------------------------------------------------
// New function to handle CLI utilities display with colored formatting
// ---------------------------------------------------------------------------------------------------------------------

export function cliUtilsHandler() {
  const cliCommands = [
    { command: "--help", description: "Show this help message and usage instructions." },
    { command: "--digest", description: "Run a full bucket replay simulating an SQS event." },
    { command: "--agentic <jsonPayload>", description: "Process an agentic command using a JSON payload. Payload may include a 'command' or a 'commands' array for batch processing." },
    { command: "--version", description: "Show version information with current timestamp." },
    { command: "--verbose", description: "Enable detailed logging for debugging." },
    { command: "--diagnostics", description: "Output detailed diagnostics including configuration and environment details." },
    { command: "--status", description: "Display runtime health summary in JSON format." },
    { command: "--dry-run", description: "Execute a dry run with no side effects." },
    { command: "--simulate-error", description: "Simulate an error for testing purposes and exit." },
    { command: "--simulate-delay <ms>", description: "Simulate processing delay for the specified duration in milliseconds." },
    { command: "--apply-fix", description: "Apply automated fix and log success message" },
    { command: "--cli-utils", description: "Display a summary of available CLI commands with their descriptions." },
    { command: "--workflow-chain <jsonPayload>", description: "Process a chain of workflow commands sequentially. (Payload must have a 'chain' array property)" }
  ];
  let output = chalk.bold("CLI Commands Summary:\n\n");
  cliCommands.forEach(cmd => {
    let desc = cmd.description;
    if (cmd.command === "--apply-fix" && desc.endsWith(".")) {
      desc = desc.slice(0, -1);
    }
    output += chalk.blue(cmd.command) + ": " + chalk.white(desc) + "\n";
  });
  console.log(output);
}

// ---------------------------------------------------------------------------------------------------------------------
// New function to provide runtime status
// ---------------------------------------------------------------------------------------------------------------------

export function statusHandler() {
  return {
    config: config,
    nodeVersion: process.version,
    callCount: globalThis.callCount,
    uptime: process.uptime()
  };
}

// ---------------------------------------------------------------------------------------------------------------------
// Main CLI and Helper Functions for CLI Command Processing
// ---------------------------------------------------------------------------------------------------------------------

// Function to generate CLI usage instructions
function generateUsage() {
  return `
Usage:
  --help                     Show this help message and usage instructions.
  --digest                   Run a full bucket replay simulating an SQS event.
  --agentic <jsonPayload>    Process an agentic command using a JSON payload. Payload may include a 'command' or a 'commands' array for batch processing.
  --version                  Show version information with current timestamp.
  --verbose                  Enable detailed logging for debugging.
  --diagnostics              Output detailed diagnostics including config and environment details.
  --status                   Display runtime health summary in JSON format.
  --dry-run                  Execute a dry run with no side effects.
  --simulate-error           Simulate an error for testing purposes and exit.
  --simulate-delay <ms>      Simulate processing delay for the specified duration in milliseconds.
  --apply-fix                Apply automated fix and log success message.
  --cli-utils                Display a summary of available CLI commands with their descriptions.
  --workflow-chain <jsonPayload>    Process a chain of workflow commands sequentially. (Payload must have a 'chain' array property)
`;
}

// CLI Helper Functions

// Asynchronously process the --simulate-delay flag
async function processSimulateDelay(args) {
  const index = args.indexOf("--simulate-delay");
  if (index !== -1) {
    const delayValue = args[index + 1];
    const delayMs = Number(delayValue);
    if (isNaN(delayMs) || delayMs < 0) {
      console.error("Invalid delay duration provided for --simulate-delay");
      process.exit(1);
    }
    // Remove the flag and its value from args
    args.splice(index, 2);
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
  return false;
}

// Process the --verbose flag
function processVerbose(args) {
  if (args.includes("--verbose")) {
    VERBOSE_MODE = true;
    logInfo("Verbose mode activated.");
  }
}

// Process the --simulate-error flag
function processSimulateError(args) {
  if (args.includes("--simulate-error")) {
    simulateError();
    return true;
  }
  return false;
}

// Process the --apply-fix flag
function processApplyFix(args) {
  if (args.includes("--apply-fix")) {
    applyFix();
    return true;
  }
  return false;
}

// Process the --cli-utils flag
function processCliUtils(args) {
  if (args.includes("--cli-utils")) {
    cliUtilsHandler();
    return true;
  }
  return false;
}

// Process the --workflow-chain flag
async function processWorkflowChain(args) {
  const index = args.indexOf("--workflow-chain");
  if (index !== -1) {
    const payloadArg = args[index + 1];
    if (!payloadArg) {
      console.log("No payload provided for --workflow-chain flag.");
      return true;
    }
    try {
      const payload = JSON.parse(payloadArg);
      const result = await workflowChainHandler(payload);
      console.log(JSON.stringify(result));
    } catch (error) {
      logError("Failed to process workflow chain", error);
    }
    return true;
  }
  return false;
}

// Process the --help flag
function processHelp(args) {
  if (args.includes("--help")) {
    console.log(generateUsage());
    return true;
  }
  return false;
}

// Process the --dry-run flag
function processDryRun(args) {
  if (args.includes("--dry-run")) {
    console.log("Dry-run: No action taken.");
    return true;
  }
  return false;
}

// Process the --diagnostics flag
function processDiagnostics(args) {
  if (args.includes("--diagnostics")) {
    const diagnostics = {
      config: config,
      nodeVersion: process.version,
      env: {
        GITHUB_API_BASE_URL: process.env.GITHUB_API_BASE_URL,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        NODE_ENV: process.env.NODE_ENV,
        VITEST: process.env.VITEST || null
      },
      timestamp: new Date().toISOString()
    };
    logInfo("Diagnostics Mode: " + JSON.stringify(diagnostics));
    return true;
  }
  return false;
}

// Process the --status flag
function processStatus(args) {
  if (args.includes("--status")) {
    const status = statusHandler();
    console.log(JSON.stringify(status));
    return true;
  }
  return false;
}

// Process the --version flag
async function processVersion(args) {
  if (args.includes("--version")) {
    try {
      const { readFileSync } = await import("fs");
      const packageJsonPath = new URL("../../package.json", import.meta.url);
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
      const versionInfo = {
        version: packageJson.version,
        timestamp: new Date().toISOString()
      };
      console.log(JSON.stringify(versionInfo));
    } catch (error) {
      logError("Failed to retrieve version", error);
    }
    return true;
  }
  return false;
}

// Process the --digest flag
async function processDigest(args) {
  if (args.includes("--digest")) {
    const exampleDigest = {
      key: "events/1.json",
      value: "12345",
      lastModified: new Date().toISOString(),
    };
    const sqsEvent = createSQSEventFromDigest(exampleDigest);
    await digestLambdaHandler(sqsEvent);
    return true;
  }
  return false;
}

// Process the --agentic flag
async function processAgentic(args) {
  if (args.includes("--agentic")) {
    const index = args.indexOf("--agentic");
    const payloadArg = args[index + 1];
    if (!payloadArg) {
      console.log("No payload provided for --agentic flag.");
      return true;
    }
    try {
      const payload = JSON.parse(payloadArg);
      const result = await agenticHandler(payload);
      console.log(JSON.stringify(result));
    } catch (error) {
      logError("Failed to process agentic command", error);
    }
    return true;
  }
  return false;
}

// ---------------------------------------------------------------------------------------------------------------------
// Main CLI
// ---------------------------------------------------------------------------------------------------------------------

export async function main(args = process.argv.slice(2)) {
  await processSimulateDelay(args);
  processVerbose(args);
  if (processSimulateError(args)) return;
  if (processApplyFix(args)) return;
  if (processCliUtils(args)) return;
  if (await processWorkflowChain(args)) return;
  if (processHelp(args)) return;
  if (processDryRun(args)) return;
  if (processDiagnostics(args)) return;
  if (processStatus(args)) return;
  if (await processVersion(args)) return;
  if (await processDigest(args)) return;
  if (await processAgentic(args)) return;

  console.log("No command argument supplied.");
  console.log(generateUsage());
}

// if (import.meta.url.endsWith(process.argv[1])) {
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    logError("Fatal error in main execution", err);
    process.exit(1);
  });
}
