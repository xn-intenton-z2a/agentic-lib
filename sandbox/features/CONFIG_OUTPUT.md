# Overview
This feature adds a new CLI flag --config that allows users to output current configuration values directly from the runtime environment. The configuration is validated via the existing zod schema and printed in a structured JSON format. This assists operators and developers in quickly confirming which environment settings are active, aiding debugging and configuration transparency.

# Implementation Details
1. Update the source file (src/lib/main.js):
   - Add a new function processConfig that checks if the command line arguments include --config. If yes, output the parsed config object in JSON format.
   - Update the main CLI handler to handle this flag before other commands. Ensure that if --config is present, the process prints the configuration and exits.
2. Update the usage instructions within the generateUsage helper function to include --config, so users are aware of its availability.
3. Modify test files (tests/unit/main.test.js):
   - Add unit tests to simulate command line input with --config and verify that the output JSON matches the expected configuration structure.
4. Update the README file (sandbox/README.md) by adding a brief section under the Usage heading that documents the --config flag and its benefits.
5. No new dependencies are introduced. Existing libraries (dotenv and zod) are used to manage and validate configuration values.

# Benefits
- Enhances transparency by allowing users to quickly view current configuration values.
- Simplifies troubleshooting in environments with multiple configuration sources.
- Aligns with the mission to support autonomous, agentic workflows through improved diagnostics and operational clarity.
