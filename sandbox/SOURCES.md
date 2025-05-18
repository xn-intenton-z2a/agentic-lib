# AWS SQS & Lambda Integration
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
Detailed guide combining Amazon SQS API operations with AWS Lambda event source mapping. Covers SQS message lifecycle operations (SendMessage, ReceiveMessage, DeleteMessage), queue attribute management, error handling with batchItemFailures, visibility timeout tuning, concurrency controls, and best practices for throughput and cost optimization. Includes JSON schemas for SQS events delivered to Lambda and examples for both standard and FIFO queues. Last updated March 2024; authoritative AWS Lambda Developer Guide.
## License if known
Proprietary – see AWS Documentation Terms.

# AWS SDK for JavaScript v3 – SQS Client
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/index.html
Comprehensive reference for the AWS SDK v3 SQSClient in JavaScript, detailing client configuration, commands (SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand, GetQueueAttributesCommand), pagination utilities, middleware stack customization, and error handling patterns. Critical for implementing programmatic SQS interactions within Node.js Lambda handlers and ensuring robust retry and timeouts. Updated April 2024; maintained by AWS.
## License if known
Apache 2.0

# Environment Configuration
## https://github.com/motdotla/dotenv#readme
Official dotenv documentation covering environment variable loading from `.env` files, default value handling, variable expansion, and safe mode. Combined with Zod-based validation patterns to parse and enforce runtime schemas for environment variables, this source guides building reliable, type-safe configuration pipelines in Node.js applications. Last updated March 2024; widely adopted community standard.
## License if known
BSD-2-Clause (dotenv), MIT (Zod)

# OpenAI Node.js SDK Reference
## https://github.com/openai/openai-node
Comprehensive reference for OpenAI’s official Node.js SDK, covering authentication flows, rate limit management, Chat and Completion APIs, streaming and non-streaming usage, pagination, and retry strategies. Includes real-world code examples, response schemas, and performance tuning recommendations. Updated April 2024; maintained by OpenAI.
## License if known
MIT

# GitHub REST API Documentation
## https://docs.github.com/en/rest
Authoritative GitHub REST API reference providing endpoint specifications for issues, pull requests, repositories, authentication, webhooks, and rate limiting. Features detailed JSON payload examples, query parameters, pagination guidelines, and best practices for API versioning. Continuously updated; content licensed under CC BY 4.0.
## License if known
CC BY 4.0

# Node.js Standard Library Documentation
## https://nodejs.org/api/
Official Node.js API documentation covering core modules crucial for this project, including `http` for server/client implementations, `url` for URL parsing and manipulation, and `crypto` for hashing and security operations. Provides detailed API surface definitions, examples, and explanations of the Node.js event-driven architecture and streaming interfaces, vital for building performant, secure Node.js services. Latest stable Node.js v20; CC BY 4.0.
## License if known
CC BY 4.0

# Prometheus Exposition Format
## https://prometheus.io/docs/instrumenting/exposition_formats/
Official documentation of Prometheus exposition formats, including text-based and protocol buffer structures. Defines metric types (counter, gauge, histogram, summary), naming conventions, label usage, and best practices for instrumentation endpoints. Crucial for implementing compatible `/metrics` endpoints and ensuring accurate scraping by Prometheus servers. Published May 2023; maintained by the Prometheus project.
## License if known
Apache 2.0

# OpenAPI & JSON Schema Specifications
## https://spec.openapis.org/oas/v3.1.0
The OpenAPI Specification defines the structure, semantics, and JSON Schema integration for RESTful API definitions, covering Info, Servers, Paths, Components (schemas, parameters, responses), and Security Schemes. JSON Schema specification documentation at https://json-schema.org/specification.html details schema validation keywords, formats, and extensibility. This combined source underpins generating, validating, and maintaining the `/openapi.json` endpoint with strict schema conformance. OpenAPI published January 2023 (CC BY 4.0); JSON Schema published latest draft 2023 (CC0).
## License if known
CC BY 4.0 (OpenAPI), CC0 (JSON Schema)