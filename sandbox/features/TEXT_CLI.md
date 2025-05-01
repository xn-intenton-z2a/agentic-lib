# Overview
This feature extends the command line interface (CLI) to directly expose the text processing utilities simpleEcho and simpleReverse. Users will be able to invoke these functions through new CLI flags, providing an immediate and interactive way to test and use the library's core functionality.

# Implementation Details
1. Update the main CLI in src/lib/main.js to detect two new flags --echo and --reverse. When either flag is present, the CLI should expect an additional argument representing the string input.
   - For --echo, import and call simpleEcho from sandbox/source/simpleFunction.js, then output the returned greeting message.
   - For --reverse, import and call simpleReverse, then output the reversed string.
2. Enhance the generateUsage function to include instructions for the new flags --echo and --reverse, describing their expected input and usage.
3. Update the existing tests (in sandbox/tests/simpleFunction.test.js and tests/unit/main.test.js) to include scenarios for the new CLI commands, verifying that the correct output is produced and that invalid input is handled as expected.
4. Update the README and any CLI usage documentation to describe the new functionality, offering examples of how to call the commands from the terminal.

# Success Criteria
- The CLI correctly processes the --echo and --reverse flags along with a provided string argument.
- When invoked with --echo followed by a valid string, the CLI outputs a greeting in the format "Hello, <trimmed input>".
- When invoked with --reverse followed by a valid string, the CLI outputs the reversed version of the trimmed input.
- Appropriate error messages are displayed if no input is provided or if the input is invalid.
- Unit tests and integration tests pass, confirming that both functions are correctly wired into the CLI.

# User Impact
- Users can quickly test and use the library's core text processing functions without writing additional code.
- The enhanced CLI makes the tool more interactive and user-friendly, aligning with the library's mission to support autonomous workflows and in-situ code testing.
- Developers benefit from improved documentation and test coverage, ensuring reliable and consistent behavior of the text processing utilities.
