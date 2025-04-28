# Performance Metrics (--perf-metrics Flag)

The `--perf-metrics` CLI flag enhances the agentic-lib by reporting detailed aggregated performance statistics for both single command and workflow chain invocations.

## Metrics Reported
When you use the `--perf-metrics` flag, the output JSON will include the following fields:

- **totalCommands**: Total number of commands processed.
- **averageTimeMS**: Average execution time in milliseconds across all processed commands. An alias **averageExecutionTimeMS** is also provided for clarity.
- **minTimeMS**: Minimum execution time in milliseconds recorded among the commands. Also available as **minExecutionTimeMS**.
- **maxTimeMS**: Maximum execution time in milliseconds recorded among the commands. Also available as **maxExecutionTimeMS**.
- **medianTimeMS**: The median execution time in milliseconds, providing a robust measure of central tendency. Also available as **medianExecutionTimeMS**.

For workflow chain invocations (i.e. when multiple commands are processed as a batch), an additional field is included:

- **chainSummary**: An object that provides a breakdown specific to chain invocations:
  - **totalCommands**: Number of commands in the chain.
  - **totalExecutionTimeMS**: The sum of execution times in milliseconds for all commands within the chain.

## Usage Examples

### Single Command Invocation

Command:

```
node engineer-sandbox/source/main.js --perf-metrics '{"command": "ping"}'
```

Example Output:

```json
{
  "status": "success",
  "processedCommand": "ping",
  "timestamp": "2025-04-28T00:40:27.416Z",
  "executionTimeMS": 0,
  "totalCommands": 1,
  "averageTimeMS": 0,
  "averageExecutionTimeMS": 0,
  "minTimeMS": 0,
  "minExecutionTimeMS": 0,
  "maxTimeMS": 0,
  "maxExecutionTimeMS": 0,
  "medianTimeMS": 0,
  "medianExecutionTimeMS": 0
}
```

### Workflow Chain Invocation

Command:

```
node engineer-sandbox/source/main.js --perf-metrics '{"commands": ["cmdA", "cmdB"]}'
```

Example Output:

```json
{
  "status": "success",
  "results": [
    {"status": "success", "processedCommand": "cmdA", "timestamp": "2025-04-28T00:40:27.418Z", "executionTimeMS": 0},
    {"status": "success", "processedCommand": "cmdB", "timestamp": "2025-04-28T00:40:27.418Z", "executionTimeMS": 0}
  ],
  "chainSummary": {"totalCommands": 2, "totalExecutionTimeMS": 0},
  "totalCommands": 2,
  "averageTimeMS": 0,
  "averageExecutionTimeMS": 0,
  "minTimeMS": 0,
  "minExecutionTimeMS": 0,
  "maxTimeMS": 0,
  "maxExecutionTimeMS": 0,
  "medianTimeMS": 0,
  "medianExecutionTimeMS": 0
}
```

## Notes

- The execution time is currently simulated and may appear as 0ms in testing environments.
- In production, the actual processing time will vary based on the command complexity and execution environment.
- Both naming conventions for the metrics are provided to support legacy integrations as well as new explicit naming.
- Ensure that you supply a valid JSON payload when invoking the flag.
