# agentic‑lib

This document outlines our guidelines for human and automated contributions, ensuring that our core library remains 
robust, testable, and efficient in powering our reusable GitHub Workflows.

## How to Contribute

The guidelines below apply to human or automated contributions:

1. **Report Issues or Ideas:**
    - Open an issue on GitHub to share bug reports, feature requests, or any improvements you envision.
    - Clear descriptions and reproducible steps are highly appreciated.

2. **Submit Pull Requests:**
    - Implement your changes and push them to a new branch, ensuring you follow the 
      existing coding style and standards.
    - Add tests to cover any new functionality.
    - Update documentation if your changes affect usage or workflow behavior.
    - Submit your pull request for review.

## Guidelines

- **Features:**
    - Clear Objective & Scope: Define the feature with a concise description outlining its purpose, scope, and the specific problem it solves for the end user.
    - Value Proposition: Articulate the tangible benefits of the feature, including improved functionality, performance, or user experience.
    - Success Criteria & Requirements: List measurable success criteria and requirements, including performance benchmarks, usability standards, and stability expectations, to guide development and testing.
    - Testability & Stability: Ensure the feature can be verified through both automated tests and user acceptance criteria. Specify any necessary rollback or fail-safe mechanisms to maintain system stability.
    - Dependencies & Constraints: Identify any dependencies (external libraries, APIs, etc.), assumptions, and limitations that could impact feature delivery or future enhancements.
    - User Scenarios & Examples: Provide illustrative use cases or scenarios that demonstrate how the feature will be used in real-world situations, making it easier for both developers and stakeholders to understand its impact.
    - Verification & Acceptance: Define clear verification steps and acceptance criteria to ensure the feature meets its intended requirements. This should include detailed plans for unit tests, integration tests, manual user acceptance tests, and code reviews. Specify measurable outcomes that must be achieved for the feature to be considered successfully delivered and stable.

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

## Sandbox mode

Please note that the automation features of this repository are in sandbox mode. This means that
automated changes should only be applied to the sandbox paths which are shown below:
```yaml
paths:
  targetTestsPath:
    path: 'sandbox/tests/'
    permissions: [ 'write' ]
  targetSourcePath:
    path: 'sandbox/source/'
    permissions: [ 'write' ]
  documentationPath:
    path: 'sandbox/docs/'
    permissions: [ 'write' ]
  readmeFilepath:
    path: 'sandbox/README.md'
    permissions: [ 'write' ]
```
