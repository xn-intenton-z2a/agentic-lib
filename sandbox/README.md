## CLI Usage

--run-tests             Run Vitest test suite and emit each event as structured JSON logs to stdout.

### Example

```bash
$ node src/lib/main.js --run-tests
{"level":"test-result","event":{"type":"start"}}
{"level":"test-result","event":{"type":"end"}}
```