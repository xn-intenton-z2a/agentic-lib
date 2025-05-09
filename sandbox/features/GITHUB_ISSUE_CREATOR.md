# GITHUB_ISSUE_CREATOR

## Purpose
Enable agentic workflows to open GitHub issues programmatically by exposing a function and CLI flag for creating new issues in a target repository using the GitHub REST API.

## Configuration
- Requires GITHUB_TOKEN environment variable with repository write permissions.

## Specification
1. Source File Changes in src/lib/main.js
   - Import Octokit from @octokit/rest.
   - Export an async function createGitHubIssue that accepts an object with owner, repo, title, and body properties.
   - Instantiate Octokit with auth from GITHUB_TOKEN and call issues.create with provided parameters.
   - Log the created issue number and URL using logInfo.
2. CLI Integration
   - Add a processCreateIssue(args) helper to detect the --create-issue flag.
   - Accept a JSON string argument or separate flags for owner, repo, title, and body.
   - Invoke createGitHubIssue and await completion before exiting.
   - Update main() to call processCreateIssue after digest and before default usage.
3. README Updates in sandbox/README.md
   - Document the --create-issue flag, its expected parameters or JSON payload format, and example usage.
   - Link to the GitHub API reference and usage scenarios for automated workflows.
4. Dependency Updates in package.json
   - Add @octokit/rest as a runtime dependency.

## Tests
- In tests/unit/main.test.js
  - Mock @octokit/rest to simulate issues.create returning a known number and URL.
  - Write a test that calls createGitHubIssue with sample parameters and verifies logInfo is called with the expected message.
- In tests/unit/cli.test.js (new test file under sandbox/tests)
  - Simulate CLI invocation with --create-issue and JSON payload, and verify that the module invokes the issue creator and logs success output.

## Success Criteria
- createGitHubIssue function is exported and usable by external scripts.
- CLI flag --create-issue opens an issue and logs its details.
- Automated tests cover normal and error cases, ensuring safe failure when GITHUB_TOKEN is missing or API call fails.

## Value Proposition
This feature empowers agentic workflows to raise issues automatically for failed checks, code improvements, or suggestions, closing the loop on autonomous repository maintenance.