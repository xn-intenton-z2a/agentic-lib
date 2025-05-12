# Objective
Provide a unified CLI tool in sandbox mode that validates key repository artifacts including documentation, interactive examples, package manifest, linting, test coverage, license files, dependency security, and ensures consistency with the mission. Additionally, enable bridging from S3 to SQS and offer an HTTP API for remote workflow invocation.

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
 • Parse its JSON and confirm required fields: name, version, description, main, scripts.test, engines.node
 • For each missing or invalid field, log a JSON error and exit status 1
 • On success log a JSON info message and exit status 0

## --fix-features
 • Scan sandbox/features/ for markdown files
 • For each file missing a mission reference, prepend a link to MISSION.md
 • Write changes and log info with list of modified files and exit status 0
 • On write failure, log error and exit status 1

## --generate-interactive-examples
 • Locate mermaid-workflow fenced code blocks in sandbox/README.md
 • Render each block to an interactive HTML snippet using markdown-it and plugin
 • Remove any existing Examples section and insert an idempotent Examples section
 • If no blocks found, log warning and exit status 0
 • On rendering or I/O errors, log error and exit status 1

## --features-overview
 • Inspect registered CLI flags and their descriptions
 • Generate a markdown summary listing each flag and description
 • Write or update sandbox/docs/FEATURES_OVERVIEW.md and log JSON info
 • Exit status 0 on success, exit status 1 on failure

## --validate-tests
 • Execute npm test with coverage reporting
 • Parse JSON coverage summary and ensure statements, branches, functions, and lines meet threshold
 • If any metric is below threshold, log a JSON error and exit status 1
 • On success log a JSON info message and exit status 0

## --validate-lint
 • Locate ESLint configuration
 • Run ESLint against sandbox/source/ and sandbox/tests/
 • Capture output and if ESLint exits non-zero parse findings and log JSON errors
 • On zero exit code log JSON info and exit status 0

## --validate-license
 • Read LICENSE.md and confirm the file exists and is non-empty
 • Ensure the first non-empty line matches a valid SPDX identifier
 • On failure, log a JSON error and exit status 1
 • On success, log a JSON info message and exit status 0

## --audit-dependencies
 • Run npm audit --json
 • Parse the output and group vulnerabilities by severity
 • For each vulnerability at or above threshold, log a JSON error and exit status 1
 • If no issues at or above threshold, log a JSON info message and exit status 0

## --bridge-s3-sqs
 • Parse CLI args for bucket, key, optional payload-file, and message-attributes
 • Use the s3-sqs-bridge library to upload payload and send an SQS message
 • On missing or invalid args or AWS errors, log JSON error and exit status 1
 • On success, log a JSON info message with bucket, key, and message ID and exit status 0

## --serve
 • When invoked with --serve flag or HTTP_MODE env var start an HTTP server on port specified by --port or PORT default 3000
 • Expose POST /digest accepting JSON body with key, value, lastModified; invoke createSQSEventFromDigest and digestLambdaHandler; respond HTTP 200 with batchItemFailures or HTTP 500 with error details
 • Expose GET /health responding HTTP 200 with status ok
 • Log incoming requests and responses as JSON info entries
 • Server runs until terminated without immediate exit