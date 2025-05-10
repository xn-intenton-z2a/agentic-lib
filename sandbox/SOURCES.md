# AWS SQS and Lambda Integration
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
This comprehensive guide details configuring AWS Lambda functions to consume messages from Amazon SQS queues via event source mappings. It covers setup of IAM permissions, batch size tuning, error handling with dead-letter queues, and retry behavior—core for implementing the `digestLambdaHandler` correctly within a serverless environment. Includes recommendations for batchItemFailures and visibility timeout management to ensure reliable processing. Last reviewed: May 2024. Authoritative source maintained by AWS.
## License: AWS Service Terms

# AWS SDK for JavaScript v3 — Lambda Client & Middleware
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-lambda/index.html
## https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/middleware.html
In-depth reference for the AWS SDK v3 `LambdaClient` and detailed middleware patterns. Covers supported operations, interface definitions, pagination utilities, and how to customize or extend the middleware stack for advanced use cases such as request signing, retry strategies, and logging. Essential for programmatically invoking Lambdas or integrating advanced features like layers and aliases. Last updated: March 2024.
## License: Apache-2.0

# AWS Lambda Node.js ESM Packaging
## https://docs.aws.amazon.com/lambda/latest/dg/nodejs-package.html
Official AWS documentation on packaging Node.js functions for Lambda with ESM support. Explains folder structure, bundler considerations, environment variables, AWS Lambda runtime interface client (RIC), and how to deploy using AWS CLI or CDK. Crucial for ensuring that `agentic-lib` ESM modules run correctly in Lambda. Last reviewed: April 2024.
## License: AWS Service Terms

# AWS S3 Event Notifications
## https://docs.aws.amazon.com/AmazonS3/latest/userguide/event-notifications.html
Explains configuring Amazon S3 to emit notification events (e.g., on object creation) to destinations such as SQS, Lambda, or SNS. Crucial for setting up the upstream event pipeline that feeds `s3-sqs-bridge` and subsequent processing in `digestLambdaHandler`. Includes JSON message structure and filter rules. Last reviewed: April 2024.
## License: AWS Service Terms

# GitHub Actions — Workflows, Reusable Actions & Toolkit
## https://docs.github.com/en/actions/using-workflows/reusing-workflows
## https://github.com/actions/toolkit/blob/main/docs/action-toolkit.md
Combines GitHub’s official guide on `workflow_call` triggers and inputs/outputs syntax with the Actions Toolkit documentation for building JavaScript/TypeScript Actions. Covers YAML patterns for modular pipelines, security best practices, logging conventions, input/output handling, and use of `@actions/core` and `@actions/github`. Last updated: March 2024.
## License: CC BY 4.0

# GitHub REST & GraphQL APIs
## https://docs.github.com/en/rest
## https://docs.github.com/en/graphql
Authoritative references for both GitHub REST v3 and GraphQL v4 APIs. Documents endpoint schemas, authentication methods (tokens, OAuth, JWT), rate limiting, pagination, and best practices for queries and mutations. Directly informs usage of `GITHUB_API_BASE_URL`, custom HTTP requests, and GraphQL queries within `agentic-lib`. Last revised: REST – June 2023; GraphQL – June 2024.
## License: CC BY 4.0

# OpenAI Chat Completions API & Node.js SDK
## https://platform.openai.com/docs/api-reference/chat/create
## https://github.com/openai/openai-node#readme
Covers the `createChatCompletion` endpoint including payload structure (messages, model selection), streaming vs non-streaming modes, error handling, and rate limit strategies, paired with the official Node.js client library usage. Includes code examples for asynchronous streaming, retry patterns, and payload parsing. Crucial for reliable integration with the `openai` package in `agentic-lib`. Last updated: May 2024.
## License: OpenAI API Terms of Use; MIT (SDK)

# Zod Schema Validation
## https://github.com/colinhacks/zod
Official repository and documentation for Zod, a TypeScript-first schema validation library. Covers schema creation, synchronous and asynchronous parsing, coercion options, custom error formatting, union/intersection schemas, and JSON schema generation. Aligns with `configSchema` parsing and ensures robust configuration validation. Last commit: April 2024.
## License: MIT