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
  - Includes functions such as `gatherTelemetryData()`, `gatherExtendedTelemetryData()`, and `gatherAdvancedTelemetryData()` to collect comprehensive runtime data.
- **Remote Service Wrappers:**
  - Simplifies API calls through wrappers for deployment, build status, analytics, and notifications.
- **LLM Delegation:**
  - Leverages functions like `delegateDecisionToLLM()`, `delegateDecisionToLLMWrapped()`, and `delegateDecisionToLLMAdvanced()` for AI-assisted decisions.
- **Kafka Operations:**
  - Supports Kafka simulation and detailed logging via functions like `simulateKafkaDetailedStream()`.

## Recent Improvements

- Extended flag handling with robust diagnostics.
- Updated telemetry, Kafka, and remote service wrappers with improved error checking.
- Introduced advanced LLM delegation using function calling.
- **README refreshed to align with contributing guidelines.**

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Component Breakdown

This repository is organized into three distinct areas to help you understand the purpose and maturity level of each component:

### 1. Re‑usable Workflows (Core Functionality)
- **Purpose:**
  - Automate testing, publishing, and issue management.
- **Stability:**
  - Stable and well‑tested for CI/CD pipelines.
- **Licensing:**
  - Released under GPL‑3 with attribution.
- **Location:**
  - `.github/workflows/`

### 2. Example Workflows (Demonstrative Content)
- **Purpose:**
  - Provide practical usage examples.
- **Stability:**
  - Intended for learning and experimentation.
- **Licensing:**
  - Covered by the MIT license.
- **Location:**
  - `examples/`

### 3. The Evolving main.js (JavaScript re-implementation of Workflows)
- **Purpose:**
  - Enable programmatic access to core workflow functionality.
- **Stability:**
  - Under active development and may change frequently.
- **Licensing:**
  - Under GPL‑3 with attribution.
- **Location:**
  - `src/lib/main.js`

---

## License

This project is licensed under the GNU General Public License (GPL). See [LICENSE](LICENSE) for full details.

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

Mixed licensing:
* This project is licensed under the GNU General Public License (GPL).
* This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
* This file is licensed under the MIT License. For details, see LICENSE-MIT
