# Objective
Capture and display console output generated during test execution to improve debugging and visibility

# Scope
Intercept console methods in test environment  Collect logs per test and integrate with test reporter

# Requirements
- Provide a CLI flag or environment variable to enable console output capture
- Automatically patch console methods in test setup without modifying source
- Include captured logs under each test result in Vitest output
- Support log levels info warn error and include timestamp

# Success Criteria
- Running tests with capture enabled shows console logs grouped by test
- Captured output includes timestamp level and message

# Design
Use test setup file to override console methods and store entries in an array  Attach a Vitest hook after each test to print stored logs  Reset storage before each test  Maintain performance impact minimal

# Testing and Verification
Add unit tests that emit logs inside source functions  Verify captured logs appear when capture is enabled  Verify capture disabled by default  Log entries formatted as JSON lines with timestamp level and message