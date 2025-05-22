# Objective & Scope

Extend the existing HTTP interface feature to collect in-memory runtime metrics and expose them via a new HTTP endpoint and CLI flag. This enhancement remains confined to sandbox/source/main.js, sandbox/tests, sandbox/README.md, and package.json.

# Value Proposition

- Provide visibility into service usage and reliability via basic metrics without external monitoring systems
- Enable automated workflows or developers to query invocation counts and error rates programmatically
- Maintain a lightweight footprint: metrics live in process memory and require no additional dependencies

# API Endpoints

## GET /stats

Return a JSON object with service uptime and invocation counters:

- **uptime**: seconds since server start
- **totalDigestInvocations**: number of successful POST /digest calls
- **totalDigestErrors**: number of POST /digest calls that returned errors
- **totalWebhookCalls**: number of POST /webhook calls received
- **totalFeaturesRequests**: number of GET /features calls
- **totalMissionRequests**: number of GET /mission calls

Respond with HTTP 200 and shape:

```json
{
  "uptime": 42,
  "totalDigestInvocations": 10,
  "totalDigestErrors": 1,
  "totalWebhookCalls": 5,
  "totalFeaturesRequests": 2,
  "totalMissionRequests": 3
}
```

# CLI Flag

Introduce a new `--stats` flag in the CLI:

```bash
node sandbox/source/main.js --stats
```

On invocation, synchronously print the same JSON object returned by GET /stats and exit with code 0.

# Success Criteria & Requirements

- Track counters in memory: increment appropriate metric on each endpoint invocation
- Implement `GET /stats` in Express app listening on `/stats`
- Add `processStats(args)` in CLI to handle `--stats`, read metrics, print JSON to stdout
- Integration tests using supertest for `/stats` covering normal and error conditions
- CLI test using `vitest` and `exec` to validate correct JSON output and exit code
- Update sandbox/README.md with usage instructions for HTTP `/stats` and CLI `--stats`
- No changes outside sandbox source, tests, README, or package.json

# Verification & Acceptance

1. Run `npm run start:http`; send metrics-altering requests (`/health`, `/digest`, `/webhook`, `/features`, `/mission`) then `curl http://localhost:3000/stats`; verify counts and uptime.
2. Execute `npm test`; ensure new tests for `/stats` and `--stats` pass alongside existing tests.
3. Run CLI: `node sandbox/source/main.js --stats`; parse JSON; verify keys and positive values; ensure exit code 0.