# Objective and Scope

Add a new command-line flag `--crawl <url>` to `sandbox/source/main.js` to retrieve data from a public HTTP endpoint. When invoked, the CLI will fetch the content at the given URL, attempt to parse it as JSON, and print the result in formatted JSON. In case of non-JSON responses, it will print the raw text.

# Value Proposition

Users can quickly fetch and inspect data from public APIs or endpoints directly from the sandbox CLI. This bridges the gap between local data processing workflows and live data sources, enabling rapid prototyping of knowledge-graph ingestion steps in the context of crawling external resources.

# Success Criteria & Requirements

- Recognize and parse a `--crawl <url>` flag and exactly one URL argument following it.
- Use the built-in `fetch` API available in Node 20 to perform HTTP GET requests.
- Attempt to parse the fetched body as JSON. If parsing succeeds, pretty-print JSON with 2-space indentation.
- If JSON parsing fails, print the raw text response.
- Exit with code `0` on success, and code `1` on network errors or non-2xx status codes, printing an error message.
- Add unit and sandbox tests covering successful JSON fetch, text fetch fallback, invalid URL handling, and HTTP error responses.

# Dependencies & Constraints

- Leverage the global `fetch` API in Node 20; no additional dependencies needed.
- Only modify `sandbox/source/main.js` and `sandbox/tests/main.test.js`; existing project structure and other files remain unchanged.
- Ensure compatibility with existing CLI flags (`--help`, `--version`, `--digest`).

# User Scenarios & Examples

1. Fetch JSON data:
   ```sh
   node sandbox/source/main.js --crawl https://api.github.com/repos/nodejs/node
   ```
   Should print parsed repository metadata as formatted JSON.

2. Fetch plaintext data:
   ```sh
   node sandbox/source/main.js --crawl https://example.com/robots.txt
   ```
   Should print raw text of robots.txt.

3. Handle network error or invalid URL:
   ```sh
   node sandbox/source/main.js --crawl http://invalid.local
   ```
   Should print an error message and exit code 1.

# Verification & Acceptance

- Sandbox tests in `sandbox/tests/main.test.js` should simulate HTTP responses using mocks and assert correct output and exit codes.
- Run `npm test` and confirm all existing and new tests pass.
- Manual verification: invoke `--crawl` against a known JSON endpoint and verify formatted output, and against a text endpoint for fallback behavior.
- Code review to ensure clear structure, error handling, and adherence to project style guidelines.