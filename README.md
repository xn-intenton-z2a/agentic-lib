# intentïon agentic-lib

You probably want to start with the workflow documentation here: [WORKFLOWS-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/WORKFLOWS-README.md)

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your
repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and
issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using
GitHub’s `workflow_call` event, so they can be composed together like an SDK.

[Start using the Repository Template](https://github.com/xn-intenton-z2a/repository0)

[Also on GitHub Pages](https://xn-intenton-z2a.github.io/agentic-lib/index.html)

[See the latest repository stats](https://xn-intenton-z2a.github.io/agentic-lib/latest.html)

---
---

## Overview

agentic‑lib provides a rich set of JavaScript functions that mirror GitHub Actions workflows. It includes telemetry gathering, Kafka simulations, remote service wrappers, advanced LLM delegation, and parsing utilities enabling automated CI/CD integrations.

### Key Features

- **Usage Information:**  
  Use `generateUsage()` to display available flag options.
- **Telemetry:**  
  Comprehensive diagnostics including:
  - `gatherTelemetryData()`, `gatherExtendedTelemetryData()`, `gatherAdvancedTelemetryData()`, `gatherFullTelemetryData()`, and the new `gatherTotalTelemetry()` to aggregate all telemetry data from GitHub Actions workflows.
  - **New:** `gatherCIEnvironmentMetrics()` to capture additional GitHub Actions CI environment metrics such as workspace and event path.
- **Remote Service Wrappers:**  
  Simplified API interactions for deployment, build status, analytics, notifications, logging, repository details, code quality analysis, and **security scans** via `callSecurityScanService`.
- **LLM Delegation:**  
  Advanced functions supporting robust decision delegation with schema validation and timeout support. *New:* `callOpenAIFunctionWrapper` wraps an OpenAI function call using a function calling schema, enhanced with an empty prompt check and improved error handling.
  - **New:** Added `delegateDecisionToLLMEnhanced` for improved OpenAI delegation with enhanced logging.
- **Kafka Operations:**  
  Simulated messaging for inter-workflow communication using Kafka-like functions. New functions include:
  - `simulateKafkaProducer`: Simulate the production of messages to a topic.
  - `simulateKafkaConsumer`: Simulate the consumption of messages from a topic.
  - `simulateKafkaRequestResponse`: Simulate a request-response mechanism over Kafka.
  - `simulateKafkaGroupMessaging`: Enhance group messaging simulation across consumers.
  - `simulateKafkaTopicSubscription`: Simulate confirmation of topic subscriptions.
  - **New Extensions:**
    - `simulateKafkaPriorityMessaging`: Simulate priority-based messaging.
    - `simulateKafkaRetryOnFailure`: Simulate sending messages with retry on failure.
    - **New:** `simulateKafkaBroadcast`: Simulate broadcasting a message to multiple Kafka topics concurrently, extending inter-workflow communication capabilities.
  - **New:** `simulateDelayedResponse`: Simulate a delayed Kafka response for more realistic messaging scenarios.
- **SARIF Parsing:**  
  Functions such as `parseVitestSarifOutput` and `parseEslintDetailedOutput` for parsing SARIF outputs.
- **File System Simulation:**
  *New:* `simulateFileSystemCall()` simulates reading file content from external resources, enhancing testability for file system interactions.
- **Configuration Display:**
  *New:* The `--config` flag and accompanying `printConfiguration()` function display current node configuration, platform, and working directory.

---

## Recent Improvements

- Extended flag handling with improved diagnostics and error checking.
- Enhanced telemetry and Kafka simulation functions with detailed logging and metrics.
- Advanced LLM delegation functions with strict schema validation and timeout support.
- New wrappers for remote repository, logging, analytics, code quality services, and **security scanning**.
- **New:** Implemented `callSecurityScanService` to simulate a remote vulnerability scanning service.
- **New:** Implemented and enhanced `callOpenAIFunctionWrapper` and related OpenAI delegation functions with explicit API key validation and improved error messaging.
- **New:** Added `delegateDecisionToLLMEnhanced` for improved OpenAI delegation with enhanced logging.
- **Fixed:** Updated the regex in `getIssueNumberFromBranch` to correctly extract issue numbers from branch names.
- **New Kafka Functions:** Added `simulateKafkaProducer`, `simulateKafkaConsumer`, `simulateKafkaRequestResponse`, and extensions `simulateKafkaPriorityMessaging` and `simulateKafkaRetryOnFailure` for enhanced inter-workflow messaging.
- **Extended:** Updated the `--create-issue` flag behavior to mimic the GitHub Actions workflow from wfr-create-issue.yml, supporting dynamic "house choice" options via the environment variable `HOUSE_CHOICE_OPTIONS`.
- **New:** Added `--config` flag to print configuration details of the runtime environment.
- **New:** Added `gatherTotalTelemetry()` to aggregate telemetry data from multiple sources.
- **New:** Added `simulateDelayedResponse` to simulate delayed Kafka responses.
- **New:** Added `simulateKafkaBroadcast` to enable broadcasting messages across multiple topics.
- **New:** Added `simulateFileSystemCall()` for simulating file system interactions.
- **New:** Added `gatherCIEnvironmentMetrics()` to capture additional CI environment metrics from GitHub Actions.

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
along with this program. If not, see <https://www.gnu.org/licenses/>.

IMPORTANT: Any derived work must include the following attribution:
"This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
```

---
---
