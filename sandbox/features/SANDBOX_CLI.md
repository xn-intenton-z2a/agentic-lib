# Commands

- **--validate-config**: Validates the agent_config.yaml file in the project root. Ensures required top-level keys: schedule (string), paths (mapping with nested required keys), buildScript (string), testScript (string), and mainScript (string) exist and have correct types. Logs JSON-formatted error entries for each missing or invalid key and exits with code 1 on failure; logs JSON info entry and exits with code 0 on success.

- **--generate-interactive-examples**: Scans sandbox/README.md for ```mermaid-workflow``` code blocks, renders each block into HTML snippets using markdown-it with GitHub plugin, replaces or appends a single idempotent `## Examples` section, writes back to README.md, and logs JSON info or warning on success or absence of blocks.

- **--fix-features**: Injects a mission statement reference (`> See our [Mission Statement](../../MISSION.md)`) at the top of each markdown file under sandbox/features that lacks it. Writes modified files, logs JSON info with list of files modified, exits 0; logs JSON error and exits 1 on failures.

- **--validate-features**: Ensures each `.md` file under sandbox/features references the mission statement (MISSION.md or `# Mission`). Logs JSON error for each missing reference and exits 1 if any fail; logs JSON info and returns true on full success.

- **--validate-readme**: Validates sandbox/README.md contains links to MISSION.md, CONTRIBUTING.md, LICENSE.md, and the agentic-lib GitHub repository URL. Logs JSON error for each missing reference and exits 1 on failure; logs JSON info and returns true on success.

- **--features-overview**: Generates a markdown summary table of all sandbox CLI flags and their descriptions, writes to sandbox/docs/FEATURES_OVERVIEW.md, logs JSON info with the markdown content, exits 0; logs JSON error and exits 1 on write failure.

- **--audit-dependencies**: Runs `npm audit --json`, parses output, compares advisories severity against `AUDIT_SEVERITY` (default moderate), logs JSON error entries for each vulnerability at or above threshold and exits 1 if any; logs JSON info with vulnerability counts and exits 0 on clean audit.

- **--bridge-s3-sqs**: Requires `--bucket` and `--key` arguments; reads JSON payload from `--payload-file` or inline `--payload`, parses optional `--message-attributes`, calls `uploadAndSendMessage`, logs JSON info with bucket, key, and messageId on success and exits 0; logs JSON error and exits 1 on failures or missing args.

- **--validate-package**: Reads and parses package.json, checks required fields: name (non-empty string), version (valid semver), description (non-empty string), main (non-empty string), `scripts.test` (non-empty string), `engines.node` (>=20.0.0). Logs JSON error for each missing or invalid field and exits 1 on any failures; logs JSON info on full pass and exits 0.

- **--validate-tests**: Reads coverage summary from coverage/coverage-summary.json, ensures statements, branches, functions, and lines coverage meet or exceed 80%. Logs JSON error entries for each metric below threshold and exits 1 on failure; logs JSON info with coverage percentages and exits 0 on success.

- **--validate-lint**: Runs ESLint on sandbox/source and sandbox/tests with zero warnings allowed, parses output lines, logs JSON error entries for each violation with file, line, column, ruleId, and message, exits 1 on any violations; logs JSON info and exits 0 on pass.

- **--validate-license**: Reads LICENSE.md, checks first non-empty line starts with a valid SPDX identifier (MIT, ISC, Apache-2.0, GPL-3.0). Logs JSON error and exits 1 if missing file or invalid identifier; logs JSON info and exits 0 on success.

# Implementation

Integrate each command as a dedicated async function in sandbox/source/main.js that detects its flag, performs file and process operations using fs/promises and child_process, logs structured JSON via console.log or console.error, and calls process.exit with appropriate codes. Ensure main dispatch sequence calls each processor in order and terminates on first handled flag.

# Testing

Use Vitest in sandbox/tests:

- Mock fs/promises, child_process.spawnSync, js-yaml, markdown-it and uploadAndSendMessage as needed.
- Verify flag absence returns false and does not exit.
- Cover success, failure, and edge cases for each flag: missing files, parse errors, threshold violations, missing arguments, and no-op conditions.

# Documentation

Update sandbox/README.md and sandbox/docs/USAGE.md to document all flags, example invocations, expected JSON log outputs for success and failure paths, following the style of existing sections.