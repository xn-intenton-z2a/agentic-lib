# AUTO_WORKFLOWS

## Overview
This feature consolidates all aspects of autonomous workflow orchestration, including GitHub issue lifecycle management, CI/CD integrations, and enhanced interaction with large language models (LLMs). In this update, we have refined the LLM delegation process to include robust input validation, auto-conversion of non-string inputs, and a configurable in-memory caching mechanism with TTL support. The updated specification maintains backward compatibility with legacy ISSUE_CREATOR functionalities while enhancing diagnostics and operational resilience.

## Objectives
- **Unified Issue Lifecycle:** Integrate issue batching, composition, review, and creation with a single configuration across workflows.
- **Enhanced LLM Delegation:** Improve the `delegateDecisionToLLMFunctionCallWrapper` to enforce strict input validation, support auto-conversion of numeric, boolean, and other non-string prompt types, and reduce redundant LLM calls via an in-memory cache with configurable TTL.
- **Robust Diagnostics and Logging:** Expand CLI options (`--verbose`, `--diagnostics`) to offer detailed configuration reporting and real-time insights, ensuring smoother debugging and observability during automated and manual reviews.
- **Seamless CI/CD Integration:** Maintain compatibility with GitHub Actions by leveraging workflow_call events and ensuring the feature supports dynamic updates and LLM-enhanced decision making.

## Implementation Strategy
1. **LLM Delegation Refinements:**
   - Enhance input validation to cover edge cases such as null, undefined, booleans, objects, and arrays.
   - Implement auto-conversion logic (when enabled) to transform non-string prompts into valid non-empty strings.
   - Integrate a caching mechanism with configurable TTL to store LLM responses, reducing external API call frequency and improving performance.

2. **Workflow Consolidation:**
   - Merge legacy ISSUE_CREATOR functionalities cleanly into the AUTO_WORKFLOWS module while preserving existing test coverage.
   - Ensure that all autogenous issue generation and review processes are tied into the updated LLM delegation function.

3. **Diagnostics and Observability:**
   - Update CLI command handling to provide clear guidance on available flags and output comprehensive diagnostic information (config settings, environment details, Node.js version, etc.).
   - Enhance verbose logging to include detailed LLM invocation traces and caching behaviors.

## Acceptance Criteria
- All issue lifecycle and workflow orchestration functionalities from the legacy ISSUE_CREATOR are operational within AUTO_WORKFLOWS.
- The `delegateDecisionToLLMFunctionCallWrapper` successfully validates input, auto-converts prompts when requested, and employs a caching mechanism that adheres to the specified TTL.
- Extensive unit and integration tests cover all edge cases for input handling, caching logic, and diagnostic outputs.
- CLI flags (`--help`, `--verbose`, `--diagnostics`, `--digest`) function as expected, and output logs match the defined specifications.


