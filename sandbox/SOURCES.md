# GitHub REST API
## https://docs.github.com/en/rest
A comprehensive reference for GitHub’s REST API v3, detailing endpoints, request/response schemas, authentication methods, pagination, and rate-limit handling. Essential for implementing repository automation, workflow triggers, and branch/issue management in agentic-lib. Includes code examples in JavaScript and curl to illustrate practical usage for actions such as creating issues, listing workflows, and dispatching events. Last updated: June 2024. Known to be authoritative as the official GitHub documentation maintained by GitHub.
## License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)

# AWS SQS Developer Guide
## https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/Welcome.html
Official AWS Simple Queue Service (SQS) Developer Guide covering queue types, message visibility, batching, long polling, retry strategies, and dead-letter queues. Provides actionable configurations and code snippets (JavaScript/TypeScript) to integrate SQS with Lambda and external systems. Critical for implementing reliable digest event handling and error-retry semantics in agentic-lib. Last updated: April 2024. Published by AWS documentation team.
## License: Public Domain (AWS Documentation)

# AWS Lambda Developer Guide
## https://docs.aws.amazon.com/lambda/latest/dg/welcome.html
End-to-end guide on AWS Lambda architecture, handler patterns, event sources, deployment options, and environment configuration. Includes best practices for error handling, cold start mitigation, CI/CD pipelines, and logs/metrics instrumentation. Invaluable for designing and refining digestLambdaHandler and CLI-triggered execution flows. Last updated: March 2024. Maintained by AWS.
## License: Public Domain (AWS Documentation)

# AWS SDK for JavaScript v3 Reference
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/
Reference documentation for AWS SDK for JavaScript v3 modules, including @aws-sdk/client-sqs and @aws-sdk/client-lambda. Details client configuration, middleware stacks, request signing (SigV4), pagination helpers, and TypeScript type definitions. Provides code examples to create events, handle responses, and integrate with third-party logging frameworks. Last updated: February 2024. Official AWS SDK docs.
## License: Apache 2.0

# OpenAI Node.js SDK Reference
## https://github.com/openai/openai-node
OpenAI’s official Node.js SDK repository and documentation for version 4.x. Covers configuration (API key management), chat/completion endpoints, streaming responses, rate-limit handling, and error patterns. Includes JavaScript/TypeScript examples for createChatCompletion and JSON-based prompt/response parsing. Last updated: May 2024. Published under MIT License.
## License: MIT

# Zod – TypeScript-first Schema Validation
## https://github.com/colinhacks/zod
Zod is a schema validation library offering concise, type-safe validation and parsing in TypeScript/JavaScript. Documentation covers defining schemas, refinement, async validations, error flattening, and integration with environment variables. Crucial for enforcing configSchema and validating dynamic inputs in agentic-lib. Last updated: January 2024. MIT-licensed.
## License: MIT

# dotenv – Zero-dependency Environment Variable Loader
## https://github.com/motdotla/dotenv
The de facto standard for loading environment variables from .env files. Documentation explains configuration options, support for multiple environments, variable interpolation, and best security practices. Key for managing OPENAI_API_KEY, GITHUB_API_BASE_URL, and development/test overrides in agentic-lib. Last updated: October 2023. Licensed under BSD-2-Clause.
## License: BSD 2-Clause "Simplified" License

# GitHub Actions – Workflow Syntax for GitHub Actions
## https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
Official guide on GitHub Actions workflow syntax, events (workflow_call), inputs/outputs, and reusable workflows. Highlights patterns for composing workflows as an SDK, defining permissions, and managing secrets. Directly informs the mission and usage model of agentic-lib’s reusable workflows and schedule-based triggers. Last updated: June 2024. Maintained by GitHub.
## License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)