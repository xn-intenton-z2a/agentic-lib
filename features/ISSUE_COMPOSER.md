# Issue Composer

## Overview
The Issue Composer feature aggregates logs, notifications, and error digests from various parts of the agentic-lib system, including SQS event handling and LLM delegation. By summarizing these events, it creates comprehensive GitHub issue reports that highlight recurring patterns, failures, and potential improvements in the workflows. The feature leverages the power of the Chat Completions API to generate human-readable summaries from raw log data.

## Objectives
- **Comprehensive Aggregation:** Collect logs and error messages from sources such as the digestLambdaHandler and LLM delegation failures.
- **Automated Issue Summaries:** Utilize an LLM to transform aggregated information into clear and actionable GitHub issue reports.
- **Improved Traceability:** Enhance overall system observability by linking error events to corresponding issue reports in a structured format.
- **Seamless Integration:** Interface with existing features like ISSUE_CREATOR and ISSUE_REVIEWER, ensuring a complete cycle from error detection to issue resolution.

## Implementation Strategy
1. **Data Collection and Aggregation:**
   - Implement hooks within existing functions (e.g., digestLambdaHandler and delegateDecisionToLLMFunctionCallWrapper) to capture error messages and logs.
   - Aggregate these logs periodically or when triggered by a specific event (e.g., threshold number of errors).

2. **LLM Integration for Summarization:**
   - Utilize the Chat Completions API (similar to the one used in LLM_DELEGATOR) to convert the raw log data into a summarized, human-readable issue report.
   - Define a function schema that accepts aggregated log content and returns a structured issue summary, including a title, detailed description, and potential refinement suggestions.

3. **Issue Creation and Linking:**
   - Integrate with the ISSUE_CREATOR workflow to automatically create GitHub issues based on the generated summaries.
   - Provide an option for manual review or fine-tuning before issue creation if required.

4. **Error Handling and Validation:**
   - Perform rigorous validation of incoming data to ensure that logs are in a consistent format.
   - Include detailed error logging and fallback mechanisms to handle cases where the LLM response does not adhere to the expected schema.

## Acceptance Criteria
- Successfully aggregates logs and error messages from multiple sources within the agentic-lib system.
- Automatically generates a well-structured issue summary using the Chat Completions API that includes a title, description, and suggested fixes.
- Seamlessly integrates with existing features, such as ISSUE_CREATOR, to create actionable GitHub issues.
- Includes comprehensive unit and integration tests that simulate real-world log aggregation and summarization scenarios.
- Enhances system observability and traceability in alignment with the mission to continuously review, fix, update, and evolve your code.