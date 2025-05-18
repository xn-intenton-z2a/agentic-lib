# GitHub REST API
## https://docs.github.com/en/rest
The GitHub REST API v3 documentation provides comprehensive, versioned endpoint specs including authentication flows, pagination standards, rate limiting details, and error codes. It covers core resources such as issues, branches, workflows (including `workflow_call` events), and repository actions, which directly inform implementation of agentic-lib’s GitHub integration. Last updated continuously; authoritative as the official GitHub source.
## License: CC BY 4.0

# GitHub Actions Workflow Syntax
## https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
This reference details the entire workflow syntax for GitHub Actions, including triggers, inputs/outputs, `workflow_call` composition, environment variables, and permissions. It is essential for defining and orchestrating automations in agentic-lib. Published March 2024; official GitHub documentation.
## License: CC BY 4.0

# AWS Lambda SQS Event Source Mapping
## https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
Official AWS guide on configuring SQS as an event source for Lambda, describing the JSON schema of `Records`, batching behavior, retry semantics, and dead-letter queue integration. Critical for designing the `digestLambdaHandler` function and handling `batchItemFailures`. Updated February 2024.
## License: Apache 2.0

# AWS SDK for JavaScript v3 – SQS Client
## https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/
Detailed API reference for the AWS SDK v3 SQS client, covering commands like `SendMessageCommand` and `ReceiveMessageCommand`, middleware stacks, configuration options, and TypeScript typings. Provides practical code examples for instantiating clients in an ESM environment, matching agentic-lib’s dependency graph. Updated January 2024.
## License: Apache 2.0

# OpenAI Node.js SDK
## https://platform.openai.com/docs/api-reference/chat/create
This section of the OpenAI docs focuses on the Node.js usage for Chat Completion endpoints, including request schema, streaming vs. non-streaming, error handling, rate limits, and API key management. It underpins the default OpenAI mock and production integration in agentic-lib. Last published April 2024; officially maintained by OpenAI.
## License: MIT

# Zod Type Validation for JavaScript and TypeScript
## https://github.com/colinhacks/zod
Zod’s README and API spec illustrate defining schemas, parsing behavior, custom error messages, and TypeScript inference. Core to environment validation (`configSchema`) and payload parsing within agentic-lib. Version 3.x released December 2023; MIT licensed.
## License: MIT

# Octokit REST.js – GitHub API for JavaScript
## https://github.com/octokit/rest.js#readme
Octokit/rest.js documentation describes instantiating the client, authentication options (OAuth, tokens), endpoint methods, plugin architecture, and pagination helpers. Acts as a higher-level alternative to raw REST calls used in agentic-lib workflows. Last updated March 2024; community official client for GitHub.
## License: MIT

# dotenv – Load Environment Variables from .env
## https://github.com/motdotla/dotenv
Explains loading `.env` files, variable expansion, safe defaults, and TypeScript support. Essential for the early environment configuration and test mock scaffolding in `main.js`. Version 16.x published October 2023; BSD-2-Clause.
## License: BSD-2-Clause