# GitHub REST API
## https://docs.github.com/en/rest
A comprehensive reference for GitHub’s REST endpoints, covering authentication, pagination, rate limits, and core workflows such as issues, branches, and pull requests. This source provides detailed request/response schemas, example cURL commands, and error code definitions, directly supporting the library’s GitHub API integration logic and robust error handling. Last updated April 2024, licensed under Creative Commons BY 4.0 (https://creativecommons.org/licenses/by/4.0/).
## License: CC BY 4.0

# GitHub Actions workflow_call Event
## https://docs.github.com/en/actions/using-workflows/reusing-workflows#workflow_call
Official documentation for the `workflow_call` trigger, detailing input/output definitions, security contexts, and usage patterns for reusable workflows. Essential for designing and consuming the agentic-lib SDK methods that compose workflows via `workflow_call`. Last reviewed March 2024, licensed under CC BY 4.0.
## License: CC BY 4.0

# AWS Lambda with SQS Triggers
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
AWS Lambda Developer Guide section on subscribing functions to SQS queues, including batch size settings, retry behavior, and dead-letter queue configuration. Explains the shape of SQS events in Node.js and how to handle partial batch failures—vital for implementing `digestLambdaHandler` and managing `batchItemFailures`. Last updated January 2024, under Creative Commons Attribution 4.0.
## License: CC BY 4.0

# AWS SDK for JavaScript v3 Developer Guide
## https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide
Official guide covering modular imports, client instantiation, middleware stack, and best practices for performance and error handling. Provides patterns for constructing SQS and Lambda clients in Node.js, enabling efficient resource usage and scalable CLI operations in agentic-lib. Last updated February 2024, licensed under Apache 2.0.
## License: Apache 2.0

# OpenAI Node.js API Reference
## https://platform.openai.com/docs/api-reference/chat/create
Documentation for the Chat Completions endpoint, including request parameters, streaming options, and response format for usage in Node.js. Offers concrete examples for message payload construction, model selection, and error handling, underpinning the library’s default mock and real OpenAI integration. Last updated May 2024, governed by OpenAI’s API Terms of Service.
## License: OpenAI API Terms

# Zod Runtime Validation
## https://zod.dev/?id=usage
Zod documentation covering schema definitions, parsing behavior, and custom error mapping in TypeScript and JavaScript. Demonstrates how to validate environment variables and input payloads securely, directly informing the `configSchema` implementation and consistent runtime checks. Last updated March 2024, licensed under MIT.
## License: MIT

# Node.js ECMAScript Modules
## https://nodejs.org/api/esm.html
Node.js official documentation on using ES modules (import/export), file path handling with `import.meta.url`, and interoperability considerations. Crucial for maintaining Node 20+ compatibility and correctly resolving the `fileURLToPath` logic in agentic-lib. Last updated June 2023, licensed under Node.js Foundation license.
## License: Node.js Foundation (MIT-like)

# @xn-intenton-z2a/s3-sqs-bridge GitHub
## https://github.com/xn-intenton-z2a/s3-sqs-bridge
Source repository for the S3-to-SQS bridge module used by agentic-lib. Details configuration options, event formats, and best practices for integrating S3 notifications with SQS. Provides insights on message envelope structure that align with agentic-lib’s `createSQSEventFromDigest` utility. Last updated April 2024, licensed under MIT.
## License: MIT