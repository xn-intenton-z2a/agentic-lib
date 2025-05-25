# Objective & Scope
Add a new CLI option --graph to sandbox source. When invoked it will generate and output a basic knowledge graph representation in JSON format, enabling users to inspect nodes and edges that model physical world entities.

# Value Proposition
Provide immediate feedback on graph construction logic within the CLI. Establish a foundation for integrating real data sources and allow users to validate output structure before investing in full data crawling.

# Requirements
- Add dependency graphlib for in-memory graph construction.
- Update sandbox/source/main.js to detect --graph flag in args.
- When --graph is present, build a sample graph with at least three nodes and two edges.
- Output the graph as a JSON object with nodes and edges arrays.
- Exit after graph output without running other commands.
- Write tests in sandbox/tests to verify JSON output includes expected keys and sample values.

# User Scenarios
- User runs node sandbox/source/main.js --graph and sees JSON with node list and edge list in console.
- CI pipeline ensures tests pass and graph output format remains consistent.

# Verification & Acceptance
- Automated tests confirm output is valid JSON and contains nodes and edges arrays.
- Console output matches sample structure in tests.
- CLI exits gracefully after outputting graph.