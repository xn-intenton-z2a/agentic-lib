# Overview
This feature introduces a new CLI flag --stats that provides runtime statistics. When users invoke the command with --stats, the application will output a JSON object containing runtime metrics such as the global call count and process uptime. This improves observability and allows users to quickly diagnose operational conditions without manually enabling verbose modes.

# Implementation Details
1. Modify the main CLI in src/lib/main.js to add a new function processStats that checks if the arguments array contains the flag --stats.
2. If the flag is present, processStats will output a JSON string containing { callCount, uptime } gathered from globalThis.callCount and process.uptime(). Then return control to exit the main execution flow.
3. Integrate processStats into the main function so that it is evaluated along with --help, --version, and --digest. This ensures a consistent user experience.
4. Update the test file tests/unit/main.test.js to include a new test case for the --stats flag. The test should simulate passing --stats as an argument and verify that the output is a JSON string with the expected runtime statistics.
5. Update sandbox/README.md to document the new --stats CLI flag, including usage examples and expected behavior.

# User Scenarios
- A user can run the command with --stats to quickly obtain system metrics in a JSON format.
- This feature enables administrators to integrate runtime checks into automated monitoring scripts that rely on CLI output.
- The help documentation in the CLI is updated to display the usage of --stats, ensuring that new and experienced users can discover this functionality easily.

# Success Criteria
- The application correctly detects and processes the --stats flag and returns a valid JSON with the correct runtime metrics.
- Unit tests pass confirming that --stats flag behaves as expected without interfering with other CLI functionalities.
- Documentation is updated in the README to refer to the new CLI option.

# Dependencies & Constraints
- The feature only modifies existing files: the main source file, test file, README, and package.json if necessary.
- This feature is consistent with existing CLI behavior and adheres to the agentic-lib mission of enabling autonomous operations.
