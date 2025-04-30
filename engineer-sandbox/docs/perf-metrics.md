# Performance Metrics (--perf-metrics Flag)

The `--perf-metrics` CLI flag enhances the agentic-lib by reporting detailed aggregated performance statistics for both single command and workflow chain invocations.

## Metrics Reported
When you use the `--perf-metrics` flag, the output JSON will include the following fields:

- **totalCommands**: Total number of commands processed.
- **averageTimeMS**: Average execution time in milliseconds across all processed commands. An alias **averageExecutionTimeMS** is also provided for clarity.
- **minTimeMS**: Minimum execution time in milliseconds recorded among the commands. Also available as **minExecutionTimeMS**.
- **maxTimeMS**: Maximum execution time in milliseconds recorded among the commands. Also available as **maxExecutionTimeMS**.
- **medianTimeMS**: The median execution time in milliseconds, providing a robust measure of central tendency. Also available as **medianExecutionTimeMS**.

Additionally, two new statistical metrics have been introduced:

- **standardDeviationTimeMS**: Represents the standard deviation of the execution times. It is calculated as the square root of the mean of the squared differences from the average execution time.

- **90thPercentileTimeMS**: Represents the 90th percentile execution time, determined by sorting the execution times and selecting the value below which 90% of the data falls.

## Workflow Chain Invocations
For workflow chain invocations (i.e. when multiple commands are processed as a batch), an additional field is included:

- **chainSummary**: An object providing a breakdown specific to chain invocations:
  - **totalCommands**: Number of commands in the chain.
  - **totalExecutionTimeMS**: The sum of execution times in milliseconds for all commands within the chain.

## Batch Command Throttling

The library supports batch throttling via the `MAX_BATCH_COMMANDS` environment variable. If the number of commands in the payload exceeds the set limit, the command batch will be rejected with an error message.

## Event Audit Feature

A new feature, **EVENT_AUDIT**, has been implemented to improve observability. The system now logs critical events during processing. Each audit record includes the following properties:

- **eventType**: The type of the event. Possible values include:
  - `SQS_RECORD_PROCESSED`: Logged for each SQS record successfully processed.
  - `SQS_RECORD_ERROR`: Logged when an SQS record fails to be processed (e.g., invalid JSON).
  - `COMMAND_START`: Logged before processing each command, capturing the original command and any alias substitution.
  - `COMMAND_COMPLETE`: Logged after processing each command, including the execution time and status.
  - `WORKFLOW_CHAIN_COMPLETE`: Logged after a workflow chain is processed, summarizing the total commands and overall execution time.
- **timestamp**: ISO formatted timestamp when the event was logged.
- **details**: An object containing event-specific details (such as command processed, execution time, error messages, etc.).

You can inspect the audit log by accessing `globalThis.auditLog` in your application for debugging and performance analysis.

## Usage Examples

### Single Command Invocation

```
node engineer-sandbox/source/main.js --perf-metrics '{"command": "ping"}'
```

### Workflow Chain Invocation

```
node engineer-sandbox/source/main.js --perf-metrics '{"commands": ["cmdA", "cmdB"]}'
```

### Viewing Audit Log

For debugging purposes, you can output the audit log:

```js
console.log(globalThis.auditLog);
```

This will display all audit entries logged during processing.
