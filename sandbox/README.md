# agentic-lib

Agentic-lib is a JavaScript library designed to power autonomous “agentic” workflows in GitHub Actions. Inspired by our [Mission Statement](../MISSION.md), agentic-lib enables repositories to operate like agents, continuously reviewing, fixing, updating, and evolving code through composable workflows.

**Key resources:**
- **Mission:** [MISSION.md](../MISSION.md)
- **Contributing Guidelines:** [CONTRIBUTING.md](../CONTRIBUTING.md)
- **License:** [LICENSE.md](../LICENSE.md)
- **GitHub Repository:** [https://github.com/xn-intenton-z2a/agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib)

## Installation

Install the library from npm:

```bash
npm install @xn-intenton-z2a/agentic-lib
```

## CLI Usage

Use the CLI interface for quick commands:

```bash
# Show help
npx agentic-lib --help

# Show version
npx agentic-lib --version

# Simulate a bucket replay digest
npx agentic-lib --digest
```

## HTTP Endpoint Usage

Run agentic-lib in HTTP mode to expose endpoints for integration:

```bash
# Enable HTTP mode (default port 3000)
npx agentic-lib --http

# Or via environment variables
HTTP_MODE=true HTTP_PORT=4000 npx agentic-lib
```

Once running, send a POST request to `/digest` with a JSON payload:

```bash
curl -X POST http://localhost:3000/digest \
  -H "Content-Type: application/json" \
  -d '{
    "key": "events/1.json",
    "value": "12345",
    "lastModified": "2025-05-20T12:00:00Z"
}'
```

## API Reference

The library exports the following functions:

- `main(args: string[])` – Main CLI entry point.
- `digestLambdaHandler(event: object)` – AWS Lambda handler for processing SQS events.
- `createSQSEventFromDigest(digest: object)` – Helper to wrap a digest object into an SQS event.
- `logConfig(): void` – Logs the loaded configuration.
- `logInfo(message: string): void` – Logs an informational message.
- `logError(message: string, error?: Error): void` – Logs an error message.

## Examples

Import and invoke functions directly in your code:

```javascript
import { createSQSEventFromDigest, digestLambdaHandler } from '@xn-intenton-z2a/agentic-lib';

const digest = {
  key: 'events/1.json',
  value: '12345',
  lastModified: new Date().toISOString()
};

const event = createSQSEventFromDigest(digest);

digestLambdaHandler(event)
  .then(result => console.log('Handler result:', result))
  .catch(error => console.error('Handler error:', error));
```

---
