# Objective & Scope
Implement a new CLI flag --fetch-osm <boundingBox> in src/lib/main.js that queries OpenStreetMap data from the Overpass API and emits the response as JSON. This enables the library to crawl geographic data as a public data source and ingest structured geographic features for building the knowledge graph.

# Value Proposition
By integrating direct access to OpenStreetMap via the Overpass API, users can bootstrap geographic nodes, ways, and relations in the knowledge graph without manual data entry or external tooling. This feature leverages built-in Node 20 fetch support and avoids new heavy dependencies.

# Success Criteria & Requirements
- Introduce processFetchOsm(args) in src/lib/main.js before the existing help, version, digest, and fetch-wikipedia handlers.
- Recognize --fetch-osm flag followed by a boundingBox string in the format minLon,minLat,maxLon,maxLat.
- Construct an Overpass QL query to select all nodes, ways, and relations within the specified bounds.
- Perform a POST request to https://overpass-api.de/api/interpreter with the query in the request body.
- Parse the JSON response and output it via console.log(JSON.stringify(responseData)).
- On HTTP errors, missing or invalid boundingBox argument, call logError and exit gracefully.
- Ensure environment variables and global callCount handling remain unchanged.

# User Scenarios & Examples
1. node src/lib/main.js --fetch-osm -0.128051,51.507351,-0.127000,51.508000 prints the GeoJSON of OpenStreetMap features in central London.
2. node src/lib/main.js --fetch-osm prints usage guidance and an error about missing bounding box argument.
3. node src/lib/main.js --fetch-osm invalid,bbox logs an error about invalid bounding box format.

# Verification & Acceptance
- Add unit tests in tests/unit/fetchOsm.test.js mocking global fetch for success and failure cases.
- Verify the correct Overpass API URL, POST method, headers and request body are used, and that successful JSON is logged.
- Confirm that error cases invoke logError with descriptive messages for HTTP failures, missing flags, or invalid formats.
- Create sandbox tests in sandbox/tests to cover CLI invocation of --fetch-osm with valid and invalid inputs.
- Update sandbox/README.md to include the new flag, usage examples, and links to MISSION.md and CONTRIBUTING.md.
- Perform manual test by running npm run sandbox -- --fetch-osm -0.1,51.5,0.1,51.6 and verifying the printed GeoJSON format.

# Dependencies & Constraints
- Relies on global fetch available in Node 20.
- No new external dependencies beyond those already in package.json.
