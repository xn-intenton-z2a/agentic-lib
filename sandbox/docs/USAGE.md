# CLI Usage

This document provides concrete examples of how to invoke the CLI and sample output.

## --help
```bash
$ npm start -- --help
```
**Sample Output:**
```
Usage:
  --help                     Show this help message and usage instructions.
  --digest                   Run a full bucket replay simulating an SQS event.
  --version                  Show version information with current timestamp.
```

## --version
```bash
$ npm start -- --version
```
**Sample Output:**
```json
{ "version": "6.7.5-0", "timestamp": "2025-01-01T12:00:00.000Z" }
```

## --digest
```bash
$ npm start -- --digest
```
**Sample Output (abbreviated):**
```json
{"level":"info","timestamp":"2025-01-01T12:00:00.000Z","message":"Digest Lambda received event: ..."}
{"level":"info","timestamp":"2025-01-01T12:00:00.000Z","message":"Record 0: Received digest: ..."}
```
