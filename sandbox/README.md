# agentic-lib HTTP Interface

This library now includes a built-in HTTP interface powered by Express. You can run it alongside the existing CLI mode to enable RESTful access to core functionalities.

## Getting Started

Install dependencies:

```bash
npm install
```

### Starting the HTTP Server

Run the server in HTTP mode:

```bash
npm run start:http
```

By default, the server listens on port 3000 (or the port defined in the `PORT` environment variable).

## CLI Usage

Retrieve the library's mission statement via the CLI:

```bash
node sandbox/source/main.js --mission
```

Retrieve the list of available features via the CLI:

```bash
node sandbox/source/main.js --features
```

Embedded response (each feature):

```json
[
  {
    "name": "HTTP_INTERFACE",
    "title": "Objective & Scope",
    "mission": "# Mission Statement\n..."
  }
]
```
