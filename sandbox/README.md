# agentic-lib

Agentic-lib is a JavaScript library designed to serve as a drop-in SDK for enabling autonomous workflows in GitHub Actions and other automation pipelines. It provides CLI commands, AWS Lambda handlers, and utilities to streamline CI/CD processes by communicating through issues, branches, and events.

For more details, see [MISSION.md](../../MISSION.md) and [CONTRIBUTING.md](../../CONTRIBUTING.md).

Repository: [https://github.com/xn-intenton-z2a/agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib)

## CLI Usage

The CLI supports several flags to interact with your workflows:

  --help
    Show this help message and usage instructions.

  --digest
    Run a full bucket replay simulating an SQS event.

  --version
    Show version information with the current timestamp.

  --agent "<prompt>"
    Send a prompt to the OpenAI API and receive a structured JSON response. Useful for CI/CD, GitHub Actions, and local automation.

### Example

```bash
node src/lib/main.js --agent "Summarize the repository mission"
```

### Sample Output

```json
{"summary":"agentic-lib is a JavaScript library designed to serve as a drop-in SDK for enabling autonomous workflows in GitHub Actions and other automation pipelines."}
```
