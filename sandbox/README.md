# agentic-lib Sandbox

This sandbox demonstrates the HTTP Server feature for health monitoring and digest processing, built on the core `agentic-lib` library.

Links:
- [MISSION](./MISSION.md)
- [CONTRIBUTING](../CONTRIBUTING.md)
- [LICENSE](../LICENSE.md)
- [Repository](https://github.com/xn-intenton-z2a/agentic-lib)

## Health Check Server

The library includes a built-in HTTP server providing health, metrics, and digest endpoints for monitoring and integration.

### Starting the Server

Use the sandbox script:

```bash
# Default port (3000)
npm run sandbox -- --serve

# Custom port (e.g., 4000)
npm run sandbox -- --serve --port 4000
```

Or directly with Node.js:

```bash
node sandbox/source/main.js --serve --port 4000
```

### Endpoints

- GET /health

```bash
curl http://localhost:3000/health
# => { "status": "ok", "uptime": 123 }
```

- GET /metrics

```bash
curl http://localhost:3000/metrics
# => { "callCount": 5, "uptime": 123 }
```

- POST /digest

```bash
curl -X POST http://localhost:3000/digest \
  -H "Content-Type: application/json" \
  -d '{"key":"x","value":"y","lastModified":"2025-05-25T00:00:00Z"}'
# => { "batchItemFailures": [] }
```
