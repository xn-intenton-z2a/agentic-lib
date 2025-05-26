# Agentic-lib Sandbox CLI

**Mission:** build a knowledge graph of the physical world by crawling public data sources.

The sandbox CLI provides commands to ingest external data into the digest pipeline as SQS events.

See [MISSION](./MISSION.md) and [../CONTRIBUTING.md](../CONTRIBUTING.md) for more details.

## Available Flags

### `--crawl`

Fetch one or more URLs and process them:

```bash
node sandbox/source/main.js --crawl https://example.com/data.json,https://b.org/info
```

### `--sparql`

Execute SPARQL queries (raw or named presets) against a SPARQL endpoint:

```bash
node sandbox/source/main.js --sparql wikidata-items
node sandbox/source/main.js --sparql "SELECT ?item WHERE { ?item wdt:P31 wd:Q5 } LIMIT 3" --endpoint https://query.wikidata.org/sparql
```

## Examples

```bash
npm run sandbox -- --crawl https://example.com/data.json
npm run sandbox -- --sparql wikidata-items
```

## License

For license details, see [LICENSE](../LICENSE-MIT) and [LICENSE-GPL3](../LICENSE-GPL3).

## Contributing

Follow [CONTRIBUTING](../CONTRIBUTING.md) to get started.

## Repository

https://github.com/xn-intenton-z2a/agentic-lib
