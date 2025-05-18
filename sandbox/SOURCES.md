# GitHub API (REST v3 and Octokit)
## https://docs.github.com/en/rest
## https://github.com/octokit/rest.js#readme
This combined reference covers the official GitHub REST API v3 endpoint specifications including authentication, pagination, rate limiting, and error codes, alongside the Octokit/rest.js JavaScript client. It provides actionable code examples for making raw HTTP calls or using a high-level client with pagination helpers, plugin architecture, and TypeScript typings—directly supporting agentic-lib’s GitHub integration. Documentation is continuously updated; the REST API is licensed under CC BY 4.0 by GitHub, and Octokit/rest.js is MIT licensed.
## License: CC BY 4.0 (GitHub REST API), MIT (Octokit)

# GitHub Actions Workflow Syntax
## https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
The official GitHub Actions Workflow Syntax reference details triggers (`workflow_call`, `on.push`, etc.), inputs/outputs, environment variables, resource permissions, concurrency controls, and matrix strategies. It is vital for authoring and composing agentic workflows, ensuring robust, secure, and repeatable automation. Published March 2024; licensed under CC BY 4.0.
## License: CC BY 4.0

# AWS SQS Integration: Event Source Mapping & SDK Client
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/
This dual reference explains how to configure SQS as a Lambda event source, covering payload JSON schema, batch sizes, retry semantics, and dead-letter queues, while also detailing the AWS SDK v3 SQS Client (`SendMessageCommand`, `ReceiveMessageCommand`, middleware, and TypeScript support). Together these docs inform the design and implementation of `digestLambdaHandler` and message processing in agentic-lib. Updated February 2024 and January 2024.
## License: Apache 2.0

# OpenAI Node.js SDK
## https://platform.openai.com/docs/api-reference/chat/create
This OpenAI documentation covers the Chat Completion API via the Node.js client, including request and streaming schemas, response structures, rate limit handling, and API key management. It underpins agentic-lib’s default mock and production usage, with practical code snippets and error handling guidance. Last published April 2024; MIT licensed.
## License: MIT

# Zod Type Validation for JavaScript and TypeScript
## https://github.com/colinhacks/zod
Zod’s repository and API docs explain schema definitions, parsing flows, custom error formatting, and TypeScript inference. Core to validating environment variables (`configSchema`) and SQS payloads within agentic-lib. Version 3.x released December 2023; MIT licensed.
## License: MIT

# dotenv – Load Environment Variables from .env
## https://github.com/motdotla/dotenv
This guide covers loading and expanding `.env` files, default values, error handling, and TypeScript usage. Essential for flexible environment configuration in both development and production contexts of agentic-lib. Version 16.x published October 2023; BSD-2-Clause licensed.
## License: BSD-2-Clause

# s3-sqs-bridge – Bridging S3 and SQS Queues
## https://github.com/xn-intenton-z2a/s3-sqs-bridge#readme
The s3-sqs-bridge README describes a reusable library for wiring S3 event notifications into SQS queues, including configuration patterns, batching options, IAM permissions, and error handling strategies. Directly relevant for integrating S3-driven workflows in agentic-lib’s Lambda handlers. Version 0.24.0; MIT licensed.
## License: MIT

# AWS Lambda Function Handler in Node.js
## https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
This AWS Lambda Node.js handler documentation defines function signatures (`exports.handler`), context object properties, callback conventions, and best practices for asynchronous operations and error propagation in Lambda functions. It informs naming the `handler` field and implementing robust invocation logic in agentic-lib. Updated January 2024; Apache 2.0.
## License: Apache 2.0