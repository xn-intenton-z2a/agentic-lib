# agentic-lib

agentic-lib is a drop-in JavaScript SDK for autonomous GitHub workflows. Inspired by our mission to enable continuous, agentic interactions through issues, branches, and pull requests, this library provides core utilities to configure environments, handle AWS SQS events, power CLI-driven workflows, and optionally launch a self-hosted HTTP server for health, metrics, and documentation.

With agentic-lib, you can seamlessly integrate environment validation, structured logging, AWS utilities, Lambda handlers, CLI and programmatic workflows into your Node.js projects, ensuring reproducible, testable, and maintainable automation.

## Key Features

- **Environment configuration** (dotenv + Zod)
- **Logging helpers** (logInfo, logError)
- **AWS utilities** (createSQSEventFromDigest)
- **Lambda handler** (digestLambdaHandler)
- **HTTP Server** (startServer function with `/health`, `/metrics`, `/openapi.json`, `/docs` endpoints)
- **CLI flags**: `--help`, `--version`, `--digest`

## Installation

Install from npm:

```bash
npm install @xn-intenton-z2a/agentic-lib
```

Or clone this repository and install dependencies:

```bash
git clone https://github.com/xn-intenton-z2a/agentic-lib.git
cd agentic-lib
npm install
```

## CLI Usage Examples

### Show Help

```bash
npx agentic-lib --help
```

### Show Version

```bash
npx agentic-lib --version
```

### Run Digest Simulation

```bash
npx agentic-lib --digest
```

## Programmatic Usage

### Lambda Handler

```js
import { createSQSEventFromDigest, digestLambdaHandler } from "@xn-intenton-z2a/agentic-lib";

const event = createSQSEventFromDigest({
  key: "path",
  value: "123",
  lastModified: new Date().toISOString(),
});

digestLambdaHandler(event).then(() => console.log("Processed"));
```

### HTTP Server

Import and start the built-in HTTP server to expose health, metrics, OpenAPI spec, and interactive docs:

```js
import { startServer } from "@xn-intenton-z2a/agentic-lib";

// Optional configuration: port, CORS origins, rate limits, auth credentials
startServer({ port: 3000 });
```

See [docs/SERVER.md](./docs/SERVER.md) for detailed information on endpoints and configuration.

## Testing

Run the full test suite using Vitest:

```bash
npm test
```

## Links

- [Mission Statement](../MISSION.md)
- [Contributing Guide](../CONTRIBUTING.md)
- [License](../LICENSE.md)
- [GitHub Repository](https://github.com/xn-intenton-z2a/agentic-lib)
- [HTTP Server Docs](./docs/SERVER.md)
- [Deep Dive: SQS Overview](./docs/SQS_OVERVIEW.md)
