# Commands

- **--validate-config**: Validates the agent_config.yaml file in the project root. Reads the file using fs/promises, parses it with js-yaml, and enforces presence and correct types for required top-level keys: schedule (string), paths (mapping with required nested keys), buildScript (string), testScript (string), and mainScript (string). Logs a JSON-formatted error entry for each missing or invalid key and exits with code 1 on failure. On success, logs a JSON-formatted info entry confirming all configuration keys are valid and exits with code 0.

# Implementation

Add a new processValidateConfig function in sandbox/source/main.js that:

- Detects the --validate-config flag in the CLI arguments.
- Reads agent_config.yaml from the project root using fs/promises.
- Parses YAML content with js-yaml and catches parse errors.
- Iterates over required keys and nested path mappings, validating type and existence.
- For each missing or invalid key, logs JSON error with field name and description.
- On any validation errors, calls process.exit(1); on full success, logs JSON info and calls process.exit(0).
- Integrates processValidateConfig into the main dispatch sequence alongside existing process* handlers.

# Testing

Create sandbox/tests/validate-config.test.js with vitest to cover:

- Missing file scenario: mock fs/promises.readFile to throw; expect console.error entries and exit code 1.
- Invalid YAML scenario: mock js-yaml to throw on parse; expect console.error entries and exit code 1.
- Missing or invalid keys scenario: supply YAML missing schedule, paths, or script keys; expect console.error per missing key and exit code 1.
- Success scenario: supply complete valid YAML; expect console.log info entry and exit code 0.

Use vitest mocks for fs/promises and js-yaml, and spy on console methods and process.exit.

# Documentation

Update sandbox/README.md and sandbox/docs/USAGE.md to include a **--validate-config** section under Usage. Provide example invocations, expected success output JSON, and expected failure output JSON for missing or invalid configuration keys, following the style of other CLI commands.