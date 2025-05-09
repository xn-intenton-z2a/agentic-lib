sandbox/docs/CONSOLE_CAPTURE.md
# sandbox/docs/CONSOLE_CAPTURE.md
# Console Capture Utility

The **Console Capture Utility** provides a simple API for programmatically capturing `console.log` and `console.error` output within your application or unit tests. This allows you to buffer logs, inspect them, and clear or restore normal console behavior without external dependencies.

## API

### startConsoleCapture()
Begin buffering calls to `console.log` and `console.error`. Subsequent calls are not emitted to stdout/stderr but stored in an internal buffer. If a capture is already active, the buffer will be cleared and continue capturing.

### stopConsoleCapture()
Stop buffering and restore the original `console.log` and `console.error` methods. After calling this, logs will be emitted normally.

### getCapturedOutput()
Returns an array of buffered log entries in the order they were captured. Each entry has the shape:

```js
{
  level: 'info' | 'error',
  timestamp: 'ISO-8601 string',
  message: 'string',
}
```

### clearCapturedOutput()
Clears the internal buffer of captured entries. Future calls to `getCapturedOutput()` will return an empty array until new logs are captured.

## Example Usage

```js
import {
  startConsoleCapture,
  stopConsoleCapture,
  getCapturedOutput,
  clearCapturedOutput,
} from 'agentic-lib/consoleCapture.js';

// Start capturing
startConsoleCapture();

console.log('Hello World');
console.error('Oops!');

// Retrieve buffered logs
const logs = getCapturedOutput();
console.table(logs);

// Clear buffer and capture new entries
clearCapturedOutput();

console.log('Another log');
console.error('Another error');

console.log(getCapturedOutput());

// Stop capturing and restore console
stopConsoleCapture();
console.log('Back to normal');
```

## Vitest Console Capture Integration

You can opt-in for grouped console output per test when running tests with Vitest by setting the `VITEST_CONSOLE_CAPTURE` environment variable to a truthy value (e.g., `true`).

Example:

```bash
VITEST_CONSOLE_CAPTURE=true npm test
```

When enabled, after each test, a header with the test name and JSON-formatted log entries will be printed:

```
[Console Capture] <test name>
{"level":"info","timestamp":"...","message":"..."}
{"level":"error","timestamp":"...","message":"..."}
```

The buffer is cleared after each test to ensure fresh capture cycles.

**Note:** For Vitest to load the setup file, ensure your test scripts include the `--setupFiles=sandbox/tests/consoleCapture.vitest.setup.js` flag. For example:

```bash
vitest --setupFiles=sandbox/tests/consoleCapture.vitest.setup.js tests/unit/*.test.js sandbox/tests/*.test.js
```

Optionally, you can include coverage support:

```bash
vitest --coverage --setupFiles=sandbox/tests/consoleCapture.vitest.setup.js tests/unit/*.test.js sandbox/tests/*.test.js
```