# Usage Instructions for agentic-lib CLI

This document provides usage details for the agentic-lib command line interface.

## Available Commands

- **--help**: Displays the help message with usage instructions.
- **--digest**: Runs a full bucket replay simulating an SQS event.
- **--agentic <jsonPayload>**: Processes an agentic command using a JSON payload. The payload can contain a single command using a `command` property or a batch of commands using a `commands` array. Each valid command increments an internal invocation counter and returns an `executionTimeMS` value indicating processing time.
- **--version**: Shows version information retrieved from package.json along with the current timestamp.
- **--verbose**: Enables detailed logging for debugging purposes.
- **--diagnostics**: Outputs detailed diagnostics including configuration, Node.js version, and relevant environment variables.
- **--status**: Displays runtime health summary in JSON format including configuration, Node version, call count, and uptime.
- **--dry-run**: Executes a dry run without causing any side effects (prints "Dry-run: No action taken.").
- **--simulate-error**: Simulates an error for testing purposes by triggering an immediate error and exiting with a non-zero status code.
- **--simulate-delay <ms>**: Simulates processing delay for the specified number of milliseconds.
- **--apply-fix**: Applies an automated fix and logs a success message.
- **--cli-utils**: Displays a summary of available CLI commands along with their descriptions.

## Examples

1. **Display Help**:

   ```
   node src/lib/main.js --help
   ```

2. **Process a Single Command**:

   ```
   node src/lib/main.js --agentic '{"command": "doSomething"}'
   ```

3. **Process a Batch of Commands**:

   ```
   node src/lib/main.js --agentic '{"commands": ["cmd1", "cmd2"]}'
   ```

4. **Simulate a Dry Run**:

   ```
   node src/lib/main.js --dry-run
   ```

5. **Get Version Information**:

   ```
   node src/lib/main.js --version
   ```

6. **Show Diagnostics**:

   ```
   node src/lib/main.js --diagnostics
   ```

7. **Display CLI Utility Commands Summary**:

   ```
   node src/lib/main.js --cli-utils
   ```
