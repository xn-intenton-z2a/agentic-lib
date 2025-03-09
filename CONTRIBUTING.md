# agentic‑lib

Thank you for your interest in contributing to **agentic‑lib**! This document outlines our guidelines for human and 
automated contributions, ensuring that our core library remains robust, testable, and efficient in powering our 
reusable GitHub Workflows.

## Mission Statement

**agentic‑lib** Is a JavaScript library which can be used as a drop in JS implementation or wholesale replacement for 
the steps, jobs, and re-usable workflows below in this repository. It is designed to be used in a GitHub Actions 
workflow to enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate
through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be
invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.

Example of source from the GitHub worklflow file to implement as JavaScript (Node 20 / ESM) functions in a library:
START_OF_CONCATENATED_WORKFLOW_FILE
```
# .github/workflows/wfr-create-issue.yml

#
# agentic-lib
# Copyright (C) 2025 Polycode Limited
#
# This file is part of agentic-lib.
#
# agentic-lib is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License v3.0 (GPL‑3).
# along with this program. If not, see <https://www.gnu.org/licenses/>.
#
# IMPORTANT: Any derived work must include the following attribution:
# "This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
#

name: ∞ Create issue

on:
  workflow_call:
    inputs:
      issueTitle:
        description: 'Text to drive the issue title (if "house choice", a random prompt will be selected).'
        required: false
        type: string
        default: 'house choice'
      issueBody:
        description: 'Text to drive the issue body.'
        required: false
        type: string
        default: 'Please resolve the issue.'
      houseChoiceOptions:
        description: 'Options for house choice, separated by double pipes "||".'
        type: string
        required: false
        default: 'Make code changes that extend or improve the features or resolve issues shown in the included context.'
    secrets:
      PERSONAL_ACCESS_TOKEN:
        required: false
    outputs:
      issueTitle:
        description: 'The issue title to resolve. e.g. "Make a small improvement."'
        value: ${{ jobs.create-issue.outputs.issueTitle }}
      issueNumber:
        description: 'The issue number to review. e.g. "123"'
        value: ${{ jobs.create-issue.outputs.issueNumber }}

jobs:
  create-issue:
    runs-on: ubuntu-latest

    env:
      issueTitle: ${{ inputs.issueTitle || 'house choice' }}
      issueBody: ${{ inputs.issueBody || 'Please resolve the issue.' }}
      houseChoiceOptions: ${{ inputs.houseChoiceOptions || 'Make code changes that extend or improve the features or resolve issues shown in the included context.'}}

    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: create-issue
        id: create-issue
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}
          script: |
            const issueTitle = process.env.issueTitle;
            const issueBody = process.env.issueBody;
            const houseChoiceOptions = process.env.houseChoiceOptions.split('||');

            let selectedIssueTitle;
            if (issueTitle === 'house choice') {
              selectedIssueTitle = houseChoiceOptions[Math.floor(Math.random() * houseChoiceOptions.length)];
            } else {
              selectedIssueTitle = issueTitle;
            }

            const { data: issue } = await github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: selectedIssueTitle,
              body: issueBody,
              labels: ['automated']
            });

            core.setOutput("issueTitle", selectedIssueTitle);
            core.setOutput("issueBody", issueBody);
            core.setOutput("issueNumber", issue.number);
            core.info(`issueTitle: ${selectedIssueTitle}`);
            core.info(`issueBody: ${issueBody}`);    
            core.info(`issueNumber: ${issue.number}`);

    outputs:
      issueTitle: ${{ steps.create-issue.outputs.issueTitle }}
      issueBody: ${{ steps.create-issue.outputs.issueBody }}
      issueNumber: ${{ steps.create-issue.outputs.issueNumber }}
```
END_OF_CONCATENATED_WORKFLOW_FILE

Example OpenAI function to implement as JavaScript function which exports a simple function with the same signature as the openAI funcion that it wraps (Node 20 / ESM) functions in a library:
START_OF_OPENAI_FUNCTION_EXAMPLE_JS
```
            const ResponseSchema = z.object({ fixed: z.string(), message: z.string(), refinement: z.string() });
            
            // Define the function schema for function calling
            const tools = [{
              type: "function",
              function: {
                name: "review_issue",
                description: "Evaluate whether the supplied source file content resolves the issue. Return an object with fixed (string: 'true' or 'false'), message (explanation), and refinement (suggested refinement).",
                parameters: {
                  type: "object",
                  properties: {
                    fixed: { type: "string", description: "true if the issue is resolved, false otherwise" },
                    message: { type: "string", description: "A message explaining the result" },
                    refinement: { type: "string", description: "A suggested refinement if the issue is not resolved" }
                  },
                  required: ["fixed", "message", "refinement"],
                  additionalProperties: false
                },
                strict: true
              }
            }];

            // Call OpenAI using function calling format
            const response = await openai.chat.completions.create({
              model,
              messages: [
                { role: "system", content: "You are evaluating whether an issue has been resolved in the supplied source code. Answer strictly with a JSON object following the provided function schema." },
                { role: "user", content: prompt }
              ],
              tools: tools
            });
            
            let result;
            if (response.choices[0].message.tool_calls && response.choices[0].message.tool_calls.length > 0) {
              try {
                result = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments);
              } catch (e) {
                core.setFailed(`Failed to parse function call arguments: ${e.message}`);
              }
            } else if (response.choices[0].message.content) {
              try {
                result = JSON.parse(response.choices[0].message.content);
              } catch (e) {
                core.setFailed(`Failed to parse response content: ${e.message}`);
              }
            } else {
              core.setFailed("No valid response received from OpenAI.");
            }
```
END_OF_OPENAI_FUNCTION_EXAMPLE_JS

Our goal is to continuously improve and extend these capabilities, making **agentic‑lib** the trusted engine behind automated contributions and continuous integration.

---
---
---

## How to Contribute

Contributions come in many forms—whether you’re a developer, tester, or an advocate for process improvements. Here’s how you can help:

1. **Report Issues or Ideas:**  
   Open an issue on GitHub to share bug reports, feature requests, or any improvements you envision. Clear descriptions and reproducible steps are highly appreciated.

2. **Submit Pull Requests:**
    - Fork the repository and create a feature branch.
    - Implement your changes, ensuring you follow our coding style and standards.
    - Add tests to cover any new functionality.
    - Update documentation if your changes affect usage or workflow behavior.
    - Submit your pull request for review.

3. **Enhance Automated Workflows:**  
   Contributions might include adjustments to:
    - The AI-based fix verification logic.
    - File update routines responding to build, test, or main output.
    - Logic for extracting issue numbers from branch names.
    - Automated pull request merging or listing mechanisms.

4. **Run and Test the Library:**  
   To explore the capabilities of **agentic‑lib**, run the demo function with:
   ```bash
   npm run start [--help]
   ```
   This command prints a detailed help message, including available functions and parameters.

## Guidelines

- **Code Quality:**  
  Write modular, clean, and fully testable code. Our design intentionally decouples functionality from GitHub Actions globals to enhance testability and reuse.

- **Documentation:**  
  Keep inline comments and this Contributing.md up-to-date as you introduce changes. Clear documentation ensures the project stays accessible to both human and AI collaborators.

- **Compatibility:**  
  Ensure your code runs on Node 20 and adheres to ECMAScript Module (ESM) standards.

- **Feedback & Collaboration:**  
  We welcome constructive feedback. Engage with maintainers and peers through GitHub issues and pull request discussions to improve our collective workflow.

## Agentic contribution house choice options (programmatically parsed): START

Workflow schedule: schedule-1

## Issue House Choice Options

agentic-lib activities:
- Implement, vary or extend a workflow behaviour similar one in the supplied wfr-create-issue.yml. Update the Change log in README.md (or say what was checked).
- Implement, vary or extend a wrapper for an OpenAI function similar to the supplied OpenAI function. Update the Change Log in README.md (or say what was checked).
- Speculate what remote services may be useful to an agentic workflow and implement a wrapper for them. Update the Change Log in README.md (or say what was checked).
- Create, vary or extend as many library functions as you can gather telemetry data from GitHub Actions Workflows. Update the Change Log in README.md (or say what was checked).
- Create, vary or extend as many library functions as you can that use OPEN AI functions to wrap the delegation of a decision to an advanced LLM based chat completions API. Update the Change Log in README.md (or say what was checked).
- Create, vary or extend as many library functions as you can that use Kafka like messaging systems to communicate with other agentic workflows. Update the Change Log in README.md (or say what was checked).
- Create, vary or extend as many library functions as you can that use parse vitest's or eslint's default output or parse output in SARIF format. Update the Change Log in README.md (or say what was checked).

generic activities:
- Update the source file by applying the Mission Statement to prune any "drift" from the source file. Update the Change Log in README.md (or say what was checked).
- Create, vary or extend as many features in the source file as you can inline with the Mission Statement. Update the Change Log in README.md (or say what was checked).

undocumented chores:
- Refresh the README, consulting the guidance in CONTRIBUTING.md while retaining any relevant content and pruning irrelevant content.
- Bring test coverage up as close to 100% as possible, have single layer mocked tests and deeper tests mocking at the external resource (e.g. file system or network).

## Agentic contribution house choice options (programmatically parsed): END

unused generic activities:
- Find anything that might be a "simulated" or "demo" implementation and switch to a real implementation. Update the Change Log in README.md (or say what was checked).
- Consider alternate code paths that could be explicitly handled to improve the range of supported behaviours. Update the Change Log in README.md (or say what was checked).
- Look for code that could be simplified using a library and introduce that library. Update the Change Log in README.md (or say what was checked).

unused undocumented chores:
- Look for any duplicated code that could be usefully abstracted out to become shared code and implement that abstraction.
- Dry-run any examples in comments or the README against the current code and if they are not accurate or if they could cover more features, update the docs or code to be accurate.
- Ensure the main function so that it generates some demo output without an over the wire call, and hint a CLI switch that will do the real call.

---
---
---

# Ensure README.md begins like this:

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
---
---

# Ensure README.md ends like this:

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

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

### 3. The Evolving main.js (JavaScript re-implementation of Re‑usable Workflows)
- **Purpose:**  
  This file implements the Re‑usable Workflows above as a JavaScript module, enabling programmatic access to the core functionality.
- **Stability:**  
  It is under active development and may change frequently. It represents bleeding‑edge functionality that might not yet be production‑ready.
- **Licensing:**  
  As part of the core project, it is under GPL‑3 with the attribution clause.
- **Location:**  
  The code is located in `src/lib/main.js`.

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

---
---
---