> See our [Mission Statement](../../MISSION.md)

# Sandbox CLI Usage

This document outlines the available sandbox CLI commands provided by **agentic-lib**.

## Commands

- **--validate-features**: Validates that all markdown files in `sandbox/features/` include a reference to the mission statement (`MISSION.md` or `# Mission`).
- **--fix-features**: Auto-inserts a mission statement reference into markdown files under `sandbox/features/` that are missing one.
- **--generate-interactive-examples**: Scans `sandbox/README.md` for ```mermaid-workflow``` fenced code blocks and generates interactive HTML snippets.
- **--features-overview**: Generates a markdown summary of all sandbox CLI flags and their descriptions.
- **--audit-dependencies**: Audits npm dependencies for vulnerabilities using `npm audit`.
- **--bridge-s3-sqs**: Uploads payload to S3 and sends an SQS message.
- **--validate-package**: Validates the root `package.json` for required fields.
- **--validate-tests**: Validates test coverage metrics meet the 80% threshold.
- **--validate-lint**: Runs ESLint on `sandbox/source/` and `sandbox/tests/`, reporting any lint violations.
- **--validate-readme**: Ensures `sandbox/README.md` contains critical references.
- **--validate-license**: Ensures `LICENSE.md` exists and has a valid SPDX license identifier.
