#!/usr/bin/env node
// sandbox/source/main.js

// Initialize global callCount for possible instrumentation
if (typeof globalThis.callCount === "undefined") {
  globalThis.callCount = 0;
}

import { fileURLToPath } from "url";
import path from "path";
import { readFileSync } from "fs";
import { z } from "zod";
import dotenv from "dotenv";

// ---------------------------------------------------------------------------------------------------------------------
// Environment configuration
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

// Global verbose flags
const VERBOSE_MODE = false;
const VERBOSE_STATS = false;

// Helper to create structured log entries
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

export async function digestLambdaHandler(sqsEvent) {
  logInfo(`Digest Lambda received event: ${JSON.stringify(sqsEvent)}`);
  const records = Array.isArray(sqsEvent.Records) ? sqsEvent.Records : [sqsEvent];
  const batchItemFailures = [];
  for (const [index, record] of records.entries()) {
    try {
      const digest = JSON.parse(record.body);
      logInfo(`Record ${index}: Received digest: ${JSON.stringify(digest)}`);
    } catch (err) {
      const recordId =
        record.messageId || `fallback-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      logError(`Error processing record ${recordId} at index ${index}`, err);
      logError(`Invalid JSON payload. Error: ${err.message}. Raw message: ${record.body}`);
      batchItemFailures.push({ itemIdentifier: recordId });
    }
  }
  return { batchItemFailures, handler: "sandbox/source/main.digestLambdaHandler" };
}

function generateUsage() {
  return `Usage:\n  --help                     Show this help message and usage instructions.\n  --digest                   Run a full bucket replay simulating an SQS event.\n  --version                  Show version information with current timestamp.`;
}

function processHelp(args) {
  if (args.includes("--help")) {
    console.log(generateUsage());
    return true;
  }
  return false;
}

async function processVersion(args) {
  if (args.includes("--version")) {
    try {
      const packageJsonPath = path.resolve(process.cwd(), "package.json");
      const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8"));
      const versionInfo = { version: pkg.version, timestamp: new Date().toISOString() };
      console.log(JSON.stringify(versionInfo));
    } catch (err) {
      logError("Failed to retrieve version", err);
    }
    return true;
  }
  return false;
}

async function processDigest(args) {
  if (args.includes("--digest")) {
    const example = { key: "events/1.json", value: "12345", lastModified: new Date().toISOString() };
    const sqsEvent = createSQSEventFromDigest(example);
    await digestLambdaHandler(sqsEvent);
    return true;
  }
  return false;
}

export async function main(args = process.argv.slice(2)) {
  if (processHelp(args)) {
    if (VERBOSE_STATS) {
      console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
    }
    return;
  }
  if (await processVersion(args)) {
    if (VERBOSE_STATS) {
      console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
    }
    return;
  }
  if (await processDigest(args)) {
    if (VERBOSE_STATS) {
      console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
    }
    return;
  }
  console.log("No command argument supplied.");
  console.log(generateUsage());
  if (VERBOSE_STATS) {
    console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    logError("Fatal error in main execution", err);
    process.exit(1);
  });
}
