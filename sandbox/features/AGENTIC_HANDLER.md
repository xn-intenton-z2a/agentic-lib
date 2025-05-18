# Value Proposition

- Enable dynamic control of log verbosity and runtime metrics in agentic workflows using CLI flags.
- Provide developers with fine-grained debug information and execution telemetry without manual code changes.

# Success Criteria & Requirements

- Update sandbox/source/main.js to parse `--verbose` and `--stats` flags before handling `--agentic`:
  - Introduce constants VERBOSE_MODE and VERBOSE_STATS set based on presence of flags in process.argv.
  - Ensure flags are removed from args passed to processAgentic.
- In sandbox/source/main.js `processAgentic(args)`:
  - Honor VERBOSE_MODE to include verbose field in each logInfo output.
  - After agenticLambdaHandler completes, if VERBOSE_STATS is true, print JSON line containing callCount and uptime.
- Update src/lib/main.js:
  - Expose global setters or read environment variables for VERBOSE_MODE and VERBOSE_STATS for use in agenticLambdaHandler.
  - In agenticLambdaHandler, when VERBOSE_MODE is true, include detailed task context in each log entry.
  - Return summary of completed tasks; stats output remains in CLI layer.
- Modify generateUsage() in both sandbox and core to document `--verbose` and `--stats` flags alongside existing options.
- Update sandbox/README.md to show examples using `--verbose` and `--stats` with `--agentic`.

# User Scenarios & Examples

## Verbose Debugging
$ node sandbox/source/main.js --agentic --verbose
Expect each log entry to include a verbose flag indicating rich debug context.

## Runtime Metrics
$ node sandbox/source/main.js --agentic --stats
Expect a final JSON line after execution:
{"callCount": 5, "uptime": 0.123}

## Combined Usage
$ echo '{"body":{"event":"workflow_call"}}' \
  | node sandbox/source/main.js --agentic --verbose --stats
Expect detailed AI planning traces and a concluding metrics object.

# Verification & Acceptance

- Write sandbox/tests/agentic.flags.test.js:
  - Mock process.argv with verbose and stats flags, stub OpenAI response.
  - Assert logInfo outputs include verbose:true when VERBOSE_MODE.
  - Assert final console.log outputs correct metrics when VERBOSE_STATS.
- Ensure existing tests for mission, help, version, and digest still pass without regression.
- Confirm generateUsage output includes new flags in help text.