# Test Runner CLI Command

# Overview

Implement a new CLI flag `--run-tests` that invokes Vitest programmatically from within the main application. When this flag is supplied, the CLI will execute all unit tests in `tests/unit/` and `sandbox/tests/`, capture their results, and output a structured JSON summary of test suite names, test case names, pass/fail status, and any console output emitted during tests.

# Objectives & Scope

- Provide a built-in way to run the project's test suite via the library’s CLI without requiring users to call `npm test` separately.
- Collect test results and console output into a consistent JSON stream to facilitate automation and reporting.
- Ensure tests still run correctly under Vitest when invoked normally.

# Value Proposition

- Simplifies developer workflows by enabling tests to be executed through a single CLI binary.
- Enables downstream automation (CI pipelines or other tools) to consume test results as structured JSON.
- Integrates test reporting into the same logging and error patterns already used by the library.

# Requirements & Success Criteria

1. Add a `--run-tests` option to the CLI’s argument processor.
2. Use Vitest’s Node API (`runVitest` or equivalent) to load and execute tests programmatically.
3. Capture test suite results including:
   - Suite name
   - Test case names
   - Pass/fail status
   - Error messages and stack traces for failures
   - Any console logs emitted by tests
4. Output a single JSON object summarizing all suites and test results to STDOUT.
5. Return a nonzero exit code if any tests fail, and zero if all pass.
6. Write or update unit tests to cover:
   - Invocation of `main(["--run-tests"])` triggers test execution
   - JSON structure meets schema expectations
   - Exit code behavior on pass/fail
7. Update `package.json` dependencies if needed to use Vitest’s API.
8. Document the new flag and JSON schema in `README.md` under CLI Usage.

# User Scenarios & Examples

Scenario: A developer wants to include tests as part of another toolchain.
1. On the command line, the developer runs:
   node src/lib/main.js --run-tests
2. The CLI executes all tests and prints:
   {
     "suites": [
       {
         "name": "Main Module Import",
         "tests": [
           {"name": "should be non-null","status": "passed","logs": []},
           ...
         ]
       },
       ...
     ],
     "summary": {"total": 10,"passed": 9,"failed": 1}
   }
3. If any test fails, the process exits with code 1.

# Verification & Acceptance

- Unit tests must be added under `tests/unit/` or `sandbox/tests/` to verify the behavior of `--run-tests`.
- Manual test: running the CLI with and without failures should produce expected JSON and exit codes.
- Automated pipelines should parse the JSON output and detect pass/fail status.
- Peer review should ensure code style matches existing patterns and tests do not interfere with other CLI flags.
