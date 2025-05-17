# agentic-lib

agentic-lib is a drop-in JavaScript SDK for autonomous GitHub workflows. Inspired by our mission to enable continuous, agentic interactions through issues, branches, and pull requests, this library provides core utilities to configure environments, handle AWS SQS events, and power CLI-driven and programmatic workflows.

With agentic-lib, you can seamlessly integrate environment validation, structured logging, AWS utilities, and Lambda handlers into your GitHub Actions or custom Node.js projects, ensuring reproducible, testable, and maintainable automation.

## Key Features

- **Environment configuration** (dotenv + Zod)
- **Logging helpers** (logInfo, logError)
- **AWS utilities** (createSQSEventFromDigest)
- **Lambda handler** (digestLambdaHandler)
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

```js
import { createSQSEventFromDigest, digestLambdaHandler } from "@xn-intenton-z2a/agentic-lib";

const event = createSQSEventFromDigest({
  key: "path",
  value: "123",
  lastModified: new Date().toISOString(),
});

digestLambdaHandler(event).then(() => console.log("Processed"));
```

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

## Advanced Topics

- [Deep Dive: SQS Overview](./docs/SQS_OVERVIEW.md)
