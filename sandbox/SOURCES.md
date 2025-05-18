# AWS Lambda & Amazon SQS Integration
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
Comprehensive official AWS guide detailing how to configure AWS Lambda functions to consume messages from Amazon SQS queues. Covers event source mapping, batch size tuning, error handling using `batchItemFailures`, visibility timeout strategies, and concurrency controls for both standard and FIFO queues. Includes code examples using the AWS SDK for JavaScript v3 `SQSClient` (SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand), along with middleware customization, pagination utilities, and retry patterns. Provides JSON event schemas and real-world Node.js samples to address core implementation needs in event-driven workflows. Last updated March 2024; authoritative AWS Lambda Developer Guide.
## License if known
Proprietary – see AWS Documentation Terms.

# Environment Configuration (dotenv + Zod)
## https://github.com/motdotla/dotenv#readme
Official `dotenv` documentation for loading environment variables from `.env` files in Node.js, covering default values, variable expansion, and security considerations. When paired with Zod schema validation (https://github.com/colinhacks/zod), enables runtime type checking and clear error reporting for missing or malformed configuration, enforcing robust, type-safe pipelines. Essential for consistent environment loading and validation in CLI, Lambda, and server components. Last updated March 2024; widely adopted community standard.
## License if known
BSD-2-Clause (dotenv), MIT (Zod)

# OpenAI Node.js SDK Reference
## https://github.com/openai/openai-node
The official OpenAI Node.js SDK reference describes authentication flows, API client initialization, rate limiting considerations, and retry strategies. Covers usage patterns for ChatCompletion, Completions, and Edits endpoints, including streaming responses, pagination handling, and error code management. Provides performance tuning recommendations and real code examples to seamlessly integrate generative AI into agentic workflows. Last updated April 2024; maintained by OpenAI.
## License if known
MIT

# GitHub REST API Documentation
## https://docs.github.com/en/rest
Authoritative GitHub REST API reference outlining endpoint specifications for issues, branches, pull requests, and more. Details authentication methods (personal tokens, OAuth), pagination guidelines, rate limiting headers, webhook configuration, and versioning best practices. Includes precise JSON schemas for requests and responses to automate CI/CD and repository management in agentic workflows. Continuously updated; licensed under CC BY 4.0.
## License if known
CC BY 4.0

# Prometheus Exposition Format
## https://prometheus.io/docs/instrumenting/exposition_formats/
Official Prometheus documentation defining exposition formats for text-based and protocol buffer encodings. Specifies metric types (counter, gauge, histogram, summary), naming conventions, label cardinality guidelines, and endpoint implementation best practices. Critical for creating a compatible `/metrics` endpoint in Node.js and ensuring accurate data scraping for observability and alerting. Published May 2023; maintained by the Prometheus project.
## License if known
Apache 2.0

# OpenAPI & JSON Schema Specifications
## https://spec.openapis.org/oas/v3.1.0
Comprehensive specification for OpenAPI v3.1.0, defining the structure, components (schemas, parameters, responses), security schemes, and reference mechanisms for RESTful APIs. Integrates with the latest JSON Schema (https://json-schema.org/specification.html) for detailed validation, custom types, and extensibility. Underpins the generation and strict validation of the `/openapi.json` endpoint, enabling code-generated clients and interactive docs. OpenAPI spec published January 2023 (CC BY 4.0); JSON Schema latest draft 2023 (CC0).
## License if known
CC BY 4.0 (OpenAPI), CC0 (JSON Schema)

# Node.js HTTP Module
## https://nodejs.org/api/http.html
Official Node.js documentation for the core `http` module, detailing the `http.Server`, `http.IncomingMessage`, and `http.ServerResponse` APIs. Covers request routing, header management, streaming data, error handling, and performance considerations. Essential for building custom HTTP servers, implementing rate limiting logic, and managing CORS and Basic Auth in a lightweight, dependency-free manner. Reflects Node.js v20.x; authoritative Node Foundation docs.
## License if known
CC BY-SA 3.0

# HTTP Authentication Schemes
## https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication
Detailed MDN Web Docs guide to HTTP authentication methods including Basic, Digest, Bearer tokens, and usage of the `Authorization` header. Includes header syntax, Base64 encoding for Basic Auth, security best practices, and server-side implementation examples. Directly informs the implementation of Basic Auth for `/metrics` and `/docs` endpoints in the HTTP server. Last reviewed August 2023; authoritative Mozilla resource.
## License if known
CC BY-SA 2.5