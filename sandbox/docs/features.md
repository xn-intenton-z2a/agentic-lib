# Features

List of available features and how to retrieve them.

## CLI Usage

Retrieve feature list via the CLI:

```bash
node sandbox/source/main.js --features
```

**Response**

```json
{
  "features": [
    {
      "name": "HTTP_INTERFACE",
      "title": "Provide a built-in HTTP interface that allows external systems (for example, CI pipelines or webhook providers) to invoke core agentic-lib functionality via REST endpoints. This feature leverages the existing Express dependency without introducing new files beyond source, test, README, and package.json, and it remains fully compatible with GitHub Actions workflows.",
      "description": "Provide a built-in HTTP interface that allows external systems (for example, CI pipelines or webhook providers) to invoke core agentic-lib functionality via REST endpoints. This feature leverages the existing Express dependency without introducing new files beyond source, test, README, and package.json, and it remains fully compatible with GitHub Actions workflows. Extend the existing HTTP interface feature to collect in-memory runtime metrics and expose them via a new HTTP endpoint and CLI flag. This enhancement remains confined to sandbox/source/main.js, sandbox/tests, sandbox/README.md, and package.json."
    }
  ]
}
```

## HTTP Endpoint

Retrieve feature list via HTTP:

```bash
curl http://localhost:3000/features
```

**Response**

```json
{
  "features": [
    {
      "name": "HTTP_INTERFACE",
      "title": "Provide a built-in HTTP interface that allows external systems (for example, CI pipelines or webhook providers) to invoke core agentic-lib functionality via REST endpoints. This feature leverages the existing Express dependency without introducing new files beyond source, test, README, and package.json, and it remains fully compatible with GitHub Actions workflows.",
      "description": "Provide a built-in HTTP interface that allows external systems (for example, CI pipelines or webhook providers) to invoke core agentic-lib functionality via REST endpoints. This feature leverages the existing Express dependency without introducing new files beyond source, test, README, and package.json, and it remains fully compatible with GitHub Actions workflows. Extend the existing HTTP interface feature to collect in-memory runtime metrics and expose them via a new HTTP endpoint and CLI flag. This enhancement remains confined to sandbox/source/main.js, sandbox/tests, sandbox/README.md, and package.json."
    }
  ]
}
```
