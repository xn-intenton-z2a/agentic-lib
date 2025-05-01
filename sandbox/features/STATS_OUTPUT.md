# Overview
This feature introduces a new CLI option --stats that provides runtime statistics of the application. It adds functionality to output key indicators such as the global call count and process uptime when the user invokes this flag. The feature is intended to improve observability during local development and debugging.

# Functionality
The following steps outline the changes:
1. Update the main source file (src/lib/main.js) to include the new CLI flag --stats.
2. When --stats is invoked alongside any other command or on its own, the application logs the current call count and uptime.
3. Ensure that this logging does not interfere with existing functionality and respects the global VERBOSE_STATS flag (if toggled).
4. Update the usage instructions in the CLI help message to include information about the new --stats flag.

# Testing & Verification
1. Extend unit tests in tests/unit/main.test.js to simulate the --stats flag. Verify that the output includes valid JSON containing keys for callCount and uptime.
2. Confirm that using the --stats flag returns the expected metrics without impacting other CLI options (--help, --version, --digest).
3. Perform manual testing to check that the statistics are correctly calculated and logged.

# Documentation & Dependencies
1. Update the README file in sandbox/README.md to include usage examples for --stats.
2. Ensure that any changes needed in the dependencies file are minimal (no new dependencies are required as existing libraries suffice for this feature).

# Impact
This feature enhances the product's core debugging and monitoring capabilities, aligning with the mission to provide robust, testable, and efficient workflows. This will help users gain insights during runtime and troubleshoot performance issues efficiently.