# Overview
This feature introduces a new CLI flag --dry-run to enable simulation mode. When --dry-run is provided, the tool will simulate the execution of commands without performing any real processing or side effects. This helps users verify their commands and configurations safely before triggering live actions.

# Implementation Details
- Update the main CLI in src/lib/main.js to detect the --dry-run flag early in the argument parsing logic. When present, set an internal flag that controls execution flow.
- For the --digest command, check if --dry-run is active. If so, log a simulation message indicating that the digest event is being simulated rather than processed.
- Ensure that no external calls or changes are made when in dry-run mode. Only log what would have been executed.
- Update the CLI usage instructions to include details about the --dry-run flag.

# Testing and Verification
- In tests/unit/main.test.js, create tests that simulate calling the CLI with the --dry-run flag and confirm that the simulation message is output instead of executing actual handler logic.
- Verify that when --dry-run is combined with other flags (for example, --digest), the dry-run behavior takes precedence and no real actions are triggered.

# Documentation Update
- Update the README file to document the new --dry-run flag, including its purpose, usage examples, and benefits for safely testing commands.

# Benefits
By enabling dry-run mode, users can validate their workflows and command-line options without unintended side effects. This supports robust testing and debugging, aligning with the mission of enabling autonomous and safe repository operations.