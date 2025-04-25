# VERBOSE_STATS Feature Specification

## Overview
This feature enhances the CLI's verbose mode by including additional runtime system metrics. When the --verbose flag is used, the CLI will not only log standard informational messages, but also output key system details such as memory usage and process uptime to help developers diagnose performance and environment issues.

## Implementation Details
- In the source file (src/lib/main.js), update the processVerbose function to log additional details by invoking process.memoryUsage() and process.uptime(), and appending these values to the verbose log message.
- Ensure that when verbose mode is activated, the initial log message (e.g., "Verbose mode activated.") includes a JSON formatted summary of these additional metrics.
- Update the tests in tests/unit/main.test.js to verify that when the --verbose flag is provided, the console logs contain both the standard verbose message and the additional system metrics.
- Modify the README.md CLI Behavior section to document that verbose mode now outputs memory usage and uptime details in addition to standard logs.

## User Scenarios & Acceptance Criteria
- When the CLI is executed with the --verbose flag, the output should include a message with the configuration details along with a JSON object showing the current memory usage and process uptime.
- In non-verbose mode, the existing logging behavior remains unchanged.
- Unit tests validate the presence of memory and uptime details in the log output when verbose mode is active.
