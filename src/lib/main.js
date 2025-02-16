#!/usr/bin/env node

import { fileURLToPath } from "url";
import { OpenAI } from "openai";
import { z } from "zod";

// Simulated Chat Completions Response
async function simulateChatCompletion(type) {
  if (type === "verifyIssueFix") {
    return {
      choices: [
        {
          message: {
            content: JSON.stringify({
              fixed: "true",
              message: "The issue has been resolved.",
              refinement: "None"
            })
          }
        }
      ],
      usage: {}
    };
  } else if (type === "updateSourceFile") {
    return {
      choices: [
        {
          message: {
            content: JSON.stringify({
              updatedSourceFileContent: "console.log('Updated content');",
              message: "Updated source file to fix the issue."
            })
          }
        }
      ],
      usage: {}
    };
  }
  return {
    choices: [
      {
        message: {
          content: "{}"
        }
      }
    ],
    usage: {}
  };
}

// Parse response utility
function parseResponse(response, schema) {
  let result;
  if (response.choices[0].message.content) {
    try {
      result = JSON.parse(response.choices[0].message.content);
    } catch (e) {
      throw new Error("Failed to parse response content: " + e.message);
    }
  } else {
    throw new Error("No valid response received from simulated Chat completion.");
  }
  try {
    return schema.parse(result);
  } catch (e) {
    throw new Error("Response validation failed: " + e.message);
  }
}

// ChatGPT Chat Completions Wrapper Functions
export async function verifyIssueFix(params) {
  const {
    sourceFileContent,
    issueTitle,
    issueDescription,
    issueComments,
    model,
    apiKey
  } = params;
  const issueCommentsText = issueComments
    .map((comment) => `Author:${comment.user.login}, Created:${comment.created_at}, Comment: ${comment.body}`)
    .join("\n");
  const prompt = `
Does the following source file content fix the issue?
Source:
${sourceFileContent}

Issue:
title: ${issueTitle}
description: ${issueDescription}
comments:
${issueCommentsText}

Answer with a JSON object:
{
  "fixed": "true", 
  "message": "The issue has been resolved.", 
  "refinement": "None"
}
`;
  // Simulated call instead of an over the wire call
  const response = await simulateChatCompletion("verifyIssueFix");
  const ResponseSchema = z.object({
    fixed: z.string(),
    message: z.string(),
    refinement: z.string()
  });
  const parsed = parseResponse(response, ResponseSchema);
  return { ...parsed, responseUsage: response.usage };
}

export async function updateTargetForFixFallingBuild(params) {
  const {
    sourceFileContent,
    listOutput,
    issueTitle,
    issueDescription,
    model,
    apiKey
  } = params;
  const prompt = `
Update the source file to resolve issues.
Source:
${sourceFileContent}

Dependency list:
${listOutput}

Issue:
title: ${issueTitle}
description: ${issueDescription}

Answer with a JSON object:
{
  "updatedSourceFileContent": "console.log('Updated content');",
  "message": "Updated source file to fix the issue."
}
`;
  // Simulated call
  const response = await simulateChatCompletion("updateSourceFile");
  const ResponseSchema = z.object({
    updatedSourceFileContent: z.string(),
    message: z.string()
  });
  const parsed = parseResponse(response, ResponseSchema);
  return { ...parsed, fixApplied: true, responseUsage: response.usage };
}

export async function updateTargetForStartIssue(params) {
  const {
    sourceFileContent,
    issueTitle,
    issueDescription,
    issueComments,
    model,
    apiKey
  } = params;
  const issueCommentsText = issueComments
    .map((comment) => `Author:${comment.user.login}, Created:${comment.created_at}, Comment: ${comment.body}`)
    .join("\n");
  const prompt = `
Update the source file to resolve the start issue.
Source:
${sourceFileContent}

Issue:
title: ${issueTitle}
description: ${issueDescription}
comments:
${issueCommentsText}

Answer with a JSON object:
{
  "updatedSourceFileContent": "console.log('Updated content for start issue');",
  "message": "Updated source file to resolve the start issue."
}
`;
  // Simulated call
  const response = await simulateChatCompletion("updateSourceFile");
  const ResponseSchema = z.object({
    updatedSourceFileContent: z.string(),
    message: z.string()
  });
  const parsed = parseResponse(response, ResponseSchema);
  return { ...parsed, fixApplied: true, responseUsage: response.usage };
}

// Demo Function
async function main() {
  console.info("=== Chat Completions Wrapper Functions Demo ===");

  try {
    const fixResult = await verifyIssueFix({
      sourceFileContent: "console.log('Hello, world!');",
      issueTitle: "Fix greeting",
      issueDescription: "Update greeting to include user name.",
      issueComments: [{ user: { login: "alice" }, created_at: "2023-01-01", body: "Please fix this." }],
      model: "o3-mini",
      apiKey: "dummy-api-key"
    });
    console.info("verifyIssueFix Result:", fixResult);

    const updateResult = await updateTargetForFixFallingBuild({
      sourceFileContent: "console.log('Old version');",
      listOutput: "dependency list here",
      issueTitle: "Fix failing build",
      issueDescription: "Resolve build issues.",
      model: "o3-mini",
      apiKey: "dummy-api-key"
    });
    console.info("updateTargetForFixFallingBuild Result:", updateResult);

    const startIssueResult = await updateTargetForStartIssue({
      sourceFileContent: "console.log('Initial issue');",
      issueTitle: "Start Issue",
      issueDescription: "Initial issue description.",
      issueComments: [{ user: { login: "bob" }, created_at: "2023-01-02", body: "Initial issue comment." }],
      model: "o3-mini",
      apiKey: "dummy-api-key"
    });
    console.info("updateTargetForStartIssue Result:", startIssueResult);
  } catch (err) {
    console.error("Error in demo:", err.message);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export default {
  verifyIssueFix,
  updateTargetForFixFallingBuild,
  updateTargetForStartIssue,
  main
};
