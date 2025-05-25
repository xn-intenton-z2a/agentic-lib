# Objective
Implement an agenticHandler function that provides a simple interface to the OpenAI ChatCompletion API for generating, refining, or summarizing content based on a prompt. The handler should increment global callCount, return structured output, and integrate with existing logging utilities.

# Value Proposition
Expose a programmatic interface for leveraging OpenAI models directly from the library. This empowers clients to perform content generation, refinement, and summarization tasks within automated workflows or CLI contexts without manual API calls.

# Success Criteria & Requirements
- Add an export function agenticHandler(prompt: string, options?: {model?: string, temperature?: number}) returning a Promise of parsed JSON response from the OpenAI API.
- Ensure each invocation increments globalThis.callCount.
- Integrate logInfo to record start and completion events with prompt and response metadata.
- Validate the prompt argument using zod to ensure it is a non-empty string.
- Default model to text-davinci-003 and temperature to 0.7 if not provided.

# Dependencies & Constraints
- Use the existing openai dependency; import Configuration and OpenAIApi.
- Do not add new external dependencies beyond supertest for testing.
- Ensure compatibility with Node 20 and ESM.

# User Scenarios & Examples
1. Programmatic call from another module:

   ```js
   import { agenticHandler } from "@xn-intenton-z2a/agentic-lib";
   const result = await agenticHandler("Summarize these release notes:", { temperature: 0.5 });
   console.log(result);
   ```

2. CLI integration (future): can be wired to a --agentic flag to accept user prompts.

# Verification & Acceptance
- Create unit tests in tests/unit/agenticHandler.test.js mocking openai.createChatCompletion to return a dummy response and verify output parsing.
- Test that callCount increments after each call.
- Test error handling when API throws an error: agenticHandler should logError and rethrow.
- Ensure zod validation rejects empty prompts with a descriptive error.
