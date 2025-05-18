# Objective
Add a new CLI command that accepts a user prompt, invokes the OpenAI API, and prints the structured JSON response. This will enable users to run autonomous AI tasks directly from the command line.

# Value Proposition
By exposing an --agent flag, consumers can script calls to the AI agent without writing custom code. This simplifies integrating AI-driven logic into CI/CD pipelines, GitHub Actions, or local automation workflows.

# Requirements
1. Add a new processAgent(args) function that:
   • Detects --agent flag and reads the next argument as the prompt text.
   • Initializes OpenAI client with Configuration and OpenAIApi from the openai dependency.
   • Sends a chat completion request using a default model (e.g., gpt-4) with system and user messages.
   • Parses the assistant reply, expecting JSON content, and logs it via console.log.
2. Extend main(args) to call processAgent before other CLI handlers.
3. Ensure globalThis.callCount increments on each invocation of --agent.
4. Add automated tests to verify:
   • processAgent triggers an OpenAI API call with correct parameters.
   • Successful JSON is logged for valid responses.
   • logError is called when OpenAI throws an error.
5. Update README to document the --agent flag, usage example, and sample JSON output.

# Implementation
• Modify src/lib/main.js:
  • Import Configuration and OpenAIApi from openai.
  • Implement processAgent(args) as described in Requirements.
  • Invoke processAgent in main before other flags and return on success.
  • Increment globalThis.callCount each time processAgent runs.
• Update tests/unit/main.test.js:
  • Mock openai.OpenAIApi.createChatCompletion to return a dummy JSON string.
  • Test that running main(["--agent","test prompt"]) logs the parsed JSON object.
  • Test error handling when createChatCompletion rejects.
• Update sandbox/README.md:
  • Add section under CLI Usage for --agent with description and example.

# Verification & Acceptance
• Unit tests covering positive response and error scenarios.
• Manual test: run node src/lib/main.js --agent "Hello AI"
  and inspect parsed JSON printed to console.
• CI passes all tests with npm test.