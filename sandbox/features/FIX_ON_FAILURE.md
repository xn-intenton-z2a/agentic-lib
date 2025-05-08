# Objective
Detect when the build or test command fails and automatically trigger the apply-fix GitHub workflow

# Value Proposition
When CI or local builds fail, the CLI can instantly dispatch an apply-fix workflow to patch common errors without manual intervention, reducing mean time to recovery for broken pipelines.

# Scope
Add a --fix-on-failure flag to the CLI; implement failure detection and GitHub dispatch logic in src/lib/main.js; update generateUsage; extend unit tests; update sandbox/README.md and root README; update package.json dependencies.

# Requirements
- package.json:
  - Add dependencies @actions/github and @actions/core for repository dispatch API.
- src/lib/main.js:
  - Implement processFixOnFailure(args):
    - If args includes --fix-on-failure, run child_process.execSync('npm test') (or configured build command).
    - On error, instantiate GitHub client using GITHUB_TOKEN from environment.
    - Send repositoryDispatch event named apply-fix to the current repository.
    - Log a JSON entry for detection and dispatch status to stdout.
    - Return true to halt further CLI processing.
  - Update main() to call processFixOnFailure early.
  - Extend generateUsage() to include --fix-on-failure with description.
- tests/unit/main.test.js:
  - Mock child_process to simulate passing and failing exit codes.
  - Mock @actions/github client to verify repositoryDispatch payload when failure occurs.
  - Assert that no dispatch occurs on successful build.
- sandbox/README.md and README.md:
  - Under Usage, document the --fix-on-failure flag with example commands and note requirement for GITHUB_TOKEN.

# Success Criteria
- generateUsage output lists --fix-on-failure flag.
- Unit tests cover both success and failure paths and pass.
- package.json includes new dependencies.
- README files show correct usage and environment setup.

# Verification
- Run npm test and verify new tests pass.
- Manually invoke agentic-lib --fix-on-failure in a test repository with a failing script; confirm that a repositoryDispatch event apply-fix is sent to GitHub and log entry appears.