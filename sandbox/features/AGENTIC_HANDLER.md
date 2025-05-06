# Purpose
Extend the existing agenticHandler to surface API token usage and estimated cost alongside the parsed result, giving discussion workflows visibility into resource consumption.

# Value Proposition
By reporting prompt token counts, completion token counts, total tokens, and estimated USD cost per invocation, discussion bots and automation pipelines can monitor and optimize OpenAI API usage and budget in real time.

# Success Criteria & Requirements
* Update agenticHandler signature to accept an optional options.costRates object with fields promptTokens and completionTokens, defaulting to 0.002 and 0.0025 respectively.
* Invoke OpenAI API via createChatCompletion and capture response.data.usage and response.data.choices[0].message.content.
* Parse the JSON content into a JavaScript object for the result field.
* Extract usage metrics: prompt_tokens, completion_tokens, total_tokens.
* Calculate cost as (prompt_tokens/1000)*promptTokens + (completion_tokens/1000)*completionTokens.
* Return an object with keys result, usage, and cost.
* Increment globalThis.callCount exactly once per handler invocation.
* Log start with logInfo and logError on API or parsing failures; throw a descriptive error on parse failure or API error.

# Implementation Details
1. In src/lib/main.js locate the existing async function agenticHandler(taskPrompt, options?).
2. Change its signature to async function agenticHandler(taskPrompt, options = {}) and inside destructure costRates = options.costRates || { promptTokens: 0.002, completionTokens: 0.0025 }.
3. Before calling createChatCompletion, call logInfo with a message indicating invocation start.
4. Await the API call, then extract usage and content from response.data.choices[0].message.content.
5. Parse the content with JSON.parse into parsedResult; on JSON.parse failure catch error, call logError with error and rethrow.
6. Compute cost = (usage.prompt_tokens / 1000) * costRates.promptTokens + (usage.completion_tokens / 1000) * costRates.completionTokens.
7. Increment globalThis.callCount.
8. Return { result: parsedResult, usage, cost }.
9. Add unit tests in tests/unit/main.test.js to mock createChatCompletion returning usage and JSON content; verify returned object, cost calculation with default and custom costRates, and callCount increment.
10. Update README.md under API Usage to document the new return shape and options.costRates, with examples showing how to call agenticHandler and interpret usage and cost.

# Verification & Acceptance
* Run npm test to confirm new tests pass and existing tests are unaffected.
* Test agenticHandler with default costRates yields correct cost values and increments callCount once.
* Test agenticHandler with custom costRates yields expected cost.
* Verify logInfo is called at start and logError on parsing errors.
* Confirm README.md examples render correctly without formatting issues.