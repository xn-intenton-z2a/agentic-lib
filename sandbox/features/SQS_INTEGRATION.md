# Objective

Expand the library and CLI to fully integrate with AWS SQS end to end, add a lightweight HTTP API server exposing REST endpoints to send digests to SQS and trigger the digest handler locally, and provide OpenAI chat completion capabilities via CLI and HTTP for interactive prompt handling.

# Value Proposition

Deliver a unified interface for SQS operations and conversational chat functionality using OpenAI, accessible via both CLI and HTTP endpoints. Simplify message workflows, testing, and enable dynamic content generation or refinement through AI without additional boilerplate.

# Requirements

1 Dependencies
   - Ensure dependency on @aws-sdk/client-sqs is present in package.json
   - Ensure dependency on express is present in package.json
   - Add or update dependency on openai in package.json

2 SQS Functions
   - sendMessageToQueue(digest : object) reads QUEUE_URL environment variable, constructs a SendMessageCommand with the JSON digest, sends the message and returns the command result
   - createSQSEventFromDigest(digest) returns a valid SQS event record wrapping the digest in a Records array
   - digestLambdaHandler(sqsEvent) logs the incoming event, parses JSON bodies, collects batchItemFailures and returns the list with handler identifier

3 HTTP Server
   - Implement startHttpServer(port : number) that creates an express app with JSON body parsing and CORS
   - Add endpoint POST /send-queue that accepts a JSON digest body, calls sendMessageToQueue, and responds with message id and status or error with status codes 4xx or 5xx
   - Add endpoint POST /digest that accepts a JSON digest body, creates an SQS event via createSQSEventFromDigest, calls digestLambdaHandler, and responds with batch item failures list and status 200
   - Add endpoint POST /chat that accepts a JSON body with field prompt, calls openAIChat, and responds with the chat completion content or error with appropriate status code
   - On server start log an info message with the listening port

4 OpenAI Chat Functions
   - openAIChat(prompt : string) reads OPENAI_API_KEY from config, initializes OpenAIApi with Configuration, calls createChatCompletion using model gpt-3.5-turbo and returns the assistant text
   - Handle API errors by logging and returning descriptive error responses

5 CLI Enhancements
   - Add the flag serve [port] to start the HTTP server on the specified port defaulting to 3000
   - Add the flag chat <prompt> to invoke openAIChat with the provided prompt and output the result or error to the console
   - Update usage instructions in generateUsage to include serve and chat flags with examples

6 Tests
   - Write sandbox tests for HTTP endpoints mocking sendMessageToQueue and openAIChat to verify success and error paths for POST /send-queue, POST /digest, and POST /chat
   - Write sandbox tests for CLI --chat flag success and error scenarios using vitest and mocks for openai
   - Ensure existing unit tests for sendMessageToQueue, createSQSEventFromDigest, digestLambdaHandler, and CLI flags continue to pass unchanged

7 Documentation
   - Update sandbox README to document startHttpServer API, HTTP endpoints, and the chat endpoint with example curl commands
   - Add CLI usage section for serve and chat flags with inline examples

# Verification and Acceptance

- All tests pass with coverage for new code paths
- POST /chat returns JSON with field completion and status 200 or error status for missing prompt or API failures
- CLI --chat outputs the completion to the console and exits with code 0 on success or non-zero on error
- Linting, formatting, and dependency installation succeed without errors