# agentic-lib

A JavaScript library designed as a drop-in or wholesale replacement for autonomous GitHub Actions workflows, enabling continuous code review, fixes, and evolution through branches and issues. Inspired by our mission to empower agentic workflows across your repository.

## Mission
Read the full mission statement in [MISSION.md](../MISSION.md).

## Documentation
- Contributing guidelines: [CONTRIBUTING.md](../CONTRIBUTING.md)
- License (MIT & GPL-3.0): [LICENSE](../LICENSE)
- Repository: https://github.com/xn-intenton-z2a/agentic-lib

## CLI Usage
After installing or cloning the repository, use the CLI available in `src/lib/main.js`:

```bash
node src/lib/main.js --help
```

### Flags
- `--help`      Show help message and usage instructions.
- `--mission`   Display the full project mission statement.
- `--digest`    Run a full bucket replay simulating an SQS event.
- `--version`   Show version information with current timestamp.

### Examples
Print the mission statement:
```bash
node src/lib/main.js --mission
```

Retrieve version info:
```bash
node src/lib/main.js --version
```
