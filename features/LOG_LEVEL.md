# LOG_LEVEL Enhancement

This feature introduces the ability to control the verbosity of log output based on an environment variable. By setting the LOG_LEVEL variable, users can limit logs to essential messages. For example, setting LOG_LEVEL to "error" will suppress info logs and only output error messages.

## Objectives

- Enable dynamic log filtering based on LOG_LEVEL environment variable.
- If LOG_LEVEL is set to "error", then only error logs should be printed.
- A default behavior of printing both info and error logs should be maintained if LOG_LEVEL is not set or set to a level that includes info.

## Implementation Details

- Update the logInfo function in the source file to check for process.env.LOG_LEVEL. If it is set to "error", do not output info level logs.
- Ensure that logError continues to output error logs regardless of the LOG_LEVEL setting.
- Update the logging in logConfig to respect the user-defined logging level if applicable.
- Modify the CLI documentation (README if needed) to include instructions for configuring the LOG_LEVEL environment variable and explain its effect.

## Testing and Verification

- Add or update unit tests in tests/unit/main.test.js to simulate different LOG_LEVEL settings. For instance, set LOG_LEVEL to "error" and verify that calls to logInfo do not result in any log output.
- Confirm that when LOG_LEVEL is not set or is set to a non-restrictive level, both logInfo and logError messages are printed as expected.
- Ensure that the changes do not affect the existing behavior of performance metrics or other parts of the CLI functionality.

## Success Criteria

- Users can set LOG_LEVEL to "error" (or other future levels) to filter out less important log messages.
- All unit tests pass, ensuring that both the default logging behavior and filtered behavior under LOG_LEVEL work as specified.
- The feature adds measurable value by improving observability and control over log outputs without impacting existing functionalities.