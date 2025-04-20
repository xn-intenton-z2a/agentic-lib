# GITHUB_ACTIONS

## Crawl Summary
The crawled content specifies comprehensive details for setting up GitHub Actions workflows including YAML syntax, event triggers, job configuration, matrix strategies, dependency caching, service containers, and runner labels. It includes exact YAML examples for defining workflows triggered on push events, job dependencies using 'needs', and advanced features like caching, secrets management, and containerized services.

## Normalised Extract
## Table of Contents
1. Workflows and YAML Basics
   - YAML file location: `.github/workflows`
   - Required keys: name, run-name, on, jobs
2. Event Triggers
   - Examples: push, pull_request, repository_dispatch, workflow_dispatch
3. Job Configuration
   - Defining jobs and steps
   - Using 'needs' for dependencies
4. Matrix Strategy
   - Example for testing Node.js versions
5. Caching Dependencies
   - Using actions/cache@v4 with key and restore-keys
6. Using Secrets and Environment Variables
   - Injecting secrets via `${{ secrets.SECRET_NAME }}`
7. Service Containers
   - Configuring container jobs including specifying an image and services
8. Runner Selection
   - Specifying runners by labels (e.g., self-hosted, linux, x64, gpu)
9. Advanced Troubleshooting
   - Viewing logs, re-running, and best practices

---

### 1. Workflows and YAML Basics
**Example:**
```yaml
name: GitHub Actions Demo
run-name: ${{ github.actor }} is testing out GitHub Actions 🚀
on: [push]
jobs:
  Explore-GitHub-Actions:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Triggered by ${{ github.event_name }} event"
      - name: Check out repository code
        uses: actions/checkout@v4
```

### 2. Event Triggers
Define events with the `on` key. For example:
```yaml
on:
  push:
    branches: [ main ]
  pull_request:
    types: [opened, synchronize]
```

### 3. Job Configuration
Jobs are collections of steps. For dependent execution use the `needs` keyword:
```yaml
jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - run: ./setup.sh
  build:
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - run: ./build.sh
```

### 4. Matrix Strategy
Define multiple runs with varying parameters:
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [12, 14, 16]
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
```

### 5. Caching Dependencies
Cache directories to speed up workflows:
```yaml
- name: Cache npm modules
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### 6. Using Secrets and Environment Variables
Inject secrets securely:
```yaml
- name: Use Secret
  env:
    API_KEY: ${{ secrets.API_KEY }}
  run: echo "API key is set"
```

### 7. Service Containers
Configure ephemeral service containers:
```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    container: node:20
    services:
      redis:
        image: redis
    steps:
      - run: npm test
```

### 8. Runner Selection
Specify runner labels to control execution environment:
```yaml
jobs:
  custom-runner:
    runs-on: [self-hosted, linux, x64]
    steps:
      - run: echo "Running on a custom runner"
```

### 9. Advanced Troubleshooting
- **Viewing Logs:** Use the GitHub Actions UI to expand step logs.
- **Re-running Workflows:** Use the Re-run button in the Actions tab.
- **Canceling Workflows:** Use the cancel workflow option in the UI.
- **Avoiding Recursive Triggers:** Use appropriate tokens (e.g., use a personal access token if triggering a workflow from another workflow).


## Supplementary Details
### Technical Specifications and Implementation Details

- **Workflow File Location:** All workflow YAML files must reside in the `.github/workflows` directory.
- **Mandatory YAML Keys:** `name`, `on`, `jobs`. Optionally, `run-name` can be used for custom naming per run.
- **Event Triggers:** Define events (e.g., push, pull_request). Use filters for branches and activity types as needed.
- **Job Dependencies:** Use `needs` to enforce job sequencing. Jobs without dependencies run in parallel.
- **Matrix Configuration:** Use the `strategy.matrix` section to run jobs with variable combinations; example: Node.js versions [14, 16].
- **Caching:** Use `actions/cache@v4` with explicit keys based on runner OS and dependency file hashes.
- **Secrets Management:** Secrets are referenced using `${{ secrets.SECRET_NAME }}` and injected as environment variables.
- **Service Containers:** Define containers under the `container` key and use the `services` key to start related service containers (e.g., postgres, redis).
- **Runner Constraints:** Specify exact runner labels in `runs-on` to target specific hardware or hosted environments.
- **Best Practices:** Always name steps, use comments for clarity, and ensure your YAML configuration is correctly indented. Use the GitHub Actions UI to view logs and troubleshoot errors.


## Reference Details
### API Specifications and Complete Code Examples

#### 1. GitHub Actions Workflow YAML Specification

- **name:** (string) The display name for the workflow.
- **run-name:** (string) Custom name injected per run using GitHub expressions.
- **on:** (array/object) Specifies the events that trigger the workflow. Examples:
  - `push`: Can include branch filters.
  - `pull_request`: Can specify activity types like opened, synchronized.
  - `workflow_dispatch`: Allows manual triggering with inputs.

- **jobs:** (object) A dictionary of job definitions. Each job includes:
  - **runs-on:** (string or array) The runner environment (e.g., `ubuntu-latest`, `[self-hosted, linux, x64]`).
  - **strategy:** (object, optional) For matrix builds. Contains `matrix` property with parameter array.
  - **steps:** (array) A list of step definitions. Each step can be:
    - **run:** (string) A command line to execute.
    - **uses:** (string) Reference to a GitHub Action (with version tag, e.g., `actions/checkout@v4`).
    - **env:** (object, optional) Environment variables mapping.

**Example Full Workflow:**
```yaml
name: GitHub Actions Demo
run-name: ${{ github.actor }} is testing out GitHub Actions 🚀
on: [push]
jobs:
  Explore-GitHub-Actions:
    runs-on: ubuntu-latest
    steps:
      - run: echo "🎉 Triggered by ${{ github.event_name }} event."
      - run: echo "🐧 Running on ${{ runner.os }}."
      - run: echo "Branch: ${{ github.ref }}, Repository: ${{ github.repository }}."
      - name: Check out code
        uses: actions/checkout@v4
      - run: echo "Repository cloned to runner."
      - name: List files
        run: |
          ls ${{ github.workspace }}
      - run: echo "Job status: ${{ job.status }}."
```

#### 2. SDK Method Signatures and Usage in Actions (Conceptual)

While GitHub Actions does not expose a traditional SDK API, actions are defined via YAML and executable code. For instance, an action written in JavaScript might export a function:

```javascript
const core = require('@actions/core');

function run() {
  try {
    const message = core.getInput('message', { required: true });
    console.log(`Message: ${message}`);
    core.setOutput('success', 'true');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
```

**Parameters:**
- `getInput(name: string, options?: { required: boolean }): string`
- `setOutput(name: string, value: string): void`
- `setFailed(message: string): void`

#### 3. Troubleshooting Procedures

- **Viewing Logs:** Use the GitHub Actions UI to inspect detailed logs for each step.
- **Re-run Workflow:** Click the "Re-run jobs" button in the Actions tab after a failure.
- **Cancel Workflow:** Use the "Cancel workflow" option if a job hangs.
- **Command-line Testing:** Locally test shell commands using the same environment variables, e.g.,
  ```bash
  echo "Testing GitHub Actions environment: $GITHUB_WORKSPACE"
  ls $GITHUB_WORKSPACE
  ```
- **Cache Verification:** Check cache key output for `actions/cache@v4` and verify file paths.

#### 4. Configuration Options and Their Effects

- **`runs-on`:** Specifies the OS; affects available pre-installed software.
- **`key` in cache:** Must be unique per OS and dependency state; affects cache hit rate.
- **`matrix` options:** Produce parallel jobs; ensure tests do not conflict.
- **Secrets configuration:** Must be set in repository settings; accessed via `${{ secrets.SECRET_NAME }}`.

Follow these detailed specifications to implement and troubleshoot GitHub Actions workflows effectively.


## Original Source
GitHub Actions Documentation
https://docs.github.com/en/actions

## Digest of GITHUB_ACTIONS

# GitHub Actions Documentation

**Retrieved on:** 2023-10-12

## Overview
GitHub Actions is a CI/CD platform that automates build, test, and deployment pipelines. Workflows are defined in YAML files stored under the `.github/workflows` directory in a repository.

## Workflow Structure
- **Workflow**: A configurable automated process defined in YAML with one or more jobs.
- **Events**: Trigger conditions such as `push`, `pull_request`, `repository_dispatch`, or scheduled events.
- **Jobs**: A collection of steps that run on a single runner. Jobs can run sequentially (using dependencies) or in parallel.
- **Steps**: Individual commands or actions executed within a job. Steps may run shell scripts or call pre-built actions.

## Key YAML Syntax Elements

### Basic Workflow YAML Example
```yaml
name: GitHub Actions Demo
run-name: ${{ github.actor }} is testing out GitHub Actions 🚀
on: [push]
jobs:
  Explore-GitHub-Actions:
    runs-on: ubuntu-latest
    steps:
      - run: echo "🎉 The job was automatically triggered by a ${{ github.event_name }} event."
      - run: echo "🐧 This job is now running on a ${{ runner.os }} server hosted by GitHub!"
      - run: echo "🔎 The name of your branch is ${{ github.ref }} and your repository is ${{ github.repository }}."
      - name: Check out repository code
        uses: actions/checkout@v4
      - run: echo "💡 The ${{ github.repository }} repository has been cloned to the runner."
      - run: echo "🖥️ The workflow is now ready to test your code on the runner."
      - name: List files in the repository
        run: |
          ls ${{ github.workspace }}
      - run: echo "🍏 This job's status is ${{ job.status }}."
```

### Event Triggers
Workflows can be triggered by:
- **Repository events**: `push`, `pull_request`, `issues` etc.
- **Scheduled triggers**: Using cron syntax
- **Manual triggers**: `workflow_dispatch`

### Defining Jobs and Dependencies
Jobs are defined under the `jobs` key. Dependencies can be modeled using the `needs` keyword:
```yaml
jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - run: ./setup_server.sh

  build:
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - run: ./build_server.sh

  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: ./test_server.sh
```

### Matrix Strategy
To run tests against different versions or configurations:
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [14, 16]
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
```

### Caching Dependencies
Example for caching npm modules:
```yaml
- name: Cache node modules
  uses: actions/cache@v4
  env:
    cache-name: cache-node-modules
  with:
    path: ~/.npm
    key: ${{ runner.os }}-build-${{ env.cache-name }}-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-build-${{ env.cache-name }}-
```

## Advanced Configuration Options

### Using Secrets
Secrets can be injected into workflows:
```yaml
- name: Retrieve secret
  env:
    super_secret: ${{ secrets.SUPERSECRET }}
  run: |
    echo "Using secret: $super_secret"
```

### Service Containers
To run a job within a containerized service environment:
```yaml
jobs:
  container-job:
    runs-on: ubuntu-latest
    container: node:20-bookworm-slim
    services:
      postgres:
        image: postgres
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - name: Connect to PostgreSQL
        run: node client.js
        env:
          POSTGRES_HOST: postgres
          POSTGRES_PORT: 5432
```

### Runner Selection via Labels
Specify runners using labels:
```yaml
jobs:
  example-job:
    runs-on: [self-hosted, linux, x64, gpu]
```

## Troubleshooting and Best Practices

- **Monitoring Workflow Runs**: Navigate to the Actions tab in the repository to view logs and job details.
- **Re-running or Cancelling Workflows**: Use the GitHub UI to manage active or failed workflow runs.
- **Avoid Recursive Triggers**: Use tokens correctly (e.g., avoid using GITHUB_TOKEN when triggering another workflow from within a workflow run).
- **Efficient Caching**: Keep cache keys updated using hash functions on dependency lock files.

## Attribution and Data Size
- **Source**: GitHub Actions Documentation (https://docs.github.com/en/actions)
- **Data Size**: 939175 bytes
- **Links Found**: 16573


## Attribution
- Source: GitHub Actions Documentation
- URL: https://docs.github.com/en/actions
- License: License: GitHub Docs Terms
- Crawl Date: 2025-04-20T16:47:15.913Z
- Data Size: 939175 bytes
- Links Found: 16573

## Retrieved
2025-04-20
