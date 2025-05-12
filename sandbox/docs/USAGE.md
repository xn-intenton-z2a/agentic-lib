# CLI Usage

## --validate-features

Validates that all markdown files in `sandbox/features/` include a reference to the mission statement (`MISSION.md` or `# Mission`).
If any files are missing the reference, errors will be logged and the process will exit with a non-zero status.

Example:

```bash
node sandbox/source/main.js --validate-features
```

## --generate-interactive-examples

Scans `sandbox/README.md` for ```mermaid-workflow``` fenced code blocks, renders each block into interactive HTML snippets, and maintains a single, idempotent `## Examples` section at the end of the README.

- Success Path (blocks found):
  ```bash
  node sandbox/source/main.js --generate-interactive-examples
  ```
  Logs:
  ```json
  {"level":"info","message":"Interactive examples generated","updatedBlocks":<number>}
  ```

- Warning Path (no blocks found):
  ```bash
  node sandbox/source/main.js --generate-interactive-examples
  ```
  Logs:
  ```json
  {"level":"warn","message":"No mermaid-workflow blocks found"}
  ```

- Error Path (render failure):
  ```bash
  node sandbox/source/main.js --generate-interactive-examples
  ```
  Logs:
  ```json
  {"level":"error","message":"Failed to render mermaid-workflow","error":"<details>"}
  ```

## --validate-readme

Validates that `sandbox/README.md` includes links to `MISSION.md`, `CONTRIBUTING.md`, `LICENSE.md`, and our GitHub repository URL.

- Success Path:
  ```bash
  node sandbox/source/main.js --validate-readme
  ```
  Logs:
  ```json
  {"level":"info","message":"README validation passed"}
  ```

- Error Path:
  ```bash
  node sandbox/source/main.js --validate-readme
  ```
  Logs:
  ```json
  {"level":"error","message":"README missing reference: <reference>"}
  ```

## --fix-features

Auto-inserts a mission statement reference (`> See our [Mission Statement](../../MISSION.md)`) into markdown files under `sandbox/features/` that are missing one. It scans all `.md` files and prepends this reference line to those lacking it.

Example:

```bash
node sandbox/source/main.js --fix-features
```

Logs on success:
```json
{"level":"info","message":"Fixed feature files to include mission reference","filesModified":["file1.md"]}
```

## --features-overview

Generates a markdown summary of all sandbox CLI flags and their descriptions. Writes to `sandbox/docs/FEATURES_OVERVIEW.md` and prints a JSON info log:

```bash
node sandbox/source/main.js --features-overview
```

Logs:
```json
{"level":"info","featuresOverview":"<markdown string>"}
```

## --validate-package

Parses and validates the root `package.json`, ensuring required fields exist and meet constraints:

- `name` (string)
- `version` (valid semver)
- `description` (string)
- `main` (string)
- `scripts.test` (string)
- `engines.node` (>=20.0.0)

Example:

```bash
node sandbox/source/main.js --validate-package
```

- Success Path:
  ```json
  {"level":"info","message":"Package manifest validation passed"}
  ```

- Failure Path (missing or invalid fields):
  ```json
  {"level":"error","message":"Package manifest missing or invalid field","field":"<field>"}
  ```

- I/O Error Path:
  ```json
  {"level":"error","message":"Failed to read package.json","error":"<details>"}
  ```

## --validate-tests

Reads the coverage summary JSON from `coverage/coverage-summary.json` and validates that statements, branches, functions, and lines coverage are all at least 80%.

- Success Path:
  ```bash
  node sandbox/source/main.js --validate-tests
  ```
  Logs:
  ```json
  {"level":"info","message":"Test coverage validation passed","coverage":{"statements":<pct>,"branches":<pct>,"functions":<pct>,"lines":<pct>}}
  ```

- Failure Path:
  ```bash
  node sandbox/source/main.js --validate-tests
  ```
  Logs for each failing metric:
  ```json
  {"level":"error","metric":"<metricName>","threshold":80,"actual":<value>}
  ```

- Error Path (I/O or parse error):
  ```json
  {"level":"error","message":"Failed to read coverage summary","error":"<details>"}
  ```
  or
  ```json
  {"level":"error","message":"Failed to parse coverage summary","error":"<details>"}
  ```

## --validate-lint

Runs ESLint on `sandbox/source/` and `sandbox/tests/`, reporting any lint violations.

Example:
```bash
node sandbox/source/main.js --validate-lint
```

- Success Path:
  ```json
  {"level":"info","message":"Lint validation passed"}
  ```

- Failure Path:
  Logs each violation:
  ```json
  {"level":"error","file":"<path>","line":<number>,"column":<number>,"ruleId":"<rule>","message":"<description>"}
  ```

- Error Path (spawn failure):
  ```json
  {"level":"error","message":"Lint process failed","error":"<details>"}
  ```

## --validate-license

Validates that `LICENSE.md` exists, is non-empty, and its first non-empty line starts with a valid SPDX identifier (e.g., MIT, ISC, Apache-2.0, GPL-3.0).

Example:
```bash
node sandbox/source/main.js --validate-license
```

- Success Path:
  ```json
  {"level":"info","message":"License validation passed"}
  ```

- Failure Path:
  ```json
  {"level":"error","message":"License missing or invalid SPDX identifier"}
  ```

## --audit-dependencies

Audits npm dependencies for vulnerabilities using `npm audit` and enforces a configurable severity threshold via the `AUDIT_SEVERITY` environment variable (default: moderate). For each vulnerability at or above the threshold, an error log is emitted and the process exits with code 1.

Example:
```bash
node sandbox/source/main.js --audit-dependencies
```

- Success Path:
  ```json
  {"level":"info","message":"Dependency audit passed","counts":{"critical":0,"high":0,"moderate":0,"low":0}}
  ```

- Failure Path:
  ```json
  node sandbox/source/main.js --audit-dependencies
  ```
  Logs each issue:
  ```json
  {"level":"error","module":"<module>","severity":"<severity>","title":"<title>","vulnerableVersions":"<versions>","patchedVersions":"<versions>","url":"<url>"}
  ```
