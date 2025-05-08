# agentic-lib

**agentic-lib** is a JavaScript library designed to power autonomous workflows in GitHub Actions. It provides utilities for capturing console output, generating AWS SQS events, and more, enabling continuous code evolution through reusable SDK components.

[Mission Statement](../MISSION.md) | [Contributing](../CONTRIBUTING.md) | [License](../LICENSE.md) | [GitHub](https://github.com/xn-intenton-z2a/agentic-lib)

## Console Capture Utility

For detailed documentation, see [Console Capture Utility](docs/CONSOLE_CAPTURE.md).

## Vitest Console Capture

You can group console logs per test by setting the `VITEST_CONSOLE_CAPTURE` environment variable when running tests:

```bash
VITEST_CONSOLE_CAPTURE=true npm test
```

When enabled, console logs and errors are captured per test, and outputs are grouped with a header showing the test name, followed by JSON-formatted log entries.