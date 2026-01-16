# MCP HTTP API

The Model Contact Protocol (MCP) provides a simple HTTP-based API to interact with the agentic-lib core functionality remotely.

## Endpoints

### GET /health

- **Description**: Check server health and readiness.
- **Response**: 200 OK

```json
{
  "status": "ok",
  "timestamp": "2025-05-27T12:34:56.789Z"
}
```

### GET /mission

- **Description**: Retrieve the current mission statement.
- **Response 200 OK**

```json
{
  "mission": "Mission file content..."
}
```

- **Response 404 Not Found**

```json
{
  "error": "Mission file not found"
}
```

### GET /features

- **Description**: List available commands that can be invoked via `/invoke`.
- **Response 200 OK**

```json
[
  "digest",
  "version",
  "help"
]
```

### POST /invoke

- **Description**: Invoke a library command remotely.
- **Headers**: `Content-Type: application/json`
- **Request Body**:

```json
{
  "command": "version",   // one of 'digest', 'version', 'help'
  "args": []             // optional array of string arguments
}
```

- **Response for `version`** (200 OK):

```json
{
  "version": "6.10.3-0",
  "timestamp": "2025-05-27T12:35:00.000Z"
}
```

- **Response for `digest`** (200 OK):

```json
{
  "result": {
    "batchItemFailures": [],
    "handler": "src/lib/main.digestLambdaHandler"
  }
}
```

- **Response for `help`** (200 OK):

```
Usage:
  command: digest | version | help
  args: optional array of arguments to pass
```

- **Response 400 Bad Request** (unsupported command):

```json
{
  "error": "Unsupported command"
}
```

## Examples

### cURL

```bash
# Invoke digest with default payload
curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{"command":"digest"}'
```

### JavaScript Fetch

```js
async function invoke(command, args = []) {
  const response = await fetch('http://localhost:3000/invoke', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command, args })
  });

  if (!response.ok) throw new Error(`Error: ${response.status}`);
  const data = await response.json();
  console.log(data);
}

invoke('digest');
```
