# Purpose
Add a function summarizeTestConsoleOutput to src/lib/main.js and a CLI flag --summarize-tests that reads raw test console output and outputs a structured JSON summary.

# Value Proposition
Provide developers and CI pipelines with a quick, machine-readable summary of test results. This reduces manual parsing of console logs, enables automated reporting, and integrates seamlessly into existing agentic workflows.

# Success Criteria & Requirements
* Define and export function summarizeTestConsoleOutput(output, options?) in src/lib/main.js.
  - Accept a string output containing raw test CLI logs.
  - Accept an optional options object with format field. Supported: "json" (default).
  - Parse the output to count total tests, passed, failed, skipped, and collect error messages.
  - Return an object { total, passed, failed, skipped, errors }.
  - Increment globalThis.callCount by one per invocation.
* Add a CLI helper processSummarizeTests(args) in src/lib/main.js.
  - Detect --summarize-tests flag.
  - Read file path argument after the flag or, if absent, read stdin until end.
  - Call summarizeTestConsoleOutput(rawOutput, { format: 'json' }).
  - Console.log the summary serialized with JSON.stringify(summary, null, 2).
  - Increment globalThis.callCount for the CLI invocation.
  - On errors (file not found or parsing issues), call logError and exit with code 1.
* Modify main(args) to invoke processSummarizeTests before falling back to default output.
* Update README.md under CLI Usage:
  - Document --summarize-tests [path] flag behavior.
  - Provide example invocation and sample JSON output.
* No new dependencies beyond fs/promises for file reading.

# Implementation Details
1. In src/lib/main.js, import fs from "fs/promises" if not already present.
2. Below existing utilities, define:
   async function summarizeTestConsoleOutput(output, options = {}) {
     const format = options.format || "json";
     // Split output into lines and compute counts
     const lines = output.split(/\r?\n/);
     let total = 0, passed = 0, failed = 0, skipped = 0;
     const errors = [];
     for (const line of lines) {
       if (/\bPASS\b/.test(line)) { passed++; total++; }
       else if (/\bFAIL\b/.test(line)) { failed++; total++; }
       else if (/\bSKIP\b/.test(line)) { skipped++; total++; }
       if (/error/i.test(line)) {
         errors.push(line.trim());
       }
     }
     globalThis.callCount++;
     return { total, passed, failed, skipped, errors };
   }
   export summarizeTestConsoleOutput;
3. Define async function processSummarizeTests(args) {
     if (!args.includes("--summarize-tests")) return false;
     const idx = args.indexOf("--summarize-tests");
     let raw;
     if (args[idx + 1] && !args[idx + 1].startsWith("--")) {
       raw = await fs.readFile(args[idx + 1], "utf8");
     } else {
       raw = await new Promise((resolve, reject) => {
         let data = "";
         process.stdin.on("data", chunk => data += chunk);
         process.stdin.on("end", () => resolve(data));
         process.stdin.on("error", reject);
       });
     }
     try {
       const summary = await summarizeTestConsoleOutput(raw, { format: "json" });
       console.log(JSON.stringify(summary, null, 2));
       globalThis.callCount++;
     } catch (err) {
       logError("Failed to summarize test output", err);
       process.exit(1);
     }
     return true;
   }
4. In main(args) before default behavior insert:
     if (await processSummarizeTests(args)) {
       if (VERBOSE_STATS) console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
       return;
     }
5. Update sandbox/README.md under CLI Usage:
   ## Summarize Test Results
   --summarize-tests [path]
     Read test output from file or stdin and print structured JSON summary.
   Example:
     npx @xn-intenton-z2a/agentic-lib --summarize-tests path/to/output.txt
   Sample Output:
     {
       "total": 10,
       "passed": 8,
       "failed": 1,
       "skipped": 1,
       "errors": ["Error: should handle invalid JSON"]
     }
6. Add Vitest unit tests in tests/unit/main.test.js:
   - Mock fs.readFile to return sample output and verify console.log receives correct JSON summary and callCount increments.
   - Mock process.stdin to supply sample logs when no file path is given.
   - Test summarizeTestConsoleOutput with raw string, asserting returned object fields.
   - Test error handling when summarizeTestConsoleOutput throws, verifying logError and process.exit(1).

# Verification & Acceptance
* npm test passes with all new and existing tests.
* summarizeTestConsoleOutput correctly counts test results and captures error lines.
* CLI --summarize-tests flag reads file or stdin and outputs valid JSON.
* globalThis.callCount increments for both programmatic and CLI invocations.
* No new lint or formatting issues introduced.