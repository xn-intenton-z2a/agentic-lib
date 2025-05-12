# Sandbox CLI Usage

This document defines the sandbox CLI commands provided by agentic-lib, ensuring each command adheres to our mission of autonomous, agentic workflows. The CLI supports validation, fixing, generation, auditing, bridging, and configuration verification in sandbox mode.

## Commands

- **--validate-features**: Ensures all markdown files in `sandbox/features/` reference the mission statement (`MISSION.md` or `# Mission`). Logs errors for missing references and exits with status 1 if any violations occur.
- **--fix-features**: Prepends a mission statement reference (`> See our [Mission Statement](../../MISSION.md)`) to markdown files under `sandbox/features/` that lack one. Logs the list of modified files and exits with status 0 on success.
- **--generate-interactive-examples**: Scans `sandbox/README.md` for ```mermaid-workflow``` code blocks, renders each block to interactive HTML, and maintains a single, idempotent `## Examples` section at the end of the README. Logs a warning if no blocks are found, or an error on render failure.
- **--features-overview**: Generates a markdown summary of all sandbox CLI flags and descriptions, writes it to `sandbox/docs/FEATURES_OVERVIEW.md`, and logs the overview string. Overwrites previous content on each run.
- **--audit-dependencies**: Runs `npm audit --json`, enforces a severity threshold configured by the `AUDIT_SEVERITY` environment variable (default: moderate), logs detailed errors for each vulnerability meeting or exceeding the threshold, or logs a success message with vulnerability counts.
- **--bridge-s3-sqs**: Uploads a payload to S3 and dispatches an SQS message containing the object location and optional attributes. Requires `--bucket` and `--key` arguments; accepts JSON payload via `--payload` or `--payload-file` and optional `--message-attributes`.
- **--validate-package**: Reads and parses `package.json`, validates required fields (`name`, `version` semver, `description`, `main`, `scripts.test`, and `engines.node` >=20), logs errors per invalid field, and exits non-zero on failure.
- **--validate-tests**: Reads coverage metrics from `coverage/coverage-summary.json` and enforces minimum thresholds (80% for statements, branches, functions, lines), logging errors for each failing metric or a success message with coverage summary.
- **--validate-lint**: Runs ESLint with `--max-warnings=0` on `sandbox/source/` and `sandbox/tests/`, logs detailed violation entries with file, line, column, ruleId and message, and exits non-zero on any failure.
- **--validate-license**: Ensures `LICENSE.md` exists and its first non-empty line begins with a valid SPDX identifier (MIT, ISC, Apache-2.0, GPL-3.0), logging errors on missing file or invalid identifier.
- **--validate-readme**: Verifies that `sandbox/README.md` includes links to `MISSION.md`, `CONTRIBUTING.md`, `LICENSE.md`, and the repository URL. Logs missing references and exits non-zero on failure.
- **--validate-config**: Validates the `agent_config.yaml` file in the project root. Parses the YAML using `js-yaml` and confirms presence of required top-level keys:
  - `schedule`
  - `paths`
  - `buildScript`
  - `testScript`
  - `mainScript`
  On success, logs an info message indicating all configuration keys are valid. On failure, logs errors for each missing or invalid key and exits with a non-zero status.
