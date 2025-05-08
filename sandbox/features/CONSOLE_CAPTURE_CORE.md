# Objective
Integrate the existing Console Capture API into the core library entry point, enabling users to import and invoke console capture functions directly from the published module without relying on sandbox paths.

# Value Proposition
Bringing Console Capture into the core library streamlines adoption, unifies the public API surface, and removes duplication. Consumers can depend on a single, versioned package for both application logic and test utilities, improving DX and reducing confusion over sandbox versus core usage.

# Scope
- Modify src/lib/main.js to import startConsoleCapture, stopConsoleCapture, getCapturedOutput, and clearCapturedOutput from sandbox/source/consoleCapture.js and re-export them as part of the core API.
- Update sandbox/tests/consoleCapture.test.js and sandbox/tests/consoleCapture.vitest.setup.js to import console capture functions from the core entry point (src/lib/main.js) instead of sandbox source.
- Update sandbox/README.md to reference the core library import path for console capture methods.
- Update root README.md to include a new “Console Capture API” section under exported utilities, illustrating import from the main module.
- No new source files are created; no existing files are deleted.

# Requirements
- In src/lib/main.js:
  - Add import statements for console capture functions from sandbox/source/consoleCapture.js.
  - Append named exports: startConsoleCapture, stopConsoleCapture, getCapturedOutput, clearCapturedOutput.
- In sandbox/tests/consoleCapture.test.js and sandbox/tests/consoleCapture.vitest.setup.js:
  - Change import paths to reference '../../src/lib/main.js'.
- In sandbox/README.md:
  - Under “Console Capture Utility”, update example imports to use the core module path (import from agentic-lib or src/lib/main.js).
- In root README.md:
  - Add a “## Console Capture API” section showing code snippet for importing and using the methods from the core package.
- Update package.json if necessary for proper exports field or entry labeling; do not add external dependencies.

# Success Criteria
- Consumers can import all four console capture functions from the core entry point and exercise them as before.
- Existing sandbox tests for console capture pass without modifying test behavior.
- README files display updated import paths and usage examples that render correctly.
- No test or lint failures after running npm test.

# Verification
1. In a sample project, install the updated agentic-lib package and import startConsoleCapture from the module. Confirm capture behavior.
2. Run sandbox/tests/consoleCapture.test.js and confirm all tests pass with imports from the core library.
3. Open sandbox/README.md and root README.md in Markdown preview to verify new sections and links render correctly.
4. Execute npm test to ensure there are no regressions or lint errors.