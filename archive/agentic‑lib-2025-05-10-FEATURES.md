sandbox/features/EXTENDED_CLI_COMMANDS.md
# sandbox/features/EXTENDED_CLI_COMMANDS.md
# Purpose

Enhance the unified CLI entrypoint and logging utilities by adding comprehensive documentation
and usage examples for structured console output. Provide clear guidance on JSON log format,
explanation of fields, and sample CLI output for end users.

# Specification

## Structured Log Format

- All log functions (`logInfo`, `logError`, `formatLogEntry`) produce a structured JSON object with only
the following top-level fields:
  - level: log level string (info, error, etc.)
  - timestamp: ISO 8601 formatted timestamp
  - message: descriptive log message
  - additional keys: any extra context or error details
- Document the purpose and content of each field.
- Provide usage examples demonstrating typical outputs.

### Example JSON Output

```
{"level":"info","timestamp":"2024-06-20T12:34:56.789Z","message":"Configuration loaded","config":{"GITHUB_API_BASE_URL":"https://api","OPENAI_API_KEY":"key"}}
```

```
{"level":"error","timestamp":"2024-06-20T12:35:00.123Z","message":"Failed to fetch issues","error":"Error: Request failed with status 500"}
```

## README Updates

- Add a new "Structured Console Output" section in README.md.
- Include:
  - Explanation of JSON log structure and fields.
  - Inline examples of `logInfo` and `logError` output.
  - CLI usage snippet showing verbose and non-verbose modes.
- Ensure links to MISSION.md, CONTRIBUTING.md, and LICENSE.md remain intact.

## Testing and Verification

- Add unit tests in tests/unit/main.test.js for:
  - `formatLogEntry` returns an object with correct fields.
  - `logInfo` and `logError` output valid JSON containing `level`, `timestamp`, and `message`.
  - Verify that error stacks appear only when VERBOSE_MODE is enabled.
- Use Vitest to capture console output and parse JSON for assertions.

## Success Criteria

- README displays clear structured console output examples.
- Tests validate JSON log structure and content.
- End users can quickly understand and adopt structured logging in their workflows.