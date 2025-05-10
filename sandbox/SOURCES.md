# AWS Event Sources for Lambda (SQS & S3)
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
## https://docs.aws.amazon.com/AmazonS3/latest/userguide/event-notifications.html
This combined guide covers configuring AWS Lambda to process messages from Amazon SQS queues via event source mappings and to receive object event notifications from Amazon S3. It details setting up IAM permissions, tuning batch size and visibility timeout, configuring dead-letter queues, and defining filter rules for S3 notifications. Provides JSON message structures, error handling patterns, retry behavior, and best practices for reliable serverless event-driven architectures. Last reviewed: May 2024. Authoritative source maintained by AWS.
## License: AWS Service Terms

# AWS SDK for JavaScript v3 — Lambda Client & Middleware
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-lambda/index.html
## https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/middleware.html
In-depth reference for the AWS SDK v3 `LambdaClient` and middleware patterns, covering operations, interface definitions, pagination utilities, and customizing the middleware stack for request signing, retries, and logging. Essential for programmatically invoking Lambdas and integrating advanced Lambda features in agentic workflows. Last updated: March 2024.
## License: Apache-2.0

# AWS Lambda Node.js ESM Packaging
## https://docs.aws.amazon.com/lambda/latest/dg/nodejs-package.html
Official guidance on packaging Node.js ESM modules for AWS Lambda, including folder structures, bundler recommendations, environment variable management, and using the AWS Lambda Runtime Interface Client (RIC). Crucial to ensure `agentic-lib` ESM modules deploy and run correctly in Lambda environments. Last reviewed: April 2024.
## License: AWS Service Terms

# GitHub Actions — Workflows, Reusable Actions & Toolkit
## https://docs.github.com/en/actions/using-workflows/reusing-workflows
## https://github.com/actions/toolkit/blob/main/docs/action-toolkit.md
Comprehensive documentation on creating modular GitHub Actions workflows with `workflow_call` triggers, inputs/outputs syntax, and building JavaScript/TypeScript Actions using the Actions Toolkit. Covers security best practices, logging conventions, and using `@actions/core` and `@actions/github`. Last updated: March 2024.
## License: CC BY 4.0

# GitHub REST & GraphQL APIs
## https://docs.github.com/en/rest
## https://docs.github.com/en/graphql
Authoritative references for GitHub REST v3 and GraphQL v4 APIs, detailing endpoint schemas, authentication methods (tokens, OAuth, JWT), rate limiting, pagination, and best practices for queries and mutations. Directly informs use of `GITHUB_API_BASE_URL` and GraphQL queries within agentic workflows. Last revised: REST – June 2023; GraphQL – June 2024.
## License: CC BY 4.0

# OpenAI Chat Completions API & Node.js SDK
## https://platform.openai.com/docs/api-reference/chat/create
## https://github.com/openai/openai-node#readme
Detailed guide to the `createChatCompletion` endpoint, including request payload structures, streaming vs non-streaming modes, handling rate limits and errors, and examples using the official Node.js SDK. Provides patterns for asynchronous streaming, retries, and parsing, essential for robust integration in `agentic-lib`. Last updated: May 2024.
## License: OpenAI API Terms of Use; MIT (SDK)

# Zod Schema Validation
## https://github.com/colinhacks/zod
Official Zod repository and docs for TypeScript-first schema validation. Covers creating schemas, synchronous/asynchronous parsing, type inference, coercion, custom error formatting, unions/intersections, and JSON schema generation. Aligns with `configSchema` in `main.js` to ensure reliable configuration validation. Last commit: April 2024.
## License: MIT

# Vitest Testing Framework
## https://vitest.dev/guide/
Official Vitest guide covering core concepts including test configuration, mocking modules and timers, snapshot testing, and best practices for ESM modules. Details setup for Node 20, global fixtures, and integration with TypeScript. Essential for writing and maintaining the unit tests in this repository. Last updated: March 2024.
## License: MIT