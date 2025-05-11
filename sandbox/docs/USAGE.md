# CLI Usage

The **agentic-lib** CLI provides the following commands and flags:

```
Usage:
  --help                     Show this help message and usage instructions.
  --digest                   Run a full bucket replay simulating an SQS event.
  --version                  Show version information with current timestamp.
  --stats                    Show runtime metrics (callCount and uptime) in JSON.
```

## Examples

Standalone stats:
```bash
node src/lib/main.js --stats
# => { "callCount": 0, "uptime": 0.123 }
```

Combined with digest:
```bash
node src/lib/main.js --digest --stats
# => { "callCount": 3, "uptime": 0.456 }
```
