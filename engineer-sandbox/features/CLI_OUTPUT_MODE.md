# CLI_OUTPUT_MODE

## Objective and Scope
This feature extends the CLI functionality by allowing users to select the output format for command responses. By introducing a new flag (--output-mode), users can choose between JSON and plain text output. The default will remain JSON, ensuring backward compatibility.

## Implementation Details
- Update the main CLI processing in src/lib/main.js to parse an additional flag: --output-mode <json|text>.
- Create a helper function (e.g., parseOutputMode) that extracts the output mode from the command line arguments and sets a global variable (OUTPUT_MODE).
- Adjust all CLI outputs so that if OUTPUT_MODE is set to "text", output data is formatted as a more human-readable plain text summary. Otherwise, output will continue as JSON as before.
- Update the usage instructions in the help generation function to include the new --output-mode flag along with a description of its possible values.
- Update tests in the test files to cover scenarios where --output-mode is provided. Tests should verify that valid JSON output is produced with "json" mode, and a properly formatted plain text summary is produced with "text" mode.
- Update the README documentation to detail how the new flag can be used, including examples of both output formats.

## Success Criteria
- When invoking the CLI with the --output-mode flag, the command output matches the selected format (JSON or plain text).
- Unit tests should verify that all other flags continue to work, and that output formatting is switched accordingly.
- Documentation and CLI help must be updated to clearly describe the --output-mode functionality.

## User Impact
Users will benefit from having flexible output formatting options, improving usability for both machine parsing (JSON) and human-friendly display (text). This enhances the overall user experience and supports diverse use cases for the agentic-lib CLI.