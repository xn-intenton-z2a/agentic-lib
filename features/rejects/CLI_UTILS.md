# CLI_UTILS Feature Specification

This update refines and enhances the integrated command line interface (CLI) utility summary functionality to display a comprehensive, color-coded list of all available CLI commands. The functionality is invoked via the `--cli-utils` flag, enabling users to quickly reference the complete set of commands and their descriptions.

## Objectives

- Provide a single, well-structured CLI summary output that details every available command including usage instructions.
- Leverage color formatting (using chalk) to improve readability of command names and descriptions.
- Ensure that the output is fully consistent with the documentation in README.md and covers all recently added CLI commands such as `--help`, `--digest`, `--agentic`, `--version`, `--verbose`, `--diagnostics`, `--status`, `--dry-run`, `--simulate-error`, `--simulate-delay`, `--apply-fix`, and the new `--cli-utils` flag.

## Implementation Details

- **Function Update:** The `cliUtilsHandler` function in the source file has been updated to iterate through an array of command objects and print out a formatted summary using chalk. Commands are displayed in blue and their descriptions in white, ensuring clarity.

- **Command Coverage:** The CLI summary now includes:
  - `--help`: Show usage instructions.
  - `--digest`: Process a sample digest SQS event.
  - `--agentic <jsonPayload>`: Process a single or batch agentic command.
  - `--version`: Display version information with timestamp.
  - `--verbose`: Enable detailed logging.
  - `--diagnostics`: Output detailed environment diagnostics.
  - `--status`: Display runtime stat summary in JSON format.
  - `--dry-run`: Execute a dry run without side effects.
  - `--simulate-error`: Simulate an error scenario and exit with non-zero status.
  - `--simulate-delay <ms>`: Simulate processing delay for the provided duration.
  - `--apply-fix`: Apply automated fixes and log a success message.
  - `--cli-utils`: Display this complete summary.

## User Scenarios

1. **New User**: When a new user invokes the CLI with the `--cli-utils` flag, they immediately see a formatted list of all available commands, aiding in faster onboarding and usage.

2. **Debugging & Support**: Users can quickly confirm command availability and proper formatting, which is useful for support and troubleshooting.

## Success Criteria & Verification

- The output of `node src/lib/main.js --cli-utils` must include a formatted list with all commands and correct descriptions as updated in the README.
- Unit tests (in tests/unit/main.test.js) verify that the CLI summary output contains all expected command entries without missing or malformed descriptions.
- No additional files are created; modifications are confined to the CLI handler, test cases, and accompanying documentation updates in the README.

## Dependencies & Constraints

- The update adheres to Node 20+ and ECMAScript Module standards.
- Changes are limited to source, test, README, and dependency file content adjustments.

By delivering a consolidated and structured CLI utilities summary, this feature enhances user interaction and aligns with the overarching mission of making agentic operations transparent and accessible.
