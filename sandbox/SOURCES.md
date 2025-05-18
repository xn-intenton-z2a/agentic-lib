# AWS Lambda & Amazon SQS Integration
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
Comprehensive guide detailing how to configure AWS Lambda to consume messages from Amazon SQS queues. Covers event source mapping configuration, batch size tuning, error handling via `batchItemFailures`, visibility timeout strategies, and concurrency controls for both standard and FIFO queues. Also references the AWS SDK for JavaScript v3 SQSClient for programmatic message operations (SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand), middleware customization, pagination utilities, and retry patterns. Includes JSON event schemas and real-world examples for Node.js Lambda functions. Last updated March 2024; authoritative AWS Lambda Developer Guide.
## License if known
Proprietary – see AWS Documentation Terms.

# Environment Configuration (dotenv + Zod)
## https://github.com/motdotla/dotenv#readme
Official `dotenv` documentation covering loading environment variables from `.env` files, default values, variable expansion, and safety checks. Combined with Zod-based schema validation patterns to enforce runtime type safety and provide clear error feedback on missing or malformed configuration values. Guides building robust, type-safe pipelines for application settings in Node.js environments. Last updated March 2024; widely adopted community standard.
## License if known
BSD-2-Clause (dotenv), MIT (Zod)

# OpenAI Node.js SDK Reference
## https://github.com/openai/openai-node
Official reference for OpenAI’s Node.js SDK, detailing authentication flows, rate limiting, retry strategies, and usage patterns for ChatCompletion and Completions APIs. Covers streaming responses, pagination, error codes, and performance tuning recommendations with real code examples. Essential for integrating generative AI capabilities in agentic workflows. Updated April 2024; maintained by OpenAI.
## License if known
MIT

# GitHub REST API Documentation
## https://docs.github.com/en/rest
Authoritative GitHub REST API reference outlining endpoint specifications, authentication methods, pagination guidelines, webhook configuration, and rate limiting. Provides detailed JSON schemas for requests and responses, query parameter usage, and versioning best practices. Crucial for automating issue, branch, and pull request workflows in continuous integration pipelines. Continuously updated; licensed under CC BY 4.0.
## License if known
CC BY 4.0

# Prometheus Exposition Format
## https://prometheus.io/docs/instrumenting/exposition_formats/
Official documentation of Prometheus exposition formats, including text-based and protocol buffer encodings. Defines metric types (counter, gauge, histogram, summary), naming conventions, label usage, and endpoint implementation best practices. Essential for building compatible `/metrics` endpoints and ensuring accurate scraping and instrumentation of service performance. Published May 2023; maintained by the Prometheus project.
## License if known
Apache 2.0

# OpenAPI & JSON Schema Specifications
## https://spec.openapis.org/oas/v3.1.0
The OpenAPI Specification (v3.1) defines structure and semantics for RESTful API definitions, covering Paths, Components (schemas, parameters, responses), and Security Schemes. Integrated with JSON Schema (https://json-schema.org/specification.html) for detailed validation keywords, formats, and extensibility. Underpins generation, validation, and maintenance of the `/openapi.json` endpoint with strict schema conformance. OpenAPI published January 2023 (CC BY 4.0); JSON Schema published latest draft 2023 (CC0).
## License if known
CC BY 4.0 (OpenAPI), CC0 (JSON Schema)

# Markdown Rendering Libraries
## https://github.com/markdown-it/markdown-it
Official documentation for MarkdownIt, a pluggable CommonMark-compliant parser and renderer. Covers core API for parsing and rendering Markdown, performance tuning, plugin architecture, and customization hooks. Combined with the `markdown-it-github` plugin (https://github.com/markdown-it/github) to enable GitHub-flavored Markdown extensions like tables, task lists, and autolinks. Critical for implementing interactive `/docs` endpoints and secure HTML rendering of OpenAPI schemas. Updated February 2024; MIT License.
## License if known
MIT

# GitHub Actions Reusable Workflows (`workflow_call`)
## https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_call
Official GitHub Actions documentation describing the `workflow_call` event for invoking reusable workflows. Details inputs, outputs, secrets contexts, and event syntax for modular, composable CI/CD pipelines. Provides examples demonstrating cross-repository workflow calls, parameter passing, and security considerations. Essential for structuring agentic-lib as part of GitHub-hosted automation via workflow_call. Last updated April 2024; CC BY 4.0.
## License if known
CC BY 4.0
