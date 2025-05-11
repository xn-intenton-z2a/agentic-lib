# Objective
Provide a unified CLI tool in sandbox mode that validates key repository artifacts and generates interactive examples in the README, ensuring consistency with mission, contributing, and licensing guidelines.

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

# Logging Format
All log entries must be JSON objects with level, timestamp, message, and relevant metadata. Validation flags run in order when combined before example generation.

# File Changes
• sandbox/source/main.js: implement flag handlers, combined invocation flow, exit codes, and JSON logging
• sandbox/tests/validate-features.test.js: verify invalid and valid cases for feature reference
• sandbox/tests/validate-readme.test.js: test missing summary, links, and success path
• sandbox/tests/validate-package.test.js: test missing fields, invalid engine version, and success path
• sandbox/tests/generate-interactive-examples.test.js: test rendering success, idempotency, warning path, and error path
• sandbox/docs/USAGE.md: update usage instructions with new flags and combined invocation
• sandbox/README.md: add mission-inspired summary, placeholders for mermaid-workflow blocks, and Examples section
• package.json: add markdown-it and markdown-it-github dependencies