# Objective and Scope
Summarize and sanitize GitHub Actions workflow files to generate concise, safe context for GitHub Discussions. The feature reads all YAML workflow files, redacts sensitive values, truncates excessive scripts or comments, and builds a clear markdown overview suitable for review or posting in a discussion.

# Value Proposition
Maintainers and contributors gain immediate visibility into CI/CD workflows without exposing secrets or overwhelming detail. By centralizing sanitized workflow summaries in Discussions, teams can collaborate on workflow logic, spot misconfigurations, and propose improvements efficiently.

# Requirements

- In src/lib/main.js add function fetchWorkflowFiles:
  - Accepts parameter dirPath (default .github/workflows).
  - Reads all .yml and .yaml files under dirPath using fs.
  - Parses each file as YAML and returns an array of workflow objects with file names.

- In src/lib/main.js add function sanitizeWorkflowData:
  - Accepts a workflow object.
  - Removes or masks any entries under env, secrets, or with keys matching /password|token|key/i.
  - Truncates script or run fields longer than 200 characters, appending ellipsis.
  - Returns sanitized workflow object.

- In src/lib/main.js add function generateWorkflowSummaryMarkdown:
  - Accepts array of sanitized workflows.
  - Generates markdown sections for each workflow with headings:
    - File Name
    - Workflow Name
    - Triggers (on)
    - Jobs list (job names)
    - Steps list (step names)
  - Returns complete markdown string.

- Extend CLI argument parser to support:
  --summarize-workflows with options:
    --path <path>  Path to workflows directory, default .github/workflows
    --discussion-id <id>  Target GitHub Discussion number for posting
    --json  Flag to output raw summary object as JSON

- Behavior when invoked:
  - Invoke fetchWorkflowFiles and sanitizeWorkflowData on each.
  - Invoke generateWorkflowSummaryMarkdown.
  - If --discussion-id provided, post or update a comment in that discussion via GitHub REST API.
  - If --json flag is set, output the sanitized workflow objects as JSON instead of markdown.

- Update README.md:
  - Document --summarize-workflows flag, its parameters, usage examples, and sample markdown output.

- Add unit tests in tests/unit/main.test.js:
  - Mock fs to supply example workflow YAML files.
  - Verify sanitization removes sensitive fields and truncates long scripts.
  - Verify markdown summary structure and content.
  - Mock GitHub API posting and assert correct endpoints and payloads.

# Verification and Acceptance

- Unit tests cover normal, sensitive, and edge-case workflows.
- Manual test by running CLI against a sample .github/workflows directory and confirming correct markdown or JSON output.
- Integration test: post summary to a dummy Discussion and verify creation/update.