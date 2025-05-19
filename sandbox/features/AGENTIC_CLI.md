# Value Proposition
Extend the existing CLI entry points in both sandbox and library to include GitHub issue management commands in addition to the AWS and OpenAI capabilities. This empowers users to inspect, create, and close GitHub issues directly from the CLI, streamlining repository maintenance and automated workflows.

# Success Criteria & Requirements

## 1. Existing AWS & OpenAI Commands
- Retain all previously defined flags: --invoke-lambda, --simulate-s3, --summarize, --refine with existing behavior, validations, and logging.

## 2. New --list-issues Flag
- Recognize flag --list-issues [--repo <owner/repo>] [--state <open|closed|all>]
- Default to the repository defined by environment variable GITHUB_API_BASE_URL or fallback to origin remote if not provided.
- Require GITHUB_TOKEN; if missing, call logError and exit non-zero.
- Fetch issues via GitHub REST API at <GITHUB_API_BASE_URL>/repos/{owner}/{repo}/issues?state={state}
- Parse JSON response and for each issue logInfo with id, title, state, and url.

## 3. New --create-issue Flag
- Recognize flag --create-issue --repo <owner/repo> --title <title> [--body <bodyFile>]
- Read issue body from file or default to empty string.
- Require GITHUB_TOKEN; on missing token call logError and exit non-zero.
- Send POST to <GITHUB_API_BASE_URL>/repos/{owner}/{repo}/issues with JSON payload { title, body }.
- On success logInfo with created issue number and URL. On failure logError with response status and message.

## 4. New --close-issue Flag
- Recognize flag --close-issue --repo <owner/repo> --issue-number <number>
- Require GITHUB_TOKEN; on missing token call logError and exit non-zero.
- Send PATCH to <GITHUB_API_BASE_URL>/repos/{owner}/{repo}/issues/{number} with { state: "closed" }.
- On success logInfo with confirmation, on failure logError.

## 5. Usage Documentation
- Update generateUsage in both src/lib/main.js and sandbox/source/main.js to include:
    --list-issues [--repo "owner/repo"] [--state "open|closed|all"]
    --create-issue --repo "owner/repo" --title "Issue title" [--body "bodyFile"]
    --close-issue --repo "owner/repo" --issue-number <number>
- Update README.md and sandbox/README.md with examples for listing, creating, and closing issues.

## 6. Tests Coverage
- Add or update unit tests to cover:
  - Missing or invalid GITHUB_TOKEN scenarios for each new flag.
  - Successful and failure HTTP responses mocked for list, create, close commands.
  - CLI dispatch logic correctly routes to GitHub handlers.
  - Logging behavior for both info and error cases.

## 7. Dependencies & Constraints
- Leverage existing dependencies: node-fetch (if already present) or native fetch, dotenv for token loading.
- No new external packages beyond those already permitted in package.json.
- Maintain ESM compatibility and Node >=20 support.
- Changes limited to source, test, README, and package.json if strictly necessary for fetch polyfill.
