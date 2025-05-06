# GitHub API
## https://docs.github.com/en/rest
## https://docs.github.com/en/graphql
Comprehensive reference for GitHub's REST and GraphQL APIs. Covers authentication (OAuth, PATs, GitHub Apps), rate limiting, pagination, error handling, REST endpoints for repository, issues, and workflow management, and GraphQL schema introspection with advanced querying and mutations. Includes practical code examples using cURL, Octokit, and direct GraphQL calls with full request/response payloads. Essential for implementing agentic workflows that require branch operations, status checks, and atomic cross-API transactions in a Node.js environment.
Last updated April–June 2024; authoritative official GitHub documentation.
## License: CC BY 4.0

# GitHub Actions workflow_call Event
## https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_call
Official guide to the `workflow_call` event for creating reusable, composable GitHub Actions. Details input/output bindings, permission scopes, secure secret propagation, cross-repository invocation patterns, and caller/callee conventions. Crucial for architecting SDK-style agentic pipelines that coordinate autonomous workflows across multiple repositories.
Last updated March 2024; authoritative official GitHub documentation.
## License: CC BY 4.0

# AWS SQS & Lambda Patterns & Infrastructure as Code
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/index.html
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-lambda/index.html
## https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html
## https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_event_sources-readme.html
## https://www.serverless.com/framework/docs/providers/aws/events/sqs
End-to-end reference for building serverless, message-driven architectures with AWS SQS and Lambda. Covers event source mapping, batch processing, `batchItemFailures`, visibility timeouts, retry strategies, and payload offloading via S3 pre-signed URLs. Includes SDK v3 command usage in TypeScript, AWS CDK patterns for IaC-based deployment, and Serverless Framework YAML examples for quick setup. Highlights middleware customization, dead-letter queues, IAM role configurations, and best practices for scalability, observability, and error handling.
Last updated April–June 2024; AWS documentation public domain, AWS SDK & CDK libraries Apache 2.0, Serverless Framework under MIT.
## License: Public Domain (AWS docs), Apache 2.0 (SDK & CDK), MIT (Serverless)

# Node.js ESM & Vitest Testing
## https://nodejs.org/api/url.html#url_fileurltopath_url
## https://vitest.dev/guide/
## https://vitest.dev/guide/mocking.html
Combined reference for Node.js ESM utilities and Vitest testing framework. The Node.js URL module section details `fileURLToPath()`, dynamic imports, and cross-platform path resolution. Vitest guides cover configuration, test isolation, mocking strategies (`vi.mock()`, spies), lifecycle hooks, and coverage reporting. Essential for writing, testing, and bundling ESM-based Node.js libraries with robust mocking and CI-friendly outputs.
Last updated May–June 2024; Node.js docs CC BY 4.0, Vitest under MIT.
## License: CC BY 4.0 (Node.js), MIT (Vitest)

# Environment Configuration & Validation
## https://github.com/motdotla/dotenv#readme
## https://zod.dev
Best practices for managing environment variables using `dotenv` and validating them with Zod. Covers `.env` file loading, variable expansion, fallback defaults, declarative schema definitions, type-safe parsing, custom refinements, and clear runtime errors. Ensures robust configuration management and developer ergonomics in Node.js applications.
Last updated June 2024; MIT.
## License: MIT

# OpenAI Chat API & Function Calling
## https://platform.openai.com/docs/api-reference/chat/create
## https://platform.openai.com/docs/guides/function-calling
In-depth guide to the OpenAI Chat Completions endpoint with JSON Schema–based function calling. Covers authentication, streaming vs. non-streaming modes, response parsing, and designing function schemas for deterministic conversational agents. Includes Node.js examples, error handling patterns, prompt engineering tips, and parameter tuning for reliability and cost optimization.
Last updated June 2024; authoritative official OpenAI documentation.
## License: CC BY 4.0

# AWS Lambda Powertools for Node.js
## https://docs.powertools.aws.dev/lambda/nodejs/latest/
Authoritative toolkit for enhancing AWS Lambda functions with structured logging, metrics, tracing, and idempotency. Describes middleware integration for AWS X-Ray, CloudWatch metrics (including custom high-resolution metrics), and idempotent handler patterns. Empowers enterprise-grade observability, reliability, and performance optimization in serverless applications.
Last updated June 2024; Apache 2.0.
## License: Apache 2.0

# S3-SQS Bridge Middleware
## https://github.com/xn-intenton-z2a/s3-sqs-bridge#readme
Middleware library for seamless payload offloading between Amazon S3 and SQS to handle large messages. Automatically uploads oversized payloads to S3, sends SQS messages with object references, and retrieves full payloads on consumption. Includes TypeScript examples, AWS SDK middleware integration, and best practices for atomic operations, retry handling, and cost-efficient message processing.
Last updated May 2024; MIT.
## License: MIT