# intention-agentic-lib

The **intention-agentic-lib** is a collection of reusable GitHub Actions workflows that enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK. This README describes each reusable workflow in detail—including its parameters (with types and whether they are required), responsibilities, and how top‐level jobs use them—and explains how the system can be seeded with a simple prompt to let your program evolve automatically.

---

## Overview of Reusable Workflows

Below is a detailed list of the reusable workflows included in the SDK. Each workflow accepts a defined set of inputs (parameters) and secrets and provides specific outputs. These workflows serve as building blocks for higher-level automation tasks.

---

### 1. **wfr‑review‑issue.yml**

**Responsibility:**  
Reviews a specific issue by checking whether the target source file reflects the fix. It runs build, test, and “main” commands, then uses the ChatGPT API to determine if the issue is resolved. If so, it can post comments on the issue (e.g. “The issue has been automatically resolved”) and set an output flag.

**Parameters (Inputs):**
- **issueNumber**  
  _Type:_ string  
  _Required:_ Yes  
  _Description:_ The issue number to review (e.g. `"123"`).

- **target**  
  _Type:_ string  
  _Required:_ No (Default: `"src/lib/main.js"`)  
  _Description:_ The file to review.

- **buildScript**  
  _Type:_ string  
  _Required:_ No (Default: `echo "No build script specified."`)  
  _Description:_ Command to build the project (should exit with 0 on success).

- **testScript**  
  _Type:_ string  
  _Required:_ No (Default: `"npm test"`)  
  _Description:_ Command to run tests.

- **mainScript**  
  _Type:_ string  
  _Required:_ No (Default: `"node src/lib/main.js"`)  
  _Description:_ Command to run the main application.

- **model**  
  _Type:_ string  
  _Required:_ No (Default: `"o3-mini"`)  
  _Description:_ The OpenAI model to use for evaluation.

**Secrets:**
- **PERSONAL_ACCESS_TOKEN** – Required
- **CHATGPT_API_SECRET_KEY** – Required

**Outputs:**
- **fixed** – The output value (from `jobs.review-issue.outputs.fixed`) that indicates whether the issue is fixed.

---

### 2. **wfr‑apply‑fixes‑sarif‑on‑branches.yml**

**Responsibility:**  
Processes a given branch (e.g. an issue branch) by running build and SARIF analysis (via a linting tool) to assess code quality. If issues are detected, it uses an AI‐assisted workflow (via a separate action call) to apply fixes, commits the changes, and (if configured) creates a pull request.

**Parameters (Inputs):**
- **branch**  
  _Type:_ string  
  _Required:_ Yes  
  _Description:_ The branch to process (e.g. `"issue-123"`).

- **resultsToResolve**  
  _Type:_ string  
  _Required:_ No (Default: `"3"`)  
  _Description:_ The target number of issues (SARIF results) to resolve.

- **iterations**  
  _Type:_ string  
  _Required:_ No (Default: `"10"`)  
  _Description:_ The maximum number of iterations for fixing.

- **baseDir**  
  _Type:_ string  
  _Required:_ No (Default: `"."`)  
  _Description:_ The base directory relative to which paths are resolved.

- **buildScript**  
  _Type:_ string  
  _Required:_ No (Default: `"npm run build"`)  
  _Description:_ Command to build the project.

- **sarifScript**  
  _Type:_ string  
  _Required:_ No (Default:  
  `npx --silent eslint --fix --format=@microsoft/eslint-formatter-sarif .`)  
  _Description:_ Command that runs a SARIF-compatible linting/fixing tool.

- **testScript**  
  _Type:_ string  
  _Required:_ No (Default: `"npm test"`)  
  _Description:_ Command to run tests.

- **npmAuthOrganisation**  
  _Type:_ string  
  _Required:_ No (Default: `"true"`)  
  _Description:_ Whether to perform npm authentication.

- **gitUserEmail**  
  _Type:_ string  
  _Required:_ No (Default: `"action@github.com"`)  
  _Description:_ Email for git commits.

- **gitUserName**  
  _Type:_ string  
  _Required:_ No (Default: `"GitHub Actions[bot]"`)  
  _Description:_ Name for git commits.

**Secrets:**
- **PERSONAL_ACCESS_TOKEN** – Required
- **CHATGPT_API_SECRET_KEY** – Required

---

### 3. **wfr‑fix‑failing‑build.yml**

**Responsibility:**  
Handles failing builds by running build, test, and main commands in a “tolerant” mode (i.e. errors do not immediately abort the workflow). It then invokes the ChatGPT API to produce an updated version of the target file to resolve the issue. Finally, it commits the changes on a new branch and outputs whether a fix was applied.

**Parameters (Inputs):**
- **target**  
  _Type:_ string  
  _Required:_ No (Default: `"src/lib/main.js"`)  
  _Description:_ The target file to review/fix.

- **branchPrefix**  
  _Type:_ string  
  _Required:_ Yes  
  _Description:_ The prefix for the issue branch (e.g. `"issue-"`).

- **buildScript**  
  _Type:_ string  
  _Required:_ No (Default: `echo "No build script specified."`)  
  _Description:_ Command to build the project.

- **testScript**  
  _Type:_ string  
  _Required:_ No (Default: `"npm test"`)  
  _Description:_ Command to run tests.

- **mainScript**  
  _Type:_ string  
  _Required:_ No (Default: `"node src/lib/main.js"`)  
  _Description:_ Command to run the main program.

- **model**  
  _Type:_ string  
  _Required:_ No (Default: `"o3-mini"`)  
  _Description:_ The OpenAI model to use for generating fixes.

- **gitUserEmail**  
  _Type:_ string  
  _Required:_ No (Default: `"action@github.com"`)  
  _Description:_ Email for git commits.

- **gitUserName**  
  _Type:_ string  
  _Required:_ No (Default: `"GitHub Actions[bot]"`)  
  _Description:_ Name for git commits.

**Secrets:**
- **PERSONAL_ACCESS_TOKEN** – Required
- **CHATGPT_API_SECRET_KEY** – Required

**Outputs:**
- **fixApplied** – Whether a fix was applied (from `jobs.start-issue.outputs.fixApplied`).
- **message** – The commit message or explanation (from `jobs.start-issue.outputs.message`).

---

### 4. **wfr‑automerge‑label‑issue.yml**

**Responsibility:**  
Extracts the issue number from a pull request branch name (by matching a given prefix) and then automatically adds a “merged” label and a comment to the corresponding issue.

**Parameters (Inputs):**
- **pullNumber**  
  _Type:_ string  
  _Required:_ Yes  
  _Description:_ The pull request number (e.g. `"123"`).

- **branchPrefix**  
  _Type:_ string  
  _Required:_ Yes  
  _Description:_ The prefix used in branch names to derive the related issue number (e.g. `"issue-"`).

**Secrets:**
- **PERSONAL_ACCESS_TOKEN** – Required

---

### 5. **wfr‑automerge‑merge‑pr.yml**

**Responsibility:**  
Attempts to automatically merge a pull request if it is in an appropriate state (open and mergeable with a clean state). It uses a squash merge and deletes the PR branch afterward.

**Parameters (Inputs):**
- **pullNumber**  
  _Type:_ string  
  _Required:_ Yes  
  _Description:_ The pull request number to merge.

**Secrets:**
- **PERSONAL_ACCESS_TOKEN** – Required

**Outputs:**
- **prMerged** – A flag (string) indicating whether the PR was merged (from `jobs.check-pr.outputs.prMerged`).

---

### 6. **wfr‑start‑issue.yml**

**Responsibility:**  
Begins the issue resolution process by running build, test, and main commands, then invoking the ChatGPT API to generate a fix. It commits the fix on a new branch and posts comments to the issue.

**Parameters (Inputs):**
- **issueNumber**  
  _Type:_ string  
  _Required:_ Yes  
  _Description:_ The issue number to process.

- **target**  
  _Type:_ string  
  _Required:_ No (Default: `"src/lib/main.js"`)  
  _Description:_ The source file to be updated.

- **branchPrefix**  
  _Type:_ string  
  _Required:_ Yes  
  _Description:_ The prefix for the new branch (e.g. `"issue-"`).

- **buildScript**  
  _Type:_ string  
  _Required:_ No (Default: `"npm run build"`)  
  _Description:_ Command to build the project.

- **testScript**  
  _Type:_ string  
  _Required:_ No (Default: `"npm test"`)  
  _Description:_ Command to run tests.

- **mainScript**  
  _Type:_ string  
  _Required:_ No (Default: `"node src/lib/main.js"`)  
  _Description:_ Command to run the main program.

- **model**  
  _Type:_ string  
  _Required:_ No (Default: `"o3-mini"`)  
  _Description:_ The OpenAI model to use for generating the fix.

- **gitUserEmail**  
  _Type:_ string  
  _Required:_ No (Default: `"action@github.com"`)  
  _Description:_ Email for git commits.

- **gitUserName**  
  _Type:_ string  
  _Required:_ No (Default: `"GitHub Actions[bot]"`)  
  _Description:_ Name for git commits.

**Secrets:**
- **PERSONAL_ACCESS_TOKEN** – Required
- **CHATGPT_API_SECRET_KEY** – Required

**Outputs:**
- **fixApplied** – Whether a fix was applied.
- **message** – A message describing the applied fix.

---

### 7. **wfr‑update.yml**

**Responsibility:**  
Updates dependencies and packages in the repository. It can optionally delete all GitHub Actions caches, run builds and tests, update dependencies, and create a pull request with the updated version.

**Parameters (Inputs):**
- **deleteAllCaches**  
  _Type:_ string  
  _Required:_ No (Default: `"false"`)  
  _Description:_ Whether to delete all caches.

- **buildScript**  
  _Type:_ string  
  _Required:_ No (Default: `echo "No build script specified."`)  
  _Description:_ Command to build the project.

- **testScript**  
  _Type:_ string  
  _Required:_ No (Default: `"npm test"`)  
  _Description:_ Command to run tests.

- **mainScript**  
  _Type:_ string  
  _Required:_ No (Default: `"node src/lib/main.js"`)  
  _Description:_ Command to run the main program.

- **upgradeTarget**  
  _Type:_ string  
  _Required:_ No (Default: `"minor"`)  
  _Description:_ The type of upgrade (e.g. `"patch"`, `"minor"`, or `"major"`).

- **npmAuthOrganisation**  
  _Type:_ string  
  _Required:_ No (Default: `"true"`)  
  _Description:_ Whether to authenticate with npm.

- **gitUserEmail**  
  _Type:_ string  
  _Required:_ No (Default: `"action@github.com"`)  
  _Description:_ Email for git commits.

- **gitUserName**  
  _Type:_ string  
  _Required:_ No (Default: `"GitHub Actions[bot]"`)  
  _Description:_ Name for git commits.

- **gitCommitMessage**  
  _Type:_ string  
  _Required:_ No (Default: `"chore: dependency updates"`)  
  _Description:_ Commit message for the updates.

**Secrets:**
- **PERSONAL_ACCESS_TOKEN** – Required

**Outputs:**
- **fixRequired** – Whether further fixes are required (references a job output; ensure the reference is valid).

---

### 8. **wfr‑update‑prs.yml**

**Responsibility:**  
Iterates over open pull requests in the repository and, for each PR, compares its branch with the base branch. If the PR branch is behind, it attempts to merge the base branch into it, ensuring that open PRs are kept up to date.

**Parameters (Inputs):**
- **baseBranch**  
  _Type:_ string  
  _Required:_ No (Default: `"main"`)  
  _Description:_ The base branch to compare against.

- **pulls**  
  _Type:_ string  
  _Required:_ No (Default: `"100"`)  
  _Description:_ The maximum number of PRs to process.

**Secrets:**
- **PERSONAL_ACCESS_TOKEN** – Required

---

### 9. **wfr‑create‑issue.yml**

**Responsibility:**  
Creates an issue in the repository based on a supplied issue title and target file. It randomly selects a title from a list if “dealers choice” is provided.

**Parameters (Inputs):**
- **issueTitle**  
  _Type:_ string  
  _Required:_ No (Default: `"dealers choice"`)  
  _Description:_ Text to drive the issue title.

- **target**  
  _Type:_ string  
  _Required:_ No (Default: `"src/lib/main.js"`)  
  _Description:_ The asset (file) referenced in the issue.

**Secrets:**
- **PERSONAL_ACCESS_TOKEN** – Required

**Outputs:**
- **issueTitle** – The final issue title.
- **issueNumber** – The created issue number.

---

### 10. **wfr‑create‑intention.yml**

**Responsibility:**  
Creates a “fix intention” by checking out the repository, ensuring that no branch with the same prefix exists, generating a unique branch name (via a UUID), and pushing a new branch. This branch represents an intent to fix an issue.

**Parameters (Inputs):**
- **branchPrefix**  
  _Type:_ string  
  _Required:_ Yes  
  _Description:_ The prefix for the new branch (e.g. `"issue-"`).

- **testScript**  
  _Type:_ string  
  _Required:_ No (Default: `"npm test"`)  
  _Description:_ Command to run tests (for validation).

- **npmAuthOrganisation**  
  _Type:_ string  
  _Required:_ No (Default: `"true"`)  
  _Description:_ Whether to authenticate with npm.

- **gitUserEmail**  
  _Type:_ string  
  _Required:_ No (Default: `"action@github.com"`)  
  _Description:_ Email for git commits.

- **gitUserName**  
  _Type:_ string  
  _Required:_ No (Default: `"GitHub Actions[bot]"`)  
  _Description:_ Name for git commits.

**Secrets:**
- **PERSONAL_ACCESS_TOKEN** – Required

**Outputs:**
- **fixRequired** – A flag indicating whether a fix is required (from the output of a step that checks for fixes).

---

### 11. **wfr‑automerge‑check‑pr‑and‑merge.yml**

**Responsibility:**  
Checks if a pull request is mergeable (e.g. open, mergeable state clean) and if so, automatically merges it using squash merge. It then deletes the PR branch and outputs the merge status.

**Parameters:**  
_No explicit inputs._

**Secrets:**
- **PERSONAL_ACCESS_TOKEN** – Required

**Outputs:**
- **pullNumber** – The pull request number.
- **shouldSkipMerge** – A flag to indicate if merging should be skipped.
- **prMerged** – A flag to indicate whether the PR was merged.

---

### 12. **wfr‑automerge‑find‑pr‑in‑check‑suite.yml**

**Responsibility:**  
During a check suite event, it finds the associated pull request that has the “automerge” label and outputs details for further processing (such as merging).

**Parameters:**  
_No explicit inputs._

**Secrets:**
- **PERSONAL_ACCESS_TOKEN** – Required

**Outputs:**
- **pullNumber**
- **shouldSkipMerge**
- **prMerged**

---

### 13. **wfr‑select‑issue.yml**

**Responsibility:**  
Selects an issue for review either by a given issue number or by listing open issues with a specified label. It outputs the selected issue number and whether the issue is marked as “merged.”

**Parameters (Inputs):**
- **issueNumber**  
  _Type:_ string  
  _Required:_ Yes  
  _Description:_ The issue number to review.

- **selectionLabel**  
  _Type:_ string  
  _Required:_ No (Default: `"merged"`)  
  _Description:_ The label used to filter issues.

**Secrets:**
- **PERSONAL_ACCESS_TOKEN** – Required
- **CHATGPT_API_SECRET_KEY** – Required

**Outputs:**
- **issueNumber**
- **merged**

---

## Responsibilities of Top‐Level Jobs

The intention-agentic-lib is composed of higher‐level jobs that combine these reusable workflows into end‐to‐end processes:

- **Issue Review & Fix Process:**  
  – _Composed from:_ `wfr-review-issue.yml` and `wfr-start-issue.yml`  
  – _Responsibility:_ Automatically review a given issue and, if necessary, trigger a fix process that uses ChatGPT to update the target file, commit the fix on a new branch, and post comments to the issue.

- **Failing Build Resolution:**  
  – _Composed from:_ `wfr-fix-failing-build.yml`  
  – _Responsibility:_ Detect failing builds, use a tolerant run of build/test/main commands, and generate fixes via ChatGPT. It then commits changes on a dedicated branch and optionally creates a pull request.

- **Automerge Pipeline:**  
  – _Composed from:_ `wfr-automerge-label-issue.yml`, `wfr-automerge-merge-pr.yml`, `wfr-automerge-check-pr-and-merge.yml`, and `wfr-automerge-find-pr-in-check-suite.yml`  
  – _Responsibility:_ Evaluate pull requests for mergeability, perform an automated merge if criteria are met (e.g. clean merge state), delete the associated branch, and update the related issue (by labeling it “merged”).

- **Update Dependencies:**  
  – _Composed from:_ `wfr-update.yml` and `wfr-update-prs.yml`  
  – _Responsibility:_ Update dependency versions and packages, optionally clearing caches; run builds and tests; and create pull requests for dependency updates.

- **Issue Creation and Fix Intention:**  
  – _Composed from:_ `wfr-create-issue.yml`, `wfr-create-intention.yml`, and `wfr-select-issue.yml`  
  – _Responsibility:_ Seed new issues (with automatically generated titles if needed), select issues for further processing, and create a fix intention branch for future updates.

- **Code Formatting and Push:**  
  – _Composed from:_ `wfr-run-script-and-push-changes.yml`  
  – _Responsibility:_ Automatically format the code (e.g. using Prettier), run tests, and push the formatted code back to the repository.

---

## Seeding a Program with a Simple Prompt and Letting It Evolve

The intention-agentic-lib can be used as an evolutionary engine for your project. Here’s an example scenario:

1. **Seed the Program:**  
   You provide a simple prompt such as “Improve error handling in the data parser module.”  
   – An issue is automatically created using the **wfr-create-issue.yml** workflow, with a title selected either from your prompt or from a pre-defined list.

2. **Review and Analyze:**  
   The **wfr-review-issue.yml** workflow is triggered to check whether the target file (e.g. `src/lib/main.js`) reflects the desired improvement. It runs build, test, and main commands and uses ChatGPT to assess the current state.

3. **Trigger a Fix:**  
   If the review detects that the issue is unresolved, the **wfr-start-issue.yml** or **wfr-fix-failing-build.yml** workflow is invoked to generate a fix. Using AI, it creates an updated version of the source file that addresses the problem, commits the changes on a dedicated branch (e.g. with the prefix `issue-`), and posts a comment with the rationale.

4. **Automatic Merging:**  
   Once a fix is applied and passes tests, the **wfr-automerge-merge-pr.yml** workflow (in conjunction with the check and label workflows) automatically merges the pull request and updates the corresponding issue.

5. **Continuous Evolution:**  
   Additional workflows (such as dependency updates with **wfr-update.yml** and formatting with **wfr-run-script-and-push-changes.yml**) ensure that your codebase remains current and well formatted. The entire system creates a feedback loop where a single prompt can trigger a cascade of automated reviews, fixes, and updates—allowing your program to evolve over time with minimal human intervention.

---

## How to Use the SDK

1. **Import Reusable Workflows:**  
   In your project’s main workflow files, call the reusable workflows using the `uses:` syntax. For example, to review an issue:
   ```yaml
   jobs:
     review:
       uses: ./.github/workflows/wfr-review-issue.yml
       with:
         issueNumber: "123"
         target: "src/lib/main.js"
         buildScript: "npm run build"
         testScript: "npm test"
         mainScript: "node src/lib/main.js"
         model: "o3-mini"
       secrets:
         PERSONAL_ACCESS_TOKEN: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
         CHATGPT_API_SECRET_KEY: ${{ secrets.CHATGPT_API_SECRET_KEY }}
   ```

2. **Chain Workflows Together:**  
   Use outputs from one workflow as inputs for another. For example, if an issue review workflow outputs `fixed`, then trigger an automerge workflow based on that flag.

3. **Customize Parameters:**  
   Each workflow accepts parameters with sensible defaults. Override them as needed to fit your project’s structure and requirements.

4. **Seed and Evolve:**  
   With a simple prompt (e.g. a new issue), the system will automatically review, generate fixes using ChatGPT, commit changes, and merge them—allowing the program to evolve autonomously.

---
