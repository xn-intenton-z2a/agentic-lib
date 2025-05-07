# Objective and Scope

Provide a CLI command to scan the library source file, extract public exports and their JSDoc comments, and generate structured API documentation. The documentation will be written to docs/API.md, enabling users to discover available functions and usage patterns.

# Value Proposition

Improve developer onboarding and adoption by offering up-to-date API reference. Automate maintenance of documentation so it remains in sync with code. Reduce manual documentation effort and errors.

# Requirements

## CLI Integration
- Introduce a new flag:
  - --generate-api-docs (alias --api-docs)
- Usage examples:
  - node src/lib/main.js --generate-api-docs
  - npm run start -- --api-docs

## Source Code Parsing
- Read the main library file src/lib/main.js
- Identify all exported functions and constants
- Parse preceding JSDoc comments for each export to extract description, parameters, and return information

## Documentation Generation
- Create or update docs/API.md
- Write a top-level heading with the library name and version
- For each export, include:
  - Function or constant name as a subheading
  - Description from JSDoc
  - Parameter table with name, type, and description
  - Return type and description

## File and Directory Handling
- Ensure docs/ directory exists
- Overwrite existing docs/API.md
- Fail gracefully if write permission is missing, reporting an error via logError

# Verification and Acceptance

- Unit tests mock fs to verify that API.md is created with expected content for sample source file with JSDoc comments
- CLI integration tests ensure the flag triggers documentation generation and the process exits without errors
- Manual test: run CLI in a sample project and confirm docs/API.md reflects all exported APIs with correct formatting