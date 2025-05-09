# Objective

Provide a command-line capability to summarise and sanitise GitHub Actions workflow YAML files into concise JSON descriptions suitable for discussion contexts, removing sensitive or verbose details.

# Value Proposition

By extracting the high-level structure of workflows while masking secrets and truncating long commands, teams can share and review workflow designs without leaking credentials or overwhelming readers with implementation noise. This enhances collaboration and security in issue discussions and pull requests.

# Scope

- Modify src/lib/main.js:
  - Add a new function processSummarizeWorkflow(args) that:
    • Recognises the `--summarize-workflow <filePath>` flag.
    • Reads the specified workflow YAML file using fs.promises.readFile.
    • Parses the YAML with js-yaml to extract workflow `name`, `on` triggers, `jobs`, and within each job the `steps` names and truncated `run` or `uses` commands.
    • Masks any environment variables matching uppercase keys or secrets sections (e.g. secrets: ***) with `[MASKED]`.
    • Ensures long `run` scripts are truncated to 80 characters with an ellipsis.
    • Outputs a JSON object summarising the workflow structure on stdout and exits.
  - Integrate processSummarizeWorkflow into the main CLI flow before other flags.

- Add sandbox/tests/workflowSanitizer.test.js:
  - Create tests mocking fs.promises.readFile to return a sample YAML string with a `secrets` section and long commands.
  - Verify console.log is called once with the correctly sanitised JSON summary object.
  - Cover missing file path error and invalid YAML error handling.

- Add sandbox/docs/WORKFLOW_SUMMARIZER.md:
  - Document the new CLI flag `--summarize-workflow`, describe the JSON output schema, sanitisation rules, and include example usage.

- Update sandbox/README.md:
  - Under Command Line Interface, add an entry for `--summarize-workflow <filePath>` with a one-line description.
  - Provide an example invocation and sample JSON output.

- Dependencies:
  - Ensure js-yaml remains in package.json. No new dependencies.

# Success Criteria

1. Invoking `node src/lib/main.js --summarize-workflow path/to/workflow.yml` prints a valid JSON summary and exits.
2. Secrets and environment variables are masked, long commands are truncated.
3. Tests in sandbox/tests/workflowSanitizer.test.js cover normal and error scenarios and pass.
4. Documentation and README clearly describe usage and output format.