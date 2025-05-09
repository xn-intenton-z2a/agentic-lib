sandbox/features/CONSOLE_CAPTURE_INTEGRATION.md
# sandbox/features/CONSOLE_CAPTURE_INTEGRATION.md
# Objective

Integrate the existing sandbox console capture utility into the public API of agentic-lib so that consumers can import and use console capture functions directly from the package root.

# Value Proposition

Users gain a cohesive, discoverable API for capturing console.log and console.error output without referencing sandbox paths, improving testability and runtime diagnostics in downstream projects.

# Scope

- Update src/lib/main.js (or create a public index export) to re-export startConsoleCapture, stopConsoleCapture, getCapturedOutput, clearCapturedOutput from sandbox/source/consoleCapture.js.
- Modify sandbox/tests/consoleCapture.test.js and sandbox/tests/consoleCapture.vitest.setup.js to import console capture functions from '@xn-intenton-z2a/agentic-lib/consoleCapture.js' instead of relative sandbox paths.
- Update sandbox/README.md under Core Utilities to document the public console capture API with import examples.
- Ensure package.json exports or the main module path support direct import of consoleCapture.js from the package.
- No new files to be created; only existing source, test, README, and dependencies files may be updated.

# Success Criteria

1. Consumers can import startConsoleCapture, stopConsoleCapture, getCapturedOutput, and clearCapturedOutput using:
   import { startConsoleCapture, stopConsoleCapture, getCapturedOutput, clearCapturedOutput } from '@xn-intenton-z2a/agentic-lib/consoleCapture.js'
2. All existing and updated tests in sandbox/tests pass without errors.
3. The README reflects the public console capture API under Core Utilities with usage examples.
4. CI checks and linting succeed with no regressions.