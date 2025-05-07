# Objective and Scope

Provide a CLI command that reads all reusable GitHub workflow YAML files in .github/workflows, removes or replaces any sensitive values, and produces a concise summary of events, jobs, and steps. The output is suitable for discussion threads, reviews, or documentation without exposing tokens, secrets, or internal URLs.

# Value Proposition

Enable teams to quickly understand and review the logic of workflows without exposing confidential data. Improves transparency in discussions by presenting a sanitized overview of triggers, job names, and high-level step descriptions, reducing manual effort and risk of leaking sensitive information.

# Requirements

## CLI Integration

- Introduce a new flag:
  - --summarize-workflows (alias --sum-workflows)
- Usage examples:
  - node src/lib/main.js --summarize-workflows
  - npm run start -- --sum-workflows

## Workflow File Retrieval

- Scan the .github/workflows directory for any .yml or .yaml files.
- Reject non-YAML files.

## Sanitization

- Remove or replace all values under keys named secrets, env.GITHUB_TOKEN, or with patterns matching *_TOKEN or *_KEY.
- Replace removed values with the placeholder "REDACTED".

## Summary Generation

- For each workflow file, extract:
  - name field (or filename if missing)
  - on triggers (push, pull_request, workflow_dispatch, etc.)
  - top-level job names and their run steps count
- Format a summary object or markdown:
  - Workflow: name
    - Triggers: list
    - Jobs:
      - jobName: stepCount steps

## Output

- Print the sanitized summary to stdout as markdown.
- Optionally write to WORKFLOWS_SUMMARY.md in project root if a --output flag is provided.

## Documentation Updates

- Update README.md:
  - Document the new flag and alias.
  - Include example summary output.
  - Describe sanitization behavior.

# Verification and Acceptance

- Unit tests mock fs to return sample workflow YAML content. Verify sanitization removes secret values and summary content lists correct fields.
- CLI integration tests ensure invoking the flag prints expected markdown or writes to file when --output is specified.
- Manual test in a sample repo with real workflows produces a readable, redacted summary file.