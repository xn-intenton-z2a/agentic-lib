# Objective

Implement a unified CLI summary command that outputs both runtime metrics and the repository's feature overview in JSON or Markdown, and integrate this summary into the documentation. Users will be able to inspect library statistics and discover available features in a single, machine-readable output.

# Value Proposition

- Consolidates runtime metrics (callCount, uptime) and feature list into one actionable summary.
- Simplifies automation workflows by providing a single endpoint for both performance monitoring and feature discovery.
- Enhances user experience with curated documentation and reduces manual lookup of feature references.

# Requirements & Success Criteria

1. Extend CLI to add a new flag `--summary` (alias `--features-overview`) that produces a combined output:
   - Runtime metrics: callCount and uptime in seconds.
   - Feature overview: list of feature names and short descriptions currently enabled in the library.
2. Support output formats:
   - JSON: default when `--summary` is passed alone.
   - Markdown: when `--summary --format=md` is passed.
3. Retain existing behavior for `--stats`, `--help`, `--version`, and `--digest` flags. If `--summary` is combined with any of those, print the summary after processing the requested action.
4. Update `generateUsage()` to include the new `--summary` flag and its format option.
5. Integrate examples into USAGE.md demonstrating JSON and Markdown summary commands.
6. Ensure unit tests cover:
   - Invocation of `main(["--summary"])` produces parseable JSON with keys: metrics and features.
   - Invocation of `main(["--summary","--format=md"])` outputs valid markdown headings for metrics and features.
   - Combining `--digest --summary` processes digest logic then emits summary.

# User Scenarios & Examples

- As a CI maintainer, I run `agentic-lib --summary` to verify the tool’s metrics and available features programmatically.
- As a developer writing scripts, I run `agentic-lib --summary --format=md` to embed a feature overview in release notes.
- As an integrator, I run `agentic-lib --digest --summary` to process events and receive performance metrics and feature list in one run.

# Verification & Acceptance

- Local unit tests using Vitest confirm JSON and Markdown outputs match expected schema.
- Manual test: `node src/lib/main.js --summary` prints:
  
  ```json
  {
    "metrics": { "callCount": 5, "uptime": 0.72 },
    "features": [
      { "name": "digest", "description": "Simulate SQS event replay" },
      { "name": "version", "description": "Show version and timestamp" },
      { "name": "help", "description": "Display usage instructions" }
    ]
  }
  ```

- Manual test: `node src/lib/main.js --summary --format=md` prints markdown with h1 Metrics and h1 Features sections.

- Documentation updated in sandbox/docs/USAGE.md to include summary examples.