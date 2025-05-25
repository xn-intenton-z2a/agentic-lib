# Objective & Scope
Implement a new CLI flag `--fetch-wikidata <entityId>` in src/lib/main.js that retrieves the JSON representation of a given Wikidata entity from the Wikidata API and emits the response as JSON. This enables the library to crawl structured knowledge from Wikidata as a public data source and ingest it into the physical world knowledge graph.

# Value Proposition
By integrating direct access to Wikidata entities, users can incorporate highly structured and interlinked data points into the knowledge graph, enriching nodes with authoritative identifiers, labels, and multilingual descriptions without manual lookup.

# Success Criteria & Requirements
- Introduce `processFetchWikidata(args)` in src/lib/main.js before existing flag handlers.
- Recognize `--fetch-wikidata` followed by a valid entity identifier (e.g., Q42).
- Construct a GET request to `https://www.wikidata.org/wiki/Special:EntityData/<entityId>.json`.
- On success, parse the JSON response and output it via `console.log(JSON.stringify(responseData))`.
- Handle HTTP errors, missing or malformed entityId argument by calling `logError` with a descriptive message and exiting gracefully.
- Maintain existing environment variable handling, global callCount, and logging conventions.

# User Scenarios & Examples
1. `node src/lib/main.js --fetch-wikidata Q42` prints the JSON data for the Douglas Adams entity.
2. Missing argument: `node src/lib/main.js --fetch-wikidata` logs usage guidance and an error about missing entityId.
3. Invalid ID: `node src/lib/main.js --fetch-wikidata ABC123` logs an error about invalid entity identifier format.

# Verification & Acceptance
- Add unit tests in `tests/unit/fetchWikidata.test.js` mocking global fetch for success and failure cases.
- Verify the correct request URL is used and that successful JSON is fully logged.
- Confirm error cases invoke `logError` with appropriate messages for HTTP failures and argument validation.
- Update `sandbox/README.md` to include the new flag, usage examples, and links to MISSION.md and CONTRIBUTING.md.
- Perform a manual test: `npm run sandbox -- --fetch-wikidata Q64` and verify printed JSON structure.

# Dependencies & Constraints
- Relies on built-in `fetch` in Node 20; no new external dependencies.
- Adheres to existing linting, formatting, and test frameworks (ESM, vitest).