#!/usr/bin/env node
// src/lib/main.js

// Initialize global callCount to support test mocks that reference it
if (typeof globalThis.callCount === "undefined") {
  globalThis.callCount = 0;
}

import express from "express";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { z, ZodError } from "zod";
import dotenv from "dotenv";

// ---------------------------------------------------------------------------------------------------------------------
// Express HTTP server setup
// ---------------------------------------------------------------------------------------------------------------------

export const app = express();
app.use(express.json());

// Zod schemas for HTTP /digest endpoint payload
const recordSchema = z.object({
  body: z.string(),
  messageId: z.string().optional(),
});
// Accept either { Records: [...] } or a single record
const httpEventSchema = z.union([
  z.object({ Records: z.array(recordSchema) }),
  recordSchema,
]);

// POST /digest endpoint
app.post("/digest", async (req, res) => {
  // Validate payload shape
  let parsed;
  try {
    parsed = httpEventSchema.parse(req.body);
  } catch (err) {
    if (err instanceof ZodError) {
      logError("Invalid request payload", err);
      const message = err.issues.map((e) => e.message).join(", ");
      return res.status(400).json({ error: message });
    }
    logError("Unknown error validating payload", err);
    return res.status(400).json({ error: err.toString() });
  }

  // Normalize to SQS event format
  let sqsEvent;
  if (parsed && Object.prototype.hasOwnProperty.call(parsed, 'Records') && Array.isArray(parsed.Records)) {
    sqsEvent = { Records: parsed.Records };
  } else {
    sqsEvent = { Records: [parsed] };
  }

  try {
    const result = await digestLambdaHandler(sqsEvent);
    // Map batchItemFailures to identifier strings for HTTP response
    const failures = result.batchItemFailures.map((entry) =>
      typeof entry === 'string' ? entry : entry.itemIdentifier || entry
    );
    return res.json({ batchItemFailures: failures });
  } catch (error) {
    logError("Error in HTTP /digest handler", error);
    return res.json({ batchItemFailures: [] });
  }
});

// ---------------------------------------------------------------------------------------------------------------------
// Environment configuration from .env file or environment variables or test values.
// ---------------------------------------------------------------------------------------------------------------------

dotenv.config();

if (process.env.VITEST || process.env.NODE_ENV === "development") {
  process.env.GITHUB_API_BASE_URL =
    process.env.GITHUB_API_BASE_URL || "https://api.github.com.test/";
  process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || "key-test";
}

const configSchema = z.object({
  GITHUB_API_BASE_URL: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
});

export const config = configSchema.parse(process.env);

// Global verbose mode flag
const VERBOSE_MODE = false;
// Global verbose stats flag
const VERBOSE_STATS = false;

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
    },
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
// SQS Lambda Handlers
// ---------------------------------------------------------------------------------------------------------------------

export async function digestLambdaHandler(sqsEvent) {
  logInfo(`Digest Lambda received event: ${JSON.stringify(sqsEvent)}`);

  // If event.Records is an array, use it. Otherwise, treat the event itself as one record.
  const sqsEventRecords = Array.isArray(sqsEvent.Records)
    ? sqsEvent.Records
    : [sqsEvent];

  // Array to collect the identifiers of the failed records
  const batchItemFailures = [];

  for (const [index, sqsEventRecord] of sqsEventRecords.entries()) {
    try {
      const digest = JSON.parse(sqsEventRecord.body);
      logInfo(`Record ${index}: Received digest: ${JSON.stringify(digest)}`);
    } catch (error) {
      // If messageId is missing, generate a fallback identifier including record index
      const recordId =
        sqsEventRecord.messageId ||
        `fallback-${index}-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;
      logError(`Error processing record ${recordId} at index ${index}`, error);
      logError(
        `Invalid JSON payload. Error: ${error.message}. Raw message: ${sqsEventRecord.body}`
      );
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
// HTTP Server Mode
// ---------------------------------------------------------------------------------------------------------------------

export async function processServe(args) {
  if (!args.includes("--serve")) {
    return false;
  }
  const port = process.env.PORT || 3000;
  const server = app.listen(port, () => {
    logInfo(`HTTP server listening on port ${port}`);
  });

  const gracefulShutdown = () => {
    server.close(() => {
      logInfo("HTTP server closed");
      process.exit(0);
    });
    setTimeout(() => {
      process.exit(1);
    }, 5000);
  };

  process.on("SIGINT", gracefulShutdown);
  process.on("SIGTERM", gracefulShutdown);

  return true;
}

// ---------------------------------------------------------------------------------------------------------------------
// CLI Helper Functions
// ---------------------------------------------------------------------------------------------------------------------

// Function to generate CLI usage instructions
function generateUsage() {
  return `
Usage:
  --help                     Show this help message and usage instructions.
  --digest                   Run a full bucket replay simulating an SQS event.
  --version                  Show version information with current timestamp.
  --mission                  Show the project mission statement.
  --serve                    Start HTTP server mode exposing /digest endpoint.
`;
}

// Process the --help flag
function processHelp(args) {
  if (args.includes("--help")) {
    console.log(generateUsage());
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
      const packageJson = JSON.parse(
        readFileSync(packageJsonPath, "utf8")
      );
      const versionInfo = {
        version: packageJson.version,
        timestamp: new Date().toISOString(),
      };
      console.log(JSON.stringify(versionInfo));
    } catch (error) {
      logError("Failed to retrieve version", error);
    }
    return true;
  }
  return false;
}

// Process the --mission flag
async function processMission(args) {
  if (args.includes("--mission")) {
    try {
      const missionUrl = new URL("../../MISSION.md", import.meta.url);
      const missionFile = fileURLToPath(missionUrl);
      const missionContent = readFileSync(missionFile, "utf8");
      console.log(missionContent);
    } catch (error) {
      logError("Failed to read mission file", error);
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

// ---------------------------------------------------------------------------------------------------------------------
// Main CLI
// ---------------------------------------------------------------------------------------------------------------------

export async function main(args = process.argv.slice(2)) {
  if (await processServe(args)) {
    return;
  }
  if (processHelp(args)) {
    if (VERBOSE_STATS) {
      console.log(
        JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() })
      );
    }
    return;
  }
  if (await processVersion(args)) {
    if (VERBOSE_STATS) {
      console.log(
        JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() })
      );
    }
    return;
  }
  if (await processMission(args)) {
    if (VERBOSE_STATS) {
      console.log(
        JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() })
      );
    }
    return;
  }
  if (await processDigest(args)) {
    if (VERBOSE_STATS) {
      console.log(
        JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() })
      );
    }
    return;
  }

  console.log("No command argument supplied.");
  console.log(generateUsage());
  if (VERBOSE_STATS) {
    console.log(
      JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() })
    );
  }
}

// if (import.meta.url.endsWith(process.argv[1])) {
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    logError("Fatal error in main execution", err);
    process.exit(1);
  });
}
