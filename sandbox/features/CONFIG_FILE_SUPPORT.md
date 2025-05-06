# Purpose
Add support for loading configuration from a file (JSON or YAML) in addition to environment variables, enabling easier configuration management and version control.

# Value Proposition
Allow users to define agentic-lib configuration in a dedicated config file (agentic.config.json or agentic.config.yaml) instead of environment variables only. This simplifies setup for local development and CI, ensures reproducible configurations, and centralizes settings in version-controlled files.

# Success Criteria & Requirements
* agentic-lib reads optional configuration file at project root named agentic.config.json, agentic.config.yaml, or agentic.config.yml
* File may define GITHUB_API_BASE_URL, OPENAI_API_KEY, GITHUB_TOKEN, HTTP_PORT, and other existing config keys
* Environment variables override file values when both are present
* Configuration values are validated against the existing zod configSchema with descriptive errors on invalid or missing required fields
* Exported config reflects merged values and is used by all features
* No new dependencies beyond js-yaml and Node built-ins

# Implementation Details
1. In src/lib/main.js, before parsing process.env, check for the presence of agentic.config.json, agentic.config.yaml, or agentic.config.yml in project root
2. Use fs.promises.readFile to read the file; for JSON parse with JSON.parse, for YAML parse with js-yaml.load
3. Merge parsed file values into a copy of process.env, giving higher precedence to actual environment variables
4. Pass the merged object to configSchema.parse and export the resulting config
5. Add Vitest unit tests in tests/unit/main.test.js to mock file reads:
   - Test loading JSON config file and merging with process.env
   - Test loading YAML config file and merging precedence
   - Test validation errors when required fields are missing or invalid
6. Update README.md under Configuration section to document config file support:
   - File names supported
   - Sample agentic.config.json and agentic.config.yaml examples
   - Precedence rules

# Verification & Acceptance
* Unit tests cover JSON and YAML config file loading, merge behavior, and schema validation errors
* npm test passes with new tests and no regressions
* README.md renders config file documentation correctly without formatting issues