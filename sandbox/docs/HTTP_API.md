# HTTP API Endpoint

## Overview

This HTTP API provides an Express-based endpoint to ingest digest payloads directly over HTTP. It wraps incoming JSON bodies into SQS-style events and invokes the existing `digestLambdaHandler`.

## Starting the Server

Launch the server using the npm `start` script:

```bash
npm run start
```

By default, it listens on port `3000` (or the port defined in the `PORT` environment variable) and logs:

```
Listening on port 3000
```

## Endpoint

### POST /digest

Accepts a JSON body matching the digest schema and returns the `batchItemFailures` from the handler.

#### Request

- **Headers**: `Content-Type: application/json`
- **Body**: JSON object with the following shape:

  ```json
  {
    "key": "path/to/object",
    "value": "objectValue",
    "lastModified": "2025-05-26T18:00:00.000Z"
  }
  ```

#### Responses

- **200 OK**

  ```json
  {
    "batchItemFailures": []
  }
  ```

  - `batchItemFailures`: An array of identifiers for records that failed processing.

- **400 Bad Request**

  ```json
  { "error": "Invalid JSON" }
  ```

  Occurs when the request body is not valid JSON.

- **500 Internal Server Error**

  ```json
  { "error": "Internal Server Error" }
  ```

  Indicates an error during handler invocation.

#### Example

```bash
curl -X POST http://localhost:3000/digest \
  -H "Content-Type: application/json" \
  -d '{"key":"events/1.json","value":"12345","lastModified":"2025-05-26T18:00:00.000Z"}'
```

Response:

```json
{ "batchItemFailures": [] }
```
