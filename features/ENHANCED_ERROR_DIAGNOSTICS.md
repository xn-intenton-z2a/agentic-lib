# Enhanced Error Diagnostics

This feature expands the logging mechanism to provide in-depth diagnostics whenever an error is logged. When verbose mode is enabled, error logs will now include additional process metrics such as memory usage and CPU usage to help diagnose performance and stability issues in real-world deployments.

## Objectives

- Enhance the error logging system by capturing additional runtime diagnostics at the time of an error.
- Append process memory usage and CPU usage data to the error log output when VERBOSE_MODE is active.
- Provide more actionable insights for debugging and monitoring system health in production or development environments.

## Implementation Details

- In the logError function, check if VERBOSE_MODE is enabled. If it is, extend the additionalData object with system diagnostics:
  - Retrieve the memory usage using process.memoryUsage() and include key metrics (e.g., rss, heapUsed, heapTotal).
  - Get CPU usage using process.cpuUsage() to attach basic CPU stats.
- Update the diagnostics CLI flag (if applicable) to explain that error logs now include enhanced diagnostics when verbose logging is turned on.
- Modify the README documentation to reflect the improved error logging and provide instructions on how to enable verbose mode to capture these extra details.

## Testing and Verification

- Update existing unit tests and add new tests in tests/unit/main.test.js to verify that when VERBOSE_MODE is enabled, errors logged via logError include additional properties for memory and CPU usage.
- Simulate an error case to check that the enhanced diagnostics fields (memoryUsage and cpuUsage) are present in the error log output when VERBOSE_MODE is active.
- Ensure that the default logging behavior remains unchanged when VERBOSE_MODE is not enabled.

## Success Criteria

- Developers and system operators receive enriched error logs containing memory and CPU usage details when an error occurs in verbose mode.
- Unit tests confirm that these new diagnostics fields are attached to the error log output under the correct conditions without affecting normal operation.
- The feature adds measurable value by providing deeper insights for troubleshooting and maintaining system performance.