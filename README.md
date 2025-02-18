# intentïon agentic-lib

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your 
repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and 
issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using 
GitHub’s `workflow_call` event, so they can be composed together like an SDK. This README describes each reusable 
workflow in detail—including its parameters (with types and whether they are required), responsibilities, and how 
top‐level jobs use them—and explains how the system can be seeded with a simple prompt to let your program evolve 
automatically.

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
- [ ] Add the ability to write to the README, test and package.json.
- [ ] Find a way for consumers to link to a stable version of the reusable workflows.
- [ ] Test the link to the current version from the test file (not main but the github-ref being tested).
- [ ] Test the link to the stable version after publishing from this repository.
- [ ] *Make intentïon `agentic-lib` and repository1 public beta.*

MVP:
- [ ] Add Linting file to the context.
- [ ] Add Linting results to the context.
- [ ] Use fix-failing-build to run start issue fails, use fix-failing build to fix the branch (and max context with start issue).
- [ ] Add funding mechanisms.

Enhancements:
- [ ] Add git log to the context.
- [ ] Expose parameters for wrapped action steps with defaults matching the action steps defaults behaviour.
- [ ] Pick ideal version. Oldest? or Node 22 (after October 29th when it becomes LTS) build with the latest LTS but target the lowest compatible?
- [ ] Generate API.md based on the source file.
- [ ] Update CHANGELOG.md when a publishing a release version of the changes since the last release.
- [ ] Duplicate the test when publishing a release version with a version numbered test file.
- [ ] Add execution net capture to the context.
- [ ] Clean-up TODOs (maybe this is automated)
- [ ] Scan code for possible library replacements for the custom code (maybe this is automated)
- [ ] Compress and de-dupe package.json (maybe this is automated)
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
