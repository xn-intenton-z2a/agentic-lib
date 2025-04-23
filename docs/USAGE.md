# Usage Instructions for agentic-lib CLI

This document provides clear and concise usage details for the agentic-lib command line interface.

## Available Commands

- **--help**: Show help message and usage instructions.
- **--digest**: Run a sample SQS event simulation.
- **--agentic <jsonPayload>**: Process an agentic command using a JSON payload. The payload can contain either a single command (using the `command` property) or multiple commands (using a `commands` array for batch processing). Each valid command increments an internal counter and returns its execution time in milliseconds.

  **Batch Processing Note:** When a payload contains a `commands` array, the response will include a new property called `batchSummary`. This object contains:
  - `totalCommands`: the total number of commands processed
  - `totalExecutionTimeMS`: the total time in milliseconds taken to process the batch

- **--version**: Display version information from package.json along with the current timestamp.
- **--verbose**: Enable detailed logging for debugging purposes.
- **--diagnostics**: Output detailed diagnostics, including configuration and environment details.
- **--status**: Display a runtime health summary in JSON format.
- **--dry-run**: Execute a dry run without performing any actions.
- **--simulate-error**: Simulate an error scenario for testing; logs a simulated error and exits with a non-zero status code.
- **--simulate-delay <ms>**: Simulate processing delay for the specified duration in milliseconds.
- **--apply-fix**: Apply an automated fix and log a success message.
- **--cli-utils**: Display a summary of available CLI commands along with brief descriptions.
- **--workflow-chain <jsonPayload>**: Process a chain of workflow commands sequentially. (Payload must have a `chain` array property)

## Workflow Chain Feature

The workflow chain feature enables you to execute a sequence of commands in a sequential manner. To use this feature, supply a JSON payload that contains a `chain` property, where `chain` is a non-empty array of command strings. Each command will be trimmed and processed sequentially via the `agenticHandler` function, and the global invocation counter will be incremented for every processed command. The final response includes a `chainSummary` object that details the total number of commands processed and the aggregate execution time.

**Usage Example (CLI):**

```bash
node src/lib/main.js --workflow-chain '{"chain": ["command1", "command2", "command3"]}'
```

**Usage Example (Programmatic):**

```js
import { workflowChainHandler } from 'agentic-lib';

const payload = { chain: ["command1", "command2", "command3"] };
workflowChainHandler(payload)
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

The output will include an array of individual command responses and a `chainSummary` object, for example:

```json
{
  "status": "success",
  "results": [
    { "status": "success", "processedCommand": "command1", "timestamp": "...", "executionTimeMS": 5 },
    { "status": "success", "processedCommand": "command2", "timestamp": "...", "executionTimeMS": 3 },
    { "status": "success", "processedCommand": "command3", "timestamp": "...", "executionTimeMS": 4 }
  ],
  "chainSummary": {
    "totalCommands": 3,
    "totalExecutionTimeMS": 12
  }
}
```

## Command Aliases

You can configure command aliases using the `COMMAND_ALIASES` environment variable. When set, this variable should contain a JSON string mapping alias keys to their full command values. For example:

```bash
export COMMAND_ALIASES='{ "ls": "list", "rm": "remove" }'
```

With this configuration:
- A single command payload with `{ "command": "ls" }` will be processed as `list`.
- A batch command payload with `{ "commands": ["ls", "rm", "status"] }` will process the commands as `list`, `remove`, and `status` respectively (commands without an alias remain unchanged).

Alias substitution is applied before any validations.
