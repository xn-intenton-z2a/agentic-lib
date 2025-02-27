# intentïon agentic-lib

You probably want to start with the workflow documentation here: [WORKFLOWS-README.md](WORKFLOWS-README.md)

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your
repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and
issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using
GitHub’s `workflow_call` event, so they can be composed together like an SDK.

[Start using the Repository Template](https://github.com/xn-intenton-z2a/repository0)

## Current State of the Software

This project is under active development. The core functionalities are stable, while experimental features are actively being enhanced. Our SDK supports automated CI/CD with built-in workflows for testing, publishing, fix resolving, and more.

## Quick Start Guide: 20 Detailed Steps

1. Fork the repository and clone it to your local machine.
2. Ensure you have Node 20 or higher installed.
3. Run `npm ci` to install all dependencies.
4. Explore the source code in `src/lib/main.js` for experimental features.
5. Review the test suite in `tests/unit/` to understand the functionality.
6. Examine the workflows in `.github/workflows/` for automation details.
7. Read through the CONTRIBUTING.md file to understand our collaboration guidelines.
8. Execute `npm run start` to invoke the CLI tool and observe its output.
9. Run `npm test` to validate that all tests pass.
10. Inspect the build script via `npm run build` (note: it currently outputs a placeholder message).
11. Review linting and formatting configurations in `.prettierrc` and `eslint.config.js`.
12. Check the dependency definitions in `package.json` for project stability.
13. Observe how GitHub Actions workflows trigger automated fixes and updates.
14. Experiment with the auto-merge and issue management workflows provided.
15. Study the examples in the `examples/` directory to see practical implementations.
16. Create a feature branch and submit a pull request with improvements or fixes.
17. Update documentation as needed when modifying workflows or code.
18. Engage with maintainers via GitHub issues if you encounter any challenges.
19. Monitor CI/CD outputs to ensure consistency and reliability.
20. Enjoy leveraging the agentic-lib automation engine in your projects!

## Further Documentation

For more detailed information about workflow usage, configuration, and future enhancements, please refer to the [WORKFLOWS-README.md](WORKFLOWS-README.md).

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
