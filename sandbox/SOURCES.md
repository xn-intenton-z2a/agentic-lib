# GitHub Actions Workflow Syntax
## https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
This official GitHub reference defines the complete schema for workflow YAML files, detailing `on` triggers (string, array, and object forms), `jobs`, `needs` dependencies, `steps`, `uses` declarations, matrices, reusable workflows, concurrency controls, environment variables, and conditionals. It is indispensable for agentic-lib’s dry-run engine—ensuring accurate parsing and synthesis of execution plans. Last updated: November 2023. Authoritative: GitHub.
## License: Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub API Reference
## https://docs.github.com/en/rest
Comprehensive REST API documentation covering endpoints for workflows (`dispatch`, `runs`), issues, pull requests, branches, authentication (OAuth, tokens, apps), pagination, rate limits, and error patterns. Includes GraphQL guidance for complex queries and mutations. Core to agentic-lib’s metadata retrieval, orchestration, and eventual GitHub SDK integration. Last updated: October 2023. Authoritative: GitHub.
## License: GitHub Terms of Service

# Reusing Workflows
## https://docs.github.com/en/actions/using-workflows/reusing-workflows
Official guide on composing and calling reusable workflows via `workflow_call`, defining inputs/outputs, secrets inheritance, and versioning strategies for modular CI design. Critical for agentic-lib to detect nested `uses` references, enforce data contracts, and build accurate simulation graphs. Last updated: October 2023.
## License: Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub Actions Expressions and Contexts
## https://docs.github.com/en/actions/learn-github-actions/expressions
Detailed reference for expression syntax—operators, functions, and context objects (`github`, `env`, `secrets`, `matrix`)—used to control step execution and interpolate dynamic values. Essential for evaluating `if` conditions and runtime variables in simulation. Last updated: July 2023.
## License: Creative Commons Attribution 4.0 International (CC BY 4.0)

# YAML Parsing & Specification
## https://yaml.org/spec/1.2/spec.html
The YAML 1.2 specification standardizes syntax rules, data typing, anchors/aliases, and serialization details. Paired with the `js-yaml` library (https://github.com/nodeca/js-yaml) for JavaScript parsing, it underpins agentic-lib’s workflow loader and ensures fidelity when translating YAML into internal representations. Last updated: July 2021 (spec), `js-yaml` v4.1.0 last release: May 2023. Authoritative: YAML.org and js-yaml maintainers.
## License: Public Domain (Spec), MIT (js-yaml)

# Zod Schema Validation
## https://github.com/colinhacks/zod#readme
Zod is a TypeScript-first schema validation library used to parse and enforce environment configurations and CLI inputs. This documentation covers schema definitions, parsing modes, custom error handling, and TypeScript integration—vital for robust configuration loading in agentic-lib. Last updated: December 2023. Authoritative: colinhacks.
## License: MIT License

# AWS Lambda & SQS Integration
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
Official AWS guide to event source mapping for SQS, detailing payload structure, batch sizes, partial failure strategies (`batchItemFailures`), retry semantics, and scaling considerations. References AWS SDK for JavaScript v3 middleware stacks, client instantiation, retry policies, and TypeScript definitions. Essential for simulating and mocking SQS-driven Lambdas in agentic-lib. Last updated: September 2023.
## License: Apache License 2.0

# Vitest Testing Framework
## https://vitest.dev
Vitest is a modern, Vite-powered test runner offering first-class TypeScript support, mocking APIs, snapshot testing, and code coverage. This documentation explains test configuration, lifecycle hooks, mocking strategies (e.g., `vi.mock`), and CLI usage—directly applicable to agentic-lib’s test suite patterns. Last updated: March 2024. Authoritative: Vitest maintainers.
## License: MIT License