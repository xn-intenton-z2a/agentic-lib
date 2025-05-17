# Workflow and CLI Handlers

## Objective & Scope

- Consolidate handling of GitHub Actions input events into unified handlers.
- Support both workflow_call and workflow_dispatch events via workflowCallHandler and workflowDispatchHandler.
- Introduce CLI flags to streamline user interactions:
  - --mission to output the project mission statement and exit.
  - --stats to output runtime statistics (callCount and uptime) and exit.

## Value Proposition

- Simplifies integration with GitHub Actions by providing consistent event handlers for workflow inputs.
- Enables users to view and verify the project mission directly from the CLI without inspecting files.
- Provides transparent runtime metrics for diagnostics and monitoring via a simple CLI flag.
- Reduces duplication by unifying logic for event handling and CLI flag processing in a single module.

## Specification

- In src/lib/main.js:
  - Maintain exports of async functions workflowCallHandler(event) and workflowDispatchHandler(event).
  - Both handlers expect an event object with an inputs object ({ key: string, value: string, lastModified: ISO string }).
  - Validate inputs using Zod; on failure, log error and throw.
  - Construct SQS event payload via createSQSEventFromDigest and invoke digestLambdaHandler, returning its response.
  - Existing async functions:
    - processMission(args): handles "--mission" flag by reading MISSION.md and printing its raw contents; returns true when handled.
    - processVersion(args): handles "--version" flag by reading package.json and printing version and timestamp as JSON; returns true when handled.
    - processDigest(args): handles "--digest" flag by constructing example digest, invoking digestLambdaHandler, and returning true when handled.
  - Implement new async function processStats(args):
    - Checks if args includes "--stats".
    - Constructs a JSON object with keys callCount (globalThis.callCount) and uptime (process.uptime()).
    - Prints the JSON object to stdout.
    - Returns true to indicate the flag was handled.
  - In main(args):
    - Sequentially invoke processMission, processHelp, processVersion, processDigest, and processStats.
    - After each flag handler, if it returns true, skip further processing and exit normally.
    - Default case: print "No command argument supplied." and show usage.

- Tests:
  - In tests/unit/main.test.js:
    - Add tests for processStats:
      - When called with ["--stats"], ensure processStats returns true and stdout contains a JSON object with numeric callCount and uptime keys.
    - Ensure existing tests for workflowCallHandler, workflowDispatchHandler, processMission, processVersion, and processDigest remain passing.
  - No additional test files added; expand coverage in existing suite.

- Documentation:
  - Update sandbox/README.md under CLI Usage to include:
      --stats    Show runtime statistics including callCount and uptime.
  - Provide example:
      agentic-lib --stats

## Verification & Acceptance

- Unit tests cover valid and invalid inputs for both workflows, mission flag, version flag, digest flag, and stats flag behavior.
- README updated with new CLI reference and usage example.
- Manual acceptance by running:
    node src/lib/main.js --stats
    node src/lib/main.js --mission
    node src/lib/main.js --digest
    node src/lib/main.js --help
    node src/lib/main.js --version