# CONFIG_DISPLAY Feature

## Overview
This feature adds a new command-line flag, --config, to the agentic-lib CLI. When invoked, the flag will display the current configuration settings in a user-friendly JSON format. This makes it easier for users to verify that the configuration (set via environment variables or .env file) is correctly loaded, matching the intent of agentic-lib to operate autonomously in workflows.

## Implementation Details
- Update src/lib/main.js:
  - Add a new helper function processConfig(args) that checks if the --config flag is present in the input arguments. If present, it prints out a formatted version of the current configuration.
  - Incorporate processConfig in the main function so that if the flag is detected, the configuration is displayed and the execution stops.
  - Ensure that global verbose flags such as VERBOSE_MODE or VERBOSE_STATS remain unaffected.

## Testing
- Update tests/unit/main.test.js:
  - Add new unit tests to check that when --config is provided as an argument, the CLI outputs the configuration details correctly.
  - Verify that the formatted output includes all required environment configuration values.

## Documentation
- Update the README file (sandbox/README.md):
  - Include a section on available CLI commands, adding an entry for --config with a description of its purpose.

## Dependencies
- This feature does not require any new dependencies.
- It leverages the existing dotenv, zod and console logging functionality.

## Success Criteria
- Users can run the command with the --config flag and see a clear, JSON-formatted display of the configuration values.
- Automated tests confirm that the flag works as expected and that no existing functionality is broken.