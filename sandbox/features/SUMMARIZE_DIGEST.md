# Summarize Digest

This feature introduces a new CLI flag --summarize that uses the OpenAI API to generate a human-readable summary of a given SQS digest payload. It enhances the CLI to support agentic summarization of event data.

# Value Proposition
A concise, AI-generated summary helps users quickly understand the content and context of SQS events without reading raw JSON.

# Success Criteria
- CLI accepts --summarize with a JSON file path or literal JSON argument.
- Calls OpenAI createChatCompletion and outputs a clear summary to standard output.
- Logs an error and exits with a non-zero code if the API call fails or returns invalid data.

# Requirements
- Add a summarizeDigest function in src/lib/main.js that calls OpenAI's createChatCompletion with a prompt to summarize the digest.
- Extend the main CLI to process the --summarize flag and route input JSON to summarizeDigest.
- Add vitest tests in sandbox/tests to mock the OpenAI client, verify summarizeDigest behavior, and CLI integration.
- Update the README with usage examples for the --summarize flag and expected output.

# User Scenarios
1. Developer runs agentic-lib --summarize event.json to get a human-readable summary of the SQS digest.
2. CI workflows use the summarization step to document payloads automatically in pull request descriptions or issue comments.

# Verification & Acceptance
- Unit tests mock OpenAI to return a known summary and assert the CLI prints it.
- Integration test reads a sample JSON file and verifies the summary output matches expectations.
- Manual acceptance by running the CLI against a real digest and reviewing the summary.