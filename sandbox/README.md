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

This README serves as the primary guide to using agentic-lib. The library consists of CLI utilities and AWS Lambda functions primarily used to simulate AWS SQS events for testing workflows. It reads configuration from .env files and environment variables. Additional operational functionality is provided via a set of reusable functions documented below.

END_OF_README_BEGINNING

## Features

- CLI support with flags:
  - `--help`: Display usage instructions.
  - `--version`: Output version information including a timestamp.
  - `--digest`: Simulate an SQS event processing a digest message.
- Environment configuration handled via dotenv with default test values in development mode.
- AWS SQS event simulation for Lambda functions with robust JSON logging.

## Getting Started

1. Install dependencies:
   npm install

2. Run the CLI:
   npm run start

   Available options:
   - Use `--help` for usage instructions.
   - Use `--version` for version details.
   - Use `--digest` to simulate SQS event processing.

## Configuration

The application uses environment variables for configuration. In development or test mode, default values are provided:
- GITHUB_API_BASE_URL (default: https://api.github.com.test/)
- OPENAI_API_KEY (default: key-test)

Create a `.env` file if custom configuration is required.

## Testing

Run tests with:

  npm test

## How It Works

The main entry point is `src/lib/main.js`, which handles environment configuration, logging, and CLI flag processing to trigger functionality such as SQS event simulation. Logs are output in JSON format for clarity and ease of debugging.

## Contributing

Please review [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on reporting issues, contributing code, and updating documentation.