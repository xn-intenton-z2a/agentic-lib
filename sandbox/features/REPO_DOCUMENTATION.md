# Objective and Scope
Extend the automated repository documentation feature to include token usage and runtime cost reporting in discussion summaries and automatically generate an API.md file from source exports.

# Value Proposition
Provide clear, per‐discussion visibility into AI usage by reporting total tokens consumed and estimated runtime cost alongside engagement metrics while maintaining up-to-date API documentation that reflects library exports without manual effort.

# Requirements

## Repository Documentation Enhancements
- fetchChatGptUsageMetrics remains as specified in existing feature
- generateDiscussionSummaryMarkdown extended with costMetrics when includeCosts flag is true
- CLI integration adds flag --include-costs alias --ic

## API.md Generation
- implement function generateApiMarkdown to parse exports in src/lib/main.js
- extract function names, parameters, and JSDoc comments from source
- format these into markdown with heading for each function including signature and description
- CLI integration adds flag --generate-api-doc alias --gad that invokes generateApiMarkdown and writes API.md at repository root

## Documentation Updates
- update sandbox/README.md to document --generate-api-doc flag and usage of API.md file
- update docs/USAGE.md to include API.md generation examples

## Tests in tests/unit/main.test.js
- add unit tests for generateApiMarkdown that mock source exports and verify markdown output
- add CLI test invoking node src/lib/main.js --generate-api-doc and verify that API.md is created with expected content
- ensure existing cost metrics tests remain passing

# Verification and Acceptance
- all unit tests pass under npm test
- manual test: run node src/lib/main.js --summarize-discussion 42 --include-costs and confirm cost metrics in summary
- manual test: run node src/lib/main.js --generate-api-doc and confirm API.md file reflects current exports