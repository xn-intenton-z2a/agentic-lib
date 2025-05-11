# Objective

Provide unified sandbox tooling that validates repository artifacts and enhances workflow-diagram documentation by generating interactive examples in the README.

# Specification

Implement the following CLI flags in sandbox/source/main.js:
  • --validate-features    (existing behavior)
  • --validate-readme      (existing behavior)
  • --validate-package     (existing behavior)
  • --generate-interactive-examples  (new behavior)

When --generate-interactive-examples is supplied, the tool should:
  • Read sandbox/README.md
  • Locate fenced code blocks labeled mermaid-workflow
  • For each code block, render an interactive HTML snippet using markdown-it and markdown-it-github
  • Insert or update a dedicated "Examples" section in sandbox/README.md with the rendered snippets
  • Ensure idempotent updates without duplicating existing interactive examples

Errors and logging:
  • Log a warning and exit normally if no mermaid-workflow blocks are found
  • Log an error and exit with status 1 if rendering fails for any block
  • Log an info message when interactive examples are successfully generated

# Test Scenarios

1. No flags supplied returns existing validation behavior without modifying the README.
2. --generate-interactive-examples with valid mermaid-workflow blocks injects HTML examples into sandbox/README.md and logs success.
3. --generate-interactive-examples with no mermaid-workflow blocks logs a warning and exits with status 0.
4. --generate-interactive-examples with invalid mermaid-workflow syntax logs error messages and exits with status 1.
5. Combined flags (--validate-readme and --generate-interactive-examples) run validation first then documentation update.

# Updates to Documentation and Files

• Update sandbox/source/main.js to implement the new --generate-interactive-examples flag and rendering logic
• Add sandbox/tests/generate-interactive-examples.test.js covering success, warning, and failure cases
• Update sandbox/docs/USAGE.md with usage example for --generate-interactive-examples
• Modify sandbox/README.md to include a mermaid-workflow placeholder section and note the interactive examples section
• Ensure markdown-it and markdown-it-github remain in package.json dependencies (add if missing)