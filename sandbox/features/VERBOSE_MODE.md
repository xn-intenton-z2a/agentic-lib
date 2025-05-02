# Description
This feature adds a new CLI flag --verbose which enables detailed logging output during execution. When the flag is provided, the existing global settings for verbose mode and verbose stats will be activated to provide more in-depth execution logs, which is useful during development and debugging.

# Implementation Details
- Modify the source file src/lib/main.js to check for the --verbose flag in process arguments early in the main function. 
- Update VERBOSE_MODE and VERBOSE_STATS variables so that they are configurable at runtime. Instead of defined as constants, refactor them to be mutable if the flag is present.
- Ensure that the logInfo and logError functions provide additional diagnostic details when verbose mode is enabled.
- Update the CLI usage instructions to include the new --verbose flag.
- Adapt the tests in tests/unit/main.test.js by adding cases to verify that running the CLI with --verbose properly activates the verbose logging behavior.

# Testing and Verification
- Unit tests should simulate passing the --verbose flag and check that the global variables VERBOSE_MODE and VERBOSE_STATS are set to true.
- Verify that additional details in log messages are printed to the console when --verbose is active.
- Maintain existing functionality for --help, --version, and --digest commands.

# Documentation Update
- Update the README file to document the new --verbose flag and its benefits for debugging and enhanced run-time insights.

This feature directly contributes to the mission by ensuring that automated workflows and troubleshooting logs are more informative, making maintenance and iterative improvement easier.