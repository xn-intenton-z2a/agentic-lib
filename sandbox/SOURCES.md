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

# @xn-intenton-z2a/s3-sqs-bridge
## https://github.com/xn-intenton-z2a/s3-sqs-bridge
Open-source utility library for offloading large message payloads to Amazon S3 with lightweight SQS notifications. Includes helpers for uploading to S3, generating pre-signed URLs, batching, error backoff, and cleanup routines. Critical for implementing high-throughput, payload-heavy SQS workflows in agentic-lib.
Latest release: v0.23.0; MIT License.
## License: MIT

# Node.js ESM Utilities
## https://nodejs.org/api/url.html#url_fileurltopath_url
Comprehensive reference for core Node.js utilities used in agentic-lib: converting ES Module URLs to file system paths via `fileURLToPath(import.meta.url)` and cross-platform CLI entry-point detection. Details import.meta.url behavior, file URL handling, and best practices for ESM module resolution in Node.js environments.
Last updated May–June 2024; official Node.js documentation.
## License: CC BY 4.0

# Environment Configuration & Validation
## https://github.com/motdotla/dotenv#readme
## https://zod.dev
Detailed guide covering loading environment variables with dotenv (configuration options, file loading, variable expansion, and error handling) and schema validation with Zod (defining schemas, parsing strategies, custom refinements, and formatted error reporting). Crucial for robust, type-safe configuration management in Node.js applications, ensuring reliable defaults and runtime safety.
Last updated June 2024; dotenv (MIT License), Zod (MIT License).
## License: MIT

# OpenAI Chat API & Function Calling
## https://platform.openai.com/docs/api-reference/chat/create
## https://platform.openai.com/docs/guides/function-calling
Combined reference for the OpenAI Chat Completions endpoint and the function calling guide. Covers HTTP authentication, request body schemas (single and streaming modes), supported parameters (`temperature`, `max_tokens`, `functions`), JSON schema-based function definitions, automatic function invocation by the model, and handling returned payloads. Essential for building deterministic, function-enabled conversational agents with robust error handling and retry strategies.
Last updated June 2024; authoritative OpenAI documentation.
## License: CC BY 4.0

# AWS S3 Pre-signed URLs
## https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html
Official AWS S3 documentation for generating and using pre-signed URLs to upload and download objects. Covers the signing process, URL expiration, security best practices, permission scopes, and SDK examples in Node.js. Vital for offloading large payloads to S3 in SQS workflows, enabling secure, time-limited upload and download links.
Last updated April 2024; official AWS documentation.
## License: Public Domain (AWS documentation)