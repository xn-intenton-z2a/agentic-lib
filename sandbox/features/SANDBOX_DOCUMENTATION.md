# Objective
Provide a unified CLI tool in sandbox mode that validates key repository artifacts and generates interactive examples in the README, ensuring consistency with mission, contributing, and licensing guidelines.

# Specification
Implement the following flags in sandbox/source/main.js. Each operates independently or in combination, running in order: validate-features, validate-readme, validate-package, generate-interactive-examples.

--validate-features
  • Read all markdown files under sandbox/features/
  • Ensure each file contains a reference to MISSION.md or a # Mission heading
  • Log errors with file path and exit status 1 on failures
  • Log info and exit normally on success

--validate-readme
  • Read sandbox/README.md
  • Verify it begins with a summary inspired by MISSION.md
  • Confirm links to MISSION.md, CONTRIBUTING.md, LICENSE.md, sandbox/docs/USAGE.md, and the agentic-lib GitHub repository
  • Report missing or malformed headers or links as errors and exit with status 1
  • Log info and exit normally on success

--validate-package
  • Read root package.json
  • Confirm required fields: name, version, description, main, scripts.test, engines.node >=20.0.0
  • Log detailed errors and exit status 1 on invalid or missing fields
  • Log info and exit normally on success

--generate-interactive-examples
  • Locate mermaid-workflow fenced code blocks in sandbox/README.md
  • Render each block to an interactive HTML snippet with markdown-it and markdown-it-github
  • Insert or update an Examples section in README without duplications
  • Log a warning and exit normally if no blocks found
  • Log errors and exit status 1 on rendering failures

All logs must be JSON objects with level, timestamp, message, and relevant metadata. Combined invocation runs validations first, then example generation.

# Test Scenarios
1. No flags: output usage message and exit status 0.
2. --validate-features only: success and failure cases.
3. --validate-readme only: detect missing links or headers, success when all checks pass.
4. --validate-package only: detect missing fields or engine version errors, success otherwise.
5. --generate-interactive-examples only: valid rendering, no-blocks warning, syntax errors.
6. Combined flags: run validations in order then generate examples.

# File Changes
• sandbox/source/main.js: add handlers for new flags alongside processValidateFeatures, ensure combined invocation and exit codes.
• sandbox/tests/validate-readme.test.js: new tests for missing summary, missing links, success path.
• sandbox/tests/validate-package.test.js: new tests for missing fields, invalid engine, success path.
• sandbox/tests/generate-interactive-examples.test.js: update to verify idempotency, rendering success, warning path, error path.
• sandbox/docs/USAGE.md: expand usage examples to include new flags and combined invocation.
• sandbox/README.md: add mission-inspired summary, placeholders for mermaid-workflow blocks and Examples section.
• package.json: ensure markdown-it and markdown-it-github exist in dependencies.