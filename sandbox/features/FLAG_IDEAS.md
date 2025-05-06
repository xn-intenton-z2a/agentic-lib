# Objective
Add a CLI workflow flag that automatically scans GitHub Discussions in the current repository for posts containing ideas. Use configurable keyword matching and optional OpenAI classification to flag relevant discussion threads and apply a reaction or comment to surface them.

# Value Proposition
Streamlines the identification of idea proposals in discussions so that maintainers and contributors can efficiently track and review ideas without manual curation.

# Requirements
1. Support a new --flag-ideas flag in the CLI that invokes the discussion scanning workflow.
2. Read GITHUB_TOKEN and GITHUB_API_BASE_URL from environment variables for authenticated GitHub API access.
3. Optionally use OPENAI_API_KEY to refine idea detection via chat completion.
4. Fetch open discussion threads for the repository using the GitHub Discussions API.
5. Identify idea posts using a predefined keyword list and confirm with AI classification when enabled.
6. Apply a thumbs-up reaction or post a standardized comment on each flagged discussion.
7. Provide unit tests that mock GitHub API and OpenAI responses to validate detection and flagging logic.
8. Update the README with examples, environment setup, and sample output.

# Implementation
Modify src/lib/main.js to:
1. Parse --flag-ideas before other commands in the main function.
2. Introduce flagIdeasHandler that performs the following steps:
   a. Use fetch and GITHUB_TOKEN to list open discussion threads via GITHUB_API_BASE_URL.
   b. For each thread body, perform keyword matching and call OpenAI chat completion if OPENAI_API_KEY is set.
   c. On positive detection, send a POST request to GitHub API to add a reaction or leave a comment.
3. Ensure reactions or comments include a reference to the detected idea and reason for flagging.
4. Integrate VERBOSE_STATS to report callCount and uptime after flagging completes when enabled.

# Tests & Verification
1. In tests/unit/main.test.js, add tests invoking main with ["--flag-ideas"], mocking fetch to return sample discussions and mocking OpenAI responses.
2. Verify fetch is called for listing discussions and posting reactions or comments as expected for flagged cases.
3. Simulate threads without ideas to ensure they are skipped.
4. Confirm that verbose and stats flags behave correctly in combination.
5. Run npm test to ensure coverage remains green.

# Documentation
1. Update sandbox/README.md under CLI Usage to include --flag-ideas instructions, environment variable requirements, and examples of flagged discussion output.
2. Provide sample JSON entries showing reaction addition and confirmation comments on flagged threads.