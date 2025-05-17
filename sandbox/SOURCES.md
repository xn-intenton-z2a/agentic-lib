# GitHub REST API
## https://docs.github.com/en/rest
The official GitHub REST API documentation provides detailed reference for all endpoints, including authentication mechanisms, pagination strategies, rate limits, and error handling patterns. This source is essential for integrating with GitHub services such as issues, pulls, branches, and workflow dispatch calls, directly supporting the library’s GitHub Actions automation capabilities.
Last updated: 2024-04-10. Authoritativeness: Official GitHub documentation under CC BY 4.0.
## License if known
CC BY 4.0

# GitHub Actions Reusable Workflows
## https://docs.github.com/en/actions/using-workflows/reusing-workflows
Describes how to define and invoke reusable workflows using the `workflow_call` event, including inputs, outputs, secrets, and permissions. Critical for composing agentic-lib as drop-in modules within larger GitHub Actions pipelines, ensuring seamless parameter passing and secure execution.
Last updated: 2024-03-15. Authoritativeness: Official GitHub documentation under CC BY 4.0.
## License if known
CC BY 4.0

# AWS Lambda Developer Guide
## https://docs.aws.amazon.com/lambda/latest/dg/welcome.html
Comprehensive guide on AWS Lambda functions, covering event models, deployment packages, Node.js runtime specifics, environment variables, and best practices for monitoring & error handling. Directly informs how to structure and invoke Lambda handlers from SQS events within agentic-lib's AWS utility functions.
Last updated: 2024-02-20. Authoritativeness: Official AWS documentation under CC BY 4.0.
## License if known
CC BY 4.0

# Amazon SQS Developer Guide
## https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/Welcome.html
In-depth coverage of SQS message formats, FIFO vs standard queues, batching, visibility timeouts, and error retry semantics. Essential for understanding the construction of SQS events (`createSQSEventFromDigest`) and handling batch failures in the Lambda handler.
Last updated: 2024-01-30. Authoritativeness: Official AWS documentation under CC BY 4.0.
## License if known
CC BY 4.0

# AWS SDK for JavaScript v3
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html
Reference documentation for the modular AWS SDK, detailing client constructors, command patterns, middleware stacks, and asynchronous invocation. Direct guidance for importing and using `@aws-sdk/client-lambda` in Node ESM projects, including configuration and performance tuning.
Last updated: 2024-05-05. Authoritativeness: Official AWS SDK docs under Apache-2.0.
## License if known
Apache-2.0

# OpenAI API Reference
## https://platform.openai.com/docs/api-reference
Provides endpoint specifications, request/response schemas, rate limits, authentication, and streaming options for chat completion and other models. Enables precise implementation of OpenAI client integrations and error handling in the library’s default OpenAI API usage.
Last updated: 2024-04. Authoritativeness: Official OpenAI documentation (Proprietary).
## License if known
Proprietary

# Vitest Documentation
## https://vitest.dev/api/
API reference and configuration guide for Vitest, including mocking, setup/teardown hooks, coverage integration, and CLI options. Vital for writing and maintaining unit tests for agentic-lib, ensuring consistency with the existing `vitest` test suite and mocking patterns.
Last updated: 2024-03. Authoritativeness: Official Vitest docs under MIT.
## License if known
MIT

# Zod Schema Validation
## https://zod.dev/
Comprehensive guide to schema definitions, parsing, type inference, and custom validations. Provides actionable examples for environment variable validation (`configSchema`), error messages, and runtime safety, directly supporting agentic-lib’s use of Zod for robust configuration parsing.
Last updated: 2024-02. Authoritativeness: Official Zod documentation under MIT.
## License if known
MIT