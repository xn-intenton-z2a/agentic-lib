# Overview
The CLI_INTERFACE feature unifies sandbox utilities into a single command-line tool, streamlining local development and validation workflows. It centralizes core commands to ensure consistent behavior when simulating events, auditing dependencies, validating project configuration, and inspecting feature and documentation quality.

# Commands
--help
  Show usage instructions and available options.

--env-check
  Validate environment variables against the defined configuration schema. List missing required variables with level "error" and exit code 1, warn about extraneous variables, and on full success log level "info" with a summary of validated variables.

--generate-interactive-examples
  Scan sandbox/README.md for mermaid-workflow code blocks and render each into interactive HTML snippets. Replace or inject an idempotent Examples section at the end of the README with the rendered output.

--fix-features
  Inject a mission statement reference into markdown files under sandbox/features/ that are missing one. Prepend a standard reference line and report modified filenames.

--validate-features
  Ensure every markdown file in sandbox/features references the mission statement. Fail on missing references with level "error" and exit code 1, succeed otherwise with level "info".

--validate-readme
  Verify sandbox/README.md contains links to MISSION.md, CONTRIBUTING.md, LICENSE.md, and the repository URL. Log missing references as errors and exit code 1 or succeed with an info message.

--features-overview
  Generate a FEATURES_OVERVIEW.md in sandbox/docs summarizing each supported CLI option in a markdown table. Overwrite idempotently on repeated runs.

--audit-dependencies
  Run npm audit with a configurable severity threshold (via AUDIT_SEVERITY). Fail on vulnerabilities at or above the threshold with detailed error logs, otherwise log an info summary of counts.

--bridge-s3-sqs
  Upload a payload to an S3 bucket and dispatch an SQS message containing the object location and optional message attributes. Require --bucket and --key parameters; fail if missing.

--validate-package
  Parse and validate the root package.json for required fields: name, version, description, main entry, test script, and Node engine version >= 20. Log missing or invalid fields and fail on errors.

--validate-tests
  Read coverage/coverage-summary.json and enforce minimum thresholds (80%) for statements, branches, functions, and lines. Log each deficit and exit code 1 on failures.

--validate-lint
  Run ESLint on sandbox source and tests, fail on any errors or warnings. Report each violation with file, line, column, ruleId, and message.

--validate-license
  Confirm LICENSE.md exists and its first non-empty line begins with a valid SPDX identifier. Fail on missing file or invalid identifier.

# Requirements
Node.js 20 or higher. File system write permissions for sandbox/README.md and sandbox/docs/. Network permissions for any AWS or HTTP integrations used by commands.

# Testing & Verification
Unit tests should cover:
- env-check behavior: missing/extra variables and success path
- generate-interactive-examples for block rendering and warnings
- fix-features injection and error handling
- validate-features and validate-readme combined and individual behaviors
- features-overview idempotent generation
- audit-dependencies threshold logic and exit codes
- bridge-s3-sqs argument validation and success/failure paths
- validate-package field checks
- validate-tests coverage thresholds
- validate-lint violation parsing
- validate-license SPDX validation