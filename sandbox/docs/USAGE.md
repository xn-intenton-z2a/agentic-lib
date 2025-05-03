# intentïon agentic‑lib

You probably want to start with the workflow documentation here: [WORKFLOWS-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/WORKFLOWS-README.md)

## Quick Links

- **GitHub Pages:** [Agentic‑lib GitHub Pages](https://xn-intenton-z2a.github.io/agentic-lib/index.html)
- **Repository Stats:** [Latest Stats](https://xn-intenton-z2a.github.io/agentic-lib/latest.html)

## Core CLI Commands

Below are concise usage examples for invoking core functionalities of agentic‑lib:

### 1. Help

Display usage instructions:

```
node src/lib/main.js --help
```

### 2. Version

Show current version information with timestamp:

```
node src/lib/main.js --version
```

### 3. Digest

Run a full bucket replay simulating an SQS event:

```
node src/lib/main.js --digest
```

### 4. Runtime Stats

Output enhanced runtime diagnostics as a JSON object. The output JSON contains the following keys:

- callCount: The current global call count.
- uptime: The current process uptime in seconds.
- memoryUsage: Memory usage metrics including at least the heapUsed property as a number.

Example:

```
node src/lib/main.js --runtime-stats
```

Sample output:

```
{"callCount":0,"uptime":1.23456789,"memoryUsage":{"rss":...,"heapTotal":...,"heapUsed":1234567,...}}
```
