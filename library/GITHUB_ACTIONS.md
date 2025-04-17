# GITHUB_ACTIONS

## Crawl Summary
Crawled data did not contain direct technical content; using the GitHub Actions Best Practices reference, key technical details include explicit YAML configurations for events, job definitions, secrets management, caching strategies, and debugging commands. The guidelines stress version pinning, conditional execution via 'if', and usage of official actions such as checkout, setup-node, cache, and artifact upload.

## Normalised Extract
## Table of Contents
1. Workflow YAML Configurations
2. Conditional Execution
3. Secrets and Environment Variables
4. Caching and Artifacts
5. Debugging and Troubleshooting

### 1. Workflow YAML Configurations
- Example snippet:
  ```yaml
  name: CI Pipeline
  on:
    push:
      branches: [ main ]
    pull_request:
      branches: [ main ]
  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-node@v3
          with:
            node-version: '16'
  ```
- Details: Use explicit versions for actions; define `on` events and specify runner OS.

### 2. Conditional Execution
- Example snippet:
  ```yaml
  - name: Run tests only on push
    if: ${{ github.event_name == 'push' }}
    run: npm test
  ```
- Details: Conditions help limit step execution based on event context.

### 3. Secrets and Environment Variables
- Example snippet:
  ```yaml
  env:
    SECRET_TOKEN: ${{ secrets.SECRET_TOKEN }}
  ```
- Details: Securely inject secrets and use environment variables for configuration.

### 4. Caching and Artifacts
- Caching example:
  ```yaml
  - name: Cache dependencies
    uses: actions/cache@v3
    with:
      path: node_modules
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
  ```
- Artifact upload example:
  ```yaml
  - name: Upload artifact
    uses: actions/upload-artifact@v3
    with:
      name: build-artifact
      path: ./dist
  ```

### 5. Debugging and Troubleshooting
- Enable debug mode:
  ```bash
  export ACTIONS_RUNNER_DEBUG=true
  export ACTIONS_STEP_DEBUG=true
  ```
- Use logging in custom actions with @actions/core:
  ```typescript
  import * as core from '@actions/core';

  try {
    core.info('Debug info message');
  } catch (error) {
    core.setFailed(`Error: ${error}`);
  }
  ```


## Supplementary Details
### Supplementary Technical Specifications
- Workflow configuration requires defining `name`, `on`, and `jobs` keys in a YAML file.
- For job execution, `runs-on` must be set (e.g., ubuntu-latest).
- Action versions should be pinned (e.g., @v3) to avoid unexpected updates.
- Caching must use a unique key; recommended strategy is to hash dependency lock files (e.g., package-lock.json).
- Debug configuration: set `ACTIONS_RUNNER_DEBUG` and `ACTIONS_STEP_DEBUG` to 'true' in the runner environment to output detailed logs.
- Secrets are referenced using the syntax `${{ secrets.NAME }}` ensuring sensitive data is not exposed.
- Conditional steps employ the `if` keyword; the GitHub context (e.g., `github.event_name`) can be used to determine execution paths.


## Reference Details
### Complete API and SDK Specifications for GitHub Actions

#### 1. YAML Workflow Configuration
- Example File: .github/workflows/ci.yml

```yaml
name: CI Pipeline
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm install
      - name: Run tests
        if: ${{ github.event_name == 'push' }}
        run: npm test
      - name: Cache node modules
        uses: actions/cache@v3
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-
      - name: Upload build artifact
        uses: actions/upload-artifact@v3
        with:
          name: build-artifact
          path: ./build
```

#### 2. GitHub Actions Toolkit (JavaScript/TypeScript SDK)
- Importing the core module:

```typescript
import * as core from '@actions/core';
```

- Method: core.info
  - Signature: core.info(message: string): void
  - Description: Logs an informational message to the GitHub Actions log.

- Method: core.setFailed
  - Signature: core.setFailed(error: string | Error): void
  - Description: Marks the action as failed and logs the error message.

- Example:

```typescript
import * as core from '@actions/core';

async function run(): Promise<void> {
  try {
    core.info('Starting action execution');
    // Perform action tasks...
    core.info('Action executed successfully');
  } catch (error) {
    core.setFailed(`Execution failed: ${error}`);
  }
}

run();
```

#### 3. Debugging and Logging Commands
- To enable detailed debug logs in GitHub Actions, set environment variables in the runner:

```bash
export ACTIONS_RUNNER_DEBUG=true
export ACTIONS_STEP_DEBUG=true
```

- Troubleshooting Steps:
  1. Re-run the workflow with debug flags enabled.
  2. Examine the logs for detailed command execution outputs.
  3. Use `core.debug('message')` within custom actions for granular logging.

#### 4. Best Practices Implementation Pattern
- Always pin action versions (e.g., `actions/checkout@v3` rather than `@master`).
- Use dependency caching to improve performance.
- Inject secrets securely using `${{ secrets.VARIABLE }}` and never hard-code sensitive data.
- Use conditional execution (if statements) to optimize workflow runs.
- Validate YAML configuration using GitHub's workflow linter before committing.

By following these explicit technical procedures, developers can implement robust, efficient, and secure CI/CD workflows using GitHub Actions.


## Original Source
GitHub Actions Best Practices
https://docs.github.com/en/actions/learn-github-actions/best-practices-for-ci-cd

## Digest of GITHUB_ACTIONS

# GitHub Actions Best Practices for CI/CD

**Retrieved Date:** 2023-10-17

## Overview
This document consolidates the specific technical guidelines and best practices for implementing CI/CD pipelines using GitHub Actions. It includes YAML workflow configurations, conditional execution, dependency caching, and debugging/troubleshooting procedures.

## Technical Details

### Workflow YAML Configurations
- Use explicit version pinning (e.g., `actions/checkout@v3`, `actions/setup-node@v3`).
- Define event triggers explicitly:
  ```yaml
  on:
    push:
      branches: [ main ]
    pull_request:
      branches: [ main ]
  ```
- Specify the `runs-on` parameter (e.g., `ubuntu-latest`).

### Conditional Execution
- Use `if` conditions to control job/step execution:
  ```yaml
  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - name: Conditional Step
          if: ${{ github.event_name == 'push' }}
          run: echo "This step runs only on push events."
  ```

### Secrets and Environment Variables
- Pass secrets securely:
  ```yaml
  env:
    API_KEY: ${{ secrets.API_KEY }}
  ```
- Leverage environment files to isolate configuration.

### Caching and Artifacts
- Cache dependencies to improve workflow speed:
  ```yaml
  - name: Cache node modules
    uses: actions/cache@v3
    with:
      path: node_modules
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      restore-keys: |
        ${{ runner.os }}-node-
  ```
- Upload artifacts for later use:
  ```yaml
  - name: Upload Build Artifact
    uses: actions/upload-artifact@v3
    with:
      name: build
      path: ./build
  ```

### Debugging and Troubleshooting
- Enable debug logging by setting environment variables:
  ```bash
  export ACTIONS_RUNNER_DEBUG=true
  export ACTIONS_STEP_DEBUG=true
  ```
- Use the GitHub Actions Toolkit for logging and error handling in custom actions:
  ```typescript
  import * as core from '@actions/core';

  try {
    // Execute your code
    core.info('Action executed successfully');
  } catch (error) {
    core.setFailed(`Action failed with error ${error}`);
  }
  ```

## Attribution
- Crawled Content Data Size: 0 bytes
- Source: https://docs.github.com/en/actions/learn-github-actions/best-practices-for-ci-cd


## Attribution
- Source: GitHub Actions Best Practices
- URL: https://docs.github.com/en/actions/learn-github-actions/best-practices-for-ci-cd
- License: License: GitHub Docs License (CC BY 4.0)
- Crawl Date: 2025-04-17T18:50:18.841Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-04-17
