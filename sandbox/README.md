# agentic-lib

**agentic-lib** is a JavaScript library designed to power autonomous, agentic GitHub Actions workflows by providing reusable SDK-like functionality.

Links:
- [Mission Statement](../MISSION.md)
- [Contributing Guidelines](../CONTRIBUTING.md)
- [License (MIT)](../LICENSE-MIT)
- [GitHub Repository](https://github.com/xn-intenton-z2a/agentic-lib)

## Usage

Invoke the CLI using `npm start --` followed by a flag:

```bash
npm start -- --mission
```

Available flags:
- `--help`     Show this help message and usage instructions.
- `--digest`   Run a full bucket replay simulating an SQS event.
- `--version`  Show version information with current timestamp.
- `--mission`  Show the project mission statement.
- `--serve`    Start HTTP server mode exposing `/digest` endpoint.

## HTTP Server Mode

Start the HTTP server to expose the `/digest` endpoint:

```bash
node source/main.js --serve [--port <number>]
```

Default port is `3000` (or use `PORT` environment variable).

Example request:

```bash
curl -X POST http://localhost:3000/digest \
  -H "Content-Type: application/json" \
  -d '{"Records":[{"body":"{ \"key\": \"value\" }"}]}'
```

Response format:

```json
{ "batchItemFailures": [] }
```
