# Objective
Add functions to read and write GitHub Actions inputs and outputs for seamless workflow integration.

# Value Proposition
Provide two utility functions, getGithubInputs and setGithubOutput, so that agentic-lib can be used directly within GitHub composite actions to access workflow inputs and publish outputs. This enables agents to communicate state and results between steps in an automated pipeline.

# Requirements
- Implement getGithubInputs to inspect process.env entries prefixed with INPUT_ and return an object mapping input names in lowercase to their string values.
- Implement setGithubOutput that accepts a name and value and writes outputs according to GitHub Actions conventions:
  - If the GITHUB_OUTPUT environment variable is defined, append a line name=value to the file indicated by GITHUB_OUTPUT.
  - Otherwise emit a line ::set-output name=value to stdout.

# Success Criteria
- Unit tests verify getGithubInputs correctly parses and normalizes input names under various environment configurations.
- Unit tests verify setGithubOutput appends to a mock file when GITHUB_OUTPUT is defined and emits the proper console line when it is not.
- Tests pass on Node 20 with ESM and use vitest for mocking filesystem and console.

# User Scenarios
- A composite action uses getGithubInputs to read required parameters and configure subsequent API calls or processing.
- A script sets action outputs with setGithubOutput to communicate generated identifiers or status flags to downstream steps.

# Verification & Acceptance
- Write unit tests that mock process.env for INPUT_ variables and assert the returned object.
- Mock the filesystem append operation and console.log to verify the correct output format for each scenario.
- Ensure no regression in existing functions and all tests pass.