# intentïon agentic-lib

You probably want to start with the workflow documentation here: [WORKFLOWS-README.md](WORKFLOWS-README.md)

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.

[Start using the Repository Template](https://github.com/xn-intenton-z2a/repository0)

Mixed licensing:
* This project is licensed under the GNU General Public License (GPL).
* This file is part of the example suite for `agentic-lib` (see: https://github.com/xn-intenton-z2a/agentic-lib).
* This file is licensed under the MIT License. For details, see LICENSE-MIT.

This README has been refreshed in accordance with the CONTRIBUTING guidelines. Irrelevant and outdated content has been pruned, with relevant sections updated to reflect the current state of the library.

---

## New Exported Utility Functions

- `generateUsage()`: Provides a usage message with updated flag options.
- `getIssueNumberFromBranch(branch, prefix)`: Extracts an issue number from a branch name with improved regex safety (now limits digits to a maximum of 10 characters). [Fixed regex escaping]
- `sanitizeCommitMessage(message)`: Cleans up commit messages by removing unsupported characters and extra spaces.
- `splitArguments(args)`: Splits command line arguments into flag and non-flag arrays.
- `processFlags(flags)`: Processes an array of flags and returns a summary message. Supports `--verbose` and `--debug` for extended logging.
- `enhancedDemo()`: Provides demo output including environment details and debug status.
- `logEnvironmentDetails()`: Logs current environment details such as NODE_ENV.
- `showVersion()`: Returns the current version of the library.
- `gatherTelemetryData()`: Gathers telemetry data from the GitHub Actions workflow environment.
- **New:** `gatherExtendedTelemetryData()`: Gathers extended telemetry data including additional GitHub environment variables (e.g. GITHUB_ACTOR, GITHUB_REPOSITORY, GITHUB_EVENT_NAME, and CI).
- **New:** `gatherFullTelemetryData()`: Gathers full telemetry data including additional GitHub environment variables such as GITHUB_REF, GITHUB_SHA, GITHUB_HEAD_REF, and GITHUB_BASE_REF.
- `delegateDecisionToLLM(prompt)`: Delegates a decision to an LLM via OpenAI's API (with fallback in test environments).
- **New & Improved:** `delegateDecisionToLLMWrapped(prompt)`: An enhanced wrapper for delegating decisions to an LLM with improved error logging and schema validation.
- **New:** `sendMessageToKafka(topic, message)`: Simulates sending a message to a Kafka topic.
- **New:** `receiveMessageFromKafka(topic)`: Simulates receiving a message from a Kafka topic.
- **New:** `logKafkaOperations(topic, message)`: Combines Kafka send and receive simulations for debugging.
- **New:** `simulateKafkaStream(topic, count)`: Simulates streaming a series of messages from a Kafka topic.
- **New:** `simulateKafkaDetailedStream(topic, count)`: Extended Kafka stream simulation with detailed logging.
- **New:** `analyzeSystemPerformance()`: Provides system performance telemetry including platform, CPU count, and total memory.
- **New:** `callRemoteService(serviceUrl)`: Simulates remote service API calls using fetch with HTTP response checking to validate success.
- **New:** `callAnalyticsService(serviceUrl, data)`: Simulates sending analytics data to a remote endpoint with HTTP response validation.
- **New:** `callNotificationService(serviceUrl, payload)`: Simulates sending a notification, useful for alerts in agentic workflows, with HTTP response checks.
- **New:** `callBuildStatusService(serviceUrl)`: Simulates checking the CI build status with HTTP response validation.
- **New Flags:** Introduced `--simulate-remote`, `--sarif`, and **`--report`** for remote calls, processing SARIF reports, and combined diagnostics respectively.

---

## New Features & Recent Improvements

- Added new flags such as `--env`, `--reverse`, `--telemetry`, `--telemetry-extended`, `--create-issue`, and `--extended` to enhance functionality.
- Integrated extended telemetry gathering functions and improved remote service wrappers with HTTP error checking.
- Extended Kafka simulation with detailed logging for system diagnostics.
- Refactored the main command processing to reduce cognitive complexity and improve maintainability.
- **Fixed:** Updated regex in `getIssueNumberFromBranch` for proper extraction of issue numbers.

---

## Future Enhancements

- Integration with additional remote services for more robust workflow automation.
- Enhanced GitHub API integration for dynamic issue and PR management.
- Expanded logging and monitoring capabilities to support more comprehensive CI/CD metrics.

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

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
  This file implements the Re‑usable Workflows as a JavaScript module, enabling programmatic access to the core functionality.
- **Stability:**  
  It is under active development and may change frequently. It represents bleeding‑edge functionality that might not yet be production‑ready.
- **Licensing:**  
  As part of the core project, it is under GPL‑3 with the attribution clause.
- **Location:**  
  The code is located in `src/lib/main.js`.

---

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
along with this program. If not, see <https://www.gnu.org/licenses/>.

IMPORTANT: Any derived work must include the following attribution:
"This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
```

---