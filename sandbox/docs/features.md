# Features

List of available features and how to retrieve them. Each feature object now includes `name`, `title`, and `description` to provide context about the feature.

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
      "title": "Objective & Scope",
      "description": "Provide a unified HTTP interface and complementary CLI flags to expose core agentic-lib functionality without adding new files beyond source, tests, README, and package.json. This feature covers service health, digest processing, webhook intake, mission and feature discovery, and in-memory runtime metrics in a single Express application."
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
      "title": "Objective & Scope",
      "description": "Provide a unified HTTP interface and complementary CLI flags to expose core agentic-lib functionality without adding new files beyond source, tests, README, and package.json. This feature covers service health, digest processing, webhook intake, mission and feature discovery, and in-memory runtime metrics in a single Express application."
    }
  ]
}
```

Each feature object includes `description`, which is the first paragraph of the feature markdown file.