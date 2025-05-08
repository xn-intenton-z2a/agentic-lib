sandbox/docs/METRICS.md
# sandbox/docs/METRICS.md
# Metrics Persistence (Experimental)

> Note: Metrics tracking and the associated CLI flags (`--stats`, `--verbose-stats`) are under development and not yet available in the current sandbox release.

## Intended Design

The `agentic-lib` sandbox aims to track key workflow metrics across CLI invocations by storing them in a JSON file at `.agentic_metrics.json` in the project root.

### Metrics File

- Location: `.agentic_metrics.json`
- Structure:
  ```json
  {
    "totalIssues": 0,
    "successfulCommits": 0
  }
  ```

### Planned CLI Flags

- `--stats`  
  Print current metric values without modifying counts.

- `--verbose-stats`  
  Append metric JSON after primary CLI outputs when used with `--help`, `--version`, or `--digest`.

## Examples (Future Release)

```bash
$ node src/lib/main.js --stats
{"totalIssues":2,"successfulCommits":2}

$ node src/lib/main.js --help --verbose-stats
Usage:
  --help                     Show help message.
  --digest                   Run a sample digest event.
  --version                  Show version info.
  
{"totalIssues":2,"successfulCommits":2}
```