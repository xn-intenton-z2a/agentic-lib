# Purpose
Provide a unified CLI extension that supports both automated release notes generation and interactive AI-driven queries. This feature consolidates multiple CLI flags into a single, extensible command set to streamline workflows and empower users with AI insights.

# Specification

## CLI Integration
- Detect the following flags in CLI arguments within src/lib/main.js:
  - `--release-notes`: Generate structured markdown release notes based on GitHub commit history.
  - `--ask <prompt>`: Send a custom prompt to the OpenAI Chat API and display the AI response.
- Ensure flags can be used independently or in scripts within CI pipelines.

## Source File Changes in src/lib/main.js
- Add imports for OpenAI client:
  - `import { Configuration, OpenAIApi } from 'openai';`
- Implement `processReleaseNotes(args)` as specified in the existing release notes feature:
  - Fetch most recent Git tag via Octokit
  - Retrieve commits since that tag and classify by Conventional Commits
  - Format into markdown sections and output to stdout
- Implement `processAsk(args)`:
  - Check if `--ask` is present; extract the user prompt following the flag
  - Initialize OpenAI client using `OPENAI_API_KEY` from config
  - Call `createChatCompletion` with a system message and the user prompt
  - Parse the assistant message content and print it to stdout in plain text
  - On errors, call `logError` with context and exit with nonzero code
- Modify `main(args)` to invoke `processAsk` and `processReleaseNotes` early based on detected flags

## Dependency Updates
- Ensure `openai` remains listed in package.json dependencies
- Add `@octokit/rest` if not already present for release notes

## Documentation Updates in sandbox/README.md
- Add sections for:
  - `--release-notes` usage, output format, and CI examples
  - `--ask <prompt>` usage, example invocation, and sample AI response
  - Environment variable requirements: `OPENAI_API_KEY` and `GITHUB_API_BASE_URL`
- Update CLI usage examples to reflect both flags

## Testing
- Create unit tests for `processAsk` in sandbox/tests/askCommand.test.js:
  - Mock `openai` client to simulate a chat response
  - Verify the CLI prints the AI response and handles errors
- Ensure existing release notes tests remain unchanged and pass

# Success Criteria & Verification
- Running `node src/lib/main.js --release-notes` generates valid markdown sections
- Running `node src/lib/main.js --ask "Hello, world"` prints the mocked AI response
- Tests for both commands pass under `npm test`