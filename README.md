# intentïon agentic-lib

You probably want to start with the workflow documentation here: [WORKFLOWS-README.md](WORKFLOWS-README.md)

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.

[Start using the Repository Template](https://github.com/xn-intenton-z2a/repository0)

Mixed licensing:
* This project is licensed under the GNU General Public License (GPL).
* This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
* This file is licensed under the MIT License. For details, see LICENSE-MIT

This README file will evolve as the test experiment within this repository evolves.

---
---

## Quick Start Guide: 20 Detailed Steps to Evolve This Repository

1. Fork the repository and clone it to your local machine.
2. Ensure you have Node 20 or higher installed.
3. Run `npm ci` to install all dependencies.
4. Explore the source code in `src/lib/main.js`, which now features refined CLI flag processing by separating flags from arguments and includes new functionality such as the `--camel` flag that converts arguments to camelCase.
5. Review the test suite in `tests/unit/` for current functionality, including tests covering usage messaging, individual flags, and combined flag scenarios.
6. Examine the workflows in `.github/workflows/` to understand automated LLM-driven improvements.
7. Read through the [CONTRIBUTING.md](CONTRIBUTING.md) file to follow collaboration guidelines.
8. Execute `npm run start` to observe the current CLI output. **Note:** In production, the program terminates automatically after displaying usage and demo output.
9. Run `npm test` to ensure that all tests pass.
10. Follow this updated guide that focuses on evolving the repository iteratively while keeping documentation in sync with the current behavior.
11. Identify areas for improvement within the code or workflows.
12. Use automated tools or LLM feedback to suggest enhancements one at a time.
13. Validate changes by running the full test suite and build scripts.
14. Update documentation to reflect new features and evolving practices.
15. Create a feature branch and submit a pull request with your improvements.
16. Engage with automated workflows that test and merge your contributions.
17. Monitor CI/CD pipelines for further iterative suggestions.
18. Repeat the process to continuously evolve the repository using LLM completions.
19. Enjoy the evolution: one LLM-driven update at a time.
20. Explore planned future features outlined below.

## Future Features

- Enhanced CLI argument parsing and conflict resolution between flags.
- Improved error messaging and logging within the main execution flow.
- Additional automated tests to cover edge cases, especially for combined flag scenarios.
- Integration of new GitHub Actions workflows to manage more aspects of repository automation.
- Extended documentation and examples to help contributors better understand experimental features.
- **New Feature:** Added a `--append` flag which joins remaining arguments with a space and appends an exclamation mark, powered by lodash.
- **New Feature:** Added a `--capitalize` flag which capitalizes each provided argument using the change-case library.
- **New Feature:** Added a `--camel` flag which converts each provided argument to camelCase using the change-case library.
- Enhanced test coverage in main.js and robust output validation.
- Planned improvements include interactive command suggestions and more granular error feedback to guide users in case of misuse.

## Further Documentation

For more detailed information about workflow usage, configuration, and future enhancements, please refer to the [WORKFLOWS-README.md](WORKFLOWS-README.md).

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
