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

## Quick Start Guide: 20 Detailed Steps to Evolve This Repository

1. Fork the repository and clone it to your local machine.
2. Ensure you have Node 20 or higher installed.
3. Run `npm ci` to install all dependencies.
4. Explore the source code in `src/lib/main.js`, which now features an updated transformation pipeline that sequentially applies CLI flag modifications. New functionality includes:
   - **--sort**: Sorts non-flag arguments alphabetically.
   - **--duplicate**: Duplicates each argument.
   - **--count**: Displays the count of non-flag arguments.
5. A new wrapper function, **openaiChatCompletions**, has been added to simplify calls to the OpenAI API. This function mirrors the signature of the OpenAI SDK function and can be used internally or for testing purposes.
6. Review the test suite in `tests/unit/` for current functionality, including tests covering usage messaging, individual flags (including the new count mode and OpenAI wrapper), and combined flag scenarios.
7. Examine the workflows in `.github/workflows/` to understand automated improvements.
8. Read through the [CONTRIBUTING.md](CONTRIBUTING.md) file to follow collaboration guidelines.
9. Execute `npm run start` to observe the CLI output. **Note:** In production, the program terminates automatically after displaying usage and demo output.
10. Run `npm test` to ensure that all tests pass.
11. Use the updated transformation logic and API wrappers as a baseline and suggest further enhancements if needed.
12. Identify areas for improvement in error messaging, interactive command suggestions, and flag conflict resolution.
13. Leverage automated tools and LLM feedback to propose one enhancement at a time.
14. Validate changes by running the full test suite and build scripts.
15. Update documentation as new features are added or existing behavior evolves.
16. Create a feature branch and submit a pull request with your improvements.
17. Engage with automated workflows that test and merge your contributions.
18. Monitor CI/CD pipelines for further iterative suggestions.
19. Continuously refine the repository with automation and LLM-driven updates.
20. Enjoy the evolution, one automated update at a time.

## Future Features

- Enhanced CLI argument parsing with conflict detection and suggestion capabilities.
- Improved error messaging and logging for clearer user guidance.
- Interactive command suggestions to assist in flag usage.
- Extended automated tests covering additional edge cases.
- Integration of advanced GitHub Actions workflows for deeper automation.
- **Upcoming Feature:** Real-time validation of flag combinations and immediate user feedback.
- **Upcoming Feature:** Interactive prompt mode for enhanced user experience.
- **Upcoming Feature:** Additional flag functionalities to further enhance text transformation, such as the recently added duplicate and count functionalities.
- Continued improvements based on community feedback and automated suggestions.

---
---

## New Feature

- **openaiChatCompletions Wrapper:** A new function that exports a simple wrapper around the OpenAI SDK's chat completion API. It has the same signature as the underlying function and allows for easier mocking and testing of API calls.

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
  This file showcases experimental features and serves as a testbed for integrating new ideas into the system. The newly added openaiChatCompletions function is part of these evolving features.
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
along with this program. If not, see <https://www.gnu.org/licenses/>

IMPORTANT: Any derived work must include the following attribution:
"This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
```

---
---
