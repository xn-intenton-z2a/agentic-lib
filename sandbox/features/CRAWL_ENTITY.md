# Overview

Add a new CLI option --crawl to retrieve structured summary data for a given real-world entity from the Wikipedia REST API. This feature will provide the first step in building a knowledge graph by fetching node summaries and metadata from a public data source.

# Value Proposition

This feature accelerates the creation of knowledge graph nodes by ingesting curated entity summaries directly from a reliable public API. It enables users to bootstrap or enrich their graph with authoritative descriptions and links.

# Success Criteria & Requirements

- Implement a processCrawl function in src/lib/main.js to handle the --crawl flag.
- Accept an entity name argument immediately following --crawl.
- Fetch JSON from https://en.wikipedia.org/api/rest_v1/page/summary/{encodedEntityName}.
- Parse the response to extract title, extract (summary), content_urls.desktop.page, and record a retrievedAt timestamp.
- On success, output a single JSON object to stdout with fields: title, extract, url, retrievedAt.
- On HTTP error or network failure, use logError to report the issue and exit gracefully with a non-zero code.
- Update package.json dependencies if necessary to support fetch (Node 20 built-in or node-fetch fallback).
- Write unit tests that mock the fetch call for both success and error scenarios.
- Update README.md to document the new CLI flag and usage examples.

# Dependencies & Constraints

- Use global fetch API provided by Node 20. If unavailable in test or older environments, add node-fetch as an optional dependency.
- Maintain ESM standards and existing coding style.
- Changes limited to src/lib/main.js, sandbox/tests, README.md, and package.json dependencies.

# User Scenarios & Examples

User invokes the CLI:

  node src/lib/main.js --crawl Eiffel Tower

Expected output on success:

  {"title":"Eiffel Tower","extract":"The Eiffel Tower is a wrought-iron lattice tower...","url":"https://en.wikipedia.org/wiki/Eiffel_Tower","retrievedAt":"2025-06-01T12:34:56.789Z"}

User invokes with an invalid entity or network issue, and the tool logs an error message via logError and exits with code 1.

# Verification & Acceptance

- Unit tests cover a mocked successful fetch returning a known summary.
- Unit tests cover a failing fetch and verify logError is invoked and process exits non-zero.
- Manual test by running CLI with --crawl on a popular entity.
- README updated with flag description, usage, and example outputs.