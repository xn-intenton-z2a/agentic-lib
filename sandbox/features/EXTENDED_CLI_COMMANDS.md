# Purpose

Extend the unified CLI entrypoint and JSON test reporting to support verbose mode and add a new discussion summarizer command that includes build status and test metrics.

# Specification

## CLI Integration

- Recognize flags `--verbose` or `-v`. When present, enable runtime verbose mode and include detailed JSON logs with additional fields.
- Introduce a new flag `--summarize-discussion` or `-s` followed by a discussion identifier or URL. When present, pause other commands and run the discussion summarizer.
- Parse flags in order: verbose flags first to set `VERBOSE_MODE` and `VERBOSE_STATS`, then summary or other commands.

## Dynamic Verbose Mode Implementation

- Replace static `VERBOSE_MODE` and `VERBOSE_STATS` constants with variables initialized based on CLI flags.
- Ensure verbose mode applies across help, version, digest, playback, and summarize-discussion commands, producing detailed JSON entries when enabled.

## JSON Test Reporter Integration

- Retain the `test:json:verbose` script to run Vitest with JSON reporter and verbose logging.
- Ensure JSON test output includes per-test debug entries alongside summary metrics.

## Discussion Summarizer Integration

- Implement a new function `summarizeDiscussionHandler` in `main.js`:
  - Use GitHub REST API to fetch discussion metadata, initial post, and comments for the given discussion identifier.
  - Aggregate content and generate a concise summary using existing summarization utilities or a lightweight algorithm.
  - Format summary as a field `discussionSummary` in the output JSON.

## Build Status and Test Metrics Integration

- After fetching discussion content, call GitHub Checks API to retrieve the latest workflow run status for the related branch or commit:
  - Capture status (success, failure, pending), conclusion, timestamp, and duration.
  - Include this under `buildStatus` in the summary JSON.
- Parse the latest JSON test report (from `test:json` output) to extract metrics: total tests, passed, failed, coverage percentage.
  - Include these metrics under `testMetrics` in the summary JSON.

## Output Format

- The `--summarize-discussion` command prints a single JSON object with fields:
  - `discussionSummary`: string
  - `buildStatus`: object
  - `testMetrics`: object
  - `verbose`: boolean (if verbose mode enabled)
  - `stats`: object with `callCount` and `uptime` (if stats enabled)

## Dependencies File Changes

- Add `@octokit/rest` to dependencies for GitHub API integration.
- Under `scripts`, add examples for the `--summarize-discussion` flag usage.

## README Updates

- Document the purpose and usage of the `--summarize-discussion` flag, with examples:
  npm start -- --summarize-discussion 42
- Explain JSON output structure and how build status and test metrics are represented.

## Testing and Verification

- Add unit tests for `summarizeDiscussionHandler` mocking GitHub API responses to verify:
  - Correct fields in summary JSON.
  - Proper handling of missing or malformed discussion identifiers.
- Add end-to-end CLI tests for the `--summarize-discussion` flag with mocked environment:
  - Ensure exit code matches expectations.
  - Validate combined JSON output with build and test metrics.
