# Objective

Update the Project Health Dashboard section in sandbox/README.md to include continuous integration build status and code coverage badges, alongside existing project health metrics.

# Value Proposition

Enhances visibility into ongoing development quality by surfacing build success and test coverage directly in the repository. This reduces friction for contributors, accelerates diagnosis of broken builds, and promotes confidence in code health.

# Scope

- Locate the Project Health Dashboard section immediately after the repository header in sandbox/README.md.
- Ensure the following badges appear in order:
  - npm version using https://img.shields.io/npm/v/@xn-intenton-z2a/agentic-lib
  - license using https://img.shields.io/npm/l/@xn-intenton-z2a/agentic-lib
  - monthly downloads using https://img.shields.io/npm/dm/@xn-intenton-z2a/agentic-lib
  - Node.js support using https://img.shields.io/node/v/@xn-intenton-z2a/agentic-lib
  - GitHub Actions build status using https://github.com/xn-intenton-z2a/agentic-lib/actions/workflows/main.yml/badge.svg
  - code coverage using https://img.shields.io/codecov/c/github/xn-intenton-z2a/agentic-lib.svg
- Each badge must link to its respective resource:
  - npm version links to the npm package page
  - license links to the npm license page
  - monthly downloads links to npm download stats
  - Node.js support links to Node.js version matrix
  - build status links to the GitHub Actions workflow page
  - code coverage links to the Codecov report for the repository
- Preserve the existing README content and formatting outside this section.

# Success Criteria

1. sandbox/README.md displays all six badges in the correct order under the Project Health Dashboard heading.
2. Badges render correctly on GitHub and navigate to valid target pages when clicked.
3. No other sections or content in README.md are removed or modified beyond this section.
4. All existing automated tests and CI checks pass without changes.
