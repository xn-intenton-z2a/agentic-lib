# Objective

Provide a unified CLI tool in sandbox mode that validates key repository artifacts, generates interactive examples in the README, and ensures documentation for sandbox commands remains consistent and complete, including package manifest validation.

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
 • Log detailed errors with field names and exit status 1 on invalid or missing fields
 • Log info and exit status 0 on success

## --fix-features

 • Scan sandbox/features/ for markdown files
 • For each file missing a mission reference, prepend a link to MISSION.md
 • Write changes and log info with list of modified files and exit status 0
 • On write failure, log error and exit status 1

## --generate-interactive-examples

 • Locate mermaid-workflow fenced code blocks in sandbox/README.md
 • Render each block to an interactive HTML snippet using markdown-it and markdown-it-github
 • Remove any existing Examples section, then insert a new idempotent `## Examples` section with rendered snippets
 • If no blocks found, log warning and exit status 0
 • On rendering or file I/O errors, log error and exit status 1

# File Changes

 • sandbox/source/main.js: add handler for --validate-package with scanning, validation logic, exit codes, and JSON logging; ensure validate-features, validate-readme, fix-features, and generate-interactive-examples are invoked in main
 • sandbox/tests/validate-package.test.js: add tests for valid and invalid package.json configurations
 • sandbox/docs/USAGE.md: update usage instructions to include --validate-package flag and examples
 • sandbox/README.md: update Usage section to document --validate-package flag, including example invocation and expected output