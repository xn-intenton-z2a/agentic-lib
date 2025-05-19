# agentic-lib

Agentic-lib is a JavaScript library designed to power automated GitHub workflows in an “agentic” manner, enabling autonomous workflows to communicate through branches and issues. It can be used as a drop-in JS implementation or replacement for steps, jobs, and reusable workflows in your repository.

**Mission:** [Mission Statement](../MISSION.md)

**Contributing:** [Contributing Guidelines](../CONTRIBUTING.md)  
**License:** [MIT License](../LICENSE-MIT)

**Repository:** https://github.com/xn-intenton-z2a/agentic-lib

---

# Usage

## Sandbox CLI

Use the sandbox CLI to experiment locally:

```bash
node sandbox/source/main.js [options]
```

**Example: Show the mission statement**

```bash
node sandbox/source/main.js --mission
```

## Core CLI

Use the core CLI for production workflows:

```bash
node src/lib/main.js [options]
```

**Example: Show version information**

```bash
node src/lib/main.js --version
```

## Options

- `--help`                     Show this help message and usage instructions.
- `--mission`                  Show the project mission statement. (Sandbox CLI only)
- `--digest`                   Run a full bucket replay simulating an SQS event.
- `--version`                  Show version information with current timestamp.

## Configuration

Before using the CLI, configure the following environment variables:

- `OPENAI_API_KEY` (required): Your OpenAI API key.
- `GITHUB_API_BASE_URL` (optional): Override the GitHub API base URL. Defaults to `https://api.github.com/`.

In sandbox mode (when `NODE_ENV` is set to `development` or `VITEST` is set), default values are applied for testing:

- `OPENAI_API_KEY=key-test`
- `GITHUB_API_BASE_URL=https://api.github.com.test/`
