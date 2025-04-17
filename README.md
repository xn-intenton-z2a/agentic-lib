# intentïon agentic-lib

You probably want to start with the workflow documentation here: [WORKFLOWS-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/WORKFLOWS-README.md)

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your
repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and
issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using
GitHub’s `workflow_call` event, so they can be composed together like an SDK.

[Start using the Repository Template](https://github.com/xn-intenton-z2a/repository0)

[Repository Library](https://xn-intenton-z2a.github.io/agentic-lib/library-index.html)

[Also on GitHub Pages](https://xn-intenton-z2a.github.io/agentic-lib/index.html)

Mixed licensing:
* This project is licensed under the GNU General Public License (GPL).
* This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
* This file is licensed under the MIT License. For details, see LICENSE-MIT

This README file will evolve as the test experiment within this repository evolves.

---

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

### 3. The Evolving main.js (JavaScript re‑implementation of Re‑usable Workflows)
- **Purpose:**  
  This file implements the Re‑usable Workflows above as a JavaScript module, enabling programmatic access to the core functionality. It now also tracks each successful invocation of the agentic command using an internal counter for improved observability.
- **Batch Processing:**
  The `agenticHandler` function supports batch processing by accepting a payload with a `commands` array. Each command is validated and processed sequentially. On success, each command is individually logged and the global invocation counter (`globalThis.callCount`) is incremented accordingly. The aggregated response contains a list of individual results.

  **Optional Batch Throttling:**
  You can limit the maximum number of commands processed in a batch by setting the environment variable `MAX_BATCH_COMMANDS`. When set, if the number of commands exceeds this limit, the batch will be rejected with an error message.

- **Execution Timing:**
  For enhanced performance insights, the response of `agenticHandler` now includes an `executionTimeMS` field for each command, indicating the processing time in milliseconds.

- **Note on Prompt Validity:**
  The agentic library expects actionable prompts. Non-actionable inputs such as 'NaN', empty strings, or improperly formatted commands are logged as errors and rejected. Inputs are processed by trimming whitespace and converting to lowercase. Therefore, even if the input appears in a different case or with extra spaces (e.g., ' NaN ', 'nan'), it will be considered non-actionable and will result in an error message explicitly stating that the input is non-actionable because it is equivalent to 'NaN'.
- **Stability:**  
  It is under active development and may change frequently. It represents bleeding‑edge functionality that might not yet be production‑ready.
- **Licensing:**  
  As part of the core project, it is under GPL‑3 with the attribution clause.
- **Location:**  
  The code is located in `src/lib/main.js`.

---

## Agentic Library Functions

A new set of agentic library functions have been implemented to enable autonomous workflow invocation. The primary function, `agenticHandler`, processes a JSON payload containing either a single command or a batch of commands. When using batch processing, supply a JSON payload with a `commands` array property. When a valid command is processed, the internal invocation counter is incremented and an `executionTimeMS` property indicates its processing time in milliseconds.

It can be invoked directly via the CLI using the `--agentic` flag followed by a JSON payload, e.g.,

```
node src/lib/main.js --agentic '{"command": "doSomething"}'
```

Or for batch processing:

```
node src/lib/main.js --agentic '{"commands": ["cmd1", "cmd2"]}'
```

A new CLI flag has been added for dry runs:

```
node src/lib/main.js --dry-run
```

Additionally, the CLI now supports additional commands:

- `--version`: Displays version information from package.json along with a timestamp.
- `--verbose`: Activates detailed logging for debugging purposes.
- `--diagnostics`: Outputs an in‑depth diagnostic report, including the current configuration, Node.js version, and relevant environment variables.
- `--status`: Outputs a runtime health summary in JSON format including configuration, Node.js version, callCount, uptime, and select environment variables.
- `--digest`: Initiates processing of a sample digest event.
- `--simulate-error`: Simulates an error scenario for testing purposes by immediately logging a simulated error and exiting with a non-zero status code.
- `--simulate-delay <ms>`: Delays execution for the specified number of milliseconds, simulating processing latency before executing further commands.
- `--apply-fix`: Applies automated fixes and logs a success message indicating "Applied fix successfully". Execution stops immediately after this action.
- `--cli-utils`: **NEW.** Displays a summary of all available CLI commands along with a brief description for each. This flag is intended to enhance the discoverability of CLI utilities.

---

## AWS Integrations

The agentic‑lib library leverages AWS services to enhance automation and reliability:

- **SQS Integration:**
  - The function `createSQSEventFromDigest` constructs a mock AWS SQS event from a given digest, formatting the payload to resemble a typical SQS message.
  - The `digestLambdaHandler` function processes incoming SQS events, gracefully handling JSON parsing errors and accumulating failed records. If a messageId is omitted, a fallback identifier is generated.
  - These integrations ensure that messages can be retried by AWS SQS in case of processing errors, thereby enhancing fault tolerance.

- **Logging:**
  - Detailed logging via `logInfo` and `logError` functions provides insight into the operations, including configurations and error stacks when verbose mode is enabled.

---

## CLI Behavior

The CLI provides several flags to manage the library's operation:

- **--help:**
  - Displays usage instructions and available command line flags.
- **--digest:**
  - Initiates the processing of a sample digest by creating a simulated SQS event and handling it through the AWS-integrated lambda handler.
- **--agentic:**
  - Processes an agentic command. Supply a payload with either a single `command` property or a `commands` array for batch processing. Each valid command increments the internal invocation counter and returns an `executionTimeMS` property indicating its processing time.
- **--version:**
  - Displays version information from package.json along with a timestamp in JSON format.
- **--verbose:**
  - Activates detailed logging for debugging purposes.
- **--diagnostics:**
  - Outputs an in‑depth diagnostic report, including the current configuration, Node.js version, and relevant environment variables.
- **--status:**
  - Outputs a runtime health summary in JSON format including configuration, Node.js version, callCount, uptime, and select environment variables.
- **--dry-run:**
  - Executes a dry run that simulates the command execution without performing any actions.
- **--simulate-error:**
  - Simulates an error scenario for testing purposes by immediately logging a simulated error and exiting with a non-zero status code.
- **--simulate-delay <ms>:**
  - Delays execution for the specified number of milliseconds, simulating processing latency before executing any further commands.
- **--apply-fix:**
  - Applies automated fixes and logs a success message.
- **--cli-utils:**
  - **NEW.** Displays a comprehensive summary of all CLI commands available along with brief descriptions. Use this flag to quickly view all command options.

---

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