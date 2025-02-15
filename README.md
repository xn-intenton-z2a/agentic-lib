# intention-agentic-lib

The **intention-agentic-lib** is a collection of reusable GitHub Actions workflows that enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK. This README describes each reusable workflow in detail—including its parameters (with types and whether they are required), responsibilities, and how top‐level jobs use them—and explains how the system can be seeded with a simple prompt to let your program evolve automatically.

---

## TODO

- [x] Run worker using a published action.
- [x] For NPM Follow [Semantic Versioning](https://semver.org/) for releases.
- [x] Expose a main as a cli
- [x] Use a separate action repository instead of relying upon the polycoder JS.
- [~] Create a new organisation for @intentïon including repositories (phase 1):
- - [x] `intentïon-agentic-lib` Open Source (Apache 2) GitHub Actions Reusable Workflows (route to market)
- - [x] `repository0` - An example project but without the apply-fixes-sarif action or permissions
- [x] Replace shell script of any complexity with github-script.
- [x] Abstract re-usable workflows into a separate repository.
- [ ] Switch from PAT to GITHUB_TOKEN.
- [ ] Feed in issue title options.
- [ ] Add prime directive to context.
- [ ] Add the ability to write to the README, test and package.json.
- [ ] Make intentïon-agentic-lib and repository1 public.

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
