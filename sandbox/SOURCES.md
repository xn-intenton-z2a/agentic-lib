# GitHub REST API

## https://docs.github.com/en/rest
The official GitHub REST API documentation provides comprehensive technical details on authentication, rate limiting, pagination, and all endpoint specifications for interacting with repositories, issues, pull requests, workflows, and more. This source is critical for implementing GitHub-based agents and automating repository operations with precise JSON schemas and HTTP methods. Last updated April 2024; authoritative as the primary reference from GitHub itself.

## License: CC BY 4.0 (per GitHub documentation terms)

# GitHub Actions `workflow_call` Event

## https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_call
This document details the `workflow_call` event payload and inputs schema for reusable GitHub Actions workflows. It includes the structure of `inputs`, `secrets`, and how callers can invoke workflows programmatically. This is essential for composing agentic workflows as SDK-like modules in agentic-lib. Last reviewed March 2024; official source from GitHub.

## License: CC BY 4.0 (per GitHub documentation terms)

# AWS Lambda Integration with Amazon SQS

## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
AWS’s Lambda documentation describes how to configure SQS as an event source, including batch size, retry behavior, and the exact structure of the SQS-triggered event delivered to the handler. Provides essential JSON examples and failure handling patterns needed for `digestLambdaHandler`. Last updated January 2024; authoritative from AWS.

## License: Proprietary AWS documentation (no explicit license)

# AWS SDK for JavaScript v3 – SQS Client

## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/index.html
Details the TypeScript/JavaScript API for the AWS SDK v3 SQS client, including method signatures, input/output shapes, error handling, and pagination helpers. Critical for extending or customizing SQS operations in agentic-lib, such as sending or receiving messages programmatically. Last updated February 2024; provided by AWS.

## License: Apache-2.0 (AWS SDK v3)

# markdown-it

## https://github.com/markdown-it/markdown-it#readme
The core `markdown-it` parser documentation covers plugin architecture, rendering APIs, and performance considerations. Essential for understanding and customizing how mermaid-workflow code blocks are transformed into HTML. Last updated June 2023; MIT-licensed.

## License: MIT

# Mermaid Workflow Syntax

## https://mermaid.js.org/syntax/workflow.html
Describes the `mermaid-workflow` syntax, directives, styling, and integration points for rendering flow diagrams. Provides actionable examples and configuration options used by `markdown-it` plugins to generate interactive diagrams. Last updated May 2024; official from Mermaid.js.

## License: MIT

# OpenAI Chat Completions API Reference

## https://platform.openai.com/docs/api-reference/chat/create
Documents the `POST /chat/completions` endpoint, including request body parameters (`model`, `messages`, `temperature`, etc.), response formats, and error codes. Key to implementing robust AI-driven refinement in agentic workflows. Last updated April 2024; authoritative from OpenAI.

## License: OpenAI API Terms (proprietary)

# Zod Schema Validation Library

## https://github.com/colinhacks/zod
Zod’s README and API reference detail schema creation, type inference, parsing methods, and error handling patterns. Crucial for validating environment variables and runtime inputs (`configSchema`) in agentic-lib. Last updated July 2023; MIT-licensed.

## License: MIT