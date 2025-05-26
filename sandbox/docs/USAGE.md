# CLI Usage

This document describes how to use the sandbox CLI for various tasks, including crawling public data sources.

## crawl Command

Fetch and display JSON from a public URL using Node 20's built-in `fetch` API.

Usage:
```bash
npm run sandbox -- --crawl <url>
```

- `<url>`: The public endpoint that returns JSON data.

Example:
```bash
npm run sandbox -- --crawl https://api.example.com/data
```

The command will perform a GET request to the specified URL, parse the returned JSON, and print it to the console as a JSON string.

## SPARQL Crawler Command

Fetch structured data from public SPARQL endpoints (Wikidata and DBpedia).

Usage:
```bash
npm run sandbox -- --sparql <source> [<SPARQL_QUERY>]
```

- `<source>`: `wikidata` or `dbpedia`.
- `<SPARQL_QUERY>`: Optional custom SPARQL query. Defaults to a simple query retrieving 10 items.

Examples:
```bash
npm run sandbox -- --sparql wikidata
npm run sandbox -- --sparql dbpedia "SELECT ?item WHERE { ?item a dbo:Person } LIMIT 5"
```

The command will print a JSON array of SPARQL result `bindings` to the console.

Note: Node 20's global `fetch` is used under the hood.
