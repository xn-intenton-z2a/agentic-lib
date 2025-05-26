# Agentic-lib Sandbox CLI

This is a sandbox CLI for **agentic-lib**, inspired by our mission:

> Build a knowledge graph of the physical world by crawling public data sources.

**Links:**

- [Mission](./MISSION.md)
- [Contributing](../CONTRIBUTING.md)
- [License](../LICENSE.md)
- [Repository](https://github.com/xn-intenton-z2a/agentic-lib)

## CLI Flags

Usage:
```bash
node sandbox/source/main.js [--help] [--source wikidata|dbpedia] --crawl <SPARQL_QUERY> [--output <file>]
```

Flags:

- `--help`
  Show help message and usage instructions.

- `--source <sourceId>`
  Choose SPARQL endpoint (`wikidata`|`dbpedia`). Defaults to `wikidata`.

- `--crawl <SPARQL_QUERY>`
  Execute the SPARQL query against the selected endpoint and transform results into a JSON knowledge graph.

- `--output <file>`
  Write the resulting JSON to a file instead of printing to stdout.

## Examples

```bash
# Crawl Wikidata and print to stdout
node sandbox/source/main.js --crawl "SELECT ?item ?itemLabel WHERE { ... }"

# Crawl DBpedia and save to file
node sandbox/source/main.js --source dbpedia --crawl "SELECT ?item ?itemLabel WHERE { ... }" --output dbpedia.json
```