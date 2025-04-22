# GITHUB_ACTIONS

## Crawl Summary
GitHub Actions provides workflows defined in YAML with explicit configuration options. Key technical details include: YAML configuration for event triggers (e.g., push, pull_request), job definitions using 'runs-on' for specifying runner environments, steps which execute shell commands or reusable actions, advanced features like matrix strategies for parallel testing, caching dependencies using actions/cache with precise key configurations, and using service containers for databases. Detailed examples include full workflow file samples with environment variables and step-by-step execution.

## Normalised Extract
Table of Contents:
1. Workflow Fundamentals
   - YAML file location: .github/workflows
   - Mandatory keys: name, on, jobs
2. Event Triggers
   - Supported events: push, pull_request, schedule, manual, repository_dispatch
   - Example: `on: push`
3. Job Execution
   - Job definition with 'runs-on' and ordered 'steps'
   - Sharing data between steps
4. Matrix Strategies
   - Use-case: Running jobs across multiple Node.js versions
   - Example parameters: node: [14, 16]
5. Caching Dependencies
   - Action: actions/cache@v4
   - Parameters: path, key, restore-keys
6. Containerized Services
   - Defining containers using the 'container' and 'services' keys
   - Example: PostgreSQL configuration
7. Workflow API Specifications
   - Complete YAML examples included

Detailed Information:
1. Workflow Fundamentals:
   - Define workflows in YAML within the .github/workflows directory.
   - Example: Provide name, trigger events, followed by jobs.

2. Event Triggers:
   - Specify in the 'on' key, an array or map of events e.g., [push].
   - Advanced trigger settings include filtering by branch or activity type.

3. Job Execution:
   - Jobs run on environments specified by 'runs-on', e.g., ubuntu-latest.
   - Each job contains steps that are executed sequentially.
   - Data between steps can be shared using GitHub context variables like ${{ github.ref }}.

4. Matrix Strategies:
   - Defines multiple executions with a matrix:
     strategy:
       matrix:
         node: [14, 16]
   - Each job run substitutes ${ matrix.node } accordingly.

5. Caching Dependencies:
   - Use actions/cache to store directories (e.g., ~/.npm) with:
     key: based on OS and package-lock.json hash.

6. Containerized Services:
   - Define a container image for the job and attach services:
     Example: PostgreSQL container with image 'postgres' and port mapping.

7. Workflow API Specifications:
   - Full YAML with parameters:
     * run-name supports expressions like ${{ github.actor }}.
     * jobs have detailed steps with names, commands, and uses clauses.


## Supplementary Details
Technical Specifications and Implementation Details:

- YAML Workflow File must reside in .github/workflows; filename ends with .yml or .yaml.
- Key properties:
  - name: (string) Human-readable workflow name.
  - run-name: (string) Dynamic name using GitHub context expressions.
  - on: (array/map) Defines events that trigger the workflow, e.g., push, pull_request.
  - jobs: (object) Map of job definitions. Each job contains:
    - runs-on: (string or array) Specifies runner type. Common values: ubuntu-latest, windows-latest, macos-latest.
    - steps: (array) Each step object may have:
      - name: (string) Step name.
      - run: (string) Command(s) executed on the runner.
      - uses: (string) Reference to an action. Format: owner/repo@version (e.g., actions/checkout@v4).
      - with: (object) Parameters for actions.
      - env: (object) Environment variables, e.g., secrets.
- Advanced configurations:
  - Matrix strategy: Defines variable dimensions to run jobs concurrently.
  - Caching: actions/cache requires parameters: path, key, restore-keys with exact hash function: hashFiles('**/package-lock.json').
  - Container and services: Use 'container' to run a job in a specific image, and 'services' to spin up helper containers with specified image and port mappings.

Implementation Steps for Creating a Workflow:
1. Create directory .github/workflows if it does not exist.
2. Create a workflow file (e.g., github-actions-demo.yml).
3. Copy the YAML content (provided below) into the file.
4. Commit the workflow file to trigger a workflow run.

Exact YAML Example provided in documentDetailedDigest.

Configuration Options and their Effects:
- on:
  * Value: push, pull_request, etc. Triggers workflow on respective events.
- runs-on:
  * Value: ubuntu-latest. Specifies the OS and environment for the job.
- actions/checkout@v4:
  * Clones the repository code into the runner workspace.
- Cache key:
  * Combination of OS and file hash ensures cache hits if dependencies remain unchanged.


## Reference Details
Complete API Specifications and Code Examples for GitHub Actions Workflows:

1. Workflow Trigger Specification:
   - Syntax:
     on: [push, pull_request, schedule]
   - Example:
     ```yaml
     on:
       push:
         branches:
           - main
       schedule:
         - cron: '0 0 * * *'
     ```

2. Job and Step Specification:
   - Job definition with dependency (using needs):
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
       test:
         needs: build
         runs-on: ubuntu-latest
         steps:
           - run: ./test.sh
     ```

3. Matrix Execution Example:
   - Complete YAML with matrix:
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
           - run: npm install
           - run: npm test
     ```

4. Caching Dependencies Example:
   - Full code block for caching:
     ```yaml
     steps:
       - name: Cache node modules
         uses: actions/cache@v4
         with:
           path: ~/.npm
           key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
           restore-keys: |
             ${{ runner.os }}-node-
     ```

5. Containerized Services and Database Connection:
   - Full example with PostgreSQL:
     ```yaml
     jobs:
       container-job:
         runs-on: ubuntu-latest
         container: node:20-bookworm-slim
         services:
           postgres:
             image: postgres
             ports:
               - 5432:5432
         steps:
           - name: Check out repository code
             uses: actions/checkout@v4
           - name: Install dependencies
             run: npm ci
           - name: Connect to PostgreSQL
             run: node client.js
             env:
               POSTGRES_HOST: postgres
               POSTGRES_PORT: 5432
     ```

6. Full Workflow File Example with Comments:
   - This YAML example provides inline comments and uses contextual expressions:
     ```yaml
     name: GitHub Actions Demo
     run-name: ${{ github.actor }} is testing out GitHub Actions 🚀
     on: [push]
     jobs:
       Explore-GitHub-Actions:
         runs-on: ubuntu-latest
         steps:
           # Output event details
           - run: echo "Triggered by ${{ github.event_name }}"
           - run: echo "Running on ${{ runner.os }}"
           - run: echo "Branch: ${{ github.ref }} and Repo: ${{ github.repository }}"
           
           # Checkout code
           - name: Check out repository code
             uses: actions/checkout@v4
           - run: echo "Repository cloned"
           
           # List repository files
           - name: List files
             run: |
               ls ${{ github.workspace }}
           
           # Display status
           - run: echo "Job status: ${{ job.status }}"
     ```

7. Best Practices and Troubleshooting Procedures:
   - Always use specific action versions (e.g., @v4) to ensure stability.
   - Use caching to reduce build times. Validate cache keys if jobs fail due to cache misses.
   - When troubleshooting, check logs for each step by expanding the output in the GitHub Actions UI.
   - To re-run a workflow, use the 'Re-run jobs' option in the Actions tab and inspect environment variable outputs for debugging.
   - Use `echo` commands to print context variables such as ${{ github.actor }}, ${{ github.ref }}, and ${{ job.status }}.

Return Types and Error Handling:
- GitHub Actions steps do not have explicit return types but rely on shell exit codes. A non-zero exit code fails the job.
- For API interactions (e.g., GitHub REST API), refer to the official documentation for method signatures, parameters, and error handling instructions.

These detailed specifications are directly applicable for developers to implement, test, and troubleshoot GitHub Actions workflows in their development lifecycle.

## Information Dense Extract
Table of Contents:
1. Workflow Fundamentals
   - YAML file location: .github/workflows
   - Mandatory keys: name, on, jobs
2. Event Triggers
   - Supported events: push, pull_request, schedule, manual, repository_dispatch
   - Example: 'on: push'
3. Job Execution
   - Job definition with 'runs-on' and ordered 'steps'
   - Sharing data between steps
4. Matrix Strategies
   - Use-case: Running jobs across multiple Node.js versions
   - Example parameters: node: [14, 16]
5. Caching Dependencies
   - Action: actions/cache@v4
   - Parameters: path, key, restore-keys
6. Containerized Services
   - Defining containers using the 'container' and 'services' keys
   - Example: PostgreSQL configuration
7. Workflow API Specifications
   - Complete YAML examples included

Detailed Information:
1. Workflow Fundamentals:
   - Define workflows in YAML within the .github/workflows directory.
   - Example: Provide name, trigger events, followed by jobs.

2. Event Triggers:
   - Specify in the 'on' key, an array or map of events e.g., [push].
   - Advanced trigger settings include filtering by branch or activity type.

3. Job Execution:
   - Jobs run on environments specified by 'runs-on', e.g., ubuntu-latest.
   - Each job contains steps that are executed sequentially.
   - Data between steps can be shared using GitHub context variables like ${{ github.ref }}.

4. Matrix Strategies:
   - Defines multiple executions with a matrix:
     strategy:
       matrix:
         node: [14, 16]
   - Each job run substitutes ${ matrix.node } accordingly.

5. Caching Dependencies:
   - Use actions/cache to store directories (e.g., ~/.npm) with:
     key: based on OS and package-lock.json hash.

6. Containerized Services:
   - Define a container image for the job and attach services:
     Example: PostgreSQL container with image 'postgres' and port mapping.

7. Workflow API Specifications:
   - Full YAML with parameters:
     * run-name supports expressions like ${{ github.actor }}.
     * jobs have detailed steps with names, commands, and uses clauses.

## Original Source
GitHub Actions Documentation
https://docs.github.com/en/actions

## Digest of GITHUB_ACTIONS

# Overview (Retrieved: 2023-10-12)

GitHub Actions is a CI/CD platform that automates build, test, and deployment workflows directly in your GitHub repository. Workflows are defined in YAML files located in the .github/workflows directory. They consist of events, jobs, and steps that run on either GitHub-hosted or self-hosted runners.

# Workflow Syntax

- Workflows are defined in YAML using key properties such as:
  - `name`: The name of the workflow.
  - `on`: The event or events that trigger the workflow (push, pull_request, schedule, manual, etc.).
  - `jobs`: A collection of jobs to run. Each job defines:
    - `runs-on`: Specifies the type of runner (e.g., `ubuntu-latest`, `windows-latest`, `macos-latest`).
    - `steps`: A sequence of commands or actions to execute. Each step can use shell scripts or actions.

# Events

Events trigger workflow runs. They include repository events (push, pull_request, issues, etc.), scheduled events, or manually triggered events. Events are declared under the `on` key. For example:

```yaml
on: push
```

# Jobs and Steps

- A job is a set of steps that run sequentially on a single runner.
- Steps can execute shell commands, run scripts, or call reusable actions. They are defined in order and support features like environment variables, outputs, and conditional execution.

Example Job (simplified):

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Building the application"
```

# Advanced Features

## Matrix Strategy

Allows parallel testing across environments. For example:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [14, 16]
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
```

## Caching Dependencies

Improves performance by reusing dependencies between runs:

```yaml
steps:
  - name: Cache node modules
    uses: actions/cache@v4
    with:
      path: ~/.npm
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      restore-keys: |
        ${{ runner.os }}-node-
```

## Containerized Services

Jobs can use service containers, for example a PostgreSQL container:

```yaml
jobs:
  container-job:
    runs-on: ubuntu-latest
    container: node:20-bookworm-slim
    services:
      postgres:
        image: postgres
        ports:
          - 5432:5432
    steps:
      - name: Check out code
        uses: actions/checkout@v4
      - run: npm ci
      - run: node client.js
        env:
          POSTGRES_HOST: postgres
          POSTGRES_PORT: 5432
```

# Sample Workflow File

Below is a complete workflow file with detailed steps and comments:

```yaml
name: GitHub Actions Demo
run-name: ${{ github.actor }} is testing out GitHub Actions 🚀
on: [push]

jobs:
  Explore-GitHub-Actions:
    runs-on: ubuntu-latest
    steps:
      # Triggered by the push event
      - run: echo "🎉 The job was automatically triggered by a ${{ github.event_name }} event."
      - run: echo "🐧 This job is now running on a ${{ runner.os }} server hosted by GitHub!"
      - run: echo "🔎 The branch is ${{ github.ref }} and repository is ${{ github.repository }}."
      
      # Checkout the repository code
      - name: Check out repository code
        uses: actions/checkout@v4
      - run: echo "💡 Repository cloned. Ready to test code!"
      
      # List files in workspace
      - name: List files in the repository
        run: |
          ls ${{ github.workspace }}
      
      # Display job status
      - run: echo "🍏 Job status is ${{ job.status }}."
```

# Attribution

Source: GitHub Actions Documentation (https://docs.github.com/en/actions)
Data Size: 939175 bytes, Links Found: 16573

## Attribution
- Source: GitHub Actions Documentation
- URL: https://docs.github.com/en/actions
- License: License: GitHub Docs Terms
- Crawl Date: 2025-04-22T01:35:32.224Z
- Data Size: 939175 bytes
- Links Found: 16573

## Retrieved
2025-04-22
