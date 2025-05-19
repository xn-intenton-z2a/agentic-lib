# Purpose

Add runtime usage statistics tracking to the CLI and Lambda handler, enabling operators to monitor invocation counts and uptime. Introduce a --stats flag to expose these metrics on demand after any command execution.

# Value Proposition

Operators and automated workflows gain visibility into how often commands and events run, facilitating debugging, performance analysis, and usage reporting. This feature leverages the existing global callCount and integrates an uptime metric to deliver actionable insights without external dependencies.

# Requirements

1. Increment globalThis.callCount at the start of each entry point: main, processVersion, processHelp, processDigest, and digestLambdaHandler.
2. Add a new CLI flag --stats. When provided alongside any command, after executing the primary action (help, version, digest, or default), print a JSON object with fields callCount and uptime.
3. Update generateUsage text to include the --stats flag description.
4. No external dependencies beyond built-in modules and Vitest.

# Implementation Details

- In src/lib/main.js:
  - At the top of main and in digestLambdaHandler, increment globalThis.callCount.
  - Implement processStats(args) to check for --stats flag and, if present, output JSON with callCount and uptime.
  - Integrate processStats at the end of main flow so stats are shown after any command handling.
  - Update generateUsage to mention --stats.

- In tests/unit/main.test.js:
  - Add tests for the --stats flag verifying console.log outputs a valid JSON with callCount >= 1 and uptime > 0.
  - Mock process.uptime() to a fixed value to assert uptime output.

- In sandbox/README.md:
  - Document the new --stats flag and example output.
  - Update usage examples to include the stats option.

# Test Scenarios

- Running `node main.js --stats` outputs default usage plus stats JSON.
- Running `node main.js --version --stats` outputs version info then stats JSON with callCount reflecting both invocations.
- Invoking digestLambdaHandler increments callCount and, when triggered via CLI with --stats, shows the updated count and uptime.

# Verification & Acceptance

- Unit tests pass covering stats behavior.
- Manual CLI invocation yields correct JSON structure: { "callCount": <number>, "uptime": <seconds> }.
- README examples updated and accurate.
