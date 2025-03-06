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

The agentic‑lib provides a rich set of JavaScript functions that mirror GitHub Actions workflows. It includes telemetry gathering, Kafka simulations, remote service wrappers, advanced LLM delegation, and parsing utilities. These functions empower you to build fully automated CI/CD integrations.

## Key Features

- **Usage Information:**
  - Use `generateUsage()` to display available flag options.
- **Telemetry:**
  - Functions include `gatherTelemetryData()`, `gatherExtendedTelemetryData()`, `gatherAdvancedTelemetryData()`, `gatherFullTelemetryData()`, and `gatherGitHubTelemetrySummary()` for comprehensive diagnostics.
  - **Extended Telemetry:**
    - The new function `gatherCustomTelemetryData()` collects additional system metrics such as uptime, load averages, network interfaces, and hostname for deeper insights in GitHub Actions workflows.
- **Remote Service Wrappers:**
  - Simplify API calls with wrappers to handle deployment, build status, analytics, and notifications.
- **LLM Delegation:**
  - Utilize functions like `delegateDecisionToLLM()`, `delegateDecisionToLLMWrapped()`, `delegateDecisionToLLMAdvanced()`, `delegateDecisionToLLMAdvancedVerbose()`, and the newly added `delegateDecisionToLLMAdvancedStrict()` for enhanced logging, decision making, and timeout support.
- **Kafka Operations:**
  - Simulate Kafka messaging and logging via functions like `simulateKafkaDetailedStream()`, `simulateKafkaBulkStream()`, and `simulateKafkaInterWorkflowCommunication()`, along with enhanced simulation via `simulateRealKafkaStream()`.
- **Issue Creation Simulation:**
  - The `--create-issue` flag now mimics GitHub Actions workflow behavior. It supports a "house choice" option and logs both the issue title and the issue body along with a simulated issue number.
- **Advanced Analytics Simulation:**
  - New advanced analytics simulation (`--advanced` flag) combines detailed Kafka simulation with advanced telemetry data for deeper insights into system performance.

## Recent Improvements

- Extended flag handling with improved diagnostics and error checking. (Refactored handling in `main.js`)
- Enhanced telemetry and Kafka simulation functions with detailed logging and performance metrics.
- Advanced LLM delegation incorporated to support function calling with strict schemas.
- New diagnostic functions: `gatherFullSystemReport` and `simulateRealKafkaStream`.
- **New:** Added `simulateAdvancedAnalytics` function and the `--advanced` CLI flag to simulate advanced analytics combining Kafka streaming and telemetry data.
- **New:** Added `delegateDecisionToLLMAdvancedVerbose` function for enhanced logging during LLM delegation.
- **New:** Added `gatherCustomTelemetryData` to provide additional system metrics for improved telemetry data collection in GitHub Actions workflows.
- **New:** Added `delegateDecisionToLLMAdvancedStrict` to support timeout-based advanced LLM delegation.
- **New:** Refactored flag handling to extract helper functions for improved maintainability.
- **New:** Improved regex in `getIssueNumberFromBranch` to correctly extract issue numbers.
- **New:** Increased test coverage by adding additional unit tests for LLM delegation fallback behaviors and other functions.

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
