# WORKFLOW_CHAIN Feature Specification

## Overview
This update refines the existing WORKFLOW_CHAIN feature by enhancing its fault tolerance. When processing a chain of commands, failures in individual commands will now be logged and collected rather than halting the entire chain. This improvement ensures that the workflow continues processing remaining commands, providing a summary of both successful and failed command executions. This makes the system more robust in the presence of intermittent errors, aligning with our mission of resilient, observable workflows.

## Implementation Details
- Update the workflowChainHandler function to wrap each command execution in a try-catch block.
- Instead of throwing an error immediately upon encountering an invalid command, log the error and continue processing the rest of the chain.
- Accumulate results into two arrays: one for successful command outputs and one for failures (including error messages and the associated command).
- The returned summary object includes:
  - totalCommands: total number of commands attempted
  - successfulCommands: array of results from commands that succeeded
  - failedCommands: array with objects detailing the command and the error message for failures
  - totalExecutionTimeMS: overall processing time
- Update relevant tests in tests/unit/main.test.js to simulate error conditions in the chain and verify that the chain processing continues and the summary reflects both successes and failures.
- Update README under the CLI Behavior section to document the enhanced fault tolerance of the --workflow-chain flag.

## User Scenarios & Acceptance Criteria
- When a chain of commands is processed, if one or more commands are invalid, the handler logs the error for each, includes them in the summary, and continues processing subsequent commands.
- The overall status returns "partial-success" if there are failures, or "success" if all commands complete without errors.
- The test suite includes cases triggering a chain with both valid and invalid commands, verifying that the summary contains correct counts of successful and failed commands and that processing does not halt on the first error.
- Documentation is updated accordingly to reflect this resilient behavior.