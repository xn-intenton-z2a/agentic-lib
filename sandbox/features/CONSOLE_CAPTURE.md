# Objective
Ensure the console capture feature is fully documented for both CLI usage and developer reference within the README and sandbox/docs.

# Value Proposition
Provide clear, discoverable instructions for enabling and using console capture so that developers and CI systems can easily activate and interpret buffered logs without inspecting source code.

# Scope
Update documentation in these locations:
- README under the Usage section to include the --capture-console flag and example commands
- sandbox/docs/CONSOLE_CAPTURE.md to add a Usage subsection demonstrating CLI and environment variable activation
- The USAGE output in the CLI generateUsage helper comments to mention console capture

# Requirements
- In sandbox/README.md:
  - Under a Usage or CLI section, add a description of the --capture-console flag and example usage lines
  - Link to the Console Capture Utility documentation page
- In sandbox/docs/CONSOLE_CAPTURE.md:
  - Add a Usage heading showing example code snippets using startConsoleCapture and the CLI flag
  - Document how to set VITEST_CONSOLE_CAPTURE and interpret grouped output in Vitest
- In src/lib/main.js generateUsage function comments:
  - Add an entry for --capture-console with a brief description
- Ensure all new documentation follows the existing markdown style and contains no code escape blocks

# Success Criteria
- README shows the --capture-console flag under Usage with a working example
- sandbox/docs/CONSOLE_CAPTURE.md includes a Usage subsection with illustrative CLI and code examples
- generateUsage output includes the new flag when running agentic-lib --help
- Documentation links and headings render correctly in markdown preview

# Verification
- Manual review of README and docs for correct headings, links, and examples
- Run agentic-lib --help and confirm flag appears in usage
- CI tests unaffected; documentation changes only