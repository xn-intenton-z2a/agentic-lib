# Objective

Implement unified CLI flags to expose runtime metrics and feature overview directly from the command line. Users will be able to retrieve performance metrics independently or alongside a full feature list in machine-readable or human-readable formats.

# Value Proposition

- Enables quick inspection of callCount and uptime through a dedicated --stats flag.
- Provides a combined view of runtime metrics and available features via --summary (alias --features-overview).
- Supports both JSON and Markdown outputs for seamless integration into CI pipelines and documentation.

# Requirements & Success Criteria

1. Extend CLI to support the following flags:
   - --stats: Outputs only runtime metrics (callCount and uptime in seconds). Default JSON output.
   - --summary (alias --features-overview): Outputs a combined summary of metrics and feature overview.
   - --format option: When combined with --stats or --summary, accepts json (default) or md.

2. Ensure existing flags (--help, --version, --digest) remain functional. When combined with --stats or --summary, run their logic first then emit the requested metrics or summary.

3. Update generateUsage() to include descriptions for --stats, --summary, and --format.

4. Integrate usage examples into sandbox/docs/USAGE.md:
   - node src/lib/main.js --stats  
   - node src/lib/main.js --stats --format=md  
   - node src/lib/main.js --summary  
   - node src/lib/main.js --summary --format=md

5. Add unit tests covering:
   - main(["--stats"]) outputs valid JSON with keys callCount and uptime.
   - main(["--stats","--format=md"]) outputs Markdown with h1 Metrics section.
   - main(["--summary"]) outputs JSON with metrics and features array.
   - Combining --digest or --version with --stats or --summary emits expected behavior.

# User Scenarios & Examples

- As a CI engineer, I run node src/lib/main.js --stats to fetch performance metrics programmatically.
- As a release manager, I run node src/lib/main.js --summary --format=md to embed a feature overview in release notes.
- As a developer, I chain node src/lib/main.js --digest --summary to process events and audit performance in one command.

# Verification & Acceptance

- Vitest unit tests confirm JSON and Markdown outputs match expected schemas.
- USAGE.md updated with clear examples.
- Manual test of node src/lib/main.js --stats prints:
  {
    "callCount": 42,
    "uptime": 1.23
  }
- Manual test of node src/lib/main.js --summary prints:
  {
    "metrics": { "callCount": 42, "uptime": 1.23 },
    "features": [ { "name": "digest", "description": "Simulate SQS event replay" }, { "name": "help", "description": "Display usage instructions" } ]
  }