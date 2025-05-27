# Objective
Extend the existing CLI tests by exporting internal helper functions from src/lib/main.js and adding comprehensive unit and integration tests for generateUsage, processHelp, processVersion, and processDigest. Ensure reliable behavior and achieve >90% coverage on critical CLI code paths.

# Implementation Changes

1. Export CLI helpers from src/lib/main.js:
   • Add `export { generateUsage, processHelp, processVersion, processDigest }` after their definitions.
   • Ensure they are documented in sandbox/README.md under a new "CLI Flags" section.

2. Document CLI flags in sandbox/README.md:
   • --help: shows usage text.
   • --version: prints JSON with version and timestamp.
   • --digest: invokes the digest handler and logs results.

# Unit Tests (tests/unit)

## tests/unit/cli.test.js
- Import `generateUsage`, `processHelp`, `processVersion`, `processDigest`, and `digestLambdaHandler` from src/lib/main.js.
- Mock dependencies:
  • Spy on `console.log` and `console.error` using Vitest.
  • Mock `fs.readFileSync` for processVersion tests to return a known package.json.
  • Spy on `digestLambdaHandler` to return a fixed payload.
- Test cases:
  1. `generateUsage()` returns a non-empty usage string containing "--help" and "--version".
  2. `processHelp(["--help"])` returns true and logs usage; `processHelp([])` returns false without logging.
  3. `processVersion(["--version"])` returns true, logs valid JSON with `version` and ISO timestamp; without flag returns false and does not log.
  4. `processDigest(["--digest"])` returns true and calls `digestLambdaHandler` with event from `createSQSEventFromDigest`; without flag returns false and does not call.

## tests/unit/lambdaHandler.test.js
- Verify `createSQSEventFromDigest`: given sample digest, returns event with correct Records array and JSON body.
- Verify `digestLambdaHandler`:
  • Valid record body logs info and returns `{ batchItemFailures: [] }`.
  • Invalid JSON body logs errors and returns `batchItemFailures` containing at least one entry.

# Integration Feature Test (sandbox/tests)

## sandbox/tests/cli.feature.test.js
- Use `child_process.exec` or `execa` to run `node src/lib/main.js` with each flag:
  1. `--help`: exit code 0, stdout contains usage text.
  2. `--version`: stdout is valid JSON with `version` matching package.json and `timestamp` matching ISO format.
  3. `--digest`: stdout includes JSON log entries from the digest handler indicating a successful invocation.
- Ensure tests run under the existing `npm test` script without modifying its patterns.

# Verification & Acceptance

- Running `npm test` passes all new and existing tests.
- Coverage report shows >90% coverage for src/lib/main.js critical functions.
- Manual smoke tests:
  • `npm run sandbox -- --help`
  • `npm run sandbox -- --version`
  • `npm run sandbox -- --digest`

