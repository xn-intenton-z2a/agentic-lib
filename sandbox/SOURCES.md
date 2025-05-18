# GitHub REST API
## https://docs.github.com/en/rest
The GitHub REST API documentation offers detailed, versioned descriptions of every endpoint, covering authentication (OAuth, PATs), pagination and rate-limit strategies, webhook management, and response schemas. It includes actionable examples in cURL and various SDKs, making it essential for implementing robust GitHub integrations in agentic workflows.
Last updated: 2024-06-10. Authoritative as the official GitHub documentation maintained by GitHub.
## License
GitHub Documentation Terms of Service

# GitHub Actions workflow_call Event
## https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_call
This page details the `workflow_call` event for reusable workflows, providing the full schema for inputs, outputs, secrets, and permission scopes. It shows how to compose workflows as callable SDK-style modules, a core feature of agentic-lib’s design for autonomous orchestration.
Last updated: 2024-05-15. Official GitHub Actions documentation.
## License
GitHub Documentation Terms of Service

# AWS Lambda SQS Event Source
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
Comprehensive guide on configuring Amazon SQS as an event source for AWS Lambda. Covers batch windows, concurrency, error-handling strategies, dead-letter queues, visibility timeouts, and retry semantics. Essential for designing reliable digestLambdaHandler workflows.
Last updated: 2024-04-12. Official AWS documentation.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# AWS SDK for JavaScript v3 - SQS Client
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/index.html
Reference for the SQS client in AWS SDK v3, detailing each API operation (`SendMessage`, `ReceiveMessage`, `DeleteMessage`, batch actions), input/output shapes, middleware stack, and pagination helpers. Crucial for implementing message dispatch and consumption with fine-grained control.
Last updated: 2024-06-01. Official AWS SDK docs.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# AWS SDK for JavaScript v3 - Lambda Client
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-lambda/index.html
Documentation for the Lambda client in AWS SDK v3, describing invocation patterns (`InvokeCommand`, `InvokeAsync`), version and alias management, error responses, and payload serialization. Key for programmatic control of Lambda functions from within agentic-lib workflows.
Last updated: 2024-06-01. Official AWS SDK docs.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# OpenAI Node.js Library
## https://platform.openai.com/docs/libraries/node-js
Official guide and API reference for the OpenAI Node.js client library. Covers client instantiation, authentication patterns, `createChatCompletion`, streaming responses, rate-limit handling, and error management. Includes real-world code snippets for LLM integration in JavaScript.
Last updated: 2024-05-30. Licensed under MIT, maintained by OpenAI.
## License
MIT

# Zod Validation Library
## https://github.com/colinhacks/zod
Zod is a TypeScript-first schema validation library offering intuitive, chainable APIs, type inference, and error flattening. It’s optimized for validating environment variables (`configSchema`), CLI flags, and JSON payloads at runtime with minimal boilerplate.
Last released: v3.24.4 on 2024-03-01. MIT License.
## License
MIT

# S3-SQS Bridge
## https://github.com/xn-intenton-z2a/s3-sqs-bridge
The `@xn-intenton-z2a/s3-sqs-bridge` library connects S3 event notifications to SQS queues, providing utilities for event filtering, batching, error retries, and payload transformation. It streamlines file-to-queue workflows in serverless architectures, complementing agentic-lib’s event handling patterns.
Latest version: 0.24.0 published 2024-04-20. MIT License.
## License
MIT