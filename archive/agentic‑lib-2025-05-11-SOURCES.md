# js-yaml
## https://github.com/nodeca/js-yaml
`js-yaml` is the primary YAML parser and serializer used to load agentic-lib configuration and workflow definitions. Its documentation details advanced parsing options, custom schema definitions, safe load methods to prevent code execution, and performance tuning for large files. Essential for accurately reading and interpreting GitHub workflow YAML files within agentic-lib.
Last known publication: v4.1.0 (May 2023). Highly authoritative: maintained by the Nodeca community and widely used across Node.js tooling.
## MIT License

# dotenv
## https://github.com/motdotla/dotenv
`.env` file loader for Node.js that loads environment variables into `process.env`. Documentation covers parsing options, variable expansion, multiline values, and security best practices. Critical for managing API keys, endpoints, and runtime flags in local development, CI environments, and within Lambda functions.
Last known publication: v16.5.0 (April 2024). Widely adopted and community-trusted.
## BSD-2-Clause

# Vitest
## https://vitest.dev/
A Vite-native testing framework focusing on speed and simplicity for ESM workflows. Documentation includes setup guides, mocking strategies, coverage reporting, advanced configuration, and integration with TypeScript. Essential for maintaining fast, reliable test suites for agentic-lib’s Lambda handlers and CLI functions.
Last known publication: v3.1.3 (May 2024). Actively maintained and rapidly growing in popularity.
## MIT License

# OpenAI Node.js SDK
## https://github.com/openai/openai-node
The official client library for interacting with OpenAI’s API. The README and usage examples demonstrate authentication, chat completion payload structures, streaming responses, rate limit handling, retry logic, and TypeScript typings. Provides core implementation details for agentic-lib’s AI-driven workflow generation and refinement.
Last known publication: v4.98.0 (June 2024). Official and authoritative source.
## MIT License

# AWS SDK for JavaScript v3 & Lambda SQS Integration
## https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/welcome.html
Comprehensive guide to the AWS SDK v3 modular architecture, client configuration, middleware stack, and best practices for high-throughput, low-latency operations. Includes in-depth examples for AWS Lambda integration with SQS (via https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html), event batch processing, error handling (batchItemFailures), and security configurations.
Official documentation, continuously updated. Highly authoritative for AWS-based event-driven architectures.
## Apache-2.0

# GitHub API (REST & GraphQL)
## https://docs.github.com/en/graphql
Unified reference covering both REST and GraphQL endpoints. Highlights critical workflows: fetching workflow definitions, triggers, reusable calls, branch and PR automation, and webhooks. GraphQL API section offers flexible querying for complex repository and workflow introspection, complementing REST for rate limits and pagination handling.
Last updated: June 2024. Official GitHub documentation.
## MIT License

# GitHub Actions Workflow Syntax
## https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
Definitive guide to GitHub Actions YAML syntax, including triggers (`workflow_call`, events), job definitions, matrix strategies, reusable workflows, and environment variables. Essential for parsing, modeling, and simulating workflows within agentic-lib.
Last updated: April 2024. Official GitHub documentation.
## MIT License

# GitHub Actions Toolkit
## https://github.com/actions/toolkit
Node.js libraries (`@actions/core`, `@actions/github`, etc.) for building custom GitHub Actions. Documentation details input/output handling, command messaging, logging, authentication, and GitHub API integration. Provides actionable insights for implementing command-line behavior and in-action APIs mimicking real workflows.
Last known publication: v2.10.0 (May 2024). Maintained by GitHub Actions team.
## Apache-2.0