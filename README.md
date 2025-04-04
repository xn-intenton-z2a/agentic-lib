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
**EXT:** Implemented simulateIssueCreation to simulate a GitHub Actions workflow for issue creation similar to wfr-create-issue.yml with enhanced behavior including randomized title selection, timestamp logging, and optional issue labels for improved mimicry of real workflow outputs. (Updated to robustly handle empty options and provide a fallback title.)
**NEW:** Added OpenAI delegation wrappers: delegateDecisionToLLMChat, delegateDecisionToLLMChatVerbose, delegateDecisionToLLMChatOptimized for enhanced prompt validation, delegateDecisionToLLMChatAdvanced for advanced delegation with extra context support, and delegateDecisionToLLMChatPremium with additional logging and configurable base URL support. **Extended delegateDecisionToLLMFunctionCallWrapper with additional logging and error handling.**
**NEW:** Added remote service wrapper simulateRemoteServiceWrapper for simulating interactions with remote logging or monitoring services.
**NEW:** Added parsing functions parseVitestFailureOutput to extract the number of failed tests from Vitest output and parseEslintCompactOutput to handle ESLint compact output formats.
**NEW:** Exported the main() function for CLI testing and added tests for CLI help output.

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
  - `delegateDecisionToLLMChat`, `delegateDecisionToLLMChatVerbose`, `delegateDecisionToLLMChatOptimized` for enhanced prompt validation.
  - **NEW:** `delegateDecisionToLLMFunctionCallWrapper` extended with additional logging and error handling.
  - **NEW:** `delegateDecisionToLLMChatAdvanced` for advanced delegation with extra context support.
  - **NEW:** `delegateDecisionToLLMChatPremium` extends OpenAI function delegation with additional logging and configurable base URL support.
- **Kafka Operations:** Simulated messaging functions for inter‑workflow communication, including direct messaging, dynamic topic routing, detailed streaming, bulk messaging, multicast, rebroadcast, and consumer group messaging.
- **Parsing Utilities:** Functions including:
  - `parseCombinedDefaultOutput`, **NEW:** `parseVitestDefaultOutput`, `parseEslintSarifOutput`, and **`parseEslintDefaultOutput`** to parse outputs from Vitest and ESLint in different formats.
  - **NEW:** `parseVitestFailureOutput` to extract the number of failed tests from Vitest output.
  - **NEW:** `parseEslintCompactOutput` to parse ESLint compact output formats.
- **File System Simulation:** `simulateFileSystemCall()` for safe file interactions.
- **CI Workflow Simulation:** `simulateCIWorkflowLifecycle` aggregates telemetry data and simulates Kafka messaging to emulate a complete workflow lifecycle.
- **Issue Creation Simulation:** **NEW:** `simulateIssueCreation` mimics a GitHub Actions workflow for issue creation with randomized title selection, timestamp logging, and support for optional issue labels, closely emulating the behavior defined in wfr-create-issue.yml.

---

## Recent Improvements

- README refreshed to align with CONTRIBUTING guidelines. Outdated content has been pruned and core information retained.
- **Drift Pruning:** Legacy and deprecated code has been removed from the source file, ensuring strict alignment with the agentic‑lib mission statement.
- Extended Kafka Messaging Simulations including multicast and rebroadcast features.
- **NEW:** Extended the OpenAI delegation wrapper delegateDecisionToLLMFunctionCallWrapper with additional logging and error handling.
- Enhanced telemetry and simulation utilities, including **NEW:** `gatherSystemMetrics` function.
- **FIX:** Corrected getIssueNumberFromBranch function (now using the correct regex) and added `parseCombinedDefaultOutput` for parsing test outputs.
- **EXT:** Implemented and enhanced simulateIssueCreation to mimic GitHub issue creation workflow behavior, including randomized title selection, timestamp logging, and optional issue labels, mirroring the logic from wfr-create-issue.yml.
- **NEW:** Added parsing functions `parseVitestDefaultOutput`, `parseEslintSarifOutput`, and `parseEslintDefaultOutput` to process Vitest and ESLint outputs.
- **NEW:** Added additional parsing functions `parseVitestFailureOutput` and `parseEslintCompactOutput` to support varied output formats.
- **NEW:** Added remote service wrapper **simulateRemoteServiceWrapper** for simulating remote logging or monitoring service interactions.
- **NEW:** Exported the main() function to facilitate CLI testing and added tests for CLI help output.

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
