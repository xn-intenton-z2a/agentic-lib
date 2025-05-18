# EVENT_FILE_INPUT

## Objective & Scope
Support a new CLI option `--event-file <path>` that allows users to supply a JSON file containing a single event or an array of digest objects. The feature will read the file, parse its contents into an SQS event or digest list, and invoke the existing digestLambdaHandler to process the payload as if it came from AWS SQS.

## Value Proposition
- Enables processing of saved event payloads for automated testing, batch replays, and debugging.
- Simplifies local development by allowing users to prepare event fixtures and replay them via CLI without modifying code.

## Success Criteria & Requirements
- Add a function `processEventFile(args)` to detect and handle the `--event-file` flag.
- The CLI should accept `--event-file` followed by a valid file path.
- The feature should read and parse JSON from the file system using fs.
- Support both single event objects and arrays of digest records.
- On parse errors, the CLI should log an error with inline context and exit gracefully.
- After parsing, invoke `digestLambdaHandler` with the constructed event.

## Dependencies & Constraints
- Use the built-in `fs` module for file reading. No new external dependencies.
- Ensure compatibility with ESM imports and Node 20.

## User Scenarios & Examples
- Replay a saved digest fixture:
  agentic-lib --event-file fixtures/digest1.json

- Replay a batch of digests stored in an array:
  agentic-lib --event-file fixtures/multiple-digests.json

## Verification & Acceptance
- Unit tests to cover:
  - Valid file containing a single digest yields a call to digestLambdaHandler with correct event object.
  - Valid file containing an array of digests yields correct SQS event format.
  - Invalid file path produces a logged error and process exit code.
  - Invalid JSON content logs error details and does not throw uncaught exceptions.
- Update README to document the new flag under usage instructions.
