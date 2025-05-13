# agentic-lib Sandbox

Welcome to the **agentic-lib** sandbox! This directory provides CLI utilities that embody our mission of autonomous, agentic workflows. See our [Mission Statement](../MISSION.md) to learn more about the guiding principles behind this project.

## Links

- [Mission Statement](../MISSION.md)
- [Contributing Guide](../CONTRIBUTING.md)
- [License](../LICENSE.md)
- [Repository](https://github.com/xn-intenton-z2a/agentic-lib)

## Usage

### --validate-features

Validates that all markdown files in `sandbox/features/` include a reference to the mission statement (`MISSION.md` or `# Mission`). If any file is missing the reference, errors will be logged and the process will exit with code 1.

Example invocation:

```bash
node sandbox/source/main.js --validate-features
```

Expected success output:

```json
{"level":"info","message":"All feature files reference mission statement"}
```

Expected failure output (exit code 1):

```json
{"level":"error","message":"Feature file missing mission reference","file":"sandbox/features/your-feature.md"}
```

### --fix-features

Auto-inserts a mission statement reference (`> See our [Mission Statement](../../MISSION.md)`) into markdown files under `sandbox/features/` that are missing one. It scans all `.md` files and prepends this reference line.

Example invocation:

```bash
node sandbox/source/main.js --fix-features
```

Expected success output:

```json
{"level":"info","message":"Fixed feature files to include mission reference","filesModified":["file1.md"]}
```

Expected error on write failure (exit code 1):

```json
{"level":"error","message":"Failed to fix feature files","error":"<details>"}
```

### --generate-interactive-examples

Scans `sandbox/README.md` for ```mermaid-workflow``` fenced code blocks, renders each block into interactive HTML snippets, and injects or updates an idempotent `## Examples` section at the end of the README.

Example invocation:

```bash
node sandbox/source/main.js --generate-interactive-examples
```

Expected success output when blocks are found:

```json
{"level":"info","message":"Interactive examples generated","updatedBlocks":<number>}
```

Expected warning when no blocks are found:

```json
{"level":"warn","message":"No mermaid-workflow blocks found"}
```

Expected error on render failure (exit code 1):

```json
{"level":"error","message":"Failed to render mermaid-workflow","error":"<details>"}
```

### --validate-readme

Validates that `sandbox/README.md` includes links to `MISSION.md`, `CONTRIBUTING.md`, `LICENSE.md`, and our GitHub repository URL.

Example invocation:

```bash
node sandbox/source/main.js --validate-readme
```

Expected success output:

```json
{"level":"info","message":"README validation passed"}
```

Expected failure output (exit code 1):

```json
{"level":"error","message":"README missing reference: <reference>"}
```

### --validate-package

Validates the root `package.json` for required fields:

- `name`
- `version` (semver)
- `description`
- `main`
- `scripts.test`
- `engines.node` >=20.0.0

Example invocation:

```bash
node sandbox/source/main.js --validate-package
```

Expected success output:

```json
{"level":"info","message":"Package manifest validation passed"}
```

Expected failure output:

```json
{"level":"error","message":"Package manifest missing or invalid field","field":"<field>"}
```

### --audit-dependencies

Audits npm dependencies for vulnerabilities at or above the severity threshold (`AUDIT_SEVERITY`, default: moderate).

Example invocation:

```bash
node sandbox/source/main.js --audit-dependencies
```

Expected success output:

```json
{"level":"info","message":"Dependency audit passed","counts":{"critical":0,"high":0,"moderate":0,"low":0}}
```

Expected failure output:

```json
{"level":"error","module":"<module>","severity":"<severity>","title":"<title>","vulnerableVersions":"<versions>","patchedVersions":"<versions>","url":"<url>"}
```

### --features-overview

Generates a markdown summary of all sandbox CLI flags and their descriptions. Writes to `sandbox/docs/FEATURES_OVERVIEW.md` and prints a JSON info log.

Example invocation:

```bash
node sandbox/source/main.js --features-overview
```

Expected success output:

```json
{"level":"info","featuresOverview":"<markdown string>"}
```

Expected failure output (exit code 1):

```json
{"level":"error","message":"Failed to generate features overview","error":"<details>"}
```

### --bridge-s3-sqs

Uploads payload to S3 and sends an SQS message with the object location and optional attributes.

Example invocation:

```bash
node sandbox/source/main.js --bridge-s3-sqs --bucket my-bucket --key path/to/object.json --payload-file ./data.json --message-attributes '{"foo":"bar"}'
```

Expected success output:

```json
{"level":"info","message":"Bridge succeeded","bucket":"my-bucket","key":"path/to/object.json","messageId":"<id>"}
```

Expected error on missing arguments (exit code 1):

```json
{"level":"error","message":"Missing required arguments: --bucket and --key"}
```

### --validate-tests

Reads coverage summary from `coverage/coverage-summary.json` and ensures statements, branches, functions, and lines coverage all meet the 80% threshold.

Example invocation:

```bash
node sandbox/source/main.js --validate-tests
```

Expected success output:

```json
{"level":"info","message":"Test coverage validation passed","coverage":{"statements":<pct>,"branches":<pct>,"functions":<pct>,"lines":<pct>}}
```

Expected failure output:

```json
{"level":"error","metric":"<metricName>","threshold":80,"actual":<value>}
```

Expected error on read or parse failure:

```json
{"level":"error","message":"Failed to read coverage summary","error":"<details>"}
```

or

```json
{"level":"error","message":"Failed to parse coverage summary","error":"<details>"}
```

### --validate-lint

Runs ESLint on `sandbox/source/` and `sandbox/tests/`, reporting any lint violations.

Example invocation:

```bash
node sandbox/source/main.js --validate-lint
```

Expected success output:

```json
{"level":"info","message":"Lint validation passed"}
```

Expected failure output:

```json
{"level":"error","file":"<path>","line":<number>,"column":<number>,"ruleId":"<rule>","message":"<description>"}
```

Expected error on spawn failure:

```json
{"level":"error","message":"Lint process failed","error":"<details>"}
```

### --validate-license

Validates that `LICENSE.md` exists and its first non-empty line starts with a valid SPDX identifier (e.g., MIT, ISC, Apache-2.0, GPL-3.0).

Example invocation:

```bash
node sandbox/source/main.js --validate-license
```

Expected success output:

```json
{"level":"info","message":"License validation passed"}
```

Expected failure on missing file (exit code 1):

```json
{"level":"error","message":"Failed to read license file","error":"<details>"}
```

Expected failure on invalid SPDX (exit code 1):

```json
{"level":"error","message":"License missing or invalid SPDX identifier"}
```