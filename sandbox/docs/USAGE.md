# CLI Usage

This document describes how to use the sandbox CLI for various tasks, including crawling public data sources.

## crawl Command

Fetch and display JSON from a public URL using Node 20's built-in `fetch` API.

Usage:
```bash
npm run sandbox -- --crawl <url>
```

- `<url>`: The public endpoint that returns JSON data.

Example:
```bash
npm run sandbox -- --crawl https://api.example.com/data
```

The command will perform a GET request to the specified URL, parse the returned JSON, and print it to the console as a JSON string.
