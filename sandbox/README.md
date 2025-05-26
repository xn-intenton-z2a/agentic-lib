# Agentic-lib Sandbox CLI

This sandbox CLI is part of [Agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib), an SDK for building a knowledge graph of the physical world by crawling public data sources.

## Mission

The full project mission is detailed in [MISSION.md](./MISSION.md).

## Getting Started

Install dependencies:
```bash
npm install
```

## CLI Usage

For detailed command usage, see [CLI Usage](./docs/USAGE.md).

Here is a quick overview:

- `npm run sandbox -- --crawl <url>`  
  Fetch and display JSON from a public URL.

- `npm run sandbox -- --sparql <source> [<SPARQL_QUERY>]`  
  Query public SPARQL endpoints (Wikidata, DBpedia) and fetch structured data.

## Contributing

Please see [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on contributing.

## License

This project is licensed under [GPL-3.0](https://opensource.org/licenses/GPL-3.0) and [MIT](https://opensource.org/licenses/MIT). See [LICENSE](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/LICENSE) for details.
