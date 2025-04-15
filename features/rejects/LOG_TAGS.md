# LOG_TAGS Feature Specification

## Overview
This feature enhances the logging functionality by allowing users to inject custom log tags into every log message. By setting an environment variable `AGENTIC_LOG_TAGS` (expected to be a JSON object), users can include additional metadata—such as application, region, or custom identifiers—in all log outputs. This improves log aggregation, filtering, and overall observability in environments where traces and correlation are required.

## Implementation Details
### Source File Modifications (src/lib/main.js)
- **Enhanced Log Functions:**
  - Update both `logInfo` and `logError` functions to check for the environment variable `AGENTIC_LOG_TAGS`.
  - If the variable is set, attempt to parse it as a JSON object. On success, merge the resulting tags into the log object before outputting.
  - Ensure that parsing errors do not crash the logging functions; if parsing fails, fallback silently to existing behavior and optionally log a warning if in verbose mode.

### Testing Enhancements (tests/unit/main.test.js)
- **New Test Cases:**
  - Add tests that temporarily set `process.env.AGENTIC_LOG_TAGS` to a valid JSON string and capture console output.
  - Verify that both `logInfo` and `logError` output objects include all the custom keys provided through the environment variable.
  - Include negative tests where `AGENTIC_LOG_TAGS` is set to an invalid JSON and ensure that the logging output does not include additional tags.

### Documentation Updates (README.md)
- **Logging Section Update:**
  - Document the new `AGENTIC_LOG_TAGS` environment variable, explaining its purpose and format.
  - Provide example usage and JSON format guidelines for setting custom log tags.

## Benefits & Success Criteria
- **Improved Observability:** Users can add contextual metadata to logs aiding in diagnostics and filtering.
- **Seamless Integration:** This feature augments existing logging without affecting core functionalities when `AGENTIC_LOG_TAGS` is not set or is invalid.
- **Testable and Reliable:** Unit tests validate proper merging of tags into log messages, ensuring reliability and ease of maintenance.

## Verification & Acceptance
- The logging functions must correctly merge custom tag data when `AGENTIC_LOG_TAGS` is set with valid JSON.
- Unit tests must pass, verifying that the additional tags appear in the log object's output.
- Documentation must be updated to include example setups and usage instructions for the new logging tags feature.