# Objective
Add a visual workflow interaction diagram to the project documentation, illustrating the end-to-end flow of core agentic-lib components.

# Value Proposition
A clear diagram helps new users and maintainers quickly understand how the CLI, SQS event generation, digest handler, and metrics dashboard are orchestrated, reducing onboarding time and misconceptions.

# Scope
- Update sandbox/README.md
  - Add a new section titled Workflow Interaction Diagram.
  - Embed a mermaid code block showing:
    - CLI invocation flags mapping to processHelp, processDigest, processVersion, and processMetrics handlers.
    - SQS digest simulation path into digestLambdaHandler.
    - Metrics retrieval and dashboard rendering flow.
- No changes to source code or tests are required; this feature focuses on documentation updates.

# Requirements
- Use mermaid syntax in a markdown code fence.
- Confirm GitHub supports rendering mermaid diagrams natively without additional dependencies.
- Maintain consistent formatting for readability.

# Success Criteria
- sandbox/README.md includes the new Workflow Interaction Diagram section with a valid mermaid code block.
- When viewed on GitHub, the diagram renders correctly and accurately represents the workflow.

# Verification
1. Preview the updated sandbox/README.md on GitHub and confirm the diagram appears correctly.
2. Run linting and formatting checks to ensure no errors in README.
