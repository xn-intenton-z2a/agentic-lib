# Overview
This feature introduces an error metrics tracker to provide users with additional insight into the number of errors logged by the system. It builds on the existing logging functionality by recording each error occurrence and exposing these metrics through the CLI. This helps users to monitor application stability and identify potential problems more quickly.

# Implementation Details
1. A new global variable errorMetrics will be added with a structure such as:
   {
     count: 0
   }

2. The logError function will be updated so that each time an error is logged, errorMetrics.count is incremented. This allows all error occurrences during execution to be aggregated.

3. CLI integration will be extended. The errorMetrics data will be appended to the output for the --perf-metrics and --status CLI flags when verbose stats are enabled. Optionally, a new CLI flag for error metrics could be later added if needed, but for now it will be integrated into existing diagnostic outputs.

4. Documentation in the README will be updated to describe the error metrics tracking. It will inform users that starting with this release, error occurrences are tracked and reported along with other performance metrics.

5. Tests will be updated (or new tests added) to verify that errorMetrics.count correctly increases when logError is invoked during error conditions. This ensures that the feature is both functional and stable.

# Success Criteria
- Every call to logError accurately increments errorMetrics.count.
- The aggregated error metrics are included in the output when CLI commands such as --status or --perf-metrics are invoked in verbose mode.
- Documentation and tests are updated to reflect and validate the new error tracking capability.

# User Impact
- Users benefit from better observability of error conditions during execution.
- Improved diagnostics allow for faster troubleshooting and heightened confidence in system reliability.