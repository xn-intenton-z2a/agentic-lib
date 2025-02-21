# agentic-lib Agentic Coding Systems SDK

You probably want to start with the workflow documentation here: [WORKFLOWS-README.md](WORKFLOWS-README.md)

Agentic Coding Systems SDK is a modern JavaScript library (ESM, Node.js v20+) that encapsulates the operations behind automated coding workflows. It abstracts complex processes—such as publishing packages, running tests, managing tasks, updating dependencies, automerging pull requests, and formatting code—into a unified API that treats work items as generic "tasks" rather than platform-specific issues. In addition, it provides utilities to interface with the OpenAI API for tasks such as generating code suggestions, reviewing changes, and automating code reviews.

This project is licensed under the GNU General Public License (GPL).

## Installation

Install the SDK via npm:

```bash
npm install agentic-lib
```

## Quick Start

Below is an example that runs a self-test, demonstrates the SDK functionalities (including an OpenAI demo), and then performs a publishing operation:

```js
import { runSelfTest, demo, publishPackages, openaiGenerate } from 'agentic-lib';

(async () => {
  // Run self-test to validate internal operations
  await runSelfTest();

  // Run demo to showcase core functionalities
  await demo();

  // Example: Use OpenAI to generate a code suggestion for improvement
  const suggestion = await openaiGenerate({
    prompt: "Suggest improvements for error handling in this code snippet: function foo() { /* ... */ }"
  });
  console.log('OpenAI suggestion:', suggestion);

  // Example: Publish packages with a minor version increment
  const publishResult = await publishPackages({
    versionIncrement: 'minor',
    buildScript: 'npm run build'
  });
  console.log('Publish result:', publishResult);
})();
```

## Exposed CLI Functions

The CLI provided via `node src/lib/main.js` exports several helper functions which can be imported directly for integration or testing purposes:

- `getUsageMessage`: Returns the full usage message string.
- `displayUsage`: Prints the usage message to the console.
- `selfTestCommand`: Runs the self-test command.
- `demoCommand`: Runs the demo command.
- `processCommand`: Processes a given command and arguments.

These exports enable improved test coverage and integration into larger automated workflows.

## API Documentation

The SDK is organized into several modules, each responsible for a different aspect of the agentic coding system. All functions return Promises and are designed to be used with async/await.

---

### General Utilities

#### `runSelfTest(options?)`
Runs an internal self-test to validate the SDK’s operations.

**Usage:**
```js
await runSelfTest();
```

---

#### `demo(options?)`
Executes a demonstration of core SDK functionalities.

**Usage:**
```js
await demo();
```

---

### Publishing

#### `publishPackages(options)`
Publishes packages using a configured build script and semantic versioning update.

**Parameters:**
- `options` (Object):
    - `versionIncrement` (string, default: `'prerelease'`): The semantic version segment to increment.
    - `buildScript` (string): Command used to build the package.

**Returns:**  
`Promise<Object>` with details about the publish operation.

**Usage:**
```js
const result = await publishPackages({
  versionIncrement: 'minor',
  buildScript: 'npm run build'
});
```

---

### Testing

#### `runTests(options)`
Executes the test suites with optional coverage.

**Parameters:**
- `options` (Object):
    - `testScript` (string, default: `'npm test'`): Command to run tests.

**Returns:**  
`Promise<Object>` with the test results.

**Usage:**
```js
const testResults = await runTests({ testScript: 'npm test' });
```

---

### Task Management

*... [Additional API documentation remains unchanged]*

---

## CLI Usage

In addition to the programmatic API, the SDK provides a command-line interface (CLI) to perform common operations.

### Installation

The CLI tool is installed along with the SDK. Use it via npx:

```bash
npx agentic-cli [command] [options]
```

### Available Commands

- **self-test**  
  Runs the self-test suite to verify the system.  
  _Example:_
  ```bash
  npx agentic-cli self-test
  ```

- **demo**  
  Executes a demonstration of the core functionalities.  
  _Example:_
  ```bash
  npx agentic-cli demo
  ```

- **publish**  
  Publishes packages with the given version increment and build script.  
  _Example:_
  ```bash
  npx agentic-cli publish --versionIncrement minor --buildScript "npm run build"
  ```

- **test**  
  Runs the test suites.  
  _Example:_
  ```bash
  npx agentic-cli test
  ```

- **create-task**  
  Creates a new task.  
  _Example:_
  ```bash
  npx agentic-cli create-task --title "New Task" --description "Task description" --target "src/lib/main.js"
  ```

- **update**  
  Updates dependencies according to the specified upgrade target.  
  _Example:_
  ```bash
  npx agentic-cli update --upgradeTarget patch
  ```

- **format**  
  Runs code formatting and linting tasks.  
  _Example:_
  ```bash
  npx agentic-cli format --script "npm run formatting-fix && npm run linting-fix"
  ```

### Default Mode

If no command is provided, the CLI defaults to running a self-test followed by a demo, and then it displays the usage instructions:

```bash
npx agentic-cli
```

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

This project is licensed under the GNU General Public License (GPL). See [LICENSE](LICENSE) for details.

---

## Next Up

We have several exciting enhancements planned for future releases:

- Implement a more comprehensive self-test suite with additional validation steps.
- Expand the demo functionality to include real-world use cases and integrations, such as connecting with the OpenAI API.
- Introduce new CLI commands for advanced operations like publishing, task management, and dependency updates.
- Improve error handling and logging for a better developer experience.
- Refactor parts of the code to incorporate popular libraries and practices for enhanced performance and maintainability.

Stay tuned for these improvements and more as we continue to evolve the project!
