# Performance Metrics Enhancement

This feature introduces an aggregated performance metrics module for batch processing in the agentic CLI commands. The goal is to provide users with clear insights into the execution times of their commands when processing batches or workflow chains.

## Objectives

- Aggregate individual execution times from batch processes and workflow chains.
- Compute average, minimum, and maximum execution time values across processed commands.
- Attach these metrics to the response object under the property "performanceMetrics" when a batch of commands is invoked via agenticHandler or workflowChainHandler.
- Ensure that the performance metrics are visible when using verbose statistics (for example, via the --verbose-stats flag) to support debugging and performance evaluation.

## Implementation Details

- Update the agenticHandler function to, after processing a payload that contains a "commands" array, iterate over the results and compute the average, minimum, and maximum of the executionTimeMS values.
- Add a new field, performanceMetrics, to the response object that encapsulates:
  - averageExecutionTimeMS
  - minExecutionTimeMS
  - maxExecutionTimeMS
  - totalBatchExecutionTimeMS (optional)
- Similarly, consider updating the workflowChainHandler to compute and attach aggregated metrics from the chain processing results if applicable.
- Modify the README to document that when batch processing is performed, an additional performanceMetrics object is returned, providing aggregated execution time statistics.

## Testing and Verification

- Update unit tests in tests/unit/main.test.js to verify that when a batch of commands is processed, the returned object includes a performanceMetrics field with the correct computed values.
- Ensure that the existing agenticHandler single command processing functionality remains unchanged.
- Validate that verbose mode reporting (--verbose-stats) includes these aggregated metrics.

## Success Criteria

- When a batch of commands is processed through the agenticHandler, the response object contains a performanceMetrics object with accurate average, min, and max execution time values.
- The performanceMetrics data is correctly integrated into both batch and workflow chain responses, providing users with an overview of command performance.
- All unit tests pass successfully, including new or updated tests for the performance metrics feature.
