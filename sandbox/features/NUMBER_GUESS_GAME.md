# Objective
Implement a console-based interactive number guessing game in the sandbox environment. The game selects a random integer in a predefined range, accepts user guesses through the command line, and provides feedback until the correct number is guessed.

# Scope
- Modify the sandbox/source/main.js to implement the game loop using Node’s built-in readline module.
- Enhance sandbox/tests/main.test.js to simulate user input sequences and verify console output for key game events.
- Update sandbox/README.md to document how to run and play the game.
- No additional files will be created; only the source, test, and README files will be updated.

# Value Proposition
- Provides an engaging, interactive console experience directly aligned with the mission statement.
- Demonstrates real user-facing functionality within the sandbox environment.
- Offers a clear, self-contained example of CLI input/output handling for future sandbox features.

# Requirements & Success Criteria
- On launch, display a welcome message and instructions specifying the guessing range (default 1 to 100).
- Randomly select an integer between the configured lower and upper bounds.
- Prompt the user for a numeric guess on each iteration.
- Provide incremental feedback: "Too low", "Too high", or "Correct!" after each guess.
- Maintain and display an attempt counter when the user guesses correctly.
- Exit gracefully after a correct guess.
- All core logic must be covered by automated tests that mock stdin and capture stdout.

# Dependencies & Constraints
- Use only Node.js built-in modules (readline, process, console).
- Avoid introducing new third-party dependencies.
- Ensure compatibility with Node 20 and ESM standards.

# User Scenarios & Examples
- Scenario: User guesses 50, receives "Too high", then guesses 30, receives "Too low", then guesses 42, receives "Correct! You found the number in 3 attempts."
- Example CLI invocation: `npm run sandbox` or `node sandbox/source/main.js`

# Verification & Acceptance
- Unit tests simulate a sequence of guesses ending in success and assert the correct messages are output in order.
- Manual acceptance: Run the game locally, play until success, and observe correct console behaviour.
- Code review ensures adherence to coding standards and test coverage.