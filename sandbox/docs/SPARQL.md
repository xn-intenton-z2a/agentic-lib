# `--sparql` Flag

The `--sparql` flag allows the CLI to execute SPARQL queries (raw or named presets) against a SPARQL endpoint and inject the results into the digest pipeline as SQS events.

## Description

When provided with a query or preset and an optional endpoint override, the CLI will:

1. **Resolve the query**:
   - Recognize named presets (e.g., `wikidata-items`) to built-in SPARQL queries.
   - Treat any other argument as a raw SPARQL query string.
2. **Send the SPARQL request** via HTTP POST to the SPARQL endpoint (default: `https://query.wikidata.org/sparql`) with header `Content-Type: application/sparql-query`.
3. **Parse the JSON response** and iterate over `results.bindings`.
4. For each binding:
   - Construct a digest object:
     ```json
     {
       "query": "<the SPARQL query>",
       "endpoint": "<endpoint URL>",
       "binding": { /* one binding object */ },
       "timestamp": "<ISO 8601 string>"
     }
     ```
   - Wrap the digest in an SQS event via `createSQSEventFromDigest`.
   - Invoke `digestLambdaHandler` with the event.
5. **Log** an `info` entry after all bindings are processed:
   ```json
   {"level":"info","timestamp":"<...>","message":"SPARQL query processed at <endpoint>, bindings: <count>"}
   ```
6. On HTTP errors or network failures, logs an error and exits with a non-zero code:
   ```json
   {"level":"error","timestamp":"<...>","message":"Error fetching SPARQL from <endpoint>","error":"<status or message>"}
   ```

## Usage

```bash
node sandbox/source/main.js --sparql <queryOrPreset> [--endpoint <url>]
```

### Named Presets

- `wikidata-items`

  ```bash
  node sandbox/source/main.js --sparql wikidata-items
  ```

### Raw Query

```bash
node sandbox/source/main.js --sparql "SELECT ?item WHERE { ?item wdt:P31 wd:Q146 } LIMIT 5"
```

### Override Endpoint

```bash
node sandbox/source/main.js --sparql "SELECT * WHERE {?s ?p ?o}" --endpoint https://example.org/sparql
```
