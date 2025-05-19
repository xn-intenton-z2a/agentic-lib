# CLI Usage

The **agentic-lib** library provides both a sandbox CLI and a core CLI for interacting with its features.

## Sandbox CLI

Use the sandbox CLI to experiment locally:

```bash
node sandbox/source/main.js [options]
```

Available options:

- `--help`     Show this help message and usage instructions.
- `--mission`  Show the project mission statement.
- `--digest`   Run a full bucket replay simulating an SQS event.
- `--version`  Show version information with current timestamp.

**Example: Show the mission statement**

```bash
node sandbox/source/main.js --mission
```

## Core CLI

Use the core CLI for production workflows:

```bash
node src/lib/main.js [options]
```

Available options:

- `--help`     Show this help message and usage instructions.
- `--digest`   Run a full bucket replay simulating an SQS event.
- `--version`  Show version information with current timestamp.

**Example: Show version information**

```bash
node src/lib/main.js --version
```

## Configuration

Before using the CLI, configure the following environment variables:

- `OPENAI_API_KEY` (required): Your OpenAI API key.
- `GITHUB_API_BASE_URL` (optional): Override the GitHub API base URL. Defaults to `https://api.github.com/`.

In sandbox mode (when `NODE_ENV` is set to `development` or `VITEST` is set), default values are applied for testing:

- `OPENAI_API_KEY=key-test`
- `GITHUB_API_BASE_URL=https://api.github.com.test/`

## Links

- Mission Statement: [MISSION.md](../MISSION.md)
- Contributing Guidelines: [CONTRIBUTING.md](../CONTRIBUTING.md)
