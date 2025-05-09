# Objective

Add comprehensive CLI usage instructions for console capture integration in the README. Guide users on how to enable grouped console output in Vitest using environment variables and the setup file.

# Value Proposition

Enhances discoverability of the console capture utility for testing workflows. Empowers developers to quickly enable and interpret buffered logs, improving debugging and test diagnostics without exploring external documentation.

# Scope

- Modify package.json:
  - Update the "test" and "test:unit" scripts to include the --setupFiles option pointing to sandbox/tests/consoleCapture.vitest.setup.js.
- Update sandbox/README.md Running Tests section:
  - Document setting VITEST_CONSOLE_CAPTURE=true to enable console capture.
  - Provide CLI invocation example for Vitest with the setup file flag and relevant test paths.
  - Link to Console Capture Utility documentation in sandbox/docs/CONSOLE_CAPTURE.md.

# Success Criteria

1. package.json test and test:unit scripts include --setupFiles=sandbox/tests/consoleCapture.vitest.setup.js.
2. README contains clear examples:
   - Setting the VITEST_CONSOLE_CAPTURE environment variable.
   - Running Vitest with the setup file for console capture.
3. Existing tests pass without any code changes.
4. Users can locate and follow console capture CLI usage directly from the README.