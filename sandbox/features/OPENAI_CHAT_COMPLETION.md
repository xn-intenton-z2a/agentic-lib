# Objective & Scope
Add an asynchronous callOpenAI function to main.js that wraps the OpenAI chat completion API. This function accepts a sequence of chat messages and returns a structured response object. It enhances the library’s ability to drive agentic workflows by leveraging AI to generate plan suggestions, code snippets, or decision logic.

# Value Proposition
By exposing a lightweight wrapper over the OpenAI chat endpoint, downstream workflows and scripts can request AI completions without custom setup. This reduces boilerplate, centralizes error handling, and aligns with the agentic-lib mission of programmable autonomous operations.

# Success Criteria & Requirements
- callOpenAI is exported from src/lib/main.js and uses the OPENAI_API_KEY configuration.
- It accepts an array of messages in the format { role: string, content: string }.
- Returns the parsed JSON content from the AI response or throws a descriptive error.
- Logs errors via logError when the API call fails.
- All new lines are covered by automated tests in tests/unit/main.test.js.

# Implementation Details
- Import Configuration and OpenAIApi from "openai".
- Initialize a single OpenAIApi client using config.OPENAI_API_KEY.
- Export async function callOpenAI(messages).
- In callOpenAI:
  - Validate messages is a non-empty array.
  - Use createChatCompletion with model "gpt-4o" or default.
  - Parse the response choices to JSON.
  - Return the parsed object or propagate errors.

# User Scenarios & Examples
- Automated branch creation workflows can call callOpenAI to generate branch names based on issue descriptions.
- Review bots can call callOpenAI to format summaries of pull request diffs.

# Verification & Acceptance Criteria
- Unit tests mock the OpenAIApi to return a dummy JSON string and verify callOpenAI returns the correct object.
- Test failure scenarios: missing API key, invalid JSON responses.
- README is updated to document callOpenAI signature and usage examples.