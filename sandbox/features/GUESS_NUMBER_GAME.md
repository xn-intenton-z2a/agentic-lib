# Objective

Implement an interactive command-line guess the number game that runs in a TTY environment. The game selects a random secret number within a configurable range and prompts the user to guess until they find the correct number. After each guess, the game provides feedback indicating whether the guess is too low or too high, and tracks the total number of attempts.

# Value Proposition

This feature delivers a hands-on example of an interactive CLI tool. It demonstrates how to read from standard input, write to standard output, manage game state, and validate user input. It provides core functionality that showcases user engagement, input validation, and clear feedback loops in a lightweight Node.js script.

# Success Criteria & Requirements

- The game initializes with a secret random number between a minimum and maximum bound (default 1 and 100).
- Users can configure the range via command-line arguments or environment variables.
- The game reads user guesses from stdin and provides feedback:
  - "Too low"
  - "Too high"
  - "Correct!" along with the number of attempts.
- Non-numeric or out-of-range guesses produce a friendly validation message without terminating the game.
- The game gracefully handles TTY termination (Ctrl+C) and exits with a goodbye message.

# Dependencies & Constraints

- Implement logic in a single source file under sandbox/source/guess-game.js.
- Add unit tests in sandbox/tests/guess-game.test.js covering random number generation, feedback logic, and input validation.
- Update README.md in sandbox/ to document usage examples, command-line flags, and environment configuration.
- No additional files outside the sandbox directory may be created.

# User Scenarios & Examples

1. New player launches the game:
   - `node sandbox/source/guess-game.js`
   - See prompt: "Guess a number between 1 and 100:"
   - Player inputs 50, sees "Too high. Try again:"
   - Continues until correct; sees "Congratulations! You guessed the number 73 in 5 attempts."

2. Advanced player sets a custom range:
   - `MIN=10 MAX=20 node sandbox/source/guess-game.js`
   - Prompts: "Guess a number between 10 and 20:" and enforces those bounds.

# Verification & Acceptance

- Manual test: run game in TTY, verify flow matches scenarios.
- Automated tests: run `npm test` and confirm all new tests pass.
- Documentation: verify README.md examples execute without errors.