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

- Added new flag: **--unique** to remove duplicate arguments from the input.
- Revised the transformation pipeline in `main.js` to extend functionality as per issue requirements.
- Extended test cases to cover the new **--unique** flag.
- Added new flag: **--vowel-count** to compute the total number of vowels in the provided arguments using lodash.
- Updated documentation to reflect the new vowel count functionality.

---
---

## Quick Start Guide: 20 Detailed Steps to Evolve This Repository

1. Fork the repository and clone it to your local machine.
2. Ensure you have Node 20 or higher installed.
3. Run `npm ci` to install all dependencies.
4. Explore the source code in `src/lib/main.js`, which now features an updated transformation pipeline including new '--unique' and '--vowel-count' flags.
5. Review the test suite in `tests/unit/` for current functionality.
6. Execute `npm run start` to observe the CLI output and test the new functionalities.
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
19. Collaborate via GitHub issues and PR reviews to improve project quality.
20. Enjoy the continuous evolution powered by **agentic‑lib**.

---
---

## New Exported Utility Functions

- `generateUsage()`: Provides a usage message updated with the new flags.
- `reverseArgs(args)`, `toUpperCaseArgs(args)`, `toLowerCaseArgs(args)`: Basic transformations.
- `shuffleArgs(args)`, `sortArgs(args)`, `duplicateArgs(args)`, `uniqueArgs(args)`, `countArgs(args)`: Array manipulations. (New: `uniqueArgs` removes duplicate elements)
- `getIssueNumberFromBranch(branch, prefix)`: Extracts an issue number.
- `sanitizeCommitMessage(message)`: Cleans commit messages.
- `reviewIssue(options)`: Evaluates file contents and outputs.
- `appendIndexArgs(args)`: Appends indices.
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
