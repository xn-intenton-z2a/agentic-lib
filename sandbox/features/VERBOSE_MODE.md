# VERBOSE_MODE

## Overview

This feature adds support for a new --verbose CLI flag that toggles detailed logging. When the --verbose flag is provided, the library will activate more detailed logging output during execution. This is designed to help users and developers diagnose issues by providing additional information in logs.

## Implementation Details

- Change the global verbose flag from a constant to a mutable variable so that it can be dynamically updated. This involves changing the declaration from a constant to a variable (for example, using let).
- In the main CLI function, parse process.argv to check for the --verbose flag. When detected, set the verbose variable to true.
- Update the helper functions logInfo and main to conditionally include additional logging details when verbose mode is active.
- Update the CLI usage instructions in the generateUsage helper to describe the new --verbose flag.

## Documentation Changes

- Update the README file under the CLI section to include instructions on using the --verbose flag to enable detailed logging output.
- Ensure that the updated usage message appears when the --help flag is used.

## Testing

- Add tests in the test files to confirm that, when --verbose is provided, the output includes additional diagnostic logs.
- Ensure that existing functionality remains unaffected when the flag is not provided.

## Success Criteria

- Users can enable verbose logging by appending the --verbose flag to the command.
- The command usage instructions document the new flag.
- Tests verify that additional logging is produced in verbose mode without impacting other functionalities.