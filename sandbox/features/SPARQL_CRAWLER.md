# Objective & Scope

Extend the CLI tool to support multi-source SPARQL crawling across public endpoints, integrating the existing sandbox behavior into the core CLI located in `src/lib/main.js`. Users can invoke `--crawl` on named or raw SPARQL queries and target Wikidata or DBpedia (and future endpoints) to bootstrap a knowledge graph from multiple data sources.

# Value Proposition

Enable users to ingest structured data from various SPARQL endpoints directly within the primary CLI. This unifies public data crawling into one command, avoids context switching to sandbox code, and accelerates building a federated knowledge graph of the physical world.

# Success Criteria & Requirements

- Users can pass `--crawl <queryOrPreset>` and optional `--source <sourceId>` (defaults to `wikidata`).
- Supported sources: `wikidata` => `https://query.wikidata.org/sparql`, `dbpedia` => `https://dbpedia.org/sparql`.
- Query parameter may be a raw SPARQL string or a named preset defined in code or config.
- CLI fetches data with header `Accept: application/sparql-results+json` and transforms results to `Array<{ key: string, label: string, properties: Record<string,string> }>`.
- Support `--output <file>` to write pretty-printed JSON to a filesystem path; otherwise print to stdout.
- Handle missing or unknown `--source` and empty query by logging an error and exiting with non-zero code.
- Include automated tests in `tests/unit/main.test.js` mocking fetch, verifying endpoint URL selection, transformation logic, stdout output, and file writes.

# Dependencies & Constraints

- Use built-in Node.js 20 `fetch` API or add `node-fetch` if necessary.
- Introduce endpoint map in core CLI code, avoid sandbox-specific logic.
- Validate CLI arguments manually or via a lightweight schema library (e.g., Zod) to enforce non-empty query and valid source values.
- Respect SPARQL endpoint rate-limits; retry logic is out of scope for this iteration.

# User Scenarios & Examples

1. Crawl Wikidata with raw query to stdout:
   cli-tool --crawl "SELECT ?item ?itemLabel WHERE { ... }"

2. Crawl DBpedia using raw SPARQL and save to file:
   cli-tool --source dbpedia --crawl "SELECT ?s ?o WHERE { ... }" --output data.json

3. Use a named preset defined in code:
   cli-tool --source wikidata --crawl capitals-europe --output europe.json

4. Error on invalid source or empty query:
   cli-tool --source unknown --crawl ""  => logs error and exits non-zero

# Verification & Acceptance

- Unit tests in `tests/unit/main.test.js` stub global `fetch` and `fs.writeFileSync`, asserting correct URL construction, JSON transformation, and output behavior.
- Integration test invoking `node src/lib/main.js --source dbpedia --crawl "..."` prints valid JSON and exits with code 0.
- README updated under **CLI Flags** to document `--crawl` and `--source` usage.
- Manual acceptance: run against real endpoints and inspect output for valid node objects.