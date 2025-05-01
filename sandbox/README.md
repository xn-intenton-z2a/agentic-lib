START_OF_README_BEGINNING

# intentïon agentic-lib

You probably want to start with the workflow documentation here: [WORKFLOWS-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/WORKFLOWS-README.md)

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.

[Start using the Repository Template](https://github.com/xn-intenton-z2a/repository0)

[Also on GitHub Pages](https://xn-intenton-z2a.github.io/agentic-lib/index.html)

[See the latest repository stats](https://xn-intenton-z2a.github.io/agentic-lib/latest.html)

Mixed licensing:
* This project is licensed under the GNU General Public License (GPL).
* This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
* This file is licensed under the MIT License. For details, see LICENSE-MIT

This README file will evolve as the test experiment within this repository evolves but the above links remain stable.

END_OF_README_BEGINNING

---

## Overview

The `agentic-lib` provides a set of utilities including configuration logging, AWS SQS event simulation, and a flexible CLI for invoking various operations. It is designed to be integrated within GitHub Actions and as part of automated workflows to support autonomous code evolution.

## Key Features

- **Configuration Logging**: Logs configuration details (GITHUB_API_BASE_URL, OPENAI_API_KEY) upon initialization.
- **AWS SQS Event Handling**: Includes a handler to process SQS events and simulate AWS Lambda invocations.
- **Command Line Interface (CLI)**: Support for flags such as `--help`, `--version`, and `--digest` for quick access to usage information and functionality.

## CLI Usage

The CLI provides multiple commands that can be accessed via `node src/lib/main.js` or using the npm start script. Here are some common examples:

- **Help**: Display help information.

  ```sh
  npm run start -- --help
  ```

- **Version**: Display version information along with a timestamp.

  ```sh
  npm run start -- --version
  ```

- **Digest**: Simulate an SQS event for testing the digestLambdaHandler functionality.

  ```sh
  npm run start -- --digest
  ```

If no command argument is supplied, the program will display the usage instructions.

## Configuration

The configuration is loaded from environment variables or a `.env` file using the `dotenv` package. It validates the configuration using `zod` and logs the settings at startup.

## Testing

The repository includes unit tests using Vitest. These tests ensure the integrity of the CLI commands and the AWS SQS processing.

## Contributing

Please refer to [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on how to contribute to this project. Contributions should follow our standards for code quality, testing, and documentation.

## Additional Documentation

For detailed usage examples and more information on CLI commands and configuration, please see the [USAGE documentation](docs/USAGE.md).
