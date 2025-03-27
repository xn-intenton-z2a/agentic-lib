# intentïon agentic-lib

You probably want to start with the workflow documentation here: [WORKFLOWS-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/WORKFLOWS-README.md)

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.

[Start using the Repository Template](https://github.com/xn-intenton-z2a/repository0)

[Also on GitHub Pages](https://xn-intenton-z2a.github.io/agentic-lib/index.html)

[See the latest repository stats](https://xn-intenton-z2a.github.io/agentic-lib/latest.html)

Mixed licensing:
* This project is licensed under the GNU General Public License (GPL).
* This file is part of the example suite for `agentic-lib` (see: https://github.com/xn-intenton-z2a/agentic-lib).
* This file is licensed under the MIT License. For details, see LICENSE-MIT.

*Change Log: README refreshed following CONTRIBUTING guidelines. Outdated and irrelevant content pruned while core information is retained.
**NEW:** Added and enhanced telemetry functions including gatherWorkflowTelemetry, gatherCIWorkflowMetrics, gatherSystemMetrics and parsing functions parseCombinedDefaultOutput, parseVitestDefaultOutput, parseEslintSarifOutput, and parseEslintDefaultOutput to process output formats.
**FIX:** Corrected getIssueNumberFromBranch function (fixed regex pattern) and added parseCombinedDefaultOutput for parsing test outputs.
**EXT:** Implemented simulateIssueCreation to simulate a GitHub Actions workflow for issue creation similar to wfr-create-issue.yml, and enhanced it to log a creation timestamp and additional details. Extended simulateIssueCreation to support houseChoiceOptions provided as a string delimited by "||", as well as an array.
**NEW:** Added OpenAI delegation wrappers: delegateDecisionToLLMFunctionCallWrapper, delegateDecisionToLLMChatOptimized, delegateDecisionToLLMChatAdvanced, and delegateDecisionToLLMChatPremium.
**NEW:** Added remote service wrapper simulateRemoteServiceWrapper for simulating interactions with remote logging or monitoring services.

---

## Overview

agentic‑lib provides a wide array of JavaScript functions mirroring GitHub Actions workflows. Key features include:

- **Usage Information:** Use `generateUsage()` to display available command‑line options.
- **Telemetry:** Comprehensive diagnostics via functions such as:
  - `gatherTelemetryData()`, `gatherExtendedTelemetryData()`, `gatherAdvancedTelemetryData()`, `gatherFullTelemetryData()`, `gatherTotalTelemetry()`, `gatherWorkflowTelemetry()`, `gatherCIWorkflowMetrics()`, and **`gatherSystemMetrics()`** for system-level telemetry.
  - **CI Metrics:** `gatherCIEnvironmentMetrics()` captures additional GitHub Actions metrics.
  - **Extra Telemetry:** `gatherExtraTelemetryData()` provides metrics like timestamps, CPU usage, and free memory.
  - **GitHub Environment Telemetry:** `gatherGithubEnvTelemetry()` aggregates all environment variables starting with `GITHUB_`.
- **Remote Service Wrappers:** Simplified API interactions for multiple services, including a new **simulateRemoteServiceWrapper** to simulate remote interactions, such as logging or monitoring services.
- **LLM Delegation:** Functions to support decision delegation with advanced OpenAI capabilities:
  - `delegateDecisionToLLMChat`, `delegateDecisionToLLMChatVerbose`, and `delegateDecisionToLLMChatOptimized` for enhanced prompt validation.
  - **NEW:** `delegateDecisionToLLMFunctionCallWrapper` extends our OpenAI function delegation capabilities.
  - **NEW:** `delegateDecisionToLLMChatAdvanced` for advanced delegation with extra context support.
  - **NEW:** `delegateDecisionToLLMChatPremium` extends OpenAI function delegation with additional logging and configurable base URL support.
- **Kafka Operations:** Simulated messaging functions for inter‑workflow communication, including direct messaging, dynamic topic routing, detailed streaming, bulk messaging, multicast, rebroadcast, and consumer group messaging.
- **Parsing Utilities:** Functions such as:
  - `parseCombinedDefaultOutput` and **NEW:** `parseVitestDefaultOutput`, `parseEslintSarifOutput`, and **parseEslintDefaultOutput** to parse outputs from Vitest and ESLint in different formats.
- **File System Simulation:** `simulateFileSystemCall()` enables safe file interactions for testing purposes.
- **CI Workflow Simulation:** `simulateCIWorkflowLifecycle` aggregates telemetry data and simulates Kafka messaging to emulate a complete workflow lifecycle.
- **Issue Creation Simulation:** **NEW:** `simulateIssueCreation` mimics a GitHub Actions workflow for issue creation, now enhanced to include a timestamp and additional detail logging.

---

## Recent Improvements

- README refreshed to align with the CONTRIBUTING guidelines. Outdated content has been pruned and core information retained.
- **Drift Pruning:** Legacy and deprecated code has been removed from the source file, ensuring strict alignment with the agentic‑lib mission statement.
- Extended Kafka Messaging Simulations including multicast and rebroadcast features.
- New OpenAI Function Wrappers: `delegateDecisionToLLMFunctionCallWrapper`, `delegateDecisionToLLMChatOptimized`, `delegateDecisionToLLMChatAdvanced`, and `delegateDecisionToLLMChatPremium`.
- Enhanced telemetry and simulation utilities, including **NEW:** `gatherSystemMetrics` function.
- **FIX:** Corrected getIssueNumberFromBranch function (now using the correct regex) and added `parseCombinedDefaultOutput` for parsing test outputs.
- **EXT:** Implemented and enhanced simulateIssueCreation to mimic GitHub issue creation workflow behavior, including randomized title selection and timestamp logging. Extended support for houseChoiceOptions as both string and array.
- **NEW:** Added parsing functions `parseVitestDefaultOutput`, `parseEslintSarifOutput`, and **parseEslintDefaultOutput** to process Vitest and ESLint outputs in different formats.
- **NEW:** Added remote service wrapper **simulateRemoteServiceWrapper** for simulating remote logging or monitoring service interactions.

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Component Breakdown

This repository is organized into three distinct areas:

### 1. Re‑usable Workflows (Core Functionality)
- **Purpose:** These workflows form the backbone of the agentic‑lib system, enabling automated processes such as testing, publishing, and issue management.
- **Stability:** They are stable and well‑tested, designed for seamless integration into CI/CD pipelines.
- **Licensing:** Released under GPL‑3 with an attribution requirement for any derived work.
- **Location:** Found in the `.github/workflows/` directory.

### 2. Example Workflows (Demonstrative Content)
- **Purpose:** These files provide practical examples of using the core workflows, serving as learning tools and reference implementations.
- **Stability:** Intended primarily for demonstration and experimentation.
- **Licensing:** Covered by the MIT license to allow broader use and modification.
- **Location:** See the `examples/` directory for sample implementations.

### 3. The Evolving main.js (JavaScript Implementation of Re‑usable Workflows)
- **Purpose:** Implements the re‑usable workflows as a JavaScript module for programmatic access to core functionality.
- **Stability:** Under active development and may change frequently, representing bleeding‑edge functionality.
- **Licensing:** Part of the core project, licensed under GPL‑3 with attribution.
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