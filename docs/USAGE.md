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

## Enhanced Workflow Chain: Robust Chaining with Error Handling and Conditional Branching

A new function, `chainWorkflows`, has been introduced to provide more robust control when executing a sequence of workflow steps. Each step is an object that must include at least a `command` property and can optionally include a `haltOnFailure` flag (defaults to `true`).

- **Behavior:**
  - Each step is executed sequentially by invoking the underlying `agenticHandler`.
  - If a step fails and `haltOnFailure` is `true`, the chain is halted immediately.
  - If `haltOnFailure` is `false`, the chain continues executing subsequent steps even if a step fails.
  - Execution details for each step (status, execution time, and any error messages) are logged and aggregated.

- **Return Value:**
  The function returns an object containing:
  - `overallStatus`: "success", "failed", or "partial" depending on the execution outcomes.
  - `totalSteps`: the number of steps processed.
  - `totalExecutionTimeMS`: the total time taken for the chain execution.
  - `results`: an array with the outcome of each step.

- **Usage Example (Programmatic):**

```js
import { chainWorkflows } from 'agentic-lib';

const steps = [
  { command: 'build', haltOnFailure: false },
  { command: 'test' }, // defaults to haltOnFailure: true
  { command: 'deploy', haltOnFailure: false }
];

chainWorkflows(steps)
  .then(result => console.log(result))
  .catch(err => console.error(err));
```

In the above example, if the second step fails, the chain halts because the default `haltOnFailure` is `true`. If you want the chain to continue despite failures, set `haltOnFailure` to `false` in the step object.

## Additional Information

For more detailed CLI instructions and command descriptions, please refer to the rest of this document.

---

## AWS Integrations

The agentic‑lib library leverages AWS services to enhance automation and reliability:

- **SQS Integration:**
  - The function `createSQSEventFromDigest` constructs a mock AWS SQS event from a given digest, formatting the payload to resemble a typical SQS message.
  - The `digestLambdaHandler` function processes incoming SQS events, gracefully handling JSON parsing errors and accumulating failed records. If a messageId is omitted, a fallback identifier is generated.
  - These integrations ensure that messages can be retried by AWS SQS in case of processing errors, thereby enhancing fault tolerance.

- **Logging:**
  - Detailed logging via `logInfo` and `logError` functions provides insight into the operations, including configurations and error stacks when verbose mode is enabled.

---

## CLI Behavior

The CLI provides several flags to manage the library's operation. Refer to the descriptions above for details about each command.
