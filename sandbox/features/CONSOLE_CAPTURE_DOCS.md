# Console Capture Documentation in README

# Objective
Add comprehensive examples and step-by-step instructions for the Console Capture Utility directly in the sandbox README to improve discoverability and reduce context switching for users.

# Value Proposition
Embedding usage snippets and expected outputs in the main README enables new users to quickly understand and adopt the console capture API without navigating to external docs, speeding onboarding and reducing friction.

# Scope
- Modify sandbox/README.md under the Core Utilities section:
  - In the Console Capture entry, add a code block showing:
    - startConsoleCapture, console.log('message'), stopConsoleCapture, getCapturedOutput, clearCapturedOutput.
  - Include an example of the buffered output array with sample timestamped entries.
  - Show how to enable Vitest integration using VITEST_CONSOLE_CAPTURE and reference the setup file.

# Requirements
- Examples must match the API signatures exactly as implemented in sandbox/source/consoleCapture.js.
- Output examples should illustrate JSON entries with level, timestamp, and message fields.
- Maintain existing README formatting conventions, code fencing, and indentation.

# Success Criteria
1. The sandbox/README.md file contains a complete usage example for console capture, including code blocks and expected output.
2. Users copying the example can run it and verify logs are captured as shown.
3. README linter and formatting checks pass with no errors.