# GITHUB_ACTIONS

## Crawl Summary
The technical details extracted include precise YAML configuration for GitHub Actions workflows, including event triggers, job definitions, matrix strategies, dependency caching, and service containers. The content provides exact code examples with configuration values such as 'runs-on: ubuntu-latest', checkout version 'actions/checkout@v4', and detailed steps to list repository files and display job statuses. Additionally, advanced topics like using a matrix for Node.js version testing, caching the ~/.npm directory, and running service containers for PostgreSQL are covered with complete code snippets.

## Normalised Extract
## Table of Contents
1. Overview
2. Workflow Configuration
3. Event Triggers
4. Job and Step Definitions
5. Actions and Runners
6. Advanced Configurations
   6.1 Matrix Strategy
   6.2 Caching Dependencies
   6.3 Service Containers
7. Quickstart Workflow Example

---

### 1. Overview
GitHub Actions automates CI/CD pipelines. The workflows are YAML files placed in the `.github/workflows` directory.

### 2. Workflow Configuration
- **YAML File Placement:** `.github/workflows`
- **Key Elements:** `name`, `on`, `jobs`.
- **YAML Example:**
```yaml
name: GitHub Actions Demo
on: [push]
jobs:
  ExampleJob:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Triggered by ${{ github.event_name }}"
```

### 3. Event Triggers
- **Definition:** Events that trigger workflows (e.g., push, pull_request, schedule).
- **Syntax Example:**
```yaml
on: [push, pull_request]
```

### 4. Job and Step Definitions
- **Jobs:** Consist of multiple steps running on a designated runner.
- **Example of Dependent Jobs:**
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

### 5. Actions and Runners
- **Actions Usage:** Reusable tasks, e.g., checking out code using `actions/checkout@v4`.
- **Runners:** Specified via `runs-on` (e.g., ubuntu-latest, windows-latest, macos-latest).

### 6. Advanced Configurations
#### 6.1 Matrix Strategy
- **Purpose:** Run jobs across different configurations.
- **Example:**
```yaml
strategy:
  matrix:
    node: [14, 16]
```

#### 6.2 Caching Dependencies
- **Purpose:** Cache directories like `~/.npm` to speed up workflows.
- **Example:**
```yaml
- name: Cache node modules
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

#### 6.3 Service Containers
- **Purpose:** Provide ephemeral service containers (e.g., PostgreSQL) during workflows.
- **Example:**
```yaml
services:
  postgres:
    image: postgres
```

### 7. Quickstart Workflow Example
A complete workflow that clones the repository, lists files, and reports status:
```yaml
name: GitHub Actions Demo
run-name: ${{ github.actor }} is testing out GitHub Actions 🚀
on: [push]
jobs:
  Explore-GitHub-Actions:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Triggered by ${{ github.event_name }}"
      - run: echo "Running on ${{ runner.os }}"
      - name: Check out code
        uses: actions/checkout@v4
      - name: List files
        run: ls ${{ github.workspace }}
      - run: echo "Job status: ${{ job.status }}"
```


## Supplementary Details
### Detailed Implementation Specifications

1. **Workflow File Structure**:
   - Must be located in `.github/workflows/`.
   - Filename must end with `.yml` or `.yaml`.
   - Example structure:
     - `.github/`
       - `workflows/`
         - `github-actions-demo.yml`

2. **Key YAML Keys and Their Effects**:
   - `name`: Display name of the workflow.
   - `run-name`: Custom label for each run, interpolating variables (e.g., `${{ github.actor }}`).
   - `on`: Defines when the workflow is executed. Can be events like `push`, `pull_request` or a schedule.
   - `jobs`: Collection of job definitions.
   - `runs-on`: Specifies the OS image. Common values: `ubuntu-latest`, `windows-latest`, `macos-latest`.
   - `steps`: Ordered list of commands or actions.

3. **Matrix Strategy & Caching Examples**:
   - **Matrix Usage:** Trial different Node.js versions:
     ```yaml
     strategy:
       matrix:
         node: [14, 16]
     ```
   - **Cache Dependencies:** Caching NPM modules to optimize subsequent runs:
     ```yaml
     - uses: actions/cache@v4
       with:
         path: ~/.npm
         key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
     ```

4. **Service Container Configuration:**
   - Runs a container for PostgreSQL:
     ```yaml
     services:
       postgres:
         image: postgres
         ports:
           - 5432:5432
     ```
   - Integration: Environment variables (e.g., `POSTGRES_HOST`) must match the service name.

5. **Secrets and Security Best Practices:**
   - Use GitHub Secrets to secure sensitive data:
     ```yaml
     env:
       SUPER_SECRET: ${{ secrets.SUPERSECRET }}
     ```
   - Do not hardcode credentials in workflows.

6. **Troubleshooting Procedures:**
   - **Viewing Logs:** Navigate to the Actions tab, select a run, and expand steps for detailed logs.
   - **Common Command:**
     ```bash
     ls ${{ github.workspace }}
     ```
     Use this command to verify workspace contents.
   - **Error Investigation:**
     - Check if the workflow file is in the correct directory.
     - Ensure correct indentation in YAML files.
     - Validate runner selection and environment variable usage.

7. **Step-by-Step Workflow Execution:**
   - Commit a YAML file to trigger a workflow run.
   - Monitor execution via the GitHub Actions logs interface.
   - Re-run failed jobs using the GitHub web UI or CLI commands.


## Reference Details
### Complete API Specifications & SDK Method Signatures

#### Workflow YAML API Specification

- **Workflow Definition File**:
  - File path: `.github/workflows/<filename>.yml`
  - Mandatory keys: `name`, `on`, `jobs`

- **Job Definition**:
  - Key: `runs-on`: Accepts string or array of strings (e.g., `ubuntu-latest`, `[self-hosted, linux, x64, gpu]`).
  - Key: `steps`: Array of step definitions.
  - Each step can include:
    - `run`: string command to execute.
    - `uses`: action reference in the format `owner/name@version`.
    - `name`: descriptive label for the step.
    - `env`: dictionary of environment variables (key: variable name, value: interpolated string).

#### Example SDK/CLI Command and Method Signatures

Although GitHub Actions does not use traditional SDK method signatures, the following structure is directly usable in workflows:

```yaml
# Example: Checkout and Cache
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [14, 16]
    steps:
      # Check out the repository
      - name: Checkout code
        uses: actions/checkout@v4

      # Setup Node.js environment
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}

      # Cache node modules
      - name: Cache modules
        uses: actions/cache@v4
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-

      # Build the project
      - name: Build
        run: npm run build
```

#### Detailed Troubleshooting Steps

1. **Verify Workflow Directory Structure**:
   - Command:
     ```bash
     find . -type d -name '.github'
     ```
   - Expected Output: Directory structure including `/workflows`.

2. **Validate YAML File**:
   - Use online YAML linters or the GitHub Actions built-in validator.
   - Ensure proper indentation (2 spaces recommended) and valid syntax.

3. **Examine Runner Logs**:
   - Navigate to the Actions tab on the repository page.
   - Click on the failed run, select the job and expand steps to see error details.
   - Look for command outputs such as `ls ${{ github.workspace }}` to ensure files exist.

4. **Common Configuration Options and Their Effects**:
   - `runs-on`: Determines which OS image is used. Incorrect values may result in runner selection errors.
   - `on`: Incorrect or overly broad event filters might trigger unwanted runs. Use specific branch filters if needed.
   - `env`: Must be defined with available secrets; missing secrets will cause runtime failures.

5. **Best Practices Implementation Example**:
   - Split workflows by purpose (CI, CD, testing) to isolate failures.
   - Use caching and matrix strategies to improve performance and coverage.
   - Incorporate error checking in scripts, e.g., exit codes in shell commands.

Developers can copy the YAML examples provided directly into their repository to set up a fully operational GitHub Actions workflow without additional modifications.


## Original Source
GitHub Actions Documentation
https://docs.github.com/en/actions

## Digest of GITHUB_ACTIONS

# GitHub Actions Documentation

**Retrieved:** 2023-10-31

## Overview
GitHub Actions is a CI/CD platform that automates build, test, and deployment workflows directly in your repositories. It supports triggering workflows across Linux, Windows, and macOS runners, or via self-hosted runners. Workflows are defined using YAML files stored in the `.github/workflows` directory.

## Core Components

### Workflows
- **Definition:** A configurable automated process defined in YAML.
- **Location:** `.github/workflows` directory.
- **Usage:** Can contain one or more jobs that are triggered by repository events, schedules, manual triggers, or via API.
- **Example YAML Snippet:**

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
      - run: echo "🔎 The branch is ${{ github.ref }} in repository ${{ github.repository }}."
      - name: Check out repository code
        uses: actions/checkout@v4
      - run: echo "💡 Repository cloned."
      - name: List files in the repository
        run: ls ${{ github.workspace }}
      - run: echo "🍏 Job status: ${{ job.status }}."
```

### Events
- **Trigger Types:** push, pull_request, schedule, repository_dispatch, manual triggers, etc.
- **Configuration:** Defined using the `on:` key in the workflow YAML.

### Jobs and Steps
- **Jobs:** Series of steps executed on the same runner. They can run sequentially (using the `needs` keyword) or in parallel.
- **Steps:** Commands run as shell scripts or actions. Include direct commands and usage of pre-built actions.

### Actions
- **Definition:** Reusable extensions that perform specific tasks (e.g., checkout code, set up environments).
- **Usage Example:** ```uses: actions/checkout@v4```

### Runners
- **Available Runners:** Ubuntu, Windows, macOS (hosted by GitHub) and self-hosted options.
- **Configuration:** Specified using `runs-on` (e.g., `ubuntu-latest`).

## Advanced Configurations

### Matrix Strategy
- **Purpose:** Run tests on multiple configurations using a single job definition.
- **Example:**

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
- **Purpose:** Improve performance by caching dependency directories.
- **Example:**

```yaml
- name: Cache node modules
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-build-${{ env.cache-name }}-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-build-${{ env.cache-name }}-
```

### Service Containers
- **Usage:** Spin up ephemeral containers for services (e.g., PostgreSQL) during a job.
- **Example:**

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

## Quickstart Example Workflow
A complete quickstart workflow file:

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
      - run: echo "🔎 Branch: ${{ github.ref }}, Repository: ${{ github.repository }}."
      - name: Check out code
        uses: actions/checkout@v4
      - run: echo "💡 Repository cloned. Ready for tests."
      - name: List files
        run: |
          ls ${{ github.workspace }}
      - run: echo "🍏 Job status: ${{ job.status }}."
```

## Attribution
Data Size: 939175 bytes | Links Found: 16573


## Attribution
- Source: GitHub Actions Documentation
- URL: https://docs.github.com/en/actions
- License: License: GitHub Docs Terms
- Crawl Date: 2025-04-20T16:50:37.466Z
- Data Size: 939175 bytes
- Links Found: 16573

## Retrieved
2025-04-20
