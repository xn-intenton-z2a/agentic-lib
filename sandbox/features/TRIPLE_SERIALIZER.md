# Objective & Scope

Define a new CLI flag --serialize-triples that accepts a path to a JSON file or inline JSON string, parses one or more digest event objects, and serializes each into RDF triples in N-Triples format for knowledge graph ingestion.

# Value Proposition

Enable seamless conversion of existing SQS event digests into RDF triples, facilitating import into graph databases or triple stores. This bridges the gap between raw crawl data and structured graph representation, accelerating the knowledge graph construction.

# Success Criteria & Requirements

- Recognize a --serialize-triples flag in the CLI and parse the next argument as either:
  • A file path pointing to a JSON file containing one digest or an array of digests.
  • An inline JSON string representing one digest or an array of digests.
- Read the file or parse the JSON string into JavaScript object(s).
- For each digest object, generate RDF triples for its key properties (e.g., url, status, timestamp, body or query, endpoint, binding).
- Use the N3 library to write triples in N-Triples format to standard output.
- Ensure each digest yields a subject node and predicate-object triples for each property.
- Return true from processSerializeTriples to signal the flag was handled and exit early without processing other CLI flags.

# Testability & Stability

- Create unit tests that stub file system reads and inline JSON parsing.
- Mock N3.Writer to intercept triple output and verify expected triples for sample digest objects.
- Validate correct handling of single digest and arrays of digests.
- Assert that processSerializeTriples returns true and that no other CLI commands are executed when the flag is present.

# Dependencies & Constraints

- Add the n3 library to package.json dependencies.
- Changes limited to src/lib/main.js, sandbox/source/main.js, sandbox/tests/main-serialize.test.js, tests/unit/main-serialize.test.js, sandbox/README.md, and package.json.

# User Scenarios & Examples

- Serialize from file:
  node src/lib/main.js --serialize-triples path/to/digest.json

- Serialize inline digest:
  node src/lib/main.js --serialize-triples '{"url":"https://a.com","status":200,"body":"data","timestamp":"2025-01-01T00:00:00Z"}'

- Expected output (example):
  <http://example.com/event/1> <http://schema.org/url> "https://a.com" .
  <http://example.com/event/1> <http://schema.org/status> "200" .
  <http://example.com/event/1> <http://schema.org/timestamp> "2025-01-01T00:00:00Z" .

# Verification & Acceptance

- Run npm test to ensure new serialize tests and existing tests all pass.
- Manually invoke the CLI with both file and inline JSON inputs and verify N-Triples output appears on stdout.
- Code review confirms adherence to ESM standards and existing logging conventions.