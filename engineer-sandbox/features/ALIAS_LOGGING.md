# ALIAS_LOGGING

## Objective
Enhance the command alias substitution mechanism to improve traceability and debugging. When a command is replaced via a defined alias in the COMMAND_ALIASES environment variable, the system will log an informational message detailing the original and substituted commands. This is particularly useful in verbose mode to help users verify and troubleshoot alias mappings.

## Implementation Details
- Update the applyAlias function in src/lib/main.js. After a successful alias substitution, check if the substitution occurred and if verbose mode is active. If so, log an informational message indicating the mapping (e.g., 'Alias substitution applied: original -> substituted').
- Use the existing logInfo function for standardized logging of the alias replacement event.
- Modify the README.md documentation to include a section under Command Aliases that explains the new alias logging behavior when verbose mode is enabled.
- Update the test files (tests/unit/main.test.js) to include a case where a known alias is processed and the log output is verified to contain the substitution message.

## Success Criteria
- When a command matches an alias and substitution occurs, an informational log message is emitted in verbose mode with details of the original and substituted command.
- The README is updated to document the alias logging behavior in the CLI utilities section.
- New tests confirm that alias substitutions are logged correctly when verbose mode is activated.

## User Impact
Users gain improved transparency and easier debugging for alias substitutions. This feature helps clarify the behavior of command aliases, ensuring that users understand when and how their commands are translated based on the COMMAND_ALIASES mapping.