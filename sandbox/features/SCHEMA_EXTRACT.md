# Objective and Scope

Introduce a new command-line flag `--extract-schema <url>` in sandbox/source/main.js that fetches the HTML content of a public web page and extracts embedded schema.org JSON-LD metadata. If JSON-LD script tags are present, parse and output them as an array of JSON objects. If no JSON-LD is found, print an empty JSON array. This iteration focuses on JSON-LD only, deferring full microdata extraction to future enhancements.

# Value Proposition

Knowledge graph builders often need structured metadata directly from web pages. This feature enables rapid extraction of schema.org JSON-LD from any URL without leaving the CLI, accelerating prototyping of ingestion pipelines and validation of metadata availability.

# Success Criteria & Requirements

- Recognize and parse a `--extract-schema <url>` flag with exactly one URL argument.
- Use the global `fetch` API in Node 20 to retrieve the page HTML.
- Parse out all `<script type="application/ld+json">` blocks.
- Combine parsed JSON-LD objects into a JSON array and pretty-print with 2-space indentation.
- If no JSON-LD blocks are found, output an empty JSON array (`[]`).
- Exit with code `0` on success and code `1` on network errors or invalid URL, printing an error message.
- Add sandbox tests in sandbox/tests/main.test.js to cover:
  - Successful extraction of multiple JSON-LD scripts.
  - Page with no JSON-LD tags.
  - Invalid URL or network failure handling.

# Dependencies & Constraints

- Introduce `cheerio` as a new dev dependency for HTML parsing in tests if needed, but JSON-LD extraction should use simple string matching and `JSON.parse` at runtime.
- Only modify sandbox/source/main.js, sandbox/tests/main.test.js, sandbox/README.md, and package.json to add cheerio.
- Maintain compatibility with existing CLI flags (`--help`, `--version`, `--digest`, `--crawl`).

# User Scenarios & Examples

1. Extract JSON-LD metadata:
   ```
   node sandbox/source/main.js --extract-schema https://example.com/product
   ```
   Should print an array of parsed JSON-LD objects, e.g.:  
   [
     { "@context": "https://schema.org", "@type": "Product", "name": "Example" }
   ]

2. Page without JSON-LD:
   ```
   node sandbox/source/main.js --extract-schema https://example.com/plain
   ```
   Should print `[]`.

3. Handle network error:
   ```
   node sandbox/source/main.js --extract-schema http://invalid.local
   ```
   Should print an error JSON with code `1`.

# Verification & Acceptance

- Write sandbox tests that mock fetch to return HTML strings with and without JSON-LD.
- Ensure all tests in sandbox/tests/main.test.js pass.
- Manual CLI verification on known URLs with JSON-LD.
- Code review to confirm clear error handling and compliance with project style guidelines.