# GitHub Actions Workflow Syntax
## https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
Official GitHub documentation detailing the YAML schema for authoring and composing reusable GitHub Actions workflows. Covers key fields such as `workflow_call`, jobs, steps, inputs, and outputs, enabling deterministic orchestration of multi-repository automation. Last updated February 2024. This authoritative source ensures compliance with core implementation requirements for defining agentic-lib workflows.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub REST API
## https://docs.github.com/en/rest
Comprehensive reference to GitHub’s REST endpoints for interacting with issues, branches, pull requests, and other repository resources. Provides essential technical specifications for request and response payloads, authentication methods, pagination, and rate limiting strategies used by agentic workflows. Last known refresh March 2024; official GitHub documentation.
## License
Creative Commons Attribution 4.0 International (CC BY 4.0)

# AWS Lambda Event Source Mapping: SQS
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
Authoritative AWS guide on configuring Lambda functions triggered by SQS events. Details the structure of the SQS event payload, error handling, batch item failures, and retry behavior, directly informing the implementation of `digestLambdaHandler`. Last updated January 2023 by AWS. Critical for understanding Lambda-SQS integration patterns.
## License
Apache License 2.0

# AWS SDK for JavaScript v3: Lambda Client
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-lambda/index.html
Technical reference for the AWS SDK v3 `@aws-sdk/client-lambda`, including client configuration, method signatures, and pagination utilities. Demonstrates best practices for invoking and managing Lambda functions programmatically within Node.js applications. Last updated May 2024; official AWS SDK documentation.
## License
Apache License 2.0

# OpenAI Node.js SDK
## https://github.com/openai/openai-node
OpenAI’s official Node.js client library for interacting with the OpenAI API. Covers configuration of `Configuration` and `OpenAIApi`, usage patterns for `createChatCompletion`, error handling, and streaming support. Frequent commits with the latest v4.x features; last commit April 2024. MIT-licensed, providing actionable code examples for integration in agentic workflows.
## License
MIT

# Zod: TypeScript-first Schema Validation
## https://github.com/colinhacks/zod
Schema validation library for TypeScript and JavaScript, offering declarative schemas, inference, and detailed error reporting. Documentation covers object, array, and union schemas, transformations, and custom validators, essential for robust environment and payload validation in agentic-lib. Last updated March 2024; MIT-licensed.
## License
MIT

# dotenv: Environment Variable Loader
## https://github.com/motdotla/dotenv
Lightweight library for loading environment variables from `.env` files into `process.env`. Key for managing configuration across local, test, and production environments. Documentation includes usage patterns, security considerations, and customization options. Last updated February 2024; BSD-2-Clause license.
## License
BSD-2-Clause

# GitHub Actions Toolkit
## https://github.com/actions/toolkit
Official JavaScript toolkit for building GitHub Actions, exposing libraries for core Actions API, HTTP requests, and logging. Provides abstractions for context management, input parsing, and default environment variables, complementing agentic-lib CLI utilities. Last updated January 2024; MIT license.
## License
MIT