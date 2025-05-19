# Value Proposition
Extend CLI entry points in both sandbox and core CLIs to provide AWS Lambda invocation, S3 simulation and OpenAI summarization and refinement workflows alongside GitHub issue management commands. This empowers users to orchestrate cloud functions, generate text insights, and manage issues from a single interface, streamlining automation in GitHub workflows.

# Success Criteria & Requirements

## 1. Existing AWS & OpenAI Commands
- Retain flags --invoke-lambda, --simulate-s3, --summarize, --refine with existing behavior, validations, and logging.
- --invoke-lambda dispatches to AWS Lambda client with function name and payload.
- --simulate-s3 reads digest fixtures and simulates SQS events via S3-to-SQS bridge utilities.
- --summarize and --refine call OpenAI chat completion with provided prompt, parse JSON response, and output messages.

## 2. GitHub Issue Management

### --list-issues [--repo <owner/repo>] [--state <open|closed|all>]
- Default repo from GITHUB_REPOSITORY environment or origin remote if not provided.
- Require GITHUB_TOKEN and GITHUB_API_BASE_URL; if missing logError and exit non-zero.
- Perform GET request to /repos/{owner}/{repo}/issues with given state and parse response.
- For each issue logInfo with id, title, state, and url.

### --create-issue --repo <owner/repo> --title <title> [--body <bodyFile>]
- Read issue body from file or default to empty string.
- Require GITHUB_TOKEN; on missing token logError and exit non-zero.
- Perform POST to /repos/{owner}/{repo}/issues with JSON payload { title, body }.
- On success logInfo with created issue number and URL; on failure logError with status and message.

### --close-issue --repo <owner/repo> --issue-number <number>
- Require GITHUB_TOKEN; if missing logError and exit non-zero.
- Perform PATCH to /repos/{owner}/{repo}/issues/{number} with { state: "closed" }.
- On success logInfo with confirmation; on failure logError with response details.

# Usage Documentation
- Update generateUsage in sandbox/source/main.js and src/lib/main.js to list new flags and usage patterns.
- Update sandbox/README.md, README.md, and sandbox/docs/USAGE.md with examples for listing, creating, and closing issues, and AWS/OpenAI commands.

# Tests Coverage
- Add or update unit tests to cover missing or invalid GITHUB_TOKEN for each new flag.
- Mock successful and failed HTTP responses for list, create, and close commands.
- Test CLI dispatch logic correctly routes flags to GitHub, AWS, and OpenAI handlers.
- Verify logInfo and logError output for both info and error scenarios.

# Dependencies & Constraints
- Leverage existing native fetch or node-fetch and dotenv for environment loading.
- Do not introduce new external packages beyond current dependencies.
- Maintain ESM compatibility and support Node >=20.
- Limit changes to source files, test files, README files, and package.json if needed for fetch polyfill.