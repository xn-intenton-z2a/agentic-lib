# GitHub REST API
## https://docs.github.com/en/rest
Comprehensive reference for the GitHub REST API endpoints, including authentication schemas, repository and issue management, workflow dispatch, and rate-limiting rules. Provides detailed request/response structures, example calls in cURL and Octokit, enabling precise implementation of agentic workflows such as branch creation, status checks, and metadata collection. Continuously updated by GitHub; authoritative as the official API documentation.  
## License: CC BY 4.0

# GitHub Actions workflow_call Event
## https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_call
Official guidance on the `workflow_call` event for invoking reusable GitHub Actions workflows programmatically. Covers input/output parameter definitions, permissions scoping, caller/called-workflow conventions, and security considerations—essential for composing agentic-lib SDK-style workflow chains. Last updated March 2024; authoritative GitHub documentation.  
## License: CC BY 4.0

# AWS Lambda & SQS Integration
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
In-depth patterns for integrating AWS Lambda with Amazon SQS in Node.js, detailing handler signatures, context objects, batch size tuning, error handling using `batchItemFailures`, and retry behaviors. Explains asynchronous invocation, cold-start mitigation, and visibility timeout strategies to ensure robust, scalable processing of SQS messages in serverless workflows. Last updated May 2024; official AWS documentation.  
## License: Public Domain (AWS documentation)

# @xn-intenton-z2a/s3-sqs-bridge
## https://github.com/xn-intenton-z2a/s3-sqs-bridge
Open-source utility library that offloads large message payloads to Amazon S3 while exchanging lightweight SQS notifications. Includes helpers for uploading to S3, generating pre-signed URLs, batching, error backoff, and cleanup routines. Critical for implementing high-throughput, payload-heavy SQS workflows in agentic-lib. Latest release: v0.23.0; MIT License.  
## License: MIT

# Node.js ESM Path, Environment Configuration, and Schema Validation
## https://nodejs.org/api/url.html#url_fileurltopath_url
Unified reference for core Node.js utilities used in agentic-lib:
- Converting ES Module URLs to file system paths via `fileURLToPath(import.meta.url)` for reliable CLI entry-point detection and cross-platform compatibility.
- Environment variable loading with `dotenv.config()`, covering parsing rules, multiline values, variable expansion and best practices for local development and CI.
- Runtime schema validation using Zod, detailing object parsing, refinement, transformations, custom error reporting, and type safety enforcement of configuration and payload structures.
Last updated: Node.js v20 docs (May 2024); dotenv v16.5.0 (June 2024); Zod v3.24.4 (May 2024).  
## License: Multiple (CC BY 4.0, BSD-2-Clause, MIT)

# OpenAI Chat API Reference
## https://platform.openai.com/docs/api-reference/chat/create
Complete specification of the OpenAI Chat Completions endpoint, including HTTP authentication with Bearer tokens, request body schemas for single and streaming modes, parameters like `temperature`, `max_tokens`, `functions`, and response formats. Details error codes, rate-limit headers, and recommended retry strategies. Essential for implementing robust chat interactions and streaming pipelines in agentic-lib. Last updated June 2024; authoritative OpenAI documentation.  
## License: CC BY 4.0

# AWS SDK for JavaScript v3 SQS Client
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/index.html
Detailed reference for the AWS SDK v3 SQS client in JavaScript/TypeScript, covering commands such as `SendMessage`, `ReceiveMessage`, `DeleteMessage`, client configuration (regions, credentials, retry strategies), middleware customization, and error handling patterns. Essential for programmatic queue management within Lambdas and CLI tools. Last updated June 2024; official AWS documentation.  
## License: Apache-2.0

# AWS Lambda Powertools for Node.js
## https://docs.powertools.aws.dev/lambda-powertools-nodejs/latest/
Opinionated best practices and utilities for serverless Node.js applications, including structured logging with contextual metadata, distributed tracing, metrics collection, idempotency helpers, and validation middlewares for SQS handlers. Enhances observability, reliability, and performance in agentic-lib Lambdas with minimal instrumentation overhead. Last updated June 2024; maintained by AWS.  
## License: Apache-2.0