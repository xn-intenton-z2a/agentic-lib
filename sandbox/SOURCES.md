# GitHub Actions Workflow Syntax
## https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
This page provides the official specification for defining workflows in GitHub Actions, covering triggers, jobs, steps, matrices, reusable workflows, and advanced features like concurrency and environment variables. It is essential for implementing the core parsing and simulation engine in agentic-lib, as it enumerates every property and behavior that workflows can exhibit. Last known update: November 2023. Authoritative: maintained by GitHub.
## License: Creative Commons Attribution 4.0 International (CC BY 4.0)

# GitHub REST API
## https://docs.github.com/en/rest
The comprehensive reference for GitHub’s REST API, including endpoints for workflows (dispatch, runs), issues, pull requests, and repository management. Critical for agentic-lib’s SDK to interact with the GitHub platform programmatically, handling authentication, pagination, rate limits, and error responses. Last updated: October 2023. Authoritative: official GitHub documentation.
## License: GitHub Terms of Service

# Creating JavaScript Actions
## https://docs.github.com/en/actions/creating-actions/creating-actions/creating-a-javascript-action
Guides on authoring JavaScript-based GitHub Actions, detailing action metadata (`action.yml`), Toolkit libraries, packaging, and best practices for secure and efficient execution. Provides practical insights for implementing drop-in JavaScript replacements for GitHub Script steps, aligning directly with agentic-lib’s mission to substitute workflow steps with code. Last updated: December 2023.
## License: Creative Commons Attribution 4.0 International (CC BY 4.0)

# AWS Lambda with Amazon SQS
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
Official AWS documentation explaining how Lambda integrates with SQS, including event payload structure, batch window configuration, error handling patterns (e.g., `batchItemFailures`), and scaling considerations. Vital for implementing correct SQS event simulations and Lambda handlers in agentic-lib. Last updated: August 2023.
## License: Apache License 2.0

# AWS SDK for JavaScript v3
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html
Reference for the modular AWS SDK for JavaScript (v3), covering client instantiation (e.g., `@aws-sdk/client-lambda`), middleware stack, retries, and TypeScript support. Essential for developing agentic-lib’s AWS integrations and mocking strategies in tests. Last updated: September 2023.
## License: Apache License 2.0

# OpenAI Node.js API Reference
## https://platform.openai.com/docs/libraries/node-js-reference
Official Node.js reference documentation for the OpenAI library, including configuration (`Configuration`, `OpenAIApi`), methods for chat completions, streaming, error handling, rate limits, and authentication. Central for implementing AI-driven refinements within agentic-lib. Last updated: January 2024.
## License: MIT License

# Zod Schema Validation
## https://github.com/colinhacks/zod
Zod’s GitHub repository and documentation, outlining schema definitions, parsing strategies, type inference, and error formatting. Crucial for robust configuration validation in agentic-lib (e.g., `.env` parsing) and ensuring runtime safety. Last updated: February 2024.
## License: MIT License

# act: Run GitHub Actions Locally
## https://github.com/nektos/act#readme
Documentation for `act`, a CLI tool that emulates GitHub Actions runtime locally, detailing event simulation, matrix configurations, and output mapping. Serves as a reference for validating local workflow execution and debugging strategies when developing agentic-lib’s simulation engine. Last updated: November 2023.
## License: MIT License