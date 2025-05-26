# Objective & Scope
Extend the core CLI in `src/lib/main.js` to integrate the multi-source SPARQL crawler previously confined to sandbox. Users can invoke `--crawl` against Wikidata or DBpedia endpoints (and future endpoints), supplying raw SPARQL or selecting from built-in query presets.

# Value Proposition
Centralize public data crawling into the primary CLI, eliminating sandbox context switching and ES module execution errors. Provide a consistent, extensible interface to bootstrap knowledge graphs directly from the core tool.

# Success Criteria & Requirements
- Support `--crawl <queryOrPreset>` and optional `--source <sourceId>` flags in the core CLI, defaulting source to `wikidata`.
- Embed a map of named presets in code (e.g., `{ "capitals-europe": "SELECT ?item ?itemLabel WHERE { ... }" }`).
- Detect if the crawl argument matches a preset key and substitute its SPARQL string; otherwise treat it as raw SPARQL.
- Fetch from the selected SPARQL endpoint with header `Accept: application/sparql-results+json`.
- Transform the JSON results into `Array<{ key: string, label: string, properties: Record<string,string> }>`.
- Honor `--output <file>` to write pretty-printed JSON to disk; print to stdout if omitted.
- Update ES module entry check to use ESM-compatible logic (e.g., `import.meta.main` or proper `import.meta.url` check) instead of `require.main`.

# Dependencies & Constraints
- Leverage Node.js 20 built-in `fetch` API; no new external dependencies.
- Only modify `src/lib/main.js`, `tests/unit/main.test.js`, `sandbox/README.md`, and `package.json` if needed for documentation.
- Use manual flag parsing or existing `zod` schema for lightweight validation; do not add heavyweight schema libraries.

# User Scenarios & Examples
1. Crawl Wikidata with a raw query and print to stdout:
   `cli-tool --crawl "SELECT ?item ?itemLabel WHERE { ... }"`
2. Use a named preset and save to file:
   `cli-tool --crawl capitals-europe --output europe.json`
3. Query DBpedia using raw SPARQL:
   `cli-tool --source dbpedia --crawl "SELECT ?s ?o WHERE { ... }"`
4. Missing or empty arguments:
   `cli-tool --crawl`  => print usage and exit non-zero.

# Verification & Acceptance
- Unit tests in `tests/unit/main.test.js` stub global `fetch` and `fs.writeFileSync`, asserting endpoint URL selection, preset substitution, JSON transformation, stdout output, and file write behavior.
- Integration test invoking `node src/lib/main.js --source dbpedia --crawl capitals-europe` produces valid JSON and exits with code 0.
- Documentation in `sandbox/README.md` updated under **CLI Flags** to include preset usage and corrected ESM entry instructions.