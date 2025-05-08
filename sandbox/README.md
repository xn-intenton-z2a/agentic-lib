# Agentic-lib Sandbox

This sandbox environment demonstrates the metrics tracking and reporting features added to **agentic-lib**.

**Metrics Persistence**

- Metrics are stored in `.agentic_metrics.json` at the project root.
- Metrics tracked: `totalIssues` and `successfulCommits`.

**CLI Usage**

```
--help             Show this help message and usage instructions.
--digest           Simulate an SQS event and increment metrics.
--version          Show version information with timestamp.
--stats            Show metrics statistics (totalIssues, successfulCommits, conversionRate).
--verbose-stats    Append metrics statistics after primary command output.
```

**Usage Examples**

```bash
node src/lib/main.js --stats
node src/lib/main.js --digest --stats
node src/lib/main.js --help --verbose-stats
```

For full contribution guidelines and project mission, see [CONTRIBUTING.md](../../CONTRIBUTING.md) and [MISSION.md](../../MISSION.md).