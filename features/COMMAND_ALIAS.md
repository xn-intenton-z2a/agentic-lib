# COMMAND_ALIAS Feature Specification

## Overview
This feature introduces support for command aliases in the agentic-lib CLI. Users can define aliases for frequently used commands via the environment variable `AGENTIC_ALIAS`. The variable is expected to contain a JSON mapping of alias names to the actual commands. This simplifies command input, reduces potential errors, and enhances the overall user experience.

## Implementation Details
### Source File Modifications (src/lib/main.js)
- **Alias Resolution:** At the start of the CLI processing, parse the `AGENTIC_ALIAS` environment variable (if set) as a JSON object mapping alias keys to actual command strings.
- **Command Substitution:** Before passing the command to the `agenticHandler`, check if the provided command (or any command in a batch) exists in the alias map. If an alias is found, substitute it with the corresponding actual command.
- **Compatibility:** Ensure that both single command and batch command scenarios support alias substitution without interfering with existing validations. Maintain current logging and error handling behavior, and add verbose logs for alias substitutions when `--verbose` is activated.

### Testing Enhancements (tests/unit/main.test.js)
- **New Test Cases for Alias Resolution:** Add unit tests that set the `AGENTIC_ALIAS` environment variable to a valid JSON mapping. Test that providing an alias via the `--agentic` flag results in the actual command being processed.
- **Batch Processing:** Verify that each command in a batch payload is independently checked and substituted if an alias is defined.
- **Fallback Behavior:** Confirm that if an alias is not defined, the original command is processed unchanged.

### Documentation Updates (README.md)
- **CLI Usage Section Update:** Document the new alias functionality. Explain how to define the `AGENTIC_ALIAS` environment variable with a JSON mapping and provide examples of invoking commands using an alias.
- **Usage Examples:** Include example commands showing how using an alias simplifies the command input.

## Benefits & Success Criteria
- **Simplified Command Input:** Enables users to define shorter or more intuitive commands, reducing input errors and increasing efficiency.
- **Enhanced User Experience:** The alias resolution provides a more flexible CLI by allowing customization without code changes.
- **Testable and Stable:** The functionality is covered by unit tests and documented, ensuring reliability and ease of future maintenance.

## Verification & Acceptance
- The CLI should resolve an alias to its actual command both in single and batch processing scenarios.
- Logs should indicate alias substitution when `--verbose` mode is enabled.
- Unit tests must confirm that alias resolution works correctly and that non-alias commands are processed normally.