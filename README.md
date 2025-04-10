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
  This file implements the Re‑usable Workflows above as a JavaScript module, enabling programmatic access to the core functionality.
- **Stability:**  
  It is under active development and may change frequently. It represents bleeding‑edge functionality that might not yet be production‑ready.
- **Licensing:**  
  As part of the core project, it is under GPL‑3 with the attribution clause.
- **Location:**  
  The code is located in `src/lib/main.js`.

---

## Agentic Library Functions

A new set of agentic library functions have been implemented to enable autonomous workflow invocation. The primary function, `agenticHandler`, processes a JSON payload containing a command. It validates the input, logs the command using the existing logging mechanisms, and returns a processed response. This function can be invoked directly via the CLI using the `--agentic` flag followed by a JSON payload, e.g.,

```
node src/lib/main.js --agentic '{"command": "doSomething"}'
```

The `agenticHandler` function is designed to seamlessly integrate with our AWS SQS, OpenAI, and logging infrastructure, and provides a foundation for future autonomous workflow interactions.

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
  - Processes an agentic command by passing a JSON payload to `agenticHandler`.
- **--verbose:**
  - Activates detailed logging for debugging purposes.
- **--diagnostics:**
  - Outputs an in-depth diagnostic report, including the current configuration, Node.js version, and relevant environment variables.

### CLI Sample Outputs

Below are sample outputs obtained from dry runs of the CLI commands:

1. Running with no arguments:

```
{"level":"info","timestamp":"2025-04-10T12:26:52.533Z","message":"Configuration loaded","config":{}}
No command argument supplied.

      Usage:
      --help                     Show this help message (default)
      --digest                   Run full bucket replay
      --agentic <jsonPayload>    Process an agentic command with a JSON payload
      --verbose                  Enable verbose logging
      --diagnostics              Output detailed diagnostic information
```

2. Running with the `--help` flag:

```
      Usage:
      --help                     Show this help message (default)
      --digest                   Run full bucket replay
      --agentic <jsonPayload>    Process an agentic command with a JSON payload
      --verbose                  Enable verbose logging
      --diagnostics              Output detailed diagnostic information
```

3. Running with the `--verbose` flag (sample output includes verbose activation message):

```
{"level":"info","timestamp":"2025-04-10T12:26:52.533Z","message":"Configuration loaded","config":{}}
{"level":"info","timestamp":"2025-04-10T12:26:52.540Z","message":"Verbose mode activated.","verbose":true}
No command argument supplied.

      Usage:
      --help                     Show this help message (default)
      --digest                   Run full bucket replay
      --agentic <jsonPayload>    Process an agentic command with a JSON payload
      --verbose                  Enable verbose logging
      --diagnostics              Output detailed diagnostic information
```

4. Running with the `--digest` flag:

```
{"level":"info","timestamp":"2025-04-10T12:26:52.533Z","message":"Configuration loaded","config":{}}
{"level":"info","timestamp":"2025-04-10T12:26:52.540Z","message":"Digest Lambda received event: {\"Records\":[{\"eventVersion\":\"2.0\",\"eventSource\":\"aws:sqs\",\"eventTime\":\"2025-04-10T12:26:52.540Z\",\"eventName\":\"SendMessage\",\"body\":\"{\\\"key\\\":\\\"events/1.json\\\",\\\"value\\\":\\\"12345\\\",\\\"lastModified\\\":\\\"2025-04-10T12:26:52.540Z\\\"}\"}]}
```

5. Running with the `--agentic` flag:

```
{"level":"info","timestamp":"2025-04-10T12:26:52.533Z","message":"Configuration loaded","config":{}}
{"level":"info","timestamp":"2025-04-10T12:26:52.600Z","message":"Agentic Handler: processing command doSomething"}
{"status":"success","processedCommand":"doSomething","timestamp":"2025-04-10T12:26:52.600Z"}
```

6. Running with the `--diagnostics` flag:

```
{"level":"info","timestamp":"2025-04-10T12:26:52.533Z","message":"Configuration loaded","config":{}}
{"level":"info","timestamp":"2025-04-10T12:26:52.545Z","message":"Diagnostics Mode: {\"config\":{},\"nodeVersion\":\"v20.x.x\",\"env\":{\"GITHUB_API_BASE_URL\":\"https://api.github.com.test/\",\"OPENAI_API_KEY\":\"key-test\",\"NODE_ENV\":null,\"VITEST\":null},\"timestamp\":\"2025-04-10T12:26:52.545Z\"}"
```

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