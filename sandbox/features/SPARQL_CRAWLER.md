# Objective & Scope
Define a new CLI flag --sparql that accepts either a full SPARQL query string or a named preset, sends it to a configurable SPARQL endpoint (defaulting to Wikidata), parses the JSON results, and converts each binding into a standardized SQS event for downstream ingestion.

# Value Proposition
Enable structured crawling of public semantic knowledge sources such as Wikidata or DBpedia to bootstrap the knowledge graph with rich, queryable data. Provides a seamless interface for retrieving linked data and feeding it into the existing event pipeline.

# Success Criteria & Requirements
- Recognize a --sparql flag in the CLI and parse the next argument as either:
  • A raw SPARQL query string.
  • A named preset key from a predefined list (e.g. "wikidata-items").
- Support an optional --endpoint flag to override the default SPARQL endpoint URL.
- Send an HTTP POST to the endpoint with the query using Content-Type: application/sparql-query.
- Parse the JSON response, iterating over each result binding.
- For each binding:
  • Build a digest object with fields: query, endpoint, binding, and timestamp.
  • Invoke createSQSEventFromDigest to wrap the digest in an SQS event.
  • Call digestLambdaHandler with the event.
  • Log an info entry including endpoint and number of bindings processed.
- On HTTP error or parse failure, log an error entry with endpoint, query, and error details, then exit with a non-zero status.
- Return true from processSparql to signal that the flag was handled and terminate further CLI processing.

# Testability & Stability
- Mock global.fetch to simulate:
  • A successful SPARQL endpoint returning a valid JSON result set.
  • An HTTP error status (e.g. 500).
  • Invalid JSON in the response.
- Spy on createSQSEventFromDigest, digestLambdaHandler, logInfo, and logError to verify correct invocation with expected payloads.
- Assert that processSparql returns true when --sparql is present and that main exits early without processing other flags.

# Dependencies & Constraints
- No additional dependencies; rely on built-in Node 20 fetch API.
- Leverage existing utilities: createSQSEventFromDigest, digestLambdaHandler, logInfo, and logError.
- Changes limited to src/lib/main.js, tests/unit/main-sparql.test.js, sandbox/source/main.js, and sandbox/tests.

# User Scenarios & Examples
- Raw query usage:
  node src/lib/main.js --sparql "SELECT ?item WHERE { ?item wdt:P31 wd:Q5 } LIMIT 10"
- Named preset usage:
  node src/lib/main.js --sparql wikidata-items --endpoint https://query.wikidata.org/sparql

# Verification & Acceptance
- Run npm test to confirm all unit tests including new sparql tests pass.
- Manually invoke:
  node src/lib/main.js --sparql wikidata-items
  and observe JSON-formatted info logs for each binding and no further CLI processing.