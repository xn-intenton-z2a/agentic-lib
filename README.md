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

agentic‑lib provides a comprehensive set of JavaScript functions that mirror GitHub Actions workflows. It includes robust telemetry gathering, simulated Kafka messaging, remote service wrappers, advanced LLM delegation, SARIF parsing utilities, and file system interactions. These tools support continuous integration and automated code evolution.

### Key Features

- **Usage Information:**
  Use `generateUsage()` to display available command-line options.
- **Telemetry:**
  Comprehensive diagnostics via multiple telemetry functions such as:
  - `gatherTelemetryData()`, `gatherExtendedTelemetryData()`, `gatherAdvancedTelemetryData()`, `gatherFullTelemetryData()`, and the new `gatherTotalTelemetry()`.
  - **CI Metrics:** `gatherCIEnvironmentMetrics()` captures additional GitHub Actions metrics.
- **Remote Service Wrappers:**
  Simplified API interactions for various remote services, including deployment, build status, analytics, notifications, code quality, security scans, and a new monitoring service via `callMonitoringService()`.
- **LLM Delegation:**
  Advanced functions supporting decision delegation with schema validation, timeout support, and enhanced error handling. Functions include `delegateDecisionToLLMAdvanced`, `delegateDecisionToLLMWrapped`, `delegateDecisionToLLMAdvancedVerbose`, `delegateDecisionToLLMAdvancedStrict`, and the new **`delegateDecisionToLLMAdvancedOptimized`** which offers configurable temperature for optimized performance.
- **Kafka Operations:**
  Simulated messaging functions for inter-workflow communication, including:
  - `simulateKafkaStream`, `simulateKafkaDetailedStream`, and `simulateKafkaBulkStream`.
  - **Additional Kafka Functions:** `simulateKafkaProducer`, `simulateKafkaConsumer`, `simulateKafkaPriorityMessaging`, `simulateKafkaRetryOnFailure`, and `simulateKafkaBroadcast`.
- **SARIF Parsing and Default Output Parsing:**
  Utilities to parse SARIF outputs and default outputs, including:
  - `parseSarifOutput`, `parseEslintSarifOutput`, `parseVitestOutput`, `parseVitestDefaultOutput`, and `parseEslintDefaultOutput`.
- **File System Simulation:**
  The `simulateFileSystemCall()` function enables testing of file interactions.
- **Configuration Display:**
  The `--config` flag and `printConfiguration()` function display detailed runtime configuration.
- **Issue Creation Simulation:**
  Enhanced `--create-issue` flag mimics GitHub Actions issue creation with dynamic title selection and JSON logging.

---

## Recent Improvements

- Refreshed README to align with CONTRIBUTING guidelines and remove outdated content.
- Extended flag handling with improved diagnostics and error checking.
- Enhanced telemetry and Kafka simulation functions with detailed logging.
- **Updated advanced LLM delegation functions:** Now includes strict schema validation, timeout support, and a new optimized wrapper (`delegateDecisionToLLMAdvancedOptimized`) for enhanced performance using configurable temperature.
- Added new remote monitoring service wrapper and file system interaction simulation.
- **New Features Added:**
  - `reviewIssue` for evaluating issue resolution based on source file content.
  - `printReport` and `printConfiguration` for diagnostics output.
  - Additional Kafka messaging functions: `simulateKafkaProducer`, `simulateKafkaConsumer`, `simulateKafkaPriorityMessaging`, `simulateKafkaRetryOnFailure`, and `simulateKafkaBroadcast`.
  - `simulateFileSystemCall` for file system simulation.
  - `delegateDecisionToLLMEnhanced` for enhanced LLM delegation.

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Component Breakdown

This repository is organized into three distinct areas to help you understand the purpose and maturity level of each component:

### 1. Re‑usable Workflows (Core Functionality)
- **Purpose:**  
  These workflows form the backbone of the agentic‑lib system, enabling automated coding processes such as testing, publishing, and issue management.
- **Stability:**  
  They are stable and well‑tested, designed for integration in CI/CD pipelines.
- **Licensing:**  
  Core workflows are released under GPL‑3 with attribution required for derived work.
- **Location:**  
  Located in the `.github/workflows/` directory.

### 2. Example Workflows (Demonstrative Content)
- **Purpose:**  
  Practical examples of how to use core workflows; serve as learning tools and reference implementations.
- **Stability:**  
  Functional but intended primarily for demonstration and experimentation.
- **Licensing:**  
  Covered by the MIT license for broader use and modification.
- **Location:**  
  Found in the `examples/` directory.

### 3. The Evolving main.js (JavaScript Re‑implementation of Workflows)
- **Purpose:**  
  Implements re‑usable workflows as a JavaScript module, enabling programmatic access to core functionality.
- **Stability:**  
  Under active development; may change frequently and represent bleeding‑edge functionality.
- **Licensing:**  
  Under GPL‑3 with the attribution clause.
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

