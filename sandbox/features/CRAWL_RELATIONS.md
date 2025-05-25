# Overview

Add a new CLI option --crawl-relations to retrieve structured relationship data for a real-world entity from the Wikidata API. This feature extends the knowledge graph by fetching property claims and links between the target entity and related items.

# Value Proposition

This feature enriches the knowledge graph with semantic connections and property values, enabling users to discover related entities and attributes from a reliable public data source. It accelerates graph construction by providing machine readable triples linking nodes.

# Success Criteria & Requirements

- Implement a processRelations function in src/lib/main.js to handle the --crawl-relations flag.
- Accept an entity name argument following the flag and resolve the corresponding Wikidata ID by querying the search endpoint.
- Query the Wikidata API with action=wbgetentities and props=claims to retrieve property claims for the entity.
- Parse the response to extract key property claims such as instance of, located in, coordinates, and identifiers linking to other items.
- Format the output as a JSON object with fields:
  - entityId: the Wikidata ID of the target entity
  - relations: an array of triples, each containing subject ID, predicate ID, and object value or ID
  - retrievedAt: ISO timestamp of fetch time
- On HTTP error or invalid payload, invoke logError and exit with a non-zero code.
- Add unit tests in sandbox/tests to mock fetch calls for success and error scenarios.
- Update README.md to document the new CLI flag, its purpose, usage examples, and output format.

# Dependencies & Constraints

- Use the global fetch API available in Node 20 or include node-fetch fallback if needed.
- Maintain existing ESM standards and code style conventions.
- Limit changes to src/lib/main.js, sandbox/tests, README.md, and package.json dependencies.

# User Scenarios & Examples

A user invokes the CLI with the option and entity label:

  node src/lib/main.js --crawl-relations Berlin

On success, the output is a single JSON object containing the resolved entity ID, an array of relation triples, and a retrievedAt timestamp.

# Verification & Acceptance

- Unit tests cover a mocked successful Wikidata API response and verify extraction of triples.
- Unit tests cover failure cases and verify that logError is called and the process exits with a non-zero code.
- Manual test by running the CLI against a known entity and inspecting the output for correctness.