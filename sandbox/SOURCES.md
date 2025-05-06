# GitHub REST API
## https://docs.github.com/en/rest
Comprehensive reference for the GitHub REST API endpoints, including authentication schemas, repository and issue management, workflow dispatch, and rate-limiting rules. Provides detailed request/response structures, example calls in cURL and Octokit, enabling precise implementation for triggering agentic workflows, branch management, and metadata collection. Last updated continuously; authoritative source as GitHub’s official documentation.
## License: CC BY 4.0

# GitHub Actions workflow_call Event
## https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_call
Official guidance on the `workflow_call` event used to invoke reusable GitHub Actions workflows programmatically. Covers input/output parameter definitions, permissions scoping, caller and called-workflow conventions, and security considerations, facilitating SDK-style chaining of agentic-lib workflows. Last updated: March 2024; authoritative GitHub documentation.
## License: CC BY 4.0

# AWS Lambda & SQS Integration
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
Combined Lambda handler patterns and SQS event source configuration in Node.js, describing handler signatures, context objects, batch size tuning, error handling, and `batchItemFailures`. Explains asynchronous execution models, cold-start optimizations, and partial-failure retries to ensure robust processing of SQS messages in agentic Lambdas. Last updated: May 2024; official AWS documentation.
## License: Public Domain (AWS documentation)

# @xn-intenton-z2a/s3-sqs-bridge
## https://github.com/xn-intenton-z2a/s3-sqs-bridge
Open-source library for bridging large payloads via S3 and SQS, providing utilities to upload objects to S3, send lightweight SQS notifications, and retrieve full payloads within Lambda. Includes configuration options for bucket policies, message batching, error backoffs, and cleanup routines. Critical for scalable SQS-driven workflows in agentic-lib. Latest release: v0.23.0; MIT License.
## License: MIT

# Node.js ESM Path, Environment Configuration, and Schema Validation
## https://nodejs.org/api/url.html#url_fileurltopath_url
Unified reference for core utilities used in agentic-lib:
- ESM path resolution via `fileURLToPath(import.meta.url)` for reliable CLI entry-point detection and cross-platform compatibility.
- Environment variable loading with `dotenv.config()`, detailing parsing rules, multiline values, and best practices for local development and CI environments.
- Runtime schema validation using Zod, covering object parsing, transformations, and custom error reporting for strict enforcement of configuration and payload structures.
Last updated: Node.js v20 docs (URL module); dotenv v16.5.0 (June 2024); Zod v3.24.4 (May 2024). Licenses: Node.js docs (CC BY 4.0); dotenv (BSD-2-Clause); Zod (MIT).
## License: Multiple (CC BY 4.0, BSD-2-Clause, MIT)

# OpenAI Node.js SDK
## https://github.com/openai/openai-node
Official client library for the OpenAI API in Node.js, detailing configuration patterns, chat completion and streaming interfaces, rate limit handling, and error propagation. Includes code snippets for parsing JSON responses, customizing request parameters, and resilient retries, directly applicable to agenticHandler implementations. Latest release: v4.97.0 (June 2024); MIT License.
## License: MIT

# AWS SDK for JavaScript v3 SQS Client
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/index.html
Detailed reference for the AWS SDK v3 SQS client in JavaScript/TypeScript, covering commands like `SendMessage`, `ReceiveMessage`, `DeleteMessage`, client configuration (regions, credentials, retry strategies), and error handling patterns. Essential for programmatically managing SQS queues and messages within custom Lambdas or CLI tools. Last updated: June 2024; official AWS documentation.
## License: Apache-2.0

# AWS Lambda Powertools for Node.js
## https://docs.powertools.aws.dev/lambda-powertools-nodejs/latest/
Best practices and utilities for building serverless applications in Node.js, including structured logging, distributed tracing, metrics collection, and idempotency helpers for SQS handlers. Promotes higher observability and reliability in agentic Lambdas with minimal instrumentation. Last updated: June 2024; maintained by AWS.
## License: Apache-2.0