# Overview
This feature introduces a new command-line flag, --stats, that provides runtime statistics about the current process and execution environment. The flag outputs a JSON-formatted report that includes metrics like process uptime and the global call count. This addition enhances the observability of the CLI tool and aids in debugging and performance evaluation.

# Implementation
The --stats flag is integrated into the main CLI processing flow in src/lib/main.js. When the flag is present, the CLI will generate a JSON output containing details such as:
  - callCount: The global call count maintained for testing consistency
  - uptime: The process uptime gathered using process.uptime()

This feature requires modifying the existing main function in src/lib/main.js to handle the --stats flag similarly to how --help, --version, and --digest are processed. In addition, tests in tests/unit/main.test.js will be updated to simulate the flag and verify that the correct data is output.

# User Scenarios
- A developer can run the CLI with the --stats flag to quickly view current runtime statistics without triggering the other actions.
- It assists in debugging scenarios where understanding the process uptime and the frequency of function calls (via callCount) is necessary.

# Testing
Unit tests will be added or updated to simulate running the CLI with the --stats flag. The tests will verify that the CLI outputs the expected JSON structure with the correct data fields. Existing tests will ensure that the introduction of this flag does not interfere with current CLI functionalities.

# Documentation
The README file will be updated in the CLI usage section to include the --stats flag along with its description and usage instructions. This ensures that users are aware of the new capability and how to use it directly from the command line.

# Dependencies
No new external dependencies are required for this feature. It integrates with the existing Node.js process APIs and existing global variables.
