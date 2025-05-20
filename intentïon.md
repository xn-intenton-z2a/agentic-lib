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

## Issue to enhanced Issue at 2025-05-20T00:19:29.331Z

Updated feature development issue https://github.com/xn-intenton-z2a/agentic-lib/issues/ with enhanced description:

**Summary**

Implement a complete interactive CLI "Guess the Number" game under `sandbox/source/guess-game.js`. The game should initialize with a secret random number, accept and validate user input, provide feedback, track attempts, and handle graceful exits.

**Acceptance Criteria**

1. **Initialization & Configuration**
   - Default minimum and maximum bounds are 1 and 100.
   - Support overriding bounds via:
     - Environment variables: `MIN`, `MAX`.
     - Command-line flags: `--min <number>`, `--max <number>`.
   - Unit test seeds the RNG (e.g., using `seedrandom`) to assert the secret number is within configured bounds.

2. **User Interaction Flow**
   - Prompt: `Guess a number between <min> and <max>:` on startup.
   - On each user input:
     - If non-numeric or out of range, display: `Invalid input. Please enter an integer between <min> and <max>.` and re-prompt without exiting.
     - If valid:
       - If guess < secret: print `Too low. Try again:` and re-prompt.
       - If guess > secret: print `Too high. Try again:` and re-prompt.
       - If guess == secret: print `Congratulations! You guessed the number <secret> in <attempts> attempts.` and exit with code 0.
   - Pressing Ctrl+C prints `Goodbye!` and exits with code 0.

3. **Testing Requirements**
   - Create `sandbox/tests/guess-game.test.js` with unit tests covering:
     1. Secret number generation within bounds for default and custom ranges.
     2. Feedback logic for too low, too high, and correct guesses, including accurate attempt counts.
     3. Handling of invalid inputs (non-numeric, out-of-range) without terminating the game.
     4. Environment variable and flag overrides of bounds.
     5. Graceful exit on Ctrl+C (simulate SIGINT) printing `Goodbye!`.

4. **Documentation**
   - Update `sandbox/README.md` to include:
     - Installation and usage instructions for default and custom ranges.
     - CLI flag examples and environment variable usage.
     - Sample game session transcript demonstrating prompts, feedback, correct guess, and Ctrl+C exit.

5. **Verification**
   - Manual: Run `node sandbox/source/guess-game.js` in a TTY to confirm full game flow matches specs.
   - Automated: `npm test` passes new sandbox tests alongside existing tests.
   - Documentation: Copy-paste examples from `sandbox/README.md` into a terminal to ensure no errors.

LLM API Usage:

```json
{"prompt_tokens":7285,"completion_tokens":1024,"total_tokens":8309,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":384,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Issue to Code at 2025-05-20T00:22:00.529Z

fixApplied: true

Implement interactive Guess the Number CLI game with tests and documentation

Git Diff:

```
diff --git a/sandbox/README.md b/sandbox/README.md
new file mode 100644
index 00000000..d34c9d1c
--- /dev/null
+++ b/sandbox/README.md
@@ -0,0 +1,68 @@
+# agentic-lib Sandbox
+
+This sandbox contains experimental and example code demonstrating features of **agentic-lib**.
+
+## Guess Number Game
+
+An interactive CLI game that prompts you to guess a randomly generated number within a specified range.
+
+### Usage
+
+Run the game with default bounds (1 to 100):
+
+```bash
+node sandbox/source/guess-game.js
+```
+
+Override bounds via command-line flags:
+
+```bash
+node sandbox/source/guess-game.js --min 1 --max 50
+```
+
+Or set environment variables:
+
+```bash
+export MIN=10
+export MAX=20
+node sandbox/source/guess-game.js
+```
+
+### Game Flow
+
+- On startup, you'll see:
+  ```
+  Guess a number between <min> and <max>:
+  ```
+- Enter your guess and press Enter.
+- Feedback:
+  - `Too low. Try again:`
+  - `Too high. Try again:`
+  - `Invalid input. Please enter an integer between <min> and <max>.`
+- On correct guess:
+  ```
+  Congratulations! You guessed the number <secret> in <attempts> attempts.
+  ```
+- Press `Ctrl+C` at any time to exit gracefully:
+  ```
+  Goodbye!
+  ```
+
+### Example Session
+
+```bash
+$ node sandbox/source/guess-game.js --min 1 --max 10
+Guess a number between 1 and 10: 5
+Too low. Try again:
+8
+Too high. Try again:
+7
+Congratulations! You guessed the number 7 in 3 attempts.
+```
+
+## Resources
+
+- Mission: [MISSION.md](../MISSION.md)
+- Contributing: [CONTRIBUTING.md](../CONTRIBUTING.md)
+- License: [LICENSE.md](../LICENSE.md)
+- Repository: [agentic-lib on GitHub](https://github.com/xn-intenton-z2a/agentic-lib)
diff --git a/sandbox/source/guess-game.js b/sandbox/source/guess-game.js
new file mode 100644
index 00000000..f8960708
--- /dev/null
+++ b/sandbox/source/guess-game.js
@@ -0,0 +1,130 @@
+#!/usr/bin/env node
+import readline from 'readline';
+import seedrandom from 'seedrandom';
+import process from 'process';
+
+/**
+ * Parse command-line arguments and environment variables for bounds.
+ */
+export function parseBounds(argv = [], env = {}) {
+  let min = env.MIN ? parseInt(env.MIN, 10) : 1;
+  let max = env.MAX ? parseInt(env.MAX, 10) : 100;
+  for (let i = 0; i < argv.length; i++) {
+    if (argv[i] === '--min' && argv[i + 1] != null) {
+      const val = parseInt(argv[i + 1], 10);
+      if (!isNaN(val)) {
+        min = val;
+      }
+    } else if (argv[i] === '--max' && argv[i + 1] != null) {
+      const val = parseInt(argv[i + 1], 10);
+      if (!isNaN(val)) {
+        max = val;
+      }
+    }
+  }
+  // Swap if bounds are inverted
+  if (min > max) {
+    [min, max] = [max, min];
+  }
+  return { min, max };
+}
+
+/**
+ * Generate the secret number using optional seed for deterministic testing.
+ */
+export function generateSecret(min, max, seed) {
+  const rnd = seed ? seedrandom(seed) : Math.random;
+  return Math.floor(rnd() * (max - min + 1)) + min;
+}
+
+/**
+ * Provide feedback for a given guess.
+ */
+export function getFeedback(secret, guess, min, max) {
+  if (
+    typeof guess !== 'number' ||
+    isNaN(guess) ||
+    !Number.isInteger(guess) ||
+    guess < min ||
+    guess > max
+  ) {
+    return {
+      status: 'invalid',
+      message: `Invalid input. Please enter an integer between ${min} and ${max}.`,
+    };
+  }
+  if (guess < secret) {
+    return { status: 'low', message: 'Too low. Try again:' };
+  }
+  if (guess > secret) {
+    return { status: 'high', message: 'Too high. Try again:' };
+  }
+  return { status: 'correct' };
+}
+
+/**
+ * Build the success message upon correct guess.
+ */
+export function buildCorrectMessage(secret, attempts) {
+  return `Congratulations! You guessed the number ${secret} in ${attempts} attempts.`;
+}
+
+/**
+ * Setup graceful exit on Ctrl+C (SIGINT).
+ */
+export function setupSigintHandler() {
+  process.on('SIGINT', () => {
+    console.log('Goodbye!');
+    process.exit(0);
+  });
+}
+
+/**
+ * Main game loop handling input/output.
+ */
+export async function runGame({
+  input = process.stdin,
+  output = process.stdout,
+  argv = process.argv.slice(2),
+  env = process.env,
+  seed = null,
+} = {}) {
+  setupSigintHandler();
+  const { min, max } = parseBounds(argv, env);
+  const secret = generateSecret(min, max, seed || env.SEED);
+  const rl = readline.createInterface({
+    input,
+    output,
+    prompt: `Guess a number between ${min} and ${max}: `,
+  });
+
+  let attempts = 0;
+  rl.prompt();
+  for await (const line of rl) {
+    attempts++;
+    const guess = Number(line.trim());
+    const feedback = getFeedback(secret, guess, min, max);
+    if (feedback.status === 'invalid') {
+      console.log(feedback.message);
+      rl.prompt();
+    } else if (feedback.status === 'low' || feedback.status === 'high') {
+      console.log(feedback.message);
+      rl.prompt();
+    } else if (feedback.status === 'correct') {
+      console.log(buildCorrectMessage(secret, attempts));
+      rl.close();
+      break;
+    }
+  }
+}
+
+// If executed directly, start the game
+if (
+  import.meta.url === process.argv[1] ||
+  process.argv[1].endsWith('guess-game.js')
+) {
+  runGame().catch((err) => {
+    console.error(err);
+    process.exit(1);
+  });
+}
diff --git a/sandbox/tests/guess-game.test.js b/sandbox/tests/guess-game.test.js
new file mode 100644
index 00000000..c593a144
--- /dev/null
+++ b/sandbox/tests/guess-game.test.js
@@ -0,0 +1,107 @@
+import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
+import process from 'process';
+import {
+  parseBounds,
+  generateSecret,
+  getFeedback,
+  buildCorrectMessage,
+  setupSigintHandler,
+} from '../source/guess-game.js';
+
+describe('parseBounds', () => {
+  test('default bounds', () => {
+    const bounds = parseBounds([], {});
+    expect(bounds).toEqual({ min: 1, max: 100 });
+  });
+
+  test('env bounds', () => {
+    const bounds = parseBounds([], { MIN: '10', MAX: '20' });
+    expect(bounds).toEqual({ min: 10, max: 20 });
+  });
+
+  test('arg bounds override env', () => {
+    const bounds = parseBounds(['--min', '5', '--max', '15'], { MIN: '10', MAX: '20' });
+    expect(bounds).toEqual({ min: 5, max: 15 });
+  });
+
+  test('swaps if min > max', () => {
+    const bounds = parseBounds(['--min', '50', '--max', '10'], {});
+    expect(bounds).toEqual({ min: 10, max: 50 });
+  });
+});
+
+describe('generateSecret', () => {
+  test('within bounds default seed', () => {
+    const secret = generateSecret(1, 5, 'seed');
+    expect(secret).toBeGreaterThanOrEqual(1);
+    expect(secret).toBeLessThanOrEqual(5);
+  });
+
+  test('same seed yields same secret', () => {
+    const s1 = generateSecret(1, 100, 'abc');
+    const s2 = generateSecret(1, 100, 'abc');
+    expect(s1).toEqual(s2);
+  });
+});
+
+describe('getFeedback', () => {
+  const secret = 50;
+  const min = 1;
+  const max = 100;
+
+  test('invalid non-numeric', () => {
+    const fb = getFeedback(secret, NaN, min, max);
+    expect(fb.status).toBe('invalid');
+  });
+
+  test('invalid out of range', () => {
+    const fb = getFeedback(secret, 101, min, max);
+    expect(fb.status).toBe('invalid');
+  });
+
+  test('too low', () => {
+    const fb = getFeedback(secret, 25, min, max);
+    expect(fb.status).toBe('low');
+    expect(fb.message).toBe('Too low. Try again:');
+  });
+
+  test('too high', () => {
+    const fb = getFeedback(secret, 75, min, max);
+    expect(fb.status).toBe('high');
+    expect(fb.message).toBe('Too high. Try again:');
+  });
+
+  test('correct guess', () => {
+    const fb = getFeedback(secret, 50, min, max);
+    expect(fb.status).toBe('correct');
+  });
+});
+
+describe('buildCorrectMessage', () => {
+  test('formats correct message', () => {
+    const msg = buildCorrectMessage(42, 3);
+    expect(msg).toBe('Congratulations! You guessed the number 42 in 3 attempts.');
+  });
+});
+
+describe('SIGINT handler', () => {
+  let exitMock;
+  let logMock;
+
+  beforeAll(() => {
+    exitMock = vi.spyOn(process, 'exit').mockImplementation(() => {});
+    logMock = vi.spyOn(console, 'log').mockImplementation(() => {});
+    setupSigintHandler();
+  });
+
+  afterAll(() => {
+    exitMock.mockRestore();
+    logMock.mockRestore();
+  });
+
+  test('handles SIGINT gracefully', () => {
+    process.emit('SIGINT');
+    expect(logMock).toHaveBeenCalledWith('Goodbye!');
+    expect(exitMock).toHaveBeenCalledWith(0);
+  });
+});
```
mainOutput:
```

> @xn-intenton-z2a/agentic-lib@6.7.7-0 start
> node src/lib/main.js

{"level":"info","timestamp":"2025-05-20T00:21:34.449Z","message":"Configuration loaded","config":{}}
No command argument supplied.

Usage:
  --help                     Show this help message and usage instructions.
  --digest                   Run a full bucket replay simulating an SQS event.
  --version                  Show version information with current timestamp.

```
[for issue https://github.com/xn-intenton-z2a/agentic-lib/issues/1539 with title: ""]

LLM API Usage:

```json
{"prompt_tokens":9328,"completion_tokens":8669,"total_tokens":17997,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":5888,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

