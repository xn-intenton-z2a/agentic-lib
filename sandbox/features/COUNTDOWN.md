# Overview
The COUNTDOWN feature adds a `--countdown` flag to the sandbox CLI. When invoked, the CLI prints a sequential ASCII art countdown using the figlet dependency.

# Requirements
- Support `--countdown` flag in sandbox CLI invocation.
- Display countdown steps "3", "2", "1", and "Go!" in ASCII art format.
- Use figlet for rendering text.
- Default delay of 1 second between steps, with future extensibility for configurable delays.

# Success Criteria
- Running `npm run sandbox -- --countdown` outputs four distinct ASCII art frames, with a one-second pause between each frame.
- Tests simulate the flag invocation and assert that figlet is called for each step in correct order.

# Testing & Verification
- Extend sandbox/tests/main.test.js to capture and assert ASCII art outputs and timing placeholders.
- Ensure no errors are thrown and output order matches expected countdown.

# Dependencies & Constraints
- Depends on the existing figlet dependency.
- Changes confined to sandbox/source/main.js and sandbox/tests/main.test.js.

# Usage Example
npm run sandbox -- --countdown