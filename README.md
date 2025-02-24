# agentic-lib Agentic Coding Systems SDK

You probably want to start with the workflow documentation here: [WORKFLOWS-README.md](WORKFLOWS-README.md)

Mixed licensing:
* This project is licensed under the GNU General Public License (GPL).
* This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
* This file is licensed under the MIT License. For details, see LICENSE-MIT

---
---

## Quick Start

To get started, run the following command to see available options:

Usage: node src/lib/main.js <command> [arguments...]

Available commands:
  - self-test: Runs the self-test suite.
  - demo: Runs a demonstration of functionalities.
  - publish: Runs the publish command (stubbed functionality, full implementation planned).
  - config: Displays configuration options.
  - help: Displays this help message.
  - version: Displays the current version.
  - timestamp: Displays the current timestamp.
  - about: Displays project information.
  - status: Displays a summary of the project status (name, version, and current timestamp).
  - fun: Displays a fun ASCII art banner.
  - greet: Displays a greeting message with a random welcome note.

Note: When no command is provided, the CLI automatically runs the self-test, followed by a demo, then displays the usage message, and terminates without waiting for further input.

## Extended Functionality

This release refactors the CLI to simplify package management by introducing a helper function to load package details and centralize error handling. Enhanced inline documentation and refined error messages improve maintainability and clarity.
New commands such as "timestamp", "about", "status", "fun", and "greet" provide dynamic insights and additional interactive features, complementing the self-test and demo functionalities.

**Future Enhancements:**

- Full publish command implementation with automated deployment.
- Enhanced task management features including automated dependency updates, code formatting, and linting improvements.
- Integration with continuous deployment pipelines and expanded OpenAI API based code reviews.

## Incremental Change Roadmap

This section outlines the planned incremental improvements that will lead to the realization of the project goals across the source code, testing suite, documentation, and package configuration:

1. Source File Enhancements:
   - Modularize CLI command implementations further and refine error handling.
   - Add detailed inline documentation to improve code readability and maintainability.
   - Introduce new interactive commands like the greet command for enhanced user engagement.

2. Test Suite Improvements:
   - Expand test coverage to include edge cases and negative scenarios.
   - Integrate tests that validate logging and error responses to ensure robust CLI behavior.

3. Documentation Updates:
   - Continuously update this README to reflect new features and roadmap milestones.
   - Provide more detailed contribution guidelines and usage examples as new commands and functionalities are added.

4. Package Configuration Evolution:
   - Introduce additional npm scripts (e.g., a future automated release script) to streamline development and deployment processes.
   - Update versioning to reflect iterative improvements and pre-release changes.

These incremental changes are aligned with our mission to create a robust, modular, and continuously evolving CLI tool that supports automated workflows and community contributions.

## Running Tests

To run tests, execute:
```
  npm test
```

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

### 3. The Evolving main.js (Experimental Work in Progress)
- **Purpose:**  
  This file showcases experimental features and serves as a testbed for integrating new ideas into the system.
- **Stability:**  
  It is under active development and may change frequently. It represents bleeding‑edge functionality that might not yet be production‑ready.
- **Licensing:**  
  As part of the core project, it is under GPL‑3 with the attribution clause.
- **Location:**  
  The experimental code is located in `src/lib/main.js`.

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
