# Purpose
Add comprehensive unit tests for error handling in the digestLambdaHandler function.

# Value Proposition
Ensure that digestLambdaHandler correctly identifies and reports invalid JSON payloads, generates appropriate fallback identifiers, and returns expected batch failures. This increases reliability and stability in SQS-based digest workflows by catching edge cases early.

# Success Criteria & Requirements
* Create tests that simulate valid and invalid SQS events.
* For invalid JSON payloads:
  - Use a record without a messageId to verify fallback identifier generation.
  - Use a record with a predefined messageId to verify correct itemIdentifier usage.
  - Confirm that logError is called twice: once for parsing failure and once for invalid payload details.
  - Assert that batchItemFailures array contains an object with the correct itemIdentifier.
* For valid JSON payloads:
  - Provide a record with a properly formatted body.
  - Verify that no errors are logged and batchItemFailures is empty.

# Implementation Details
1. In tests/unit/main.test.js, import digestLambdaHandler and reset console.error mocks before each test.
2. Mock Date.now and Math.random if necessary to stabilize fallback identifier patterns.
3. Write a test case "handles invalid JSON without messageId" that:
   - Constructs an event record { Records: [ { body: "not json" } ] }.
   - Calls digestLambdaHandler and awaits the result.
   - Verifies console.error was called twice and result.batchItemFailures contains an identifier matching fallback-0-<timestamp>-<random> pattern.
4. Write a test case "handles invalid JSON with messageId" that:
   - Uses record { Records: [ { messageId: "abc123", body: "bad" } ] }.
   - Calls digestLambdaHandler, asserts batchItemFailures contains { itemIdentifier: "abc123" }.
5. Write a test case "processes valid JSON" that:
   - Uses record { Records: [ { messageId: "m1", body: JSON.stringify({foo:1}) } ] }.
   - Calls digestLambdaHandler, asserts batchItemFailures is an empty array.
6. Ensure console.error and console.log mocks are restored after each test.

# Verification & Acceptance
* Run npm test and confirm three new tests pass.
* Ensure coverage reports include these new tests.
* Confirm no existing tests are broken or modified.
* Maintain consistent coding style and use Vitest for mocking and assertions.