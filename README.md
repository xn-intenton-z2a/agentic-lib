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

## Getting Started

Clone a seed repository which is pre-configured with the reusable workflows and scripts: https://github.com/xn-intenton-z2a/repository0

## Usage

This section applies to the test experiment within this repository.

To run the CLI tool and see help instructions:

```bash
npm run start--help
```

If the --help flag is provided, a help menu will be displayed with available options. Additionally, if no arguments are provided, the CLI defaults to running a self-test, then a demo, displays the usage instructions, and terminates automatically.

### Example Commands

- **Default Demo Output:**
  ```bash
  npm run start
  ```
  Running without arguments will print:
  ```
  Running self-test...
  Performing extended self-test validations...
  Running demo...
  Executing extended demo scenarios...
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
    - echo: Prints the provided text in uppercase.
    - stats: Displays system statistics including memory usage and uptime.
    - extended: Executes extended additional functionalities. (Now provides extra debug information for further enhancement.)

  Note: When no command is provided, the CLI runs a self-test, followed by a demo, then displays this usage message before terminating automatically.
  Note: Future enhancements include full publish functionality and additional automated features such as dependency updates, formatting, and linting improvements.
  ```

- **Echo Command:**
  ```bash
  node src/lib/main.js echo This is a test message
  ```
  Output:
  ```
  THIS IS A TEST MESSAGE
  ```

- **Stats Command:**
  ```bash
  node src/lib/main.js stats
  ```
  Output will include system statistics like memory usage and uptime.

- **Extended Command:**
  ```bash
  node src/lib/main.js extended
  ```
  Output:
  ```
  Running extended command...
  Extended functionality has been successfully executed.
  Additional debug: Extended command now includes extra information for further use.
  ```

## New Features
The CLI now fully supports the "echo", "stats", and "extended" commands. In addition to the commands described above, you can now use:
- **echo:** to print any provided text in uppercase.
- **stats:** to display current system statistics.
- **extended:** to execute additional extended demonstration functionalities, now enhanced with extra debug output.

## Future Roadmap

The following features are planned for future updates:
- Full implementation of the publish command beyond the current stub.
- Automated dependency updates to keep the project up-to-date.
- Enhanced formatting and linting automation to streamline code quality.
- Expansion of CLI commands with additional interactive functionalities.

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
