# Objective and Scope

Consolidate repository health reporting and automated dependency maintenance into a unified feature that:

- Generates and publishes a health summary in README.md, including open issues count, open pull requests count, latest release version, CI workflow status, test coverage percentage, and outdated dependency count.
- Automatically updates outdated dependencies by programmatically running npm-check-updates, committing changes to a new branch, and opening a pull request with a summary of updates.

# Value Proposition

Maintainers and contributors gain a single CLI-driven workflow to both monitor critical repository health indicators and keep dependencies up-to-date. This reduces manual maintenance overhead, surfaces actionable insights directly in the README, and accelerates routine dependency updates without leaving the command line or navigating multiple dashboards.

# Requirements

- In src/lib/main.js add or extend:
  - function fetchRepoHealthMetrics:
    - No parameters.
    - Gather metrics via GitHub REST API (issues, pull requests, latest release, workflow status).
    - Read coverage percentage from vitest coverage-summary.json.
    - Programmatically run npm outdated to count outdated dependencies.
    - Return an object with all metrics.

  - function generateHealthSummaryMarkdown:
    - Accepts the metrics object.
    - Generates markdown section between markers:
      <!-- HEALTH_SUMMARY_START -->
      ...content...
      <!-- HEALTH_SUMMARY_END -->
    - Include headings and bullet points for each metric.
    - Return the full markdown string including markers.

  - function updateReadmeSection:
    - Accepts readmeFilePath and generated markdown.
    - Reads existing README.md, replaces or inserts the health summary section, and writes back.

  - function fetchOutdatedDependencies:
    - No parameters.
    - Use npm-check-updates programmatically to list outdated dependencies according to a semver range option (major, minor, patch).
    - Return list of dependency update specs.

  - function applyDependencyUpdates:
    - Accepts the list of updates and semver range.
    - Runs npm-check-updates with the specified range and writes updated package.json.
    - Returns true on success.

  - function createDependencyUpdateBranch:
    - Accepts branchName.
    - Uses GitHub REST API to create a new branch from default branch.

  - function commitAndPushChanges:
    - Commits modified package.json and package-lock.json to the new branch.

  - function openDependencyPullRequest:
    - Accepts branchName, title, body text summarizing updated dependencies.
    - Uses GitHub REST API to open a pull request targeting default branch.

- CLI parser in main:
  - Support --publish-health with options --readme, --github-token, --json.
  - Support --auto-update-deps with options:
    --semver-range <major|minor|patch> (default patch)
    --branch-prefix <prefix> (default deps-update/)
    --github-token <token>
    --readme <path> to re-publish health summary after updates.
  - Command behaviors:
    - --publish-health: invoke fetchRepoHealthMetrics, generateHealthSummaryMarkdown, then updateReadmeSection or output JSON.
    - --auto-update-deps: invoke fetchOutdatedDependencies, applyDependencyUpdates, createDependencyUpdateBranch, commitAndPushChanges, openDependencyPullRequest, then optionally re-run --publish-health to refresh summary in README.

- Documentation updates in sandbox/README.md:
  - Document both CLI flags, their available options, and usage examples.
  - Show sample output for health summary and sample pull request summary.

- Unit tests in tests/unit/main.test.js:
  - Mock GitHub API responses for metrics endpoints, branch creation, and pull request creation.
  - Mock fs for coverage-summary.json, package.json, package-lock.json, and README.md templates.
  - Mock child_process execution of npm-check-updates and npm outdated.
  - Verify JSON output, markdown generation, readme update, dependency update behavior (writing files), branch creation, and pull request opening.

# Verification and Acceptance

- All unit tests pass under npm test.
- Manual test by running:
  node src/lib/main.js --publish-health --github-token TOKEN
  and confirming README.md section is updated with correct metrics.
- Manual test by running:
  node src/lib/main.js --auto-update-deps --github-token TOKEN
  and confirming a new branch is created, package.json is updated, and a pull request is opened with accurate summary.
