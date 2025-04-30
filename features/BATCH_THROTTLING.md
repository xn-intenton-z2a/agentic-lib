# Batch Throttling, Deduplication, and Alias Mapping Enhancement

## Objectives
This update expands the existing batch throttling and deduplication feature by introducing command alias mapping. In addition to enforcing a maximum number of commands and filtering out duplicates within a command batch, the feature now performs an alias substitution step. When the environment variable COMMAND_ALIASES is set with a JSON mapping, any command that matches an alias key is replaced with its corresponding full command before further processing. This enhancement applies both to single command payloads and array-based batch payloads and ensures consistent and expected command processing.

## Implementation Details
- In the agenticHandler function, before processing the commands (both for payload.command and payload.commands), check if process.env.COMMAND_ALIASES is defined. If it is set, attempt to parse it as JSON into a mapping object.
- For a single command, if the command string exactly matches a key in the alias mapping, replace it with the mapped value.
- For batch commands in the payload.commands array, iterate through each command and perform the alias substitution in the same manner.
- Maintain the existing functionality for batch throttling by enforcing the MAX_BATCH_COMMANDS environment variable limit. Additionally, continue to deduplicate commands so that only unique commands are processed once.
- Ensure that these alias mapping steps execute prior to any deduplication and performance metric calculations, ensuring that the final processed commands reflect any alias substitution.
- Update inline documentation and CLI help text in the source file to indicate support for alias mapping via the COMMAND_ALIASES environment variable.

## Testing and Verification
- Update unit tests in tests/unit/main.test.js with new scenarios where the COMMAND_ALIASES environment variable is set. Tests should ensure that when a command or a batch of commands includes keywords that match a key in the mapping, these are correctly substituted before processing.
- Verify that alias substitution works in conjunction with batch throttling and deduplication. For instance, if an alias substitution results in duplicate commands, confirm that only one unique instance is processed.
- Update README documentation to explain and provide usage examples for alias mapping. Include details on how to set the COMMAND_ALIASES environment variable as a JSON mapping and its effect on command processing.
- Ensure all existing and new tests pass, verifying that the system remains backward compatible and that performance metrics still accurately reflect command execution times.

## Success Criteria
- The agenticHandler properly substitutes command aliases as defined in the COMMAND_ALIASES environment variable for both single and batch processing.
- Batch commands continue to be throttled based on the MAX_BATCH_COMMANDS setting, and duplicate commands (whether post alias substitution or originally) are filtered out.
- The aggregated performance metrics remain accurate after alias substitution, deduplication, and batch throttling.
- All unit tests, including those for alias mapping scenarios, pass with the expected outcomes.
- README and CLI help text are updated to reflect this additional command alias mapping functionality.