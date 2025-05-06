# Purpose
Add a new async function generateReleaseNotes to src/lib/main.js that composes release notes from Git commit history between two references.

# Value Proposition
Automate creation of consistent, formatted release notes by extracting commit messages from a Git repository. This saves manual effort, ensures standardized documentation of changes, and accelerates release preparation.

# Success Criteria & Requirements
* Introduce generateReleaseNotes(fromRef, toRef, options?) exported from src/lib/main.js
* Accept two required string parameters fromRef and toRef representing Git commits, tags, or branches
* Accept an optional options object with format field supporting "markdown" (default) or "json"
* Invoke Git via child_process to run git log --pretty=format:%s from fromRef to toRef
* Parse each commit message into an array of entries
* For markdown format, return a string starting with a heading "## Release Notes" followed by a bullet list of commit messages
* For json format, return an object { commits: ["msg1","msg2",…] }
* Increment globalThis.callCount on each invocation
* Throw descriptive errors and call logError if Git invocation fails or parameters are missing
* No new dependencies beyond Node built-ins

# Implementation Details
1. In src/lib/main.js import exec from "child_process" after existing imports
2. Define async function generateReleaseNotes(fromRef, toRef, options = {}) below existing utilities
   - Validate fromRef and toRef are nonempty strings; on failure throw Error
   - Construct git command: git log fromRef..toRef --pretty=format:%s
   - Use exec to run the command and capture stdout
   - Split stdout by line breaks to collect commit messages
   - Build result: for markdown format, prefix with "## Release Notes" and join messages as "- msg" lines; for json format, return an object
   - Increment globalThis.callCount
3. Export generateReleaseNotes alongside other utilities in main.js
4. In main(args), before fallback behavior add a processReleaseNotes helper:
   - Detect --release-notes flag, parse --from and --to and optional --format arguments
   - Call generateReleaseNotes and console.log output (string or JSON.stringify)
   - Increment callCount for the CLI invocation and return true
5. Update README.md under Programmatic Usage to document generateReleaseNotes API with examples for markdown and JSON
6. Update README.md under CLI Usage to document:
   npx agentic-lib --release-notes --from v1.0.0 --to v1.1.0 [--format json]
   and show sample output
7. Add Vitest unit tests in tests/unit/main.test.js:
   - Mock child_process.exec to return sample commit list and verify markdown and JSON outputs and callCount increments
   - Test missing parameters cause logError and thrown errors
   - Test CLI helper processReleaseNotes parses args correctly, prints output, and exits gracefully

# Verification & Acceptance
* Run npm test to confirm new tests pass and existing tests are unaffected
* Verify generateReleaseNotes returns correct markdown and JSON for sample data
* Confirm CLI --release-notes invocation outputs expected results and increments callCount
* Ensure error handling triggers logError and throws descriptive errors
* Confirm README.md updates render correctly without formatting errors