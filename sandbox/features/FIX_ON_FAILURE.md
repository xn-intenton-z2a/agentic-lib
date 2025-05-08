# Objective
Enable the CLI to detect a failed build or test invocation and automatically dispatch an apply-fix workflow to GitHub, with user-configurable build command support.

# Value Proposition
When local or CI builds fail, developers often spend time manually investigating and filing issues. With this feature, the CLI can detect failures, run a user-defined fix command or default test command, and dispatch a repository dispatch event to trigger an automated apply-fix workflow. This reduces manual intervention, speeds up recovery, and ensures consistent handling of broken pipelines.

# Scope
- Add a --fix-on-failure flag to the CLI.
- Add an optional --fix-command <shell command> parameter to override the default build/test command.
- Implement failure detection logic and repository dispatch integration in src/lib/main.js.
- Update generateUsage to document both --fix-on-failure and --fix-command.
- Extend unit tests in tests/unit/main.test.js to verify behavior with default and custom commands.
- Update sandbox/README.md and root README.md with usage examples, environment setup, and note on fix-command.
- Update package.json dependencies to include @actions/github and @actions/core.

# Requirements
- package.json:
  - Add dependencies @actions/github and @actions/core.

- src/lib/main.js:
  - processFixOnFailure(args):
    - If args includes --fix-on-failure:
      - Read optional fixCommand value following --fix-command; default to npm test if not provided.
      - Execute the chosen command via child_process.execSync.
      - On non-zero exit code, instantiate GitHub client using GITHUB_TOKEN and GITHUB_API_BASE_URL.
      - Send a repositoryDispatch event named apply-fix to the current repository.
      - Log a JSON entry including level, timestamp, executed command, exit status, and dispatch status.
      - Return true to halt further CLI processing.
  - Parse CLI arguments in main() to extract fixCommand when present.
  - Update generateUsage() to include:
    --fix-on-failure              Detect build failure and dispatch apply-fix.
    --fix-command <command>       Override the default build/test command.

- tests/unit/main.test.js:
  - Mock child_process.execSync to simulate both passing and failing exit codes with default and custom commands.
  - Mock @actions/github client to verify repositoryDispatch payload and ensure correct event name and repository data.
  - Assert that no dispatch occurs on success and dispatch occurs only on failure.

- README files:
  - Under Usage, document:
    npm run start -- --fix-on-failure [--fix-command "npm run build"]
    Explain requirement for GITHUB_TOKEN and optional GITHUB_API_BASE_URL.

# Success Criteria
- generateUsage output lists both --fix-on-failure and --fix-command flags with descriptions.
- Unit tests cover default and custom command scenarios for success and failure paths and pass.
- package.json includes @actions/github and @actions/core in dependencies.
- README files show correct usage, environment setup, and examples for fix-command.

# Verification
- Run npm test and confirm all new tests pass.
- Manually invoke agentic-lib --fix-on-failure with and without --fix-command in a test repository with a failing script; confirm:
  - Child process runs the specified command.
  - On failure, a repositoryDispatch event apply-fix is sent.
  - Logs include executed command, exit code, and dispatch status.