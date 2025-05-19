# GitHub API & GraphQL (REST v3, GraphQL & Octokit)
## https://docs.github.com/en/rest
## https://github.com/octokit/rest.js#readme
## https://docs.github.com/en/graphql
## https://github.com/octokit/graphql.js#readme
This combined reference provides in-depth specifications of GitHub's REST API (v3) and GraphQL API, including endpoint definitions, schema introspection, authentication flows (personal access tokens, OAuth apps, GitHub App JWTs), pagination strategies, rate limiting, and standardized error codes. The Octokit Rest.js and GraphQL.js clients complement these raw HTTP details with high-level JavaScript/TypeScript interfaces, offering type-safe method signatures, built-in pagination and retry helpers, and plugin/middleware architectures. Practical code snippets demonstrate direct HTTP interactions, batched GraphQL queries, and App authentication workflows, ensuring seamless integration for repository management and advanced data retrieval in agentic-lib. Continuously updated by GitHub (last verified April 2024); highly authoritative as the official provider.
## License: CC BY 4.0 (GitHub REST & GraphQL APIs), MIT (Octokit Rest.js & GraphQL.js)

# GitHub Actions Workflow Syntax
## https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
## https://docs.github.com/en/actions/using-workflows/reusing-workflows
This official guide specifies the complete YAML structure for GitHub Actions workflows, including event triggers (`on.push`, `workflow_call`), job definitions, matrix/concurrency strategies, environment variables, and secrets management. It also details how to author and invoke reusable workflows (`workflow_call`), composite actions, and best practices for permissions and security hardening. Directly informs agentic-lib’s workflow templates to enforce robust automation composition and efficient CI/CD pipelines. Published March 2024; maintained by GitHub.
## License: CC BY 4.0

# AWS Serverless Integration: Lambda, SQS, and S3 Bridge Patterns
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-lambda/
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
## https://github.com/xn-intenton-z2a/s3-sqs-bridge#readme
This unified reference covers AWS SDK v3 Lambda Client features (InvokeCommand, middleware stack, credential resolution with IAM roles, retry strategies, TypeScript support), AWS Lambda Node.js handler patterns (`exports.handler` vs. async, context object, error handling, cold start considerations, CloudWatch logging), SQS event mapping (JSON event schema, batchItemFailures, retry semantics, dead-letter queues), and S3-to-SQS bridging using the s3-sqs-bridge library with IAM policy templates, batching configurations, and error-handling hooks. Provides actionable patterns for reliable, event-driven serverless workflows in agentic-lib. AWS docs updated February 2024; s3-sqs-bridge v0.24.0 (MIT).
## License: Apache 2.0 (AWS), MIT (s3-sqs-bridge)

# OpenAI Node.js SDK
## https://platform.openai.com/docs/api-reference/chat/create
This reference details the Chat Completion API via the official OpenAI Node.js client, including request/response schemas, streaming vs. non-streaming modes, rate limiting policies, and error-handling patterns. It provides concrete examples for constructing message payloads, handling partial streams, and securely managing API keys with environment variables. Integral for implementing agentic-lib’s default mock and production chat flows, with best practices for retry/backoff strategies and telemetry. Last published April 2024; maintained by OpenAI.
## License: MIT

# Environment Configuration & Validation (dotenv & Zod)
## https://github.com/motdotla/dotenv
## https://github.com/colinhacks/zod
This combined source covers robust environment management: dotenv for loading, expanding, and defaulting `.env` variables (securely handling secrets and variable interpolation) and Zod for declarative TypeScript schema validation with type inference, customizable error formatting, and runtime safety. Offers integration patterns to ensure configuration correctness and predictable failure modes in both development and production environments. dotenv v16.x released October 2023; Zod v3.x released December 2023.
## License: BSD-2-Clause (dotenv), MIT (Zod)

# Vitest Testing Framework & API Reference
## https://vitest.dev/guide/
## https://vitest.dev/api/
This source outlines end-to-end capabilities of Vitest, including test suite creation, spies, stubs, snapshot testing, and coverage integration with V8 & Istanbul. It details lifecycle hooks (`beforeEach`, `afterAll`), configuration options (`vitest.config.ts`), CLI flags, and GitHub Actions integration for parallelized test runs. Practical examples demonstrate mocking built-in modules and custom reporters, directly supporting agentic-lib’s comprehensive test suite. Last updated March 2024; MIT licensed.
## License: MIT

# Node.js ECMAScript Modules & Dynamic Import
## https://nodejs.org/docs/latest-v20.x/api/esm.html
This official Node.js documentation covers ESM fundamentals (`import`/`export` syntax), `"type": "module"` package.json configuration, `import.meta.url`, dynamic `import()`, loader hooks, and CommonJS interoperability. It provides best practices for CLI tools, serverless functions, and modular code organization. Essential for developing agentic-lib’s ESM-based CLI entrypoints, Lambda handlers, and modern package exports. Documentation updated May 2024; provided by the OpenJS Foundation.
## License: CC BY-SA 3.0

# GitHub Apps Authentication
## https://docs.github.com/en/developers/apps/authenticating-with-github-apps
This guide outlines how to authenticate GitHub Apps using JSON Web Tokens (JWT) and installation access tokens. It details app registration, generating and signing JWTs, token expiration, scope configuration, and API usage patterns for installation-level operations. Essential for agentic-lib's advanced authentication scenarios, enabling stronger security and granular permissions when interacting with GitHub through Apps. Last updated April 2024; official documentation by GitHub.
## License: CC BY 4.0