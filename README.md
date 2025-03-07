# intentïon agentic-lib

You probably want to start with the workflow documentation here: [WORKFLOWS-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/WORKFLOWS-README.md)

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.

[Start using the Repository Template](https://github.com/xn-intenton-z2a/repository0)

[Also on GitHub Pages](https://xn-intenton-z2a.github.io/agentic-lib/index.html)

[See the latest repository stats](https://xn-intenton-z2a.github.io/agentic-lib/latest.html)

---

## Overview

The agentic‑lib provides a rich set of JavaScript functions that mirror GitHub Actions workflows. It includes telemetry gathering, Kafka simulations, remote service wrappers, advanced LLM delegation, and parsing utilities. These functions empower you to build fully automated CI/CD integrations.

### Key Features

- **Usage Information:**
  - Use `generateUsage()` to display available flag options.
- **Telemetry:**
  - Comprehensive diagnostics with functions like `gatherTelemetryData()`, `gatherExtendedTelemetryData()`, `gatherAdvancedTelemetryData()`, `gatherFullTelemetryData()`, and `gatherGitHubTelemetrySummary()`.
  - **Extended Telemetry:**
    - New function `gatherCustomTelemetryData()` collects additional system metrics for in‑depth GitHub Actions monitoring.
  - **Workflow Telemetry:**
    - New function `gatherWorkflowTelemetryData()` collects workflow-specific details such as run attempts and start times.
- **Remote Service Wrappers:**
  - Simplify API interactions with wrappers for deployment, build status, analytics, and notifications.
- **LLM Delegation:**
  - Advanced functions like `delegateDecisionToLLM()`, `delegateDecisionToLLMWrapped()`, `delegateDecisionToLLMAdvancedVerbose()`, and `delegateDecisionToLLMAdvancedStrict()` support robust decision delegation with function calling and timeout features.
- **Kafka Operations:**
  - Simulate Kafka messaging with functions like `simulateKafkaDetailedStream()`, `simulateKafkaBulkStream()`, `simulateKafkaInterWorkflowCommunication()`, and `simulateRealKafkaStream()`.
- **Issue Simulation:**
  - The `--create-issue` flag mimics GitHub issue creation workflows with dynamic title selection (including a "house choice" option).
- **Advanced Analytics Simulation:**
  - The `--advanced` flag integrates detailed Kafka simulation with advanced telemetry for deep system insights.

### Recent Improvements

- Extended flag handling with improved diagnostics and error checking.
- Enhanced telemetry and Kafka simulation functions with detailed logging and performance metrics.
- Advanced LLM delegation functions with strict schema validation, verbose logging, and timeout support.
- **New:** Refreshed README content and documentation for clarity, following CONTRIBUTING guidelines.

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for our guidelines on improving code quality, expanding features, and ensuring overall project integrity. Your efforts help maintain agentic‑lib as a robust engine for automated workflows.

---

## Component Breakdown

This repository is organized into three distinct areas:

### 1. Re‑usable Workflows (Core Functionality)
- **Purpose:**
  These workflows form the backbone of the agentic‑lib system, enabling automated processes like testing, publishing, and issue management.
- **Stability:**
  Stable and well‑tested, designed for integration into your CI/CD pipelines.
- **Licensing:**
  Released under GPL‑3 with required attribution for any derived work.
- **Location:**
  `.github/workflows/`

### 2. Example Workflows (Demonstrative Content)
- **Purpose:**
  Serve as practical examples of the core functionalities. Ideal for learning and experimentation.
- **Stability:**
  Intended for demonstration and refinement.
- **Licensing:**
  Covered by the MIT license to allow broad use and modification.
- **Location:**
  `examples/`

### 3. The Evolving main.js (JavaScript re-implementation of Re‑usable Workflows)
- **Purpose:**
  Implements the core workflows as a JavaScript module for programmatic access.
- **Stability:**
  Under active development – represents bleeding‑edge functionality that may evolve.
- **Licensing:**
  Part of the core project, under GPL‑3 with attribution requirements.
- **Location:**
  `src/lib/main.js`

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
