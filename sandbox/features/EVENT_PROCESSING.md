# Objective & Scope
Extend the existing event ingestion and processing framework to include a dedicated CLI metrics command that surfaces runtime statistics on demand. Maintain all current HTTP server capabilities and CLI tools while adding a new --stats flag to support quick diagnostics.

# Value Proposition
- Provides immediate insight into the application’s internal metrics without running the HTTP server.
- Empowers operators and automation scripts to gather runtime data programmatically.
- Complements existing observability endpoints with a lightweight CLI interface.

# Success Criteria & Requirements
## HTTP Server Implementation
- All existing endpoints from the prior implementation remain unchanged.

### Exposed Endpoints
- GET /status
- GET /health
- GET /metrics
- POST /webhook
- POST /ingest
- POST /summarize
- DLQ management endpoints
- GET /openapi.json
- GET /docs

## CLI Extensions
- --help: show usage instructions and exit.
- --version: show version and timestamp and exit.
- --digest: simulate SQS digest event using createSQSEventFromDigest and digestLambdaHandler.
- --status: print JSON status containing uptime, memoryUsage, callCount.
- --stats: alias for --status, explicitly surfaces callCount, uptime, and memoryUsage in structured JSON format.

# Testability & Stability
- Add unit tests for the new --stats flag following existing patterns with vitest.
- Reuse mocks for AWS SDK SQS client and OpenAI API to ensure no external calls.
- Integration test invoking CLI with --stats and validating output contains expected keys and numeric values.
- Maintain coverage above 90%.

# Dependencies & Constraints
- No new dependencies beyond existing AWS SDK and OpenAI SDK.
- Continue compatibility with Node 20, ESM, and existing linting and formatting rules.

# User Scenarios & Examples
- Retrieve runtime metrics without server:
```
npx agentic-lib --stats
```
- Scripted monitoring:
```
const output = JSON.parse(execSync('npx agentic-lib --stats').toString());
console.log(output.uptime, output.callCount);
```

# Verification & Acceptance
- All tests pass under npm test.
- Manual invocation of --stats prints valid JSON with uptime, memoryUsage, and callCount.
- No regressions in existing CLI flags or HTTP server endpoints.