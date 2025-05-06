# Purpose
Add a new async function dispatchRepositoryEvent to src/lib/main.js that triggers GitHub Actions workflows via repository dispatch events on a repository.

# Value Proposition
Enable agentic workflows to invoke custom workflow_call handlers or repository dispatch–based workflows programmatically. By sending repository_dispatch events, automated systems can orchestrate multi-step pipelines, trigger downstream workflows, and integrate external signals without manual steps.

# Success Criteria & Requirements
* Expose an exported async function dispatchRepositoryEvent(owner, repo, eventType, clientPayload?, options?) in src/lib/main.js
* Require owner, repo, and eventType parameters; throw descriptive errors for missing or invalid arguments
* Load GITHUB_TOKEN from config and include Authorization header with Bearer token
* Build request URL from config.GITHUB_API_BASE_URL/repos/owner/repo/dispatches
* Send POST request with JSON body containing event_type and optional client_payload object
* On HTTP status 204 return true and increment globalThis.callCount
* On non-204 status call logError with context and throw an error including status code and response text

# Implementation Details
1. Update configSchema.parse to require GITHUB_TOKEN as a nonempty string
2. In src/lib/main.js after existing utilities define async function dispatchRepositoryEvent(owner, repo, eventType, clientPayload = {}, options = {})
   - logInfo at start with eventType and target repository
   - Validate parameters and throw on missing values
   - Construct URL `${config.GITHUB_API_BASE_URL}/repos/${owner}/${repo}/dispatches`
   - Prepare headers including Authorization and Content-Type application/json
   - Call fetch with method POST and JSON stringified body `{ event_type: eventType, client_payload: clientPayload }`
   - If response.status is 204 increment globalThis.callCount and return true
   - Otherwise call logError with the response and throw descriptive error
3. Export dispatchRepositoryEvent alongside other utility functions
4. Add a CLI helper function processDispatchEvent(args) that:
   - Checks args.includes("--dispatch-event")
   - Parses --owner, --repo, --event-type, and optional --payload-json or file path
   - Reads and parses JSON from argument or file when needed
   - Invokes dispatchRepositoryEvent and console.log a confirmation message
   - Returns true on handled flag or calls logError and exits with code 1 on missing parameters
5. In main(args) before other GitHub CLI commands, insert if (await processDispatchEvent(args)) { if (VERBOSE_STATS) console.log stats; return; }
6. Update README.md under API Usage and CLI Usage to document dispatchRepositoryEvent and new --dispatch-event flag with examples for JSON payload input and file input
7. Add Vitest unit tests in tests/unit/main.test.js mocking global fetch to verify:
   - Successful POST returns true and increments callCount
   - Missing parameters throw errors and do not change callCount
   - Non-204 response causes logError and thrown error
   - CLI invocation with valid flags triggers dispatch and prints confirmation

# Verification & Acceptance
* Unit tests cover success, missing args, and error scenarios for dispatchRepositoryEvent
* CLI tests confirm correct parsing, dispatch invocation, and exit codes
* Run npm test to verify all tests pass and no regressions are introduced
* Confirm documentation examples work when executed interactively