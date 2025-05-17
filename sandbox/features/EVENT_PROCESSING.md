# Objective & Scope
Extend the library to support core event simulation and replay via CLI as well as collecting automated discussion statistics from GitHub issues or discussions. Provide a reliable foundation for SQS event handling, command-line interaction, and on-demand analysis of repository discussions.

# Value Proposition
- Quickly simulate SQS digest events locally for debugging and development workflows
- Standardized CLI interface for help, version info, event replay, and discussion statistics
- Automated retrieval and computation of discussion metrics, enabling teams to gain insights into conversation activity without manual effort
- Consistent JSON logging for observability and downstream processing

# Success Criteria & Requirements

## Event Handler
- createSQSEventFromDigest: generate a valid AWS SQS Records array from a digest object
- digestLambdaHandler: process SQS event records, parse JSON bodies, log info, collect and return batchItemFailures

## GitHub Discussion Statistics
- fetchDiscussionComments(input): accept a discussion URL or numeric ID, retrieve all comments via GitHub API using configured base URL and authentication token
- analyzeDiscussionStatistics(comments): compute total comment count, unique author count, average comment length, and optional sentiment summary by invoking OpenAI API

## CLI Commands
- --help: display usage instructions and exit
- --version: read package.json version and timestamp, output as JSON
- --digest: simulate a sample SQS digest event using createSQSEventFromDigest and dispatch to digestLambdaHandler
- --stats <discussion-url|id>: fetch comments for the given discussion or issue, run analyzeDiscussionStatistics, and output structured JSON with metrics
- Fallback behavior: display message and usage when no valid command is supplied

# Testability & Stability
- Unit tests for createSQSEventFromDigest, digestLambdaHandler, fetchDiscussionComments, and analyzeDiscussionStatistics, including error handling for network failures or invalid input
- Integration tests for CLI commands: help, version, digest, and stats flags
- Mock GitHub API and OpenAI responses to validate metrics computation and error paths
- Ensure globalThis.callCount is reset and verified in tests when applicable

# Dependencies & Constraints
- Node 20 and ESM module standard
- Use built-in fetch for HTTP requests; no additional external libraries beyond existing dependencies (zod, dotenv, openai)
- CLI entrypoint in src/lib/main.js, no new files required
- Configurable via environment variables: GITHUB_API_BASE_URL and OPENAI_API_KEY

# User Scenarios & Examples
- View help: node src/lib/main.js --help
- Check version: node src/lib/main.js --version
- Replay SQS digest: node src/lib/main.js --digest
- Generate discussion stats by ID: node src/lib/main.js --stats 123
- Generate discussion stats by URL: node src/lib/main.js --stats https://github.com/owner/repo/discussions/456

# Verification & Acceptance
- npm test passes all tests for handler functions, discussion utilities, and CLI commands
- Structured JSON logs and stats output emitted on stdout matching defined schema
- No unhandled exceptions or process crashes during CLI invocation