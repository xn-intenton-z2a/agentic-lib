# Objective and Scope

Extend and unify repository health reporting and user-facing usage documentation into a single automated feature that:

- Generates and publishes a health summary in README.md with key metrics (issues, pull requests, release version, CI status, test coverage, outdated dependencies).
- Populates docs/USAGE.md with detailed usage instructions and examples for CLI flags and key functions.

# Value Proposition

Consolidating both health insights and comprehensive usage guidance empowers maintainers and end users to quickly understand repository status and how to use the library. Automating updates to both README.md and docs/USAGE.md reduces manual effort and ensures documentation remains in sync with code changes.

# Requirements

## Source Updates in src/lib/main.js

- fetchRepoHealthMetrics
  - No changes: gathers repository metrics via GitHub API and local coverage data.

- generateHealthSummaryMarkdown
  - No changes: produces markdown section between markers in README.md.

- updateReadmeSection(readmeFilePath, generatedMarkdown)
  - No changes: writes health summary into README.md.

- generateUsageExamples
  - No parameters.
  - Returns a markdown string containing:
    - A top-level heading for usage.
    - CLI examples for --help, --version, --digest flags.
    - Code snippet illustrating createSQSEventFromDigest and digestLambdaHandler usage.

- updateUsageDocs(usageDocsPath, usageMarkdown)
  - Accepts path to docs/USAGE.md and the markdown string.
  - Reads existing USAGE.md, replaces entire content, and writes back.

- CLI integration
  - After existing flags, support --populate-usage with option --docs-path <path> (default docs/USAGE.md).
  - When invoked, call generateUsageExamples and updateUsageDocs.

## Documentation Updates

- sandbox/README.md
  - Add a section describing the purpose of docs/USAGE.md and link to it.
  - Show a brief inline usage example.

- docs/USAGE.md
  - Initially empty. The feature will populate it with generated examples.

## Tests in tests/unit/main.test.js

- Mock fs methods for docs/USAGE.md to verify updateUsageDocs writes expected content.
- Test generateUsageExamples returns markdown including sample CLI commands and code snippet.
- Test CLI invocation of --populate-usage triggers updateUsageDocs with default and custom paths.

# Verification and Acceptance

- All existing and new unit tests pass under npm test.
- Manual test: run node src/lib/main.js --populate-usage and inspect docs/USAGE.md content matches expected usage examples.
- Manual test: run node src/lib/main.js --publish-health and confirm README.md health section remains unchanged.