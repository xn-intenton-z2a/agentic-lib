# Objective
Extend the command-line interface to include a new --health-summary flag that computes and outputs a mission health summary based on the repository’s mission file and runtime environment.

# Value Proposition
Providing a mission health summary via the CLI enables maintainers to quickly verify the integrity and completeness of the current mission, ensuring workflows remain aligned with the mission statement. This helps detect missing fields, invalid formats, or outdated content without manual inspection.

# Scope
- Modify src/lib/main.js to:
  - Add a processHealthSummary function that:
    - Reads the MISSION.md file.
    - Parses key sections (title, description, invocation patterns).
    - Generates a summary object with counts of headings, links, and defined workflows.
    - Outputs the summary as JSON to stdout.
  - Integrate processHealthSummary into main(), handling the --health-summary flag analogously to existing flags.
- Create sandbox/tests/missionHealthSummary.test.js to:
  - Mock reading MISSION.md with sample content.
  - Invoke main(["--health-summary"]) and verify the JSON structure and values.
- Update sandbox/docs/USAGE.md:
  - Add a new section under level 1 heading for --health-summary with example invocation and output.
- Update sandbox/README.md:
  - In the CLI section, add a bullet for --health-summary with a brief description.

# Requirements
- The new flag must be documented in usage and readme with raw JSON examples.
- The implementation must use only built-in fs/promises for reading the mission file.
- Tests must cover missing or malformed MISSION.md scenarios and verify error-handling logs.
- Do not introduce new top-level files; place the test in sandbox/tests.

# Success Criteria
1. Running node src/lib/main.js --health-summary outputs a valid JSON object summarizing mission content.
2. Tests pass: missionHealthSummary test verifies summary metrics and error-handling.
3. USAGE.md and README references resolve and demonstrate the new flag.
4. CI linting and formatting checks pass.

# Verification
1. Add a sample MISSION.md in tests and confirm the CLI output matches expected summary metrics.
2. Run node src/lib/main.js --health-summary in a real repository and inspect JSON.
3. Ensure npm test passes without regressions and documentation lint succeeds.