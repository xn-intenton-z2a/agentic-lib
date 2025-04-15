# Feature: CLI and Lambda Utilities for Agentic Processing

This feature describes the behavior of a JavaScript-based command-line interface (CLI) and Lambda handlers that support logging, configuration, and command processing for an "agentic" system. The system includes utility functions for diagnostics, AWS SQS event handling, batch command processing, and CLI operation modes.

---

## Scenario: Environment Initialization

**Given** the application starts,

**Then** it:
- Loads environment variables from `.env` file or system environment.
- Uses defaults in test or development environments:
  - `GITHUB_API_BASE_URL` set to a test URL.
  - `OPENAI_API_KEY` set to a test key.
- Validates the environment with a schema.

---

## Scenario: Logging Configuration

**Given** a log event occurs,

**Then** the system:
- Logs messages with ISO timestamps and severity level (`info` or `error`).
- Adds error stacks when verbose mode is enabled.
- Includes metadata for diagnostics and debugging.

---

## Scenario: SQS Digest Lambda Handler

**When** the `digestLambdaHandler` receives an SQS event,

**Then** it:
- Processes one or more records.
- Logs each digest received.
- Collects and returns failures if records have invalid JSON.
- Returns a structure with `batchItemFailures` for SQS partial failure retry.

---

## Scenario: Agentic Command Handler

**When** the `agenticHandler` processes a payload,

**Then**:
- **If** the payload has a `commands` array:
  - Validates the array structure.
  - Enforces a maximum batch size if `MAX_BATCH_COMMANDS` is set.
  - Logs and processes each command individually.
  - Returns a success object with timestamps and execution times.
- **If** the payload has a single `command`:
  - Validates it is a non-empty, actionable string.
  - Processes and logs the command.
  - Returns metadata including execution time.
- **If** invalid input is detected:
  - Logs an error and throws an exception.

---

## Scenario: CLI Argument Handling

**When** the script is run from the command line,

**Then** it supports the following flags:

| Flag              | Behavior                                                                 |
|-------------------|--------------------------------------------------------------------------|
| `--help`          | Prints a usage summary.                                                  |
| `--digest`        | Triggers the `digestLambdaHandler` with a sample SQS event.             |
| `--agentic <json>`| Processes a command payload using the `agenticHandler`.                 |
| `--version`       | Loads and displays version info from `package.json`.                    |
| `--verbose`       | Enables verbose logging globally.                                        |
| `--diagnostics`   | Logs detailed environment and runtime info.                              |
| `--status`        | Prints runtime health (config, node version, call count, uptime).        |
| `--dry-run`       | Does nothing; logs that no action was taken.                             |
| `--simulate-error`| Logs and throws a simulated fatal error, exiting with code 1.            |

---

## Scenario: Verbose and Diagnostic Mode

**When** verbose mode is active,

**Then**:
- All logs include a `verbose` flag.
- Full error stacks are printed.
- Diagnostics print environmental and version context.

---

## Scenario: Status Handler

**When** `statusHandler()` is called,

**Then** it returns:
- Current config values.
- Node.js version and uptime.
- Invocation `callCount`.
- Environment variables like `NODE_ENV` and `OPENAI_API_KEY`.

---

## Scenario: Error Simulation

**When** `--simulate-error` is provided,

**Then**:
- A simulated error is logged.
- The process exits with a failure code.

---

## Tags
- `@cli`
- `@lambda`
- `@agentic`
- `@sqs`
- `@logging`
- `@diagnostics`

---

## Examples

| Command                        | Effect                                              |
|--------------------------------|-----------------------------------------------------|
| `node main.js --help`         | Shows usage options.                                |
| `node main.js --agentic '{"command":"Hello"}'` | Processes a single agentic command.         |
| `node main.js --digest`       | Simulates an SQS digest Lambda event.               |
| `node main.js --status`       | Prints runtime status.                              |
| `node main.js --simulate-error`| Logs and exits with a simulated error.             |

---
