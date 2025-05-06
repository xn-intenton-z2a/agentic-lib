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

# AWS Lambda & SQS Integration
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
In-depth patterns for integrating AWS Lambda with Amazon SQS in Node.js, detailing handler signatures, context objects, batch size tuning, error handling via `batchItemFailures`, and retry behaviors. Explains asynchronous invocation, cold-start mitigation, and visibility timeout strategies to ensure robust, scalable processing of SQS messages in serverless workflows.
Last updated May 2024; official AWS documentation.
## License: Public Domain (AWS documentation)

# S3 Payload Handling & Library
## https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html
## https://github.com/xn-intenton-z2a/s3-sqs-bridge
Combined documentation for generating AWS S3 pre-signed URLs and using the s3-sqs-bridge library to offload large payloads to S3 with lightweight SQS notifications. The AWS guide covers URL signing processes, expiration settings, security best practices, permission scopes, and Node.js SDK examples. The open-source library provides helpers for uploading to S3, generating pre-signed URLs, message batching, exponential backoff, error handling, and cleanup routines—critical for implementing robust, high-throughput, payload-heavy SQS workflows.
Last updated April 2024 (AWS, public domain) and v0.23.0 release; MIT License for library.
## License: MIT (library), Public Domain (AWS documentation)

# Node.js ESM Utilities
## https://nodejs.org/api/url.html#url_fileurltopath_url
Comprehensive reference for core Node.js ESM utilities, including converting ES Module `import.meta.url` to file system paths via `fileURLToPath()`. Details how `URL` objects work, cross-platform file path resolution, dynamic imports, and best practices for ESM module loading in Node.js.
Last updated May–June 2024; official Node.js documentation.
## License: CC BY 4.0

# Environment Configuration & Validation
## https://github.com/motdotla/dotenv#readme
## https://zod.dev
Detailed guide covering environment variable management and validation: loading `.env` files, variable expansion, fallback strategies, error handling with dotenv; combined with schema definitions, parsing strategies, custom refinements, and type-safe error reporting via Zod. Essential for robust, type-safe configuration management in Node.js applications.
Last updated June 2024; MIT License.
## License: MIT

# OpenAI Chat API & Function Calling
## https://platform.openai.com/docs/api-reference/chat/create
## https://platform.openai.com/docs/guides/function-calling
Combined reference for the OpenAI Chat Completions endpoint and the function calling mechanism. Covers authentication, request/response schemas, streaming and non-streaming modes, `temperature` & `max_tokens` options, defining JSON schema-based functions, handling model-invoked function calls, and structured response processing. Crucial for deterministic, function-enabled conversational agents.
Last updated June 2024; authoritative OpenAI documentation.
## License: CC BY 4.0

# Vitest Testing & Mocking
## https://vitest.dev/guide/
## https://vitest.dev/guide/mocking.html
Official Vitest guide covering test configuration, writing and organizing tests, and mocking modules/functions. Specifically details `vi.mock()`, spy creation, lifecycle hooks, and dynamic imports to ensure test isolation and accurate module mocking. Directly informs best practices for testing the agentic-lib codebase and handling default and override mocks in Vitest.
Last updated May 2024; MIT License (Vitest).
## License: MIT