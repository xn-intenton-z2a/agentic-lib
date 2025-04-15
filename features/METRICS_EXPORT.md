# METRICS_EXPORT Feature Specification

## Overview
This feature introduces a new CLI flag `--metrics` that aggregates and exports performance and usage metrics collected during the runtime of the agentic-lib. By providing insights such as the total number of commands processed and the average execution time for commands, this feature enhances observability and helps diagnose performance variations or potential bottlenecks.

## Implementation Details
### Source File Modifications (src/lib/main.js)
- **New Metrics Aggregator Function:**
  - Implement a function `exportMetrics` which computes and logs aggregated metrics (e.g., total calls via `globalThis.callCount` and average `executionTimeMS` from recent executions).
  - Store execution times in an array (e.g., `globalThis.executionTimes`) updated after each command in `agenticHandler`.
- **CLI Integration:**
  - Add a new CLI flag `--metrics` in the `main` function. When provided, the program should call `exportMetrics` to output the collected metrics to the console.
  - Ensure that this flag does not interfere with other functionalities such as `--status` or `--verbose`.

### Testing Enhancements (tests/unit/main.test.js)
- **New Test Cases for Metrics Export:**
  - Add test cases to simulate command processing and then invoke the CLI with the `--metrics` flag to verify that the metrics output includes the total number of processed commands and average execution times in a formatted message.
  - Ensure that the metrics output does not disrupt normal operation and that other CLI flags remain functional.

### Documentation Updates (README.md)
- **Usage Section Update:**
  - Update the CLI usage instructions to include the `--metrics` flag.
  - Provide example commands that demonstrate how to invoke the metrics export and explain the meaning of the reported metrics (e.g., total invocation count and average execution time per command).

## Benefits & Success Criteria
- **Enhanced Observability:** Provides immediate feedback on runtime performance and usage, assisting developers in monitoring system behavior under load.
- **Non-intrusive:** Integrates seamlessly with the existing CLI without affecting other available commands or features.
- **Testable:** Unit tests and CLI simulations cover the new functionality to ensure metrics are accurately reported.

## Verification & Acceptance
- When the `--metrics` flag is used, the CLI should output a clear message that includes aggregated metrics such as the total call count and average execution time computed from recent commands.
- Automated tests should cover both the metrics export functionality and its integration with the other CLI commands without regression.
