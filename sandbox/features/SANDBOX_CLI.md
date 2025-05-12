# Sandbox CLI Usage

This document outlines the available sandbox CLI commands provided by **agentic-lib** and ensures each command aligns with our mission of autonomous, agentic workflows.

## Commands

- **--validate-features**: Validates that all markdown files in `sandbox/features/` include a reference to the mission statement (`MISSION.md` or `# Mission`).
- **--fix-features**: Auto-inserts a mission statement reference into markdown files under `sandbox/features/` that are missing one.
- **--generate-interactive-examples**: Scans `sandbox/README.md` for ```mermaid-workflow``` fenced code blocks and generates interactive HTML snippets.
- **--features-overview**: Generates a markdown summary of all sandbox CLI flags and their descriptions.
- **--audit-dependencies**: Audits npm dependencies for vulnerabilities using `npm audit` and enforces a configurable severity threshold (AUDIT_SEVERITY).
- **--bridge-s3-sqs**: Uploads a payload to S3 and sends an SQS message with the object location and optional attributes.
- **--validate-package**: Parses and validates the root `package.json` for required fields.
- **--validate-tests**: Validates test coverage metrics meet the 80% threshold by reading `coverage/coverage-summary.json`.
- **--validate-lint**: Runs ESLint on `sandbox/source/` and `sandbox/tests/`, reporting any lint violations.
- **--validate-license**: Ensures `LICENSE.md` exists and has a valid SPDX license identifier.
- **--validate-readme**: Ensures `sandbox/README.md` references MISSION.md, CONTRIBUTING.md, LICENSE.md, and the repository URL.
- **--validate-config**: Validates the agent configuration file (`agent_config.yaml`) exists in the project root, parses its contents, and confirms the presence of required top-level fields:
  - `schedule`
  - `paths`
  - `buildScript`
  - `testScript`
  - `mainScript`
  On success, prints an info log indicating all required configuration keys are valid. On failure, logs errors for each missing or invalid key and exits with a non-zero status.
