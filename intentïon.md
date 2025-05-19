# Mission Statement

**agentic‑lib** Is a JavaScript library which can be used as a drop in JS implementation or wholesale replacement for 
the steps, jobs, and re-usable workflows below in this repository. It is designed to be used in a GitHub Actions 
workflow to enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate
through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be
invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.
## Maintain Feature at 2025-05-19T19:53:53.511Z

Maintained feature AGENTIC_HANDLER.

Git diff:

```

```

LLM API Usage:

```json
{"prompt_tokens":6119,"completion_tokens":1861,"total_tokens":7980,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1344,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Feature to Issue at 2025-05-19T19:54:58.209Z

Generated feature development issue https://github.com/xn-intenton-z2a/agentic-lib/issues/1531 with title:

Implement agenticHandler with call counting, API integration, and robust error handling

And description:

Objective:\nAdd a new exported function named `agenticHandler` in `src/lib/main.js` that serves as the primary orchestrator for agentic operations. It should accept any serializable input, maintain a global call counter, perform a chat completion via the OpenAI API, parse the JSON payload from the response, and handle errors gracefully.\n\nScope of Work:\n1. **src/lib/main.js**\n   - Import `Configuration` and `OpenAIApi` from the `openai` package.\n   - Export an `async` function `agenticHandler(inputData)` that:  \n     - Increments `globalThis.callCount` by one at the very start.  \n     - Constructs an OpenAI client using `OPENAI_API_KEY` from `config`.  \n     - Calls `createChatCompletion` with a `gpt-3.5-turbo` (or configured) chat request, sending `JSON.stringify(inputData)` as the user message.  \n     - Parses `response.data.choices[0].message.content` via `JSON.parse` and returns the resulting object.  \n     - Wraps API call and JSON parsing in `try/catch`; on error, call `logError('agenticHandler error', error)`, then rethrow the original error.\n\n2. **tests/unit/main.test.js**\n   - Add a new test suite `describe('agenticHandler', ...)` covering:\n     - **Success case**: With the default `openai` mock returning a valid JSON string, verify that `agenticHandler` returns the parsed object and that `globalThis.callCount` increments from 0 to 1.\n     - **Error case**: Mock `OpenAIApi.prototype.createChatCompletion` to throw an error; spy on `logError`, ensure the error is rethrown by `agenticHandler` and that `logError` was called with correct arguments.\n   - Ensure `globalThis.callCount` is reset before each test.\n\n3. **sandbox/README.md**\n   - Add an **API Reference** section documenting `agenticHandler(inputData) → Promise<object>`.\n   - Include a brief description of its parameters, return value, side-effects (callCount tracking), and an example snippet:\n   ```js\n   import { agenticHandler } from '@xn-intenton-z2a/agentic-lib';\n   \n   const result = await agenticHandler({ task: 'summarize', data: 'Hello world' });\n   console.log(result); // Parsed JSON response from LLM\n   ```\n\nVerification & Acceptance Criteria:\n- All existing tests (including unaffected main and module-index tests) and newly added agenticHandler tests pass without regression.\n- `globalThis.callCount` increments exactly once per call to `agenticHandler`.\n- Errors from the OpenAI client or JSON parsing are logged via `logError` (including stack trace when available) and the original error propagates out of `agenticHandler`.\n- README reflects the new API entry without altering other sections.\n\nNo other files should be created or deleted. The LLM can update these files in a single pass to satisfy the feature spec and success criteria.

LLM API Usage:

```json
{"prompt_tokens":6838,"completion_tokens":1778,"total_tokens":8616,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1024,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Feature to enhanced Issue at 2025-05-19T19:56:06.976Z

Updated feature development issue https://github.com/xn-intenton-z2a/agentic-lib/issues/1531 with enhanced description:

**Objective:**
Add and export a new asynchronous function `agenticHandler(inputData)` in `src/lib/main.js` that serves as the primary orchestrator for agentic operations, integrating with the OpenAI Chat Completion API, tracking call counts, and handling errors gracefully.

**Requirements:**
1. `agenticHandler` must accept a single parameter `inputData` (any JSON-serializable object).
2. Increment `globalThis.callCount` by 1 at the very start of the function.
3. Construct an OpenAI client using `new OpenAIApi(new Configuration({ apiKey: config.OPENAI_API_KEY }))`.
4. Call `createChatCompletion` with model `gpt-3.5-turbo` (or override via config), sending `JSON.stringify(inputData)` as the user message in the chat payload.
5. Parse the response string at `response.data.choices[0].message.content` using `JSON.parse` and return the resulting JavaScript object.
6. Wrap the API call and JSON parsing in a `try/catch` block. On any error, call `logError('agenticHandler error', error)` and rethrow the original error.

**Testable Acceptance Criteria:**
- Unit Test — Success Case:
  • Mock `OpenAIApi.prototype.createChatCompletion` to return a JSON string payload.
  • Verify `agenticHandler` returns the parsed object.
  • Verify `globalThis.callCount` increments exactly once from 0 to 1.

- Unit Test — Error Case:
  • Mock `createChatCompletion` to throw an error.
  • Spy on `logError` to ensure it is invoked with message `'agenticHandler error'` and the thrown error.
  • Verify that `agenticHandler` rethrows the original error.

- Integration Checks:
  • Existing tests in `tests/unit/main.test.js` and `tests/unit/module-index.test.js` (unrelated to `agenticHandler`) continue to pass without modification.

- Documentation:
  • Update `sandbox/README.md` with an **API Reference** section describing `agenticHandler(inputData) → Promise<object>`.
  • Include parameter description, return value, side-effects (call count tracking), and an example snippet:
    ```js
    import { agenticHandler } from '@xn-intenton-z2a/agentic-lib';

    const result = await agenticHandler({ task: 'summarize', data: 'Hello world' });
    console.log(result); // Parsed JSON response from LLM
    ```

No additional files should be created or deleted; implement all changes in a single pass to meet the above criteria.

LLM API Usage:

```json
{"prompt_tokens":7605,"completion_tokens":1268,"total_tokens":8873,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":640,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

# Activity Log

## Discussions activity at 2025-05-19T19:56:26.391Z

Hello @Antony-at-Polycode 👋

As requested, I’m seeding the repository now. The mission detail is left blank per your instructions. You can review the newly added initial scaffolding and let me know if you’d like to refine the mission statement or adjust anything else!

[Posted on "https://github.com/xn-intenton-z2a/agentic-lib/discussions/1318#discussioncomment-13198093" by the repository bot which took the action "seed-repository" with the detail "".]

LLM API Usage:

```json
{"prompt_tokens":38467,"completion_tokens":87,"total_tokens":38554,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":0,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}

```
---

2025-05-19T19:57:29Z - Archiving intentïon to branch https://github.com/xn-intenton-z2a/agentic-lib/tree/intention-2025-05-19T19-57Z

