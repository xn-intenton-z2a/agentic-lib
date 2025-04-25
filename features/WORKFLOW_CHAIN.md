# Overview
Enhance the existing WORKFLOW_CHAIN feature with optional timeout control for command execution. In addition to the current fault-tolerant chaining behavior, each command in the chain (or individual agentic command) can optionally specify a timeout threshold (in milliseconds). If a command exceeds its allotted timeout, it is marked as failed with a timeout error, and processing continues based on the haltOnFailure flag.

# Implementation Details
- Extend the agenticHandler and chainWorkflows functions to accept an optional "timeout" parameter as part of the payload. For single command processing, the payload may include a timeout value; for chained workflows, each step can optionally include a timeout field.
- Wrap the command execution in a promise race between the original command execution and a timeout promise that rejects with a descriptive timeout error message.
- In the chainWorkflows function, if a timeout error is encountered on a step, log the timeout error and either halt or continue based on the step's haltOnFailure setting. The error object should clearly indicate that the failure was due to a timeout.
- Update logging functions to include timeout error details. Ensure that the summary returned at the end of chainWorkflows includes any timeout failures alongside other errors.
- Update the tests in tests/unit/main.test.js to simulate both scenarios: a command completing within the timeout and a command that exceeds the timeout. Tests should verify that the timeout failure is correctly logged and that the global call count and summary statistics are updated accordingly.
- Update the README and usage documentation to reflect the new "timeout" property in the JSON payload for both --agentic and --workflow-chain commands. Provide instructions on how to include the timeout (in milliseconds) and describe the behavior when a command exceeds its timeout.

# User Scenarios & Acceptance Criteria
- When a command includes a timeout value and completes within the specified time, it should be processed normally with its execution time recorded.
- When a command exceeds its timeout value, the command should fail with a timeout error message. The failure should be included in the overall summary, and if haltOnFailure is true, the chain should stop processing further commands.
- The enhanced logging should clearly denote timeout errors in the error logs and summaries.
- Updated tests cover both the single command and batch modes, verifying correct behavior under both timely and timeout scenarios.

# Benefits
- Improves the resilience of autonomous workflows by preventing a stalled or long-running command from blocking the entire chain.
- Provides more granular control over command execution, enabling better diagnostic feedback and error handling in automated environments.

# Compatibility
- This enhancement integrates with the existing fault-tolerance and logging mechanisms. When no timeout is specified, the behavior remains unchanged.
- The feature aligns with the overall mission of building resilient, observable workflows in an agentic manner.