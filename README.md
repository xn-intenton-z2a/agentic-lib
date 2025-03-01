# intentïon agentic-lib

You probably want to start with the workflow documentation here: [WORKFLOWS-README.md](WORKFLOWS-README.md)

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your
repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and
issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using
GitHub’s `workflow_call` event, so they can be composed together like an SDK.

[Start using the Repository Template](https://github.com/xn-intenton-z2a/repository0)

Mixed licensing:
* This project is licensed under the GNU General Public License (GPL).
* This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
* This file is licensed under the MIT License. For details, see LICENSE-MIT

This README file will evolve as the test experiment within this repository evolves.

---
---

## Updates

- Added new feature: the **--reverse-words** flag, which reverses each word's characters.
- Revised the transformation pipeline in `main.js` for consistent CLI flag processing.
- Improved formatting and code quality to resolve build and linting issues.
- Updated utility functions and tests for better consistency.

---
---

## Quick Start Guide: 20 Detailed Steps to Evolve This Repository

1. Fork the repository and clone it to your local machine.
2. Ensure you have Node 20 or higher installed.
3. Run `npm ci` to install all dependencies.
4. Explore the source code in `src/lib/main.js`, which now features an updated transformation pipeline.
5. Review the test suite in `tests/unit/` for current functionality.
6. Execute `npm run start` to observe the CLI output.
7. Run `npm test` to ensure all tests pass.
8. Use the updated transformation logic and API wrappers as a baseline.
9. Identify areas for improvement in error messaging and flag handling.
10. Validate changes by running the full test suite.
11. Update documentation as new features are added.
12. Create a feature branch and submit a pull request.
13. Engage with CI/CD pipelines for iterative suggestions.
14. Review automated workflows in `.github/workflows/`.
15. Check consistency between source, tests, and documentation.
16. Explore contributing guidelines in [CONTRIBUTING.md](CONTRIBUTING.md).
17. Monitor dependency updates with `npm-check-updates`.
18. Suggest new features or enhancements.
19. Collaborate via GitHub issues and PR reviews.
20. Enjoy the continuous evolution powered by **agentic‑lib**.

---
---

## New Exported Utility Functions

- `generateUsage()`: Provides a usage message.
- `reverseArgs(args)`, `toUpperCaseArgs(args)`, `toLowerCaseArgs(args)`: Basic transformations.
- `shuffleArgs(args)`, `sortArgs(args)`, `duplicateArgs(args)`, `countArgs(args)`: Array manipulations.
- `getIssueNumberFromBranch(branch, prefix)`: Extracts an issue number.
- `sanitizeCommitMessage(message)`: Cleans commit messages.
- `reviewIssue(options)`: Evaluates file contents and outputs.
- `appendIndexArgs(args)`: Appends indices.
- `uniqueArgs(args)`: Filters unique elements.
- `trimArgs(args)`: Trims whitespace.
- `kebabCaseArgs(args)`: Converts to kebab-case.
- `constantCaseArgs(args)`: Converts to CONSTANT_CASE.
- `seededShuffleArgs(args, seed)`: Deterministically shuffles arguments.
- `reverseWordsArgs(args)`: Reverses the characters of each argument.

---
---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Component Breakdown

This repository is organized into three distinct areas to help you understand the purpose and maturity level of each component:

### 1. Re‑usable Workflows (Core Functionality)
- **Purpose:**  
  These workflows form the backbone of the agentic‑lib system.
- **Stability:**  
  They are stable and well‑tested.
- **Licensing:**  
  Released under GPL‑3 with attribution requirements.
- **Location:**  
  In the `.github/workflows/` directory.

### 2. Example Workflows (Demonstrative Content)
- **Purpose:**  
  Provide practical examples of how to use the core workflows.
- **Stability:**  
  Intended for demonstration and experimentation.
- **Licensing:**  
  Covered by the MIT license.
- **Location:**  
  In the `examples/` directory.

### 3. The Evolving main.js (JavaScript Re‑implementation of Workflows)
- **Purpose:**  
  Enables programmatic access to the core functionality.
- **Stability:**  
  Under active development and may change frequently.
- **Licensing:**  
  Under GPL‑3 with attribution requirements.
- **Location:**  
  Located in `src/lib/main.js`.

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
