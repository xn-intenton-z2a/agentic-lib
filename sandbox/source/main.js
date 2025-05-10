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
    "processDigest",
    "createSQSEventFromDigest",
    "digestLambdaHandler",
    "logError",
  ];
  const links = [
    { from: "CLI", to: "main" },
    { from: "main", to: "processDiagram" },
    { from: "processDiagram", to: "generateDiagram" },
    { from: "main", to: "processFeaturesOverview" },
    { from: "processFeaturesOverview", to: "generateFeaturesOverview" },
    { from: "main", to: "processDigest" },
    { from: "processDigest", to: "createSQSEventFromDigest" },
    { from: "createSQSEventFromDigest", to: "digestLambdaHandler" },
    { from: "digestLambdaHandler", to: "logError" },
  ];
  const errors = [];
  if (format === "json") {
    return { nodes, links, errors };  
  }
  const lines = ["```mermaid", "flowchart LR"];
  links.forEach((l) =>
    lines.push(`  ${l.from.replace(/\s+/g, '')} --> ${l.to.replace(/\s+/g, '')}`)
  );
  lines.push("```");
  return lines.join("\n");
}

/**
 * Generate an overview of archived features in sandbox/features/archived.
 * @param {string} format - 'json' or 'markdown'
 * @returns {Promise<string|Array>}
 */
export async function generateFeaturesOverview(format = "markdown") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const archivedDir = path.join(__dirname, "..", "features", "archived");
  let files;
  try {
    files = await fs.readdir(archivedDir);
  } catch (err) {
    logError("Failed to read archived features directory", err);
    return format === "json" ? [] : "";
  }
  const items = [];
  for (const file of files) {
    if (file.endsWith(".md")) {
      const name = path.basename(file, ".md");
      try {
        const content = await fs.readFile(path.join(archivedDir, file), "utf8");
        const summary = content.trim();
        items.push({ name, summary });
      } catch (err) {
        logError(`Failed to read feature file ${file}`, err);
      }
    }
  }
  if (format === "json") {
    return items;
  }
  return items.map((i) => `## ${i.name}\n\n${i.summary}`).join("\n\n");
}

/**
 * Process the --diagram flag.
 * @param {string[]} args
 * @returns {Promise<boolean>}
 */
export async function processDiagram(args) {
  if (args.includes("--diagram")) {
    const format = args.includes("--format=json") ? "json" : "markdown";
    const diag = generateDiagram(format);
    if (format === "json") {
      console.log(JSON.stringify(diag));
    } else {
      console.log(diag);
    }
    return true;
  }
  return false;
}

/**
 * Process the --features-overview flag.
 * @param {string[]} args
 * @returns {Promise<boolean>}
 */
export async function processFeaturesOverview(args) {
  if (args.includes("--features-overview")) {
    const format = args.includes("--format=json") ? "json" : "markdown";
    const overview = await generateFeaturesOverview(format);
    if (format === "json") {
      console.log(JSON.stringify(overview));
    } else {
      console.log(overview);
    }
    return true;
  }
  return false;
}

/**
 * Function to generate CLI usage instructions.
 * @returns {string}
 */
function generateUsage() {
  return `
Usage:
  --diagram [--format=json]                       Generate workflow interaction diagram.
  --features-overview [--format=json|markdown]    Generate features overview.
  --diagram --features-overview [--format=json|markdown]  Generate both workflow diagram and features overview combined.
`;
}

/**
 * Main CLI entry point
 * @param {string[]} args
 */
export async function main(args = process.argv.slice(2)) {
  const showDiagram = args.includes("--diagram");
  const showFeatures = args.includes("--features-overview");
  const formatJson = args.includes("--format=json");
  if (showDiagram && showFeatures) {
    if (formatJson) {
      const diag = generateDiagram("json");
      const features = await generateFeaturesOverview("json");
      const combined = { ...diag, featuresOverview: features };
      console.log(JSON.stringify(combined));
    } else {
      const md1 = generateDiagram();
      const md2 = await generateFeaturesOverview();
      console.log(`${md1}\n\n${md2}`);
    }
    return;
  }
  if (await processDiagram(args)) {
    return;
  }
  if (await processFeaturesOverview(args)) {
    return;
  }
  console.log("No command argument supplied.");
  console.log(generateUsage());
}
