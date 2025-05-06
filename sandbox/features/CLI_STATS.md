# Purpose
Add a new CLI command --stats to src/lib/main.js that generates and prints a JSON summary of repository metrics including uptime, callCount, commitCount, and fileCount.

# Value Proposition
Offer users a quick, machine-readable summary of key repository metrics directly from the CLI, facilitating monitoring, reporting, and integration into CI/CD pipelines without external tooling.

# Success Criteria & Requirements
* Introduce function generateStatsSummary(options?) exported from src/lib/main.js
  - Returns an object { uptime, callCount, commitCount, fileCount }
  - uptime: process.uptime() in seconds
  - callCount: globalThis.callCount
  - commitCount: number of commits via git rev-list --count HEAD
  - fileCount: total number of files in the repository (recursively counted)
* Add CLI helper processStats(args) in src/lib/main.js
  - Detects --stats flag
  - Invokes generateStatsSummary and prints JSON.stringify(summary, null, 2)
  - Increments callCount for the CLI invocation
  - Returns true when handled, false otherwise
* Update main(args) to call processStats before existing handlers
* Update README.md under CLI Usage to document --stats with example invocation and sample JSON output
* Add Vitest tests in tests/unit/main.test.js mocking child_process and fs to verify metrics and CLI behavior
* No new dependencies beyond Node built-ins (fs/promises, path, child_process)

# Implementation Details
1. In src/lib/main.js import fs from "fs/promises" and execSync from "child_process".
2. Define async function generateStatsSummary(options = {}) below existing utilities:
   - Compute uptime via process.uptime()
   - Read globalThis.callCount
   - Compute commitCount by executing execSync('git rev-list --count HEAD').toString().trim()
   - Recursively traverse the repository root to count files using fs.readdir and fs.stat
   - Return metrics object
3. Define async function processStats(args) that:
   - If args includes "--stats":
     * Call generateStatsSummary
     * console.log JSON.stringify(summary, null, 2)
     * Increment globalThis.callCount
     * Return true
   - Otherwise return false
   - On errors, call logError and process.exit(1)
4. In main(args), before help/version/digest handlers insert:
   if (await processStats(args)) { if (VERBOSE_STATS) console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() })); return; }
5. Modify README.md under "CLI Usage" to add:
   --stats
     Print repository metrics summary as JSON
   Example:
     npx @xn-intenton-z2a/agentic-lib --stats
   Sample Output:
     {
       "uptime": 12.34,
       "callCount": 3,
       "commitCount": 42,
       "fileCount": 128
     }
6. Add Vitest tests in tests/unit/main.test.js:
   - Mock execSync to return a known commit count
   - Mock fs.readdir and fs.stat to simulate a fixed file structure
   - Test generateStatsSummary returns expected values
   - Test processStats prints JSON on flag and increments callCount
   - Test error path in git command triggers logError and exit code 1

# Verification & Acceptance
* Run npm test to confirm new tests pass and existing tests remain unaffected
* Verify generateStatsSummary returns correct metrics with mocked dependencies
* Confirm --stats flag prints formatted JSON and increments callCount
* Validate error handling logs errors and exits with code 1 on failures
* Ensure README.md updates render correctly without formatting issues