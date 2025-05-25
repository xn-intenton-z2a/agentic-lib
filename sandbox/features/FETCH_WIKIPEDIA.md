# Objective & Scope
Implement a new CLI flag `--fetch-wikipedia <topic>` in src/lib/main.js that retrieves the summary of a given topic from the Wikipedia REST API and emits the response as JSON. This enables the library to crawl Wikipedia as a public data source and ingest structured content for building the knowledge graph.

# Value Proposition
By integrating direct access to Wikipedia summaries, users can quickly bootstrap nodes and relationships in the physical world knowledge graph without manual data entry. The feature leverages built-in Node 20 fetch support and avoids new heavy dependencies.

# Success Criteria & Requirements
- Introduce `processFetchWikipedia(args)` in src/lib/main.js before the default help/version/digest handlers.
- When `--fetch-wikipedia` is passed with a topic string, call `fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(topic))`.
- Parse the JSON response and output it via `console.log(JSON.stringify(responseData))`.
- On HTTP errors or missing topic argument, call `logError` and exit gracefully.
- Ensure environment variables and global callCount handling remain unchanged.

# User Scenarios & Examples
1. `node src/lib/main.js --fetch-wikipedia Node.js` prints the JSON summary of the Node.js article.
2. Missing topic: `node src/lib/main.js --fetch-wikipedia` logs usage guidance and an error about missing topic.

# Verification & Acceptance
- Unit tests in tests/unit/fetchWikipedia.test.js mocking global fetch for success and failure cases.
- Tests must verify that the correct URL is requested, that successful JSON is logged, and that errors invoke `logError` with descriptive messages.
- Update README in sandbox/README.md to include the new flag, example commands, and link to MISSION.md and CONTRIBUTING.md.
- Manual test by running `npm run sandbox -- --fetch-wikipedia Earth` and verifying output format.