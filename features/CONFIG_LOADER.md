# CONFIG_LOADER

## Purpose

Provide a reusable utility to load and validate the agentic-lib configuration from a YAML file. This function centralizes parsing and schema enforcement for agentic-lib.yml, ensuring default values and constraints are applied consistently across workflows and library code.

## Scope

- Reads the agentic-lib.yml file from disk using the supplied file path.
- Parses YAML content into JavaScript using js-yaml.
- Validates structure and types with Zod schema definitions.
- Merges user configuration with built-in defaults for optional fields.
- Throws clear, actionable errors when parsing or validation fails.

## API & Usage Examples

### Function Signature

async function loadConfig(configFilePath: string): Promise<AgenticConfig>

### Example Usage

In src/lib/main.js:

const { loadConfig } = require('./configLoader')

async function main() {
  const config = await loadConfig('.github/agentic-lib/agentic-lib.yml')
  console.log('Loaded config', config)
}

### Typical Config Structure

```yaml
readWriteFilepaths:
  - 'features/*'
  - 'src/lib/*'
maxAttemptsPerIssue: 2
maxAttemptsPerFix: 3
```

## Success Criteria & Requirements

- loadConfig returns a fully populated configuration object with defaults applied when fields are missing.
- Validation errors clearly identify missing fields or type mismatches.
- Supports both absolute and relative file paths; resolves relative paths against the current working directory.
- Includes automated tests covering valid config loading, missing file fallback, and invalid schema failure.

## Dependencies & Constraints

- Relies on js-yaml for parsing YAML.
- Uses Zod for schema validation (already in dependencies).
- Must run in Node.js v20+ and follow ESM import conventions.

## Verification & Acceptance

- Unit tests in tests/unit/configLoader.test.js verify all success and failure scenarios.
- Integration test in sandbox/tests confirms correct merging of defaults.
- No breaking changes to existing APIs or workflows.

