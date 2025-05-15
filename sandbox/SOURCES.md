# GitHub REST API
## https://docs.github.com/en/rest
The official GitHub REST API reference provides exhaustive endpoint specifications, detailing authentication workflows (OAuth, PATs), rate-limit handling, pagination patterns, and JSON schemas for requests and responses across repositories, issues, pull requests, workflows, and more. This resource is indispensable for implementing agents that interact with GitHub, ensuring correct HTTP methods, headers, and payload formats. Last updated April 2024; authoritative as the primary source from GitHub.
## License: CC BY 4.0 (per GitHub documentation terms)

# GitHub Actions Workflow Syntax
## https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
This documentation defines the YAML schema for GitHub Actions workflows, covering jobs, steps, `uses` directives, `run` commands, conditionals (`if`), matrices, permissions, environment variables, and artifact handling. Essential for authoring, validating, and extending reusable agentic-lib workflows with complex triggers, job dependencies, and secure permissions. Last updated March 2024; official GitHub source.
## License: CC BY 4.0 (per GitHub documentation terms)

# GitHub Actions `workflow_call` Event
## https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_call
Details the schema and payload for the `workflow_call` event, including `inputs`, `secrets`, and how to invoke and reuse modular workflows programmatically. Includes examples of nested calls, type validation, and default values—vital for composing SDK-like workflows in agentic-lib. Last reviewed March 2024; official GitHub source.
## License: CC BY 4.0 (per GitHub documentation terms)

# GitHub Actions Expressions & Contexts
## https://docs.github.com/en/actions/learn-github-actions/expressions
Covers the built-in expression syntax and contexts (`github`, `env`, `secrets`, `steps`, `jobs`, `runner`) used to compute dynamic values in workflow YAML. Includes functions, operators, and examples for branching logic, context extraction, and string interpolation—critical for authoring robust, data-driven agentic workflows. Last reviewed March 2024; official GitHub source.
## License: CC BY 4.0 (per GitHub documentation terms)

# AWS SDK v3 for JavaScript (SQS, S3, and Lambda)
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/index.html
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/index.html
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
Combines the JavaScript SDK v3 clients for Amazon SQS and S3—including method signatures (`sendMessage`, `receiveMessage`, `PutObjectCommand`, `GetObjectCommand`), pagination helpers, multipart uploads, permission scopes, retry strategies—with AWS Lambda event source mapping for SQS (batch size, retry policies). Essential for understanding how `uploadAndSendMessage` and `digestLambdaHandler` orchestrate high-throughput messaging and storage workflows. Last updated February 2024 (SQS & S3), January 2024 (Lambda); AWS authoritative.
## License: AWS docs proprietary; AWS SDK v3 under Apache-2.0

# Markdown Rendering & Mermaid Workflows
## https://github.com/markdown-it/markdown-it#readme
## https://mermaid.js.org/syntax/workflow.html
## https://www.npmjs.com/package/markdown-it-github
Details the `markdown-it` plugin API, the `markdown-it-github` integration, and the `mermaid-workflow` syntax specification. Explains plugin hooks, renderer customization, and fenced code-block transformations used to generate interactive HTML diagrams from `mermaid-workflow` blocks. Includes theming, performance tips, and custom extension patterns—crucial for robust `--generate-interactive-examples` support. Last updated June 2023 (markdown-it), May 2024 (Mermaid); community-maintained via MIT license.
## License: MIT

# OpenAI Chat Completions API Reference
## https://platform.openai.com/docs/api-reference/chat/create
Describes the `POST /chat/completions` endpoint for building conversational agents, including parameters (`model`, `messages`, `temperature`, `max_tokens`), response schema (choices, usage metrics), and error codes. Fundamental for implementing `refine` workflows, orchestrating multi-step AI-driven code transformations, and managing prompt-engineering patterns in agentic-lib. Last updated April 2024; authoritative from OpenAI.
## License: OpenAI API Terms (proprietary)

# Zod Schema Validation Library
## https://github.com/colinhacks/zod
The official Zod documentation explains schema declaration, type inference, synchronous/asynchronous parsing, custom refinements, and error formatting. Vital for enforcing runtime validation of environment variables (`configSchema`), CLI inputs, and workflow parameters in agentic-lib. Last updated July 2023; MIT-licensed.
## License: MIT