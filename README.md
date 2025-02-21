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

These functions abstract the creation and management of “tasks” (generalized work items) that underlie many of the automated workflows.

#### `createTask(options)`
Creates a new task in the system.

**Parameters:**
- `options` (Object):
    - `title` (string): The task title.
    - `description` (string): Detailed description of the task.
    - `target` (string): An asset reference (e.g., a source file path).

**Returns:**  
`Promise<Object>` with the created task details.

**Usage:**
```js
const task = await createTask({
  title: 'House Choice Improvement',
  description: 'Make a small improvement to the source file.',
  target: 'src/lib/main.js'
});
```

---

#### `selectTask(criteria)`
Selects an existing task based on specified criteria (such as a label or ID).

**Parameters:**
- `criteria` (Object):
    - `label` (string): Filter tasks by a specific label (e.g., `'automated'`).
    - `taskId` (string, optional): A specific task identifier.

**Returns:**  
`Promise<Object>` with the selected task details.

**Usage:**
```js
const selectedTask = await selectTask({ label: 'automated' });
```

---

#### `startTask(taskOptions)`
Initiates work on a given task by setting up its working environment.

**Parameters:**
- `taskOptions` (Object):
    - `taskId` (string): Identifier of the task to start.
    - `target` (string): Asset reference for the task.
    - `testFile` (string): Path to the test file used for validation.

**Returns:**  
`Promise<Object>` with the status of the task initiation.

**Usage:**
```js
const startResult = await startTask({
  taskId: '123',
  target: 'src/lib/main.js',
  testFile: 'tests/unit/main.test.js'
});
```

---

#### `createPullRequest(options)`
Creates a pull request that corresponds to a task, preparing it for integration.

**Parameters:**
- `options` (Object):
    - `branch` (string): The branch name associated with the task.
    - `baseBranch` (string): The branch to merge into (usually `'main'`).
    - `commitMessage` (string): Commit message describing the change.
    - `label` (string): A label to indicate properties like automerge (e.g., `'automerge'`).

**Returns:**  
`Promise<Object>` with details about the pull request.

**Usage:**
```js
const pr = await createPullRequest({
  branch: 'task-123',
  baseBranch: 'main',
  commitMessage: 'Fix for task 123',
  label: 'automerge'
});
```

---

#### `automergePullRequest(options)`
Automatically merges a pull request if it meets the merge conditions.

**Parameters:**
- `options` (Object):
    - `pullNumber` (number|string): Identifier of the pull request.

**Returns:**  
`Promise<Object>` with the merge result.

**Usage:**
```js
const mergeResult = await automergePullRequest({ pullNumber: '123' });
```

---

### Dependency Updates

#### `updateDependencies(options)`
Updates project dependencies based on the specified upgrade target.

**Parameters:**
- `options` (Object):
    - `upgradeTarget` (string, default: `'patch'`): Update type (e.g., patch, minor, major).
    - `branch` (string, default: `'apply-update'`): The branch to perform the update on.
    - `commitMessage` (string): Commit message for the update.

**Returns:**  
`Promise<Object>` with the update status.

**Usage:**
```js
const updateStatus = await updateDependencies({
  upgradeTarget: 'minor',
  branch: 'apply-update',
  commitMessage: 'chore: dependency updates'
});
```

---

### Code Formatting

#### `formatCode(options)`
Runs code formatting and linting tasks to maintain code quality.

**Parameters:**
- `options` (Object):
    - `script` (string): Command to run formatting and linting (e.g., `'npm run formatting-fix && npm run linting-fix'`).
    - `branch` (string, default: `'apply-formatting'`): The branch for the formatting changes.
    - `commitMessage` (string): Commit message for the formatting update.

**Returns:**  
`Promise<Object>` with the results of the formatting operation.

**Usage:**
```js
const formatResult = await formatCode({
  script: 'npm run formatting-fix && npm run linting-fix',
  branch: 'apply-formatting',
  commitMessage: 'chore: formatting and linting fixes'
});
```

---

### OpenAI Utilities

These functions help integrate OpenAI-powered operations into your workflow.

#### `openaiGenerate(options)`
Generates code suggestions, improvements, or content based on a given prompt using the OpenAI API.

**Parameters:**
- `options` (Object):
    - `prompt` (string): The prompt to send to the OpenAI API.
    - `model` (string, optional): The OpenAI model to use (default may be set internally, e.g., `gpt-3.5-turbo`).

**Returns:**  
`Promise<string>` containing the generated suggestion or content.

**Usage:**
```js
const suggestion = await openaiGenerate({
  prompt: "Suggest improvements for error handling in this code snippet: function foo() { /* ... */ }"
});
console.log(suggestion);
```

---

### Generic Workflow Runner

#### `runWorkflow(name, options)`
Executes a specified workflow by name using provided options. This function is a generic wrapper around workflow operations.

**Parameters:**
- `name` (string): The name of the workflow (e.g., `'publish'`, `'update'`).
- `options` (Object): Workflow-specific options.

**Returns:**  
`Promise<Object>` with the workflow execution result.

**Usage:**
```js
const result = await runWorkflow('publish', {
  versionIncrement: 'minor',
  buildScript: 'npm run build'
});
```

---

## CLI Usage

In addition to the programmatic API, the SDK provides a command-line interface (CLI) to perform common operations.

### Installation

The CLI tool is installed along with the SDK. Use it via npx:

```bash
npx agentic-lib [command] [options]
```

### Available Commands

- **self-test**  
  Runs the self-test suite to verify the system.  
  _Example:_
  ```bash
  npx agentic-lib self-test
  ```

- **demo**  
  Executes a demonstration of the core functionalities.  
  _Example:_
  ```bash
  npx agentic-lib demo
  ```

- **publish**  
  Publishes packages with the given version increment and build script.  
  _Example:_
  ```bash
  npx agentic-lib publish --versionIncrement minor --buildScript "npm run build"
  ```

- **test**  
  Runs the test suites.  
  _Example:_
  ```bash
  npx agentic-lib test
  ```

- **create-task**  
  Creates a new task.  
  _Example:_
  ```bash
  npx agentic-lib create-task --title "New Task" --description "Task description" --target "src/lib/main.js"
  ```

- **update**  
  Updates dependencies according to the specified upgrade target.  
  _Example:_
  ```bash
  npx agentic-lib update --upgradeTarget patch
  ```

- **format**  
  Runs code formatting and linting tasks.  
  _Example:_
  ```bash
  npx agentic-lib format --script "npm run formatting-fix && npm run linting-fix"
  ```

### Default Mode

If no command is provided, the CLI defaults to running a self-test followed by a demo, and then it displays the usage instructions:

```bash
npx agentic-lib
```

---

## Resource Types & Concepts

- **Task:**  
  A generic work item (akin to an issue) representing a unit of work or improvement.

- **Workflow:**  
  A series of automated operations (publishing, testing, formatting, etc.) encapsulated within the SDK.

- **Update:**  
  A dependency update operation that manages package version changes.

- **Formatting:**  
  An operation to enforce code style and linting standards.

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

This project is licensed under the GNU General Public License (GPL). See [LICENSE](LICENSE) for details.
```