# APPLY_FIX Feature Specification

This feature describes the behavior of a GitHub Actions workflow that applies automated code, test, README, and dependency fixes based on outputs from build, test, and run validations. The workflow uses OpenAI's API to propose and apply changes. The following behaviors are expected:

## Scenario: Prepare and Load Inputs

**Given** the workflow is triggered with inputs such as:
- paths to key project files (`src/lib/main.js`, `README.md`, `package.json`, etc.),
- scripts to build, test, and run the application,
- and a secret API key for OpenAI,

**Then** the workflow:
- Checks out the specified branch,
- Configures Node.js and caching (if needed),
- Optionally authenticates with GitHub’s NPM registry,
- Lists existing features from the designated features directory.

## Scenario: Gather Build Context

**Given** the repository and environment are prepared,

**When** the workflow runs:

- It installs project dependencies,
- Executes the build script,
- Runs test scripts,
- Executes the main script with a timeout.

**Then** the outputs of each step are captured and saved for later context.

## Scenario: Generate Fix Proposal Using LLM

**Given** the outputs from install, build, test, and run are available,

**When** the workflow invokes the `update-target` step,

**Then** it:
- Loads contents of source files (`main.js`, test file, README, etc.),
- Assembles a prompt with all relevant project context (existing features, file contents, command outputs),
- Sends the prompt to OpenAI with a functional call schema requesting updated versions of:
  - Source file,
  - Test file,
  - README file,
  - Dependencies file.

**Then** the model responds with a structured JSON containing:
- Updated versions of the four files,
- A message suitable for use as a commit message.

## Scenario: Apply Proposed Fixes

**Given** the LLM returns updated content,

**When** the content differs from current file versions,

**Then** the workflow:
- Overwrites the respective files (`main.js`, test file, README, package.json) with the updated content,
- Logs file update status and lengths.

**If** the LLM response is invalid or missing,
- The workflow fails with an appropriate message.

## Scenario: Validate Fix Locally

**Given** updated files have been written,

**Then** the workflow:
- Re-installs dependencies (`npm install`),
- Runs CI install (`npm ci`),
- Runs the test script again,
- Runs the main script again (with timeout).

Each of these validation steps is monitored for success or failure.

## Scenario: Commit Changes

**Given** one or more files were updated,

**Then** the workflow:
- Stages and commits the changes with the sanitized commit message from the LLM,
- Pushes the branch to origin.

## Scenario: Finalize and Report

**When** all steps have completed,

**Then** the workflow:
- Summarizes outcomes of each validation step (install, CI, test, main, commit),
- Exposes output flags indicating:
  - Whether a fix was applied,
  - The commit message,
  - Success/failure of post-fix validations,
  - Whether *all* validations succeeded.

## Tags
- `@agentic`
- `@llm`
- `@autofix`
- `@ci`
- `@validation`

## Examples

| Input                  | Default Value             |
|------------------------|---------------------------|
| `featuresDir`          | `features/`               |
| `target`               | `src/lib/main.js`         |
| `testFile`             | `tests/unit/main.test.js` |
| `readmeFile`           | `README.md`               |
| `dependenciesFile`     | `package.json`            |
| `buildScript`          | `npm run build`           |
| `testScript`           | `npm test`                |
| `mainScript`           | `npm run start`           |
| `model`                | `o3-mini` or overridden   |
| `branch`               | Current branch            |

---

