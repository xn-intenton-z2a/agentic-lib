# Objective
Add a new --chat flag to the CLI allowing users to send a prompt to the OpenAI API and receive a completion.

# Value Proposition
With this feature, developers can experiment with and integrate AI-driven chat completions directly from the CLI using their existing OPENAI_API_KEY environment setup, simplifying local testing, debugging, and automation scenarios without additional scripts.

# Requirements
1. Detect a --chat flag in the CLI argument parser before existing commands.
2. Require a --prompt parameter followed by the prompt text; fail with a clear error if missing.
3. Read OPENAI_API_KEY from environment variables; fail if undefined.
4. Import Configuration and OpenAIApi from the openai package.
5. Instantiate an OpenAIApi client using the environment API key.
6. Call createChatCompletion with model gpt-3.5-turbo and the provided prompt.
7. Upon success, log the completion text via logInfo; include full raw response if VERBOSE_MODE is true.
8. On error, log via logError with error.stack if VERBOSE_MODE is true and exit with non-zero status.
9. After execution, if VERBOSE_STATS is true, log callCount and uptime.
10. Maintain existing behavior for other flags when --chat is absent.

# Implementation
Modify src/lib/main.js to:
1. Add a processChat function that checks for --chat and extracts --prompt value.
2. Within processChat, verify OPENAI_API_KEY, instantiate OpenAIApi, and await createChatCompletion.
3. Use logInfo to output the chat completion and logError on failures.
4. Integrate VERBOSE_MODE and VERBOSE_STATS flags in processChat identical to existing flags.
5. Insert processChat invocation in main before processDigest.

# Tests & Verification
1. In tests/unit/main.test.js, add tests invoking main with ["--chat","--prompt","Hello"] mocking OpenAIApi to verify correct API instantiation and parameters.
2. Simulate OpenAI API errors to ensure logError is called and process exits with non-zero status.
3. Verify verbose and stats flags correctly augment chat output and append metrics.
4. Ensure existing tests for other commands remain unaffected.

# Documentation
1. Update sandbox/README.md under CLI Usage Flags to include --chat and --prompt examples.
2. Document required OPENAI_API_KEY environment variable and show sample JSON log entries for both success and error cases.
