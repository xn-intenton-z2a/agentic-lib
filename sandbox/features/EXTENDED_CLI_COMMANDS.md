# Purpose

Extend the unified CLI entrypoint and JSON test reporting with:

- Verbose mode for detailed runtime logs
- Discussion summarizer command with build status and test metrics
- A new health-check command to validate connectivity to AWS SQS, GitHub API, and OpenAI API

# Specification

## CLI Integration

- Recognize flags:
  - `--verbose` or `-v` to enable runtime verbose mode and include detailed JSON logs
  - `--summarize-discussion` or `-s` followed by a discussion identifier or URL to pause other commands and run the discussion summarizer
  - `--health-check` or `-c` to pause other commands and run a comprehensive service health check
- Parse flags in order: verbose flags first, then summarizer or health-check, then other commands

## Dynamic Verbose Mode Implementation

- Replace static `VERBOSE_MODE` and `VERBOSE_STATS` constants with variables initialized based on CLI flags
- Ensure verbose mode applies across help, version, digest, summarize-discussion, and health-check commands, producing detailed JSON entries when enabled

## JSON Test Reporter Integration

- Retain the `test:json:verbose` script to run Vitest with JSON reporter and verbose logging
- Ensure JSON test output includes per-test debug entries alongside summary metrics

## Discussion Summarizer Integration

- Add function `summarizeDiscussionHandler` in `src/lib/main.js`:
  - Use `@octokit/rest` to fetch discussion metadata, initial post, and comments for the given identifier
  - Aggregate content and generate a concise summary using existing summarization utilities or a lightweight algorithm
  - Format summary as `discussionSummary` in the output JSON
- After fetching discussion content, retrieve the latest workflow run via GitHub Checks API and parse the latest JSON test report to include under `buildStatus` and `testMetrics`

## Health Check Integration

- Add function `healthCheckHandler` in `src/lib/main.js`:
  - Validate SQS integration by simulating a queue operation or listing queues via AWS SDK
  - Validate GitHub API connectivity by requesting the API root or rate limit endpoint via `@octokit/rest`
  - Validate OpenAI API connectivity by sending a lightweight test request using `openai` client
  - Measure response status, latency, and capture any error messages per service
  - Aggregate results into a `healthStatus` object

## Output Format

- The `--summarize-discussion` command prints a JSON object with fields:
  - `discussionSummary`: string
  - `buildStatus`: object
  - `testMetrics`: object
  - `verbose`: boolean (if verbose mode enabled)
  - `stats`: object with `callCount` and `uptime` (if stats enabled)
- The `--health-check` command prints a JSON object with field `healthStatus`, containing per-service status, latency, and error message if any

## Dependencies File Changes

- Add `@octokit/rest` to dependencies for GitHub API integration
- Add or ensure existing `openai` and AWS SDK dependencies cover health-check requirements
- Under `scripts`, add usage examples for the `--health-check` flag

## README Updates

- Document usage of new `--health-check` flag:
  npm start -- --health-check
- Explain JSON output structure for health status, discussion summary, build status, and test metrics

## Testing and Verification

- Add unit tests for `summarizeDiscussionHandler` and `healthCheckHandler` mocking GitHub, AWS, and OpenAI API responses to verify:
  - Correct fields in summary and health JSON
  - Proper handling of missing credentials or unreachable services
- Add end-to-end CLI tests for `--summarize-discussion` and `--health-check` flags with mocked environments:
  - Ensure exit codes match expectations
  - Validate combined JSON output structure and field accuracy