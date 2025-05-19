# Purpose
Add runtime usage statistics tracking to both the CLI entry points and the Lambda handler to provide operators with real-time insight into how often actions run and for how long the process has been alive.

# Value Proposition
Operators, CI systems, and observability tools can easily monitor invocation counts and uptime without external monitoring services. This enables faster debugging, capacity planning, and reliability reporting with zero additional dependencies.

# Success Criteria & Requirements
1. Each invocation of main, processVersion, processHelp, processDigest, and digestLambdaHandler must increment a global counter.
2. Introduce a new CLI flag `--stats` that, after any command completes, prints a JSON object containing:
   - `callCount`: total number of invocations since process start
   - `uptime`: process.uptime() in seconds
3. Ensure `--stats` works in combination with `--help`, `--version`, `--digest`, and default behavior.
4. No new dependencies; rely only on built-in modules and existing test setup.

# Implementation Details
- In **src/lib/main.js**:
  - Initialize or reset `globalThis.callCount` at startup.
  - At the very start of each entry point (main(), processHelp, processVersion, processDigest, digestLambdaHandler), increment `globalThis.callCount`.
  - Detect `--stats` in the argument list and, after the primary action, output JSON via `console.log(JSON.stringify({ callCount, uptime }))`.
  - Update usage text in `generateUsage()` to describe `--stats` and provide an example.
- In **tests/unit/main.test.js**:
  - Mock `process.uptime()` to a fixed value.
  - Write tests for combinations:
    - `node main.js --stats`
    - `node main.js --version --stats`
    - `node main.js --help --stats`
    - Test that `digestLambdaHandler` increments the counter and stats flag reflects it.
- In **sandbox/README.md**:
  - Document the `--stats` flag, explain output format, and include usage examples.

# Test Scenarios
- Running `node src/lib/main.js --stats` outputs default usage text followed by stats JSON with `callCount >= 1` and `uptime > 0`.
- Running `node src/lib/main.js --version --stats` prints version info, then stats JSON showing at least two invocations.
- Invoking Lambda handler directly and then running CLI with `--stats` reflects cumulative `callCount`.

# Dependencies & Constraints
No external libraries or services; must run under Node 20 with existing Vitest setup. All changes confined to the source file, the unit test file, and the sandbox README.

# Verification & Acceptance
- All new and existing tests pass under `npm test`.
- Manual CLI runs produce valid JSON for stats and consistent behavior with and without the flag.
- README examples render correctly and link to existing documentation.