# agentic-lib

Agentic-lib is a JavaScript SDK designed to power automated GitHub workflows with an "agentic" approach, enabling autonomous workflows to communicate through issues and pull requests. It provides CLI utilities, AWS Lambda handlers, and integration tools for seamless orchestration.

For full mission details, see [MISSION.md](../../MISSION.md).

## CLI Toolkit

The CLI supports the following new flags:

- `--diagram [--format=json|markdown]`: Generate a workflow interaction diagram describing CLI → SQS Lambda handler steps.
- `--features-overview [--format=json|markdown]`: Generate an overview of archived feature documents under `sandbox/features/archived/`.
- `--digest`: Simulate an SQS event for a full bucket replay.
- `--version`: Display CLI version and timestamp.
- `--help`: Show help and usage instructions.

### Examples

```bash
$ node sandbox/source/main.js --diagram
```mermaid
flowchart LR
  CLI --> main
  main --> processDiagram
  processDiagram --> generateDiagram
  main --> processFeaturesOverview
  processFeaturesOverview --> generateFeaturesOverview
```

```bash
$ node sandbox/source/main.js --features-overview --format=json
[{"name":"TestFeature1","summary":"This is the first test feature summary."},
 {"name":"TestFeature2","summary":"Second feature summary goes here."}]
```

See [docs/CLI_TOOLKIT.md](docs/CLI_TOOLKIT.md) for more details.

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md).

## License

Licensed under GPL-3.0 and MIT. See [LICENSE](../../LICENSE.md).

## Repository

https://github.com/xn-intenton-z2a/agentic-lib
