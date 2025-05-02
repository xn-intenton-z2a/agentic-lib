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

agentic-lib provides a CLI interface and AWS Lambda handler utilities to support event-driven workflows. 
It includes functions to log configuration, process SQS digest events, and provide helpful CLI instructions.

### Key Features:

- Environment based configuration: Reads from .env and environment variables.
- Logging: Structured logging of info and error messages.
- AWS Lambda Handler: Processes SQS events with robust error logging.
- CLI Helpers: Includes `--help`, `--version`, and `--digest` commands.

## Installation

Ensure you have Node.js (>=20.0.0) installed and then install the package dependencies:

    npm install

## Usage

### CLI

You can invoke the library via the command line to perform tasks:

- Display usage instructions:
  
      node src/lib/main.js --help

- Display version information:

      node src/lib/main.js --version

- Simulate processing an SQS digest event:

      node src/lib/main.js --digest

### Programmatic Usage

The library exports several functions that can be used programmatically:

- logConfig(): Logs the current configuration.
- digestLambdaHandler(sqsEvent): Processes an SQS event and logs any errors.
- main(args): Main function to process CLI arguments.

Example:

    import { main, logConfig } from './src/lib/main.js';

    // Log configuration details
    logConfig();

    // Run the CLI main function with arguments
    main(['--help']);

## Configuration

Configuration is loaded from the environment using the `dotenv` package. 
The expected environment variables include:

- GITHUB_API_BASE_URL: The API base URL for GitHub.
- OPENAI_API_KEY: API key for accessing OpenAI services.

## Testing

Tests are written using Vitest. To run the tests, execute:

    npm test

## Contributing

Please refer to [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on contributing and coding standards.

## License

This project is licensed under the GNU General Public License (GPL) and the MIT License.
