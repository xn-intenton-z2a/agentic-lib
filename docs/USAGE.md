# Usage Instructions for agentic-lib CLI

This documentation provides detailed usage instructions for the agentic-lib command line interface.

## Available Commands

- **--help**: Displays this help message with usage instructions.
- **--digest**: Runs a sample digest process simulating a SQS event.
- **--agentic <jsonPayload>**: Processes an agentic command using a JSON payload. The payload can either contain a single command with a `command` property or a batch of commands under a `commands` array. Each valid command is processed sequentially and increases an internal invocation counter.
- **--version**: Outputs version information fetched from the package.json along with a timestamp.
- **--verbose**: Activates verbose logging to provide detailed output for debugging purposes.
- **--diagnostics**: Outputs detailed diagnostic information including the current configuration, Node version, and environment variables.
- **--status**: Displays a runtime health summary in JSON format. This includes configuration, Node version, callCount, uptime, and selected environment variables.
- **--dry-run**: Executes a dry run where no actual actions are taken, simply printing a message indicative of a dry-run operation.
- **--simulate-error**: Simulates an error scenario by triggering an immediate error and exiting with a non-zero status code. Useful for testing error handling.
- **--simulate-delay <ms>**: Introduces a delay (in milliseconds) before processing commands, simulating latency.
- **--apply-fix**: Applies an automated fix and logs a success message. Execution stops immediately after this command.
- **--cli-utils**: Displays a comprehensive summary of available CLI commands along with their descriptions.

## Examples

### 1. Display Help

```
node src/lib/main.js --help
```

### 2. Process a Single Command

```
node src/lib/main.js --agentic '{"command": "doSomething"}'
```

### 3. Process a Batch of Commands

```
node src/lib/main.js --agentic '{"commands": ["cmd1", "cmd2"]}'
```

### 4. Simulate a Dry Run

```
node src/lib/main.js --dry-run
```

### 5. Get Version Information

```
node src/lib/main.js --version
```

### 6. Show Diagnostics

```
node src/lib/main.js --diagnostics
```

### 7. Display CLI Utility Commands Summary

```
node src/lib/main.js --cli-utils
```
