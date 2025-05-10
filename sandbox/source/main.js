#!/usr/bin/env node
// sandbox/source/main.js

// Initialize global callCount to support test mocks that reference it
if (typeof globalThis.callCount === "undefined") {
  globalThis.callCount = 0;
}

import { fileURLToPath } from "url";
import { z } from "zod";
import dotenv from "dotenv";
import { promises as fs } from "fs";
import path from "path";

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
  const sqsEventRecords = Array.isArray(sqsEvent.Records) ? sqsEvent.Records : [sqsEvent];

  // Array to collect the identifiers of the failed records
  const batchItemFailures = [];

  for (const [index, sqsEventRecord] of sqsEventRecords.entries()) {
    try {
      const digest = JSON.parse(sqsEventRecord.body);
      logInfo(`Record ${index}: Received digest: ${JSON.stringify(digest)}`);
    } catch (error) {
      // If messageId is missing, generate a fallback identifier including record index
      const recordId =
        sqsEventRecord.messageId || `fallback-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      logError(`Error processing record ${recordId} at index ${index}`, error);
      logError(`Invalid JSON payload. Error: ${error.message}. Raw message: ${sqsEventRecord.body}`);
      batchItemFailures.push({ itemIdentifier: recordId });
    }
  }

  // Return the list of failed messages so that AWS SQS can attempt to reprocess them.
  return {
    batchItemFailures,
    handler: "sandbox/source/main.digestLambdaHandler",
  };
}

// ---------------------------------------------------------------------------------------------------------------------
// CLI Toolkit Functions
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Generate a diagram of CLI to SQS Lambda workflow interaction.
 * @param {string} format - 'json' or 'markdown'
 * @returns {string|object}
 */
export function generateDiagram(format = "markdown") {
  const nodes = [
    "CLI",
    "main",
    "processDiagram",
    "generateDiagram",
    "processFeaturesOverview",
    "generateFeaturesOverview",
  ];
  const links = [
    { from: "CLI", to: "main" },
    { from: "main", to: "processDiagram" },
    { from: "processDiagram", to: "generateDiagram" },
    { from: "main", to: "processFeaturesOverview" },
    { from: "processFeaturesOverview", to: "generateFeaturesOverview" },
  ];
  if (format === "json") {
    return { nodes, links };
  }
  const lines = ["```mermaid", "flowchart LR"];
  links.forEach((l) => lines.push(`  ${l.from.replace(/\s+/g, '')} --> ${l.to.replace(/\s+/g, '')}`));
  lines.push("```");
  return lines.join("\n");
}

/**
 * Generate an overview of archived features in sandbox/features/archived.
 * @param {string} format - 'json' or 'markdown'
 * @returns {Promise<string|Array>}
 */
export async function generateFeaturesOverview(format = "markdown") {
  const archivedDir = path.resolve(process.cwd(), "sandbox/features/archived");
  let files = [];
  try {
    files = await fs.readdir(archivedDir);
  } catch {
    files = [];
  }
  const overview = [];
  for (const file of files.filter((f) => f.endsWith(".md"))) {
    const filePath = path.join(archivedDir, file);
    const content = await fs.readFile(filePath, "utf8");
    const lines = content.split(/\r?\n/);
    const headingLine = lines.find((l) => l.startsWith("#"));
    const name = headingLine ? headingLine.replace(/^#+\s*/, "") : file;
    const summaryLines = [];
    let inSummary = false;
    for (const line of lines) {
      if (inSummary) {
        if (line.trim() === "") break;
        summaryLines.push(line.trim());
      } else if (line === headingLine) {
        inSummary = true;
      }
    }
    const summary = summaryLines.join(" ");
    overview.push({ name, summary });
  }
  if (format === "json") {
    return overview;
  }
  const mdLines = overview.map(
    (item) => `## ${item.name}\n\n${item.summary}\n`
  );
  return mdLines.join("\n");
}

/**
 * Process --diagram CLI flag.
 * @param {string[]} args
 * @returns {Promise<boolean>}
 */
export async function processDiagram(args) {
  if (!args.includes("--diagram")) {
    return false;
  }
  const formatArg = args.find((a) => a.startsWith("--format="));
  const format = formatArg ? formatArg.split("=")[1] : "markdown";
  const diagram = generateDiagram(format);
  if (format === "json") {
    console.log(JSON.stringify(diagram));
  } else {
    console.log(diagram);
  }
  return true;
}

/**
 * Process --features-overview CLI flag.
 * @param {string[]} args
 * @returns {Promise<boolean>}
 */
export async function processFeaturesOverview(args) {
  if (!args.includes("--features-overview")) {
    return false;
  }
  const formatArg = args.find((a) => a.startsWith("--format="));
  const format = formatArg ? formatArg.split("=")[1] : "markdown";
  const overview = await generateFeaturesOverview(format);
  if (format === "json") {
    console.log(JSON.stringify(overview));
  } else {
    console.log(overview);
  }
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
  --diagram [--format=json|markdown]          Generate a workflow interaction diagram describing CLI → SQS Lambda handler steps.
  --features-overview [--format=json|markdown] Generate a consolidated overview of archived feature documents under sandbox/features/archived/.
  --digest                   Run a full bucket replay simulating an SQS event.
  --version                  Show version information with current timestamp.
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
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
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
  if (await processDiagram(args)) {
    if (VERBOSE_STATS) {
      console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
    }
    return;
  }
  if (await processFeaturesOverview(args)) {
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
