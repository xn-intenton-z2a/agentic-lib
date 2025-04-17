# GITHUB_ACTIONS

## Crawl Summary
GitHub Actions workflows are defined in YAML files placed in .github/workflows. The technical configuration covers event triggers (push, pull_request, schedule, manual), job definitions including sequential or parallel execution with dependency management via 'needs', and runner configurations (GitHub provided or self-hosted with label constraints). The platform supports CI and CD workflows with detailed YAML specifications including matrix strategies, caching, and service containers. Full YAML examples provide step-by-step execution details, including usage of built-in context variables like ${{ github.event_name }}, ${{ runner.os }}, and ${{ job.status }}.

## Normalised Extract
## Table of Contents
1. Workflows Definition
   - Location: .github/workflows
   - YAML Structure: name, run-name, on, jobs
   - Example YAML provided with step-by-step commands
2. Event Triggers
   - Supported events: push, pull_request, schedule, manual
   - Syntax: 'on: [push]' or 'on: push'
3. Job Configuration
   - Attributes: runs-on, steps, dependencies (needs)
   - Example: Sequential jobs with 'needs' for building and testing
4. Actions Integration
   - Using prebuilt actions such as actions/checkout@v4
   - Custom actions can be referenced by name and version
5. Runner Configuration
   - Types: GitHub-hosted and self-hosted
   - Self-hosted runners can be filtered using labels (e.g. [self-hosted, linux, x64])
6. Advanced YAML Constructs
   - Matrix strategy for parallel testing across versions
   - Caching dependencies with actions/cache
   - Service containers for database or caching server support

## Detailed Technical Information
### Workflow YAML Example
```yaml
name: GitHub Actions Demo
run-name: ${{ github.actor }} is testing out GitHub Actions 🚀
on: [push]
jobs:
  Explore-GitHub-Actions:
    runs-on: ubuntu-latest
    steps:
      - run: echo "🎉 Triggered by ${{ github.event_name }} event."
      - run: echo "🐧 Running on ${{ runner.os }} server."
      - run: echo "Branch: ${{ github.ref }}, Repository: ${{ github.repository }}."
      - name: Check out repository code
        uses: actions/checkout@v4
      - run: echo "Repository cloned to runner."
      - name: List files in the repository
        run: |
          ls ${{ github.workspace }}
      - run: echo "Job status: ${{ job.status }}."
```

### Event Configuration
```yaml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    types: [opened, synchronize, reopened]
  schedule:
    - cron: '0 0 * * *'
```

### Job Dependencies Example
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

### Matrix Strategy Example
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

### Caching Dependencies Example
```yaml
- name: Cache node modules
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```


## Supplementary Details
### Detailed Configuration Options and Implementation Steps
- **Workflow File Location:** Must reside in `.github/workflows`. File extension must be `.yml` or `.yaml`.
- **Triggering Events:** Define events under the `on:` key. Example: push, pull_request, schedule (using cron syntax), and manual via repository_dispatch.
- **Runner Specification:**
  - GitHub-hosted runners: Use 'ubuntu-latest', 'windows-latest', or 'macos-latest'.
  - Self-hosted runners: Specify labels in an array, e.g. `runs-on: [self-hosted, linux, x64]`.
- **Job Dependencies:** Use `needs` keyword to enforce execution order; if a job fails, dependent jobs will be skipped unless overridden with conditional expressions using `if`.
- **Matrix Strategies:** Define multiple combinations for testing: Example uses node versions 14 and 16. The resulting key `matrix.node` is then referenced.
- **Caching:** Configure caching using actions/cache with specific keys generated from file hashes to speed up dependency installation.
- **Secrets Management:** Secrets are injected using `${{ secrets.YOUR_SECRET }}` and should be stored securely in repository settings.
- **Service Containers:** Utilize the `services` key to spin up auxiliary containers (e.g., PostgreSQL) for integration testing.

### Implementation Steps
1. Create or update workflow YAML file in the .github/workflows directory.
2. Define the `on:` section for the desired triggers.
3. Add job definitions with `runs-on` and steps, using either shell commands or actions.
4. Define environment variables and secrets where required.
5. Validate the YAML file using GitHub Actions linter or local tools.
6. Commit the file to trigger workflow execution and review logs under the Actions tab.


## Reference Details
### Complete API Specifications and SDK Method Signatures

#### GitHub Actions Workflow YAML Key Specifications:
- **name (string):** The workflow display name.
- **run-name (string):** Custom name computed from expression, e.g. `${{ github.actor }}`.
- **on (array/object):** Specifies events; e.g.,
  - For simple event: `on: [push]`
  - For detailed event: 
    ```yaml
    on:
      push:
        branches: [ main, develop ]
    ```
- **jobs (object):** Contains one or more job definitions.

##### Job Object Properties:
- **runs-on (string or array):** Name of the runner environment. Examples: `ubuntu-latest`, `windows-latest`.
- **needs (string or array):** Specifies dependencies on other jobs.
- **steps (array):** A series of individual steps. Each step can have:
  - **run (string):** A shell command.
  - **name (string):** Step display name.
  - **uses (string):** Reference to an action with version, e.g. `actions/checkout@v4`.
  - **with (object):** Parameters passed to the action.
  - **env (object):** Custom environment variables, e.g.:
    ```yaml
    env:
      MY_VAR: value
    ```

#### Full YAML Workflow Code Example with Comments:

```yaml
# Workflow for demonstration of GitHub Actions
name: GitHub Actions Demo
# Custom runtime name using the actor variable
run-name: ${{ github.actor }} is testing out GitHub Actions 🚀

# Trigger workflow on push events
on:
  push:
    branches: [ main ]

jobs:
  # A job that demonstrates a simple workflow
  Explore-GitHub-Actions:
    # Specifies the runner type
    runs-on: ubuntu-latest
    steps:
      # Output the event that triggered the workflow
      - run: echo "Triggered by ${{ github.event_name }} event."

      # Output the operating system of the runner
      - run: echo "Running on ${{ runner.os }} server."

      # Output branch and repository details
      - run: echo "Branch: ${{ github.ref }}, Repository: ${{ github.repository }}."

      # Checkout code using the official checkout action
      - name: Check out repository code
        uses: actions/checkout@v4

      # Confirm repository checkout
      - run: echo "Repository cloned to runner."

      # List files from the workspace
      - name: List files in the repository
        run: |
          ls ${{ github.workspace }}

      # Output job status
      - run: echo "Job status: ${{ job.status }}."
```

### Troubleshooting Procedures
1. **Validate YAML Syntax:**
   - Command: Use yamllint or GitHub Actions built-in linter.
   - Expected Output: No syntax errors; valid YAML structure.
2. **Test Runner Environment:**
   - Command: Inspect logs via the Actions tab on GitHub.
   - Expected Output: Logs should display successful execution of steps without errors.
3. **Environment Variable and Secret Checks:**
   - Command: Add debug steps (`echo "${{ secrets.SECRET_NAME }}"`) to verify variable availability (avoid printing sensitive data in production).
   - Expected Output: Confirm that environment variables are set correctly.
4. **Action Version Pinning:**
   - Best Practice: Always pin action versions (e.g., actions/checkout@v4) to avoid unexpected breaks.
5. **Runner Selection Issues:**
   - Command: Use label filters and check self-hosted runner logs via `sudo journalctl -u actions.runner`
   - Expected Output: Runners matching specified labels execute the job.

This comprehensive reference contains the exact specifications and examples that developers can directly copy, modify, and use to implement reliable CI/CD workflows using GitHub Actions.

## Original Source
Understanding GitHub Actions
https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions

## Digest of GITHUB_ACTIONS

# GitHub Actions Technical Digest

**Retrieved Date:** 2023-10-11

## Overview
GitHub Actions is a CI/CD platform that automates build, test, and deployment workflows using YAML configuration files. It provides capabilities to trigger workflows on repository events, schedule runs, or trigger them manually. Workflows consist of jobs which execute on isolated virtual machines or containers, and these jobs are a series of steps that can run shell scripts or actions (reusable extensions).

## Table of Contents
1. Workflows
2. Events
3. Jobs
4. Actions
5. Runners
6. Continuous Integration
7. Continuous Deployment
8. Workflow Templates
9. Advanced Configuration

## 1. Workflows
- **Definition:** A workflow is an automated process defined in a YAML file located in the `.github/workflows` directory.
- **Triggers:** Workflows are triggered by GitHub events (e.g. push, pull_request), schedules, or manually.
- **YAML Example:**

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
      - run: echo "🔎 Branch: ${{ github.ref }}, Repository: ${{ github.repository }}."
      - name: Check out repository code
        uses: actions/checkout@v4
      - run: echo "💡 Repository cloned to runner."
      - name: List files in the repository
        run: |
          ls ${{ github.workspace }}
      - run: echo "🍏 Job status: ${{ job.status }}."
```

## 2. Events
- **Definition:** An event is an activity, such as a push, pull request, issue creation, or schedule trigger.
- **Usage Example:** Use the `on:` key to specify events in the workflow YAML:

```yaml
on: [push, pull_request]
```

## 3. Jobs
- **Definition:** A job is a set of steps executed on a runner. Jobs can run sequentially or in parallel.
- **Dependencies:** Use the `needs` keyword to specify job dependencies.
- **Example:**

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: ./build.sh
  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: ./test.sh
```

## 4. Actions
- **Definition:** Actions are reusable extensions that perform specific tasks such as checking out code or setting up a toolchain.
- **Usage in Workflows:**

```yaml
- name: Check out repository code
  uses: actions/checkout@v4
```

## 5. Runners
- **Definition:** A runner is a server that executes workflow jobs. GitHub provides virtual machines for Linux, Windows, and macOS.
- **Self-Hosted Option:** You can configure self-hosted runners with custom labels, e.g.:

```yaml
runs-on: [self-hosted, linux, x64]
```

## 6. Continuous Integration (CI)
- **Purpose:** Automate code build and testing on code commits or pull requests.
- **Configuration:** CI workflows run on trigger events, e.g., push. GitHub suggests templates based on detected languages.

## 7. Continuous Deployment (CD)
- **Purpose:** Automate code deployment with processes that build, test, and then deploy if tests pass.
- **Advanced Features:** Environment protection, concurrency limits, and usage of deployment secrets.

## 8. Workflow Templates
- **Definition:** Preconfigured YAML files provided by GitHub to speed up workflow creation. They are found in the `actions/starter-workflows` repository.

## 9. Advanced Configuration
- **Secret Management:** Define secrets in the repository settings and refer using `${{ secrets.SECRET_NAME }}`.
- **Matrix Strategy:** Run jobs over multiple variable combinations:

```yaml
strategy:
  matrix:
    node: [14, 16]
steps:
  - uses: actions/setup-node@v4
    with:
      node-version: ${{ matrix.node }}
```
- **Caching Dependencies:** Utilize actions/cache for storing dependencies:

```yaml
- name: Cache node modules
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

## Attribution
- **Data Size:** 929225 bytes
- **Links Found:** 16622

## Attribution
- Source: Understanding GitHub Actions
- URL: https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions
- License: License: Custom GitHub Docs License
- Crawl Date: 2025-04-17T15:14:17.052Z
- Data Size: 929225 bytes
- Links Found: 16622

## Retrieved
2025-04-17
