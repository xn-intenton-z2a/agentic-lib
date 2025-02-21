# intentïon agentic-lib

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your 
repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and 
issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using 
GitHub’s `workflow_call` event, so they can be composed together like an SDK. This README describes each reusable 
workflow in detail—including its parameters (with types and whether they are required), responsibilities, and how 
top‐level jobs use them—and explains how the system can be seeded with a simple prompt to let your program evolve 
automatically.

[![Donate via PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://www.paypal.com/donate/?hosted_button_id=Y8PK8XP3EJLWG)

[Contribution Guidelines](CONTRIBUTING.md)

[Start using the Repository Template](https://github.com/xn-intenton-z2a/repository0)

---

## TODO

- [x] Run worker using a published action.
- [x] For NPM Follow [Semantic Versioning](https://semver.org/) for releases.
- [x] Expose a main as a cli
- [x] Use a separate action repository instead of relying upon the polycoder JS.
- [x] Create a new organisation for @intentïon including repositories (phase 1):
- - [x] intentïon `agentic-lib` Open Source (Apache 2) GitHub Actions Reusable Workflows (route to market)
- - [x] `repository0` - An example project but without the apply-fixes-sarif action or permissions
- [x] Replace shell script of any complexity with github-script.
- [x] Abstract re-usable workflows into a separate repository.
- [x] Switch from PAT to GITHUB_TOKEN.
- [x] Feed in issue title options from workflow (not inside the reusable workflow).
- [x] Add prime directive to CONTRIBUTING.md.
- [x] Add README to the context.
- [x] Add test file to the context.
- [x] Add CONTRIBUTING.md to the context.
- [x] Add funding mechanisms.
- [x] Add the ability to write to the README, test and package.json.
- [x] Add the full file context to the review.
- [x] Add Linting file to the context when working on an issue.
- [x] Add Linting results to the context to an issue after formatting the results.
- [x] Find a way for consumers to link to a stable version of the reusable workflows.
- [x] Test the link to the current version from the test file (not main but the github-ref being tested).
- [x] Test the link to the stable version after publishing from this repository.
- [x] Update the links in repository0 to point to the stable version.
- [~] Get issue body for linting.
- [ ] *Release intentïon `agentic-lib` workflows public beta.*
- [ ] *Release intentïon `repository0` repository template public beta.*

MVP:
- [ ] Add Getting started for using the repository template and promote as the intended use case.
- [ ] Shout out on Reddit.

Enhancements:
- [x] Scan code for possible library replacements for the custom code (automated)
- [x] Compress and de-dupe package.json (automated)
- [~] Implement "fix-failing-build" by raising a bug, then running start-issue (with a new name) in a tolerant mode allowing builds to fail but gathering output.
- [ ] Trigger test.yml on pull request creation or update
- [ ] Trigger apply fix when a test run completes and attempt a fix if the tests failed, ideally just for automated branches (issues, formatting, linting). <- This will then fix a broken PR branch or a broken main branch.
- [ ] Run apply fix on a schedule checking if a fix is necessary.
- [ ] Add PayPal donation link (the old account has been closed).
- [ ] Add git log to the context for review issue, issue worker and apply fixe
- [ ] Expose parameters for wrapped action steps with defaults matching the action steps defaults behaviour.
- [ ] Pick ideal version. Oldest? or Node 22 (after October 29th when it becomes LTS) build with the latest LTS but target the lowest compatible?
- [ ] Generate API.md based on the source file.
- [ ] Update CHANGELOG.md when a publishing a release version of the changes since the last release.
- [ ] Duplicate the test when publishing a release version with a version numbered test file.
- [ ] Dashboard metrics (e.g. GitHub Insights? commits by agents)

---

## Getting Started

Clone a seed repository which is pre-configured with the reusable workflows and scripts: https://github.com/xn-intenton-z2a/repository0

### Initiating the workflow

Run the action "Create Issue" and enter some text to create an issue. This will create an issue and trigger the 
"Issue Worker" to write the code. If the Issue Worker is able to resolve the issue a Pull Request is raised, the change 
automatically merged. The issue reviewed and closed if the change is deemed to have delivered whatever was requested in the issue.

Development Workflows:
```
On timer / Manual: Create Issue (new issue opened) 
-> Issue Worker (code changed, issue updated) 
-> Automerge (code merged)
-> Review Issue (issue reviewed and closed)

On timer: Issue Worker (code changed, issue updated) 
-> Automerge (code merged)
-> Review Issue (issue reviewed and closed)

On timer: Automerge (code merged)
-> Review Issue (issue reviewed and closed)

On timer: Review Issue (issue reviewed and closed)
```
(Each workflow is triggered by the previous one and also on a schedule so that failures can be recovered from.)

### Tuning the agentic coding system

The default set-up is quite open which can be chaotic. To temper this chaos you can change these files which the workflow takes into consideration:
- `CONTRIBUTING.md` - The workflow is itself a contributor and will be asked to follow these guidelines. Tip: Add a "prime directive" here.
- `eslint.config.js` - Code style rules and additional plugins can be added here.

The following files are also taken into consideration but may also be changed (even blanked out completely) by the workflow:
- `README.md`
- `package.json`
- `src/lib/main.js`
- `tests/unit/main.test.js`

**Chain Workflows Together:**  
   Use outputs from one workflow as inputs for another. For example, if an issue review workflow outputs `fixed`, then trigger an automerge workflow based on that flag.

**Customize Parameters:**  
   Each workflow accepts parameters with sensible defaults. Override them as needed to fit your project’s structure and requirements.

**Seed and Evolve:**  
   With a simple prompt (e.g. a new issue), the system will automatically review, generate fixes using ChatGPT, commit changes, and merge them—allowing the program to evolve autonomously.

---

```markdown
# Agentic Development System Guide

This guide explains how the various workflows of the Agentic Coding Systems work together to automate and streamline your development process. Think of these workflows as modular SDK components that encapsulate common operations—publishing, testing, issue management, dependency updates, code formatting, and more—allowing you to build an agentic development system for your projects.

---

## 1. Workflow Overview

### Publishing Workflow (`publish.yml`)
- **Function:** Automates package publishing.
- **Reusable Workflow:** [`wfr-publish.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-publish.yml@1.2.0)
- **Trigger:** On pushes (to branches like `main`) or via manual dispatch.
- **Steps:**
  - Check out code, install dependencies.
  - Run tests.
  - Publish packages with a semantic version increment.

### Testing Workflow (`test.yml`)
- **Function:** Runs tests and coverage reports.
- **Trigger:** On file changes, schedules, or manual invocation.
- **Steps:**
  - Check out code and set up Node (v20+).
  - Execute `npm test`.

### Issue Management Workflows
These workflows generalize the concept of work items as “tasks” rather than platform-specific issues.

#### a. Issue Creator (`issue-creator.yml`)
- **Function:** Creates a new task based on predefined prompts.
- **Reusable Workflow:** [`wfr-create-issue.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-issue.yml@1.2.0)
- **Trigger:** Manual dispatch or scheduled events with input parameters.

#### b. Issue Worker (`issue-worker.yml`)
- **Function:** Selects, validates, and initiates work on existing tasks.
- **Reusable Workflows:**
  - [`wfr-select-issue.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-select-issue.yml@1.2.0)
  - [`wfr-start-issue.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-start-issue.yml@1.2.0)
  - [`wfr-create-pr.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-pr.yml@1.2.0)

#### c. Issue Reviewer (`issue-reviewer.yml`)
- **Function:** Reviews and finalizes tasks once work is complete.
- **Reusable Workflow:** [`wfr-review-issue.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-review-issue.yml@1.2.0)

### Automerge Workflow (`automerge.yml`)
- **Function:** Automatically merges pull requests when criteria are met.
- **Reusable Workflows:**
  - [`wfr-automerge-find-pr-from-pull-request.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-find-pr-from-pull-request.yml@1.2.0)
  - [`wfr-automerge-find-pr-in-check-suite.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-find-pr-in-check-suite.yml@1.2.0)
  - [`wfr-automerge-label-issue.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-label-issue.yml@1.2.0)
  - [`wfr-automerge-merge-pr.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-merge-pr.yml@1.2.0)

### Dependency Update Workflow (`update.yml`)
- **Function:** Automates dependency updates using semantic versioning.
- **Reusable Workflow:** [`wfr-update.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-update.yml@1.2.0)

### Formatting Workflow (`formating.yml`)
- **Function:** Runs code formatting and linting checks.
- **Reusable Workflow:** [`wfr-run-script-and-commit-to-branch.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-run-script-and-commit-to-branch.yml@1.2.0)

### Funding and Dependabot Configurations
- **Funding (`FUNDING.yml`):** Contains funding information.
- **Dependabot (`dependabot.yml`):** Automates dependency update checks.

---

## 2. Reusable Workflows SDK Guide

Think of each reusable workflow as a function in an SDK:
- **Inputs:** Parameters (e.g., `versionIncrement`, `buildScript`, `issueTitle`) customize workflow behavior.
- **Outputs:** Results such as task status, pull request numbers, or merge status.
- **Integration:** Invoke these workflows via GitHub Actions workflow calls, schedule triggers, or manual dispatch. They encapsulate complex operations into modular, reusable components.

### Example: Invoking the Issue Creator Workflow
```yaml
on:
  workflow_dispatch:
    inputs:
      issueTitle:
        description: 'Title for the new task'
        required: false
        default: 'house choice'
```
Internally, this triggers [`wfr-create-issue.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-issue.yml@1.2.0) to generate an issue template based on provided parameters.

---

## 3. Repository Setup Guide

Follow these steps to set up your repository using the agentic development system:

1. **Create a Repository from Template:**
   - Begin with a repository template that includes the top-level workflows (e.g., `publish.yml`, `test.yml`, `issue-creator.yml`, etc.).
   - Clone the repository locally.

2. **Configure Repository Settings:**
   - Ensure your repository supports Node.js (v20+).
   - Add necessary secrets (e.g., `CHATGPT_API_SECRET_KEY`, `GITHUB_TOKEN`) via your repository settings.

3. **Customize Workflow Inputs:**
   - Edit workflow files under `.github/workflows/` to match your project specifics (e.g., branch names, file paths).
   - Update configuration files such as `dependabot.yml` and `FUNDING.yml` as needed.

4. **Install Dependencies:**
   - Run:
     ```bash
     npm install
     ```

5. **Run Initial Tests:**
   - Validate your setup by triggering the self-test workflow:
     ```bash
     npx agentic-lib self-test
     ```

6. **Execute a Demo:**
   - Run the demo workflow to see the system in action:
     ```bash
     npx agentic-lib demo
     ```

7. **First Prompt Exercise:**
   - As an initial exercise, create a new task:
     ```bash
     npx agentic-lib create-task --title "Initial Setup Task" --description "Set up the new repository with agentic workflows" --target "README.md"
     ```
   - Review the GitHub Actions logs to see how the workflows process this task.

---

## 4. Tutorial Exercises

### Exercise 1: Self-Test and Demo
- **Step 1:** Run the self-test to verify the system:
  ```bash
  npx agentic-lib self-test
  ```
- **Step 2:** Execute the demo:
  ```bash
  npx agentic-lib demo
  ```
- **Step 3:** Review outputs to confirm each workflow executes as expected.

### Exercise 2: Create and Process a Task
- **Step 1:** Create a new task using the CLI:
  ```bash
  npx agentic-lib create-task --title "Fix Logging" --description "Improve logging in the application" --target "src/lib/logger.js"
  ```
- **Step 2:** Monitor GitHub Actions to observe the issue creator and worker workflows handling the task.

### Exercise 3: Dependency Update and Code Formatting
- **Step 1:** Trigger a dependency update:
  ```bash
  npx agentic-lib update --upgradeTarget minor
  ```
- **Step 2:** Run code formatting:
  ```bash
  npx agentic-lib format --script "npm run formatting-fix && npm run linting-fix"
  ```
- **Step 3:** Observe how workflows manage pull requests and automerge changes.

---

## 5. Ideas for Seeding Your Agentic Coding System

Here are three ideas for libraries to seed your agentic coding system. Each idea begins with a brief README; then, the workflow can be prompted to fill out the code.

### Idea 1: Utility Library for Data Transformation
- **README Brief:** Outline functions for data transformation tasks (e.g., parsing CSV, JSON manipulation, data filtering).
- **Exercise:** Use the issue creator workflow to generate the boilerplate code based on the README.

### Idea 2: Microservice Helper Library
- **README Brief:** Describe a set of helper functions for building microservices (e.g., routing, error handling, logging).
- **Exercise:** Prompt the workflow to scaffold a microservice framework based on the guidelines.

### Idea 3: Test Automation Library
- **README Brief:** Define a library aimed at simplifying test automation (e.g., utilities for mocking, assertions, and test setup).
- **Exercise:** Leverage the workflows to generate starter code and unit tests as specified in the README.

---

## References to Top-Level Workflows

This guide references and builds upon the following workflow files from your repository template:
- `.github/FUNDING.yml`
- `.github/workflows/publish.yml`
- `.github/workflows/test.yml`
- `.github/workflows/issue-creator.yml`
- `.github/workflows/issue-worker.yml`
- `.github/workflows/automerge.yml`
- `.github/workflows/update.yml`
- `.github/workflows/issue-reviewer.yml`
- `.github/workflows/formating.yml`
- `.github/dependabot.yml`

By following this guide, you can set up a robust, agentic development system that uses reusable workflows as an SDK—empowering automated, consistent, and efficient project management and development.
```