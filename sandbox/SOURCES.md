# GitHub Actions Workflow Syntax
## https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
This page provides the official specification for defining workflows in GitHub Actions, covering triggers (`on`), jobs, steps, matrices, reusable workflows, advanced features like concurrency, environment variables, and conditional execution. It enumerates every property and behavior a workflow can exhibit, making it essential for implementing agentic-lib’s dry-run parsing and simulation engine. Last updated: November 2023. Authoritative: maintained and versioned by GitHub.
## License: Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub REST API
## https://docs.github.com/en/rest
The comprehensive reference for GitHub’s REST API, including endpoints for workflows (`dispatch`, `runs`), issues, pull requests, branches, and repository management. Detailed coverage of authentication schemes, pagination, rate limits, error responses, and pagination patterns is critical for agentic-lib’s SDK integration and CI/CD orchestration. Last updated: October 2023. Authoritative: official GitHub documentation.
## License: GitHub Terms of Service

# GitHub GraphQL API
## https://docs.github.com/en/graphql
Official documentation for GitHub’s GraphQL API, providing schema definitions, query and mutation examples, pagination with `nodes` and `edges`, and rate limit handling. Offers more efficient, flexible data retrieval compared to REST, which can be leveraged in agentic-lib for advanced workflow analysis and metadata queries. Last updated: January 2024. Authoritative: maintained by GitHub.
## License: GitHub Terms of Service

# Creating JavaScript Actions
## https://docs.github.com/en/actions/creating-actions/creating-actions/creating-a-javascript-action
Guides on authoring JavaScript-based GitHub Actions, detailing action metadata (`action.yml`), Toolkit libraries (`@actions/core`, `@actions/github`), packaging strategies, secure environment variable management, and best practices for efficient execution. Directly informs how agentic-lib can generate drop-in JS replacements for `actions/github-script` steps and reusable workflows. Last updated: December 2023.
## License: Creative Commons Attribution 4.0 International (CC BY 4.0)

# AWS Lambda with Amazon SQS
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
Official AWS documentation explaining the integration of Lambda and SQS, including event payload structure, batch window configuration, partial batch failure handling (`batchItemFailures`), retry logic, and scaling considerations. Vital for implementing accurate SQS event simulations, error recovery strategies, and handler design in agentic-lib. Last updated: August 2023.
## License: Apache License 2.0

# AWS SDK for JavaScript v3
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html
Reference for the modular AWS SDK for JavaScript (v3), covering client instantiation (e.g., `@aws-sdk/client-lambda`, `@aws-sdk/client-sqs`), middleware stacks, retry strategies, TypeScript type definitions, and performance optimizations. Essential for building and mocking AWS integrations within agentic-lib and ensuring consistent behavior in tests. Last updated: September 2023.
## License: Apache License 2.0

# OpenAI Node.js API Reference
## https://platform.openai.com/docs/libraries/node-js-reference
Official Node.js API reference for the OpenAI library, including configuration (`Configuration`, `OpenAIApi`), methods for chat completions, streaming, error handling, rate limiting, and authentication. Central for implementing AI-driven workflow refinements, error summarization, and natural language insights within agentic-lib. Last updated: January 2024.
## License: MIT License

# act: Run GitHub Actions Locally
## https://github.com/nektos/act#readme
Documentation for `act`, a CLI tool that emulates the GitHub Actions runtime locally, detailing event simulation, matrix strategy testing, environment variable mapping, and output formatting. Serves as a reference for validating and debugging agentic-lib’s local workflow simulations before CI execution. Last updated: November 2023.
## License: MIT License