# agentic-lib Sandbox

This sandbox provides a lightweight HTTP API server implementing the Model Contact Protocol (MCP) to expose core agentic-lib functionality—invoking workflows, querying stats, and interacting with issues—via simple HTTP endpoints.

## Table of Contents

- [Key Features](#key-features)
- [Getting Started](#getting-started)
- [MCP HTTP API](#mcp-http-api)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## Key Features

- **Health Check**: Verify the server is running and responsive.
- **Mission Retrieval**: Retrieve the current mission statement from `sandbox/MISSION.md`.
- **Feature Discovery**: List available commands (`digest`, `version`, `help`).
- **Command Invocation**: Invoke library actions remotely via the `/invoke` endpoint.

## Getting Started

### Prerequisites

- Node.js v20 or later
- npm

### Installation

```bash
npm install
```

### Running the Server

By default, the server listens on port **3000**.

```bash
# Start the MCP server
npm start

# Or specify a custom port
PORT=4000 npm start
```

## MCP HTTP API

A detailed reference for all MCP endpoints is available in the [API documentation](sandbox/docs/API.md).

Below is a quick overview of the endpoints:

| Method | Endpoint   | Description                        |
| ------ | ---------- | ---------------------------------- |
| GET    | `/health`  | Check server health                |
| GET    | `/mission` | Retrieve current mission statement |
| GET    | `/features`| List supported commands            |
| POST   | `/invoke`  | Invoke a library command remotely  |

### Example Usage

#### Health Check

```bash
curl http://localhost:3000/health
```

#### Retrieve Mission

```bash
curl http://localhost:3000/mission
```

#### List Features

```bash
curl http://localhost:3000/features
```

#### Invoke a Command (e.g., version)

```bash
curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{"command":"version"}'
```


```js
// JavaScript fetch example
fetch('http://localhost:3000/invoke', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ command: 'version' })
}).then(res => res.json()).then(console.log);
```

## Documentation

- **Mission**: [sandbox/MISSION.md](sandbox/MISSION.md)
- **API Reference**: [sandbox/docs/API.md](sandbox/docs/API.md)
- **Contributing Guidelines**: [CONTRIBUTING.md](../CONTRIBUTING.md)
- **License**: [LICENSE-MIT](../LICENSE-MIT)
- **Repository**: https://github.com/xn-intenton-z2a/agentic-lib

## Contributing

Please see [CONTRIBUTING.md](../CONTRIBUTING.md) for details on contributing to this project.

## License

This project is licensed under the MIT License. See [LICENSE-MIT](../LICENSE-MIT) for details.
