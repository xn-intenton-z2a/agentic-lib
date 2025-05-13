# Overview

The Sandbox CLI is a unified command-line tool for automating sandbox environment maintenance tasks. It provides a suite of repository checks, documentation updates, dependency audits, AWS integrations, and automated dependency upgrades, all executable via simple flags. It operates directly on sandbox paths.

# Commands

• --generate-interactive-examples
  Scans sandbox/README.md for mermaid-workflow fenced code blocks. Renders each block into interactive HTML snippets using markdown-it and the GitHub plugin. Maintains a single, idempotent Examples section at the end of README.

• --fix-features
  Scans markdown files under sandbox/features. Prepends a mission statement reference line (> See our [Mission Statement](../../MISSION.md)) to any file missing MISSION.md or # Mission.

• --validate-features
  Ensures all markdown files in sandbox/features include a reference to the mission statement (MISSION.md or # Mission). Emits errors for missing references and exits non-zero.

• --validate-readme
  Verifies sandbox/README.md contains links to MISSION.md, CONTRIBUTING.md, LICENSE.md, and the repository URL. Logs missing reference errors and exits non-zero.

• --features-overview
  Generates a FEATURES_OVERVIEW.md by summarizing each supported CLI flag and its description in a markdown table. Writes to sandbox/docs/FEATURES_OVERVIEW.md.

• --audit-dependencies
  Runs npm audit --json, filters vulnerabilities at or above AUDIT_SEVERITY (low|moderate|high|critical, default moderate), and fails on matches. Logs structured error entries or a success summary.

• --bridge-s3-sqs
  Uploads a payload to S3 and dispatches an SQS message with the object location. Requires --bucket and --key. Payload and message attributes can be provided inline or via file flags.

• --validate-package
  Parses and validates the root package.json for required fields.

• --validate-tests
  Validates test coverage metrics (statements, branches, functions, lines) meet the 80% threshold.

• --validate-lint
  Runs ESLint on sandbox source and tests, reporting any lint violations.

• --validate-license
  Ensures LICENSE.md exists and has a valid SPDX license identifier.

• --upgrade-dependencies [--target minor|greatest]
  Automates dependency maintenance by invoking npm-check-updates. Scans package.json, upgrades dependencies according to the specified target level (minor or greatest), writes the updated package manifest, and runs npm install to apply updates. Defaults to minor upgrades when no target is provided.

# Requirements

• Node.js 20+ with ESM support.
• Dev dependency: npm-check-updates (already present in devDependencies).
• Environment variable AUDIT_SEVERITY to configure audit threshold.
• AWS credentials and region for S3/SQS bridge.

# Verification & Testing

- Unit tests should mock fs/promises, child_process (spawnSync), and file operations. Verify:
  - Flag not provided returns false.
  - --upgrade-dependencies without target spawns npm-check-updates with default minor flags and installs dependencies.
  - --upgrade-dependencies --target greatest spawns npm-check-updates with greatest flags.
  - Errors from npm-check-updates or npm install are logged and cause exit code 1.
  - Successful upgrade logs structured info and exits code 0.
- Integration tests can simulate package.json fixtures to assert file updates and install invocation.
