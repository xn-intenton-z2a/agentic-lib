# STATS Feature

This feature introduces a new CLI flag --stats that provides runtime statistics. Users can invoke the tool with --stats to immediately view important performance metrics such as the global call count and the process uptime. These metrics are useful for debugging, performance monitoring, and ensuring the system is running efficiently.

## Objective

The aim is to offer an on-demand summary of runtime statistics. This supports user needs by providing transparency on the tool's activity and performance, aligning with our mission of creating observable and autonomous workflows.

## Implementation Details

1. Add a new helper function processStats in the source file that checks if the CLI arguments include --stats. If present, the function should log the global callCount and process uptime in JSON format.
2. Update the main CLI function to call processStats when the --stats flag is detected before evaluating other flags.
3. Modify the README CLI Usage section to document the new --stats option, including usage examples and expected output.
4. Update unit tests in tests/unit/main.test.js to verify that passing the --stats flag results in output containing the callCount and uptime metrics.

## Testing and Verification

The new feature will include unit test coverage ensuring that when --stats is supplied, the CLI logs a JSON message containing both callCount and process uptime. This introduces clear measurable success criteria and demonstrates the feature's utility.

## Dependencies and Constraints

This feature relies solely on standard Node runtime functions without introducing additional external dependencies. It conforms to ECMAScript Module standards and integrates with our existing CLI and testing framework.

## User Scenarios

A user wanting to monitor the performance of agentic-lib during operation can run:
  node src/lib/main.js --stats

This will output the current call count and uptime metrics in a JSON log format, enhancing observability for troubleshooting and performance monitoring.
