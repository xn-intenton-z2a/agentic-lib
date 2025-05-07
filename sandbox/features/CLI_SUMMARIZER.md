# Objective and Scope

Extend the CLI to provide a unified summarizer command that supports two distinct modes:

- A workflow diagram summarization mode that reads one or more GitHub Actions workflow YAML files and outputs a Mermaid graph or JSON model of job dependencies.
- A repository stats and status summary mode that inspects the current project directory and reports key metrics such as file counts, dependency versions, latest Git commit, test coverage status, and CLI command availability.

This feature consolidates the existing workflow diagram summarizer and the new summary command into one cohesive CLI summarization tool.

# Value Proposition

- Developers gain a single entrypoint to extract both workflow interaction diagrams and high-level repository health metrics.
- Reduces context switching by integrating two essential diagnostics into a single CLI command.
- Enhances onboarding and maintenance by automating extraction of both CI workflow visuals and repository status reports.

# Requirements

## CLI Integration

- Introduce a new flag `--summary [mode]` where mode defaults to `repo` and can be set to `workflow` for the existing diagram summarizer functionality.
- Recognize both `--summarize-workflow-diagram [path]` (legacy flag) and `--summary workflow [path]` as synonyms.
- When mode is `repo`, scan the repository root for:
  - Total number of source files under `src/lib` and tests under `tests/unit`.
  - List of direct dependencies and their versions as defined in `package.json`.
  - Latest Git commit hash, author, and date, falling back to `git rev-parse` commands.
  - Test results summary by invoking `npm test -- --reporter json` or reading coverage report file if present.
- Output the repository summary as a JSON object via `logInfo` and exit code 0.
- Errors (e.g., missing git, test failures, file read errors) must call `logError` and exit code 1.

## Source File Updates

- In `src/lib/main.js`, implement `processSummaryCommand(args)`:
  - Parse `--summary` arguments to determine `repo` or `workflow` mode.
  - For `workflow`, delegate to the existing `processWorkflowDiagramSummarizer` logic.
  - For `repo`, use `fs`, `child_process.execSync`, and JSON parsing of `package.json` and test reports.
- Update `main` to invoke `processSummaryCommand` before other flags.

## Test File Updates

- Add tests in `tests/unit/cliSummarizer.test.js`:
  - Mock `fs.readdirSync` and `fs.readFileSync` for repo file counts and dependency versions.
  - Mock `child_process.execSync` to return fake git commit info.
  - Mock a JSON test reporter output to simulate test pass/fail summary.
  - Invoke `main` with `--summary`, `--summary repo`, and `--summary workflow` and verify correct `logInfo` or `logError` calls and exit codes.
- Retain existing tests for `--summarize-workflow-diagram` to ensure backward compatibility.

## README Updates

- Under CLI Usage, add:
```
--summary [mode] [path]
    Generate a summary report. Mode can be "repo" (default) for repository metrics or "workflow" for workflow diagram. Defaults to current repo and .github/workflows directory.
```
- Provide examples:
```
npx agentic-lib --summary
npx agentic-lib --summary repo
npx agentic-lib --summary workflow .github/workflows
```

## Dependencies

- No new dependencies. Use existing `fs`, `child_process`, and `js-yaml` modules.
