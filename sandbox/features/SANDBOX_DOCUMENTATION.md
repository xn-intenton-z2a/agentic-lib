# Objective

Provide a unified CLI tool in sandbox mode that validates key repository artifacts, generates interactive examples in the README, and ensures documentation for sandbox commands remains consistent and complete.

# Specification

## --validate-features
 • Read all markdown files under sandbox/features/
 • Ensure each file contains a reference to MISSION.md or a # Mission heading
 • Log errors with file path and exit status 1 on failures
 • Log info and exit status 0 on success

## --validate-readme
 • Read sandbox/README.md
 • Verify it begins with a summary inspired by MISSION.md
 • Confirm links to MISSION.md, CONTRIBUTING.md, LICENSE.md, sandbox/docs/USAGE.md, and agentic-lib GitHub repository
 • Report missing or malformed headers or links as errors and exit status 1
 • Log info and exit status 0 on success

## --validate-package
 • Read root package.json
 • Confirm required fields name, version, description, main, scripts.test, engines.node >=20.0.0
 • Log detailed errors and exit status 1 on invalid or missing fields
 • Log info and exit status 0 on success

## --generate-interactive-examples
 • Locate mermaid-workflow fenced code blocks in sandbox/README.md
 • Render each block to an interactive HTML snippet using markdown-it and markdown-it-github
 • Insert or update an Examples section in README without duplication
 • Log a warning and exit status 0 if no blocks found
 • Log errors and exit status 1 on rendering failures

## --validate-docs
 • Scan sandbox/source/main.js for used CLI flags by matching args.includes patterns
 • Read sandbox/docs/USAGE.md and confirm that each sandbox CLI flag has a corresponding section or example with correct syntax
 • Read sandbox/README.md and ensure each sandbox CLI flag is mentioned under the Usage section with a code invocation
 • Report missing or mismatched documentation entries listing file path, flag name, and exit status 1 on failures
 • Log info and exit status 0 on success when all CLI flags are documented consistently

# Logging Format

All log entries must be JSON objects with level, timestamp, message, and relevant metadata. Validation flags run in order when combined before example generation.

# File Changes

 • sandbox/source/main.js: add handler for --validate-package with scanning, validation logic, exit codes, and JSON logging
 • sandbox/tests/validate-package.test.js: add tests for valid and invalid package.json configurations
 • sandbox/docs/USAGE.md: update usage instructions to include --validate-package flag
 • sandbox/README.md: update Usage section to document --validate-package flag