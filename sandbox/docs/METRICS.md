# Metrics Persistence

The agentic-lib tracks key workflow metrics across CLI invocations, storing them in a JSON file for persistence.

## Metrics File

- Location: `.agentic_metrics.json` in the project root.
- Format:
  ```json
  {
    "totalIssues": 2,
    "successfulCommits": 2
  }
  ```

## CLI Flags

- `--stats`  
  Print the current metrics JSON to stdout without modifying counts.
  
- `--verbose-stats`  
  When used with other flags (`--help`, `--version`, `--digest`), append the metrics JSON after the primary output.

## Examples

```bash
$ node src/lib/main.js --stats
{"totalIssues":2,"successfulCommits":2}

$ node src/lib/main.js --help --verbose-stats
Usage:
  --help                     Show this help message and usage instructions.
  --digest                   Run a full bucket replay simulating an SQS event.
  --version                  Show version information with current timestamp.
  --stats                    Show metrics statistics (totalIssues, successfulCommits).
  --verbose-stats            Append metrics statistics after primary command output.

{"totalIssues":2,"successfulCommits":2}
```