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

Retrieve discussion analytics via the CLI:

```bash
node sandbox/source/main.js --discussion-stats
```

**Sample Response**

```json
{  
  "discussionCount": 0,
  "commentCount": 0,
  "uniqueAuthors": 0
}
```

Retrieve runtime metrics via the CLI:

```bash
node sandbox/source/main.js --stats
```

**Sample Output**

```json
{
  "uptime": 0.123,
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

## API Endpoints

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
  "upt ime": 1.234
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

### GET /mission

Returns the full mission statement of the library.

**Request**

```bash
curl http://localhost:3000/mission
```

**Response**

```json
{
  "mission": "# Mission Statement\n**agentic-lib** Is a JavaScript library..."
}
```

### GET /features

List available features and their titles, descriptions, and mission context.

**Request**

```bash
curl http://localhost:3000/features
```

**Response**

```json
{
  "mission": "...",
  "features": [
    {
      "name": "HTTP_INTERFACE",
      "title": "Objective & Scope",
      "description": "Provide a unified HTTP interface..."
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

**Example Sequence**

```bash
# exercise endpoints
curl -X POST http://localhost:3000/digest -H 'Content-Type: application/json' -d '{"key":"events/1.json","value":"foo","lastModified":"2025-05-22T00:00:00Z"}' || true
curl -X POST http://localhost:3000/digest -H 'Content-Type: application/json' -d '{}'
curl -X POST http://localhost:3000/webhook -H 'Content-Type: application/json' -d '{}'
curl http://localhost:3000/features
curl http://localhost:3000/mission

# check metrics
curl http://localhost:3000/stats
```

**Response**

```json
{
  "uptime": 1.234,
  "metrics": {
    "digestInvocations": 1,
    "digestErrors": 1,
    "webhookInvocations": 1,
    "webhookErrors": 0,
    "featuresRequests": 1,
    "missionRequests": 1
  }
}
```