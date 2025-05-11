# Objective

Provide a unified CLI tool in sandbox mode that validates key repository artifacts, generates interactive examples in the README, finalizes an automated features overview summary, and ensures documentation for sandbox commands remains consistent and complete, including package manifest validation.

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

## --features-overview

 • Inspect the CLI’s registered flags and their descriptions from the source file
 • Generate a markdown summary listing each flag, its usage pattern, and a brief description
 • Print the summary to stdout in JSON log with level info and key `featuresOverview` containing the markdown
 • Write or update sandbox/docs/FEATURES_OVERVIEW.md with the same markdown summary, replacing any existing content
 • Exit status 0 on success
 • On I/O or processing errors, log error with details and exit status 1

# File Changes

 • sandbox/source/main.js: add handler for --features-overview before the default case, implement summary generation and file write logic
 • sandbox/tests/features-overview.test.js: add tests covering success, overwrite behavior, and error handling
 • sandbox/docs/USAGE.md: add documentation for --features-overview with example invocation and expected output
 • sandbox/README.md: update Links and Usage sections to include --features-overview
