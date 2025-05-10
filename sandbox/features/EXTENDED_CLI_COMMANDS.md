# Purpose

Extend the unified CLI entrypoint and JSON reporting with:

- Verbose mode for detailed runtime logs
- Discussion summarizer command with build status and test metrics
- A new health-check command to validate connectivity to AWS SQS, GitHub API, and OpenAI API
- Workflow summarizer command to produce concise overviews of GitHub Actions workflows
- Workflow sanitizer command to strip sensitive or extraneous data from workflows for safe bot context

# Specification

## CLI Integration

- Recognize flags:
  - `--verbose` or `-v` to enable runtime verbose mode and include detailed JSON logs
  - `--summarize-discussion` or `-s` followed by a discussion identifier or URL to run the discussion summarizer
  - `--health-check` or `-c` to run a comprehensive service health check
  - `--summarize-workflow` or `-w` followed by a file path or URL of a workflow YAML file
  - `--sanitize-workflow` or `-z` followed by a file path or URL of a workflow YAML file
- Parse flags in this order: verbose flags first, then any one of summarize-discussion, health-check, summarize-workflow, sanitize-workflow, then other commands

## Workflow Sanitizer Implementation

- Add function `sanitizeWorkflowHandler` in `src/lib/main.js`:
  - Accept a path or URL to a GitHub Actions workflow YAML file
  - Fetch content from local filesystem or HTTP(S) endpoint
  - Parse YAML using `js-yaml` and remove or redact:
    - All `env` entries that reference secrets or tokens
    - Any `secrets` sections or `with` parameters named `token`, `password`, or similar
    - Comments and metadata fields not required by `workflow_call`
  - Optionally remove extraneous fields (e.g. `name`, `runs-on`, `concurrency`) leaving only steps and their key actions
  - Output a sanitized YAML string or equivalent JSON structure under `sanitizedWorkflow`

## Workflow Summarizer Implementation

- Add function `summarizeWorkflowHandler` in `src/lib/main.js`:
  - Accept same inputs as sanitizer
  - After sanitization, traverse steps and jobs to extract:
    - Job names
    - Step names and key actions
    - Overall triggers (e.g. push, pull_request)
  - Generate a concise text summary of the high-level workflow structure
  - Format summary as `workflowSummary` in the output JSON
  - Optionally leverage existing summarization utilities to refine narrative

## Output Format

- Both `--sanitize-workflow` and `--summarize-workflow` commands print a JSON object with fields:
  - `sanitizedWorkflow`: string or object (for sanitize)
  - `workflowSummary`: string (for summarize)
  - `verbose`: boolean (if verbose mode enabled)
  - `stats`: object with `callCount` and `uptime` (if stats enabled)

## Dependencies File Changes

- Ensure `js-yaml` is listed as a dependency (already present)
- No new dependencies required for core functionality

## README Updates

- Document usage of new flags:
  npm start -- --sanitize-workflow path/to/workflow.yml
  npm start -- --summarize-workflow https://raw.githubusercontent.com/owner/repo/.github/workflows/ci.yml
- Explain JSON output structure for workflow sanitization and summarization

## Testing and Verification

- Add unit tests for `sanitizeWorkflowHandler` and `summarizeWorkflowHandler` mocking file reads and HTTP fetches:
  - Verify sensitive fields are removed or redacted
  - Verify the summary includes correct job and step listings
- Add end-to-end CLI tests invoking `--sanitize-workflow` and `--summarize-workflow` with sample fixtures:
  - Validate exit codes and JSON schema
  - Confirm verbose and stats flags propagate correctly

# Success Criteria

- Sanitized workflow outputs contain no secrets or comments
- Summaries accurately reflect workflow structure and triggers
- CLI integration works alongside existing commands without conflicts