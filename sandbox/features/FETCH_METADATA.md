# Overview
Add a CLI flag --fetch to retrieve metadata from a public URL and output JSON nodes for the knowledge graph.

# Value Proposition
Users can quickly crawl web pages to extract key information and feed into the knowledge graph without writing custom scripts.

# Success Criteria & Requirements
- Support Node 20+ with global fetch
- Accept a single URL argument following --fetch
- Parse HTML to extract <title> and meta description elements
- Handle network errors and invalid HTML gracefully

# Dependencies & Constraints
- Use global fetch API
- Use zod to validate URL inputs
- No external HTML parsing library required, use built-in DOM parser or regex

# User Scenarios & Examples
agentic-lib --fetch https://example.com/page
Outputs a JSON object with url, title, and description

# Verification & Acceptance
- Unit tests mock fetch to return sample HTML and verify console output
- Tests cover valid URL, network error, and missing description cases