# Objective and Scope

Introduce a new command line flag --extract-links <url> in sandbox/source/main.js that fetches the HTML content of a public web page and extracts all anchor href URLs. The output is a JSON array of absolute URLs. This iteration focuses on link discovery and normalization to support crawling workflows.

# Value Proposition

Crawling and building a knowledge graph requires discovering related pages. This feature enables rapid extraction of outgoing links from any URL directly from the CLI. It accelerates prototyping of ingestion pipelines and identification of new data sources for graph expansion.

# Success Criteria & Requirements

- Recognize and parse a --extract-links <url> flag with exactly one URL argument.
- Use the global fetch API in Node 20 to retrieve the HTML content.
- Parse out all anchor href values from the HTML document.
- Normalize relative URLs to absolute URLs using the URL constructor based on the base URL.
- Combine all extracted URLs into a JSON array and pretty print with 2-space indentation.
- Exit with code 0 on success, and code 1 on network errors or invalid URL, printing an error message.
- Add sandbox tests in sandbox/tests/main.test.js covering pages with multiple links, no links, and network failure scenarios.

# Dependencies & Constraints

- Introduce cheerio as a dev dependency for HTML parsing in tests if needed; runtime extraction should use string matching and the URL constructor.
- Only modify sandbox/source/main.js, sandbox/tests/main.test.js, sandbox/README.md, and package.json to add cheerio.
- Maintain compatibility with existing CLI flags (--help, --version, --digest, --crawl, --extract-schema).

# User Scenarios & Examples

1. Extract links from a page:
   node sandbox/source/main.js --extract-links https://example.com
   Should print an array of absolute URLs.

2. Page without anchor tags:
   node sandbox/source/main.js --extract-links https://example.com/plain
   Should print an empty JSON array.

3. Handle network error or invalid URL:
   node sandbox/source/main.js --extract-links http://invalid.local
   Should print an error message and exit code 1.

# Verification & Acceptance

- Sandbox tests should mock fetch to return HTML strings with various link scenarios and assert correct output and exit codes.
- Run npm test and confirm all existing and new tests pass.
- Manual CLI verification against known web pages to ensure correct link extraction and normalization.
- Code review to ensure clear error handling, correct URL resolution, and adherence to project style guidelines.