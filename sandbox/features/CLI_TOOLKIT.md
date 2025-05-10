# Objective & Scope

Extend the unified command-line interface to support generating a visual workflow interaction diagram and consolidate archived feature documentation into a single overview.

# Value Proposition

• Single CLI surface remains the authoritative entry point for all operations, now including interactive workflow visualization and archived feature discovery.
• Diagram output helps users understand event flow between CLI commands and SQS Lambda handlers.
• Features overview output helps users discover and review archived features with summaries in one consolidated view.
• Combined with --json, outputs can be consumed by other tools or CI pipelines.

# Success Criteria & Requirements

• Invocation of --diagram prints a valid Mermaid or JSON diagramDefinition representing key workflow steps.
• Invocation of --features-overview prints a consolidated markdown overview listing each archived feature file name and summary extracted from its first heading.
• Users may pass --features-overview --format=json to receive a JSON array of objects with name and summary.
• Combined flags with --json and --diagram or --features-overview produce a single JSON object containing the requested data.
• CLI help usage text updated to document --diagram, --features-overview, and --format options.
• Achieve at least 90% line coverage in main.js including new processDiagram and processFeaturesOverview logic and error handling.

# Implementation Details

1. Add processDiagram(args) and processFeaturesOverview(args) helper in main.js:
   • Detect --features-overview flag and optional --format=json flag.
   • Call new generateFeaturesOverview(format) utility to produce a markdown string or JSON array.
   • Log overview output via console.log and return true.
2. Export generateFeaturesOverview for direct testing:
   • If format is markdown, read all .md files under sandbox/features/archived/, parse first heading and description, and concatenate into one markdown document.
   • If format is json, return an array of objects with name and summary fields.
3. Update generateUsage() to include:
   • --features-overview           Generate consolidated archived feature overview.
   • --format=<markdown|json>      Select features overview output format (requires --features-overview).
4. In main(), insert await processFeaturesOverview(args) after processDigest and before fallback usage.

# Testing & Verification

• Create Vitest tests under tests/unit/ for:
  – processFeaturesOverview(["--features-overview"]) produces a markdown string containing expected feature headings.
  – processFeaturesOverview(["--features-overview","--format=json"]) returns an array of objects matching spec.
  – Combined invocation main(["--features-overview","--json"]) yields a single JSON object with overviewData and existing reportData when applicable.
  – Error handling when sandbox/features/archived directory does not exist logs an error and returns false or non-zero exit code.
• Update sandbox/tests and existing test suite accordingly.

# Documentation Updates

• Update sandbox/README.md usage section to include --features-overview and --format options with examples for markdown and JSON outputs.
• Link to archived feature documents location and MISSION.md, CONTRIBUTING.md, LICENSE, and repository URL.

# Dependencies & Constraints

• No new dependencies; use built-in fs and path modules.
• Maintain ECMAScript Module style and compatibility with Node≥20.
• Follow existing logging conventions using formatLogEntry utilities.

# Verification & Acceptance

• All tests pass under npm test and npm run test:unit.
• Coverage report shows ≥90% coverage for main.js.
• Manual verification by running node src/lib/main.js --features-overview and piping output to markdown renderer confirms correct overview document.