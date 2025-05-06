# Purpose
Add a new function generateWorkflowInteractionDiagram to src/lib/main.js that takes an array of GitHub Actions workflow YAML definitions or file paths and produces a Mermaid diagram illustrating workflow triggers and inter-workflow calls.

# Value Proposition
Provide a clear visual representation of how workflows invoke and depend on each other via workflow_call or repository_dispatch events. This helps users understand, debug, and optimize complex multi-workflow pipelines without leaving their codebase.

# Success Criteria & Requirements
* Export async function generateWorkflowInteractionDiagram(workflowYamls, options?) from src/lib/main.js
* Accept workflowYamls as an array of raw YAML strings or file paths; options.format may be "graph" (default) or "flow"
* Parse each workflow definition using js-yaml to extract the workflow name and workflow_call targets
* Identify directed edges between workflows where one calls another and represent them in a Mermaid directed graph with nodes for each workflow
* Wrap the diagram with mermaid code fences
* Increment globalThis.callCount on each invocation
* Log start with logInfo and errors with logError; throw descriptive errors on parse failures or missing workflows
* No new dependencies beyond js-yaml, fs, and existing modules

# Implementation Details
1. In src/lib/main.js import yaml from "js-yaml" and fs from "fs/promises" alongside existing imports
2. Define async function generateWorkflowInteractionDiagram(workflowYamls, options = {}) below existing utilities
3. For each entry in workflowYamls, detect if it is a file path (e.g., ends with .yml or .yaml) and read it with fs.readFile; otherwise treat the entry as a YAML string
4. Parse each YAML with yaml.load and validate that it has a name field and on.workflow_call.targets array
5. Build a Mermaid graph string starting with graph TD and one line per call: <caller>--> <target>
6. Surround the graph string with ```mermaid fences and return it
7. Increment globalThis.callCount before returning
8. Catch and log parsing or file errors, then rethrow with context
9. Export the function alongside other utilities in main.js
10. In the CLI section, detect a flag --diagram-interactions; parse comma-separated --inputs and optional --format; invoke generateWorkflowInteractionDiagram and print result to stdout
11. Update README.md under CLI Usage and Programmatic Usage with examples showing raw YAML and file path invocation
12. Add Vitest tests in tests/unit/main.test.js mocking fs.readFile and yaml.load to verify diagram output, error handling, and callCount increment

# Verification & Acceptance
* Unit tests generate expected Mermaid diagram for sample workflows with calls between them
* Tests cover both raw YAML and file path inputs
* Verify callCount increments on each successful call
* Validate errors are thrown and logged for invalid inputs or missing workflow_call definitions
* Run npm test to confirm no regressions in existing tests