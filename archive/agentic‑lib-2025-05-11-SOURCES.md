# GitHub Actions Official Documentation & Workflow Syntax
## https://docs.github.com/en/actions
## https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions
## https://docs.github.com/en/actions/using-workflows/reusing-workflows
Comprehensive official documentation covering GitHub Actions fundamentals, detailed workflow syntax (including triggers, jobs, steps, expressions, concurrency, caching, composite actions, version pinning), and advanced features like reusable workflows (`workflow_call`). Provides best practices for parameter validation, secrets handling, and debugging strategies. Essential for agentic-lib’s simulation engine to accurately parse, validate, and compose complex workflows. Last updated: November 2023. Authoritative: GitHub.
## License: GitHub Terms of Service

# GitHub API Reference (REST & GraphQL)
## https://docs.github.com/en/rest
## https://docs.github.com/en/graphql
Unified reference for GitHub’s REST and GraphQL APIs, detailing endpoints for workflows (`dispatch`, `runs`), issues, pull requests, branches, authentication, rate limiting, pagination, and error responses, alongside GraphQL schema definitions for complex queries and mutations. Crucial for agentic-lib’s metadata retrieval, orchestration, and SDK integration with CI/CD automation. Last updated: March 2024 (GraphQL), October 2023 (REST). Authoritative: GitHub.
## License: GitHub Terms of Service

# YAML Parsing & js-yaml Library
## https://yaml.org/spec/1.2/spec.html
## https://github.com/nodeca/js-yaml#readme
Official YAML 1.2 specification detailing syntax, data types, anchors, aliases, and merge keys, paired with `js-yaml` usage for robust loading, dumping, and anchor resolution in JavaScript. Underpins agentic-lib’s workflow loader for accurate parsing and round-trip fidelity. Last updated: July 2021 (spec), May 2023 (js-yaml). Authoritative: YAML.org; js-yaml maintainers.
## License: Public Domain (Spec), MIT (js-yaml)

# JSON Schema for GitHub Actions Workflows
## https://json.schemastore.org/github-workflow.json
Official JSON Schema used by GitHub to validate Actions workflow files, illustrating schema structure, allowed values, and validation rules for triggers (`on`), jobs, steps, actions (`uses`), runners (`runs-on`), and more. Crucial for implementing linting and programmatic validation of workflows in agentic-lib. Last updated: April 2024. Authoritative: SchemaStore.
## License: MIT License

# Zod Schema Validation
## https://github.com/colinhacks/zod#readme
TypeScript-first schema validation library covering schema creation, parsing, refinements, custom error messaging, and TypeScript integration. Vital for enforcing agentic-lib’s configuration structures, CLI inputs, and API payload contracts with explicit types and runtime checks. Last updated: December 2023. Authoritative: colinhacks.
## License: MIT License

# AWS Lambda & SQS Integration with AWS SDK for JavaScript v3
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
Official AWS guide on setting up SQS as an event source for Lambda functions, covering message payload structures, batch failure semantics, retry policies, scaling considerations, and error handling best practices. Includes AWS SDK v3 modular imports, command patterns, middleware stack configuration, and TypeScript examples. Critical for implementing and testing Lambda-based message handlers in agentic-lib. Last updated: September 2023 (Lambda), May 2024 (SDK). Authoritative: AWS.
## License: Apache License 2.0

# OpenAI Node.js Client
## https://github.com/openai/openai-node
Official OpenAI API client for Node.js offering configuration patterns, `OpenAIApi` methods (`chat.completions`, `edits`), streaming interfaces, rate-limiting, and retry strategies. Includes comprehensive TypeScript definitions and practical examples for integrating AI-driven features in agentic-lib. Last updated: April 2024. Authoritative: OpenAI.
## License: MIT License

# Act: GitHub Actions Local Runner
## https://github.com/nektos/act
CLI tool to execute GitHub Actions workflows locally within Docker, replicating GitHub’s runner environment for step-by-step debugging, matrix strategies, and secret injection. Provides deep insights into workflow behavior, environment variables, and action execution before CI/CD. Highly practical for local testing and troubleshooting complex workflows. Last updated: April 2024. Authoritative: nektos.
## License: MIT License