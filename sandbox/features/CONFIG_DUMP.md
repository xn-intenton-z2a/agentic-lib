# Overview
This feature adds a new CLI flag --config which outputs the current configuration of the application in JSON format. By displaying the parsed environment configuration as defined in the source file, users can verify their settings and troubleshoot environment issues quickly.

# Implementation
The implementation involves the following changes:

1. In the main source file, add a new helper function processConfig that checks if the CLI arguments include "--config". If present, it calls the logConfig function or directly outputs the parsed configuration in a well-formatted JSON structure.
2. Update the main CLI handler to invoke processConfig before other commands, ensuring that if the flag is detected, other processes are skipped after output of the configuration.
3. Modify the CLI usage instructions to include the new --config flag for user reference.

# Testing
Unit tests will be added to the test files to simulate running the application with the --config flag. The test will check that the output contains the expected configuration keys and values. Mocks for environment variables will be used to provide consistent test results.

# Documentation
The README file will be updated to document the new --config flag, describing its purpose, usage, and benefits to the user. This ensures that users are aware of how to access their configuration details without needing to modify code directly.
