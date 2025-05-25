Create a console based i-am-thinking-of-a-number game. as mentioned in reply Create a console based i-am-thinking-of-a-number game.
## Maintain Feature at 2025-05-25T01:41:37.965Z

Maintained feature .

Feature spec:



Git diff:

```diff

```

LLM API Usage:

```json

```
---

## Maintain Feature at 2025-05-25T01:42:17.773Z

Maintained feature NUMBER_GUESS_GAME.

Feature spec:

# Objective
Implement a fully interactive console-based number guessing game with configurable range and clear user guidance.

# Scope
- Modify sandbox/source/main.js to implement the game loop using Node’s built-in readline module.
- Accept optional CLI flags `--min` and `--max` to configure the guessing range (defaults 1 to 100).
- Track and display the number of attempts taken once the user guesses correctly.
- Enhance sandbox/tests/main.test.js to simulate user input sequences covering typical and edge cases, validating prompt text and feedback messages.
- Update sandbox/README.md to document installation, CLI usage (including flags), game instructions, and example sessions.
- Do not add or delete files; only source, tests, and README will be updated.

# Value Proposition
- Delivers a self-contained, engaging CLI experience demonstrating input parsing, I/O handling, and control flow.
- Provides a clear example of configurable command-line tools in Node.js following ESM standards.
- Lays foundation for future sandbox features by showcasing testing patterns for interactive CLI applications.

# Requirements & Success Criteria
- On launch, display a welcome message, instructions, and the current guessing range.
- Correctly parse and validate numeric `--min` and `--max` flags; handle invalid ranges with an error message and exit code 1.
- Randomly select an integer between the inclusive lower and upper bounds.
- Prompt the user repeatedly until the correct number is entered, providing feedback: "Too low", "Too high", or "Correct!".
- Upon correct guess, display "Congratulations! You guessed the number in X attempts." and exit gracefully.
- All core logic must be covered by automated tests mocking stdin/stdout.

# Dependencies & Constraints
- Use only Node.js built-in modules (`readline`, `process`, `console`).
- Maintain compatibility with Node 20 and ESM standards.
- Avoid introducing new third-party dependencies.

# User Scenarios & Examples
- Scenario: `node sandbox/source/main.js --min 10 --max 20` displays "Guess a number between 10 and 20".
- Scenario: User guesses 15 ("Too low"), then 18 ("Too high"), then 17 ("Correct! Congratulations! You guessed the number in 3 attempts.").

# Verification & Acceptance
- Unit tests simulate a sequence of out-of-range, invalid, and valid guesses asserting correct prompts and exit behavior.
- Manual acceptance: run `npm run sandbox -- --min 1 --max 5`, play the game, and verify prompt text, feedback messages, attempt counter, and exit code.
- Code review checks adherence to coding standards, test coverage, and documentation completeness.

Git diff:

```diff

```

LLM API Usage:

```json
{"prompt_tokens":6570,"completion_tokens":1587,"total_tokens":8157,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":960,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Maintain Feature at 2025-05-25T01:42:20.853Z

Maintained feature NUMBER_GUESS_GAME.

Feature spec:

# Objective
Extend the existing console-based number guessing game to allow players to configure the guessing range through command-line flags, while preserving core gameplay and feedback mechanics.

# Scope
- Modify sandbox/source/main.js to parse two new optional flags: --min and --max.
- Default the lower bound to 1 and the upper bound to 100 when flags are omitted.
- Validate that both flags are integers and that min is strictly less than max; provide an error message and exit if validation fails.
- Adjust the game loop to use the configured range when selecting the secret number and when instructing the user on valid guesses.
- Enhance sandbox/tests/main.test.js to simulate game sessions with default and custom ranges, including invalid flag scenarios.
- Update sandbox/README.md to document the new flags, usage examples, and expected behavior.

# Value Proposition
- Empowers users to control game difficulty by setting a custom number range.
- Demonstrates robust CLI argument parsing and error handling in a minimal sandbox environment.
- Reinforces best practices for default values and input validation in Node-based CLI tools.

# Requirements & Success Criteria
- The CLI accepts --min and --max flags followed by integer values.
- When flags are omitted, the game functions exactly as before with range 1 to 100.
- If a flag value is missing, non-numeric, or if min is >= max, display a clear usage error and exit with a non-zero status.
- On successful launch, display a welcome message indicating the active range (e.g., "Guess a number between X and Y").
- Maintain feedback messages: "Too low", "Too high", "Correct!" and track the number of attempts.
- All new functionality is covered by automated tests that mock stdin, capture stdout, and assert exit codes for invalid flag usage.

# Dependencies & Constraints
- Use only Node.js built-in modules (process.argv, readline, console).
- No additional third-party dependencies may be introduced.
- Maintain compatibility with Node 20 and ESM standards.

# User Scenarios & Examples
- Default range: node sandbox/source/main.js
  Welcome to Number Guess! Guess a number between 1 and 100.
- Custom range: node sandbox/source/main.js --min 10 --max 20
  Welcome to Number Guess! Guess a number between 10 and 20.
- Invalid flags: node sandbox/source/main.js --min 50 --max 10
  Error: Invalid range. Ensure min (50) is less than max (10).

# Verification & Acceptance
- Tests simulate a correct-guess session for default range and for a custom range of [5, 7].
- Tests assert that invalid flag combinations output appropriate error messages and exit with status code 1.
- Manual acceptance: Run the game locally with and without flags, verify instructional messages match the configured range, confirm gameplay functions normally.

Git diff:

```diff
diff --git a/sandbox/features/NUMBER_GUESS_GAME.md b/sandbox/features/NUMBER_GUESS_GAME.md
index 5c67ccd0..9f90d4e4 100644
--- a/sandbox/features/NUMBER_GUESS_GAME.md
+++ b/sandbox/features/NUMBER_GUESS_GAME.md
@@ -1,36 +1,41 @@
 # Objective
-Implement a console-based interactive number guessing game in the sandbox environment. The game selects a random integer in a predefined range, accepts user guesses through the command line, and provides feedback until the correct number is guessed.
+Extend the existing console-based number guessing game to allow players to configure the guessing range through command-line flags, while preserving core gameplay and feedback mechanics.
 
 # Scope
-- Modify the sandbox/source/main.js to implement the game loop using Node’s built-in readline module.
-- Enhance sandbox/tests/main.test.js to simulate user input sequences and verify console output for key game events.
-- Update sandbox/README.md to document how to run and play the game.
-- No additional files will be created; only the source, test, and README files will be updated.
+- Modify sandbox/source/main.js to parse two new optional flags: --min and --max.
+- Default the lower bound to 1 and the upper bound to 100 when flags are omitted.
+- Validate that both flags are integers and that min is strictly less than max; provide an error message and exit if validation fails.
+- Adjust the game loop to use the configured range when selecting the secret number and when instructing the user on valid guesses.
+- Enhance sandbox/tests/main.test.js to simulate game sessions with default and custom ranges, including invalid flag scenarios.
+- Update sandbox/README.md to document the new flags, usage examples, and expected behavior.
 
 # Value Proposition
-- Provides an engaging, interactive console experience directly aligned with the mission statement.
-- Demonstrates real user-facing functionality within the sandbox environment.
-- Offers a clear, self-contained example of CLI input/output handling for future sandbox features.
+- Empowers users to control game difficulty by setting a custom number range.
+- Demonstrates robust CLI argument parsing and error handling in a minimal sandbox environment.
+- Reinforces best practices for default values and input validation in Node-based CLI tools.
 
 # Requirements & Success Criteria
-- On launch, display a welcome message and instructions specifying the guessing range (default 1 to 100).
-- Randomly select an integer between the configured lower and upper bounds.
-- Prompt the user for a numeric guess on each iteration.
-- Provide incremental feedback: "Too low", "Too high", or "Correct!" after each guess.
-- Maintain and display an attempt counter when the user guesses correctly.
-- Exit gracefully after a correct guess.
-- All core logic must be covered by automated tests that mock stdin and capture stdout.
+- The CLI accepts --min and --max flags followed by integer values.
+- When flags are omitted, the game functions exactly as before with range 1 to 100.
+- If a flag value is missing, non-numeric, or if min is >= max, display a clear usage error and exit with a non-zero status.
+- On successful launch, display a welcome message indicating the active range (e.g., "Guess a number between X and Y").
+- Maintain feedback messages: "Too low", "Too high", "Correct!" and track the number of attempts.
+- All new functionality is covered by automated tests that mock stdin, capture stdout, and assert exit codes for invalid flag usage.
 
 # Dependencies & Constraints
-- Use only Node.js built-in modules (readline, process, console).
-- Avoid introducing new third-party dependencies.
-- Ensure compatibility with Node 20 and ESM standards.
+- Use only Node.js built-in modules (process.argv, readline, console).
+- No additional third-party dependencies may be introduced.
+- Maintain compatibility with Node 20 and ESM standards.
 
 # User Scenarios & Examples
-- Scenario: User guesses 50, receives "Too high", then guesses 30, receives "Too low", then guesses 42, receives "Correct! You found the number in 3 attempts."
-- Example CLI invocation: `npm run sandbox` or `node sandbox/source/main.js`
+- Default range: node sandbox/source/main.js
+  Welcome to Number Guess! Guess a number between 1 and 100.
+- Custom range: node sandbox/source/main.js --min 10 --max 20
+  Welcome to Number Guess! Guess a number between 10 and 20.
+- Invalid flags: node sandbox/source/main.js --min 50 --max 10
+  Error: Invalid range. Ensure min (50) is less than max (10).
 
 # Verification & Acceptance
-- Unit tests simulate a sequence of guesses ending in success and assert the correct messages are output in order.
-- Manual acceptance: Run the game locally, play until success, and observe correct console behaviour.
-- Code review ensures adherence to coding standards and test coverage.
\ No newline at end of file
+- Tests simulate a correct-guess session for default range and for a custom range of [5, 7].
+- Tests assert that invalid flag combinations output appropriate error messages and exit with status code 1.
+- Manual acceptance: Run the game locally with and without flags, verify instructional messages match the configured range, confirm gameplay functions normally.
\ No newline at end of file
```

LLM API Usage:

```json
{"prompt_tokens":6570,"completion_tokens":1937,"total_tokens":8507,"prompt_tokens_details":{"cached_tokens":6528,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1280,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

