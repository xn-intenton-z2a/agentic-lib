# CONFIG_DIFF Feature Specification

This feature introduces a new CLI flag, `--config-diff`, that displays the differences between the default configuration values and the current effective configuration. The feature is designed to enhance transparency by allowing users and developers to quickly see which configuration values have been overridden by environment variables or a .env file.

## Objectives

- **Enhanced Visibility:** Provide a clear comparison between the built-in default configuration and the current configuration loaded by the application.
- **Troubleshooting Aid:** Help users diagnose configuration issues by highlighting which values differ from the expected defaults.
- **Lightweight Implementation:** Achieve the value by modifying only the source file, test file, and README file, without introducing new files or dependencies.

## Implementation Details

- **Source File Updates (src/lib/main.js):**
  - Define a constant object (`defaultConfig`) with the default values (e.g. `GITHUB_API_BASE_URL` set to "https://api.github.com.test/" and `OPENAI_API_KEY` set to "key-test").
  - Implement a new function `configDiffHandler()` that compares the current configuration (loaded via Zod) with the default values. The function will create a diff object that maps each key whose value differs from the default to an object containing the default value and the current value. The diff is then output as formatted JSON.
  - Update the main CLI logic to check for the `--config-diff` flag. When the flag is provided, the CLI should invoke `configDiffHandler()` and exit immediately.

- **Test File Updates (tests/unit/main.test.js):**
  - Add a new test suite or test case to verify that when the `--config-diff` flag is supplied, the output includes the configuration differences. This test should capture console output and check that it lists differences between the default configuration and the current effective configuration.

- **README File Updates (README.md):**
  - Update the CLI Commands section to document the new `--config-diff` flag with a description such as:
    
    > `--config-diff`: Display the differences between the default configuration values and the current effective configuration.

## Success Criteria & Verification

- When the application is run with the `--config-diff` flag, the output must include a JSON object that maps configuration keys to objects describing the default and current values for each differing configuration.
- Automated tests must confirm that the diff output is correctly generated, especially when environment variables override the default values.
- No changes are made to existing features beyond extending the CLI options, and the overall application functionality remains consistent.

## Dependencies & Constraints

- This feature does not introduce any new dependencies; it utilizes existing environment handling and JSON formatting.
- The feature is fully confined to modifying existing files (source, tests, and README), in compliance with repository guidelines.

By implementing the `CONFIG_DIFF` feature, the repository will provide users with a simple and effective tool to compare and diagnose configuration settings, furthering the mission of transparency and enhanced agentic operations.