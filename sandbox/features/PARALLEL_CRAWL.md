# Parallel Crawl

## Objective
Add a new optional CLI flag `--concurrency <N>` to control the maximum number of simultaneous HTTP requests when performing a bulk crawl via the `--crawl-file` command.

## Value Proposition
By parallelizing fetch operations with a configurable concurrency limit, users can significantly speed up large-scale data ingestion while balancing resource usage and avoiding rate limits on external APIs.

## Success Criteria & Requirements
- Recognize an optional `--concurrency` flag followed by a positive integer value.
- Default to a concurrency level of 5 when the flag is not provided.
- Integrate with existing `--crawl-file` functionality to ensure that no more than N fetch requests run in parallel.
- Maintain existing retry logic (up to 3 attempts with exponential backoff) and error handling for each URL.
- Validate that concurrency is a positive integer; exit with a clear error message on invalid input.

## Testability & Stability
- Write unit tests mocking `node-fetch` and `fs/promises` to simulate different URL lists and delays.
- Verify that the pool of active requests never exceeds the configured concurrency.
- Test default concurrency behavior and custom values (e.g., 1, 10).
- Test invalid values (zero, negative, non-integer) to ensure proper validation and error messages.

## Dependencies & Constraints
- Implement a simple promise pool internally without adding new external dependencies.
- Continue using `node-fetch` for HTTP requests and `fs/promises` for file operations.
- Ensure compatibility with ESM and Node.js 20+ environments.

## User Scenario & Examples
CLI usage:
  --crawl-file urls.txt --concurrency 10
Where `urls.txt` contains a list of endpoints. Users observe up to 10 simultaneous fetches with normalized JSON nodes streamed to stdout.

## Verification & Acceptance
- Unit tests demonstrate correct concurrency enforcement and default behavior.
- Manual tests with large URL lists confirm improved throughput and stable resource usage.
