# intentïon agentic-lib

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your 
repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and 
issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using 
GitHub’s `workflow_call` event, so they can be composed together like an SDK. 

[Start using the Repository Template](https://github.com/xn-intenton-z2a/repository0)

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

# Agentic Development System Guide

This guide explains how the various workflows of the Agentic Coding Systems work together to automate and streamline your development process. Think of these workflows as modular SDK components that encapsulate common operations—publishing, testing, issue management, dependency updates, code formatting, and more—allowing you to build an agentic development system for your projects.

---

## Issue Management Workflows
These workflows generalize the concept of work items as “tasks” rather than platform-specific issues.

### Issue Creator (`issue-creator.yml`)
- **Function:** Creates a new task based on predefined prompts.
- **Reusable Workflow:** [`wfr-create-issue.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-issue.yml@1.2.0)
- **Trigger:** Manual dispatch or scheduled events with input parameters.

### Issue Worker (`issue-worker.yml`)
- **Function:** Selects, validates, and initiates work on existing tasks.
- **Reusable Workflows:**
  - [`wfr-select-issue.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-select-issue.yml@1.2.0)
  - [`wfr-start-issue.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-start-issue.yml@1.2.0)
  - [`wfr-create-pr.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-pr.yml@1.2.0)

### Issue Reviewer (`issue-reviewer.yml`)
- **Function:** Reviews and finalizes tasks once work is complete.
- **Reusable Workflow:** [`wfr-review-issue.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-review-issue.yml@1.2.0)

### Automerge Workflow (`automerge.yml`)
- **Function:** Automatically merges pull requests when criteria are met.
- **Reusable Workflows:**
  - [`wfr-automerge-find-pr-from-pull-request.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-find-pr-from-pull-request.yml@1.2.0)
  - [`wfr-automerge-find-pr-in-check-suite.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-find-pr-in-check-suite.yml@1.2.0)
  - [`wfr-automerge-label-issue.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-label-issue.yml@1.2.0)
  - [`wfr-automerge-merge-pr.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-merge-pr.yml@1.2.0)

---

## Reusable Workflows SDK Guide

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

## Repository Setup Guide

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

### 3. The Evolving main.js (Experimental Work in Progress)
- **Purpose:**  
  This file showcases experimental features and serves as a testbed for integrating new ideas into the system.
- **Stability:**  
  It is under active development and may change frequently. It represents bleeding‑edge functionality that might not yet be production‑ready.
- **Licensing:**  
  As part of the core project, it is under GPL‑3 with the attribution clause.
- **Location:**  
  The experimental code is located in `src/lib/main.js`.

Each of these components is documented separately to ensure you can quickly determine which parts are ready for use and which are intended as examples or experimental features.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### TODO

- [x] Implement "apply-fix" by raising a bug, then running start-issue (with a new name) in a tolerant mode allowing builds to fail but gathering output.
- [x] Run apply fix on a schedule checking if a fix is necessary.
- [x] Add check for failed Test run then re-instate. e.g. #workflow_run:  workflows: - "Tests" / types: - completed
- [x] Detect failing build rather than relying on a passive no change
- [x] Trigger apply fix when a test run completes and attempt a fix if the tests failed, ideally just for automated branches (issues, apply-formatting, apply-linting). <- This will then fix a broken PR branch or a broken main branch.
- [x] Write issue body when creating an issue from a linting error.
- [x] repository0 init workflow which archives the 4 files (1 of 4): a generic README, package.json, src/lib/main.js, tests/unit/main.test.js, and initialises a CONTRIBUTING.md.
- [ ] repository0 seed from archived state. 
- [ ] Run the archive and initialise from a github action which clears out any open issues, branches and PRs and creates an issue with:
```
Populate a readme based on the CONTRIBUTING.md and make a detailed plan of incremental changes in the readme leading
to the realisation of the project goals in the source file, test source file, README.md and package.json
```
- [ ] Script the switch to faster schedules.
- [ ] Add PayPal donation link (the old account has been closed).
- [ ] Add git log to the context for review issue, issue worker and apply fixe
- [ ] Expose parameters for wrapped action steps with defaults matching the action steps defaults behaviour.
- [ ] Pick ideal Node version.
- [ ] Release bitpack encoder based on the template.
- [ ] Release owl-encoder based on the template.
- [ ] Consider: semantic-release for releasing versions.
- [ ] Generate API.md based on the source file.
- [ ] Update CHANGELOG.md when a publishing a release version of the changes since the last release.
- [ ] Duplicate the test when publishing a release version with a version numbered test file.
- [ ] Dashboard metrics (e.g. GitHub Insights? commits by agents)
- [ ] Publish a demo to GitHub sites

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

*IMPORTANT*: The project README and any derived work should always include the following attribution:
_"This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"_
