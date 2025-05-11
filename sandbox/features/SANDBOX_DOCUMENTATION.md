# Objective

Provide unified sandbox tooling to validate key repository artifacts and enhance workflow documentation by generating interactive examples in the README.

# Specification

Implement the following CLI flags in sandbox/source/main.js, each operating independently or in combination and reporting clear logs and exit codes:

• --validate-features
  • Read all markdown files under sandbox/features/
  • Ensure each file contains a reference to MISSION.md or a # Mission heading
  • On missing reference, log an error object with file path and exit with status 1
  • On success, log an info object and exit normally

• --validate-readme
  • Read sandbox/README.md
  • Verify it contains links to MISSION.md, CONTRIBUTING.md, LICENSE.md, and sandbox/docs/USAGE.md
  • Ensure it begins with a summary inspired by the mission statement
  • Report missing links or invalid format as errors and exit with status 1
  • On success, log an info object and exit normally

• --validate-package
  • Read package.json at project root
  • Confirm required fields: name, version, description, main, scripts.test
  • Validate engines.node is >=20.0.0
  • On any missing or invalid field, log error details and exit with status 1
  • On success, log an info object and exit normally

• --generate-interactive-examples
  • Read sandbox/README.md and locate fenced code blocks labeled mermaid-workflow
  • For each block, render an interactive HTML snippet using markdown-it and markdown-it-github
  • Insert or update an "Examples" section with these snippets, preserving other content
  • Ensure idempotent updates without duplication
  • If no mermaid-workflow blocks found, log a warning and exit normally
  • On rendering errors, log error details and exit with status 1

Each flag should support combined invocation: validations run first in fixed order (features, readme, package), then examples generation. All logs should use JSON-formatted objects with level, timestamp, message, and relevant metadata.

# Test Scenarios

1. No flags supplied: print usage message without modifying files and exit status 0.
2. --validate-features only: cover success and failure of mission reference tests.
3. --validate-readme only: detect missing links and invalid headers, success when all checks pass.
4. --validate-package only: detect missing required fields or invalid engine version, success otherwise.
5. --generate-interactive-examples only: handle valid mermaid-workflow, no-blocks warning, and syntax errors.
6. Combined flags: e.g. --validate-readme --generate-interactive-examples runs readme checks then example generation.

# Updates to Files

• Modify sandbox/source/main.js to implement handlers for --validate-readme, --validate-package, and --generate-interactive-examples alongside existing --validate-features logic.
• Add sandbox/tests/validate-readme.test.js and sandbox/tests/validate-package.test.js covering success and failure cases.
• Update sandbox/tests/generate-interactive-examples.test.js to ensure compatibility with combined flag execution.
• Update sandbox/docs/USAGE.md with usage examples for new validation flags.
• Populate sandbox/README.md with initial placeholder sections for mission summary and mermaid-workflow demonstration.
• Ensure markdown-it and markdown-it-github are present in package.json dependencies.