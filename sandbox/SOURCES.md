# GitHub REST API
## https://docs.github.com/en/rest
Comprehensive reference for GitHub’s REST API v3 endpoints, including authentication, pagination, rate limiting, webhooks, and repository management. This documentation provides code samples for Node.js (Axios, Octokit), detailed request/response schemas, and best practices for error handling and efficient polling. Core to implementing any GitHub integration, it ensures your workflows can reliably interact with issues, branches, and commits. Last updated continuously; authoritative as the official GitHub docs.
## Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub Actions Reusable Workflows (workflow_call)
## https://docs.github.com/en/actions/using-workflows/reusing-workflows#example-using-workflow_call
Step-by-step guide to defining and invoking reusable workflows via `workflow_call`, covering inputs, outputs, secrets, and permissions. Includes YAML templates and real-world patterns for composing agentic workflows, enabling modular CI/CD pipelines. Addresses core implementation patterns for designing SDK-style workflows that other repositories can import and extend.
## Creative Commons Attribution 4.0 International (CC BY 4.0)

# AWS Lambda Node.js Handler
## https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
Official AWS Lambda developer guide for Node.js, detailing handler signatures, context object properties, lifecycle hooks, and asynchronous invocation patterns. Provides actionable guidance on logging, error propagation, and cold start optimization. Essential for implementing `digestLambdaHandler` and other serverless endpoints in your workflow.
## Amazon Software License (ASL)

# AWS Lambda with Amazon SQS
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
Technical specification for integrating Amazon SQS with Lambda functions, including event structure (`Records` array), batch size tuning, visibility timeouts, and dead-letter queues. Offers sample CloudFormation/CDK configurations and troubleshooting tips for message processing failures. Critical for reliable SQS-driven processing.
## Amazon Software License (ASL)

# OpenAI Node.js Library
## https://platform.openai.com/docs/libraries/node-js-library
Official guide for the `openai` npm package, covering client configuration, authentication, rate limits, streaming vs. polling, and chat/completion endpoints. Demonstrates real code examples in TypeScript and JavaScript, error handling strategies, and best practices for prompt design. Foundational for implementing `createChatCompletion` and parsing API responses.
## MIT License

# Zod Schema Validation
## https://github.com/colinhacks/zod
High-performance TypeScript-first schema validation library. Documentation includes schema composition, transformations, discriminated unions, error formatting, and asynchronous parsing. Offers practical examples for environment variable validation (`configSchema`) and complex data sanitization. Licensed under MIT and widely adopted.
## MIT License

# Vitest Testing Framework
## https://vitest.dev/guide/
Modern unit testing framework for Vite and Node.js, with support for mocks, snapshots, coverage, and parallel execution. The guide covers setup, configuration, mocking strategies (`vi.mock`), lifecycle hooks, and CLI usage. Essential for maintaining the existing `vitest` tests and ensuring rapid feedback loops.
## MIT License

# GitHub Actions Toolkit for JavaScript
## https://github.com/actions/toolkit
Collection of packages (`@actions/core`, `@actions/github`) to build JavaScript/TypeScript GitHub Actions. Includes utility functions for inputs, outputs, logging, and REST API clients. In-depth docs with code snippets show how to develop custom actions and integrate with GitHub’s runtime environment. Licensed under MIT, providing a feature-rich alternative for agentic-lib’s CLI integrations.
## MIT License