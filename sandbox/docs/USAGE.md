# CLI Usage

## --validate-features

Validates that all markdown files in `sandbox/features/` include a reference to the mission statement (`MISSION.md` or `# Mission`).
If any files are missing the reference, errors will be logged and the process will exit with a non-zero status.

Example:

```
node sandbox/source/main.js --validate-features
```

## --generate-interactive-examples

Scans `sandbox/README.md` for ```mermaid-workflow``` fenced code blocks, renders each block into an interactive HTML snippet, and maintains a single, idempotent `## Examples` section at the end of the README.

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
  and exits with code 1.
