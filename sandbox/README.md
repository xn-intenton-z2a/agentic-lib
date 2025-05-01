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

## Overview

**agentic-lib** is a JavaScript library built to support autonomous GitHub Actions workflows. It provides a set of CLI commands and utility functions to process SQS events, log configuration details, and generate digest events. This library is designed to work with Node 20 and adheres to ECMAScript Module (ESM) standards.

## Installation

Ensure you have Node.js >= 20 installed. Then install the necessary dependencies using:

```bash
npm install
```

## Usage

You can interact with the library through its CLI. Here are the available commands:

- `--help`: Display help message and usage instructions.
- `--version`: Show version information along with the current timestamp.
- `--digest`: Simulate processing of an SQS event containing a digest message.

### Examples

Display help:

```bash
npm run start -- --help
```

Check version:

```bash
npm run start -- --version
```

Simulate a digest event:

```bash
npm run start -- --digest
```

## API Reference

The main file `src/lib/main.js` exports several functions:

- `logConfig()`: Logs the current configuration loaded from environment variables.
- `logInfo(message)`: Logs informational messages to the console.
- `logError(message, error)`: Logs error messages along with error details.
- `createSQSEventFromDigest(digest)`: Utility to create a simulated SQS event from a given digest payload.
- `digestLambdaHandler(sqsEvent)`: Processes an SQS event, logging individual digest records and returning any failures for reprocessing.
- `main(args)`: The CLI entry point that parses command-line arguments and triggers the appropriate actions.

## Configuration

Configuration is managed via environment variables. The library supports loading settings from a `.env` file using `dotenv`. Typical configurations include:

- `GITHUB_API_BASE_URL`: Base URL for GitHub API calls.
- `OPENAI_API_KEY`: API key for OpenAI, used in testing scenarios.

In development or test environments, default values are provided for these settings.

## Contributing

Please refer to [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on how to contribute.

## License

This project is dual-licensed under the GNU General Public License (GPL) and the MIT License. See the respective license files for details.
