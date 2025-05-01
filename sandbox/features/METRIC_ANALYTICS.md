# Overview
This enhancement updates the performance metrics feature to provide a deeper analysis of system performance. In addition to existing metrics such as count, total time, minimum, maximum, and average execution times for agentic commands and workflow chains, this update will also compute the median execution time for each category.

# Implementation Details
1. Update the perfMetrics structure in the main JS file to include an array (e.g., times) for each metric group (agenticCommands and workflowChains) to record individual execution times.

2. In agenticHandler and workflowChainHandler, after computing the execution time (execTime), push the value to the corresponding times array. This is in addition to updating count, totalTimeMS, minTimeMS, and maxTimeMS.

3. Enhance the processPerfMetrics function to sort the times array for each metric group and calculate the median. For an odd number of elements, the median is the middle element; for an even number, it is the average of the two middle values.

4. Append the computed median values (medianTimeMS) to the output JSON so that when users invoke the --perf-metrics flag (especially with verbose statistics), the response includes count, total, average, minimum, maximum, and now median execution times.

5. Update the CLI documentation in the README to describe the new median metrics field in the --perf-metrics output.

6. Update unit tests in tests/unit/main.test.js to simulate multiple command invocations and verify that the median metrics are accurately computed.

# Success Criteria
- The CLI output for --perf-metrics includes a new field named medianTimeMS for both agentic commands and workflow chains in addition to the existing metric fields.
- Unit tests verify that the calculated median execution time matches the expected value based on the simulated execution times.
- Documentation (README) is updated to explain the significance of medianTimeMS and how to interpret it.

# User Impact
- Users obtain a more detailed and insightful performance analysis, enabling them to better diagnose variability and anomalies in command execution times.
- This enhancement supports more robust performance monitoring and troubleshooting.
