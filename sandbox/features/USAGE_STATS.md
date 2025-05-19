# Purpose
Implement a runtime usage statistics feature for the CLI and Lambda handler that enables operators to monitor invocation counts and process uptime with a simple flag.

# Value Proposition
Operators and CI/observability systems gain real-time insight into how often commands and handlers run and how long the process has been alive, without requiring external monitoring or modifying infrastructure.

# Success Criteria & Requirements
1. Add a `--stats` CLI flag that, when present in any command (`--help`, `--version`, `--digest`, or default), triggers printing of a JSON object after the primary output.
2. Track a global invocation counter (`globalThis.callCount`) that increments at the start of each entry point: `main()`, `processHelp()`, `processVersion()`, `processDigest()`, and `digestLambdaHandler()`.
3. Compute uptime using `process.uptime()` at the time of stats output.
4. Stats JSON must include `callCount` (integer) and `uptime` (number of seconds with millisecond precision).
5. Ensure no change in behavior if `--stats` is not provided and no new dependencies are added.

# Implementation Details
- In `src/lib/main.js`:
  1. Initialize or reset `globalThis.callCount = 0` at module load if undefined.
  2. At the beginning of each public function (`main()`, `processHelp()`, `processVersion()`, `processDigest()`, `digestLambdaHandler()`), increment `globalThis.callCount` by 1.
  3. Detect `--stats` in the argument list inside `main(args)` before returning, and after printing help, version, digest output, or default usage, output JSON statistics via `console.log(JSON.stringify({ callCount, uptime }))`.
  4. Extract flag detection into a helper `shouldPrintStats(args)` that returns a boolean. Use it in each return path of `main()`.
  5. Update `generateUsage()` output to include a description for `--stats`.

- In `tests/unit/main.test.js`:
  1. Mock `process.uptime()` to return a fixed value, e.g. 1.23 seconds.
  2. Write tests for invocation counts and stats output in four scenarios:
     - `node main.js --stats`
     - `node main.js --help --stats`
     - `node main.js --version --stats`
     - `node main.js --digest --stats`
  3. Verify that `console.log` outputs primary content first and stats JSON last with correct fields.
  4. Test that `digestLambdaHandler()` invoked directly in a test increments `callCount` and that subsequent CLI call with `--stats` reflects cumulative invocations.

- In `sandbox/README.md`:
  1. Document the `--stats` flag with description, JSON schema, and usage examples for each command combination.
  2. Link to MISSION.md and CONTRIBUTING.md.

# Dependencies & Constraints
- Use only built-in Node.js modules and existing test setup (`vitest`).
- Must run on Node 20 in both CI and local environments.
- No new dependencies or external monitoring services.

# Verification & Acceptance
- All existing and new tests pass under `npm test`.
- Manual CLI runs with and without `--stats` produce expected output order and statistics values.
- README examples render correctly and guide users through flag usage.
- Ensure code style and linting pass under existing ESLint and Prettier configurations.