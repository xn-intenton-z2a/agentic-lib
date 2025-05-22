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

## HTTP Endpoints

### GET /health

Returns service health and uptime.

**Request**

```bash
curl http://localhost:3000/health
```

**Response**

```json
{
  "status": "ok",
  "uptime": 1.234
}
```

### POST /digest

Accepts a JSON payload matching the digest schema and invokes the digest handler.

**Request**

```bash
curl -X POST http://localhost:3000/digest \
  -H "Content-Type: application/json" \
  -d '{"key":"events/1.json","value":"12345","lastModified":"2025-05-21T00:00:00Z"}'
```

**Response**

```json
{
  "batchItemFailures": [],
  "handler": "sandbox/source/main.digestLambdaHandler"
}
```

### POST /webhook

Receives any JSON payload, logs it internally, and acknowledges receipt.

**Request**

```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"foo":"bar"}'
```

**Response**

```json
{ "status": "received" }
```

### GET /features

List available features, including their name, title, and description.

**Request**

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

### GET /stats

Returns service uptime and in-memory metrics.

**Request**

```bash
curl http://localhost:3000/stats
```

**Response**

```json
{
  "uptime": 1.234,
  "metrics": {
    "digestInvocations": 0,
    "digestErrors": 0,
    "webhookInvocations": 0,
    "webhookErrors": 0,
    "featuresRequests": 0,
    "missionRequests": 0
  }
}
```

### GET /discussion-stats

Returns placeholder discussion analytics via HTTP.

**Request**

```bash
curl http://localhost:3000/discussion-stats
```

**Response**

```json
{
  "discussionCount": 0,
  "commentCount": 0,
  "uniqueAuthors": 0
}
```