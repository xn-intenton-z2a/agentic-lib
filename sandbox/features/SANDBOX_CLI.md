# Overview

The Sandbox CLI is a unified command-line tool for automating sandbox environment maintenance tasks and exposing sandbox workflows as an HTTP service. It provides a suite of repository checks, documentation updates, dependency audits, AWS integrations, automated dependency upgrades, semantic release automation, workflow configuration validation, and a lightweight HTTP endpoint for processing SQS-like events.

# Commands

• --generate-interactive-examples
  Scans sandbox/README.md for mermaid-workflow fenced code blocks. Renders each block into interactive HTML snippets using markdown-it and the GitHub plugin. Maintains a single, idempotent Examples section at the end of README.

• --fix-features
  Scans markdown files under sandbox/features. Prepends a mission statement reference line to any file missing MISSION.md or # Mission.

• --validate-features
  Ensures all markdown files in sandbox/features include a reference to the mission statement (MISSION.md or # Mission). Emits errors for missing references and exits non-zero.

• --validate-readme
  Verifies sandbox/README.md contains links to MISSION.md, CONTRIBUTING.md, LICENSE.md, and the repository URL. Logs missing reference errors and exits non-zero.

• --features-overview
  Generates a FEATURES_OVERVIEW.md by summarizing each supported CLI flag and its description in a markdown table.

• --audit-dependencies
  Runs npm audit --json, filters vulnerabilities at or above AUDIT_SEVERITY (low|moderate|high|critical, default moderate), and fails on matches. Logs structured error entries or a success summary.

• --bridge-s3-sqs
  Uploads a payload to S3 and dispatches an SQS message with the object location. Requires --bucket and --key. Payload and message attributes can be provided inline or via file flags.

• --validate-package
  Parses and validates the root package.json for required fields (name, version, description, main, scripts.test, engines.node >=20.0.0). Fails on missing or invalid fields.

• --validate-tests
  Validates test coverage metrics (statements, branches, functions, lines) meet the 80% threshold by reading coverage/coverage-summary.json.

• --validate-lint
  Runs ESLint on sandbox source and tests, reporting any lint violations.

• --validate-license
  Ensures LICENSE.md exists and has a valid SPDX license identifier (MIT, ISC, Apache-2.0, GPL-3.0).

• --validate-workflows
  Scans the .github/workflows directory for YAML workflow files. For each file, parses the YAML using js-yaml, and ensures the on.workflow_call trigger is defined. Checks that inputs or uses sections reference agentic-lib workflows or expected inputs. Logs errors for missing or invalid workflow_call configurations and exits non-zero.

• --upgrade-dependencies [--target minor|greatest]
  Automates dependency maintenance by invoking npm-check-updates. Scans package.json, upgrades dependencies according to the specified target level, writes the updated manifest, and runs npm install.

• --serve-http [--port <port>]
  Starts a lightweight HTTP server on the specified port (default 3000). Exposes a POST /events endpoint that accepts a JSON payload matching an AWS SQS event format.

• --release [--type patch|minor|major]
  Automates semantic release tasks: determines the latest git tag, bumps the version in package.json according to the specified increment (default patch), generates or updates CHANGELOG.md by extracting commit messages since the last tag, prepends a new changelog entry with version and date, and writes updated files.

# Requirements

• Node.js 20+ with ESM support.
• Git CLI available in PATH for release operations.
• Dev dependency: npm-check-updates (already present).
• Dev dependency: js-yaml for workflow validation.
• No additional dependencies for HTTP and git operations.
• AWS credentials and region for S3/SQS bridge flags.

# Verification & Testing

Unit tests should mock fs/promises, child_process.spawnSync, js-yaml parsing, HTTP server methods, and Lambda handler. Specifically for workflow validation tests, they should:

- Mock readdir and readFile to return sample YAML files.
- Mock js-yaml.load to simulate valid and invalid workflow_call entries.
- Verify that processValidateWorkflows logs errors for missing workflow_call triggers and exits with code 1.
- Verify success path when all workflows include correct workflow_call definitions.

Integration tests can use a temporary directory with sample .github/workflows files to run --validate-workflows and inspect console output and exit codes.
