# agentic‑lib

This document outlines our guidelines for human and automated contributions, ensuring that our core library remains 
robust, testable, and efficient in powering our reusable GitHub Workflows.

## How to Contribute

The guidelines below apply to human or automated contributions:

1. **Report Issues or Ideas:**
    - Open an issue on GitHub to share bug reports, feature requests, or any improvements you envision.
    - Clear descriptions and reproducible steps are highly appreciated.

2. **Submit Pull Requests:**
    - Fork the repository and create a feature branch.
    - Implement your changes, ensuring you follow the existing coding style and standards.
    - Add tests to cover any new functionality.
    - Update documentation if your changes affect usage or workflow behavior.
    - Submit your pull request for review.

## Guidelines

- **Code Quality:**
    - Ensure there are tests that cover your changes and any likely new cases they introduce.
    - When making a change remain consistent with the existing code style and structure.
    - When adding new functionality, consider if some unused or superseded code should be removed.

- **Compatibility:**
    - Ensure your code runs on Node 20 and adheres to ECMAScript Module (ESM) standards.
    - Tests use vitest and competing test frameworks should not be added.
    - Mocks in tests must not interfere with other tests.

- **Testing:**
    - The command `npm test` should invoke the tests added for the new functionality (and pass).
    - If you add new functionality, ensure it is covered by tests.

- **Documentation:**
    - When making a change to the main source file, review the readme to see if it needs to be updated and if so, update it.
    - Where the source exports a function, consider that part of the API of the library and document it in the readme.
    - Where the source stands-up an HTTP endpoint, consider that part of the API of the library and document it in the readme.
    - Include usage examples including inline code usage and CLI and HTTP invocation, API references.

- **README:**
    - Ensure README.md begins like this:

START_OF_README_BEGINNING

# intentïon agentic-lib

You probably want to start with the workflow documentation here: [WORKFLOWS-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/WORKFLOWS-README.md)

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your
repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and
issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using
GitHub’s `workflow_call` event, so they can be composed together like an SDK.

[Start using the Repository Template](https://github.com/xn-intenton-z2a/repository0)

[Also on GitHub Pages](https://xn-intenton-z2a.github.io/agentic-lib/index.html)

[See the latest repository stats](https://xn-intenton-z2a.github.io/agentic-lib/latest.html)

Mixed licensing:
* This project is licensed under the GNU General Public License (GPL).
* This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
* This file is licensed under the MIT License. For details, see LICENSE-MIT

This README file will evolve as the test experiment within this repository evolves but the above links remain stable.

END_OF_README_BEGINNING
