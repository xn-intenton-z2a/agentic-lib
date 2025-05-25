# Agentic-lib Sandbox CLI

This sandbox CLI enables fetching and printing JSON data from public APIs, forming the foundation for building a knowledge graph of the physical world by crawling public data sources.

See [MISSION](./MISSION.md), [CONTRIBUTING](../CONTRIBUTING.md), and [LICENSE](../LICENSE.md) for more details.

## CLI Usage

Run the sandbox CLI:

```bash
npm run sandbox -- <options>
```

### Crawl Public Data

Fetch and print JSON data from a public API endpoint.

```bash
npm run sandbox -- --crawl <URL>
```

**Example:**

```bash
npm run sandbox -- --crawl https://api.example.com/data
```

Expected output:

```json
{ "foo": "bar", "baz": 123 }
```

On error, logs a JSON-formatted error to stderr and exits with a non-zero code:

```bash
npm run sandbox -- --crawl invalid-url
```

```json
{"error":"FetchError","message":"Only absolute URLs are supported","url":"invalid-url"}
```

### Other Commands

(Existing commands remain supported.)

- Display usage instructions:

  ```bash
  npm run sandbox -- --help
  ```
