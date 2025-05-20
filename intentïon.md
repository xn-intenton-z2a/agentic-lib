# Mission Statement

**agentic‑lib** Is a JavaScript library which can be used as a drop in JS implementation or wholesale replacement for 
the steps, jobs, and re-usable workflows below in this repository. It is designed to be used in a GitHub Actions 
workflow to enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate
through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be
invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.
2025-05-20T00:17:36Z - Archiving intentïon to branch https://github.com/xn-intenton-z2a/agentic-lib/tree/intention-2025-05-20T00-17Z

## Maintain Feature at 2025-05-20T00:17:51.085Z

Maintained feature GUESS_NUMBER_GAME.

Git diff:

```
diff --git a/sandbox/features/FEATURE.md b/sandbox/features/FEATURE.md
deleted file mode 100644
index 218b352f..00000000
--- a/sandbox/features/FEATURE.md
+++ /dev/null
@@ -1 +0,0 @@
-Create a tty based guess a number game.
diff --git a/sandbox/features/GUESS_NUMBER_GAME.md b/sandbox/features/GUESS_NUMBER_GAME.md
new file mode 100644
index 00000000..7c57b2f1
--- /dev/null
+++ b/sandbox/features/GUESS_NUMBER_GAME.md
@@ -0,0 +1,43 @@
+# Objective
+
+Implement an interactive command-line guess the number game that runs in a TTY environment. The game selects a random secret number within a configurable range and prompts the user to guess until they find the correct number. After each guess, the game provides feedback indicating whether the guess is too low or too high, and tracks the total number of attempts.
+
+# Value Proposition
+
+This feature delivers a hands-on example of an interactive CLI tool. It demonstrates how to read from standard input, write to standard output, manage game state, and validate user input. It provides core functionality that showcases user engagement, input validation, and clear feedback loops in a lightweight Node.js script.
+
+# Success Criteria & Requirements
+
+- The game initializes with a secret random number between a minimum and maximum bound (default 1 and 100).
+- Users can configure the range via command-line arguments or environment variables.
+- The game reads user guesses from stdin and provides feedback:
+  - "Too low"
+  - "Too high"
+  - "Correct!" along with the number of attempts.
+- Non-numeric or out-of-range guesses produce a friendly validation message without terminating the game.
+- The game gracefully handles TTY termination (Ctrl+C) and exits with a goodbye message.
+
+# Dependencies & Constraints
+
+- Implement logic in a single source file under sandbox/source/guess-game.js.
+- Add unit tests in sandbox/tests/guess-game.test.js covering random number generation, feedback logic, and input validation.
+- Update README.md in sandbox/ to document usage examples, command-line flags, and environment configuration.
+- No additional files outside the sandbox directory may be created.
+
+# User Scenarios & Examples
+
+1. New player launches the game:
+   - `node sandbox/source/guess-game.js`
+   - See prompt: "Guess a number between 1 and 100:"
+   - Player inputs 50, sees "Too high. Try again:"
+   - Continues until correct; sees "Congratulations! You guessed the number 73 in 5 attempts."
+
+2. Advanced player sets a custom range:
+   - `MIN=10 MAX=20 node sandbox/source/guess-game.js`
+   - Prompts: "Guess a number between 10 and 20:" and enforces those bounds.
+
+# Verification & Acceptance
+
+- Manual test: run game in TTY, verify flow matches scenarios.
+- Automated tests: run `npm test` and confirm all new tests pass.
+- Documentation: verify README.md examples execute without errors.
\ No newline at end of file
```

LLM API Usage:

```json
{"prompt_tokens":6126,"completion_tokens":1412,"total_tokens":7538,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":832,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Feature to Issue at 2025-05-20T00:18:45.249Z

Generated feature development issue https://github.com/xn-intenton-z2a/agentic-lib/issues/1539 with title:

Implement GUESS_NUMBER_GAME: Interactive CLI number-guessing game

And description:

Summary:

Implement a complete interactive "Guess the Number" CLI game under sandbox that initializes a random secret number, accepts user input, provides feedback, and tracks attempts until the user guesses correctly.

Tasks:

1. Update sandbox/source/guess-game.js:
   - Parse minimum and maximum bounds from environment variables (MIN, MAX) or command-line flags (--min, --max), defaulting to 1 and 100.
   - Generate a secret integer within [min, max] (using Math.random or seedrandom).
   - Display prompt: `Guess a number between <min> and <max>:` and read each line from stdin.
   - Validate input: if non-numeric or out of range, print a friendly message and re-prompt without exiting.
   - After each valid guess, print `Too low. Try again.`, `Too high. Try again.`, or `Correct! You guessed <secret> in <attempts> attempts.` and exit on correct guess.
   - Gracefully handle TTY termination (Ctrl+C) by printing `Goodbye!` before exiting.

2. Add tests in sandbox/tests/guess-game.test.js:
   - Unit tests for random number generation within bounds.
   - Feedback logic tests for low, high, and correct cases, including attempt count.
   - Validation tests for non-numeric and out-of-range inputs.
   - Environment variable and flag override tests for custom ranges.

3. Update sandbox/README.md:
   - Document installation and usage:
     • Default range: `node sandbox/source/guess-game.js`
     • Custom range via flags: `node sandbox/source/guess-game.js --min 10 --max 20`
     • Custom range via env vars: `MIN=10 MAX=20 node sandbox/source/guess-game.js`
   - Show sample game session output and explain exit behavior on correct guess and Ctrl+C.

Verification:

- Running `node sandbox/source/guess-game.js` in a TTY should match the user scenarios in the feature spec.
- `npm test` should pass all new sandbox tests alongside existing tests.
- README examples should run without errors when copied into the terminal.

LLM API Usage:

```json
{"prompt_tokens":6891,"completion_tokens":1153,"total_tokens":8044,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":640,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

