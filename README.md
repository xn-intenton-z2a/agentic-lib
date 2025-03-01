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

- Added new feature: the **--reverse-words** flag. When provided, each non-flag argument's characters are reversed individually. Also added the exported utility function `reverseWordsArgs`.
- Revised transformation pipeline in `main.js` to process CLI flags sequentially, ensuring consistent output across all transformations.
- **Improved consistency:** The `--sort` flag now updates the processed arguments similar to other transformation flags for better consistency between the source and test outputs.

---
---

## Quick Start Guide: 20 Detailed Steps to Evolve This Repository

1. Fork the repository and clone it to your local machine.
2. Ensure you have Node 20 or higher installed.
3. Run `npm ci` to install all dependencies.
4. Explore the source code in `src/lib/main.js`, which now features an updated transformation pipeline that sequentially applies CLI flag modifications. New functionality includes:
   - **--sort**: Sorts non-flag arguments alphabetically (now updates the internal argument state for consistency).
   - **--duplicate**: Duplicates each argument.
   - **--count**: Displays the count of non-flag arguments.
   - **--shuffle**: Randomly shuffles the order of non-flag arguments.
   - **--seeded-shuffle**: Deterministically shuffles arguments using a provided seed. Supply the seed as the first non-flag argument following the flag.
   - **--reverse-words**: Reverses the characters of each non-flag argument.
   - **Conflict detection for case flags**: When both `--upper` and `--lower` are provided, a warning is displayed and no transformation is applied.
5. A new wrapper function, **openaiChatCompletions**, has been added to simplify calls to the OpenAI API.
6. **New Exported Utility Functions:**
   The source file now exports several new utility functions to aid in common text and issue processing tasks:
   - `generateUsage()`: Returns a usage message string.
   - `reverseArgs(args)`: Returns a reversed copy of an arguments array.
   - `toUpperCaseArgs(args)`: Converts all arguments to uppercase.
   - `toLowerCaseArgs(args)`: Converts all arguments to lowercase.
   - `shuffleArgs(args)`: Returns a new array with elements shuffled randomly.
   - `sortArgs(args)`: Returns a sorted copy of the arguments array.
   - `duplicateArgs(args)`: Returns a new array with each argument duplicated.
   - `countArgs(args)`: Returns the count of arguments.
   - `getIssueNumberFromBranch(branch, prefix)`: Extracts an issue number from a branch name based on a prefix.
   - `sanitizeCommitMessage(message)`: Cleans commit messages for consistency in version control.
   - `reviewIssue(options)`: Evaluates the provided file contents and outputs.
   - `appendIndexArgs(args)`: Appends each argument with its index.
   - `uniqueArgs(args)`: Filters to only unique arguments.
   - `trimArgs(args)`: Trims whitespace from each argument.
   - `kebabCaseArgs(args)`: Converts arguments into kebab-case format.
   - `constantCaseArgs(args)`: Converts arguments into CONSTANT_CASE format.
   - `seededShuffleArgs(args, seed)`: Deterministically shuffles the arguments using a provided seed.
   - **`reverseWordsArgs(args)`**: Reverses the characters of each argument.
7. Review the test suite in `tests/unit/` for current functionality. New tests have been added for these utility functions and for CLI flag behaviors.
8. Examine the workflows in `.github/workflows/` to understand automated improvements.
9. Read through the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on automated and human contributions.
10. Execute `npm run start` to observe the CLI output. **Note:** In production, the program terminates automatically after displaying usage and demo output.
11. Run `npm test` to ensure that all tests pass.
12. Use the updated transformation logic and API wrappers as a baseline and suggest further enhancements if needed.
13. Identify areas for improvement in error messaging, interactive command suggestions, and flag conflict resolution.
14. Leverage automated tools and LLM feedback to propose one enhancement at a time.
15. Validate changes by running the full test suite and build scripts.
16. Update documentation as new features are added or existing behavior evolves.
17. Create a feature branch and submit a pull request with your improvements.
18. Engage with automated workflows that test and merge your contributions.
19. Monitor CI/CD pipelines for further iterative suggestions.
20. Enjoy the evolution, one automated update at a time.

---
---

## New Exported Utility Functions

The source file now exports the following utility functions to help with various operations:
- `generateUsage()`: Provides a standardized usage message.
- `reverseArgs(args)`, `toUpperCaseArgs(args)`, `toLowerCaseArgs(args)`: Basic text transformations.
- `shuffleArgs(args)`, `sortArgs(args)`, `duplicateArgs(args)`, `countArgs(args)`: Array manipulation utilities.
- `getIssueNumberFromBranch(branch, prefix)`: Extracts an issue number from a branch name based on a prefix.
- `sanitizeCommitMessage(message)`: Cleans commit messages for consistency in version control.
- **`reviewIssue(options)`**: Evaluates the provided file contents and outputs.
- **`appendIndexArgs(args)`**: Appends each argument with its index.
- **`uniqueArgs(args)`**: Filters to only unique arguments.
- **`trimArgs(args)`**: Trims whitespace from each argument.
- **`kebabCaseArgs(args)`**: Converts arguments into kebab-case format.
- **`constantCaseArgs(args)`**: Converts arguments into CONSTANT_CASE format.
- **`seededShuffleArgs(args, seed)`**: Deterministically shuffles the arguments using a provided seed.
- **`reverseWordsArgs(args)`**: Reverses the characters of each argument.

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
along with this program. If not, see <https://www.gnu.org/licenses/>

IMPORTANT: Any derived work must include the following attribution:
"This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
```

---
---
