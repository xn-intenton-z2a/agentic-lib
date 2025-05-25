# Data Crawler

## Objective & Scope
Add a new CLI command `--crawl <URL>` to fetch and ingest public data into the knowledge graph workflow. This feature extends the existing CLI in `src/lib/main.js` and ties into the SQS digest handler to simulate data ingestion.

## Value Proposition
Provide users with a simple mechanism to pull raw data from any accessible HTTP endpoint and feed it into the existing digest processing pipeline. This accelerates prototyping of knowledge graph ingestion from public sources.

## Success Criteria & Requirements
- The CLI must recognize `--crawl` followed by a valid URL.
- When invoked, the tool fetches JSON from the given URL using native `fetch`.
- Upon successful fetch, log an info entry with the URL, status code, and payload size.
- Wrap the fetched JSON into a digest object `{ source: URL, data: <parsed JSON> }`.
- Pass the digest through `createSQSEventFromDigest` and invoke `digestLambdaHandler`.
- Return exit code 0 and print a confirmation message.
- On fetch errors or invalid JSON, log an error and exit with code 1.

## Dependencies & Constraints
- Use native Node.js `fetch` API (Node 20+).
- No new external dependencies.
- Tests will mock fetch to simulate success and error responses.

## User Scenarios & Examples
1. Successful Run:
   - Command: `node src/lib/main.js --crawl https://api.example.com/data`
   - Logs:
     - Info entry for fetch start.
     - Info for fetch success with status and size.
     - Confirmation message.

2. Error Handling:
   - Command with invalid URL or non-JSON response.
   - Logs error with details.
   - Exit code 1.

## Verification & Acceptance
- Unit tests covering:
  - Successful fetch and pipeline invocation (mock fetch returns JSON).
  - Fetch error (network failure).
  - Non-JSON response triggers error.
- Manual test using a local HTTP server exposing JSON.

## Implementation Notes
- Update `src/lib/main.js`:
  - Add `processCrawl(args)` before the final CLI message.
  - Integrate with existing logging utilities.
- Update tests under `tests/unit/` and `sandbox/tests/` to cover `--crawl` flag.
- Update README to document `--crawl` option.
