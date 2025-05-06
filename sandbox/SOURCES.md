# GitHub API
## https://docs.github.com/en/rest
## https://docs.github.com/en/graphql
Comprehensive reference for GitHub's programming interfaces, combining both REST and GraphQL APIs. Covers authentication schemas (OAuth, personal access tokens, GitHub Apps), rate limiting, pagination, repository and issue management via REST; plus advanced querying, mutations, and schema introspection via GraphQL. Includes detailed request/response structures, example calls in cURL, Octokit, and GraphQL queries. Essential for implementing agentic workflows such as branch creation, status checks, atomic operations, and complex data retrieval.
Last updated April–June 2024; authoritative GitHub documentation.
## License: CC BY 4.0

# GitHub Actions workflow_call Event
## https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_call
Official guidance on the `workflow_call` event for invoking and composing reusable GitHub Actions workflows programmatically. Covers input/output parameter definitions, permissions scoping, caller/called-workflow conventions, secure secret handling, and cross-repository calls—critical for building SDK-style agentic workflow chains.
Last updated March 2024; authoritative GitHub documentation.
## License: CC BY 4.0

# AWS Serverless Integration Patterns
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
## https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html
## https://github.com/xn-intenton-z2a/s3-sqs-bridge
Unified patterns for building robust serverless workflows using AWS Lambda, Amazon SQS, and S3 pre-signed URLs. The AWS Lambda + SQS guide details event handler signatures, batch size tuning, visibility timeouts, `batchItemFailures` error reporting, retry strategies, and cold-start mitigation. The S3 pre-signed URL documentation explains secure URL signing, expiration controls, permission scopes, and SDK integration examples. The `s3-sqs-bridge` library adds helpers for offloading large payloads to S3 with lightweight SQS notifications, including batching, exponential backoff, and cleanup routines. This source addresses end-to-end payload handling and reliable message-driven processing in Node.js serverless applications.
Last updated April–May 2024; AWS docs in public domain, library v0.23.0.
## License: Public Domain (AWS documentation), MIT (s3-sqs-bridge)

# Node.js ESM Utilities
## https://nodejs.org/api/url.html#url_fileurltopath_url
Comprehensive reference for core Node.js ESM utilities, including converting ES Module `import.meta.url` to file system paths via `fileURLToPath()`. Details how `URL` objects work, cross-platform file path resolution, dynamic imports, and best practices for ESM module loading. Crucial for writing portable, standards-compliant CLI and Lambda code in Node.js.
Last updated May–June 2024; official Node.js documentation.
## License: CC BY 4.0

# Environment Configuration & Validation
## https://github.com/motdotla/dotenv#readme
## https://zod.dev
Comprehensive guide covering environment variable management and validation: loading `.env` files, variable expansion, fallback strategies, and error handling using `dotenv`. Combined with Zod's schema definitions, parsing strategies, and custom refinements, this source ensures type-safe, declarative configuration management with clear error reporting and developer ergonomics.
Last updated June 2024; MIT License.
## License: MIT

# OpenAI Chat API & Function Calling
## https://platform.openai.com/docs/api-reference/chat/create
## https://platform.openai.com/docs/guides/function-calling
Combined reference for the OpenAI Chat Completions endpoint and its function calling mechanism. Covers authentication, request/response schemas, streaming vs. non-streaming modes, `temperature` & `max_tokens` tuning, defining JSON schema-based functions, handling model-initiated function calls, and structured response parsing. Critical for integrating deterministic, schema-driven conversational agents into Node.js workflows.
Last updated June 2024; authoritative OpenAI documentation.
## License: CC BY 4.0

# AWS SDK for JavaScript v3 SQS & Lambda Clients
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/index.html
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-lambda/index.html
Official AWS SDK v3 documentation for programmatic access to SQS and Lambda. The SQS client guide covers `sendMessage`, `receiveMessage`, `deleteMessage`, batching, message attributes, and retry configurations. The Lambda client reference details `InvokeCommand`, payload handling (base64 vs. JSON), invocation types (Event vs. RequestResponse), and error handling patterns. Includes TypeScript examples, middleware customization, and best practices for secure, efficient AWS service interactions.
Last updated April 2024; AWS SDK under Apache 2.0.
## License: Apache 2.0

# Vitest Testing & Mocking
## https://vitest.dev/guide/
## https://vitest.dev/guide/mocking.html
Official Vitest guide covering test configuration, organizing tests, and mocking strategies. Specifically details `vi.mock()`, spy creation, lifecycle hooks, and dynamic imports to ensure test isolation and accurate module mocking. Directly informs best practices for writing and maintaining unit tests for Node.js libraries using ESM and structured log output.
Last updated May 2024; MIT License.
## License: MIT