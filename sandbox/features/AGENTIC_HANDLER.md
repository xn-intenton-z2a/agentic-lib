# Value Proposition

- Enable dynamic control of log verbosity and runtime metrics in agentic workflows directly from the CLI.
- Provide developers and CI pipelines with fine-grained debug output and execution telemetry without manual code changes.

# Success Criteria & Requirements

- In sandbox/source/main.js:
  - Parse `--agentic`, `--verbose`, and `--stats` flags from process.argv at startup.
  - Define constants VERBOSE_MODE and VERBOSE_STATS based on presence of `--verbose` and `--stats` flags.
  - Remove these flags and the `--agentic` flag before invoking processAgentic.
  - Implement an async function processAgentic(args) that:
    - Reads JSON input from stdin for a workflow_call event if no args are passed.
    - Calls agenticLambdaHandler from src/lib/main.js with parsed args.
    - Writes each log entry via logInfo and logs a summary or metrics depending on VERBOSE_STATS.

- In src/lib/main.js:
  - Expose setters or environment variable reads for VERBOSE_MODE and VERBOSE_STATS.
  - In agenticLambdaHandler:
    - When VERBOSE_MODE is true, include detailed context (task names, parameters) in each log entry.
    - Always increment globalThis.callCount for each AI call.
    - Return a summary object containing completed task count and any errors.

- CLI Usage Documentation:
  - Update generateUsage() in both sandbox/source/main.js and src/lib/main.js to list `--agentic`, `--verbose`, and `--stats` options with descriptions.
  - Update sandbox/README.md to show usage examples combining the new flags.

# User Scenarios & Examples

## Agentic Workflow with Verbose Debugging

$ cat event.json | node sandbox/source/main.js --agentic --verbose
Expect detailed AI planning traces with verbose:true in each logged JSON line.

## Agentic Workflow with Runtime Metrics

$ node sandbox/source/main.js --agentic --stats < event.json
Expect a final JSON line summarizing callCount and uptime after execution.

## Combined Debug and Metrics

$ echo '{"body":{"event":"workflow_call"}}' | node sandbox/source/main.js --agentic --verbose --stats
Expect interleaved verbose logs and a concluding telemetry object.

# Verification & Acceptance

- Add sandbox/tests/agentic.flags.test.js:
  - Mock process.argv with `--agentic`, `--verbose`, and `--stats` flags.
  - Stub OpenAI API responses and globalThis.callCount.
  - Assert logInfo outputs include verbose:true when VERBOSE_MODE.
  - Assert console.log outputs metrics JSON when VERBOSE_STATS is true.
- Ensure existing tests for `--mission`, `--help`, `--version`, and `--digest` continue to pass.
- Confirm generateUsage includes the new flags in help output.
