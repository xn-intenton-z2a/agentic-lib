# Objective
Enable the CLI and Lambda entrypoint to fetch structured data from Wikipedia via the MediaWiki REST API for a given page title, transform key infobox fields into simple subject–predicate–object triples, and emit those triples as JSON log entries for downstream ingestion into the knowledge graph.

# Value Proposition
By pulling real-world data directly from Wikipedia, we accelerate knowledge graph population without manual entry. Users can invoke a crawl from the command line or include this in an AWS Lambda workflow, obtaining a structured representation of widely available public data.

# Requirements & Constraints
- Introduce a new CLI flag --crawl-wikipedia PAGE_TITLE in src/lib/main.js.
- When invoked, fetch from https://en.wikipedia.org/api/rest_v1/page/summary/PAGE_TITLE using the built-in fetch API in Node 20.
- Parse the JSON response, extract title, description, and key infobox data if available.
- Transform each extracted field into a JSON object with keys subject, predicate, and object, where subject is PAGE_TITLE, predicate is the field name, object is the field value.
- Log each triple as a JSON string via logInfo for consistency with existing logging.
- Write unit tests in tests/unit to mock fetch and verify triple output for a sample payload.
- Update the README to document the new --crawl-wikipedia flag, its usage example, and expected output format.
- No new dependencies; rely on Node 20 fetch and existing logging utilities.

# User Scenarios
1. CLI mode: npm run start -- --crawl-wikipedia Node_js
   - The tool fetches summary for Node_js, logs triples for title, description, and infobox fields.
2. Lambda mode: embed a digest record with type crawlWikipedia and title MyPage; digestLambdaHandler routes to the crawl function and logs triples.

# Success Criteria & Verification
- Automated tests cover at least one example Wikipedia summary, mocking fetch to return a sample JSON, and asserting correct triples are passed to logInfo.
- Manual CLI test prints triples for a known Wikipedia page.
- README clearly documents the crawling feature with usage and sample output.
