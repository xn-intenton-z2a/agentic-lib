# Sandbox CLI Usage

This document defines the sandbox CLI commands provided by agentic-lib in sandbox mode, driving autonomous validation, configuration management, and integration workflows. Each command aligns with our mission to enable continuous, agentic code evolution through automated validation and configuration checks.

# Commands

- **--validate-features**: Ensures all markdown files in sandbox/features reference the mission statement. Logs errors for missing references and exits with non-zero status on failure.
- **--fix-features**: Prepends a mission statement reference to markdown files under sandbox/features that lack one. Logs modified files and exits with zero status.
- **--generate-interactive-examples**: Scans sandbox/README.md for mermaid-workflow code blocks, renders interactive HTML snippets, and maintains a single idempotent Examples section at the end of the README.
- **--features-overview**: Generates a markdown summary of all sandbox CLI flags and descriptions, writes to sandbox/docs/FEATURES_OVERVIEW.md, and logs the overview string.
- **--audit-dependencies**: Runs npm audit with configurable severity threshold via AUDIT_SEVERITY, logs detailed errors for vulnerabilities meeting or exceeding the threshold, or logs success with vulnerability counts.
- **--bridge-s3-sqs**: Uploads a payload to S3 and dispatches an SQS message with object location and optional attributes; requires --bucket and --key arguments, accepts --payload or --payload-file and optional --message-attributes.
- **--validate-package**: Reads and parses package.json, validates required fields (name, semver version, description, main, scripts.test, engines.node >=20.0.0), logs errors per invalid field, and exits non-zero on failure.
- **--validate-tests**: Reads coverage metrics from coverage/coverage-summary.json and enforces minimum thresholds (80% statements, branches, functions, lines); logs errors for each failing metric or logs success with coverage summary.
- **--validate-lint**: Runs ESLint with zero max warnings on sandbox/source and sandbox/tests, logs detailed violations and exits non-zero on any failure.
- **--validate-license**: Ensures LICENSE.md exists and its first non-empty line begins with a valid SPDX identifier (MIT, ISC, Apache-2.0, GPL-3.0); logs errors on missing file or invalid identifier.
- **--validate-config**: Validates the agent_config.yaml file in the project root. Parses YAML using js-yaml and confirms presence of required top-level keys: schedule, paths, buildScript, testScript, mainScript. On success, logs an info message indicating all configuration keys are valid. On failure, logs errors for each missing or invalid key and exits with a non-zero status.

# Implementation

Add a new processValidateConfig function in sandbox/source/main.js that reads agent_config.yaml, uses js-yaml to parse its contents, validates each required key, and integrates into the CLI dispatch sequence alongside existing process* functions.

# Testing

Create sandbox/tests/validate-config.test.js to cover scenarios: missing file, invalid YAML syntax, missing top-level keys, and successful validation. Use vitest mocks for fs/promises and process.exit to assert correct logging and exit codes.

# Documentation

Update sandbox/README.md and sandbox/docs/USAGE.md to include the --validate-config command under the Usage section, describing success and failure outputs. Ensure consistency with existing command documentation.