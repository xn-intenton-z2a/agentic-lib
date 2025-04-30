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

A new feature, **EVENT_AUDIT**, has been implemented to improve observability. The system now logs critical events during processing. The audit log is stored in a global array and includes records for:

- **SQS_RECORD_PROCESSED**: Logged for each SQS record processed by the digest handler. In case of errors (e.g., JSON parsing failure), error details are recorded.

- **COMMAND_START** and **COMMAND_COMPLETE**: Logged by the agentic handler when processing individual commands. The start event records the initial command, while the complete event includes the execution time and status.

- **WORKFLOW_CHAIN_COMPLETE**: Logged after a workflow chain is processed, summarizing the total number of commands executed and the overall execution time.

Each audit record has the following structure:

```json
{
  "eventType": "<TYPE>",
  "timestamp": "<ISO Timestamp>",
  "details": { /* relevant data fields such as command, executionTimeMS, status, error etc. */ }
}
```

These logs can be used for debugging and performance analysis.

## Usage Examples

### Single Command Invocation

```
node engineer-sandbox/source/main.js --perf-metrics '{"command": "ping"}'
```

### Workflow Chain Invocation

```
node engineer-sandbox/source/main.js --perf-metrics '{"commands": ["cmdA", "cmdB"]}'
```

### Viewing Audit Log (for debugging purposes)
You can inspect the global audit log by printing `globalThis.auditLog` in your application.
