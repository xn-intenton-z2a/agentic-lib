# Objective
Populate docs/USAGE.md with detailed CLI usage examples and instructions and integrate CLI documentation into sandbox/README.md.

# Value Proposition
Providing comprehensive, example-driven documentation for all CLI commands enhances developer onboarding and reduces friction when using the tool. Clear usage examples for help, version, digest, and summary commands empower users to adopt the CLI efficiently and avoid trial-and-error.

# Scope
- Create or update `sandbox/docs/USAGE.md` to include:
  - Overview of CLI purpose and requirements.
  - Sectioned examples for each command (`--help`, `--version`, `--digest`, `--summary`).
  - Sample invocations and expected outputs (JSON or plain text as appropriate).
  - Environment variable settings for commands needing configuration.
- Update `sandbox/README.md` under "Command Line Interface" to:
  - Link to `docs/USAGE.md` for detailed examples.
  - Add a brief summary of usage and a pointer to full documentation.
- Ensure consistency of examples with current implementation in `src/lib/main.js`.

# Requirements
- USAGE.md must be a markdown file with level 1 headings and code blocks for examples.
- Examples must not include escaped JSON strings; present raw JSON blocks.
- README must reference USAGE.md and include at least one inline example.
- No changes to source code behavior or tests, only documentation files.

# Success Criteria
- Users can open `docs/USAGE.md` and follow examples to run each CLI command successfully.
- CI linting checks pass on the updated markdown files.
- README links resolve correctly and display usage sections.

# Verification
1. Open `sandbox/docs/USAGE.md` and confirm presence of examples for all CLI flags.
2. Run each example command in a terminal and verify output matches documented samples.
3. Review the `sandbox/README.md` to ensure the CLI section points to the new USAGE.md.
4. Execute `npm test` to verify no test regressions and markdown linting is satisfied.