# agentic-lib Sandbox CLI

## CLI Usage

```
--help                     Show this help message and usage instructions.
--digest                   Run a full bucket replay simulating an SQS event.
--version                  Show version information with current timestamp.
--summarize <path|json>    Summarize an SQS digest payload via OpenAI and print a concise human-readable summary.
```

## Examples

```bash
# From file
agentic-lib --summarize event.json

# From inline JSON
agentic-lib --summarize '{"key":"value"}'
```

## Sample Output

```
Mock summary
```