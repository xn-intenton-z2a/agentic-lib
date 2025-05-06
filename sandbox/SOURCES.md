# GitHub REST API
## https://docs.github.com/en/rest
Comprehensive reference for the GitHub REST API endpoints, including authentication, repository and issue management, and workflow dispatch. This documentation provides detailed request and response schemas, rate-limiting rules, and examples in cURL and octokit, enabling precise implementation of calls to trigger workflows, manage branches/issues, and collect repository metadata. Last updated continuously; authoritative as GitHub’s own documentation.
## License: CC BY 4.0 (GitHub documentation)

# AWS Lambda Node.js Handler Model
## https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
Official guide to writing AWS Lambda functions in Node.js, covering handler signatures, context objects, error handling, and performance best practices. Explains asynchronous execution patterns and initialization outside the handler to optimize cold starts—critical for reliable SQS-driven workflows. Last published: June 2024; authoritative AWS documentation.
## License: Public Domain (AWS documentation)

# AWS Lambda with Amazon SQS
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
Describes configuring Lambda function event sources for Amazon SQS, including batch size, error handling, and the structure of SQS event payloads. Essential for setting up `digestLambdaHandler` to reliably process and retry messages, handling partial failures, and understanding `batchItemFailures`. Last updated: May 2024.
## License: Public Domain (AWS documentation)

# AWS SDK for JavaScript v3 – SQS Client
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/index.html
Reference for the SQS Client in AWS SDK v3, detailing method parameters, response shapes, and middleware customization. Useful for advanced use-cases like custom retry strategies, message attribute handling, and integration patterns with other AWS services. Last updated: April 2024; official AWS SDK docs.
## License: Apache 2.0 (AWS SDK for JavaScript)

# OpenAI Node.js SDK
## https://github.com/openai/openai-node
Source code and documentation for the official OpenAI Node.js client. Covers configuration patterns, creating chat completions, streaming responses, and error propagation. Includes code snippets for handling rate limits and customizing request parameters, directly applicable to refining AI-driven workflows. Latest release: v4.97.0 (June 2024). Licensed under MIT.
## License: MIT

# Zod – TypeScript-first schema validation
## https://github.com/colinhacks/zod
Official repository for Zod, a TypeScript-focused runtime schema validator. Provides comprehensive examples of defining schemas, parsing environment variables, and error formatting. Critical for validating `config` and input payloads with clear error messages. Latest version: 3.24.4 (May 2024). Licensed under MIT.
## License: MIT

# dotenv – Environment variable loader
## https://github.com/motdotla/dotenv
Widely-adopted library for loading `.env` files into `process.env`. Covers parsing rules, multiline values, encoding, and security considerations. This documentation guides robust environment configuration in local and CI contexts, matching patterns used in `main.js`. Version: 16.5.0 (June 2024). Licensed under BSD-2-Clause.
## License: BSD-2-Clause

# GitHub Actions workflow_call Event
## https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_call
Official guidance on the `workflow_call` event, including input/output parameters, permissions, and calling conventions across repositories. Enables composition of agentic workflows as SDK-style building blocks, describing how to define reusable workflows and pass data between them. Last updated: March 2024.
## License: CC BY 4.0 (GitHub documentation)