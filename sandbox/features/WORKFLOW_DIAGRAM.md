# Objective & Scope

Enhance the existing workflow diagram feature to support a new high-level overview mode in addition to the detailed end-to-end diagram. The high-level diagram should focus on the major pipeline components (CLI, SQS, Lambda) to provide a concise introduction for new users or stakeholders.

# Value Proposition

- Offers a simplified diagram illustrating core components and data flow for rapid comprehension.
- Complements the detailed mermaid and JSON outputs with a high-level view for executive summaries and documentation.
- Improves onboarding by presenting a clear, minimal diagram before diving into detailed interactions and error paths.

# Success Criteria & Requirements

1. CLI Flags
   - Extend `--diagram` to accept an optional `--level=<detailed|high>` parameter.  Default: detailed.
   - Support shorthand flag `--diagram-high-level` equivalent to `--diagram --level=high`.

2. Diagram Modes
   - detailed (existing): full node list, links, and error paths.
   - high: nodes [CLI, SQS, Lambda], links [CLI→SQS, SQS→Lambda], no error paths.

3. Output Formats
   - Markdown: mermaid flowchart code block for either mode.
   - JSON: object with `nodes` and `links` arrays. `errors` only present in detailed mode when simulation enabled.

4. CLI Behavior
   - When `--level=high` or `--diagram-high-level` is detected, output high-level diagram only.
   - Other flags (`--features-overview`, `--format=json`, help, version) interact unchanged.

5. Tests
   - Update sandbox/tests/cli.test.js to include:
     • generateDiagram('markdown', 'high') returns a mermaid block with only high-level nodes and links.
     • generateDiagram('json', 'high') returns an object with exactly the high-level nodes and links; no `errors` key.
     • processDiagram(['--diagram-high-level']) and processDiagram(['--diagram','--level=high']) log correct outputs.
   - Preserve existing tests for detailed behavior.

# Implementation Details

1. In `sandbox/source/main.js`:
   • Modify `generateDiagram(format, level = 'detailed')` signature.
   • Branch on level: define highNodes = ['CLI','SQS','Lambda'] and highLinks = [ {from:'CLI',to:'SQS'},{from:'SQS',to:'Lambda'} ].
   • For markdown, wrap chosen links in mermaid flowchart.
   • For JSON, return { nodes: highNodes, links: highLinks } when level == high.
   • In `processDiagram`, parse `--level=high` and `--diagram-high-level` to pass level to generateDiagram.

2. Tests in `sandbox/tests/cli.test.js`:
   • Add new cases for high-level diagram mode alongside existing tests.

3. Documentation:
   • Update `sandbox/docs/CLI_TOOLKIT.md` to document `--level` option and `--diagram-high-level` shorthand with usage examples for high-level mode.
   • Revise `sandbox/README.md` to show a high-level mermaid snippet and JSON example.

4. Dependencies:
   • No new dependencies required; existing libraries suffice.

# Verification & Acceptance

- All existing and new tests pass under `npm test`.
- CLI invocation `node sandbox/source/main.js --diagram-high-level` displays only high-level mermaid.
- JSON invocation `node sandbox/source/main.js --diagram --level=high --format=json` outputs valid object with only high-level nodes and links.