# Purpose
Add a new async function generateWorkflowContextSummary to src/lib/main.js that composes a concise summary of the current GitHub Actions workflow context suitable for feeding into a discussion bot or annotation systems.

# Value Proposition
Provide agentic workflows and discussion bots with a clear, human-readable overview of repository state and workflow inputs. This summary amplifies context awareness, reduces manual inspection, and accelerates decision making in automated discussions.

# Success Criteria & Requirements
* Introduce generateWorkflowContextSummary(context, options?) exported from src/lib/main.js
* Accept a context object containing fields such as repository, ref, sha, eventName, and payload
* Support an options object to include or exclude sections (commits, environment, inputs)
* Increment globalThis.callCount on each invocation
* Return a plain string summary with labeled sections and line breaks
* No external dependencies beyond those already declared

# Implementation Details
1. Update src/lib/main.js to define generateWorkflowContextSummary below existing utilities.
2. Within the function, call logInfo when starting and logError on failures.
3. Extract values from the context object and environment variables.
4. Build a multi-section string with headings like Repository, Ref, Commit SHA, Event Name, Inputs, Payload Summary.
5. Respect options flags to omit specific sections.
6. Export the function alongside other utilities.
7. Update README.md under API Usage to document the new function and its parameters.
8. Add Vitest unit tests in tests/unit/main.test.js mocking context inputs and verifying summary string contains expected section headings and values.

# Verification & Acceptance
* Write tests for default summary including all sections
* Write tests for options excluding specific sections
* Verify globalThis.callCount increments correctly
* Run npm test to confirm all tests pass
* Confirm no lint or formatting errors are introduced