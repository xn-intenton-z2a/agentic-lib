# Purpose
Add a new function agenticHandler that uses OpenAI to process a task prompt and return a refined JSON result.

# Value Proposition
- Empowers repositories with autonomous task refinement via AI
- Aligns with mission to enable agentic workflows

# Success Criteria & Requirements
- Expose async function agenticHandler(taskPrompt, options?)
- Load OPENAI_API_KEY from config and initialize OpenAIApi client
- Increment globalThis.callCount on each invocation
- Call createChatCompletion with taskPrompt and options
- Parse JSON response content into a JavaScript object or throw a descriptive error if parsing fails
- Include tests covering successful responses and error scenarios

# Implementation Details
- Import Configuration and OpenAIApi from openai package
- Initialize apiClient with new OpenAIApi(new Configuration({ apiKey: config.OPENAI_API_KEY }))
- Define and export agenticHandler in the existing src/lib/main.js file
- agenticHandler should wrap the OpenAI call in try catch and use logInfo and logError for observability
- Update README.md to document agenticHandler API usage with examples

# Verification & Acceptance
- Write unit tests using Vitest with the default openai mock to verify returned object matches expected
- Verify globalThis.callCount increments on each call to agenticHandler
- Ensure existing functionality and tests continue to pass without modification