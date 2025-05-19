# Mission Statement

**agentic‑lib** Is a JavaScript library which can be used as a drop in JS implementation or wholesale replacement for 
the steps, jobs, and re-usable workflows below in this repository. It is designed to be used in a GitHub Actions 
workflow to enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate
through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be
invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.
## Maintain Feature at 2025-05-19T22:20:41.629Z

Maintained feature DIGEST_VALIDATION.

Git diff:

```

```

LLM API Usage:

```json
{"prompt_tokens":6119,"completion_tokens":1996,"total_tokens":8115,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1600,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Feature to Issue at 2025-05-19T22:21:50.814Z

Generated feature development issue https://github.com/xn-intenton-z2a/agentic-lib/issues/1535 with title:

Implement DIGEST_VALIDATION: Add Zod schema validation in digestLambdaHandler

And description:

Summary

Enhance `digestLambdaHandler` to enforce a Zod schema for incoming SQS digest messages. This will ensure only well-formed payloads (with required `key`, `value`, and an ISO `lastModified` timestamp) are processed, while any malformed messages are logged with detailed errors and returned as `batchItemFailures`.

Changes to Apply

1. src/lib/main.js
   - Import `ZodError` from `zod` alongside `z`.
   - Define a new `digestSchema`:
     ```js
     export const digestSchema = z.object({
       key: z.string(),
       value: z.string(),
       lastModified: z.string().refine(
         (val) => !isNaN(Date.parse(val)),
         { message: 'Invalid ISO timestamp' }
       ),
     });
     ```
   - In `digestLambdaHandler`, replace the existing single `JSON.parse` try/catch with a two-stage validation:
     ```js
     for (const [index, record] of sqsEventRecords.entries()) {
       let parsed;
       try {
         parsed = JSON.parse(record.body);
       } catch (error) {
         handleParseError();
         continue;
       }
       try {
         const digest = digestSchema.parse(parsed);
         logInfo(`Record ${index}: Valid digest: ${JSON.stringify(digest)}`);
         // existing processing continues here
       } catch (error) {
         if (error instanceof ZodError) {
           logError(`Validation failed for record ${index}`, error);
           logError(`Raw message: ${record.body}`);
         } else {
           logError(`Unexpected error processing record ${index}`, error);
         }
         const recordId = record.messageId || `fallback-${index}`;
         batchItemFailures.push({ itemIdentifier: recordId });
         continue;
       }
     }
     ```
   - Ensure import of `ZodError` and adjust logging and control flow accordingly.

2. tests/unit/main.test.js
   - Add unit tests for `digestLambdaHandler` covering:
     - A valid digest event returns `{ batchItemFailures: [] }` and logs a valid digest message.
     - A payload missing a required field (e.g., no `value`) results in a `batchItemFailures` entry and logs a Zod validation error.
     - A payload with an invalid `lastModified` timestamp likewise yields a failure and logs the specific timestamp error.
   - Use the existing `createSQSEventFromDigest` helper to generate events, and spy on `logError`/`logInfo` to assert correct behavior.

3. sandbox/README.md
   - Document the new `digestSchema` and validation behavior under the section for `digestLambdaHandler`:
     - Explain that incoming messages are validated at runtime.
     - List the required fields and timestamp format.
     - Describe that invalid messages are logged and returned in `batchItemFailures` for AWS to retry.

No changes are needed to dependencies (`package.json`).

Verification

After applying these changes, running `npm test` should pass all existing and new tests, and invoking `npm run start -- --digest` with both valid and invalid payloads should demonstrate correct logs and batch failure reports. Ensure logs include clear Zod validation messages for invalid inputs.

LLM API Usage:

```json
{"prompt_tokens":6710,"completion_tokens":2387,"total_tokens":9097,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1600,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

