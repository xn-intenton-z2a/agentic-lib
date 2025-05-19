# Objective

Unify AWS SQS messaging, OpenAI conversational AI, and GitHub Actions workflow dispatch into a single JavaScript library, CLI, and HTTP API.

# Value Proposition

Provide a consistent interface for sending digests to SQS, generating AI-driven chat responses, and triggering GitHub Actions workflows programmatically, reducing boilerplate and simplifying automation in agentic workflows.

# Requirements

1 Dependencies
   - Ensure dependencies on @aws-sdk/client-sqs, express, and openai are present in package.json
   - Add GITHUB_TOKEN to environment configuration and extend the zod config schema to include GITHUB_TOKEN as a required string
   - Use Node 20 built-in fetch API for GitHub HTTP calls

2 AWS SQS Functions
   - sendMessageToQueue(digest: object): read QUEUE_URL, send JSON digest via SendMessageCommand, return command result
   - createSQSEventFromDigest(digest): wrap digest in a valid SQS Records array
   - digestLambdaHandler(sqsEvent): parse and process records, collect batchItemFailures, return failures and handler identifier

3 OpenAI Chat Functions
   - openAIChat(prompt: string): read OPENAI_API_KEY, initialize OpenAIApi, call createChatCompletion with model gpt-3.5-turbo, return assistant message content
   - Handle API errors with logError and descriptive error responses

4 GitHub Dispatch Functions
   - Extend config schema to include GITHUB_TOKEN
   - triggerGitHubWorkflow(repo: string, workflowId: string, ref?: string, inputs?: object):
     use fetch to POST to {GITHUB_API_BASE_URL}/repos/{repo}/actions/workflows/{workflowId}/dispatches
     include headers Authorization: token GITHUB_TOKEN and content-type application/json
     payload must include ref and optional inputs
     return response status and JSON body or throw on non-2xx
   - logInfo on dispatch initiation and logError on failures

5 HTTP Server
   - Extend startHttpServer(port: number) to register existing endpoints POST /send-queue, /digest, /chat
   - Add endpoint POST /dispatch-workflow accepting JSON with fields repo, workflowId, optional ref, inputs
   - Endpoint calls triggerGitHubWorkflow and responds with JSON {status, details} on 200 or error with 4xx/5xx codes
   - On server start log an info message with listening port

6 CLI Enhancements
   - Retain existing flags serve [port] and chat <prompt>
   - Add flag dispatch <repo> <workflowId> [ref] [inputs]
     calls triggerGitHubWorkflow, prints success details or error, exits with code 0 on success, non-zero on failure
   - Update generateUsage to document dispatch flag usage and examples

7 Tests
   - Write unit tests for triggerGitHubWorkflow mocking global fetch to simulate success and error
   - Add HTTP endpoint tests for POST /dispatch-workflow in sandbox tests using mocks for triggerGitHubWorkflow
   - Add CLI --dispatch flag tests for success and failure scenarios mocking fetch
   - Ensure all existing tests for SQS and chat remain passing

8 Documentation
   - Update README in sandbox to include dispatch endpoint and CLI dispatch flag with example curl and CLI commands
   - Link to MISSION.md, CONTRIBUTING.md, LICENSE, and repository home