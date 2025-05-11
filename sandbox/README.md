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

## More Information

For detailed CLI usage and flags, see the [USAGE guide](docs/USAGE.md).
