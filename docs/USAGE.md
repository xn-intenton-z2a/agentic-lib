# Usage Instructions for agentic-lib CLI

This document provides clear and concise usage details for the agentic-lib command line interface.

## Available Commands

- **--help**: Show help message and usage instructions.
- **--digest**: Run a sample SQS event simulation.
- **--agentic <jsonPayload>**: Process an agentic command using a JSON payload. The payload can contain either a single command (using the `command` property) or multiple commands (using a `commands` array for batch processing). Each valid command increments an internal counter and returns its execution time in milliseconds. **Note:** Command inputs are normalized by trimming extra whitespace before validation.
- **--version**: Display version information from package.json along with the current timestamp.
- **--verbose**: Enable detailed logging for debugging purposes.
- **--diagnostics**: Output detailed diagnostics, including configuration and environment details.
- **--status**: Display a runtime health summary in JSON format.
- **--dry-run**: Execute a dry run without performing any actions.
- **--simulate-error**: Simulate an error scenario for testing; logs a simulated error and exits with a non-zero status code.
- **--simulate-delay <ms>**: Simulate processing delay for the specified duration in milliseconds.
- **--apply-fix**: Apply an automated fix and log a success message.
- **--cli-utils**: Display a summary of available CLI commands with their descriptions.

## Examples

1. **Display Help**:
   ```bash
   node src/lib/main.js --help
   ```

2. **Process a Single Command** (whitespace will be trimmed):
   ```bash
   node src/lib/main.js --agentic '{"command": "   doSomething   "}'
   ```

3. **Process a Batch of Commands** (each command is normalized):
   ```bash
   node src/lib/main.js --agentic '{"commands": ["  cmd1  ", "cmd2", "  cmd3"]}'
   ```

4. **Simulate a Dry Run**:
   ```bash
   node src/lib/main.js --dry-run
   ```

5. **Get Version Information**:
   ```bash
   node src/lib/main.js --version
   ```

6. **Show Diagnostics**:
   ```bash
   node src/lib/main.js --diagnostics
   ```

7. **Display CLI Utility Summary**:
   ```bash
   node src/lib/main.js --cli-utils
   ```
