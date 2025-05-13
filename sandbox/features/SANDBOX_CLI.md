# Overview

The Sandbox CLI is a unified command-line tool for automating sandbox environment maintenance tasks. It provides a suite of repository checks, documentation updates, dependency audits, and AWS integrations, all executable via simple flags. It operates directly on sandbox paths.

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

# Verification & Testing

- Unit tests mock fs/promises and child_process to verify each flag’s behavior, error handling, and exit codes.
- Integration tests ensure end-to-end processing of mermaid-workflow rendering, mission reference injection, features overview generation, and dependency audit flow.

# Requirements

• Node.js 20+ with ESM support.
• Dev dependencies: prettier, npm-check-updates, vitest.
• AWS credentials and region configured via AWS_REGION for S3/SQS bridge.
• Environment variable AUDIT_SEVERITY to configure audit threshold.
