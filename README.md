# intentïon agentic-lib

You probably want to start with the workflow documentation here: [WORKFLOWS-README.md](WORKFLOWS-README.md)

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.

[Start using the Repository Template](https://github.com/xn-intenton-z2a/repository0)

Mixed licensing:
* This project is licensed under the GNU General Public License (GPL).
* This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
* This file is licensed under the MIT License. For details, see LICENSE-MIT

This README file has been refreshed to align with the latest CONTRIBUTING guidelines. Irrelevant or outdated content has been pruned and relevant sections updated.

---
---

## New Exported Utility Functions

- `generateUsage()`: Provides a usage message with updated flag options.
- `getIssueNumberFromBranch(branch, prefix)`: Extracts an issue number from a branch name with improved regex safety.
- `sanitizeCommitMessage(message)`: Cleans up commit messages by removing unsupported characters and extra spaces.
- `splitArguments(args)`: Splits command line arguments into flag and non-flag arrays.
- `processFlags(flags)`: Processes an array of flags and returns a summary message. Supports `--verbose` and `--debug` for extended logging.
- `enhancedDemo()`: Provides demo output including environment details and debug status.
- `logEnvironmentDetails()`: Logs current environment details such as NODE_ENV.
- `showVersion()`: Returns the current version of the library.
- `gatherTelemetryData()`: Gathers telemetry data from the GitHub Actions workflow environment.
- **New:** `gatherExtendedTelemetryData()`: Gathers extended telemetry data including additional GitHub environment variables (e.g., GITHUB_ACTOR, GITHUB_REPOSITORY, GITHUB_EVENT_NAME, and CI).
- **New:** `gatherFullTelemetryData()`: Gathers full telemetry data including additional GitHub environment variables such as GITHUB_REF, GITHUB_SHA, GITHUB_HEAD_REF, and GITHUB_BASE_REF.
- `delegateDecisionToLLM(prompt)`: Delegates a decision to an advanced LLM via OpenAI's chat completions API. (Falls back in test environments.)
- **New & Improved:** `delegateDecisionToLLMWrapped(prompt)`: An enhanced wrapper for delegating decisions to an LLM that mimics function calling behavior, with improved error logging and schema validation using zod.
- **New:** `sendMessageToKafka(topic, message)`: Simulates sending a message to a Kafka topic.
- **New:** `receiveMessageFromKafka(topic)`: Simulates receiving a message from a Kafka topic.
- **New:** `logKafkaOperations(topic, message)`: Combines Kafka send and receive simulations for logging purposes.
- **New:** `simulateKafkaStream(topic, count)`: Simulates streaming a series of messages from a Kafka topic.
- **New:** `simulateKafkaDetailedStream(topic, count)`: Extended Kafka stream simulation with detailed logging for diagnostics.
- **New:** `analyzeSystemPerformance()`: Provides system performance telemetry including platform, number of CPUs, and total memory.
- **New:** `callRemoteService(serviceUrl)`: A wrapper that uses native fetch to simulate API calls with enhanced error logging.
- **New:** `callAnalyticsService(serviceUrl, data)`: Simulates sending analytics data to a remote endpoint.
- **New:** `callNotificationService(serviceUrl, payload)`: Simulates sending a notification to a remote endpoint, which can be useful for sending alerts or updates from agentic workflows.
- **New:** `callBuildStatusService(serviceUrl)`: A new remote service wrapper to simulate checking the CI build status.
- **New:** `parseSarifOutput(sarifJson)`: Parses SARIF formatted JSON reports and summarizes total issues.
- **New:** `parseEslintSarifOutput(eslintSarifJson)`: Processes ESLint SARIF outputs.
- **New:** `parseVitestOutput(outputStr)`: Parses Vitest output logs to extract the number of tests passed.

---

## New Features

- Added a new `--env` flag to print environment variables for debugging.
- Extended functionality with a new `--reverse` flag to reverse non-flag arguments.
- Added a new `--telemetry` flag to output telemetry data from GitHub Actions environments.
- **New:** Added a new `--telemetry-extended` flag that outputs extended telemetry data, including additional GitHub environment variables.
- **New:** Added a new `--create-issue` flag that simulates GitHub workflow issue creation with support for a "house choice" option based on environment variables.
- **New & Improved:** Extended `delegateDecisionToLLMWrapped()` for improved error logging and schema validation, matching the supplied OpenAI function format.
- **New:** Simulated Kafka messaging functions for inter-workflow communication. This includes the new functions `simulateKafkaStream` and `simulateKafkaDetailedStream` for extended diagnostics.
- **New:** Added `analyzeSystemPerformance()` to provide system performance telemetry.
- **New:** Added `callRemoteService(serviceUrl)` as a remote service wrapper.
- **New:** Added `callAnalyticsService(serviceUrl, data)` to simulate remote analytics service calls.
- **New:** Added `callNotificationService(serviceUrl, payload)` to simulate remote notification service calls.
- **New:** Added `callBuildStatusService(serviceUrl)` as a remote service wrapper to check build status.
- **New:** Introduced a new `--simulate-remote` flag to simulate remote service calls, and a `--sarif` flag to process SARIF reports.
- **New:** Added a new `--extended` flag to trigger extended logging and detailed Kafka stream simulation for enhanced diagnostics.

---

## Recent Improvements

- Consolidated the application exit routine and enhanced code comments in `main.js`.
- Refactored regex construction in `getIssueNumberFromBranch` and randomness in issue simulation for improved safety.
- Extended flag processing functions to provide clearer outputs, with support for `--verbose` and `--debug` flags.
- **New:** Integrated telemetry gathering functions including `gatherExtendedTelemetryData()` and `gatherFullTelemetryData()` for comprehensive GitHub Actions data.
- **New:** Added notification and analytics service functionality via `callNotificationService()` and `callAnalyticsService()`, as well as a new build status service via `callBuildStatusService()`, to expand remote service integrations.
- **New:** Enhanced LLM decision delegation in `delegateDecisionToLLMWrapped()` with improved error handling and schema validation.
- **New:** Introduced extended Kafka simulation with the new `simulateKafkaDetailedStream()` function and the `--extended` flag to provide detailed logging diagnostics.
- **New:** Added remote service wrapper `callBuildStatusService()` to simulate checking the CI build status.
- **Checked:** Pruned drift by removing outdated simulation details and aligning the implementation closely with the agentic‑lib mission statement.

---

## Future Enhancements

- Extend workflow automation functions to integrate additional remote service wrappers and notifications.
- Enhance GitHub API integration for dynamic issue and PR management.
- Expand logging and monitoring capabilities for continuous integration metrics.
- Further abstract shared code to reduce duplication and improve modularity.
- Increase test coverage, including deeper tests for external resources such as network services.

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Component Breakdown

This repository is organized into three distinct areas to help you understand the purpose and maturity level of each component:

### 1. Re‑usable Workflows (Core Functionality)
- **Purpose:**  
  These workflows form the backbone of the agentic‑lib system, enabling automated coding processes such as testing, publishing, and issue management.
- **Stability:**  
  They are stable and well‑tested, designed to be integrated into your CI/CD pipelines.
- **Licensing:**  
  The core workflows are released under GPL‑3 and include an attribution requirement for any derived work.
- **Location:**  
  Find these in the `.github/workflows/` directory.

### 2. Example Workflows (Demonstrative Content)
- **Purpose:**  
  These files provide practical examples of how to use the core workflows. They serve as learning tools and reference implementations.
- **Stability:**  
  While functional, they are intended primarily for demonstration and experimentation.
- **Licensing:**  
  The example workflows are covered by the MIT license to allow for broader use and modification.
- **Location:**  
  Look in the `examples/` directory for sample implementations.

### 3. The Evolving main.js (JavaScript re-implementation of Re‑usable Workflows)
- **Purpose:**  
  This file implements the Re‑usable Workflows above as a JavaScript module, enabling programmatic access to the core functionality.
- **Stability:**  
  It is under active development and may change frequently. It represents bleeding‑edge functionality that might not yet be production‑ready.
- **Licensing:**  
  As part of the core project, it is under GPL‑3 with the attribution clause.
- **Location:**  
  The code is located in `src/lib/main.js`.

## License

This project is licensed under the GNU General Public License (GPL). See [LICENSE](LICENSE) for details.

License notice:
```
agentic-lib
Copyright (C) 2025 Polycode Limited

agentic-lib is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License v3.0 (GPL‑3).
along with this program. If not, see <https://www.gnu.org/licenses/>

IMPORTANT: Any derived work must include the following attribution:
"This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
```

---
---
