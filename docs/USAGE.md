# Usage Instructions for agentic-lib CLI

This document provides clear and concise usage details for the agentic-lib command line interface.

## Available Commands

- **--help**: Show help message and usage instructions.
- **--digest**: Run a sample SQS event simulation.
- **--agentic <jsonPayload>**: Process an agentic command using a JSON payload. The payload can contain either a single command (using the `command` property) or multiple commands (using a `commands` array for batch processing). Each valid command increments an internal counter and returns its execution time in milliseconds. **Note:** Command inputs are normalized by trimming extra whitespace before validation and alias substitution is applied if configured.
- **--version**: Display version information from package.json along with the current timestamp.
- **--verbose**: Enable detailed logging for debugging purposes.
- **--diagnostics**: Output detailed diagnostics, including configuration and environment details.
- **--status**: Display a runtime health summary in JSON format.
- **--dry-run**: Execute a dry run without performing any actions.
- **--simulate-error**: Simulate an error scenario for testing; logs a simulated error and exits with a non-zero status code.
- **--simulate-delay <ms>**: Simulate processing delay for the specified duration in milliseconds.
- **--apply-fix**: Apply an automated fix and log a success message.
- **--cli-utils**: Display a summary of available CLI commands with their descriptions.

## Command Aliases

You can configure command aliases using the `COMMAND_ALIASES` environment variable. When set, this variable should contain a JSON string mapping alias keys to their full command values. For example, you can set:

```
export COMMAND_ALIASES='{"ls": "list", "rm": "remove"}'
```

With this configuration:

- A single command payload with `{ "command": "ls" }` will be processed as `list`.
- A batch command payload with `{ "commands": ["ls", "rm", "status"] }` will process the commands as `list`, `remove`, and `status` respectively (commands without an alias remain unchanged).

Alias substitution is applied before any validations, so even if the alias value might be one of the values that would otherwise be considered non-actionable, it will be processed according to its mapped value.

## Examples

1. **Display Help**:
   ```bash
   node src/lib/main.js --help
   ```

2. **Process a Single Command with Alias Substitution** (whitespace will be trimmed and alias applied):
   ```bash
   export COMMAND_ALIASES='{"ls": "list"}'
   node src/lib/main.js --agentic '{"command": "   ls   "}'
   ```

3. **Process a Batch of Commands with Aliases**:
   ```bash
   export COMMAND_ALIASES='{"ls": "list", "rm": "remove"}'
   node src/lib/main.js --agentic '{"commands": ["  ls  ", "rm", "status"]}'
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

7. **Display CLI Utility Summary (with colored output)**:
   ```bash
   node src/lib/main.js --cli-utils
   ```
