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
    if (!payload.command) {
      throw new Error("Payload must have a 'command' property");
    }
    logInfo(`Agentic Handler: processing command ${payload.command}`);
    // Stub processing logic
    const response = {
      status: "success",
      processedCommand: payload.command,
      timestamp: new Date().toISOString()
    };
    return response;
  } catch (error) {
    logError("Agentic Handler Error", error);
    throw error;
  }
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
      --verbose                  Enable verbose logging
      --diagnostics              Output detailed diagnostic information
    `;
}

export async function main(args = process.argv.slice(2)) {
  // Enable verbose mode if --verbose flag is provided
  if (args.includes("--verbose")) {
    VERBOSE_MODE = true;
    logInfo("Verbose mode activated.");
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

  if (args.includes("--help")) {
    console.log(generateUsage());
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
