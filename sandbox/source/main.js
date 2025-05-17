#!/usr/bin/env node
// sandbox/source/main.js

import { fileURLToPath } from "url";
import { z } from "zod";
import dotenv from "dotenv";
import http from "http";
import { Configuration, OpenAIApi } from "openai";

// Initialize global callCount to support test mocks that reference it
if (typeof globalThis.callCount === "undefined") {
  globalThis.callCount = 0;
}

dotenv.config();

// Development defaults for testing
if (process.env.VITEST || process.env.NODE_ENV === "development") {
  process.env.GITHUB_API_BASE_URL = process.env.GITHUB_API_BASE_URL || "https://api.github.com";
  process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || "key-test";
}

const configSchema = z.object({
  GITHUB_API_BASE_URL: z.string().url().optional(),
  OPENAI_API_KEY: z.string().optional(),
});
export const config = configSchema.parse(process.env);

// Logging helpers
function formatLogEntry(level, message, additionalData = {}) {
  return {
    level,
    timestamp: new Date().toISOString(),
    message,
    ...additionalData,
  };
}

export function logInfo(message) {
  const logObj = formatLogEntry("info", message);
  console.log(JSON.stringify(logObj));
}

export function logError(message, error) {
  const additionalData = { error: error ? error.toString() : undefined };
  if (error && error.stack) {
    additionalData.stack = error.stack;
  }
  const logObj = formatLogEntry("error", message, additionalData);
  console.error(JSON.stringify(logObj));
}

// SQS helpers and lambda
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

// Agentic Handler: fetch GitHub issue and generate suggestions via OpenAI
export async function agenticHandler(eventPayload) {
  const schema = z
    .object({
      issueUrl: z.string().url().optional(),
      issueId: z.number().int().optional(),
    })
    .refine((data) => data.issueUrl || data.issueId, {
      message: "Either issueUrl or issueId must be provided",
    });
  const { issueUrl, issueId } = schema.parse(eventPayload);
  // Build GitHub API URL
  let apiUrl;
  if (issueUrl) {
    const url = new URL(issueUrl);
    const parts = url.pathname.split("/").filter(Boolean);
    // Expect [owner, repo, 'issues', number]
    if (parts.length < 4 || parts[2] !== "issues") {
      throw new Error("Invalid issueUrl format");
    }
    const [owner, repo, , number] = parts;
    apiUrl = `${config.GITHUB_API_BASE_URL}/repos/${owner}/${repo}/issues/${number}`;
  } else {
    throw new Error("issueId without issueUrl not supported");
  }
  // Fetch issue details
  const response = await fetch(apiUrl, { headers: { Accept: "application/vnd.github+json" } });
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }
  const issue = await response.json();
  // Initialize OpenAI client
  const client = new OpenAIApi(new Configuration({ apiKey: config.OPENAI_API_KEY }));
  // Prepare prompts
  const systemPrompt = "You are an automated code assistant that provides suggestions based on GitHub issue content.";
  const userPrompt = `Title: ${issue.title}\nBody: ${issue.body}`;
  let completion;
  try {
    completion = await client.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Please suggest structured improvements or next steps for the following GitHub issue:\n${userPrompt}`,
        },
      ],
    });
  } catch (err) {
    throw new Error(`OpenAI API error: ${err.message}`);
  }
  const content = completion.data.choices?.[0]?.message?.content;
  let suggestions;
  try {
    suggestions = JSON.parse(content);
  } catch (err) {
    throw new Error(`Invalid JSON from OpenAI: ${err.message}`);
  }
  return { suggestions };
}

// CLI usage generator
function generateUsage() {
  return `
Usage:
  --help                      Show this help message and usage instructions.
  --digest                    Run a full bucket replay simulating an SQS event.
  --version                   Show version information with current timestamp.
  --agentic <issueUrl|issueId>  Generate AI-driven suggestions for a GitHub issue.
  --serve                     Start HTTP server with /agentic endpoint.
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
      const { readFileSync } = await import("fs");
      const packageJsonPath = new URL("../../package.json", import.meta.url);
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
      const versionInfo = { version: packageJson.version, timestamp: new Date().toISOString() };
      console.log(JSON.stringify(versionInfo));
    } catch (error) {
      logError("Failed to retrieve version", error);
    }
    return true;
  }
  return false;
}

async function processDigest(args) {
  if (args.includes("--digest")) {
    const exampleDigest = { key: "events/1.json", value: "12345", lastModified: new Date().toISOString() };
    const sqsEvent = createSQSEventFromDigest(exampleDigest);
    await digestLambdaHandler(sqsEvent);
    return true;
  }
  return false;
}

async function processAgentic(args) {
  const idx = args.indexOf("--agentic");
  if (idx !== -1) {
    const value = args[idx + 1];
    if (!value) {
      logError("Missing value for --agentic flag");
      return true;
    }
    try {
      const result = await agenticHandler({ issueUrl: value });
      console.log(JSON.stringify(result));
    } catch (err) {
      console.error(JSON.stringify({ error: { message: err.message } }));
      process.exit(1);
    }
    return true;
  }
  return false;
}

function startServer() {
  const PORT = process.env.PORT || 3000;
  const server = http.createServer((req, res) => {
    if (req.method === "POST" && req.url === "/agentic") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", async () => {
        res.setHeader("Content-Type", "application/json");
        try {
          const payload = JSON.parse(body);
          const result = await agenticHandler(payload);
          res.statusCode = 200;
          res.end(JSON.stringify(result));
        } catch (err) {
          const msg = err.message || "Internal error";
          const code = msg.startsWith("GitHub API error") || msg.includes("Invalid") ? 400 : 500;
          res.statusCode = code;
          res.end(JSON.stringify({ error: { message: msg } }));
        }
      });
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: { message: "Not Found" } }));
    }
  });
  server.listen(PORT, () => {
    console.log(JSON.stringify({ level: "info", message: `HTTP server listening on port ${PORT}` }));
  });
}

function processServe(args) {
  if (args.includes("--serve")) {
    startServer();
    return true;
  }
  return false;
}

// Main CLI entrypoint
export async function main(args = process.argv.slice(2)) {
  if (processHelp(args)) return;
  if (await processVersion(args)) return;
  if (await processDigest(args)) return;
  if (await processAgentic(args)) return;
  if (processServe(args)) return;

  console.log("No command argument supplied.");
  console.log(generateUsage());
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    logError("Fatal error in main execution", err);
    process.exit(1);
  });
}
