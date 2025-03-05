# intentïon agentic-lib

You probably want to start with the workflow documentation here: [WORKFLOWS-README.md](WORKFLOWS-README.md)

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your
repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and
issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using
GitHub’s `workflow_call` event, so they can be composed together like an SDK.

[Start using the Repository Template](https://github.com/xn-intenton-z2a/repository0)

---

## Overview

The agentic‑lib provides a rich set of JavaScript functions mirroring GitHub Actions workflows, including telemetry, Kafka simulations,
remote service wrappers, advanced LLM delegation, and parsing utilities. This library is designed for seamless automation and CI/CD integration.

## Key Features

- **Usage Information:**
  - Use `generateUsage()` to get up-to-date flag options.
- **Telemetry:**
  - Includes functions such as `gatherTelemetryData()`, `gatherExtendedTelemetryData()`, `gatherAdvancedTelemetryData()`, `gatherFullTelemetryData()`, and the new `gatherGitHubTelemetrySummary()` as well as `gatherFullSystemReport()` for complete diagnostics.
- **Remote Service Wrappers:**
  - Simplifies API calls through wrappers for deployment, build status, analytics, and notifications.
- **LLM Delegation:**
  - Leverages functions like `delegateDecisionToLLM()`, `delegateDecisionToLLMWrapped()`, and `delegateDecisionToLLMAdvanced()` for AI-assisted decisions.
- **Kafka Operations:**
  - Supports Kafka simulation and detailed logging via functions like `simulateKafkaDetailedStream()`, with new improvements through `simulateRealKafkaStream()`.
- **Create Issue Simulation:**
  - **New:** The `--create-issue` flag now mimics the behavior of the GitHub workflow `wfr-create-issue.yml`, including handling of house choice options and simulated issue creation.

## Recent Improvements

- Extended flag handling with robust diagnostics.
- Updated telemetry, Kafka, and remote service wrappers with improved error checking.
- Introduced advanced LLM delegation using function calling.
- **New:** Added functions `gatherFullSystemReport` and `simulateRealKafkaStream` for comprehensive diagnostics and enhanced Kafka simulation.
- **New:** Added telemetry aggregator function `gatherGitHubTelemetrySummary` to merge telemetry data from various GitHub Actions environment variables.
- **New:** Extended create issue simulation to reflect the behavior of the GitHub Actions workflow.

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

---
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

You should have received a copy of the GNU General Public License v3.0 (GPL‑3)
along with this program. If not, see <https://www.gnu.org/licenses/>.

IMPORTANT: Any derived work must include the following attribution:
"This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
```

---
---

