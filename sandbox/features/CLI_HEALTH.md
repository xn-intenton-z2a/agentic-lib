# Purpose
Add a new CLI flag --health to src/lib/main.js that prints a concise, human-readable repository status summary including version, uptime, call count, commit count, and file count.

# Value Proposition
Provide an easy way for users and CI pipelines to perform a quick health check of the library without parsing JSON. A human-readable summary speeds up diagnostics, improves visibility into repository metrics, and complements the existing --stats JSON output.

# Success Criteria & Requirements
* Export function generateHealthSummary(options?) from src/lib/main.js
  - Returns a multi-line string with labeled lines for Version, Uptime (in seconds), Call Count, Commit Count, and File Count
  - Accepts an optional options object to include or exclude individual metrics sections
* Implement async CLI helper function processHealth(args) in src/lib/main.js
  - Detects presence of --health in args
  - Calls generateHealthSummary() to obtain the summary string
  - console.log the summary string to stdout
  - Increments globalThis.callCount exactly once for the CLI invocation
  - Returns true when flag is handled, false otherwise
* Update main(args) sequence to invoke processHealth before existing handlers (version, stats, digest)
* Update README.md under CLI Usage to document --health flag with example invocation and sample output
* Add Vitest tests in tests/unit/main.test.js
  - Mock underlying metric functions (or generateStatsSummary) to return known values and verify generateHealthSummary formats accordingly
  - Test that processHealth prints the correct summary, increments callCount, and returns true when --health is supplied
  - Test that processHealth returns false and does nothing when --health is absent

# Implementation Details
1. In src/lib/main.js import or reuse generateStatsSummary
2. Define function generateHealthSummary(options = {}) below existing utilities:
   • Call generateStatsSummary() to get metrics object { uptime, callCount, commitCount, fileCount }
   • Read version from package.json via fs.readFileSync or dynamic import
   • Build a string with one labeled line per metric, e.g.:
     Version: 6.2.1-0
     Uptime: 12.34s
     Call Count: 3
     Commit Count: 42
     File Count: 128
   • Respect options flags to omit sections if requested
   • Return the composed string
3. Define async function processHealth(args) in the CLI helper block:
   • If args.includes("--health"):
     - Call generateHealthSummary()
     - console.log the returned summary
     - Increment globalThis.callCount
     - Return true
   • Else return false
4. In main(args), before processVersion and processDigest insert:
   if (await processHealth(args)) { return; }
5. Update README.md under "CLI Usage" to add:
  --health
    Print human-readable repository health summary
  Example:
    npx @xn-intenton-z2a/agentic-lib --health
  Sample Output:
    Version: 6.2.1-0
    Uptime: 12.34s
    Call Count: 3
    Commit Count: 42
    File Count: 128
6. Add Vitest tests in tests/unit/main.test.js:
   • Mock generateStatsSummary to return fixed metrics and mock version value
   • Verify generateHealthSummary returns correctly formatted lines
   • Spy on console.log and globalThis.callCount to ensure processHealth behaves as specified

# Verification & Acceptance
* Run npm test to confirm new tests pass and existing tests remain unaffected
* Confirm that invoking --health prints the expected summary and increments callCount
* Validate that omitting --health leaves other CLI flags and default behavior unchanged
* Ensure no new lint or formatting errors are introduced