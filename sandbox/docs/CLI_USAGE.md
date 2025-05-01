# CLI Usage Documentation

This document describes the CLI commands for agentic-lib.

## Commands

- **--help**

  Displays usage instructions. Example:

      node src/lib/main.js --help

- **--version**

  Outputs the version information in JSON format, including a timestamp. Example:

      node src/lib/main.js --version

- **--digest**

  Simulates an AWS SQS event for a digest message. It processes the event using the `digestLambdaHandler`.
  Errors encountered during processing are logged in a consistent JSON format.

## Error Handling

Errors in digest processing are logged with:
- A descriptive message including the record identifier.
- Structured error details in JSON output.

Example error log:

  {"level": "error", "timestamp": "2025-05-01T20:55:19.536Z", "message": "Failed to process record test-id: Error details...", "error": "Error: ..."}

## Verbose Logging

If `VERBOSE_STATS` is enabled, additional execution statistics like call count and uptime will be logged after processing commands.

## Usage Example

Run the CLI with a command:

    node src/lib/main.js --digest

Review the output logs for details on invocation and error handling.
