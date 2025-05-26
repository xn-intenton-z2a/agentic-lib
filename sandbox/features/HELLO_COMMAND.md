# Hello Command

## Objective & Scope
Implement a new CLI flag --hello and default no-argument behavior that prints the message Hello World to the console. This feature will reside in sandbox/source/main.js and adjust tests and documentation accordingly.

## Value Proposition
Provides users a simple way to output Hello World, aligning with the mission and serving as a demonstration of basic CLI functionality and library usage.

## Success Criteria & Requirements
- When the CLI is invoked with --hello, the console outputs Hello World! exactly.
- When the CLI is invoked with no arguments, it also outputs Hello World! and then exits without error.
- Existing flags --help, --version, and --digest continue to function unchanged.
- Tests cover both the --hello flag and default invocation.

## Dependencies & Constraints
- No new external dependencies are introduced.
- Changes confined to sandbox/source/main.js, sandbox/tests/main.test.js, and sandbox/README.md.

## User Scenarios & Examples
Scenario 1: User runs npx sandbox/source/main.js --hello
  The CLI prints Hello World! and exits.

Scenario 2: User runs npx sandbox/source/main.js with no flags
  The CLI prints Hello World! and exits.

## Verification & Acceptance
- Add tests in sandbox/tests/main.test.js to assert process output for --hello and no flags.
- Manually run npm run sandbox to verify the output.