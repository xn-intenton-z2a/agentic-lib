# Crawl Public Data

## Objective
Implement a new CLI command `--crawl <URL>` that fetches JSON data from a public endpoint, normalizes it into graph nodes, and outputs the result for ingestion into the knowledge graph.

## Value Proposition
By providing a simple CLI interface to retrieve and preview structured data from arbitrary public APIs, users can kickstart the knowledge graph building process with real-world data sources without writing custom scripts.

## Success Criteria & Requirements
- Recognize a `--crawl` flag followed by a URL argument in the CLI.
- Perform an HTTP GET request to the provided URL using node-fetch.
- Validate that the response is valid JSON and handle invalid payloads with clear error messages.
- Normalize output nodes by converting keys to lowercase and trimming whitespace.
- Output each node to stdout as a JSON string.
- Exit with non-zero code on HTTP errors or invalid JSON.

## Testability & Stability
- Add `node-fetch` as a dependency for HTTP requests.
- Write unit tests mocking fetch for:
  - Successful JSON response.
  - HTTP error status codes.
  - Invalid JSON payload.
- Include retry logic with up to 3 attempts and exponential backoff on network errors.

## Dependencies & Constraints
- Add `node-fetch` dependency to package.json.
- Ensure compatibility with ESM and Node 20+.
- Tests should not introduce other testing frameworks.

## User Scenario
CLI Usage:
  --crawl https://api.example.com/data.json

Expected Output:
  {"id":"node1","properties":{...}}
  {"id":"node2","properties":{...}}

## Verification & Acceptance
- Unit tests covering success, error, and invalid payload cases.
- Manual test using the CLI flag in sandbox mode.