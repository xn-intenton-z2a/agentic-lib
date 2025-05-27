Mission [Implement a `--countdown` flag that displays an ASCII art countdown (3, 2, 1, Go!) using figlet in the sandbox CLI] as mentioned in reply [Hello @Antony-at-Polycode,

Great idea! Let’s reset the sandbox CLI with a fresh mission to implement a fun ASCII art countdown timer. We’ll add a new `--countdown` flag that, when invoked via `npm run sandbox -- --countdown`, uses our existing `figlet` dependency to display:

  3
  2
  1
  Go!

This will give us a visual, text-based demo of sequential ASCII art output. I’m seeding the repository now with this mission so we have a clean foundation for the countdown feature. After seeding, you can run the new countdown and we’ll iterate on timing, formatting, or extra options as needed.

Proceeding with reseed now!]
## Seed repository activity at 2025-05-27T02:22:27.815Z

When responding to a post on url https://github.com/xn-intenton-z2a/agentic-lib/discussions/1636#discussioncomment-13277521, the repository was seeded with mission:

Mission [Implement a `--countdown` flag that displays an ASCII art countdown (3, 2, 1, Go!) using figlet in the sandbox CLI] as mentioned in reply [Hello @Antony-at-Polycode,

Great idea! Let’s reset the sandbox CLI with a fresh mission to implement a fun ASCII art countdown timer. We’ll add a new `--countdown` flag that, when invoked via `npm run sandbox -- --countdown`, uses our existing `figlet` dependency to display:

  3
  2
  1
  Go!

This will give us a visual, text-based demo of sequential ASCII art output. I’m seeding the repository now with this mission so we have a clean foundation for the countdown feature. After seeding, you can run the new countdown and we’ll iterate on timing, formatting, or extra options as needed.

Proceeding with reseed now!]

and outcome "success"

LLM API Usage:

---


## Maintain Feature at 2025-05-27T02:24:31.381Z

Activity:

Maintained feature COUNTDOWN with

Feature spec:

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


LLM API Usage:
```json
{"prompt_tokens":6715,"completion_tokens":1434,"total_tokens":8149,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1152,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```

---
## Feature to Issue at 2025-05-27T02:25:26.055Z

Activity:

Generated issue 1669 for feature "countdown" with URL https://github.com/xn-intenton-z2a/agentic-lib/issues/1669

title:

Implement --countdown flag with ASCII art countdown in sandbox CLI

And description:

## Objectives
Add a `--countdown` flag to the sandbox CLI (`sandbox/source/main.js`) that displays a 3, 2, 1, Go! ASCII art countdown using the existing `figlet` dependency.

## Changes to Apply

1. **Update sandbox/source/main.js**
   - Import `figlet` and `util.promisify`:
     ```js
     import figlet from 'figlet';
     import { promisify } from 'util';
     const renderText = promisify(figlet);
     ```
   - Before the default path in the `main(args)` function, detect `--countdown`:
     ```js
     if (args.includes('--countdown')) {
       await runCountdown();
       return;
     }
     ```
   - Implement an `async function runCountdown()` that:
     - Defines steps: `['3', '2', '1', 'Go!']`.
     - Loops over each step, calls `renderText(step)` to get ASCII art, `console.log()` it, then `await new Promise(r => setTimeout(r, 1000));`.
   - Ensure this runs only when invoked via `npm run sandbox -- --countdown`.

2. **Extend sandbox/tests/main.test.js**
   - Mock `figlet` so that `renderText()` returns a placeholder ASCII string like `<ART 3>`, `<ART 2>`, etc.
   - Use Vitest fake timers (`vi.useFakeTimers()`) to advance the clock by 1000ms per step.
   - Capture console output and assert:
     - That `renderText` was called with `3`, `2`, `1`, `Go!` in order.
     - That each corresponding `<ART X>` was printed to stdout in the correct sequence, with delays simulated by advancing timers.

3. **Update sandbox/README.md**
   - Add a section under **Usage**:
     ```markdown
     ## Countdown Flag
     Run an ASCII art countdown:
     ```bash
     npm run sandbox -- --countdown
     ```
     Displays "3", "2", "1", and "Go!" in ASCII art with a 1s pause between each.
     ```

## Verification Steps

1. Run `npm install` (figlet is already a dependency).
2. Execute `npm run sandbox -- --countdown` and confirm you see 4 ASCII frames: “3”, “2”, “1”, “Go!” with ~1s pauses.
3. Run `npm test` to ensure the new countdown tests in `sandbox/tests/main.test.js` pass and that no existing tests break.

This single PR will modify only the source, test, and README files to fulfill the COUNTDOWN feature requirements.

LLM API Usage:
```json
{"prompt_tokens":7456,"completion_tokens":1110,"total_tokens":8566,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":448,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```

---