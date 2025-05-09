# Purpose

Provide automated generation of release notes from GitHub commit history. This feature fetches commits since the latest tag, groups them by type, formats them into markdown release notes, and outputs structured notes for integration into CI pipelines or release workflows.

# Specification

1. CLI Integration
   - Detect a new --release-notes flag in the CLI arguments within src/lib/main.js.
   - When present, invoke a new processReleaseNotes(args) function and exit after handling.

2. Source File Changes in src/lib/main.js
   - Implement processReleaseNotes(args):
     - Check for --release-notes in args.
     - Use Octokit REST client to fetch the most recent Git tag and commit list since that tag.
     - Parse commit messages using Conventional Commits conventions into categories (Features, Bug Fixes, Documentation, Others).
     - Assemble a markdown document with sections for each category, listing commits with author and date.
     - Log the markdown document to stdout.
     - On errors, call logError with a descriptive message and exit with a nonzero code.
   - Add import for Octokit from @octokit/rest.
   - Modify main() to invoke processReleaseNotes early when the flag is present.

3. Dependency Updates
   - Add @octokit/rest as a dependency in package.json.

4. Documentation Updates in sandbox/README.md
   - Add a section describing the --release-notes flag, its output format, and usage examples for CI and local workflows.

# Dependencies & Constraints

- Requires Node 20+ under ESM standards.
- Depends on GitHub API access; uses GITHUB_API_BASE_URL and OPENAI_API_KEY for authentication if present.
- Limits commit fetch to the default page size; pagination is out of scope for v1.

# User Scenarios & Examples

- CI Integration: A CI job runs node src/lib/main.js --release-notes and redirects output to RELEASE_NOTES.md for a new release.
- Local Development: A developer runs node src/lib/main.js --release-notes to preview release notes before tagging.

# Success Criteria & Verification

- Automated tests in sandbox/tests/releaseNotes.test.js cover:
  - Fetching the latest tag via mocked Octokit.
  - Formatting commit messages into markdown sections.
  - Error handling when GitHub API calls fail.
- Manual verification by running node src/lib/main.js --release-notes and confirming valid markdown output and exit codes.