# Objective and Scope

Add a new CLI flag --summarize-workflow-diagram that reads one or more GitHub Actions workflow YAML files from a specified directory or file path, analyzes job definitions and their needs relationships, and outputs a structured interaction diagram in Mermaid format or a JSON graph model. This feature will help developers quickly visualize workflow job dependencies and interactions without manual diagram creation.

# Value Proposition

Enable repository maintainers and CI users to generate visual representations of complex workflow structures. By automating dependency extraction and diagram generation, this feature reduces cognitive load, improves onboarding, and accelerates workflow design and documentation.

# Requirements

## CLI Integration

- In src/lib/main.js implement processWorkflowDiagramSummarizer(args):
  - Detect a new flag --summarize-workflow-diagram [path] defaulting to .github/workflows.
  - Resolve path to one or multiple YAML files containing GitHub Actions workflow definitions.
  - Use fs and js-yaml to parse each file and extract jobs and their needs arrays.
  - Build a graph model where each job is a node and needs entries become edges.
  - Generate a Mermaid syntax string beginning with graph TD followed by node and edge lines.
  - Emit the diagram string via logInfo and exit with code 0.
  - On errors (missing directory, parse failure), call logError and exit with code 1.

## Source File Updates

- Import fs and path from node and import YAML parser from js-yaml.
- Add processWorkflowDiagramSummarizer above other flag handlers in main.js.
- Ensure proper error handling on file system and parser exceptions.
- Update main to invoke processWorkflowDiagramSummarizer before default behavior.

## Test File Updates

- Create tests/unit/workflowDiagramSummarizer.test.js:
  - Mock fs.readdirSync and fs.readFileSync to supply sample workflow YAML content defining jobs A needs B, C needs A.
  - Mock js-yaml load to return an object with jobs and their needs arrays.
  - Invoke main with args [--summarize-workflow-diagram, samplePath] and verify logInfo called with correct Mermaid string lines: graph TD, A, B, C edges.
  - Simulate file not found error to assert logError and process exit code 1.

## README Updates

- Under CLI Usage add:
  --summarize-workflow-diagram [path]
      Generate a Mermaid diagram of job dependencies from workflow YAML files. Defaults to .github/workflows.

- Provide an example:
  npx agentic-lib --summarize-workflow-diagram .github/workflows
  Output:
  graph TD
  build --> test
  test --> deploy

## Dependencies

- No new dependencies. Use existing fs module and js-yaml parser already included in package.json.