# Performance Metrics and Simulation Enhancement

This feature enhances the existing performance metrics capabilities by introducing simulation options that allow users to test and observe the behavior of the system under artificial processing delays and CPU load. In addition to aggregating performance metrics from batch command processing, the updated feature now supports new CLI flags to simulate delay (--simulate-delay) and load (--simulate-load), enabling more robust testing and diagnostics.

## Objectives

- Continue computing aggregated performance metrics for both single command and workflow chain invocations, including average, minimum, maximum, and median execution times.
- Simulate a processing delay when the --simulate-delay flag is provided with a numerical value, delaying the command processing by the specified milliseconds.
- Simulate a CPU-intensive load when the --simulate-load flag is provided with a numerical value, creating a heavy processing loop for the specified duration.
- Ensure that the performance metrics accurately reflect the additional delay or load time introduced by these simulation flags.
- Update the CLI help and documentation to indicate the new simulation options.

## Implementation Details

- In the main source file (main.js), update the main() function to detect the --simulate-delay flag. When present, extract the following argument as a delay duration in milliseconds, and introduce an asynchronous pause before processing commands. Use a Promise-based sleep function (or setTimeout) to implement the delay.

- Similarly, detect the --simulate-load flag and parse its value as the duration in milliseconds. Implement a CPU-intensive loop that runs for approximately the given time, ensuring that the overall execution time reflects the simulated load.

- After applying the simulation (if any), proceed to process the payload (single command or commands array) and compute performance metrics as before.

- Update the aggregated metrics to include the simulation delay/load so that the reported averageExecutionTimeMS, minExecutionTimeMS, maxExecutionTimeMS, and medianExecutionTimeMS acknowledge the extra processing time.

## Testing and Verification

- Update unit tests in tests/unit/main.test.js to include scenarios where the --simulate-delay flag is used. Verify that the execution time captured by the metrics increases by at least the specified delay.

- Add tests for the --simulate-load flag to ensure that a CPU-intensive calculation runs for the expected duration and that the performance metrics are adjusted accordingly.

- Verify that normal processing (without simulation flags) behaves exactly as before, maintaining backward compatibility with legacy CLI invocations.

## Documentation

- Update the README and corresponding CLI help text in main.js to document the new --simulate-delay and --simulate-load flags, including usage examples and explanation of how they affect performance metrics reporting.

## Success Criteria

- The agenticHandler returns aggregated metrics that accurately reflect the processing time, including any added delay or load.
- The command-line interface properly triggers simulation behavior when the --simulate-delay or --simulate-load flag is used.
- All unit tests pass, including new tests verifying that simulation delays and load simulations impact execution timing as expected.
