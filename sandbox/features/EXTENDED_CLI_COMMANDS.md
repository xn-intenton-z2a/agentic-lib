# Purpose

Extend the unified CLI entrypoint and JSON test reporting to support a verbose mode for detailed JSON logs across commands and test output.

# Specification

## CLI Integration

- Recognize a new flag --verbose or -v in CLI arguments. When this flag is present, enable runtime verbose mode.
- At startup, parse the --verbose flag before processing other commands, set VERBOSE_MODE and VERBOSE_STATS to true, and remove the flag from the argument list.
- Ensure all logging functions include additional fields when verbose mode is active, including verbose indicators and stack traces for errors.
- Apply verbose behavior to help, version, digest, validate-config, bridge, and playback commands so that detailed JSON log entries appear in stdout or stderr as appropriate.

## Dynamic Verbose Mode Implementation

- Replace static VERBOSE_MODE and VERBOSE_STATS constants with variables initialized based on CLI flags.
- In the main entrypoint, detect the verbose flag, activate verbose mode, then proceed to process other flags and commands.

## JSON Test Reporter Integration

- Introduce a new npm script test:json:verbose that runs vitest with reporter json and verbose output on tests in both tests/unit and sandbox/tests.
- Ensure the verbose JSON test output includes individual test logs at debug level in addition to the standard summary.

## Dependencies File Changes

- Under scripts in package.json, add:
  "test:json:verbose": "vitest --reporter=json --verbose tests/unit/*.test.js sandbox/tests/*.test.js"

## README Updates

- Document the purpose and usage of the --verbose flag for both CLI and test runner.
- Provide example invocations for CLI verbose mode (for example npm start -- --verbose) and for npm run test:json:verbose.

## Testing and Verification

- Running the CLI with --verbose before any command should emit a top-level verbose log entry at startup that includes verbose=true and, if requested, statistics.
- Running npm run test:json:verbose should exit with the same exit code as test:json and print a valid JSON object with detailed per-test debug entries.
