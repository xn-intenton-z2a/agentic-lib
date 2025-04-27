# Batch Throttling and Deduplication Enhancement

This feature upgrades the batch processing logic to introduce two key aspects: enforcing a maximum limit on the number of commands and filtering out duplicate commands in a batch. Both capabilities act to improve overall performance and reliability by ensuring that only a valid, unique set of commands is processed.

## Objectives

- Enforce a command limit based on the environment variable MAX_BATCH_COMMANDS. If the number of commands in the payload exceeds this limit, the batch is immediately rejected with an error message.
- Scan the payload’s commands array for duplicate entries. Filter out duplicates so that each unique command is processed only once, thus avoiding redundant processing and unintended increment of the invocation counter.
- Maintain compatibility with existing performance metrics tracking and logging details, ensuring that any deduplication logic is seamlessly integrated with the current processing flow.
- Update the documentation in the README to clearly describe both the batch throttling and deduplication behavior when processing a batch of commands.

## Implementation Details

- In the agenticHandler function, check if the payload includes a "commands" array. First, verify the count against the MAX_BATCH_COMMANDS limit if the environment variable is set. If the limit is exceeded, return an error without processing the commands.
- Next, scan the commands array for duplicates. Remove duplicate entries before processing to minimize unintended side-effects and reduce resource usage.
- Continue processing the filtered list of commands, incrementing the global invocation counter and computing individual execution times as before. Maintain the aggregated performanceMetrics if batch processing is performed.
- Update unit tests to ensure that a payload with duplicate commands results in only one execution per unique command. Also, verify that the throttling logic still properly rejects payloads exceeding the maximum command limit.

## Success Criteria

- Payloads containing duplicate commands are processed by executing only unique commands, with duplicates filtered out without error.
- When MAX_BATCH_COMMANDS is set, payloads exceeding the limit are rejected with a clear error message.
- The aggregated performance metrics remain accurate after deduplication, and unit tests confirm the expected behavior.
- README documentation is updated to include details on both batch size throttling and command deduplication.
