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

---

## Overview

The agentic-lib provides utility functions and a command line interface (CLI) that are designed for use in automated GitHub workflows, as well as within general JavaScript applications. Core functionalities include:

- **Text Processing Functions**: `simpleEcho` and `simpleReverse`, which trim input strings, log operations, and either greet or reverse the input.
- **Logging & Configuration**: Centralized logging via `logInfo` and `logError`, and configuration via environment variables managed by dotenv.
- **CLI Interface**: A CLI that processes flags such as `--help`, `--version`, and `--digest` to facilitate common operations like displaying help, showing version information, or simulating an AWS SQS digest event.

## Installation

Ensure you have Node.js (>=20) installed. Install the dependencies using:

```bash
npm install
```

## Usage

### As a Library

Import the functions into your project:

```js
import { simpleEcho, simpleReverse } from './sandbox/source/simpleFunction.js';

const greeting = simpleEcho('  World  ');
console.log(greeting); // "Hello, World"

const reversed = simpleReverse('  Hello  ');
console.log(reversed); // "olleH"
```

Refer to the [simpleFunction documentation](./docs/simpleFunction.md) for more detailed examples and error handling instructions.

### Command Line Interface (CLI)

The CLI is defined in `src/lib/main.js` and supports the following commands:

- **--help**: Displays usage instructions.
- **--version**: Outputs the current version along with a timestamp.
- **--digest**: Simulates an AWS SQS event using a predefined digest. 

Run the CLI using:

```bash
node src/lib/main.js --help
# or
node src/lib/main.js --version
# or
node src/lib/main.js --digest
```

If no command argument is supplied, the CLI displays the usage instructions.

## Testing

Run tests using:

```bash
npm test
```

This will execute unit tests for both the utility functions and the CLI interface.

## Configuration

Configuration is managed via environment variables, typically loaded from a `.env` file using the dotenv package. For example, you can set:

- `GITHUB_API_BASE_URL`
- `OPENAI_API_KEY`

These are logged during initialization to confirm the configuration. Adjust the environment for development or testing as needed.

---

This README will evolve as the project grows, but the core functionality and CLI usage described here reflect the current state of the codebase.