# Overview
The CLI_INTERFACE feature provides a unified command-line experience for both sandbox utilities and the core library. It streamlines developer workflows by exposing sandbox-specific validation, documentation, and AWS bridging commands alongside global library commands for help, versioning, and event simulation.

# Commands

## Sandbox Commands
--help
  Show usage instructions and available options for sandbox mode.

--env-check
  Validate environment variables against the defined configuration schema. List missing required variables with level "error" and exit code 1, warn about extraneous variables, and on success log level "info" with a summary.

--generate-interactive-examples
  Scan sandbox/README.md for mermaid-workflow code blocks and render each into interactive HTML snippets. Replace or inject an idempotent Examples section at the end of the README and log updatedBlocks.

--fix-features
  Inject a mission statement reference into markdown files under sandbox/features that are missing one. Report modified filenames and exit with code 0 on success.

--validate-features
  Ensure every sandbox feature file references the mission statement. Fail on missing references with level "error" and exit code 1, otherwise succeed with level "info".

--validate-readme
  Verify sandbox/README.md contains links to MISSION.md, CONTRIBUTING.md, LICENSE.md, and the repository URL. Log missing references as errors and exit code 1.

--features-overview
  Generate sandbox/docs/FEATURES_OVERVIEW.md summarizing each sandbox CLI command in a markdown table. Overwrite idempotently and log the generated overview.

--audit-dependencies
  Run npm audit with a configurable severity threshold. Fail on vulnerabilities at or above the threshold with detailed error logs, otherwise log an info summary of counts.

--bridge-s3-sqs
  Upload a payload to S3 and send an SQS message containing the object location and optional message attributes. Require --bucket and --key parameters.

--validate-package
  Parse and validate root package.json fields: name, version, description, main, test script, and Node engine version >=20. Fail on missing or invalid fields.

--validate-tests
  Read coverage/coverage-summary.json and enforce minimum thresholds (80%) for statements, branches, functions, and lines. Log deficits and exit code 1 on failures.

--validate-lint
  Run ESLint on sandbox source and tests, fail on any errors or warnings. Report violations with file, line, column, ruleId, and message.

--validate-license
  Confirm LICENSE.md exists and its first non-empty line begins with a valid SPDX identifier. Fail on missing file or invalid identifier.

## Library Commands
--help
  Show usage instructions for the core library CLI, including available flags under src/lib/main.js.

--version
  Output current package version and timestamp as JSON. Fail with error log if retrieval or formatting fails.

--digest
  Simulate an AWS SQS event by generating a sample digest, invoking the digestLambdaHandler, and logging record processing output.

# Requirements
- Node.js 20 or higher
- File system write permissions for sandbox paths and documentation
- Network permissions for AWS or HTTP integrations used by commands

# Testing & Verification
- Unit tests for each sandbox command covering success, warning, and error paths
- Unit tests for library CLI commands (--help returns usage, --version resolves version JSON, --digest invokes handler)
- Integration tests for end-to-end CLI invocation in sandbox and library contexts
- Coverage should meet minimum thresholds for statements, branches, functions, and lines
- Lint validation ensuring no new ESLint violations are introduced
