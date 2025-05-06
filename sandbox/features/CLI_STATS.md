# Purpose
Add a new CLI flag --stats to src/lib/main.js that prints a machine-readable summary of repository and runtime metrics as JSON.

# Value Proposition
Provide users and automation systems with a quick, unified, and scriptable way to retrieve key metrics—uptime, call count, commit count, and file count—directly from the CLI, simplifying monitoring, reporting, and integration into CI/CD pipelines.

# Success Criteria & Requirements
* Export an async function generateStatsSummary(options?) from src/lib/main.js that returns an object with:
  - uptime: number of seconds from process.uptime()
  - callCount: globalThis.callCount value
  - commitCount: result of running git rev-list --count HEAD
  - fileCount: total number of files in the repository counted recursively
* Add a CLI helper async function processStats(args) in src/lib/main.js that:
  - Detects the presence of --stats in args
  - Calls generateStatsSummary()
  - Prints JSON.stringify(summary, null, 2) to standard output
  - Increments globalThis.callCount exactly once for the CLI invocation
  - Returns true when --stats is handled, false otherwise
* Integrate processStats into main(args) before existing handlers (help, version, digest) so that --stats takes priority
* On error (for example, git command failure or file system access error), call logError and exit with code 1
* No new dependencies beyond Node built-ins (fs/promises, child_process)

# Implementation Details
1. At the top of src/lib/main.js import execSync from child_process and fs from fs/promises
2. Beneath existing utilities, define:
   async function generateStatsSummary(options = {}) {
     // uptime via process.uptime()
     // callCount from globalThis.callCount
     // commitCount via execSync('git rev-list --count HEAD')
     // fileCount by recursively traversing the project root with fs.readdir and fs.stat
     // Return an object { uptime, callCount, commitCount, fileCount }
   }
3. Define:
   async function processStats(args) {
     if args includes --stats then
       const summary = await generateStatsSummary()
       console.log(JSON.stringify(summary, null, 2))
       globalThis.callCount++
       return true
     return false
   }
4. In main(args), insert at the very top:
   if await processStats(args) then return
5. Update README.md under CLI Usage to document:
   --stats
     Print JSON summary of uptime, callCount, commitCount, and fileCount
   Example:
     npx agentic-lib --stats
   Sample Output:
     {
       "uptime": 12.34,
       "callCount": 3,
       "commitCount": 42,
       "fileCount": 128
     }
6. Add Vitest tests in tests/unit/main.test.js that:
   - Mock execSync to return a known commit count string
   - Mock fs.readdir and fs.stat to simulate a fixed file hierarchy and count
   - Verify generateStatsSummary returns expected values
   - Spy on console.log and globalThis.callCount for processStats when --stats is supplied
   - Test that missing git or fs errors trigger logError and exit code 1

# Verification & Acceptance
* Run npm test to ensure new tests pass and no existing tests fail
* Manually invoke npx agentic-lib --stats and confirm correct JSON output and callCount increment
* Confirm code style, linting, and formatting remain consistent