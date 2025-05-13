# GitHub REST API
## https://docs.github.com/en/rest
The official GitHub REST API reference provides exhaustive endpoint specifications, including authentication flows, rate-limit handling, pagination details, and JSON schemas for requests and responses across repositories, issues, pull requests, workflows, and more. This source is indispensable for authoring and debugging agents that interact with GitHub, ensuring correct HTTP methods and payload structures. Last updated April 2024; authoritative as the primary documentation from GitHub.
## License: CC BY 4.0 (per GitHub documentation terms)

# GitHub Actions `workflow_call` Event
## https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_call
Details the schema and payload for the `workflow_call` event, including `inputs`, `secrets`, and how to define reusable workflows. Critical for composing modular, SDK-like workflows in agentic-lib that invoke one another programmatically. Includes examples of nesting calls and validating input types. Last reviewed March 2024; official GitHub source.
## License: CC BY 4.0 (per GitHub documentation terms)

# AWS SQS Integration and SDK v3
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/index.html
Combines guidance on configuring Amazon SQS as a Lambda event source—batch sizes, retry policies, and the exact JSON payload delivered to handlers—with in-depth API details of the AWS SDK for JavaScript v3 SQS client. Covers method signatures (`sendMessage`, `receiveMessage`), pagination helpers, error handling semantics, and best practices for high-throughput message processing in `digestLambdaHandler`. Last updated January 2024 (Lambda); February 2024 (SDK); AWS authoritative.
## License: AWS docs proprietary; AWS SDK v3 under Apache-2.0

# AWS S3 Client (v3)
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/index.html
Covers the AWS SDK v3 S3 client, including command interfaces (`PutObjectCommand`, `GetObjectCommand`), multipart upload configuration, permission scope, and retry strategies. Essential for understanding how `uploadAndSendMessage` constructs and manages S3 payload uploads before dispatching SQS messages. Last updated February 2024; AWS authoritative.
## License: Apache-2.0

# Markdown Rendering & Mermaid Workflows
## https://github.com/markdown-it/markdown-it#readme
## https://mermaid.js.org/syntax/workflow.html
## https://www.npmjs.com/package/markdown-it-github
Combines the core `markdown-it` plugin API with the `markdown-it-github` integration and the `mermaid-workflow` syntax specification. Details plugin hooks, renderer customization, and code-block transformation patterns used to convert `mermaid-workflow` fenced blocks into interactive HTML diagrams. Provides examples of custom styling, theme overrides, and performance considerations. Last updated June 2023 (markdown-it), May 2024 (Mermaid); community-maintained via MIT license.
## License: MIT

# OpenAI Chat Completions API Reference
## https://platform.openai.com/docs/api-reference/chat/create
Describes the `POST /chat/completions` endpoint for building conversational agents, including parameter definitions (`model`, `messages`, `temperature`, `max_tokens`), role alignment, response schema with tokens and usage metrics, and structured error codes. Fundamental for implementing `refine` workflows and orchestrating AI-driven code transformations in agentic-lib. Last updated April 2024; authoritative from OpenAI.
## License: OpenAI API Terms (proprietary)

# Zod Schema Validation Library
## https://github.com/colinhacks/zod
The official Zod documentation explains schema declaration, type inference, synchronous/asynchronous parsing, refinement hooks, and error formatting. Vital for runtime environment validation (`configSchema`), input sanitization, and ensuring robust CLI configuration in agentic-lib. Last updated July 2023; MIT-licensed.
## License: MIT

# Node.js Core API Reference
## https://nodejs.org/api/
Consolidates Node.js built-in module specifications—`fs/promises` for file I/O (`readFile`, `writeFile`, `readdir`), `child_process` for process spawning (`spawnSync`), URL utilities (`fileURLToPath`, `import.meta.url`), and module resolution (`createRequire`). This general reference underpins the CLI scaffolding and error-handling patterns across sandbox and core library code. Aligned with Node.js v20 LTS; curated by the OpenJS Foundation.
## License: MIT