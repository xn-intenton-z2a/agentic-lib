# Objective & Scope

Extend the existing JSON reporting and workflow diagram capabilities to include a new workflow context summarizer. This single CLI suite will support three coordinated flags:

• --report    Produce a machine-readable JSON summary of repository state and workflow definitions.
• --diagram   Generate a Mermaid flowchart of workflow call triggers and interactions.
• --summarize Create a concise, human-readable summary of each workflow’s triggers, jobs, steps, environment variables, and interdependencies.

All three flags can be combined or used independently in a single command invocation.

# Value Proposition

• Unified reporting, visualization, and summarization in one CLI workflow tool.
• Immediate insights into both the structure and human context of GitHub Actions workflows.
• Reduces cognitive load by providing high-level narrative summaries alongside structured outputs and diagrams.

# Success Criteria & Requirements

• --summarize outputs a clear text summary for each workflow file under .github/workflows.
• When used with --json, the summary is returned as a JSON object under key "workflowSummaries".
• --summarize can be combined with --diagram and --report without conflicts.
• All existing JSON report and diagram behaviors must remain unchanged and pass tests.
• Summaries must include workflow name, triggers, job count, key steps, environment variables, and cross-workflow calls.

# Implementation Details

1. src/lib/main.js
   • Add processSummarize(args) before existing report/diagram logic.
   • processSummarize loads .github/workflows/*.yml via fs and js-yaml.
   • For each workflow file, parse triggers, jobs, steps, and environment variables sections.
   • If OpenAI API key is set, optionally refine summaries by calling OpenAIApi.createChatCompletion with prompt constructed from parsed data. Fallback to templated summaries if API interaction fails.
   • Collect summaries in an array, then:
     – If only --summarize, print each summary as plain text separated by divider lines.
     – If --json and --summarize, output JSON object with key workflowSummaries mapping filenames to summary text.

2. package.json
   • No new dependencies required; openai and js-yaml already present.
   • Update test script alias to support summarizer tests automatically.

3. sandbox/tests/summarizer.test.js
   • Mock fs and js-yaml to simulate workflows with various triggers and variables.
   • Mock OpenAIApi to return a predictable refined summary.
   • Test combinations: --summarize alone, --summarize --json, --summarize --diagram, and ensure no regressions on report and diagram.

4. sandbox/README.md
   • Add usage section for --summarize flag, show sample plain text summary, and JSON output example.

# Verification & Acceptance Criteria

• Running npm run report --summarize prints plain text summaries and exits 0.
• Running npm run report --summarize --json prints valid JSON with workflowSummaries key.
• Combining --summarize with --diagram or --report does not break existing features.
• New tests in sandbox/tests pass with npm test and npm run test:unit.
