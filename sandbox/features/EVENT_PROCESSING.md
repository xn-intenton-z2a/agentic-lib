# Objective & Scope
Extend the library to support core event simulation and replay via CLI as well as version and help commands. Provide a reliable foundation for SQS event handling and command-line interaction.

# Value Proposition
- Quickly simulate SQS digest events locally for debugging and development workflows
- Standardized CLI interface for help, version info, and event replay
- Consistent logging format with structured JSON output for observability

# Success Criteria & Requirements

## Event Handler
- createSQSEventFromDigest: generate a valid AWS SQS Records array from a digest object
- digestLambdaHandler: process SQS event records, parse JSON bodies, log info, collect and return batchItemFailures

## CLI Commands
- --help: display usage instructions and exit
- --version: read package.json version and timestamp, output as JSON
- --digest: simulate a sample SQS digest event using createSQSEventFromDigest and dispatch to digestLambdaHandler
- Fallback behavior: display message and usage when no valid command is supplied

# Testability & Stability
- Unit tests for createSQSEventFromDigest and digestLambdaHandler, including error handling for invalid JSON
- Integration tests for CLI commands: help, version, and digest simulation
- Ensure globalThis.callCount is reset and verified in tests

# Dependencies & Constraints
- Node 20 and ESM module standard
- No additional external libraries beyond existing dependencies (zod, dotenv)
- CLI entrypoint in src/lib/main.js, no new files required

# User Scenarios & Examples
- View help: node src/lib/main.js --help
- Check version: node src/lib/main.js --version
- Replay SQS digest: node src/lib/main.js --digest

# Verification & Acceptance
- npm test passes all tests for handler functions and CLI commands
- Structured logs emitted on stdout and stderr matching JSON schema
- No unhandled exceptions or process crashes during CLI invocation