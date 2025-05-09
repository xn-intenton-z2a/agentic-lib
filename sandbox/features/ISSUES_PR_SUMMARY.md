# Objective
Add a new CLI command `--summary` that retrieves and summarizes open GitHub issues and pull requests for the current repository, outputting a JSON report with counts and item lists.

# Value Proposition
This feature enables maintainers and automation workflows to quickly inspect repository health by programmatically generating a concise summary of outstanding issues and PRs. It reduces manual navigation, supports monitoring, and can be integrated into dashboards or CI checks for proactive project management.

# Scope
- Modify `src/lib/main.js`
  - Add an import for `Octokit` from `@octokit/rest`.
  - Extend `generateUsage()` to include `--summary` with description.
  - Implement a new helper `async function processSummary(args)` that:
    - Checks for `--summary` flag.
    - Reads `GITHUB_OWNER` and `GITHUB_REPO` from environment.
    - Instantiates `Octokit` with `config.GITHUB_API_BASE_URL` and authorization from `OPENAI_API_KEY` or a new `GITHUB_TOKEN` env var.
    - Fetches lists of open issues and open pull requests.
    - Logs a JSON summary object:
      ```json
      {
        "issuesCount": number,
        "prsCount": number,
        "items": [
          { "type": "issue" | "pr", "number": number, "title": string, "url": string },
          ...
        ]
      }
      ```
  - Update `main()` to invoke `processSummary(args)` before fallback usage.
- Update `package.json`
  - Add dependency: `@octokit/rest` with a compatible version.
- Add unit tests in `tests/unit/main.summary.test.js`
  - Mock `Octokit` methods to return fixtures for issues and PRs.
  - Verify that `processSummary` returns true and logs the expected summary JSON.
- Update `sandbox/README.md`
  - Document `--summary` usage, required env vars (`GITHUB_OWNER`, `GITHUB_REPO`, optionally `GITHUB_TOKEN`).
  - Provide an example command invocation and sample output.

# Requirements
- Use `@octokit/rest` for GitHub API calls.
- Honor `config.GITHUB_API_BASE_URL` for GitHub Enterprise support.
- Allow authentication via `GITHUB_TOKEN` environment variable.
- Ensure CLI usage output includes the new flag in help text.
- Tests must mock network calls and not perform real API requests.

# Success Criteria
- Running `node src/lib/main.js --summary` outputs a valid JSON report to stdout.
- New tests pass under `npm test` without external network access.
- README clearly explains how to set env vars and interpret output.
- Linting and formatting checks pass.

# Verification
1. Set environment:
   ```bash
   export GITHUB_OWNER=yourOrg
   export GITHUB_REPO=yourRepo
   export GITHUB_TOKEN=token123
   ```
2. Run:
   ```bash
   node src/lib/main.js --summary
   ```
3. Confirm JSON includes correct counts and items array.
4. Execute `npm test` to ensure unit tests for summary functionality succeed.
