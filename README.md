# intentïon agentic-lib

You probably want to start with the workflow documentation here: [WORKFLOWS-README.md](WORKFLOWS-README.md)

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.

[Start using the Repository Template](https://github.com/xn-intenton-z2a/repository0)

---
---

## Overview

The agentic‑lib provides a rich set of JavaScript functions that mirror GitHub Actions workflows functionalities. It includes telemetry gathering, Kafka simulation, remote service wrappers, advanced LLM delegation, and more. This tool is designed to facilitate seamless automation and continuous integration processes.

## Library Functions and Features

- **generateUsage()**: Provides an updated usage message with available flag options.
- **getIssueNumberFromBranch(branch, prefix)**: Extracts an issue number from a branch name with improved regex safety.
- **sanitizeCommitMessage(message)**: Cleans commit messages by removing unsupported characters and extra spaces.
- **splitArguments(args)**: Splits command line arguments into flag and non-flag arrays.
- **processFlags(flags)**: Processes an array of flags and returns a summary message. Supports extended logging modes with `--verbose` and `--debug`.
- **enhancedDemo()**: Provides demonstration output including environment details and debug status.
- **logEnvironmentDetails()**: Logs current environment details such as NODE_ENV.
- **showVersion()**: Returns the current version of the library.
- **Telemetry Functions**:
  - gatherTelemetryData()
  - gatherExtendedTelemetryData()
  - gatherFullTelemetryData()
  - **gatherAdvancedTelemetryData()**: Collects additional runtime and process information such as Node version, process PID, current working directory, platform, and memory usage.
- **LLM Delegation Functions**:
  - delegateDecisionToLLM()
  - delegateDecisionToLLMWrapped()
  - delegateDecisionToLLMAdvanced()
- **Kafka Simulations and Operations**:
  - sendMessageToKafka(topic, message)
  - receiveMessageFromKafka(topic)
  - logKafkaOperations(topic, message)
  - simulateKafkaStream(topic, count)
  - simulateKafkaDetailedStream(topic, count)
- **Remote Service Wrappers**:
  - callRemoteService(serviceUrl)
  - callAnalyticsService(serviceUrl, data)
  - callNotificationService(serviceUrl, payload)
  - callBuildStatusService(serviceUrl)
  - callDeploymentService(serviceUrl, payload)  <-- New deployment service wrapper
- **Parsing Utilities**:
  - parseSarifOutput(sarifJson)
  - parseEslintSarifOutput(sarifJson)
  - parseVitestOutput(outputStr)

---

## Recent Improvements

- Extended flag handling and new flag options including `--simulate-remote`, `--sarif`, and `--report`.
- Improved telemetry data functions by introducing extended, full, and advanced telemetry options. (New function: gatherAdvancedTelemetryData)
- Enhanced remote service wrappers with robust HTTP error checking.
- Upgraded Kafka simulation with detailed logging for improved diagnostics.
- Introduced advanced LLM delegation with function calling support via OpenAI.
- Fixed regex escaping in getIssueNumberFromBranch to correctly extract issue numbers.
- Added new remote service wrapper: **callDeploymentService** for triggering deployment operations in agentic workflows.

---

## Future Enhancements

- Integration with additional remote services for enriched workflow automation.
- More robust GitHub API interactions for dynamic issue and PR management.
- Expanded logging and monitoring for comprehensive CI/CD metrics.

---

## License and Attribution

This project is licensed under the GNU General Public License (GPL) and the MIT License. See [LICENSE](LICENSE) for details.

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

You should have received a copy of the GNU General Public License v3.0 (GPL‑3).
along with this program. If not, see <https://www.gnu.org/licenses/>.

IMPORTANT: Any derived work must include the following attribution:
"This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
```

---
---
