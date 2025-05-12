# Sandbox CLI

## Overview
The sandbox CLI provides automated commands to validate, generate, and maintain key project artifacts in sandbox mode. It ensures consistency with the mission statement, enriches documentation with interactive examples, audits dependencies, and enforces code quality and coverage standards.

## Commands

- **--help**: Displays usage instructions for the sandbox CLI, listing all available flags and their descriptions. Outputs a human-readable usage guide to stdout and exits with code 0.

- **--version**: Reads the root package.json to retrieve the current version, logs a JSON-formatted entry with level "info", version, and timestamp, and exits with code 0. On failure to read or parse package.json, logs a JSON-formatted error entry and exits with code 1.

- **--validate-config**: Validates the agent_config.yaml file in the project root. Ensures required top-level keys: schedule (string), paths (mapping with nested required keys), buildScript (string), testScript (string), and mainScript (string) exist and have correct types. Logs JSON-formatted error entries for each missing or invalid key and exits with code 1 on failure; logs a JSON-formatted info entry and exits with code 0 on success.

- **--generate-interactive-examples**: Scans sandbox/README.md for mermaid-workflow code blocks and standard mermaid code fences representing workflow diagrams. Converts each block into interactive HTML snippets using markdown-it, mermaid.js, and the markdown-it-github plugin. Supports multiple diagram types (workflow, flowchart, sequence), injects collapsible controls, zoom and pan functionality, and navigation aids. Removes any existing Examples section and inserts a single idempotent `## Examples` section at the end of the README containing all rendered interactive diagrams. Writes updates back to sandbox/README.md and logs a JSON-formatted info entry listing the number of diagrams processed. Logs a JSON-formatted warning and exits code 0 if no diagram blocks are found; logs a JSON-formatted error entry and exits code 1 on render or write failures.

- **--fix-features**: Injects a mission statement reference (`> See our [Mission Statement](../../MISSION.md)`) at the top of each Markdown file under sandbox/features that lacks one. Writes modified files, logs a JSON-formatted info entry listing modified files, and exits with code 0; logs a JSON-formatted error entry and exits with code 1 on failure.

- **--validate-features**: Ensures each Markdown file under sandbox/features references the mission statement (MISSION.md or `# Mission`). Logs a JSON-formatted error entry for each missing reference and exits with code 1 if any fail; logs a JSON-formatted info entry and exits with code 0 on full success.

- **--validate-readme**: Validates sandbox/README.md contains links to MISSION.md, CONTRIBUTING.md, LICENSE.md, and the agentic-lib GitHub repository URL. Logs a JSON-formatted error entry for each missing reference and exits with code 1 on failure; logs a JSON-formatted info entry and exits with code 0 on success.

- **--features-overview**: Generates a markdown summary table of all sandbox CLI flags and their descriptions, writes it to sandbox/docs/FEATURES_OVERVIEW.md atomically, logs a JSON-formatted info entry including the generated markdown, and exits with code 0; logs a JSON-formatted error and exits with code 1 on write failure.

- **--audit-dependencies**: Runs `npm audit --json`, parses the output, compares advisory severities against the `AUDIT_SEVERITY` threshold (default: moderate), logs JSON-formatted error entries for each vulnerability at or above the threshold and exits with code 1 if any exist; logs a JSON-formatted info entry with vulnerability counts and exits with code 0 on clean audit.

- **--bridge-s3-sqs**: Requires `--bucket` and `--key` arguments; reads JSON payload from `--payload-file` or inline `--payload`, parses optional `--message-attributes`, calls `uploadAndSendMessage`, logs a JSON-formatted info entry with bucket, key, and messageId on success and exits with code 0; logs a JSON-formatted error and exits with code 1 on failures or missing arguments.

- **--validate-package**: Reads and parses package.json, checks required fields: `name`, `version` (valid semver), `description`, `main`, `scripts.test`, and `engines.node` (>=20.0.0). Logs JSON-formatted error entries for each missing or invalid field and exits with code 1 on any failures; logs a JSON-formatted info entry and exits with code 0 on success.

- **--validate-tests**: Reads coverage summary from coverage/coverage-summary.json and ensures statements, branches, functions, and lines coverage meet or exceed 80%. Logs a JSON-formatted error entry for each metric below threshold and exits with code 1 on failure; logs a JSON-formatted info entry with coverage percentages and exits with code 0 on success.

- **--validate-lint**: Runs ESLint on sandbox/source and sandbox/tests with zero warnings allowed, parses violations, logs JSON-formatted error entries with file, line, column, ruleId, and message for each violation and exits with code 1 on any; logs a JSON-formatted info entry and exits with code 0 on pass.

- **--validate-license**: Reads LICENSE.md, checks that the first non-empty line starts with a valid SPDX identifier (MIT, ISC, Apache-2.0, GPL-3.0), logs a JSON-formatted error and exits with code 1 if missing or invalid; logs a JSON-formatted info entry and exits with code 0 on success.
