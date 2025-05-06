# Purpose
Extend the agenticHandler function to include detailed token usage and cost metrics alongside the refined JSON result, enabling insights into API consumption and expenses for discussion bot summaries.

# Value Proposition
Provide transparency into OpenAI API usage by surfacing token counts and estimated cost per invocation. Discussion workflows and bots can now track and optimize their resource consumption and budget in real time.

# Success Criteria & Requirements
* Update agenticHandler(taskPrompt, options?) exported from src/lib/main.js to:
  - Accept an optional options.costRates object with fields:
    • promptTokens: cost per 1000 prompt tokens (number, default 0.002)
    • completionTokens: cost per 1000 completion tokens (number, default 0.0025)
* Invoke createChatCompletion and capture the full response including data.choices and data.usage.
* Parse JSON from response.data.choices[0].message.content into a JavaScript object.
* Extract usage metrics: prompt_tokens, completion_tokens, total_tokens from response.data.usage.
* Calculate estimated cost as:
  (usage.prompt_tokens / 1000) * costRates.promptTokens +
  (usage.completion_tokens / 1000) * costRates.completionTokens
* Return an object:
  {
    result: <parsed JSON>,
    usage: { prompt_tokens, completion_tokens, total_tokens },
    cost: <calculated cost in USD>
  }
* Increment globalThis.callCount exactly once per invocation of agenticHandler.
* Log start with logInfo and logError on failures, throwing a descriptive error if parsing fails or API call errors.

# Implementation Details
1. In src/lib/main.js, locate the existing agenticHandler definition below utilities.
2. Update its signature to: async function agenticHandler(taskPrompt, options = {}) and destructure const costRates = options.costRates || { promptTokens: 0.002, completionTokens: 0.0025 }.
3. Before calling the OpenAI API, logInfo("Starting agenticHandler invocation").
4. After receiving the response, access const usage = response.data.usage and const content = response.data.choices[0].message.content.
5. Parse content with JSON.parse into parsedResult; on failure catch and logError then rethrow.
6. Compute cost = (usage.prompt_tokens/1000)*costRates.promptTokens + (usage.completion_tokens/1000)*costRates.completionTokens.
7. Increment globalThis.callCount.
8. Return { result: parsedResult, usage, cost }.
9. Update the README.md under the API Usage section to document the new return shape and options.costRates parameter with example invocation.
10. In tests/unit/main.test.js, add tests that:
    - Mock OpenAIApi.createChatCompletion to return a data.usage object and a JSON content.
    - Verify agenticHandler returns the expected result object including correct usage fields and cost calculation using default and custom costRates.
    - Confirm globalThis.callCount increments once per call.

# Verification & Acceptance
* Run npm test to ensure all new and existing tests pass.
* Test agenticHandler with default costRates and custom costRates, asserting correct cost values.
* Verify error handling logs and throws on invalid JSON responses.
* Confirm README.md examples render correctly without formatting errors.