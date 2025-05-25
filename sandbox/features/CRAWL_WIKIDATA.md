# Objective
Add support to the CLI and Lambda entrypoint to fetch structured semantic data from Wikidata for a given entity label, transform key entity fields into subject–predicate–object triples, and emit those triples as JSON log entries for downstream ingestion into the knowledge graph.

# Value Proposition
By tapping into the collaboratively maintained Wikidata repository, we assign canonical identifiers, labels, descriptions, and semantic classifications to real-world entities. This enriches the knowledge graph with stable references and ontology-based relationships without manual data curation.

# Requirements & Constraints
- Introduce a new CLI flag `--crawl-wikidata ENTITY_LABEL` in `src/lib/main.js`.
- When invoked, send a GET request to the Wikidata Search API endpoint https://www.wikidata.org/w/api.php?action=wbsearchentities&search=ENTITY_LABEL&language=en&format=json using Node 20 fetch API and a custom User-Agent header.
- Parse the JSON response, select the first search result, and extract its `id` (e.g., Q42).
- Send a second GET request to https://www.wikidata.org/wiki/Special:EntityData/<id>.json to retrieve full entity data.
- From the entity record, extract the following fields:
  - `id` (entity Q-number)
  - English label (`labels.en.value`)
  - English description (`descriptions.en.value`)
  - All values of the `instance of` property (`claims.P31`), extracting each mainsnak datavalue id.
- For each extracted field, build a JSON object with keys `subject`, `predicate`, and `object`, where:
  - `subject` is the original ENTITY_LABEL
  - `predicate` is one of id, label, description, or instanceOf
  - `object` is the extracted value (string or array of strings).
- Log each triple as a JSON string via `logInfo` to maintain consistency with existing logging.
- Write unit tests in `tests/unit` to mock both fetch calls and verify correct triple output for a sample entity.
- Update `sandbox/README.md` to document the new `--crawl-wikidata` flag, its usage example, and expected output format.
- No new dependencies; rely on built-in fetch and existing logging utilities.

# User Scenarios
1. CLI mode: `npm run start -- --crawl-wikidata Berlin`
   - The tool searches Wikidata for "Berlin", retrieves id Q64, fetches the entity record, and logs triples for id, label, description, and instanceOf values.
2. Lambda mode: embed a digest record with type `crawlWikidata` and label `Paris`; `digestLambdaHandler` routes to the new crawl function and logs triples accordingly.

# Success Criteria & Verification
- Automated tests cover mocking of the search and entity fetch responses and assert correct triples passed to `logInfo` for a sample entity.
- Manual CLI invocation displays the expected JSON triples for a known entity label.
- README clearly documents the `--crawl-wikidata` flag, usage syntax, and sample output.
