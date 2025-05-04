sandbox/docs/USAGE.md
# sandbox/docs/USAGE.md
# CLI Usage

The agentic-lib provides a command-line interface with the following commands:

- **--help**: Displays this help message and usage instructions.
- **--version**: Shows version information with the current timestamp.
- **--digest**: Simulates an SQS event using a sample digest.
- **--custom-digest**: Simulates a custom SQS event with additional digest fields, including a custom flag and a distinct identifier.

## Examples

Display help:

  node main.js --help

Show version:

  node main.js --version

Run digest simulation:

  node main.js --digest

Run custom digest simulation:

  node main.js --custom-digest

> Note: With the recent refactor, verbose statistics (if enabled) are now logged only once per command execution.
