#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import chalk from "chalk";
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

export function logConfig() {
  console.log(
    JSON.stringify({
      level: "info",
      timestamp: new Date().toISOString(),
      message: "Configuration loaded",
      config: {
        GITHUB_API_BASE_URL: config.GITHUB_API_BASE_URL,
        OPENAI_API_KEY: config.OPENAI_API_KEY,
      },
    })
  );
}
logConfig();

// ---------------------------------------------------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------------------------------------------------

export function logInfo(message) {
  console.log(JSON.stringify({ level: "info", timestamp: new Date().toISOString(), message }));
}

export function logError(message, error) {
  console.error(
    JSON.stringify({
      level: "error",
      timestamp: new Date().toISOString(),
      message,
      error: error ? error.toString() : undefined,
    })
  );
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

export async function delegateDecisionToLLMFunctionCallWrapper(prompt, model = "gpt-3.5-turbo", options = {}) {
  console.log(chalk.blue("delegateDecisionToLLMFunctionCallWrapper invoked with prompt:"), prompt);

  // Auto-conversion: if autoConvertPrompt flag is true, convert prompt to a string regardless of its current type
  if (options?.autoConvertPrompt === true) {
    prompt = String(prompt);
  }
  if (typeof prompt === 'string') {
    prompt = prompt.trim();
  }

  // Enhanced input validation: ensure prompt is a non-empty string
  if (typeof prompt !== 'string' || prompt === "") {
    const errorMsg = `Invalid prompt provided; received value: ${prompt} (type: ${typeof prompt}). A non-empty string is required. If you passed a numeric value, please convert it to a string.`;
    console.error(chalk.red(errorMsg));
    return {
      fixed: "false",
      message: errorMsg,
      refinement: "Please provide a valid prompt as a non-empty string. If passing a number, convert it to a string."
    };
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
      refinement: z.string(),
    });
    const tools = [
      {
        type: "function",
        function: {
          name: "review_issue",
          description:
            "Evaluate whether the supplied source file content resolves the issue. Return an object with fixed (string: 'true' or 'false'), message (explanation), and refinement (suggested refinement).",
          parameters: {
            type: "object",
            properties: {
              fixed: { type: "string", description: "true if the issue is resolved, false otherwise" },
              message: { type: "string", description: "A message explaining the result" },
              refinement: { type: "string", description: "A suggested refinement if the issue is not resolved" },
            },
            required: ["fixed", "message", "refinement"],
            additionalProperties: false,
          },
          strict: true,
        },
      },
    ];
    const response = await openai.createChatCompletion({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are evaluating whether an issue has been resolved in the supplied source code. Answer strictly with a JSON object following the provided function schema.",
        },
        { role: "user", content: prompt },
      ],
      tools,
      temperature: options.temperature || 0.7,
    });
    console.log(chalk.blue("Received response from OpenAI:"), response.data);
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
    console.log(chalk.green("LLM function call wrapper parsed response:"), parsed.data);
    return parsed.data;
  } catch (error) {
    console.error("delegateDecisionToLLMFunctionCallWrapper error:", error);
    return { fixed: "false", message: error.message, refinement: "LLM delegation failed." };
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
    `;
}

export async function main(args = process.argv.slice(2)) {
  const exampleDigest = {
    key: "events/1.json",
    value: "12345",
    lastModified: new Date().toISOString(),
  };
  if (args.includes("--help")) {
    console.log(generateUsage());
    return;
  }

  if (args.includes("--digest")) {
    const sqsEvent = createSQSEventFromDigest(exampleDigest);
    await digestLambdaHandler(sqsEvent);
  } else {
    console.log("No command argument supplied.");
    console.log(generateUsage());
  }
}

// if (import.meta.url.endsWith(process.argv[1])) {
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    logError("Fatal error in main execution", err);
    process.exit(1);
  });
}
