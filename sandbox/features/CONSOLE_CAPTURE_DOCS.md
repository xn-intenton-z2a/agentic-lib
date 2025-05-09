# Objective

Enhance the Usage section in sandbox/README.md with comprehensive, runnable examples for the Console Capture Utility so that users can copy and paste a complete workflow without context switching.

# Value Proposition

By embedding a dedicated Usage section in the main README, developers gain immediate insight into how to start, retrieve, clear, and stop console captures with matching expected JSON output. This minimizes friction and boosts adoption of the Console Capture API.

# Scope

- Modify sandbox/README.md under a new top-level heading titled "Usage"
  - Add a subsection "Console Capture Usage" with step-by-step instructions:
    1. Import and start capture
    2. Emit logs and errors
    3. Stop capture and retrieve buffered entries
    4. Clear buffer for fresh cycles
  - Provide full code blocks that demonstrate:
    - startConsoleCapture
    - console.log and console.error calls
    - getCapturedOutput returning timestamped entries
    - clearCapturedOutput usage
    - stopConsoleCapture behavior
  - Show example JSON output arrays with level, timestamp, and message fields.
- Ensure the new Usage section appears immediately after the Quick Start code snippet.

# Requirements

- Examples must match sandbox/source/consoleCapture.js API exactly.
- Sample timestamps must use ISO-8601 format in examples.
- Preserve existing README indentation, code fencing, and style conventions.
- All markdown formatting and linting checks must pass.

# Success Criteria

1. sandbox/README.md contains a "Usage" heading with a "Console Capture Usage" subsection and runnable examples.
2. Developers copying the snippet can run it locally and see logs captured as shown.
3. README formatting and markdown lint checks pass with zero errors.