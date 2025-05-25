# Objective
Enable the CLI and Lambda entrypoint to fetch structured geospatial data from OpenStreetMap’s Nominatim Search API for a given place name, transform key fields into simple subject–predicate–object triples, and emit those triples as JSON log entries for downstream ingestion into the knowledge graph.

# Value Proposition
By pulling authoritative geolocation and address data directly from OpenStreetMap, we enrich the knowledge graph with precise location coordinates and context without manual effort. Users can quickly retrieve standardized geospatial metadata for any named place to power mapping, spatial queries, and location-based analytics.

# Requirements & Constraints
- Introduce a new CLI flag `--crawl-osm PLACE_NAME` in `src/lib/main.js`.
- When invoked, send a GET request to `https://nominatim.openstreetmap.org/search?format=json&q=PLACE_NAME` using Node 20 fetch API.
- Include a custom User-Agent header to comply with Nominatim usage policy.
- Parse the JSON response, select the first result, and extract fields: `display_name`, `lat`, `lon`, and `boundingbox`.
- Transform each extracted field into a JSON object with keys `subject`, `predicate`, and `object`, where `subject` is `PLACE_NAME`, `predicate` is the field name, and `object` is the field value (string or array as appropriate).
- Log each triple as a JSON string via `logInfo` for consistency with existing logging.
- Write unit tests in `tests/unit` to mock fetch responses and verify triple output for a sample place.
- Update the README to document the new `--crawl-osm` flag, its usage example, and expected output format.
- No new dependencies; rely on built-in fetch and existing logging utilities.

# User Scenarios
1. CLI mode: `npm run start -- --crawl-osm Berlin`
   - The tool fetches geolocation data for Berlin, logs triples for display_name, lat, lon, and boundingbox.
2. Lambda mode: embed a digest record with type `crawlOpenStreetMap` and name `Paris`; `digestLambdaHandler` routes to the new crawl function and logs triples.

# Success Criteria & Verification
- Automated tests cover at least one example place, mocking fetch to return a sample JSON and asserting correct triples are passed to `logInfo`.
- Manual CLI test prints triples for a known place name.
- README clearly documents the crawling feature with usage and sample output.