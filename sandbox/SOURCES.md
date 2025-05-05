# GitHub Actions REST API
## https://docs.github.com/en/rest
The GitHub REST API documentation provides comprehensive, versioned reference for all REST endpoints you need to manage repositories, issues, branches, and workflow runs. It delivers precise request/response schemas, query parameters, and rate-limit handling guidance—critical when your agentic workflows call GitHub programmatically.
Last updated: 2024-05; License: CC BY 4.0

## CC BY 4.0

# GitHub Actions Workflow Syntax
## https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
This source details the full workflow-syntax schema, including triggers such as `workflow_call`, job matrix strategies, secrets handling, and artifacts uploads. It directly supports designing and invoking the agentic-lib workflows, ensuring correct YAML structure and runtime behaviors.
Last updated: 2024-04; License: CC BY 4.0

## CC BY 4.0

# GitHub Actions Toolkit (JavaScript)
## https://github.com/actions/toolkit/blob/main/docs/README.md
The official JavaScript toolkit for creating custom GitHub Actions. It provides typed helpers for logging, command parsing, and API interactions. This doc covers API surface, archetype project setup, and best practices for action inputs and outputs—key for extending agentic-lib.
Last updated: 2024-01; License: MIT

## MIT

# Octokit REST.js Client
## https://octokit.github.io/rest.js/v18
Octokit REST.js is the de facto JavaScript client for GitHub’s REST API. The documentation offers detailed examples of authentication, pagination, and response typings. Ideal for any agentic-lib component that must fetch or modify GitHub data robustly.
Last updated: 2024-06; License: MIT

## MIT

# AWS Lambda: Event Source Mapping for SQS
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
AWS official guide on integrating Amazon SQS with AWS Lambda, including event structure, batchItemFailure response patterns, and retry semantics. Essential for implementing and troubleshooting `digestLambdaHandler` logic in agentic-lib.
Last updated: 2024-02; License: Apache 2.0

## Apache 2.0

# AWS SDK for JavaScript v3: Lambda Client
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-lambda/index.html
Comprehensive reference for AWS SDK v3 Lambda client. Covers client configuration, invocation patterns, error handling, and pagination utilities—crucial when extending agentic-lib to invoke or manage Lambda functions from workflows.
Last updated: 2024-05; License: Apache 2.0

## Apache 2.0

# OpenAI Node.js API Reference
## https://platform.openai.com/docs/api-reference/chat
Provides detailed API schemas and usage examples for completion and chat endpoints, payload structures, and rate limiting. Critical for integrating `openai.createChatCompletion` calls in agentic-lib and handling error codes and streaming.
Last updated: 2024-06; License: CC BY 4.0

## CC BY 4.0

# Zod: TypeScript-First Schema Validation
## https://github.com/colinhacks/zod
Zod documentation covers schema definitions, parsing, error formatting, and integration patterns. It’s the backbone for agentic-lib’s configuration validation, ensuring environment variables and CLI inputs are correctly typed.
Last updated: 2024-04; License: MIT

## MIT

# dotenv: Environment Variable Loader
## https://github.com/motdotla/dotenv
Authoritative guide for loading environment variables from `.env` files, expanding variables, and customizing parsing. Core for managing sensitive API keys in `agentic-lib` across development and CI.
Last updated: 2024-03; License: BSD-2-Clause

## BSD-2-Clause

# Vitest: Modern Testing Framework
## https://vitest.dev/guide/
Vitest guide provides setup, mocking strategies, coverage reports, and snapshot testing. Vital for understanding how to write and extend unit tests for agentic-lib functions using Vite’s fast runner.
Last updated: 2024-05; License: MIT

## MIT

# Node.js ECMAScript Modules
## https://nodejs.org/api/esm.html
The definitive guide to using ES Modules in Node.js, covering import/export resolution, `type: module`, and interoperability with CommonJS. Ensures agentic-lib remains compliant with Node 20+ ESM standards.
Last updated: 2024-01; License: MIT

## MIT

# Probot Framework
## https://probot.github.io
Probot is a widely used framework for building GitHub Apps. Its documentation includes event handling patterns, rate limit strategies, and middleware support—offering architectural insights that can inform agentic-lib’s design for event-driven workflows.
Last updated: 2024-02; License: MIT

## MIT

# S3-SQS Bridge by xn-intenton-z2a
## https://github.com/xn-intenton-z2a/s3-sqs-bridge#readme
This library demonstrates event-driven bridging between S3 and SQS. Reviewing its architecture and README offers practical patterns for constructing and testing SQS events in agentic-lib.
Last updated: 2024-03; License: MIT

## MIT