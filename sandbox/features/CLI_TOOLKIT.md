# Objective & Scope
Extend the unified command-line interface to support new operational flags:

• --health: performs environment and connectivity health checks for required services.
• --release-notes: generates draft release notes for a specified version in markdown format.

# Value Proposition
• Provide quick environment validation and proactive health verification before workflows run.
• Automate the generation of consistent, standardized release notes, reducing manual effort and errors.

# Success Criteria & Requirements
• Invocation of --health returns exit code zero if all checks pass and non-zero otherwise.
• Health report output supports human-readable and JSON (--format=json) modes.
• Invocation of --release-notes --version X.Y.Z outputs draft release notes in markdown to STDOUT or a file when --output is provided.
• Generated release notes include version header, release date, and categorized lists of new features, fixes, and breaking changes by parsing CHANGELOG.md or Git tags.
• CLI help usage text updated to document --health, --format, --release-notes, --version, and --output flags.
• Achieve at least 90% line coverage in main.js covering both new logic paths.

# Implementation Details
1. processHealth(args) helper in src/lib/main.js (existing behavior):
   • Detect --health and optional --format=json flag.
   • Verify required environment variables; perform HEAD requests; aggregate results.
2. processReleaseNotes(args) helper in src/lib/main.js:
   • Detect --release-notes and require --version flag; validate version format.
   • Parse CHANGELOG.md or call Git commands to extract entries since last tag.
   • Build a markdown document with:
     – Version header and ISO date
     – Sections: Features, Fixes, Breaking Changes
   • If --output=file provided, write file; otherwise print to STDOUT.
   • Return true on success; exit non-zero and log errors on failure.
3. Export both processHealth and processReleaseNotes for testing.
4. Update generateUsage() to include descriptions for all flags.
5. Invoke processReleaseNotes(args) and processHealth(args) in main() before default help and exit logic.

# Testing & Verification
• Vitest tests for processHealth (existing tests).
• New Vitest tests under tests/unit for processReleaseNotes:
  – Valid scenario with mocked CHANGELOG generates expected markdown string.
  – Missing or invalid --version flag yields error log and non-zero return.
  – File write scenario with --output flag writes to fs mock correctly.
• Mock filesystem and Git commands to isolate logic.

# Documentation Updates
• Update sandbox/README.md usage section with examples for both --health and --release-notes commands.
• Document release notes format and example output in sandbox/docs/.
• Link to CHANGELOG.md conventions and CI integration examples.