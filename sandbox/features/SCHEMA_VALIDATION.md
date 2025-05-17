# Schema Validation for Digest Events

# Objective & Scope
Add Zod-based validation for incoming SQS digest payloads to ensure messages conform to expected schema before processing.

# Value Proposition
- Prevent runtime errors due to malformed messages
- Provide clear error logging and batch item failure markers for invalid events
- Improve system reliability and observability

# Success Criteria & Requirements
- Define DigestSchema with fields key string, value string, lastModified ISO string
- Integrate schema.parse before processing each record
- On validation failure, log error and include recordId in batchItemFailures

# Testability & Stability
- Unit tests for valid and invalid payloads
- Leverage Vitest for test coverage

# Dependencies & Constraints
- Use existing zod dependency
- No new external libraries

# User Scenarios & Examples
Example: Valid record flows through
Example: Invalid record yields batchItemFailures

# Verification & Acceptance
- Passing unit tests
- Updated README documentation