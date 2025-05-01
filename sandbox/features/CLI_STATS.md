# CLI_STATS Feature Specification

## Overview
This feature introduces a new CLI flag --stats that outputs performance statistics. These statistics include the global call count and process uptime. By providing a clear performance overview, users can better understand resource usage and monitor the efficiency of the library. The feature enhances the CLI functionality, aligns with the mission of continuous review and improvement, and provides tangible benefits to developers during testing and debugging.

## Implementation Details
- Update the main CLI in src/lib/main.js to check for the presence of the --stats flag in the arguments. 
- When detected, the program should print a JSON-formatted string with the current value of globalThis.callCount and process uptime. This should run as a separate command independent of other flags.
- Ensure that the new flag does not conflict with existing flags (--help, --version, --digest) and can be used in conjunction with or separately from those flags.
- Update tests in tests/unit/main.test.js to include a test that verifies the output when the --stats flag is provided. The test should check that the output contains both callCount and uptime information.

## Documentation and User Guidance
- Update the README file (sandbox/README.md) to include instructions on how to use the --stats flag and explain the kind of output that users can expect.
- Document usage examples under the CLI Usage section, ensuring that users know this flag is available for performance monitoring.

## Success Criteria
- When the --stats flag is used, valid JSON output that includes callCount and uptime is printed.
- Unit tests pass, confirming the correct behavior of the new CLI flag.
- The enhancement integrates seamlessly without affecting the existing functionality of the CLI commands.

## Dependencies and Constraints
- No new external dependencies are required.
- The feature must be compatible with Node 20 and adhere to ECMAScript Module (ESM) standards.
- Ensure that the feature maintains performance and does not introduce blocking operations during CLI processing.
