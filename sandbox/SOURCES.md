# GitHub REST API Reference
## https://docs.github.com/en/rest
The official GitHub REST API documentation provides detailed endpoint definitions, authentication mechanisms, pagination strategies, and error-handling guidance. It covers how to construct HTTP requests, manage rate limits, and interpret responses—fundamental for implementing agentic-lib’s CLI commands and SQS Lambda handlers that interact with GitHub resources. Last updated: ongoing (auto-published by GitHub). Authoritative as the source of truth for all GitHub REST interactions.
## CC BY 4.0

# AWS Lambda SQS Event Source Mapping
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
This AWS Lambda guide explains how to configure SQS as an event source, detailing event payload structure, batch size, visibility timeouts, and retry mechanics. Crucial for understanding the shape of events passed to `digestLambdaHandler` and simulating SQS inputs in tests. Last revised: April 2023. Official AWS documentation, licensed under Apache 2.0.
## Apache 2.0

# AWS SDK for JavaScript (v3) – Client SQS
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/index.html
Covers the SQS client of AWS SDK v3, including method signatures for sending and receiving messages, middleware customization, and TypeScript type definitions. Provides actionable code examples for queue operations that can be adapted to advanced agentic-lib integrations. Last updated: 2024. Licensed under Apache 2.0.
## Apache 2.0

# Zod – TypeScript-first Schema Validation
## https://zod.dev/
A comprehensive reference for Zod’s API, describing schema definitions, parsing strategies, custom refinements, and detailed error formatting options. Essential for robust environment variable validation (`configSchema.parse`) and runtime safety in agentic-lib. Last update: May 2024. MIT licensed.
## MIT

# dotenv – Environment Configuration
## https://github.com/motdotla/dotenv#readme
Explains loading environment variables from `.env` files, parsing options, and security best practices for secret management. Directly informs agentic-lib’s setup process and test overrides. Last commit: February 11, 2024. BSD-2-Clause licensed.
## BSD-2-Clause

# OpenAI Node.js SDK
## https://github.com/openai/openai-node
The official Node.js client for OpenAI’s API, detailing initialization with API keys, request/response models for chat completions, streaming APIs, and error handling. Invaluable for implementing and testing `createChatCompletion` interactions in agentic-lib. Last release: May 2024. MIT licensed.
## MIT

# Probot – GitHub Automation Framework
## https://probot.github.io/docs/
An open-source framework for building GitHub Apps using Node.js, covering webhook event handling, authentication flows, and plugin development. Offers design patterns for event-driven workflows and unit testing that can inspire enhancements to agentic-lib’s modular architecture. Last updated: 2024. MIT licensed.
## MIT

# GitHub Actions Toolkit – Core Library
## https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action
Describes the `@actions/core` and `@actions/github` libraries for developing JavaScript-based GitHub Actions, including input/output parsing, logging utilities, and error reporting. Useful for future extensions of agentic-lib into native GitHub Actions. Last updated: 2024. CC BY 4.0.
## MIT