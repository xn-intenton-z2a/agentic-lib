#!/usr/bin/env node
// sandbox/source/main.js

// Initialize global callCount to support test mocks that reference it
if (typeof globalThis.callCount === "undefined") {
  globalThis.callCount = 0;
}

import { fileURLToPath } from "url";
import { readFileSync, readdirSync } from "fs";
import { z } from "zod";
import dotenv from "dotenv";
import express from "express";

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
const VERBOSE_MODE = false;
// Global verbose stats flag
const VERBOSE_STATS = false;

// Record server start time for uptime
let serverStartTime = Date.now();

// In-memory metrics counters
let digestInvocations = 0;
let digestErrors = 0;
let webhookInvocations = 0;
let webhookErrors = 0;
let featuresRequests = 0;
let missionRequests = 0;

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
// Configuration logging removed at startup to clean CLI output

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

  const sqsEventRecords = Array.isArray(sqsEvent.Records) ? sqsEvent.Records : [sqsEvent];
  const batchItemFailures = [];

  for (const [index, sqsEventRecord] of sqsEventRecords.entries()) {
    try {
      const digest = JSON.parse(sqsEventRecord.body);
      logInfo(`Record ${index}: Received digest: ${JSON.stringify(digest)}`);
    } catch (error) {
      const recordId =
        sqsEventRecord.messageId || `fallback-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      logError(`Error processing record ${recordId} at index ${index}`, error);
      logError(`Invalid JSON payload. Error: ${error.message}. Raw message: ${sqsEventRecord.body}`);
      batchItemFailures.push({ itemIdentifier: recordId });
    }
  }

  return {
    batchItemFailures,
    handler: "sandbox/source/main.digestLambdaHandler",
  };
}

// ---------------------------------------------------------------------------------------------------------------------
// HTTP Server and CLI Helper Functions
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Create and configure the Express app with HTTP endpoints.
 */
export function createHttpServer() {
  const app = express();
  app.use(express.json());
  app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      return res.status(400).json({ error: `Invalid JSON payload: ${err.message}` });
    }
    next(err);
  });

  serverStartTime = Date.now();

  // Health endpoint
  app.get("/health", (req, res) => {
    const uptime = (Date.now() - serverStartTime) / 1000;
    res.status(200).json({ status: "ok", uptime });
  });

  // Digest endpoint
  app.post("/digest", async (req, res) => {
    try {
      const payload = req.body;
      const schema = z.object({
        key: z.string(),
        value: z.string(),
        lastModified: z.string(),
      });
      const validated = schema.parse(payload);
      const event = createSQSEventFromDigest(validated);
      const result = await digestLambdaHandler(event);
      digestInvocations++;
      res.status(200).json(result);
    } catch (err) {
      digestErrors++;
      const message =
        err instanceof z.ZodError
          ? err.errors.map((e) => e.message).join(", ")
          : err.message;
      res.status(400).json({ error: `Invalid JSON payload: ${message}` });
    }
  });

  // Webhook endpoint
  app.post("/webhook", (req, res) => {
    webhookInvocations++;
    const payload = req.body;
    logInfo(`Webhook received payload: ${JSON.stringify(payload)}`);
    res.status(200).json({ status: "received" });
  });

  // Mission endpoint
  app.get("/mission", (req, res) => {
    missionRequests++;
    try {
      const missionPath = new URL("../../MISSION.md", import.meta.url);
      const missionContent = readFileSync(missionPath, "utf-8");
      res.status(200).json({ mission: missionContent });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Features endpoint
  app.get("/features", (req, res) => {
    featuresRequests++;
    try {
      const featuresDir = fileURLToPath(new URL("../features", import.meta.url));
      const files = readdirSync(featuresDir).filter((f) => f.endsWith(".md"));
      const features = files.map((file) => {
        const name = file.replace(/\.md$/, "");
        const content = readFileSync(`${featuresDir}/${file}`, "utf-8");
        const firstLine = content.split("\n").find((line) => line.startsWith("#"));
        const title = firstLine ? firstLine.replace(/^#\s*/, "").trim() : "";
        return { name, title };
      });
      const missionPath = new URL("../../MISSION.md", import.meta.url);
      const missionContent = readFileSync(missionPath, "utf-8");
      res.status(200).json({ mission: missionContent, features });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Stats endpoint
  app.get("/stats", (req, res) => {
    const uptime = (Date.now() - serverStartTime) / 1000;
    res.status(200).json({
      uptime,
      metrics: {
        digestInvocations,
        digestErrors,
        webhookInvocations,
        webhookErrors,
        featuresRequests,
        missionRequests,
      },
    });
  });

  // Discussion-stats endpoint (stubbed)
  app.get("/discussion-stats", (req, res) => {
    res.status(200).json({
      discussionCount: 0,
      commentCount: 0,
      uniqueAuthors: 0,
    });
  });

  return app;
}

/**
 * If --serve or --http flag is present, start HTTP server and bypass CLI.
 */
export function serveHttp() {
  const args = process.argv.slice(2);
  if (!args.includes("--serve") && !args.includes("--http")) {
    return false;
  }
  const app = createHttpServer();
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    logInfo(`HTTP server listening on port ${port}`);
  })
    .on("error", (err) => {
      logError("Express server error", err);
      process.exit(1);
    });
  return true;
}

function generateUsage() {
  return `
Usage:
  --help                     Show this help message and usage instructions.
  --digest                   Run a full bucket replay simulating an SQS event.
  --version                  Show version information with current timestamp.
  --serve, --http            Run in HTTP server mode.
  --mission                  Show the mission statement of the library.
  --features                 List available features and their titles.
  --stats                    Show runtime metrics and request counts.
  --discussion-stats         Show GitHub Discussions metrics as JSON
`;
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
      const { readFileSync: readPkg } = await import("fs");
      const packageJsonPath = new URL("../../package.json", import.meta.url);
      const packageJson = JSON.parse(readPkg(packageJsonPath, "utf8"));
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

function processMission(args) {
  if (args.includes("--mission")) {
    try {
      const missionFilePath = new URL("../../MISSION.md", import.meta.url);
      const missionContent = readFileSync(missionFilePath, "utf-8");
      console.log(JSON.stringify({ mission: missionContent }));
    } catch (err) {
      console.error(JSON.stringify({ error: err.message }));
      process.exit(1);
    }
    return true;
  }
  return false;
}

function processFeatures(args) {
  if (args.includes("--features")) {
    try {
      const featuresDir = fileURLToPath(new URL("../features", import.meta.url));
      const files = readdirSync(featuresDir).filter((f) => f.endsWith(".md"));
      const features = files.map((file) => {
        const name = file.replace(/\.md$/, "");
        const content = readFileSync(`${featuresDir}/${file}`, "utf-8");
        const firstLine = content.split("\n").find((line) => line.startsWith("#"));
        const title = firstLine ? firstLine.replace(/^#\s*/, "").trim() : "";
        return { name, title };
      });
      const missionFilePath = new URL("../../MISSION.md", import.meta.url);
      const missionContent = readFileSync(missionFilePath, "utf-8");
      console.log(JSON.stringify({ mission: missionContent, features }));
    } catch (err) {
      console.error(JSON.stringify({ error: err.message }));
      process.exit(1);
    }
    return true;
  }
  return false;
}

function processStats(args) {
  if (args.includes("--stats")) {
    const uptime = (Date.now() - serverStartTime) / 1000;
    const metrics = {
      digestInvocations,
      digestErrors,
      webhookInvocations,
      webhookErrors,
      featuresRequests,
      missionRequests,
    };
    console.log(JSON.stringify({ uptime, metrics }));
    return true;
  }
  return false;
}

function processDiscussionStats(args) {
  if (args.includes("--discussion-stats")) {
    console.log(JSON.stringify({ discussionCount: 0, commentCount: 0, uniqueAuthors: 0 }));
    return true;
  }
  return false;
}

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
  if (serveHttp()) {
    return;
  }
  if (processDiscussionStats(args)) {
    return;
  }
  if (processStats(args)) {
    return;
  }
  if (processHelp(args)) {
    if (VERBOSE_STATS) console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
    return;
  }
  if (await processVersion(args)) {
    if (VERBOSE_STATS) console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
    return;
  }
  if (processMission(args)) {
    if (VERBOSE_STATS) console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
    return;
  }
  if (processFeatures(args)) {
    if (VERBOSE_STATS) console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
    return;
  }
  if (await processDigest(args)) {
    if (VERBOSE_STATS) console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
    return;
  }

  console.log("No command argument supplied.");
  console.log(generateUsage());
  if (VERBOSE_STATS) console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    logError("Fatal error in main execution", err);
    process.exit(1);
  });
}