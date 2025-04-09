# AUTO_WORKFLOWS

## Overview
This feature orchestrates automated workflows for GitHub repositories to enable autonomous issue management, continuous integration/deployment, and LLM-based decision making. The functionality now includes robust LLM delegation with strict input validation, auto-conversion of non-string prompts, in-memory caching with configurable TTL, and detailed diagnostics via CLI flags. The enhancements build upon legacy ISSUE_CREATOR capabilities to deliver a unified and resilient workflow engine.

## Objectives
- **Unified Issue Lifecycle:** Consolidate issue batching, composition, review, and creation into a singular workflow.
- **Enhanced LLM Delegation:** Improve the `delegateDecisionToLLMFunctionCallWrapper` with stronger input validation, auto prompt conversion, and error messaging to handle non-string, null, undefined, or invalid inputs.
- **Caching & Performance:** Leverage a TTL-based in-memory caching mechanism to prevent redundant LLM invocations and improve performance, ensuring that cached responses are returned within the specified TTL window.
- **Refined Diagnostics & CLI:** Expand CLI options (e.g., `--verbose`, `--diagnostics`, `--help`) to output detailed configuration, environment details, and execution pathway logs, thereby facilitating real-time debugging and observability.

## Implementation Strategy
1. **LLM Delegation Enhancements:**
   - Enforce comprehensive input type checks with clear error messages for invalid inputs (NaN, empty strings, objects, etc.) and guide users on enabling auto conversion.
   - Integrate an auto-conversion option that safely transforms numeric or boolean prompts into valid non-empty strings before further processing.
   - Utilize a TTL-configurable in-memory cache to store LLM responses, preventing unnecessary API calls and ensuring performance gains over repeated calls.

2. **Diagnostics and Logging Improvements:**
   - Expand the CLI to include flags like `--verbose` for extended logging and `--diagnostics` for detailed environmental and configuration outputs.
   - Incorporate comprehensive logging statements that capture key milestones: configuration load, cache hits, error conditions, and diagnostic information.

3. **Workflow Unification & Backward Compatibility:**
   - Seamlessly merge legacy issue creation functionalities with the updated LLM delegation and caching mechanisms.
   - Ensure backward compatibility with existing workflows and environment configurations while exposing the new diagnostics and caching controls.

## Acceptance Criteria
- The system must correctly validate input prompts and auto-convert non-string values when enabled, returning descriptive error messages otherwise.
- Caching behavior must properly respect the TTL configuration: identical requests within TTL return cached responses, while calls after TTL expiration trigger fresh API invocations.
- CLI commands (`--help`, `--verbose`, `--diagnostics`, `--digest`) must output clear, consistent usage instructions and detailed diagnostic logs.
- All enhancements are backed by comprehensive unit and integration tests to ensure robust error handling, correct caching behavior, and reliable diagnostics output.

## User Scenarios
- A developer submits a non-string prompt for LLM delegation; the system auto-converts the input and processes it correctly when auto conversion is enabled.
- An operator queries the system using the `--diagnostics` flag to quickly retrieve configuration and runtime details, aiding in troubleshooting.
- The caching mechanism returns a cached LLM response for repeated calls within the TTL, reducing latency and API call frequency.
