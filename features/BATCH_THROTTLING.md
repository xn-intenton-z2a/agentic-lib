# Batch Throttling Enhancement

This feature introduces enforced limits on the number of commands that can be processed in a single batch. It ensures that when the environment variable MAX_BATCH_COMMANDS is set, any payload containing a number of commands exceeding this limit will be rejected with a clear error message. This enhancement is meant to prevent overload, improve performance consistency, and protect the agenticLib from processing an excessively large number of commands at once.

## Objectives

- Read and enforce the batch size limit defined by the environment variable MAX_BATCH_COMMANDS.
- Validate the incoming payload for batch processing and check if the length of the commands array exceeds the permitted limit.
- Return an error message if the batch size is too large, without altering the behavior of single command processing.
- Update documentation to clearly communicate the usage of MAX_BATCH_COMMANDS for batch throttling.

## Implementation Details

- In the agenticHandler function, check if the payload contains a "commands" array and if the environment variable MAX_BATCH_COMMANDS is set.
- Compare the number of commands with the MAX_BATCH_COMMANDS value. If the number of commands exceeds the limit, immediately return an error response that indicates the batch size has been exceeded.
- Ensure that when the limit is not exceeded, the existing batch processing logic continues to operate, including performance metrics and command logging.
- Update relevant sections in the README to document the usage and effect of setting MAX_BATCH_COMMANDS.
- Make necessary adjustments in the test files to include tests that verify the proper rejection of oversized batches.

## Testing and Verification

- Add unit tests to simulate payloads with command arrays that exceed the MAX_BATCH_COMMANDS limit. Verify that the response includes an appropriate error message and that no commands are processed.
- Verify that payloads within the acceptable limit are processed as usual and the response includes all expected fields (including any existing performance metrics, if applicable).
- Test the behavior when the MAX_BATCH_COMMANDS environment variable is not set; in this case, the feature should maintain current behavior.

## Documentation

- Update the README file to describe this new batch throttling functionality and provide examples on how to use the MAX_BATCH_COMMANDS environment variable.
- Ensure that the documentation clearly states that setting MAX_BATCH_COMMANDS enforces a hard limit on batch processing to prevent denial of service by a large number of commands.
