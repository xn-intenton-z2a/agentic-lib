# Performance Metrics (--perf-metrics Flag)

The `--perf-metrics` CLI flag enhances the agentic-lib by reporting detailed aggregated performance statistics for both single command and workflow chain invocations.

## Metrics Reported
When you use the `--perf-metrics` flag, the output JSON will include two objects:

- **agenticCommands**: Aggregated metrics for individual command invocations with the following fields:
  - **count**: Total number of commands processed.
  - **totalTimeMS**: Total execution time (in milliseconds) across all processed commands.
  - **averageExecutionTimeMS**: The average execution time in milliseconds.
  - **minExecutionTimeMS**: Minimum execution time recorded among the commands.
  - **maxExecutionTimeMS**: Maximum execution time recorded among the commands.
  - **medianExecutionTimeMS**: The median execution time, providing a robust measure of central tendency.
  - **standardDeviationTimeMS**: The standard deviation of the execution times.
  - **90thPercentileTimeMS**: The 90th percentile execution time, indicating the value below which 90% of the execution times fall.

- **workflowChains**: Aggregated metrics for workflow chain invocations with the same set of fields as above.

When the `--verbose-stats` flag is active, additional fields such as `callCount` and `uptime` are included in the output to provide further insight into the runtime environment.

## Usage Examples

### Single Command Invocation
```
node src/lib/main.js --perf-metrics
```

### Workflow Chain Invocation
```
node src/lib/main.js --workflow-chain '{"chain": ["cmdA", "cmdB"]}'
node src/lib/main.js --perf-metrics
```

## How Metrics Are Computed

The detailed metrics are computed by recording the execution times into global arrays:

- `globalThis.agenticExecutionTimes` for individual commands.
- `globalThis.workflowExecutionTimes` for entire workflow chains.

A helper function computes the following statistical measures from these arrays:

- **averageExecutionTimeMS**: Average of all execution times.
- **medianExecutionTimeMS**: The median value from the sorted list of execution times.
- **standardDeviationTimeMS**: The square root of the average squared deviation from the mean.
- **90thPercentileTimeMS**: The execution time at the 90th percentile.

These metrics allow you to gain a comprehensive understanding of performance variations in your processing.
