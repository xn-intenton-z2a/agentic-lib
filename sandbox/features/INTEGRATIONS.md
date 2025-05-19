# Objective
Extend and unify agentic-lib core integrations to deliver a complete automation SDK for SQS event processing, AI chat, GitHub workflow dispatch, real-time status monitoring, and GitHub issue and branch management.

# Value Proposition
Provide developers with a single, consistent SDK that:
 • Eliminates repetitive boilerplate for SQS event creation and lambda handling
 • Enables AI-driven chat interactions via OpenAI with error handling and logging
 • Automates GitHub Actions dispatch, monitors run status, and retrieves logs
 • Manages GitHub issues and repository branches to support autonomous workflow communication
 • Exposes functionality via JavaScript library, HTTP API, and CLI flags for end-to-end automation

# Requirements
1 Dependencies & Configuration
 • Ensure @aws-sdk/client-sqs, express, openai, node-fetch or fetch are in dependencies
 • Extend config schema to require OPENAI_API_KEY, GITHUB_TOKEN, optional GITHUB_API_BASE_URL

2 AWS SQS Functions
 • sendMessageToQueue(digest: object): read QUEUE_URL, send JSON digest, return result
 • createSQSEventFromDigest(digest): wrap digest in SQS Records array
 • digestLambdaHandler(event): process records, log successes, collect batchItemFailures on error

3 OpenAI Chat Functions
 • openAIChat(prompt: string): call OpenAIApi.createChatCompletion, return assistant message, handle and log errors

4 GitHub Workflow Dispatch
 • triggerGitHubWorkflow(repo: string, workflowId: string, ref?: string, inputs?: object): dispatch workflow, return runId

5 Workflow Status Monitoring
 • getWorkflowRuns(repo: string, workflowId: string)
 • getWorkflowRunStatus(repo: string, runId: number)
 • fetchWorkflowRunLogs(repo: string, runId: number)
 • waitForWorkflowCompletion(repo: string, runId: number, timeout?: number)

6 GitHub Issue & Branch Management Functions
 • createIssue(repo: string, title: string, body: string): POST /repos/{repo}/issues
 • commentOnIssue(repo: string, issueNumber: number, comment: string): POST /repos/{repo}/issues/{issueNumber}/comments
 • createBranch(repo: string, branchName: string, fromRef: string): GET default ref, POST new ref
 • mergeBranch(repo: string, pullNumber: number, commitMessage?: string): POST merge
 • deleteBranch(repo: string, branchName: string): DELETE ref

7 HTTP API Endpoints
 • POST /send-queue: call sendMessageToQueue
 • POST /chat: call openAIChat
 • POST /dispatch-workflow: call triggerGitHubWorkflow
 • GET /workflow-status: call getWorkflowRunStatus
 • GET /workflow-logs: stream fetchWorkflowRunLogs
 • POST /issues: call createIssue
 • POST /issues/comments: call commentOnIssue
 • POST /branches/create: call createBranch
 • POST /branches/merge: call mergeBranch
 • DELETE /branches: call deleteBranch

8 CLI Enhancements
 • --dispatch <repo> <workflowId> [ref] [inputs]
 • --status <repo> <runId> [timeout]
 • --logs <repo> <runId>
 • --issue <repo> <title> <body>
 • --comment <repo> <issueNumber> <comment>
 • --create-branch <repo> <branchName> <fromRef>
 • --merge-branch <repo> <pullNumber> [commitMessage]
 • --delete-branch <repo> <branchName>

# User Scenarios & Examples
• Library Usage
  import { createIssue, waitForWorkflowCompletion } from 'agentic-lib'
  const issue = await createIssue('owner/repo', 'Bug report', 'Details');
  const finalStatus = await waitForWorkflowCompletion('owner/repo', 1234)

• CLI Invocation
  agentic-lib --issue owner/repo "New task" "Please implement X"
  agentic-lib --create-branch owner/repo feature-1 main

• HTTP Invocation
  curl -X POST http://localhost:3000/issues -d '{"repo":"owner/repo","title":"Issue","body":"Desc"}'

# Verification & Acceptance
 • Unit tests mocking AWS SDK, OpenAI, fetch for dispatch, status, issues, branches
 • HTTP endpoint tests with supertest for new routes, mocking underlying functions
 • CLI tests for new flags, verifying exit codes and console outputs
 • Ensure all existing SQS, chat, dispatch tests remain passing