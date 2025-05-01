# Overview
This feature introduces a new CLI flag --verbose that enables detailed logging throughout the application. When the flag is present, the global verbose mode is enabled to include additional log details in both CLI output and automated tests.

# Goals
- Provide users with the ability to enable verbose logging without modifying environment variables.
- Enhance debugging and diagnostics by including extra metadata in log outputs.
- Update tests and documentation to cover the new behavior.

# Functional Specification
1. Modify the main CLI in src/lib/main.js to look for the --verbose flag in process arguments.
2. When --verbose is detected, set the global VERBOSE_MODE flag to true. Also, if applicable, adjust VERBOSE_STATS behavior.
3. Update logging functions (logInfo and logError) to include a verbose field set to true when verbose mode is enabled.
4. Modify tests in tests/unit/main.test.js to simulate passing the --verbose flag and verify that log outputs include the verbose metadata.
5. Update the README in sandbox/README.md to include documentation on using the --verbose flag, with examples of how to trigger detailed logging.
6. Ensure no new files are created, only adjustments to existing source, test, and documentation files.

# Testing and Acceptance
- Unit tests must confirm that when the --verbose flag is passed, logs include the verbose field set to true.
- Manual testing should show enhanced logging details when the flag is used.
- Documentation should clearly explain how and why to use the --verbose flag.
