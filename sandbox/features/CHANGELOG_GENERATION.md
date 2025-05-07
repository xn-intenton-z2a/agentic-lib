# Objective and Scope

Automatically generate a project CHANGELOG.md file on release by extracting and formatting commit history between git tags.

# Value Proposition

Maintains a consistent, up-to-date changelog without manual effort. Improves transparency for maintainers and end users by providing a clear audit trail of changes in each release.

# Requirements

## CLI Integration

- Add a new flag:
  - --generate-changelog alias --gen-changelog to trigger changelog creation or update.
- Usage examples:
  - node src/lib/main.js --generate-changelog
  - npm run start -- --gen-changelog

## Commit History Retrieval

- Use either child_process to invoke git log or integrate the simple-git library.
- Identify the most recent annotated tag or fallback to the initial commit.
- Extract commit messages between that reference and HEAD.
- Optionally group commits by type following the conventional commit format (feat, fix, docs, etc.).

## Changelog File Generation

- Create or update a CHANGELOG.md file in the project root.
- If the file contains an Unreleased section, move those entries under a new version header matching the current package.json version.
- Format for each release:
  - ## [version] - YYYY-MM-DD
  - Bullet list of commit summaries under the release header.
- Preserve existing content and only prepend the new release section.

## Documentation Updates

- Update README.md with a new "Changelog" section:
  - Document the --generate-changelog flag and its alias.
  - Provide usage examples.
  - Describe the structure of the generated CHANGELOG.md.

# Verification and Acceptance

- Unit tests mock git log output to simulate various commit histories. Verify that parsing and grouping produce expected markdown entries.
- CLI integration tests ensure invoking the flag generates or updates CHANGELOG.md with correct headers and entries.
- Manual verification confirms that running generate-changelog in a sample repository produces a valid, well-formatted changelog.