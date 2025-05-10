# Objective & Scope

Extend the existing unified JSON output feature to incorporate automated code coverage reporting in CI and expose a coverage status badge in the README. This single feature will deliver structured machine-readable outputs for tests and CLI commands as well as integrate coverage metrics enforcement and visibility.

# Value Proposition

- Consistent JSON output for test results and CLI interactions enables seamless integration with CI/CD pipelines and downstream tooling.
- Automated code coverage reporting ensures code quality and maintains visibility into test completeness.
- A visible coverage badge in the README promotes confidence for contributors and consumers by surface coverage health at a glance.

# Success Criteria & Requirements

- Users can emit JSON output for tests and CLI commands via --json flag or JSON_OUTPUT environment variable as before.
- A new script or configuration produces code coverage reports automatically when running test commands in CI.
- Tests must enforce a minimum coverage threshold (e.g., 80% statements, branches, functions, and lines) and fail if thresholds are not met.
- README displays a live coverage badge sourced from a coverage service or shields.io that reflects current coverage percentage.
- No additional files beyond package.json, src/lib/main.js, README.md, and tests are created or deleted.

# Implementation Details

1. Package.json updates
   • Update test:unit script to include --coverage flag: ``vitest --coverage tests/unit/*.test.js sandbox/tests/*.test.js``.
   • Add a coverage threshold configuration inline via Vitest CLI flags: ``--coverage --coverage-report=lcov --coverage-report=text-summary --coverageThreshold='{"statements":80,"branches":80,"functions":80,"lines":80}'``.
   • Add a dedicated coverage script alias, e.g.  "coverage": "npm run test:unit".

2. src/lib/main.js
   • No changes to existing JSON output logic; maintain JSON behavior unchanged when coverage reporting is invoked.

3. README.md updates
   • Add a coverage badge at the top using shields.io syntax, linking to the project coverage report endpoint:  
     ![Coverage](https://img.shields.io/badge/coverage-__%25-brightgreen)
   • Document how to run coverage locally:  
     npm run coverage  
   • Show JSON output examples and coverage summary invocation.

4. Tests
   • Extend or add a test to simulate running Vitest with the coverage flags and parse the text-summary output to verify JSON validity and that coverage thresholds are enforced.

# Verification & Acceptance Criteria

- Running npm run test:unit locally without --json continues to emit human-readable output and produces coverage reports in ./coverage.
- Running npm run coverage in CI emits coverage summary and fails if thresholds are not met.
- README displays the coverage badge with a percentage and updates automatically when coverage changes.
- Existing JSON output tests remain passing and unmodified default behavior is preserved.
