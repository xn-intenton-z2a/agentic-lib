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

## Feature to Issue at 2025-05-19T20:21:45.968Z

Generated feature development issue with title Add --mission CLI flag to display project mission statement.

LLM API Usage:

```json
{"prompt_tokens":6860,"completion_tokens":1896,"total_tokens":8756,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1472,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Issue to Code at 2025-05-19T20:26:41.475Z

fixApplied: true

Add --mission CLI flag to display project mission statement

Git Diff:

```


```
mainOutput:```

> @xn-intenton-z2a/agentic-lib@6.7.5-0 start
> node src/lib/main.js

{"level":"info","timestamp":"2025-05-19T20:26:17.077Z","message":"Configuration loaded","config":{}}
No command argument supplied.

Usage:
  --help                     Show this help message and usage instructions.
  --digest                   Run a full bucket replay simulating an SQS event.
  --version                  Show version information with current timestamp.

```
[for issue https://github.com/xn-intenton-z2a/agentic-lib/issues/1532 with title: ""]

LLM API Usage:

```json
{"prompt_tokens":9422,"completion_tokens":5781,"total_tokens":15203,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":3008,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Issue to Ready Issue at 2025-05-19T20:39:30.809Z

Enhanced issue https://github.com/xn-intenton-z2a/agentic-lib/issues/1532 with action close and updated description:

Implement a new `--mission` command for the CLI to surface the contents of `MISSION.md`, connecting the library’s executable interface directly to its mission statement.

Changes to make:

1. src/lib/main.js
   - Import `readFileSync` from the `fs` module.
   - Add an async function `processMission(args)` that:
     1. Checks if `args` includes `"--mission"`.
     2. Reads the project’s `MISSION.md` (via `new URL('../../../MISSION.md', import.meta.url)`).
     3. Logs the raw markdown content to stdout via `console.log`.
     4. Returns `true` when handled.
   - Invoke `processMission(args)` at the top of the CLI dispatch in `main()`, before the existing flags. If it returns `true`, exit early (optionally emitting verbose stats).

2. tests/unit/main.test.js
   - Add a new `describe` block for the `--mission` flag.
   - Mock `fs.readFileSync` to return a predictable mission string (e.g., `'# Test Mission'`).
   - Spy on `console.log`, call `processMission(['--mission'])` (imported from main), and assert that the mission string is printed and the function returns `true`.

3. README.md (root)
   - Under the CLI Usage section, document the new `--mission` flag with a description and example output.
   - Link to `MISSION.md` for full details.

Verification:

- Running `npm test` should pass all existing tests plus the new `--mission` tests.
- Running `node src/lib/main.js --mission` should print the entire `MISSION.md` contents followed by no additional usage text.

LLM API Usage:

```json
{"prompt_tokens":7711,"completion_tokens":1478,"total_tokens":9189,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1024,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Feature to Issue at 2025-05-19T20:47:46.564Z

Generated feature development issue with title Add --validate-mission CLI command to enforce feature-to-mission alignment.

LLM API Usage:

```json
{"prompt_tokens":6860,"completion_tokens":1815,"total_tokens":8675,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1280,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

2025-05-19T21:00:05Z - Archiving intentïon to branch https://github.com/xn-intenton-z2a/agentic-lib/tree/intention-2025-05-19T19-57Z

## Issue to Ready Issue at 2025-05-19T21:40:06.702Z

Enhanced issue https://github.com/xn-intenton-z2a/agentic-lib/issues/1533 with action close and updated description:

We need a new high-impact CLI command (--validate-mission) in src/lib/main.js that scans all sandbox/features/*.md files and ensures each file explicitly references our central mission statement (e.g., contains the word “mission” or a “Mission Alignment” heading). This helps guarantee that every feature spec stays aligned with our MISSION.md.

Implementation details:
1. In src/lib/main.js:
   - Import { readdir, readFile } from "fs/promises".
   - Add a new async function processValidateMission(args) that:
     • Checks if args includes "--validate-mission".
     • Reads the sandbox/features directory.
     • For each .md file, reads the content and verifies it includes the substring "mission" (case-insensitive) or a dedicated Mission heading.
     • Logs an info summary if all files pass; otherwise logs an error for each non-compliant file and exits with a non-zero error code.
   - Wire processValidateMission into the main command flow, before the default fallback, so `node src/lib/main.js --validate-mission` runs it and then exits.
2. Update tests in tests/unit/main.test.js:
   - Add mocks for fs/promises methods (readdir, readFile) to simulate:
     a. All feature files contain the term “mission”: expect processValidateMission to console.log a success and return.
     b. One or more files missing “mission”: expect logError calls and an exception or non-zero exit.
   - Use vi.mock or vi.spyOn to stub filesystem calls and capture console output.
3. Update sandbox/README.md:
   - Document the new --validate-mission flag under CLI Usage, explaining its purpose, behavior, and exit codes.
4. Dependencies:
   - No new dependencies required; fs/promises is built-in. Only update import statements if necessary.

Acceptance & Verification:
• `npm test` passes all existing and new tests.
• Running `node src/lib/main.js --validate-mission` exits with code 0 when all feature files reference the mission, or code 1 with error logs if any do not.
• README updates clearly describe the new flag and usage examples.
• Follow existing ESM/Node20 conventions, pass linting & formatting checks.

LLM API Usage:

```json
{"prompt_tokens":7847,"completion_tokens":1906,"total_tokens":9753,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1344,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Feature to Issue at 2025-05-19T21:46:29.159Z

Generated feature development issue with title Add --mission CLI option to display repository mission statement.

LLM API Usage:

```json
{"prompt_tokens":6860,"completion_tokens":1520,"total_tokens":8380,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1152,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

