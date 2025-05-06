# Purpose
Add a new CLI flag --issues to the agentic-lib main script to fetch and display GitHub repository issues directly from the command line.

# Value Proposition
Provide a simple command-line interface for users and automated workflows to list issues without writing code. This enhances transparency and allows quick inspection of issue data in agentic workflows.

# Success Criteria & Requirements
* Detect the --issues flag in main CLI arguments alongside --owner and --repo flags.
* Require both --owner and --repo parameters; if missing, logError with descriptive message and exit with code 1.
* Import fetchRepoIssues from src/lib/main.js and invoke it with owner and repo values.
* On successful fetch, increment globalThis.callCount and output the JSON array of issues to stdout.
* On fetch error, catch the exception, call logError with context, and exit with non-zero status.
* Maintain existing CLI behavior; add VERBOSE_STATS output after --issues when flag is set.
* No additional dependencies beyond those declared.

# Implementation Details
1. In src/lib/main.js, after processDigest, define async function processIssues(args) that:
   - Checks for args.includes("--issues").
   - Parses owner and repo by locating indexOf("--owner") and indexOf("--repo"), reading the next array elements as values.
   - Validates presence of both values, logging an error and returning true to short-circuit if missing.
   - Uses logInfo to announce start and calls fetchRepoIssues(owner, repo).
   - Prints JSON.stringify(issues, null, 2) to console.
   - Returns true to signal that the flag was handled.
2. In main(args) before final usage fallback, call if (await processIssues(args)) { if (VERBOSE_STATS) print stats; return; }
3. At top of file add import { fetchRepoIssues } from "./main.js" or appropriate path.
4. Update README.md under CLI Usage to document:
   - --issues --owner <owner> --repo <repo>
   - Sample invocation and output snippet.
5. Add Vitest tests in tests/unit/main.test.js:
   - Mock fetchRepoIssues to return an array and verify console.log output and callCount increment.
   - Test missing owner or repo parameters logs error and process.exit is called.

# Verification & Acceptance
* Write unit tests for successful invocation producing valid JSON output.
* Write tests for missing parameters and fetch errors.
* Confirm globalThis.callCount increments only on successful fetch.
* Run npm test to ensure no regressions in existing tests.