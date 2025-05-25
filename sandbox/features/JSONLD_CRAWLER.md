# Objective & Scope
Add a new CLI command `--extract-jsonld <URL>` to fetch an arbitrary web page, parse HTML content for JSON-LD script blocks, and ingest the extracted structured data into the existing knowledge graph pipeline.

# Value Proposition
Enable automatic discovery and ingestion of semantic markup embedded in public web pages. Users can point the CLI at any URL containing JSON-LD to accelerate population of the knowledge graph without manual data extraction.

# Success Criteria & Requirements
- The CLI accepts `--extract-jsonld` followed by a valid URL.
- On invocation, fetch the page HTML using native `fetch`.
- Parse the HTML and locate all `<script type="application/ld+json">` elements.
- Deserialize each JSON-LD block into an object and wrap each in a digest `{ source: URL, data: <jsonLdObject> }`.
- Pass each digest through `createSQSEventFromDigest` and invoke `digestLambdaHandler` sequentially.
- Log the number of JSON-LD blocks found and summary of each ingestion.
- On network or parse errors, log an error message with details and exit with code 1.
- Return exit code 0 when at least one block is successfully ingested.

# Dependencies & Constraints
- Introduce `cheerio` as a new dependency for HTML parsing.
- Use native Node 20+ `fetch` API for network requests.
- No changes outside of `src/lib/main.js`, test files, `README.md`, and `package.json`.
- Tests should mock fetch and cheerio parsing to simulate various page structures.

# User Scenarios & Examples
1. Successful Extraction:
   - Command: `node src/lib/main.js --extract-jsonld https://example.com/page-with-jsonld`
   - Logs include count of extracted blocks and confirmation of each digest ingested.

2. No JSON-LD Present:
   - Command: `node src/lib/main.js --extract-jsonld https://example.com/plain-page`
   - Logs a warning indicating zero JSON-LD scripts found and exits with code 0 without pipeline errors.

3. Invalid HTML or Network Failure:
   - Logs an error describing the failure and exits with code 1.

# Verification & Acceptance
- Unit tests covering:
  - HTML with one JSON-LD block ingested successfully.
  - HTML with multiple JSON-LD blocks ingested sequentially.
  - HTML without JSON-LD produces a warning and graceful exit.
  - Network failure or invalid HTML triggers error logging and exit code 1.
- Manual test using a local HTTP server serving example HTML pages.

# Implementation Notes
- In `src/lib/main.js`, implement `processExtractJsonLd(args)` before existing command handlers.
- Register `--extract-jsonld` in the main CLI dispatch sequence.
- Update `package.json` to add `cheerio` dependency.
- Extend `README.md` to document usage of the new flag and provide examples.