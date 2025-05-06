# Purpose
Add a new function generateWorkflowInteractionDiagram to src/lib/main.js that consumes multiple GitHub Actions workflow definitions (as raw YAML or file paths) and produces a Mermaid directed graph illustrating how workflows invoke or depend on each other via workflow_call or repository_dispatch events.

# Value Proposition
Provide users with a clear, consolidated visual representation of inter-workflow triggers and dependencies in a repository. This feature makes it easier to explore, document, and debug complex multi-workflow pipelines by generating inline diagrams without leaving the codebase.

# Success Criteria & Requirements
* Export async function generateWorkflowInteractionDiagram(workflowSources, options?) from src/lib/main.js.
  - workflowSources: array of strings, each item is a raw YAML string or a file path ending in .yml or .yaml.
  - options.format?: string, one of "graph" (default) or "flow" to switch between Mermaid graph TD and flowchart styles.
* For each entry in workflowSources:
  - If the string ends with .yml or .yaml, read its content with fs.promises.readFile;
  - Otherwise treat the entry as raw YAML text.
* Parse each YAML using js-yaml to extract:
  - name of the workflow from the top-level name field;
  - any workflow_call.targets or repository_dispatch.payload.repository inputs to detect calling relationships.
* Build a Mermaid diagram string:
  - Use graph TD or flowchart syntax depending on options.format;
  - Create one node per workflow name;
  - For each detected call relationship, add a directed edge caller --> target;
  - Enclose the diagram in mermaid fences: ```mermaid ... ```.
* Call logInfo at start and logError on any parsing or I/O failure; throw a descriptive Error on invalid inputs.
* Increment globalThis.callCount exactly once before returning the diagram string.
* Avoid adding new dependencies beyond js-yaml and Node built-ins (fs/promises).

# Implementation Details
1. In src/lib/main.js, import yaml from "js-yaml" and fs from "fs/promises" near existing imports.
2. Define async function generateWorkflowInteractionDiagram(workflowSources, options = {}):
   - Validate workflowSources is a non-empty array; on failure throw Error.
   - Determine formatKeyword = options.format === "flow" ? "flowchart TD" : "graph TD".
   - Initialize an empty map of workflowName to its parsed object.
   - For each source in workflowSources:
     * If source ends with .yml or .yaml, await fs.readFile(source, "utf8"); else use source as text.
     * Parse text with yaml.load; ensure result has a name field and on.workflow_call.targets array or repository_dispatch triggers.
     * Store workflow name and its targets in the map.
   - Construct an array of edges strings: for each workflowName and each targetName add `${caller}-->${target}`.
   - Build the final diagram:
     ```mermaid
     ${formatKeyword}
     ${edges.join("\n")}
     ```
   - logInfo("generateWorkflowInteractionDiagram completed");
   - Increment globalThis.callCount;
   - Return the diagram string.
3. Export generateWorkflowInteractionDiagram alongside other utilities in main.js.
4. In the CLI helper section of main.js, define async function processWorkflowInteractionDiagram(args):
   - Detect flag --workflow-interaction-diagram in args;
   - Parse required --sources argument as comma-separated list of YAML file paths or inline YAML blocks;
   - Parse optional --format argument;
   - Call generateWorkflowInteractionDiagram(sourcesArray, { format });
   - console.log the returned diagram string;
   - Return true if flag handled, otherwise false.
   - On errors, call logError and exit with non-zero code.
5. In main(args), before other CLI handlers, add:
   if (await processWorkflowInteractionDiagram(args)) return;
6. Update README.md under both Programmatic Usage and CLI Usage:
   - Document generateWorkflowInteractionDiagram signature, parameters, and options;
   - Show example invocation and sample Mermaid output;
   - Document CLI flag --workflow-interaction-diagram with --sources and --format options.
7. Add Vitest unit tests in tests/unit/main.test.js:
   - Mock fs.promises.readFile and yaml.load to supply sample workflows;
   - Test default graph format for two workflows where A calls B;
   - Test flow format produces flowchart TD syntax;
   - Test error thrown when input array is empty or YAML missing name field;
   - Verify globalThis.callCount increments exactly once per invocation.

# Verification & Acceptance
* Run npm test to confirm new tests pass and no existing tests are affected.
* Confirm that generateWorkflowInteractionDiagram returns a valid Mermaid code block containing expected node and edge definitions.
* Verify CLI invocation npx agentic-lib --workflow-interaction-diagram --sources workflowA.yml,workflowB.yml produces the diagram and exits without errors.
* Ensure error handling logs descriptive messages and exits with non-zero status on invalid inputs.
* Confirm README.md renders correctly with code samples and usage instructions.