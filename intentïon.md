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

