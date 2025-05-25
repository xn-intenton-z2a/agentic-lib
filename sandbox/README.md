# agentic-lib Sandbox

This sandbox application demonstrates the HTTP API server feature of the agentic-lib library.
It allows external clients to POST digest payloads and retrieve service health and version information.

## HTTP API Server

Start the server with the CLI flag:

```bash
node sandbox/source/main.js --serve [--port <number>]
```

- Default port: `3000`.
- You can set `HTTP_PORT` environment variable instead of `--port`.

### Endpoints

- **GET /health**

  ```json
  {
    "status": "ok",
    "uptime": 123.45
  }
  ```

- **GET /version**

  ```json
  {
    "version": "6.8.2-0",
    "timestamp": "2025-05-25T12:34:56.789Z"
  }
  ```

- **POST /digest**

  Send a JSON payload matching the digest shape:

  ```json
  {
    "key": "events/1.json",
    "value": "12345",
    "lastModified": "2025-01-01T00:00:00Z"
  }
  ```

  On success, returns:

  ```json
  {
    "success": true
  }
  ```

Example usage:

```bash
node sandbox/source/main.js --serve --port 4000
curl http://localhost:4000/health
curl http://localhost:4000/version
curl -X POST http://localhost:4000/digest \
  -H "Content-Type: application/json" \
  -d '{ "key": "events/1.json", "value": "12345", "lastModified": "2025-01-01T00:00:00Z" }'
```
