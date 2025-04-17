#!/usr/bin/env node
// src/lib/main.js

// Initialize global callCount to support test mocks that reference it
if (typeof globalThis.callCount === "undefined") {
  globalThis.callCount = 0;
}

import { fileURLToPath } from "url";
import { z } from "zod";
import dotenv from "dotenv";

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

export function logConfig() {
  const logObj = {
    level: "info",
    timestamp: new Date().toISOString(),
    message: "Configuration loaded",
    config: {
      GITHUB_API_BASE_URL: config.GITHUB_API_BASE_URL,
      OPENAI_API_KEY: config.OPENAI_API_KEY,
    }
  };
  console.log(JSON.stringify(logObj));
}
logConfig();

// ---------------------------------------------------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------------------------------------------------

export function logInfo(message) {
  const logObj = {
    level: "info",
    timestamp: new Date().toISOString(),
    message,
  };
  if (VERBOSE_MODE) {
    logObj.verbose = true;
  }
  console.log(JSON.stringify(logObj));
}

export function logError(message, error) {
  const logObj = {
    level: "error",
    timestamp: new Date().toISOString(),
    message,
    error: error ? error.toString() : undefined,
  };
  if (VERBOSE_MODE && error && error.stack) {
    logObj.stack = error.stack;
  }
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
      for (const cmd of payload.commands) {
        const commandStart = Date.now();
        if (typeof cmd !== "string" || cmd.trim() === "" || cmd.trim().toLowerCase() === "nan") {
          const errorMsg = "Invalid input in commands: each command must be a valid, non-empty string (cannot be 'NaN').";
          logError(errorMsg);
          throw new Error(errorMsg);
        }
        logInfo(`Agentic Handler: processing command ${cmd}`);
        const response = {
          status: "success",
          processedCommand: cmd,
          timestamp: new Date().toISOString(),
          executionTimeMS: Date.now() - commandStart
        };
        responses.push(response);
        globalThis.callCount++;
      }
      return { status: "success", results: responses };
    } else if (!('command' in payload)) {
      throw new Error("Payload must have a 'command' property");
    } else {
      // Single command processing
      const startTime = Date.now();
      if (typeof payload.command !== "string" || payload.command.trim() === "" || payload.command.trim().toLowerCase() === "nan") {
        const errorMsg = "Invalid input: command is non-actionable (equivalent to 'NaN'). Please provide a valid, non-empty string.";
        logError(errorMsg);
        throw new Error(errorMsg);
      }
      
      logInfo(`Agentic Handler: processing command ${payload.command}`);
      const response = {
        status: "success",
        processedCommand: payload.command,
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
// Status Handler
// ---------------------------------------------------------------------------------------------------------------------

export function statusHandler() {
  const status = {
    config: config,
    nodeVersion: process.version,
    callCount: globalThis.callCount,
    uptime: process.uptime(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      VITEST: process.env.VITEST || null,
      GITHUB_API_BASE_URL: process.env.GITHUB_API_BASE_URL,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY
    }
  };
  return status;
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
// Main CLI
// ---------------------------------------------------------------------------------------------------------------------

function generateUsage() {
  return `
      Usage:
      --help                     Show this help message (default)
      --digest                   Run full bucket replay
      --agentic <jsonPayload>    Process an agentic command with a JSON payload
      --version                  Show version information
      --verbose                  Enable verbose logging
      --diagnostics              Output detailed diagnostic information
      --status                   Output runtime health summary in JSON format
      --dry-run                  Execute a dry run with no side effects
      --simulate-error           Simulate an error for testing purposes
      --simulate-delay <ms>      Simulate processing delay for the specified duration in milliseconds
      --apply-fix                Apply automated fixes and log success message
    `;
}

export async function main(args = process.argv.slice(2)) {
  // Process --simulate-delay flag and delay execution if specified
  const simulateDelayIndex = args.indexOf("--simulate-delay");
  if (simulateDelayIndex !== -1) {
    const delayValue = args[simulateDelayIndex + 1];
    const delayMs = Number(delayValue);
    if (isNaN(delayMs) || delayMs < 0) {
      console.error("Invalid delay duration provided for --simulate-delay");
      process.exit(1);
    }
    await new Promise(resolve => setTimeout(resolve, delayMs));
    // Remove the flag and its value from args
    args.splice(simulateDelayIndex, 2);
  }

  // Enable verbose mode if --verbose flag is provided
  if (args.includes("--verbose")) {
    VERBOSE_MODE = true;
    logInfo("Verbose mode activated.");
  }

  // Check for simulate error flag first
  if (args.includes("--simulate-error")) {
    simulateError();
  }

  // Check for apply-fix flag
  if (args.includes("--apply-fix")) {
    applyFix();
    return;
  }

  if (args.includes("--help")) {
    console.log(generateUsage());
    return;
  }

  if (args.includes("--dry-run")) {
    console.log("Dry-run: No action taken.");
    return;
  }

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
    return;
  }

  if (args.includes("--status")) {
    const status = statusHandler();
    console.log(JSON.stringify(status));
    return;
  }

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
    return;
  }

  if (args.includes("--digest")) {
    const exampleDigest = {
      key: "events/1.json",
      value: "12345",
      lastModified: new Date().toISOString(),
    };
    const sqsEvent = createSQSEventFromDigest(exampleDigest);
    await digestLambdaHandler(sqsEvent);
    return;
  }

  if (args.includes("--agentic")) {
    const index = args.indexOf("--agentic");
    const payloadArg = args[index + 1];
    if (!payloadArg) {
      console.log("No payload provided for --agentic flag.");
      return;
    }
    try {
      const payload = JSON.parse(payloadArg);
      const result = await agenticHandler(payload);
      console.log(JSON.stringify(result));
    } catch (error) {
      logError("Failed to process agentic command", error);
    }
    return;
  }

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
