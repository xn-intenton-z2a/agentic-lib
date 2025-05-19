# GitHub API & GraphQL (REST v3, GraphQL, Octokit & GitHub Apps Authentication)
## https://docs.github.com/en/rest
## https://docs.github.com/en/graphql
## https://docs.github.com/en/developers/apps/authenticating-with-github-apps
## https://github.com/octokit/rest.js#readme
## https://github.com/octokit/graphql.js#readme
This combined reference provides in-depth specifications of GitHub's REST API (v3), GraphQL API, and GitHub Apps authentication, including endpoint definitions, schema introspection, JWT generation and signing, installation access tokens, authentication flows, scopes, pagination strategies, rate limiting, and standardized error codes. The Octokit Rest.js and GraphQL.js clients complement these raw HTTP details with high-level JavaScript/TypeScript interfaces, offering type-safe method signatures, built-in pagination and retry helpers, and plugin/middleware architectures. Practical code snippets demonstrate direct HTTP interactions, App authentication workflows, batched GraphQL queries, and JWT-based token generation, ensuring seamless integration for repository management, advanced data retrieval, and secure App interactions in agentic-lib. Continuously updated by GitHub (last verified April 2024); highly authoritative as the official provider.
## License: CC BY 4.0 (GitHub REST & GraphQL & Apps), MIT (Octokit Rest.js & GraphQL.js)

# GitHub Actions Workflow Syntax
## https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
## https://docs.github.com/en/actions/using-workflows/reusing-workflows
The official guide specifies the complete YAML schema for GitHub Actions workflows, including event triggers (`on.push`, `workflow_call`), job definitions, matrix and concurrency strategies, environment variables, secret management, and permissions hardening. It also details authoring and invoking reusable workflows (`workflow_call`), composite actions, and best practices for security. Directly informs agentic-lib’s workflow templates to enforce robust automation composition and efficient CI/CD pipelines. Published March 2024; maintained by GitHub.
## License: CC BY 4.0

# GitHub Actions Toolkit
## https://github.com/actions/toolkit
This repository contains the official JavaScript toolkit for building custom GitHub Actions, including `@actions/core`, `@actions/github`, and supporting libraries. It provides structured APIs for reading inputs, setting outputs, logging, grouping steps, generating summaries, and interacting with the GitHub REST API. Practical examples demonstrate action development workflows, error handling, and testing strategies. Essential for authoring extensible and maintainable actions in agentic-lib. Last updated April 2024; MIT licensed.
## License: MIT

# Security Hardening for GitHub Actions
## https://docs.github.com/en/actions/learn-github-actions/security-hardening-for-github-actions
This official guide outlines advanced security practices for GitHub Actions, including least-privilege permissions, token scopes, secret management, dependency vulnerability scanning, and workflow isolation. It explains how to enforce `permissions` settings per job, use `environment` protection rules, and integrate security workflows. Provides actionable recommendations to minimize risk and ensure compliance for agentic-lib’s automation pipelines. Published February 2024; maintained by GitHub.
## License: CC BY 4.0

# AWS Serverless Integration: Lambda, SQS, and S3 Bridge Patterns
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-lambda/
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
## https://github.com/xn-intenton-z2a/s3-sqs-bridge#readme
This unified reference covers the AWS SDK v3 Lambda Client (InvokeCommand, middleware stack, credential resolution, retry strategies, TypeScript support), AWS Lambda Node.js handler patterns (`exports.handler` vs. async, context object, error handling, cold start, CloudWatch logging), SQS event mapping (batchItemFailures, dead-letter queues), and S3-to-SQS bridging using the s3-sqs-bridge library with IAM policy templates, batching configurations, and error-handling hooks. Provides actionable patterns for reliable, event-driven serverless workflows in agentic-lib. AWS docs updated February 2024; s3-sqs-bridge v0.24.0.
## License: Apache 2.0 (AWS), MIT (s3-sqs-bridge)

# OpenAI Node.js SDK
## https://platform.openai.com/docs/api-reference/chat/create
This reference details the Chat Completion API via the official OpenAI Node.js client, including request/response schemas, streaming vs. non-streaming modes, rate limits, and error-handling patterns. It provides concrete examples for constructing message payloads, handling partial streams, and managing API keys securely. Integral for implementing agentic-lib’s chat workflows with best practices for retries, backoff strategies, and telemetry. Last published April 2024; maintained by OpenAI.
## License: MIT

# Node.js Development Tools: ESM, dotenv & Zod
## https://nodejs.org/docs/latest-v20.x/api/esm.html
## https://github.com/motdotla/dotenv
## https://github.com/colinhacks/zod
This combined source covers Node.js ECMAScript Modules fundamentals (`import`/`export`, `type: module`, dynamic `import()`, loader hooks, CommonJS interoperability), dotenv for loading and validating environment variables, and Zod for declarative schema validation with type inference and runtime safety. Offers integration patterns to ensure modular code organization and configuration correctness in agentic-lib’s CLI and Lambda handlers. Documentation updated May 2024; dotenv v16.x (October 2023); Zod v3.x (December 2023).
## License: CC BY-SA 3.0 (Node), BSD-2-Clause (dotenv), MIT (Zod)

# Vitest Testing Framework & API Reference
## https://vitest.dev/guide/
## https://vitest.dev/api/
This source outlines Vitest’s end-to-end capabilities, including test suite creation, spies, stubs, snapshot testing, and coverage integration with V8 & Istanbul. It details lifecycle hooks (`beforeEach`, `afterAll`), configuration options (`vitest.config.ts`), CLI flags, and GitHub Actions integration for parallel test runs. Practical examples demonstrate mocking modules and custom reporters, directly supporting agentic-lib’s comprehensive test suite. Last updated March 2024; MIT licensed.
## License: MIT