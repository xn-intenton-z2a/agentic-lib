# SPARQL Crawler CLI Command

## Overview

The SPARQL crawler CLI command allows querying public SPARQL endpoints (Wikidata and DBpedia) to fetch structured knowledge-graph data. It uses Node.js built-in `fetch` and logs the resulting JSON bindings.

## Supported Sources

- **wikidata**: `https://query.wikidata.org/sparql`
- **dbpedia**: `http://dbpedia.org/sparql`

## Usage

```bash
npm run sandbox -- --sparql <source> [<SPARQL_QUERY>]
```

- `<source>`: `wikidata` or `dbpedia`.
- `<SPARQL_QUERY>`: Optional custom SPARQL query. If omitted, a default query is used:
  - **wikidata** default: `SELECT ?item WHERE { ?item wdt:P31 wd:Q5 } LIMIT 10`
  - **dbpedia** default:
    ```sparql
    PREFIX dbo: <http://dbpedia.org/ontology/>
    SELECT ?item WHERE { ?item a dbo:Person } LIMIT 10
    ```

## Examples

1. Query Wikidata with default SPARQL:

```bash
npm run sandbox -- --sparql wikidata
```

2. Query DBpedia with a custom SPARQL string:

```bash
npm run sandbox -- --sparql dbpedia "SELECT ?item WHERE { ?item a dbo:Place } LIMIT 5"
```

## Output

The command prints a JSON array of SPARQL result `bindings`, for example:

```json
[{ "item": { "type": "uri", "value": "http://www.wikidata.org/entity/Q1" } }, ...]
```