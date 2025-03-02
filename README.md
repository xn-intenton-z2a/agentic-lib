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

## New Exported Utility Functions

- `generateUsage()`: Provides a usage message with updated flag options.
- `getIssueNumberFromBranch(branch, prefix)`: Extracts an issue number from a branch name with improved regex.
- `sanitizeCommitMessage(message)`: Cleans up commit messages by removing unsupported characters and extra spaces.
- `splitArguments(args)`: Splits command line arguments into flag and non-flag arrays.
- `processFlags(flags)`: Processes an array of flags and returns a summary message.
- `enhancedDemo()`: Provides demo output including environmental details.
- `logEnvironmentDetails()`: Logs current environment details such as NODE_ENV.
- `showVersion()`: Returns the current version of the library.

---

## Recent Improvements

- Consolidated application exit routine and improved code commenting for clarity in `main.js`.
- Extended flag processing functions for clearer output.
- Updated documentation to reflect current function behavior and future enhancements.

---
---

## Future Enhancements

The current version synchronizes the README with the evolving implementation in `main.js`. Future enhancements include:

- Additional utility functions to further extend workflow automation.
- Improved integration with GitHub's API for dynamic issue and PR management.
- Enhanced logging and monitoring features for continuous integration.
- Further consolidation of repetitive routines into helper functions.

---
---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Component Breakdown

This repository is organized into three distinct areas to help you understand the purpose and maturity level of each component:

### 1. Re‑usable Workflows (Core Functionality)
- **Purpose:**  
  These workflows form the backbone of the agentic‑lib system, enabling automated processes such as testing, publishing, and issue management.
- **Stability:**  
  They are stable and well‑tested, designed for integration into CI/CD pipelines.
- **Licensing:**  
  The core workflows are released under GPL‑3 with an attribution requirement for any derived work.
- **Location:**  
  Located in the `.github/workflows/` directory.

### 2. Example Workflows (Demonstrative Content)
- **Purpose:**  
  These files provide practical examples of how to use the core workflows, serving as learning tools and reference implementations.
- **Stability:**  
  Intended primarily for demonstration and experimentation.
- **Licensing:**  
  Covered by the MIT license to allow for broader use and modification.
- **Location:**  
  Found in the `examples/` directory.

### 3. The Evolving main.js (JavaScript re-implementation of Re‑usable Workflows)
- **Purpose:**  
  Implements the reusable workflows as a JavaScript module for programmatic access to core functionality.
- **Stability:**  
  Under active development; represents bleeding‑edge functionality that might change frequently.
- **Licensing:**  
  Part of the core project distributed under GPL‑3 with attribution.
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

You should have received a copy of the GNU General Public License v3.0 (GPL‑3).
along with this program. If not, see <https://www.gnu.org/licenses/>.

IMPORTANT: Any derived work must include the following attribution:
"This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
```

---
---
