# Bulk Crawl

## Objective
Extend the existing crawl functionality by adding a new CLI flag --crawl-file <FILE> that reads a list of URLs from a local file and crawls each endpoint, normalizing and outputting graph nodes.

## Value Proposition
Allow users to ingest and preview structured data from multiple public APIs in a single command, accelerating batch knowledge graph construction without writing custom scripts.

## Success Criteria & Requirements
- Recognize a new CLI flag --crawl-file followed by a file path.
- Read the file using the Node fs promises API, treating each nonempty line as a URL and ignoring lines starting with a hash.
- For each URL, perform an HTTP GET request with up to 3 retry attempts and exponential backoff on network errors.
- Validate that each response is valid JSON, normalize keys to lowercase and trim whitespace, then include a sourceUrl property on each output node.
- Output each node to stdout as a JSON string prefixed by the originating URL.
- If any URL fetch fails after retries or produces invalid JSON, log an error to stderr and exit with a nonzero code.

## Testability & Stability
- Write unit tests mocking fs read operations and fetch to cover: valid file with multiple URLs, missing file or permission error, invalid JSON payload, mixed success and failure across URLs.
- Ensure clear error messages and correct exit codes.

## Dependencies & Constraints
- Use built-in fs/promises for file reading.
- Continue using node-fetch for HTTP requests.
- Maintain compatibility with ESM and Node 20+.

## User Scenario
CLI Usage example:
  --crawl-file urls.txt
where urls.txt contains:
  # List of public endpoints
  https://api.example.com/data1.json
  https://api.example.com/data2.json

Expected output streams normalized node JSON for each URL.