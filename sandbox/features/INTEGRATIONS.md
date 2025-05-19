# Objective
Unify core agentic-lib integrations and extend functionality to include workflow status monitoring for comprehensive automation control via JavaScript library calls, CLI tool, and HTTP API.

# Value Proposition
Provide developers with a single SDK that:
 • Eliminates repetitive boilerplate for SQS event processing, AI chat, and workflow dispatch.
 • Enables real-time monitoring and log retrieval of GitHub Actions runs.
 • Simplifies end-to-end automation by combining event publishing, AI-driven decisions, workflow execution, and status monitoring in one consistent interface.

# Requirements
1 Dependencies & Configuration
 • Add @aws-sdk/client-sqs, express, openai to package.json if not present.
 • Ensure fetch or node-fetch is available for GitHub API calls.
 • Extend config schema to require OPENAI_API_KEY and GITHUB_TOKEN, support optional GITHUB_API_BASE_URL.

2 AWS SQS Functions
 • sendMessageToQueue(digest: object): read QUEUE_URL, send JSON digest, return result.
 • createSQSEventFromDigest(digest): wrap digest in SQS Records array.
 • digestLambdaHandler(event): process Records, parse JSON, log successes and collect batchItemFailures on error.

3 OpenAI Chat Functions
 • openAIChat(prompt: string): call OpenAIApi.createChatCompletion, return assistant message, handle and log errors.

4 GitHub Dispatch Functions
 • triggerGitHubWorkflow(repo: string, workflowId: string, ref?: string, inputs?: object): POST to GitHub Actions dispatch API, return status and response body, throw on non-2xx.

5 Workflow Status Monitoring Functions
 • getWorkflowRuns(repo: string, workflowId: string): GET list of workflow runs for specified workflow.
 • getWorkflowRunStatus(repo: string, runId: number): GET status and conclusion of a workflow run.
 • fetchWorkflowRunLogs(repo: string, runId: number): GET log archive URL, download and return raw logs.
 • waitForWorkflowCompletion(repo: string, runId: number, timeout?: number): poll run status until completion or timeout, return final status.

6 HTTP API Endpoints
 • POST /send-queue: accept JSON digest, call sendMessageToQueue.
 • POST /chat: accept prompt, call openAIChat.
 • POST /dispatch-workflow: accept repo, workflowId, optional ref and inputs, call triggerGitHubWorkflow, return JSON { status, details }.
 • GET /workflow-status: accept repo and runId query params, call getWorkflowRunStatus, return JSON { status, conclusion }.
 • GET /workflow-logs: accept repo and runId query params, call fetchWorkflowRunLogs, stream raw logs.

7 CLI Enhancements
 • Retain --digest, --version, --help flags.
 • Add --dispatch <repo> <workflowId> [ref] [inputs]: call triggerGitHubWorkflow.
 • Add --status <repo> <runId> [timeout]: call waitForWorkflowCompletion, print final status.
 • Add --logs <repo> <runId>: call fetchWorkflowRunLogs, output logs to stdout.

# User Scenarios & Examples
• Library Usage
  import { triggerGitHubWorkflow, waitForWorkflowCompletion } from 'agentic-lib'
  const dispatchResult = await triggerGitHubWorkflow('owner/repo', 'build.yml', 'main')
  const finalStatus = await waitForWorkflowCompletion('owner/repo', dispatchResult.runId)

• CLI Invocation
  agentic-lib --dispatch owner/repo build.yml main '{"env":"prod"}'
  agentic-lib --status owner/repo 12345 300000
  agentic-lib --logs owner/repo 12345

• HTTP Invocation
  curl -X GET http://localhost:3000/workflow-status?repo=owner/repo&runId=12345
  curl -X GET http://localhost:3000/workflow-logs?repo=owner/repo&runId=12345

# Verification & Acceptance
 • Unit tests mocking AWS SDK, OpenAI client, and fetch for dispatch and status functions.
 • HTTP endpoint tests with supertest mocking underlying functions.
 • CLI tests for --status and --logs flag scenarios.
 • All existing SQS, chat, and dispatch tests remain passing.
