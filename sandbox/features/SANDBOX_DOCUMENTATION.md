# Objective

Provide a unified CLI tool in sandbox mode that validates key repository artifacts including documentation, interactive examples, package manifest, linting, and test coverage.

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
 • Parse its JSON and confirm required fields:
   - name (non-empty string)
   - version (semver compliant)
   - description (non-empty string)
   - main (path to entrypoint)
   - scripts.test defined
   - engines.node >=20.0.0
 • For each missing or invalid field, log a JSON error with field name and exit status 1
 • On success, log a JSON info message and exit status 0

## --fix-features

 • Scan sandbox/features/ for markdown files
 • For each file missing a mission reference, prepend a link to MISSION.md
 • Write changes and log info with list of modified files and exit status 0
 • On write failure, log error and exit status 1

## --generate-interactive-examples

 • Locate mermaid-workflow fenced code blocks in sandbox/README.md
 • Render each block to an interactive HTML snippet using markdown-it and markdown-it-github
 • Remove any existing Examples section, then insert a new idempotent ## Examples section with rendered snippets
 • If no blocks found, log warning and exit status 0
 • On rendering or file I/O errors, log error with details and exit status 1

## --features-overview

 • Inspect the CLI’s registered flags and their descriptions from the source file
 • Generate a markdown summary listing each flag, its usage pattern, and a brief description
 • Print the summary to stdout in JSON log with level info and key featuresOverview containing the markdown
 • Write or update sandbox/docs/FEATURES_OVERVIEW.md with the same markdown summary, replacing any existing content
 • Exit status 0 on success
 • On I/O or processing errors, log error with details and exit status 1

## --validate-tests

 • Spawn a child process to execute npm test with coverage reporting
 • Parse the JSON coverage summary to ensure statements, branches, functions, and lines coverage each meet a configurable threshold (default 80%)
 • If any coverage metric is below threshold, log a JSON error with metric name, threshold, and actual value, then exit status 1
 • On success when all metrics meet or exceed threshold, log a JSON info message indicating coverage details and exit status 0
 • On spawn or parsing errors, log a JSON error with details and exit status 1

## --validate-lint

 • Locate ESLint configuration from project root
 • Run ESLint against sandbox/source/ and src/lib/ using child process
 • Capture stdout and stderr from lint run
 • If ESLint exits with non-zero code, parse output and log JSON errors for each lint finding including file path, line, column, ruleId, and message, then exit status 1
 • On zero exit code, log a JSON info message indicating lint passed and exit status 0
