# Overview
This feature enhances the existing performance metrics by including computed analytics such as the average execution time for agentic commands and workflow chains. By supplementing the raw metrics (count, total time, min and max times) with an average calculation, users can more easily assess trends in performance and identify anomalies.

# Implementation Details
1. Update the global perfMetrics structure to continue tracking count, totalTimeMS, minTimeMS, and maxTimeMS without changes. In the CLI processing function for --perf-metrics, compute an average execution time for each metric group if the count is greater than zero.

2. Modify the processPerfMetrics function:
   - Calculate averageTimeMS as totalTimeMS divided by count for each performance category (e.g. agenticCommands and workflowChains).
   - Append the newly computed average values to the output JSON so that when users invoke the --perf-metrics or --status flag with verbose statistics enabled, they receive a detailed summary that includes average execution time.

3. Update tests in tests/unit/main.test.js to verify that the output for the --perf-metrics flag includes the average execution time field and that the calculation is correct.

4. Reflect the change in README.md documentation by explaining that perf metrics now include average execution times, improving diagnostics for command performance.

# Success Criteria
- The CLI output for --perf-metrics includes a new field for average execution time for both agentic commands and workflow chains.
- Tests verify that after a command execution, the average value is correctly computed based on the totalTimeMS and count.
- Documentation is updated accordingly to explain how to interpret the new metrics.

# User Impact
- Users gain a clearer indication of system performance through improved metrics analytics.
- Enhanced diagnostics help in identifying performance deviations, thereby supporting better troubleshooting and system tuning.