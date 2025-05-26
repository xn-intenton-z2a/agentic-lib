# Hello Command
## Objective & Scope
Implement a new --hello flag in the CLI entrypoint at sandbox/source/main.js. When invoked with --hello, the CLI should immediately print Hello World! and exit without processing other commands.

## Value Proposition
Provides a direct way to fulfil the mission statement, confirming the tool is installed and operational. Establishes a pattern for future commands by showing how flags are parsed and executed.

## Success Criteria & Requirements
- Recognize --hello in the argument list before any other flag.
- Output the exact string Hello World! to standard output.
- Terminate execution successfully (exit code 0) after printing.
- No impact on existing --help, --version, and --digest flags when --hello is not provided.

## Dependencies & Constraints
- Only modify sandbox/source/main.js, sandbox/tests/main.test.js, sandbox/README.md and package.json scripts if needed.
- No additional dependencies required.

## User Scenarios & Examples
- Command: npm run sandbox -- --hello
  Expected: Hello World!
- Command: node sandbox/source/main.js --hello
  Expected: Hello World!

## Verification & Acceptance
- Add one or more tests in sandbox/tests/main.test.js to assert Hello World! is printed when --hello is provided.
- Run npm test to confirm tests pass and no regressions occur.