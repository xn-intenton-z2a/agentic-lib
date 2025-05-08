# Objective
Add clear, concise usage documentation for the Console Capture API in the repository’s usage guide, enabling developers to quickly understand and adopt the capture, inspect, clear, and restore workflow.

# Value Proposition
Providing inline code examples and a dedicated usage section lowers the barrier to entry for new users, accelerates test development, and encourages consistent use of the console capture utility in both application code and automated tests.

# Scope
- Update the sandbox/README.md file to include a new "Programmatic API Usage" section under the existing Console Capture Utility heading.
- Update the root README.md (or USAGE.md if present) to reference the new usage examples, ensuring consistency across documentation.
- Ensure code examples demonstrate startConsoleCapture, logging, getCapturedOutput, clearCapturedOutput, and stopConsoleCapture in context.
- Link to the detailed API reference in sandbox/docs/CONSOLE_CAPTURE.md for advanced scenarios.

# Requirements
- sandbox/README.md:
  - Insert a "## Programmatic API Usage" subsection after the Vitest Console Capture section.
  - Include inline JavaScript examples showing: starting capture, generating logs, retrieving and clearing the buffer, and stopping capture.
- root README.md (or USAGE.md):
  - Under a "Usage" or "Console Capture" section, add a brief code snippet and pointer to sandbox/README.md and sandbox/docs/CONSOLE_CAPTURE.md.
- No changes to source code, test files, or package.json dependencies.

# Success Criteria
- README files display the new usage section with correctly formatted code examples.
- Links to detailed documentation in sandbox/docs/CONSOLE_CAPTURE.md are present and valid.
- Documentation changes pass linting and rendering checks.

# Verification
- Manually open sandbox/README.md and confirm the new section renders as expected in Markdown preview.
- Navigate from root README.md (or USAGE.md) to the console capture usage examples and detailed docs without broken links.
- Run npm test to confirm no test regressions.