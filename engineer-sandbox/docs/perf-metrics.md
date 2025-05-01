# Performance Metrics (--perf-metrics Flag)

The `--perf-metrics` CLI flag now reports detailed aggregated performance statistics for both individual agentic commands and workflow chains.

## Metrics Reported

When you use the `--perf-metrics` flag, the output JSON will include two objects:

- **agenticCommands**: Aggregated metrics for individual command invocations with the following fields:
  - **count**: Total number of commands processed.
  - **totalTimeMS**: Total cumulative execution time (in milliseconds) for all processed commands.
  - **averageExecutionTimeMS**: The average execution time in milliseconds (computed as totalTimeMS / count).
  - **minTimeMS**: The minimum execution time recorded among the commands.
  - **maxTimeMS**: The maximum execution time recorded among the commands.
  - **medianExecutionTimeMS**: The median execution time, providing a robust measure of central tendency.
  - **standardDeviationTimeMS**: The standard deviation of the execution times.
  - **90thPercentileTimeMS**: The execution time below which 90% of the commands fall.

- **workflowChains**: Aggregated metrics for workflow chain invocations computed over the total chain execution time, with the same set of fields as above.

When the `--verbose-stats` flag is active, additional fields such as `callCount` (the number of invocations) and `uptime` are also included in the output.

## How Metrics Are Computed

Execution times are recorded globally for each individual command processed and for each workflow chain invocation.

A helper function computes the following statistical measures from these recorded times:

- **averageExecutionTimeMS**: Sum of all execution times divided by the number of observations.
- **medianExecutionTimeMS**: Middle value in the sorted list of execution times.
- **standardDeviationTimeMS**: The square root of the variance of the execution times.
- **90thPercentileTimeMS**: The execution time at the 90th percentile of the sorted list.

## Usage Examples

### Single Command Invocation
```
node src/lib/main.js --agentic '{"command": "ping"}'
node src/lib/main.js --perf-metrics
```

### Workflow Chain Invocation
```
node src/lib/main.js --workflow-chain '{"chain": ["cmdA", "cmdB"]}'
node src/lib/main.js --perf-metrics
```

These commands will output a JSON object with detailed performance statistics for the respective invocations.