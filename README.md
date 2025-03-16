# intentïon agentic-lib

You probably want to start with the workflow documentation here: [WORKFLOWS-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/WORKFLOWS-README.md)

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your
repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and
issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using
GitHub’s `workflow_call` event, so they can be composed together like an SDK.

[Start using the Repository Template](https://github.com/xn-intenton-z2a/repository0)

[Also on GitHub Pages](https://xn-intenton-z2a.github.io/agentic-lib/index.html)

[See the latest repository stats](https://xn-intenton-z2a.github.io/agentic-lib/latest.html)

Mixed licensing:
* This project is licensed under the GNU General Public License (GPL).
* This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
* This file is licensed under the MIT License. For details, see LICENSE-MIT

This README file will evolve as the test experiment within this repository evolves.

---
---

## Overview

agentic‑lib provides a comprehensive set of JavaScript functions that mirror GitHub Actions workflows. It includes robust telemetry gathering, simulated Kafka messaging, remote service wrappers, advanced LLM delegation (including new chat-based decision delegation functions), SARIF parsing utilities, and file system interactions. These tools support continuous integration and automated code evolution.

### Key Features

- **Usage Information:**
  Use `generateUsage()` to display available command-line options.
- **Telemetry:**
  Comprehensive diagnostics via multiple telemetry functions such as:
  - `gatherTelemetryData()`, `gatherExtendedTelemetryData()`, `gatherAdvancedTelemetryData()`, `gatherFullTelemetryData()`, and the new `gatherTotalTelemetry()`.
  - **CI Metrics:** `gatherCIEnvironmentMetrics()` captures additional GitHub Actions metrics.
  - **Extra Telemetry:** New function `gatherExtraTelemetryData()` provides additional metrics including current timestamp, CPU usage, and free memory.
  - **GitHub Environment Telemetry:** New function `gatherGithubEnvTelemetry()` aggregates all environment variables starting with `GITHUB_` to provide deeper context.
- **Remote Service Wrappers:**
  Simplified API interactions for various remote services, including deployment, build status, analytics, notifications, code quality, security scans, monitoring, and package management through `callPackageManagementService()`.
- **LLM Delegation:**
  Advanced functions supporting decision delegation with schema validation, timeout support, and enhanced error handling.
  - Existing functions include `delegateDecisionToLLM`, `delegateDecisionToLLMWrapped`, and several advanced variants.
  - **New Chat-Based Delegation:** Added `delegateDecisionToLLMChat`, `delegateDecisionToLLMChatVerbose`, `delegateDecisionToLLMChatEnhanced`, and **`delegateDecisionToLLMChatOptimized`** for optimized, chat-based interaction using the OpenAI API.
  - **Enhanced OpenAI Function Wrapper:** Improved through `callOpenAIFunctionWrapper` for better error handling and diagnostic logging.
  - **Enhancement:** Chat delegation functions now trim whitespace-only prompts, ensuring uniform error responses when prompts are invalid.
- **Kafka Operations:**
  Simulated messaging functions for inter-workflow communication, including:
  - `simulateKafkaStream`, `simulateKafkaDetailedStream`, and `simulateKafkaBulkStream`.
  - **Additional Kafka Functions:** `simulateKafkaProducer`, `simulateKafkaConsumer`, `simulateKafkaPriorityMessaging`, `simulateKafkaRetryOnFailure`, `simulateKafkaBroadcast`, `simulateKafkaTopicRouting`, `simulateKafkaConsumerGroup`, and `simulateKafkaWorkflowMessaging` which simulates full Kafka workflow messaging by routing messages based on a key and processing them via a consumer group.
  - **Direct Messaging:** New function `simulateKafkaDirectMessage` provides direct Kafka messaging simulation for targeted workflow communication.
- **SARIF Parsing and Default Output Parsing Enhancements:**
  Utilities to parse SARIF outputs and default outputs, including:
  - `parseSarifOutput`, `parseEslintSarifOutput`, `parseVitestOutput`, `parseVitestDefaultOutput`, `parseEslintDefaultOutput`, `parseVitestSarifOutput`, and `parseEslintDetailedOutput`.
  - **New Combined Parser:** `parseCombinedSarifOutput` aggregates issues from both Vitest and ESLint based SARIF reports.
  - **New Combined Default Parser:** Added `parseCombinedDefaultOutput` to aggregate Vitest and ESLint default output summaries.
- **File System Simulation:**
  The `simulateFileSystemCall()` function enables testing of file interactions with safe file path resolution.
- **Configuration Display:**
  The `--config` flag and `printConfiguration()` function display detailed runtime configuration.
- **Issue Creation Simulation:**
  The `--create-issue` flag now closely mimics the GitHub Actions issue creation workflow (wfr-create-issue.yml), including dynamic title selection based on the environment variable `HOUSE_CHOICE_OPTIONS` and enhanced JSON logging.

---
---

## Recent Improvements

- Refreshed README to align with CONTRIBUTING guidelines and remove outdated content.
- Extended flag handling with improved diagnostics and extracted flag-specific logic to reduce cognitive complexity.
- **Telemetry Enhancements:**
  - Added new function `gatherGithubEnvTelemetry` to capture all GitHub environment variables for more comprehensive telemetry.
  - Added new function `gatherTotalTelemetry` to aggregate all telemetry sources into one unified report.
- **LLM Delegation Enhancements:**
  - Updated advanced LLM delegation functions to include strict schema validation, timeout support, and optimized performance via configurable temperature using `delegateDecisionToLLMAdvancedOptimized`.
  - Enhanced `callOpenAIFunctionWrapper` with robust error handling and verbose logging to improve diagnostic clarity during OpenAI API interactions.
  - **New Chat-Based Delegation Functions:** Added `delegateDecisionToLLMChat`, `delegateDecisionToLLMChatVerbose`, `delegateDecisionToLLMChatEnhanced`, and `delegateDecisionToLLMChatOptimized` with additional input validation (trimming whitespace) for better reliability.
- **Kafka Messaging Enhancements:**
  - Extended Kafka simulation functions to include dynamic message routing with `simulateKafkaTopicRouting` for targeted inter-workflow communication.
  - Added consumer group functionality via the new `simulateKafkaConsumerGroup`.
  - **New Kafka Workflow Messaging:** Implemented `simulateKafkaWorkflowMessaging` to simulate full Kafka workflow messaging.
  - **Direct Messaging:** Added new function `simulateKafkaDirectMessage`.
- **SARIF and Default Output Parsing Enhancements:**
  - Added combined SARIF parsing function `parseCombinedSarifOutput` to aggregate issues across tools.
  - **New Combined Default Parser:** Added `parseCombinedDefaultOutput` to aggregate Vitest and ESLint default output summaries.
- **Issue Creation Workflow Enhancement:**
  - Enhanced the `--create-issue` flag simulation to mimic GitHub Actions workflow with dynamic title selection and structured JSON output.

---
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
  This file implements the Re‑usable Workflows as a JavaScript module, enabling programmatic access to the core functionality.
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
along with this program. If not, see <https://www.gnu.org/licenses/>.

IMPORTANT: Any derived work must include the following attribution:
"This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
```

---
---
