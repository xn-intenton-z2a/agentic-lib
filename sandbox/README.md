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

**Sample Output**

```json
{
  "mission": "# Mission Statement\n\n**agentic-lib** Is a JavaScript library which can be used as a drop in JS implementation or wholesale replacement for the steps, jobs, and re-usable workflows below in this repository. It is designed to be used in a GitHub Actions workflow to enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.",
  "features": [
    {
      "name": "HTTP_INTERFACE",
      "title": "Provide a built-in HTTP interface that allows external systems (for example, CI pipelines or webhook providers) to invoke core agentic-lib functionality via REST endpoints. This feature leverages the existing Express dependency without introducing new files beyond source, test, README, and package.json, and it remains fully compatible with GitHub Actions workflows."
    }
  ]
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

### GET /mission

Returns the full mission statement of the library.

**Request**

```bash
curl http://localhost:3000/mission
```

**Response**

```json
{
  "mission": "# Mission Statement\n**agentic-lib** Is a JavaScript library which can be used as a drop in JS implementation or wholesale replacement for the steps, jobs, and re-usable workflows below in this repository. It is designed to be used in a GitHub Actions workflow to enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK."
}
```

### GET /features

List available features and their titles (including mission context).

**Request**

```bash
curl http://localhost:3000/features
```

**Response**

```json
{
  "mission": "# Mission Statement\n\n**agentic-lib** Is a JavaScript library which can be used as a drop in JS implementation or wholesale replacement for the steps, jobs, and re-usable workflows below in this repository. It is designed to be used in a GitHub Actions workflow to enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.",
  "features": [
    {
      "name": "HTTP_INTERFACE",
      "title": "Provide a built-in HTTP interface that allows external systems (for example, CI pipelines or webhook providers) to invoke core agentic-lib functionality via REST endpoints. This feature leverages the existing Express dependency without introducing new files beyond source, test, README, and package.json, and it remains fully compatible with GitHub Actions workflows."
    }
  ]
}
```

## Additional Resources

- [MISSION.md](../MISSION.md)
- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [GitHub Repository](https://github.com/xn-intenton-z2a/agentic-lib)