# CUSTOM_DIGEST Feature

This feature adds a new CLI flag called --custom-digest to allow users to provide their own digest payload as a JSON string. The CLI will parse the input JSON and then route it through the existing digestLambdaHandler. In case of JSON parsing errors or invalid payload formats, the system logs detailed error messages. This enhancement empowers users to test and simulate various SQS message scenarios without modifying the source code.

# Implementation Details

1. Modify the main source file (src/lib/main.js) to check if the CLI arguments contain "--custom-digest". If present, the flag should be followed by a JSON string representing the digest.

2. Validate the provided JSON string; if valid, convert it to an object and pass it to the createSQSEventFromDigest function to simulate an SQS event. Then invoke digestLambdaHandler with the event.

3. If the JSON is invalid, use the logError function to display a detailed error message and exit gracefully.

4. Update the CLI usage instructions to include documentation for the new --custom-digest flag so that users can understand how to use it.

# Testing and Documentation

1. Update the test file (tests/unit/main.test.js) to include unit tests that simulate passing a valid JSON string using the --custom-digest flag. Also test the error flow by providing an invalid JSON string.

2. Update the README file (sandbox/README.md) to document the new --custom-digest flag along with examples of valid usage.

3. Ensure the feature adheres to the guidelines in CONTRIBUTING.md by providing clear acceptance criteria and thorough test coverage.

# Benefits

- Provides enhanced control and flexibility to simulate different SQS events via the CLI.
- Increases testability by allowing custom payload injection for the digest lambda handler.
- Improves user experience by integrating error-handling and clear usage instructions directly into the CLI.
