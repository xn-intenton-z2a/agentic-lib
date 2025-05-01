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

---

## Overview

agentic-lib is a JavaScript library designed to power autonomous GitHub workflows. It offers a command-line interface (CLI) that supports:

- Displaying help instructions (--help)
- Simulating an SQS event digest (--digest) to trigger AWS Lambda based processing
- Showing version information (--version)

It also provides utility functions for logging configuration and errors, and integrates with AWS services such as SQS. Configuration is managed via environment variables and dotenv support, facilitating usage in both development and production environments.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the CLI:
   ```bash
   node src/lib/main.js --help
   ```

3. To simulate a digest event:
   ```bash
   node src/lib/main.js --digest
   ```

4. To view version information:
   ```bash
   node src/lib/main.js --version
   ```

## Usage in Workflows

agentic-lib is meant to be integrated into GitHub Actions workflows alongside other agentic workflows. Refer to [WORKFLOWS-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/WORKFLOWS-README.md) for more details on workflow integration.

## Logging and Debugging

The library logs its configuration upon initialization and provides utilities to log both informational messages and errors. Key functions include:

- `logConfig`: Logs the loaded configuration.
- `logInfo`: Logs informational messages.
- `logError`: Logs errors, including stack traces when verbose mode is active.

## Environment Configuration

The library uses the dotenv package to load environment variables from a .env file. In test and development environments, default values for `GITHUB_API_BASE_URL` and `OPENAI_API_KEY` are applied.

## Testing

The project uses Vitest for testing. To run the test suite, execute:

```bash
npm test
```

## Contributing

Please refer to [CONTRIBUTING.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/CONTRIBUTING.md) for guidelines on contributing to this project.

## License

This project is licensed under dual licenses: GPL and MIT.
