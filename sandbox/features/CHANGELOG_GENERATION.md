# Objective

Implement an automated workflow to generate and maintain a standardized CHANGELOG.md file based on Git commit history and package version.

# Value Proposition

Automating changelog generation ensures that each release is accompanied by a clear record of new features, fixes, and improvements. This reduces manual work, enforces consistency, and makes it easy for developers and users to track changes over time.

# Scope

- Modify src/lib/main.js:
  - Add a new CLI flag `--changelog` to trigger changelog generation.
  - On invocation, read the current version from package.json.
  - Use simple-git to collect commit messages since the last Git tag matching the previous version.
  - Format entries under a heading with the new version and current date (YYYY-MM-DD).
  - Prepend or create CHANGELOG.md at the project root with the new section.

- Update package.json:
  - Add a `changelog` script: `node src/lib/main.js --changelog`.
  - Add `simple-git` as a dev dependency if not already present.

- Update sandbox/README.md:
  - Document the `--changelog` flag and demonstrate running `npm run changelog`.

- Create tests in tests/unit/changelog.test.js:
  - Mock simple-git to simulate commit history and verify that CHANGELOG.md is generated with correct heading and entries.
  - Test idempotent runs: ensure repeated invocations prepend new sections without duplicating existing entries.

# Success Criteria

1. Running `npm run changelog` generates or updates `CHANGELOG.md` with a section for the current package version and date.
2. Generated entries reflect commit messages since the last version tag.
3. Tests for changelog generation pass and cover file creation and idempotent updates.
4. README includes clear instructions and examples for the `--changelog` flag.