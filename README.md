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
* This file is part of the example suite for `agentic-lib` (see: https://github.com/xn-intenton-z2a/agentic-lib).
* This file is licensed under the MIT License. For details, see LICENSE-MIT.

This README has been refreshed in accordance with the CONTRIBUTING guidelines. Irrelevant and outdated content has been pruned, while core information remains to help you understand and contribute to the project.

---

## Overview

agentic‑lib provides a wide array of JavaScript functions mirroring GitHub Actions workflows. Key features include:

- **Usage Information:** Use `generateUsage()` to display available command-line options.
- **Telemetry:** Comprehensive diagnostics via functions such as:
  - `gatherTelemetryData()`, `gatherExtendedTelemetryData()`, `gatherAdvancedTelemetryData()`, `gatherFullTelemetryData()`, and `gatherTotalTelemetry()`.
  - **CI Metrics:** `gatherCIEnvironmentMetrics()` captures additional GitHub Actions metrics.
  - **Extra Telemetry:** `gatherExtraTelemetryData()` provides metrics like timestamp, CPU usage, and free memory.
  - **GitHub Environment Telemetry:** `gatherGithubEnvTelemetry()` aggregates all environment variables starting with `GITHUB_`.
- **Remote Service Wrappers:** Simplified API interactions for multiple services, including analytics, notifications, build status, deployment, logging, code quality, security scans, monitoring, and package management.
- **LLM Delegation:** Functions to support decision delegation with advanced OpenAI capabilities. New features include:
  - `delegateDecisionToLLMChat`, `delegateDecisionToLLMChatVerbose`, and `delegateDecisionToLLMChatOptimized` for enhanced prompt validation.
  - **NEW:** `delegateDecisionToLLMFunctionCallWrapper` extends our OpenAI function delegation capabilities.
- **Kafka Operations:** Simulated messaging functions for inter-workflow communication, including direct messaging, dynamic topic routing, detailed streaming, bulk messaging, and extended functionalities:
  - Improved simulations such as `simulateKafkaDelayedMessage`, `simulateKafkaTransaction`, `simulateKafkaPriorityQueue`, `simulateKafkaMessagePersistence`, and **simulateKafkaMulticast** for multicast messaging with delay options.
- **SARIF and Default Output Parsing:** Utilities like:
  - `parseSarifOutput`, `parseEslintSarifOutput`, `parseVitestOutput`, `parseVitestDefaultOutput`, `parseEslintDefaultOutput`, `parseVitestSarifOutput`, `parseEslintDetailedOutput`.
  - New combined parsers: `parseCombinedSarifOutput` and `parseCombinedDefaultOutput`.
- **File System Simulation:** `simulateFileSystemCall()` enables safe file interactions for testing.
- **CI Workflow Simulation:** `simulateCIWorkflowLifecycle` aggregates telemetry data and simulates Kafka messaging to mimic a full workflow lifecycle.
- **Issue Creation Simulation:** The enhanced `--create-issue` flag mimics a GitHub Actions workflow by dynamically selecting an issue title from `HOUSE_CHOICE_OPTIONS` and logging detailed JSON output.

---

## Recent Improvements

- Refreshed this README based on the CONTRIBUTING guidelines.
- Extended flag handling, telemetry functions, and LLM delegation capabilities.
- **Extended Kafka Messaging Simulations:**
  - Added `simulateKafkaPriorityQueue`, `simulateKafkaMessagePersistence`, and **simulateKafkaMulticast** for improved simulation of priority messaging, persistence, and multicast functionality.
- **New OpenAI Function Wrapper:** Implemented `delegateDecisionToLLMFunctionCallWrapper` following advanced function calling patterns.
- **New Chat Delegation Function:** Added `delegateDecisionToLLMChatOptimized` for improved prompt validation and error handling.
- **Enhanced Telemetry and Simulation Utilities:** Additional functions for issue review, advanced analytics, and robust file and network simulation.

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## Component Breakdown

This repository is organized into three distinct areas:

### 1. Re‑usable Workflows (Core Functionality)
- **Purpose:** These workflows form the backbone of the agentic‑lib system, enabling automated coding processes such as testing, publishing, and issue management.
- **Stability:** They are stable and well‑tested, designed to be integrated into your CI/CD pipelines.
- **Licensing:** The core workflows are released under GPL‑3 and include an attribution requirement for any derived work.
- **Location:** Find these in the `.github/workflows/` directory.

### 2. Example Workflows (Demonstrative Content)
- **Purpose:** These files provide practical examples of how to use the core workflows. They serve as learning tools and reference implementations.
- **Stability:** While functional, they are intended primarily for demonstration and experimentation.
- **Licensing:** The example workflows are covered by the MIT license for broader use and modification.
- **Location:** Look in the `examples/` directory for sample implementations.

### 3. The Evolving main.js (JavaScript re-implementation of Re‑usable Workflows)
- **Purpose:** This file implements the Re‑usable Workflows as a JavaScript module, enabling programmatic access to the core functionality.
- **Stability:** Under active development; represents bleeding‑edge functionality not yet production‑ready.
- **Licensing:** Part of the core project under GPL‑3 with the attribution clause.
- **Location:** The code is located in `src/lib/main.js`.

---

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
