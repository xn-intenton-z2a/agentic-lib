# GitHub Actions Workflow Syntax
## https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
This page provides the official specification for defining workflows in GitHub Actions, covering triggers (`on` in string, array, and object forms), job definitions, `needs` dependencies, `steps`, `uses` references, matrices, reusable workflows, concurrency controls, environment variables, and conditional expressions. It is essential for implementing agentic-lib’s dry-run parsing engine and accurately modeling workflow behavior. Last updated: November 2023. Authoritative: official GitHub documentation.
## License: Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub API Reference
## https://docs.github.com/en/rest
Comprehensive reference for GitHub’s APIs, including REST endpoints for workflows (`dispatch`, `runs`), issues, pull requests, branches, as well as authentication schemes, pagination, rate limits, and error handling. Also integrates with the GraphQL API (`https://docs.github.com/en/graphql`) for schema-driven queries and mutations to efficiently fetch complex data structures. Core for agentic-lib’s SDK integration, workflow orchestration, and advanced metadata retrieval. Last updated: October 2023. Authoritative: maintained by GitHub.
## License: GitHub Terms of Service

# Creating JavaScript Actions
## https://docs.github.com/en/actions/creating-actions/creating-actions/creating-a-javascript-action
Authoring JavaScript Actions, detailing `action.yml` metadata, toolkit libraries (`@actions/core`, `@actions/github`), TypeScript support, packaging, secure environment variable handling, and best practices for efficient execution. Directly informs agentic-lib’s code generation for drop-in JS replacements of action steps and reusable workflows. Last updated: December 2023.
## License: Creative Commons Attribution 4.0 International (CC BY 4.0)

# Reusing Workflows
## https://docs.github.com/en/actions/using-workflows/reusing-workflows
Official guide to compose and call reusable workflows via `workflow_call`, defining inputs and outputs, secrets inheritance, and strategy for modular pipeline design. Critical for agentic-lib to trace and simulate nested workflow calls, manage data contracts, and generate accurate execution graphs. Last updated: October 2023. Authoritative: official GitHub documentation.
## License: Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub Actions Expressions and Contexts
## https://docs.github.com/en/actions/learn-github-actions/expressions
Documentation of GitHub’s expression syntax for conditional execution and dynamic value interpolation, including context objects (e.g., `github`, `env`, `secrets`, `matrix`), operators, functions, and runtime evaluation rules. Essential for evaluating `if` conditions and context variables during workflow simulation in agentic-lib. Last updated: July 2023. Authoritative: official GitHub documentation.
## License: Creative Commons Attribution 4.0 International (CC BY 4.0)

# AWS Lambda & SQS Integration
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
Comprehensive overview of AWS Lambda event source mapping for Amazon SQS, detailing event payload structure, batch sizes, partial batch failure handling (`batchItemFailures`), retry behavior, and scalability considerations. Combined with the AWS SDK for JavaScript v3 reference (`https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html`) for client instantiation, middleware stacks, retry strategies, and TypeScript definitions. Vital for agentic-lib’s simulation and mocking of SQS events and Lambda handlers. Last updated: September 2023. Authoritative: maintained by AWS.
## License: Apache License 2.0

# OpenAI Node.js API Reference
## https://platform.openai.com/docs/libraries/node-js-reference
Official Node.js API reference for the OpenAI library, covering `Configuration` setup, methods for chat completions, streaming responses, error handling, rate limiting, and best practices for API usage. Integral for implementing AI-driven workflow refinements, error summarization, and intelligent insights in agentic-lib. Last updated: January 2024.
## License: MIT License

# act: Run GitHub Actions Locally
## https://github.com/nektos/act#readme
Documentation for `act`, a CLI tool that emulates the GitHub Actions runtime locally, including event simulation, matrix testing, environment variable mapping, and output formatting. Serves as a reference for validating and debugging agentic-lib’s local workflow simulations before CI execution. Last updated: November 2023. Authoritative: community-maintained open source.
## License: MIT License