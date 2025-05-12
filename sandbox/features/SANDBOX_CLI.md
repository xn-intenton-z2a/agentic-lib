> See our [Mission Statement](../../MISSION.md)

# Sandbox CLI

This document describes the commands available in the sandbox CLI tool.

Use the `--help` flag to show usage instructions and additional command options.

## Available Commands

- `--validate-features`   Validates that all markdown files in `sandbox/features/` include a reference to the mission statement.
- `--fix-features`        Inserts a mission statement reference into feature markdown files that are missing one.
- `--generate-interactive-examples`   Scans `sandbox/README.md` for `mermaid-workflow` blocks and generates interactive HTML examples.
- `--validate-readme`     Ensures `sandbox/README.md` contains required links and references.
- `--features-overview`   Generates a summary of all sandbox CLI flags in markdown format.
- `--audit-dependencies`  Runs `npm audit` and enforces a severity threshold.
- `--bridge-s3-sqs`       Uploads payload to S3 and dispatches an SQS message with the location and attributes.
- `--validate-package`    Validates required fields in the root `package.json`.
- `--validate-tests`      Checks coverage metrics meet defined thresholds.
- `--validate-lint`       Runs ESLint on sandbox source and test directories and reports violations.
- `--validate-license`    Ensures `LICENSE.md` exists and has a valid SPDX identifier.