# GitHub API
## https://docs.github.com/en/rest
## https://docs.github.com/en/graphql
Comprehensive reference for GitHub's REST and GraphQL APIs. Covers authentication (OAuth, PATs, GitHub Apps), rate limiting, pagination, and error handling; REST endpoints for repository, issue, and workflow management; GraphQL schema introspection, advanced querying, and mutations. Includes cURL, Octokit, and GraphQL examples with full request/response payloads. Essential for implementing agentic workflows that require branch operations, status checks, and atomic cross-API transactions.
Last updated April–June 2024; authoritative GitHub documentation.
## License: CC BY 4.0

# GitHub Actions workflow_call Event
## https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_call
Official guide to the `workflow_call` event for creating reusable, composable GitHub Actions. Details input/output bindings, permission scopes, secure secret propagation, cross-repository invocation, and caller/callee conventions. Crucial for architecting SDK-style agentic pipelines that coordinate autonomous workflows.
Last updated March 2024; authoritative GitHub documentation.
## License: CC BY 4.0

# AWS SQS & Lambda SDK & Patterns
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/index.html
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-lambda/index.html
## https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html
Detailed patterns for serverless message-driven architectures using AWS SQS and Lambda with the AWS SDK v3. Covers SQS event batch processing, `batchItemFailures`, retry strategies, visibility timeouts, middleware customization, and payload offloading with S3 pre-signed URLs. Includes TypeScript examples, SDK command usage, and best practices for error handling and scalability.
Last updated April–May 2024; AWS docs are Public Domain, SDK under Apache 2.0, related bridge under MIT.
## License: Public Domain (AWS docs), Apache 2.0 (AWS SDK), MIT (s3-sqs-bridge)

# Serverless Framework AWS Event Configuration
## https://www.serverless.com/framework/docs/providers/aws/events/sqs
Hands-on guidance for configuring AWS SQS event sources in the Serverless Framework. Demonstrates YAML service definitions, function event mappings, batch size tuning, dead-letter queue setup, and IAM role configurations. Provides actionable deployment examples and plug-in options for automated retry and failure handling, accelerating infrastructure-as-code adoption.
Last updated April 2024; documentation under MIT.
## License: MIT

# Node.js ESM & Testing Tools
## https://nodejs.org/api/url.html#url_fileurltopath_url
## https://vitest.dev/guide/
## https://vitest.dev/guide/mocking.html
Combined reference for Node.js ESM utilities and Vitest testing framework. The Node.js URL module section details `fileURLToPath()`, dynamic imports, and cross-platform path resolution. The Vitest guides cover configuration, test isolation, mocking (`vi.mock()`, spies), lifecycle hooks, and coverage. Essential for writing, testing, and bundling ESM-based Node.js libraries.
Last updated May–June 2024; Node.js docs CC BY 4.0, Vitest under MIT.
## License: CC BY 4.0 (Node.js), MIT (Vitest)

# Environment Configuration & Validation
## https://github.com/motdotla/dotenv#readme
## https://zod.dev
Comprehensive strategies for managing environment variables using `dotenv` and validating them with Zod. Includes `.env` loading, variable expansion, fallback defaults, declarative schema definitions, type-safe parsing, and custom refinements. Guarantees robust configuration with clear runtime errors and developer ergonomics.
Last updated June 2024; MIT License.
## License: MIT

# OpenAI Chat API & Function Calling
## https://platform.openai.com/docs/api-reference/chat/create
## https://platform.openai.com/docs/guides/function-calling
Deep dive into the OpenAI Chat Completions endpoint with JSON Schema–based function calling. Covers authentication, streaming vs. non-streaming modes, response parsing, and function schema design. Includes practical examples in Node.js for deterministic conversational agents, error handling patterns, and parameter tuning.
Last updated June 2024; authoritative OpenAI documentation.
## License: CC BY 4.0

# AWS Lambda Powertools for Node.js
## https://docs.powertools.aws.dev/lambda/nodejs/latest/
Authoritative toolkit for enhancing Lambda functions with structured logging, metrics, tracing, and idempotency. Describes middleware for AWS X-Ray, CloudWatch metrics, High-Resolution metrics, and idempotent handler patterns. Enables enterprise-grade observability and reliability in serverless environments.
Last updated June 2024; Apache 2.0 License.