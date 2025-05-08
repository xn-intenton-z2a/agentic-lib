# Agentic-lib Sandbox

This sandbox environment demonstrates the metrics tracking and reporting features added to **agentic-lib**.

**Metrics Persistence**

- Metrics are stored in `.agentic_metrics.json` at the project root.
- Metrics tracked: `totalIssues` and `successfulCommits`.
- On first `--digest` invocation, the metrics file is created with:
  ```json
  { "totalIssues": 1, "successfulCommits": 1 }
  ```
- Subsequent `--digest` invocations increment both counts by 1:
  ```bash
  $ node src/lib/main.js --digest
  # Creates metrics file: {"totalIssues":1,"successfulCommits":1}

  $ node src/lib/main.js --digest
  # Updates metrics file: {"totalIssues":2,"successfulCommits":2}
  ```

**CLI Usage**

```bash
--help             Show this help message and usage instructions.
--digest           Simulate an SQS event and increment metrics.
--version          Show version information with timestamp.
--stats            Show metrics statistics (totalIssues, successfulCommits).
--verbose-stats    Append metrics statistics after primary command output.
```

**Usage Examples**

```bash
node src/lib/main.js --stats
node src/lib/main.js --digest --stats
node src/lib/main.js --help --verbose-stats
```

For more details on metrics implementation, see [`docs/METRICS.md`](docs/METRICS.md).
