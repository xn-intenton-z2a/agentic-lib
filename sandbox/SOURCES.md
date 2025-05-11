# GitHub Actions Official Documentation & Workflow Syntax
## https://docs.github.com/en/actions
## https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions
## https://docs.github.com/en/actions/using-workflows/reusing-workflows
Comprehensive official documentation covering GitHub Actions fundamentals, detailed workflow syntax, and reusable workflows. Includes guides on triggers, jobs, steps, expressions (`github`, `env`, etc.), concurrency controls, caching strategies, composite actions, version pinning, and advanced features like `workflow_call`. Also provides best practices for defining inputs/outputs, secrets propagation, parameter validation, and debugging reusable workflows. Essential for agentic‐lib’s simulation engine to accurately parse, validate, and compose complex workflows and nested calls. Last updated: November 2023 (Actions), November 2023 (Workflow Syntax), October 2023 (Reusable Workflows). Authoritative: GitHub.
## License: GitHub Terms of Service

# GitHub API Reference
## https://docs.github.com/en/rest
Comprehensive REST API documentation covering endpoints for workflows (`dispatch`, `runs`), issues, pull requests, branches, authentication (OAuth, tokens, apps), pagination, rate limits, and error responses. Also includes guidance on GraphQL integration for complex queries and batch mutations. Core to agentic‐lib’s metadata retrieval, orchestration, and SDK integration for CI/CD automation. Last updated: October 2023. Authoritative: GitHub.
## License: GitHub Terms of Service

# YAML Parsing & Specification
## https://yaml.org/spec/1.2/spec.html
Defines YAML 1.2 syntax, data types, anchors/aliases, merge keys, and serialization rules. Underpins agentic‐lib’s workflow loader for robust parsing and round‐trip fidelity. Paired with the `js-yaml` library (v4.1.0) for implementation details on loading, dumping, and anchor resolution. Last updated: July 2021 (spec), May 2023 (js-yaml). Authoritative: YAML.org and js-yaml maintainers.
## License: Public Domain (Spec), MIT (js-yaml)

# JSON Schema for GitHub Actions Workflow
## https://json.schemastore.org/github-workflow.json
Official JSON Schema definitions used by GitHub to validate Actions workflow files. Details schema structure, properties, allowed values, and validation rules for `on`, `jobs`, `steps`, `uses`, `runs-on`, and more. Crucial for implementing additional linting and programmatic validation of workflows in agentic‐lib. Last updated: April 2024. Authoritative: SchemaStore.
## License: MIT License

# Zod Schema Validation
## https://github.com/colinhacks/zod#readme
TypeScript-first schema validation library covering schema creation, parsing modes, refinements, custom error handling, and TypeScript integration. Vital for enforcing configuration, CLI inputs, and API payload contracts in agentic‐lib. Last updated: December 2023. Authoritative: colinhacks.
## License: MIT License

# AWS Lambda & SQS Integration with AWS SDK for JavaScript v3
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
Official AWS guide on event source mapping for SQS-triggered Lambda functions, covering payload formats, batch item failures, retry semantics, scaling considerations, and best practices for error handling. Includes AWS SDK for JavaScript v3 code snippets with modular imports, command patterns, middleware stacks, and TypeScript definitions. Critical for implementing and testing Lambda-based message handlers in agentic‐lib. Last updated: September 2023 (Lambda), May 2024 (SDK). Authoritative: AWS.
## License: Apache License 2.0

# OpenAI Node.js Client
## https://github.com/openai/openai-node
Official OpenAI API client for Node.js, covering configuration, `OpenAIApi` methods (`chat`, `completions`, `edits`), streaming APIs, error handling, rate limiting, and retry strategies. Includes TypeScript type definitions and examples for integrating AI-driven features within agentic‐lib workflows. Last updated: April 2024. Authoritative: OpenAI.
## License: MIT License

# GitHub GraphQL API Reference
## https://docs.github.com/en/graphql
Detailed reference for GitHub’s GraphQL API, including type system, schemas for queries and mutations, rate limits, authentication methods, and pagination. Enables efficient retrieval of complex metadata and batch operations beyond REST. Essential for advanced integrations and custom metadata queries in agentic‐lib. Last updated: March 2024. Authoritative: GitHub.
## License: GitHub Terms of Service