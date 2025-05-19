# Objective

Unify core agentic-lib integrations for AWS SQS messaging, OpenAI conversational AI, and GitHub Actions workflow dispatch into a single consistent interface supporting JavaScript library calls, a CLI tool, and an HTTP API.

# Value Proposition

Provide developers with a drop-in SDK and utilities that eliminate repetitive boilerplate when:  
• Sending structured digests to SQS for event-driven processing.  
• Generating AI-driven conversational responses via OpenAI.  
• Programmatically triggering GitHub Actions workflows from code or HTTP endpoints.  

This feature empowers repositories to automate complex, agentic workflows seamlessly.

# Requirements

1 Dependencies & Configuration
  • Add @aws-sdk/client-sqs, express, openai to package.json.  
  • Extend config schema to require OPENAI_API_KEY and GITHUB_TOKEN, support optional GITHUB_API_BASE_URL.  

2 AWS SQS Functions
  • sendMessageToQueue(digest: object): read QUEUE_URL, send JSON digest, return result.  
  • createSQSEventFromDigest(digest): wrap digest in SQS Records array.  
  • digestLambdaHandler(event): process Records, parse JSON, log successes and collect batchItemFailures on error.

3 OpenAI Chat Functions
  • openAIChat(prompt: string): call OpenAIApi.createChatCompletion, return assistant message, handle and log errors.

4 GitHub Dispatch Functions
  • triggerGitHubWorkflow(repo: string, workflowId: string, ref?: string, inputs?: object): POST to GitHub Actions dispatch API, return status and response body, throw on non-2xx.

5 HTTP API Endpoints
  • POST /send-queue: accept JSON digest, call sendMessageToQueue.  
  • POST /chat: accept prompt, call openAIChat.  
  • POST /dispatch-workflow: accept repo, workflowId, optional ref and inputs, call triggerGitHubWorkflow, return JSON { status, details }.

6 CLI Enhancements
  • Retain --digest, --version, --help flags.  
  • Add --dispatch <repo> <workflowId> [ref] [inputs]: call triggerGitHubWorkflow, print details, exit 0 on success or non-zero on failure.

# User Scenarios & Examples

• Library Usage
  import { sendMessageToQueue, openAIChat, triggerGitHubWorkflow } from 'agentic-lib'
  const result = await triggerGitHubWorkflow('owner/repo', 'build.yml', 'main', { env: 'prod' })

• CLI Invocation
  agentic-lib --dispatch owner/repo build.yml main ' {"key":"value"} '

• HTTP Invocation
  curl -X POST http://localhost:3000/dispatch-workflow -H 'Content-Type: application/json' -d '{"repo":"owner/repo","workflowId":"ci.yml","ref":"main"}'

# Verification & Acceptance

• Unit tests for sendMessageToQueue, openAIChat, triggerGitHubWorkflow mocking AWS SDK, OpenAI client, and fetch.  
• HTTP endpoint tests with supertest or similar mocking underlying functions.  
• CLI tests for --dispatch flag scenarios.  
• All existing SQS and chat tests remain passing.  
