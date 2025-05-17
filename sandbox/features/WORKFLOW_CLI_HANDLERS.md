# Workflow and CLI Handlers

## Objective & Scope
- Consolidate handling of GitHub Actions input events into unified handlers.
- Support both workflow_call and workflow_dispatch events via workflowCallHandler and workflowDispatchHandler.
- Introduce a new CLI flag --mission to output the project mission statement (contents of MISSION.md) and halt CLI processing.

## Value Proposition
- Simplifies integration with GitHub Actions by providing consistent event handlers for workflow inputs.
- Enables users to view and verify the project mission directly from the CLI without inspecting files.
- Reduces duplication by unifying logic for event handling and CLI flag processing in a single module.

## Specification
- In src/lib/main.js:
  - Maintain exports of async functions workflowCallHandler(event) and workflowDispatchHandler(event).
  - Both handlers expect an event object with an inputs object ({ key: string, value: string, lastModified: ISO string }).
  - Validate inputs using Zod; on failure, log error and throw.
  - Construct SQS event payload via createSQSEventFromDigest and invoke digestLambdaHandler, returning its response.
  - Implement new async function processMission(args) that:
    - Checks if args includes "--mission".
    - Reads MISSION.md from the project root using fs.readFile.
    - Prints the raw contents to stdout.
    - Returns true to indicate the flag was handled.
  - In main(args):
    - Call processMission(args) before processHelp.
    - If processMission returns true, skip further processing and exit normally.
- Tests:
  - In tests/unit/main.test.js:
    - Add tests for processMission:
      - When called with ["--mission"], it reads MISSION.md and logs its content exactly.
      - Ensure processMission returns true and main terminates early.
    - Verify existing workflowCallHandler and workflowDispatchHandler tests remain passing.
  - In sandbox/tests/cli-mission.test.js:
    - Simulate invoking main(["--mission"]) and assert stdout contains the first line of MISSION.md.
- Documentation:
  - Update README.md under CLI Usage to include:
    --mission    Show project mission statement contents of MISSION.md.
  - Provide example:
    agentic-lib --mission

## Verification & Acceptance
- Unit tests cover valid and invalid inputs for both workflows and mission flag behavior.
- README updated with new CLI reference and usage example.
- Manual acceptance by running:
  node src/lib/main.js --mission
  node src/lib/main.js --digest
  node src/lib/main.js --help
