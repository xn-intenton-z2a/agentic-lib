# Runtime Metrics (Stats)

This document describes how to retrieve in-memory runtime metrics via both HTTP and the CLI.

## HTTP Endpoint: GET /stats

Returns a JSON object containing uptime and counters for key operations.

**Request**

```bash
curl http://localhost:3000/stats
```

**Response**

```json
{
  "uptime": 42,
  "metrics": {
    "digestInvocations": 10,
    "digestErrors": 1,
    "webhookInvocations": 5,
    "webhookErrors": 0,
    "featuresRequests": 2,
    "missionRequests": 3
  }
}
```

- **uptime**: Number of seconds since the server started.
- **digestInvocations**: Number of successful `/digest` calls.
- **digestErrors**: Number of failed `/digest` calls.
- **webhookInvocations**: Total `/webhook` calls received.
- **webhookErrors**: Number of `/webhook` calls that returned errors.
- **featuresRequests**: Total `GET /features` calls.
- **missionRequests**: Total `GET /mission` calls.

## CLI Flag: --stats

Retrieve the same metrics via the CLI:

```bash
node sandbox/source/main.js --stats
```

**Sample Output**

```json
{
  "uptime": 42,
  "metrics": {
    "digestInvocations": 10,
    "digestErrors": 1,
    "webhookInvocations": 5,
    "webhookErrors": 0,
    "featuresRequests": 2,
    "missionRequests": 3
  }
}
```