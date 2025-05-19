# GitHub API & GraphQL (REST v3, GraphQL, Octokit & GitHub Apps Authentication)
## https://docs.github.com/en/rest
## https://docs.github.com/en/graphql
## https://docs.github.com/en/developers/apps/authenticating-with-github-apps
## https://github.com/octokit/rest.js#readme
## https://github.com/octokit/graphql.js#readme
This combined reference provides in-depth specifications of GitHub's REST API (v3), GraphQL API, and GitHub Apps authentication, including endpoint definitions, schema introspection, JWT generation and signing, installation access tokens, authentication flows, scopes, pagination strategies, rate limiting, and standardized error codes. The Octokit Rest.js and GraphQL.js clients complement these raw HTTP details with high-level JavaScript/TypeScript interfaces, offering type-safe method signatures, built-in pagination and retry helpers, and plugin/middleware architectures. Practical code snippets demonstrate direct HTTP interactions, App authentication workflows, batched GraphQL queries, and JWT-based token generation, ensuring seamless integration for repository management, advanced data retrieval, and secure App interactions in agentic-lib. Continuously updated by GitHub (last verified April 2024); highly authoritative as the official provider.
## License: CC BY 4.0 (GitHub REST & GraphQL & Apps), MIT (Octokit Rest.js & GraphQL.js)

# GitHub Actions Ecosystem
## https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
## https://docs.github.com/en/actions/using-workflows/reusing-workflows
## https://docs.github.com/en/actions/learn-github-actions/security-hardening-for-github-actions
## https://github.com/actions/toolkit
This unified source covers the full gamut of GitHub Actions automation, including workflow YAML syntax, reusable workflows, security hardening guidelines (least-privilege permissions, secret management, and workflow isolation), and the official JavaScript toolkit for building custom actions (@actions/core, @actions/github). It provides in-depth technical specifications for event triggers, job configuration, composite actions, environment protection rules, and plugin architectures. Practical examples and best practices ensure secure, maintainable, and efficient CI/CD pipelines within agentic-lib. Published between Feb–Apr 2024; highly authoritative as official GitHub documentation and toolkit repositories.
## License: CC BY 4.0 (documentation), MIT (actions/toolkit)

# AWS Serverless & Infrastructure as Code Patterns
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-lambda/
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
## https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib-readme.html
## https://github.com/xn-intenton-z2a/s3-sqs-bridge#readme
This comprehensive source integrates AWS Serverless patterns—covering the AWS SDK v3 Lambda client (InvokeCommand, middleware stack, credential resolution, retry strategies, TypeScript support), SQS event mappings with batch failure handling and dead-letter queue configurations, and infrastructure-as-code best practices via AWS CDK v2 for TypeScript. It also details S3-to-SQS bridging using the s3-sqs-bridge library, including IAM policy templates, batching configurations, and error-handling hooks. Emphasizes actionable, code-first patterns for reproducible, event-driven workflows and modular infrastructure in agentic-lib. Documentation updated April 2024; s3-sqs-bridge v0.24.0.
## License: Apache 2.0 (AWS), MIT (s3-sqs-bridge)

# LocalStack for Local AWS Testing
## https://docs.localstack.cloud/getting-started/
This source provides essential guidance for using LocalStack to simulate AWS services locally, including Lambda invocation, SQS event testing, S3 event triggers, and CDK deployments in a local Docker environment. It covers setup via Docker Compose, service lifecycle management, and integration testing strategies to validate serverless workflows without deploying to real AWS. Ideal for faster feedback loops and cost-effective development. Last updated May 2024; maintained by LocalStack.
## License: Apache 2.0

# OpenAI Node.js SDK & Function Calling
## https://platform.openai.com/docs/api-reference/chat/create
## https://platform.openai.com/docs/guides/gpt/function-calling
This combined reference details the Chat Completion API via the official OpenAI Node.js client, including request/response schemas, streaming vs. non-streaming modes, rate limits, error-handling patterns, and the new function-calling capability. It provides concrete examples for constructing message payloads, defining function schemas, handling partial streams, and managing API keys securely. Integral for implementing agentic-lib’s chat workflows with best practices for retries, backoff strategies, telemetry, and automated function invocations. Last published April 2024; maintained by OpenAI.
## License: MIT

# Node.js Development Tools: ESM, dotenv & Zod
## https://nodejs.org/docs/latest-v20.x/api/esm.html
## https://github.com/motdotla/dotenv
## https://github.com/colinhacks/zod
This combined source covers Node.js ECMAScript Modules fundamentals (import/export, package "type": module, dynamic import(), loader hooks, CommonJS interoperability), dotenv for loading and validating environment variables, and Zod for declarative schema validation with type inference and runtime safety. Offers integration patterns to ensure modular code organization and configuration correctness in agentic-lib’s CLI and Lambda handlers. Documentation updated May 2024; dotenv v16.x (October 2023); Zod v3.x (December 2023).
## License: CC BY-SA 3.0 (Node.js), BSD-2-Clause (dotenv), MIT (Zod)

# Vitest Testing Framework & API Reference
## https://vitest.dev/guide/
## https://vitest.dev/api/
This source outlines Vitest’s end-to-end capabilities, including test suite creation, spies, stubs, snapshot testing, and coverage integration with V8 & Istanbul. It details lifecycle hooks (beforeEach, afterAll), configuration options (vitest.config.ts), CLI flags, and GitHub Actions integration for parallel test runs. Practical examples demonstrate mocking modules and custom reporters, directly supporting agentic-lib’s comprehensive test suite. Last updated March 2024; MIT licensed.
## License: MIT

# Probot Framework for GitHub Apps
## https://probot.github.io/docs/
This official Probot documentation covers framework fundamentals for building GitHub Apps in Node.js, including webhook event handling, authentication flows, context APIs, Octokit integration, and plugin patterns. It provides detailed examples for setting up middleware, securing endpoints, testing with nock and Jest, and deploying apps on serverless platforms. Essential for extending agentic-lib with custom GitHub App integrations. Last updated 2024; MIT licensed.
## License: MIT