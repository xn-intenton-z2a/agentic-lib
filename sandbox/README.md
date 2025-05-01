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

- **Configuration Logging**: Logs configuration details (GITHUB_API_BASE_URL, OPENAI_API_KEY) upon initialization using [dotenv](https://github.com/motdotla/dotenv) and validates them via [zod](https://github.com/colinhacks/zod).
- **AWS SQS Event Handling**: Includes a handler to process SQS events and simulate AWS Lambda invocations.
- **Command Line Interface (CLI)**: Support for flags such as `--help`, `--version`, and `--digest` for quick access to usage information and functionality. All output logs are formatted in JSON for easy parsing and integration with logging systems.

## CLI Usage

The CLI can be accessed via:

- **Help**: Display help information.

  ```sh
  npm run start -- --help
  ```

- **Version**: Display version information along with the current timestamp.

  ```sh
  npm run start -- --version
  ```

- **Digest**: Simulate an SQS event for testing the digestLambdaHandler functionality.

  ```sh
  npm run start -- --digest
  ```

If no command argument is supplied, the application displays usage instructions and exits. This behavior ensures that users are always aware of the available commands.

## Configuration

Configuration settings are loaded from environment variables or a `.env` file using [dotenv](https://github.com/motdotla/dotenv). The settings are validated with [zod](https://github.com/colinhacks/zod) to ensure that the necessary environment variables such as `GITHUB_API_BASE_URL` and `OPENAI_API_KEY` are correctly set. On startup, the configuration is logged in JSON format, providing transparency into the runtime settings.

## Logging

All log entries are output in JSON format which makes it easier to integrate with log aggregation and monitoring systems. The logs include a timestamp, log level, and descriptive messages to assist in debugging and monitoring.

## Testing

The repository includes unit tests managed by Vitest. These tests cover core functionality such as CLI commands and AWS SQS event handling. To run the tests, execute:

```sh
npm test
```

## Contributing

Please refer to [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on how to contribute to this project. Contributions should follow our standards for code quality, testing, and documentation.

## Additional Documentation

For detailed usage examples and further information on the CLI commands and configuration, please see the [USAGE documentation](docs/USAGE.md).
