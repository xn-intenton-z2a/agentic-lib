# Objective
Provide a unified CLI tool in sandbox mode that validates key repository artifacts including documentation, interactive examples, package manifest, linting, test coverage, license files, dependency security, and ensures consistency with the mission. Additionally, enable bridging from S3 to SQS using the s3-sqs-bridge library for autonomous event dispatch.

# Specification

## --validate-features
 • Read all markdown files under sandbox/features/
 • Ensure each file contains a reference to MISSION.md or a # Mission heading
 • Log errors with file path and exit status 1 on failures
 • Log info and exit status 0 on success

## --validate-readme
 • Read sandbox/README.md
 • Verify it includes links to MISSION.md, CONTRIBUTING.md, LICENSE.md, sandbox/docs/USAGE.md, and the agentic-lib repository URL
 • Report missing or malformed headers or links as errors and exit status 1
 • Log info and exit status 0 on success

## --validate-package
 • Read root package.json
 • Parse its JSON and confirm required fields:
   - name (non-empty string)
   - version (semver compliant)
   - description (non-empty string)
   - main (path to entrypoint)
   - scripts.test defined
   - engines.node >=20.0.0
 • For each missing or invalid field, log a JSON error with field name and exit status 1
 • On success, log a JSON info message and exit status 0

## --fix-features
 • Scan sandbox/features/ for markdown files
 • For each file missing a mission reference, prepend a link to MISSION.md
 • Write changes and log info with list of modified files and exit status 0
 • On write failure, log error and exit status 1

## --generate-interactive-examples
 • Locate mermaid-workflow fenced code blocks in sandbox/README.md
 • Render each block to an interactive HTML snippet using markdown-it and markdown-it-github
 • Remove any existing Examples section and insert a new idempotent ## Examples section with rendered snippets
 • If no blocks found, log warning and exit status 0
 • On rendering or file I/O errors, log error with details and exit status 1

## --features-overview
 • Inspect the CLI’s registered flags and their descriptions
 • Generate a markdown summary listing each flag, its usage, and description
 • Print the summary to stdout in a JSON info log and write or update sandbox/docs/FEATURES_OVERVIEW.md
 • Exit status 0 on success, error logged and exit status 1 on failure

## --validate-tests
 • Execute npm test with coverage reporting
 • Parse JSON coverage summary to ensure statements, branches, functions, and lines meet a configurable threshold (default 80%)
 • If any metric is below threshold, log a JSON error with metric name, threshold, and actual value, then exit status 1
 • On success, log a JSON info message indicating coverage details and exit status 0
 • On spawn or parsing errors, log JSON error and exit status 1

## --validate-lint
 • Locate ESLint configuration
 • Run ESLint against sandbox/source/ and sandbox/tests/ using child process
 • Capture stdout and stderr from lint run
 • If ESLint exits with non-zero code, parse output and log JSON errors for each finding including file path, line, column, ruleId, and message, then exit status 1
 • On zero exit code, log a JSON info message indicating lint passed and exit status 0

## --validate-license
 • Read LICENSE.md in project root
 • Verify the file exists and is non-empty
 • Confirm the first non-empty line matches a valid SPDX license identifier pattern (MIT, ISC, Apache-2.0, GPL-3.0)
 • On failure, log a JSON error with message License missing or invalid SPDX identifier and exit status 1
 • On success, log a JSON info message License validation passed and exit status 0

## --audit-dependencies
 • Run npm audit --json in project root using a child process
 • Parse the JSON output of the audit command
 • Group vulnerabilities by severity (low, moderate, high, critical)
 • Default threshold is moderate; configurable via environment variable AUDIT_SEVERITY
 • For each vulnerability at or above threshold, log a JSON error including module name, severity, title, vulnerable versions, patched versions, and advisory URL
 • If any such vulnerabilities exist, exit status 1
 • If no vulnerabilities at or above threshold, log a JSON info message summarizing counts by severity and exit status 0

## --bridge-s3-sqs
 • Parse CLI arguments for bucket, key, optional --payload-file path, and optional --message-attributes JSON
 • Use the s3-sqs-bridge library to upload the payload to the specified S3 bucket under the given key
 • After successful upload, send an SQS message with the S3 object location and provided message attributes
 • On missing or invalid arguments, log a JSON error with argument details and exit status 1
 • On AWS SDK or bridge errors, log a JSON error with error details and exit status 1
 • On success, log a JSON info message with bucket, key, and SQS message ID and exit status 0