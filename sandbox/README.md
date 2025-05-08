# Agentic-lib Sandbox

This sandbox environment provides a lightweight demonstration of the core CLI features of **agentic-lib**. It is designed for experimentation and does not include full metrics tracking or AWS integrations.

Links:
- Mission: [`MISSION.md`](../MISSION.md)
- Contributing: [`CONTRIBUTING.md`](../CONTRIBUTING.md)
- License: [`LICENSE.md`](../LICENSE.md)
- GitHub: https://github.com/xn-intenton-z2a/agentic-lib

## CLI Features

- `--help`  
  Show usage information.

- `--version`  
  Output the package version and a timestamp.

- `--digest`  
  Simulate an SQS event message, invoking the `digestLambdaHandler` in `src/lib/main.js`. Useful for testing and debugging.

## Environment Variables

- `GITHUB_API_BASE_URL`  
  Base URL for GitHub API requests (defaults to `https://api.github.com.test/` in development).

- `OPENAI_API_KEY`  
  API key for OpenAI usage (defaults to `key-test` in development).

Load variables from a `.env` file or your environment.

## Usage Examples

```bash
# Show help
node src/lib/main.js --help

# Show version
node src/lib/main.js --version

# Simulate digest event
node src/lib/main.js --digest
```

## Metrics (Experimental)

Metrics persistence is planned but not yet implemented in this sandbox. For more information, see [`docs/METRICS.md`](docs/METRICS.md).