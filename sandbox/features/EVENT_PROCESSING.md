# Core Event Processing and AI Augmentation

# Objective & Scope
Define a unified handler for SQS digest events that performs schema validation, robust error handling, and optional AI-driven enrichment of valid payloads.

# Value Proposition
- Ensure incoming messages conform to expected schema before processing to prevent runtime errors
- Provide clear error logging and batchItemFailures markers for invalid messages
- Enable optional OpenAI API integration to augment or transform digest payloads with AI-generated insights
- Maintain a single, cohesive entry point for digest processing with consistent logging and observability

# Success Criteria & Requirements
- Use zod to define DigestSchema with fields key string, value string, lastModified ISO string
- In digestLambdaHandler, parse and validate each record against DigestSchema
- On validation failure or JSON parse error, log error, record itemIdentifier, and include in batchItemFailures
- If configured (detecting OPENAI_API_KEY), call OpenAIApi.createChatCompletion with the raw digest to produce an enrichment result
- On AI call success, log enriched payload content; on failure, log error and include record in batchItemFailures
- Return an object containing batchItemFailures and handler identifier

# Testability & Stability
- Unit tests covering valid payload without AI, valid payload with AI enrichment, invalid JSON payload, zod validation failures, and AI API error handling
- Use Vitest and vi.mock to simulate OpenAI responses and errors

# Dependencies & Constraints
- Leverage existing dependencies: zod for validation, openai for AI integration
- No additional external libraries
- Compatible with Node 20 ESM environment

# User Scenarios & Examples
- Scenario: Valid digest flows through without AI key configured, logs info, returns zero failures
- Scenario: Valid digest with OPENAI_API_KEY configured, enrichment content logged, no failures
- Scenario: Invalid JSON body results in error log and batchItemFailures entry
- Scenario: AI API error triggers error log and failure marker for that record

# Verification & Acceptance
- All new and existing tests pass under npm test
- README updated to document digestLambdaHandler behavior, environment variables, and AI augmentation capability
- Clear example entries in README and CONTRIBUTING.md updated as necessary