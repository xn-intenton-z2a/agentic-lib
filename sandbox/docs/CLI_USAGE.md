# CLI Usage Documentation

## Commands

- **--help**: Show this help message and usage instructions.
- **--version**: Show version information with current timestamp.
- **--digest**: Simulate processing of an SQS digest event.
- **--stats**: Output runtime statistics including:
  - `callCount`: current global call count (non-negative integer).
  - `uptime`: process uptime in seconds (positive number).

## Usage Examples

Display help:

```bash
npm run start -- --help
```

Check version:

```bash
npm run start -- --version
```

Simulate digest event:

```bash
npm run start -- --digest
```

Display runtime statistics:

```bash
npm run start -- --stats
```

You can combine flags. For example, to process a digest event and then output runtime statistics:

```bash
npm run start -- --digest --stats
```

---

## API Reference

- **main(args)**: Entry point for CLI commands. It processes flags in the following order: `--help`, `--version`, `--digest`, and finally `--stats` if provided.

- **processStats(args)**: Helper function that outputs runtime statistics (i.e., `callCount` and `uptime`) when the `--stats` flag is present.
