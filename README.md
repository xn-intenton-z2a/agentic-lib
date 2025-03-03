# intentïon agentic-lib

You probably want to start with the workflow documentation here: [WORKFLOWS-README.md](WORKFLOWS-README.md)

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your
repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and
issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using
GitHub’s `workflow_call` event, so they can be composed together like an SDK.

[Start using the Repository Template](https://github.com/xn-intenton-z2a/repository0)

Mixed licensing:
* This project is licensed under the GNU General Public License (GPL).
* This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
* This file is licensed under the MIT License. For details, see LICENSE-MIT

This README file has been refreshed to align with the latest CONTRIBUTING guidelines. Irrelevant or outdated content has been pruned and relevant sections updated.

---

## New Exported Utility Functions

- `generateUsage()`: Provides a usage message with updated flag options.
- `getIssueNumberFromBranch(branch, prefix)`: Extracts an issue number from a branch name with improved regex.
- `sanitizeCommitMessage(message)`: Cleans up commit messages by removing unsupported characters and extra spaces.
- `splitArguments(args)`: Splits command line arguments into flag and non-flag arrays.
- `processFlags(flags)`: Processes an array of flags and returns a summary message. Supports `--verbose` and `--debug` for extended logging.
- `enhancedDemo()`: Provides demo output including environmental details and debug status.
- `logEnvironmentDetails()`: Logs current environment details such as NODE_ENV.
- `showVersion()`: Returns the current version of the library.
- `gatherTelemetryData()`: Gathers telemetry data from the GitHub Actions workflow environment.
- **New:** `gatherExtendedTelemetryData()`: Gathers extended telemetry data including additional GitHub environment variables (e.g., GITHUB_ACTOR, GITHUB_REPOSITORY, GITHUB_EVENT_NAME, and CI).
- `delegateDecisionToLLM(prompt)`: Delegates a decision to an advanced LLM via OpenAI's chat completions API. (Falls back in test environments.)
- **New & Improved:** `delegateDecisionToLLMWrapped(prompt)`: An enhanced wrapper for delegating decisions to an LLM that mimics function calling behavior. Now includes schema validation using zod for improved response reliability and a test hook for simulated success when `TEST_OPENAI_SUCCESS` is set.
- **New:** `sendMessageToKafka(topic, message)`: Simulates sending a message to a Kafka topic.
- **New:** `receiveMessageFromKafka(topic)`: Simulates receiving a message from a Kafka topic.
- **New:** `logKafkaOperations(topic, message)`: Combines Kafka send and receive simulations for logging purposes.
- **New:** `analyzeSystemPerformance()`: Provides system performance telemetry including platform, number of CPUs, and total memory.
- **New:** `callRemoteService(serviceUrl)`: A wrapper that uses native fetch to simulate API calls with enhanced error logging.
- **New:** `--simulate-remote` flag: Simulates a remote service call for autonomous interaction.

---

## New Features

- Added a new `--env` flag to print environment variables for debugging.
- Extended functionality: Added a new `--reverse` flag to reverse non-flag arguments.
- Added a new `--telemetry` flag to output telemetry data from GitHub Actions environments.
- **New:** Added a new `--telemetry-extended` flag that outputs extended telemetry data, including additional GitHub environment variables.
- Added a new `--version` flag to display the current version of the library.
- **New:** Added a new `--create-issue` flag that simulates GitHub workflow issue creation with support for a "house choice" option based on environment variables.
- **New & Improved:** Extended `delegateDecisionToLLMWrapped()` for improved error handling and response validation.
- **New:** Added simulated Kafka messaging functions for inter-workflow communication.
- **New:** Added `analyzeSystemPerformance()` to provide system performance telemetry.
- **New:** Added `callRemoteService(serviceUrl)` as a remote service wrapper.
- **New:** Added `--simulate-remote` flag to simulate remote service calls.

---

## Recent Improvements

- Consolidated the application exit routine and enhanced code comments in `main.js`.
- Extended flag processing functions to provide clearer outputs, with support for `--verbose` and `--debug` flags.
- Refreshed the README to align with CONTRIBUTING guidelines by removing outdated information and highlighting new features.
- **Change Log Update:**
  - Pruned code drift from the source file.
  - Improved logging for remote service calls and delegateDecision functions.
  - Enhanced test hooks and added test coverage for external resource simulation.

---

## Future Enhancements

- Further extend workflow automation functions and incorporate additional remote service wrappers.
- Enhance integration with GitHub’s API for dynamic issue and PR management.
- Expand logging and monitoring for continuous integration.
- Increase abstraction to reduce code duplication.
- Expand test coverage by adding deeper tests for external resource interactions.

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Component Breakdown

This repository is organized into three distinct areas to help you understand the purpose and maturity level of each component:

### 1. Re‑usable Workflows (Core Functionality)
- **Purpose:** These workflows form the backbone of the agentic‑lib system, enabling automated processes such as testing, publishing, and issue management.
- **Stability:** Stable and well‑tested for CI/CD integration.
- **Licensing:** Released under GPL‑3 with attribution for derived work.
- **Location:** Located in the `.github/workflows/` directory.

### 2. Example Workflows (Demonstrative Content)
- **Purpose:** Provide practical examples of how to implement the core workflows.
- **Stability:** Primarily for demonstration and experimentation.
- **Licensing:** Covered by the MIT license.
- **Location:** Found in the `examples/` directory.

### 3. The Evolving main.js (JavaScript re‑implementation of Re‑usable Workflows)
- **Purpose:** Implements the core functionality as a JavaScript module for programmatic access.
- **Stability:** Under active development; represents bleeding‑edge features.
- **Licensing:** Part of the core project under GPL‑3 with attribution.
- **Location:** `src/lib/main.js`

## License

This project is licensed under the GNU General Public License (GPL). See [LICENSE](LICENSE) for details.

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
along with this program. If not, see <https://www.gnu.org/licenses/>.

IMPORTANT: Any derived work must include the following attribution:
"This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
```

---
