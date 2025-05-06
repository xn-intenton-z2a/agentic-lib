# GitHub API
## https://docs.github.com/en/rest
## https://docs.github.com/en/graphql
Comprehensive reference for GitHub's programming interfaces, combining both REST and GraphQL APIs. Covers authentication schemas (OAuth, personal access tokens, GitHub Apps), rate limiting, pagination, repository and issue management via REST; plus advanced querying, mutations, and schema introspection via GraphQL. Includes detailed request/response structures, example calls in cURL, Octokit, and GraphQL queries. Essential for implementing agentic workflows such as branch creation, status checks, atomic operations, and complex data retrieval. Last updated April–June 2024; authoritative GitHub documentation.
## License: CC BY 4.0

# GitHub Actions workflow_call Event
## https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_call
Official guidance on the `workflow_call` event for invoking and composing reusable GitHub Actions workflows programmatically. Covers input/output parameter definitions, permissions scoping, caller/called-workflow conventions, secure secret handling, and cross-repository calls—critical for building SDK-style agentic workflow chains. Last updated March 2024; authoritative GitHub documentation.
## License: CC BY 4.0

# AWS Lambda & SQS Integration
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
In-depth patterns for integrating AWS Lambda with Amazon SQS in Node.js, detailing handler signatures, context objects, batch size tuning, error handling via `batchItemFailures`, and retry behaviors. Explains asynchronous invocation, cold-start mitigation, and visibility timeout strategies to ensure robust, scalable processing of SQS messages in serverless workflows. Last updated May 2024; official AWS documentation.
## License: Public Domain (AWS documentation)

# @xn-intenton-z2a/s3-sqs-bridge
## https://github.com/xn-intenton-z2a/s3-sqs-bridge
Open-source utility library for offloading large message payloads to Amazon S3 with lightweight SQS notifications. Includes helpers for uploading to S3, generating pre-signed URLs, batching, error backoff, and cleanup routines. Critical for implementing high-throughput, payload-heavy SQS workflows in agentic-lib. Latest release: v0.23.0; MIT License.
## License: MIT

# Node.js ESM Path, Environment Configuration, and Schema Validation
## https://nodejs.org/api/url.html#url_fileurltopath_url
Comprehensive reference for core Node.js utilities used in agentic-lib: converting ES Module URLs to file system paths via `fileURLToPath(import.meta.url)`, environment variable loading with `dotenv.config()`, and runtime schema validation using Zod. Details parsing rules, transformations, custom error reporting, and cross-platform CLI entry-point detection best practices. Last updated May–June 2024; official Node.js, dotenv, and Zod documentation.
## License: Multiple (CC BY 4.0, BSD-2-Clause, MIT)

# OpenAI Chat API Reference
## https://platform.openai.com/docs/api-reference/chat/create
Complete specification of the OpenAI Chat Completions endpoint, including HTTP authentication with Bearer tokens, request body schemas for single and streaming modes, parameters such as `temperature`, `max_tokens`, and `functions`, plus response formats, error codes, rate-limit headers, and recommended retry strategies. Essential for implementing robust chat interactions and streaming pipelines in agentic-lib. Last updated June 2024; authoritative OpenAI documentation.
## License: CC BY 4.0

# OpenAI Function Calling Guide
## https://platform.openai.com/docs/guides/function-calling
Detailed guide on defining and invoking functions via the OpenAI Chat API. Covers JSON schema-based function parameter declarations, best practices for naming and structuring function signatures, automatic function selection by the model, and handling returned JSON payloads. Includes examples in Node.js using the `functions` parameter, error behaviors, and debugging strategies. Vital for integrating deterministic function executions within conversational agents. Last updated June 2024; authoritative OpenAI documentation.
## License: CC BY 4.0

# AWS S3 Pre-signed URLs
## https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html
Official AWS S3 documentation for generating and using pre-signed URLs to upload and download objects. Covers signing process, URL expiration, security best practices, permission scopes, and SDK code examples in Node.js for programmatic generation. Vital for offloading payloads to S3 in SQS workflows, enabling secure, time-limited upload and download links. Last updated April 2024; official AWS documentation.
## License: Public Domain (AWS documentation)