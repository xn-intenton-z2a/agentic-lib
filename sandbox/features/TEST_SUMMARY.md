# Objective and Scope

Extend the existing test console output summarizer to provide a dedicated `--summarize-tests` CLI command. This command will read a Vitest JSON results file, aggregate key metrics, and emit a structured JSON summary via the logging utilities. It maintains compatibility with existing summarizer behavior and leverages logInfo for consistent output.

# Value Proposition

By introducing a first-class summarization command, developers and CI systems can quickly obtain a machine-readable overview of test outcomes. This simplifies pipeline integrations, dashboard reporting, and automated alerts based on test health, without manual parsing of raw output.

# Requirements

## CLI Integration

- In `src/lib/main.js`, add a new function `processSummarizeTests(args)` that:
  - Detects the `--summarize-tests` flag with an optional file path argument (default `tests/results.json`).
  - Reads and parses the specified JSON file using `fs.promises.readFile`.
  - Extracts summary fields: total tests, passed, failed, skipped, duration, and array of failure details (test name and message).
  - Emits the summary object via `logInfo` in JSON form.
- In the `main` function, invoke `await processSummarizeTests(args)` before falling back to usage instructions.

## Source File Updates

- Import `fs/promises` at the top of `main.js`.
- Implement `processSummarizeTests` that handles file read errors by calling `logError` and exiting with code 1.
- Ensure existing CLI flags (`--help`, `--version`, `--digest`) remain unchanged.

## Test File Updates

- Create `tests/unit/summarizeTests.test.js` to cover:
  - Successful parsing: write a temporary JSON file with known values, invoke `main(["--summarize-tests", tempFilePath])`, capture stdout, parse JSON, and assert fields.
  - Missing file or invalid JSON: simulate missing path or corrupt content, capture stderr, and assert `logError` output with error message.
- Maintain isolation by mocking `process.exit` if needed and resetting `VERBOSE_MODE` environment.

## README Updates

- Under CLI Usage, document the new `--summarize-tests [file]` option, its default behavior, and example:

  npx agentic-lib --summarize-tests tests/results.json

- Add a usage example showing summary JSON output.

## Dependencies File

- No new dependencies required; use built-in `fs/promises`.

# Verification and Acceptance

- Unit tests for `processSummarizeTests` must achieve at least 90% branch coverage, including error handling.
- Integration test: simulate a Vitest run dumping JSON to file, running `--summarize-tests`, and verifying the summary is logged correctly.
- Manual verification: run `npx agentic-lib --summarize-tests` after generating a results JSON and confirm structured JSON appears in stdout.