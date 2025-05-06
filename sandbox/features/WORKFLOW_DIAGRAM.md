# Purpose
Add a new function generateWorkflowDiagram to src/lib/main.js that takes a GitHub Actions workflow YAML definition and produces an interactive Mermaid diagram code block representing jobs and their dependencies.

# Value Proposition
Provide users with a quick, inline visual representation of their workflow structure and execution order. This feature makes it easier to understand complex workflows at a glance, improving debugging, collaboration, and documentation without leaving the code.

# Success Criteria & Requirements
* Export async function generateWorkflowDiagram(workflowYaml, options?) from src/lib/main.js.
* workflowYaml: string containing the raw YAML of a GitHub Actions workflow.
* options.format?: one of "graph" (default) or "sequence" to choose mermaid graph or sequence diagram style.
* Parse the YAML using js-yaml (already installed) to extract the jobs object and each job’s name and needs array.
* Increment globalThis.callCount on each invocation.
* Build a Mermaid diagram string prefixed and suffixed with a mermaid code fence:
  
  ```mermaid
  ...diagram definitions...
  ```
* In "graph" mode generate a directed graph (graph TD) where each job points to the jobs that depend on it.
* In "sequence" mode generate a simple sequence diagram listing jobs in topological order with arrows showing needs relationships.
* Use logInfo at the start and logError on failure. On parse errors throw a descriptive error.
* No additional dependencies beyond js-yaml and those already declared.

# Implementation Details
1. In src/lib/main.js, import yaml from "js-yaml" after existing imports.
2. Define async function generateWorkflowDiagram(workflowYaml, options = {}) below existing utilities.
3. Inside function:
   - logInfo("Starting diagram generation").
   - Parse workflowYaml with yaml.load and validate that jobs is a plain object.
   - Extract job names and dependencies (needs arrays).
   - Depending on options.format construct either a mermaid graph TD or sequenceDiagram string.
   - Wrap with ```mermaid fences and return the complete string.
   - Increment globalThis.callCount before return.
4. Catch parse or generation errors, logError with error details, and rethrow.
5. Export generateWorkflowDiagram alongside other utilities.
6. Update README.md under Programmatic Usage and CLI Usage examples to illustrate generateWorkflowDiagram signature and output preview.
7. Add Vitest unit tests in tests/unit/main.test.js:
   - Test default graph format for a minimal workflow with two jobs and needs.
   - Test explicit sequence format generating proper diagram syntax.
   - Verify globalThis.callCount increments per call.

# Verification & Acceptance
* Write tests mocking a sample YAML workflow and asserting that output contains expected mermaid lines (graph TD or sequenceDiagram and job links).
* Ensure callCount increments as expected.
* Run npm test to confirm all tests pass without regressions.
* Verify README examples render valid mermaid code blocks.