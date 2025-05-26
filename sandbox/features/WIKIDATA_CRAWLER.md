# Objective & Scope

Provide a new CLI command flag `--crawl` that accepts a SPARQL query or predefined query identifier and retrieves matching data from the Wikidata SPARQL endpoint. The feature transforms the result set into a structured JSON knowledge graph and writes it to stdout or to a user-supplied output file.

# Value Proposition

Enable users to quickly bootstrap a local knowledge graph of entities in the physical world by issuing SPARQL queries directly from the CLI. This core capability accelerates data ingestion from public sources without requiring custom scripts.

# Success Criteria & Requirements

- Users can pass `--crawl` followed by a SPARQL query string or a named preset to the CLI.
- The CLI fetches data from https://query.wikidata.org/sparql with `Accept: application/sparql-results+json`.
- The JSON results are transformed into an array of node objects with key, label, and properties fields.
- Users can optionally specify `--output <path>` to write the graph JSON to a file instead of stdout.
- Feature must include automated tests mocking the SPARQL endpoint to verify parsing logic.

# Dependencies & Constraints

- Add `node-fetch` as a dependency for HTTP requests to the SPARQL endpoint.
- Ensure compatibility with Node.js 20 built-in or polyfilled `fetch` API.
- Validate that the query parameter is a nonempty string.
- Respect rate limits of the Wikidata endpoint; no retry logic is required in this iteration.

# User Scenarios & Examples

1. Retrieve all capital cities in Europe:
   cli-tool --crawl "SELECT ?item ?itemLabel WHERE { ?item wdt:P31 wd:Q515; wdt:P17 wd:Q46. SERVICE wikibase:label { bd:serviceParam wikibase:language \"en\". } }"

2. Use a named preset for common queries:
   cli-tool --crawl capitals-europe --output capitals.json

3. Emit the default result to stdout:
   cli-tool --crawl "SELECT ..."

# Verification & Acceptance

- Unit tests in `tests/unit/crawl.test.js` mock the fetch call and verify the transformation to node objects.
- Integration test in `sandbox/tests` runs the CLI with a dummy endpoint environment variable pointing to a local mock server.
- README updated to document `--crawl` flag, query usage, and output options.
- Manual acceptance: run against the real SPARQL endpoint and inspect the JSON output for valid node structures.