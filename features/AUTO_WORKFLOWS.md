# AUTO_WORKFLOWS

## Overview
This feature consolidates and orchestrates automated workflows for GitHub repositories by seamlessly integrating autonomous issue management, CI/CD operations, and AI-driven decision making. The core functionality includes robust LLM delegation with improved input validation, auto-conversion of non-string prompts, in-memory caching with TTL support, and enhanced diagnostics for real-time operational insights. It preserves legacy ISSUE_CREATOR capabilities while introducing new diagnostics and caching strategies.

## Objectives
- **Unified Issue Lifecycle:** Manage issue batching, composition, review, and creation consistently across workflows.
- **Enhanced LLM Delegation:** Strengthen the `delegateDecisionToLLMFunctionCallWrapper` with strict input validation to handle edge cases (null, undefined, booleans, objects, arrays), auto-conversion when enabled, and built-in caching with configurable Time-To-Live.
- **Improved CLI and Diagnostics:** Provide detailed logging, diagnostic CLI options (`--verbose`, `--diagnostics`, `--help`) to output configuration, environment details, and trace execution paths for debugging and observability.
- **Seamless CI/CD Integration:** Ensure compatibility with GitHub Actions via workflow_call events, maintaining backward compatibility while enabling dynamic updates.

## Implementation Strategy
1. **LLM Delegation Refinements:**
   - Strengthen input type checks and error handling with clear messages and guidance for auto conversion.
   - Automatically convert numeric, boolean, or other non-string inputs to valid non-empty strings when enabled.
   - Integrate an in-memory caching mechanism with TTL configuration to prevent redundant LLM invocations and improve performance.

2. **Diagnostics and Logging Enhancements:**
   - Extend CLI options for verbose and diagnostics modes, enabling detailed reporting of configuration settings, runtime environment, and Node.js version.
   - Ensure outputs clearly indicate invocation pathways, caching behavior, and error conditions.

3. **Workflow Unification:**
   - Merge legacy ISSUE_CREATOR functionality into the modern AUTO_WORKFLOWS module.
   - Provide comprehensive test coverage for new validations, auto-conversion, and caching, ensuring robust integration and backward compatibility.

## Acceptance Criteria
- Successful execution of all workflows with integrated issue lifecycle management, LLM delegation, and dynamic diagnostics.
- The `delegateDecisionToLLMFunctionCallWrapper` validates all prompt types with options for auto-conversion, and employs a TTL-based caching mechanism.
- CLI commands (`--help`, `--verbose`, `--diagnostics`, `--digest`) produce clear, consistent outputs and log necessary configuration details.
- Comprehensive unit and integration tests validate transformations, error handling, and caching behavior.
