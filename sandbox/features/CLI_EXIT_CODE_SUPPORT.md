# Objective
Provide standardized exit codes for the CLI commands to improve scriptability and error handling when invoking the tool in automated workflows.

# Value Proposition
Ensuring consistent exit codes allows calling processes and CI pipelines to detect success or failure conditions programmatically. Users can rely on exit codes for integrating the CLI into larger automation, monitoring, and deployment scripts.

# Scope
- Modify src/lib/main.js to explicitly call process.exit with appropriate codes after processing --help, --version, and --digest flags.
- Introduce exit code 0 for successful handling of help, version, and digest commands.
- Introduce exit code 1 for unrecognized commands or error conditions (for example, failure reading package.json or JSON parse errors in digest processing).
- Add new tests in tests/unit/cliExitCode.test.js to verify exit code behavior for each flag and error scenario.
- Update sandbox/README.md and root README to document the exit code semantics for CLI users.

# Requirements
- processHelp, processVersion, and processDigest handlers must call process.exit(0) after logging their outputs (when executed directly from the CLI).
- main must call process.exit(1) when no supported flag is provided or when an internal error occurs.
- In error catch blocks (e.g., version file read failure), call process.exit(1) after logging the error.
- Tests should spawn the CLI as a child process or mock process.exit to assert the code returned.
- Maintain existing ESM module format and Node 20+ compatibility.

# Success Criteria
- Demonstrated exit code 0 for --help, --version, and --digest via automated tests.
- Demonstrated exit code 1 for unrecognized flags and simulated error in version retrieval.
- Updated documentation clearly explains exit codes for each scenario.

# Verification
1. Run `node src/lib/main.js --help` and verify the process exits with code 0.
2. Run `node src/lib/main.js --version` and verify the process exits with code 0.
3. Run `node src/lib/main.js --digest` and verify the process exits with code 0.
4. Run `node src/lib/main.js --unknown` and verify the process exits with code 1.
5. Simulate version retrieval error (e.g., corrupt package.json) and verify exit code 1.