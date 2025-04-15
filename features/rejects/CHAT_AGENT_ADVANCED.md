# CHAT_AGENT_ADVANCED Feature Specification

## Overview
This feature extends the existing Chat Agent functionality by allowing users to customize the conversational context through a configurable personality prompt. By reading an environment variable (e.g., OPENAI_CHAT_PERSONALITY), the chat agent can inject a custom system message into the Chat Completions API payload. This enhancement provides a tailored interactive experience while retaining robust error handling and logging.

## Implementation Details

### Source File Modifications (src/lib/main.js)
- **Enhance the Chat Function:**
  - Update the implementation of the `chatAgent` function to check for the `OPENAI_CHAT_PERSONALITY` environment variable.
  - If set, prepend a system message with the personality prompt to the messages sent to the OpenAI Chat Completions API.
  - Log the usage of the custom personality to help with debugging and auditing.
- **CLI Integration:**
  - Ensure that the CLI flag `--chat` continues to invoke the enhanced `chatAgent` function without affecting existing functionality.

### Testing Enhancements (tests/unit/main.test.js)
- **New Test Cases for Custom Personality:**
  - Add tests to simulate chat interactions with and without the `OPENAI_CHAT_PERSONALITY` set.
  - Verify that when the environment variable is provided, the payload passed to the Chat Completions API includes the custom system message.
  - Maintain tests for standard error and success scenarios to ensure full coverage of the chat handling logic.

### Documentation Updates (README.md)
- **Usage Section:**
  - Update the CLI usage examples to demonstrate how to configure the `OPENAI_CHAT_PERSONALITY` environment variable.
  - Provide example commands for invoking the chat agent with a custom personality prompt.

### Dependencies
- This feature leverages the existing `openai` package. No additional dependencies are introduced.

## Benefits & Success Criteria
- **Personalized Conversations:** Enables users to tailor the chat experience with a custom system prompt.
- **Improved Debuggability:** Enhanced logging provides visibility into the personality setting in use.
- **Backward Compatibility:** Retains existing chat functionality when no custom personality is provided.
- **Robust Testing:** New tests cover both scenarios (custom personality set and unset) ensuring reliability and ease of future maintenance.
