# AWS SQS and Lambda Integration
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
This comprehensive guide details configuring AWS Lambda functions to consume messages from Amazon SQS queues via event source mappings. It covers setup of IAM permissions, batch size tuning, error handling with dead-letter queues, and retry behavior—core for implementing the `digestLambdaHandler` correctly within a serverless environment. Last reviewed: May 2024. Authoritative source maintained by AWS.
## License: AWS Service Terms

# AWS SDK for JavaScript v3 — Lambda Client
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-lambda/index.html
In-depth reference for the AWS SDK v3 `LambdaClient`, including supported operations, interface definitions, pagination helpers, and middleware usage. Essential for programmatically invoking Lambdas or integrating advanced features like layers and aliases. Last updated: March 2024.
## License: Apache-2.0

# AWS S3 Event Notifications
## https://docs.aws.amazon.com/AmazonS3/latest/userguide/event-notifications.html
Explains configuring Amazon S3 to emit notification events (e.g., on object creation) to destinations such as SQS, Lambda, or SNS. Crucial for setting up the upstream event pipeline that feeds `s3-sqs-bridge` and subsequent processing in `digestLambdaHandler`. Last reviewed: April 2024.
## License: AWS Service Terms

# GitHub Actions Reusable Workflows
## https://docs.github.com/en/actions/using-workflows/reusing-workflows
Official documentation on the `workflow_call` trigger, inputs/outputs syntax, promoting modular pipeline design. Enables developers to invoke `agentic-lib` workflows as composable building blocks across repositories. Covers YAML patterns, security considerations, and example usage. Last updated: March 2024.
## License: CC BY 4.0

# GitHub REST API
## https://docs.github.com/en/rest
Authoritative reference for interacting with GitHub via REST calls. Documents endpoint schemas, authentication methods (tokens, OAuth), error codes, rate limiting, and pagination. Directly informs usage of `GITHUB_API_BASE_URL` and custom HTTP requests within the library. Last revised: June 2023.
## License: CC BY 4.0

# OpenAI Chat Completions API
## https://platform.openai.com/docs/api-reference/chat/create
Defines the `createChatCompletion` endpoint, payload structure (messages array, model selection), streaming vs non-streaming, and best practices for prompt design, error handling, and rate limit management. Crucial for reliable integration with `openai` package in `agentic-lib`. Last updated: May 2024.
## License: OpenAI API Terms of Use

# Zod Schema Validation
## https://github.com/colinhacks/zod
Official repository and docs for Zod, a TypeScript-first schema validation library. Covers schema creation, parsing options, error formatting, custom validations, and ESM support—aligns with `configSchema` parsing in the library. Last commit: April 2024.
## License: MIT

# GitHub Actions Toolkit
## https://github.com/actions/toolkit/blob/main/docs/action-toolkit.md
Provides utilities (`@actions/core`, `@actions/github`) and patterns for building JavaScript GitHub Actions. Includes logging conventions, input/output handling, and API clients—informing design choices for CLI and logging helpers in `agentic-lib`. Last commit: April 2024.
## License: MIT