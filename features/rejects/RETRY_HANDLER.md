# RETRY_HANDLER Feature Specification

## Overview
This feature introduces a simple retry mechanism into the agentic command processing workflow. When enabled via an environment variable `AGENTIC_RETRIES`, the library will automatically retry command execution upon transient failures before ultimately failing. This increases the robustness and resiliency of the agentic-lib, especially when facing intermittent errors in command processing.

## Implementation Details
### Source File Modifications (src/lib/main.js)
- **Command Retry Logic:**
  - In the `agenticHandler` function, wrap the single command processing block (and optionally batch processing) in a retry loop.
  - Read the environment variable `AGENTIC_RETRIES` and parse it as an integer indicating the maximum number of attempts (defaulting to 1 if not set).
  - For each command, attempt processing. If an error occurs that qualifies as a transient error (for example, simulated by a specific command input such as "forceRetry" or any error generated during processing), catch the error and retry until the maximum number of attempts is reached.
  - Log each retry attempt using the existing `logInfo` and `logError` functions. Use verbose logging if enabled.
  
### Testing Enhancements (tests/unit/main.test.js)
- **New Test Cases for Retry Mechanism:**
  - Add tests that simulate transient failures in the `agenticHandler`. For instance, when a command string "forceRetry" is provided, the first attempt fails and a subsequent retry succeeds.
  - Verify that the global invocation counter (`globalThis.callCount`) is incremented only after a successful processing.
  - Include negative tests to ensure that if all retry attempts fail, the final error is thrown and logged appropriately.

### Documentation Updates (README.md)
- **Usage Section Update:**
  - Document the new `AGENTIC_RETRIES` environment variable. Explain that setting this variable to a positive integer enables automatic retries for command processing.
  - Provide usage examples showing how to set `AGENTIC_RETRIES` (e.g., `AGENTIC_RETRIES=3`) and describe scenarios where this mechanism adds value, such as handling intermittent errors.

## Benefits & Success Criteria
- **Improved Resiliency:** Automatically retries transient failures, reducing the need for manual intervention during intermittent error conditions.
- **Enhanced Robustness:** The system becomes less brittle in the face of temporary issues, contributing to a smoother user experience.
- **Testability:** New tests ensure that the retry mechanism behaves as expected and that it does not interfere with the primary command processing functionality.

## Verification & Acceptance
- The `agenticHandler` should retry processing a command up to the number of attempts specified by `AGENTIC_RETRIES` when a transient error occurs.
- Successful retry attempts should lead to normal command completions with the retry count logged.
- If all retry attempts fail, the final error should be logged and thrown as per existing error-handling behavior.
- All new tests added for this feature must pass without affecting current functionalities.
