# Overview

The CLI_INTERFACE feature provides a unified command-line experience for both sandbox utilities and the core library. It streamlines developer workflows by exposing sandbox-specific validation, documentation, AWS integrations, and global library commands for help, versioning, and event simulation. This update enhances the existing interface by adding a new discussion-stats command to deliver statistical insights on GitHub discussions or issues.

# Commands

## Sandbox Commands

--help
  Show usage instructions and available options for sandbox mode.

--env-check
  Validate environment variables against the defined configuration schema. List missing required variables with level "error" and exit code 1, warn about extraneous variables, and on success log level "info" with a summary.

--generate-interactive-examples
  Scan sandbox/README.md for mermaid-workflow code blocks and render each into interactive HTML snippets. Replace or inject an idempotent Examples section at the end of the README and log updatedBlocks.

--fix-features
  Inject a mission statement reference into markdown files under sandbox/features that are missing one. Report modified filenames and exit with code 0 on success.

--validate-features
  Ensure every sandbox feature file references the mission statement. Fail on missing references with level "error" and exit code 1, otherwise succeed with level "info".

--validate-readme
  Verify sandbox/README.md contains links to MISSION.md, CONTRIBUTING.md, LICENSE.md, and the repository URL. Log missing references as errors and exit code 1.

--features-overview
  Generate sandbox/docs/FEATURES_OVERVIEW.md summarizing each sandbox CLI command in a markdown table. Overwrite idempotently and log the generated overview.

--audit-dependencies
  Run npm audit with a configurable severity threshold. Fail on vulnerabilities at or above the threshold with detailed error logs, otherwise log an info summary of counts.

--bridge-s3-sqs
  Upload a payload to S3 and send an SQS message containing the object location and optional message attributes. Require --bucket and --key parameters.

--discussion-stats
  Compute and output statistical insights for GitHub discussions or issues.

### --discussion-stats

**Description:**
Fetch comments from a specified GitHub discussion (or issue) and compute usage metrics including comment count, unique participants, time range, and average comment length.

**Usage:**
node sandbox/source/main.js --discussion-stats --owner <owner> --repo <repo> --discussion-number <number>

**Behavior:**
1. Validate presence of --owner, --repo, and --discussion-number flags. If missing, log an error and exit code 1.
2. Authenticate with GitHub API using GITHUB_TOKEN or default credentials; use GITHUB_API_BASE_URL if configured.
3. Retrieve all comments from the specified discussion via GitHub API.
4. Calculate metrics:
   - totalComments: total number of comments retrieved.
   - uniqueParticipants: count of distinct comment authors.
   - firstCommentTimestamp: ISO timestamp of the earliest comment.
   - lastCommentTimestamp: ISO timestamp of the latest comment.
   - durationMs: time difference in milliseconds between first and last comment.
   - averageCommentLength: mean character length of comment bodies.
5. Log an info-level JSON object:
   {
     level: "info",
     message: "Discussion stats computed",
     discussionStats: { totalComments, uniqueParticipants, firstCommentTimestamp, lastCommentTimestamp, durationMs, averageCommentLength }
   }
6. On API errors or parsing failures, log an error-level JSON with details and exit code 1.

## Library Commands

--help
  Show usage instructions for the core library CLI, including available flags under src/lib/main.js.

--version
  Output current package version and timestamp as JSON. Fail with error log if retrieval or formatting fails.

--digest
  Simulate an AWS SQS event by generating a sample digest, invoking the digestLambdaHandler, and logging record processing output.

# Requirements

- Node.js 20 or higher
- Environment variable GITHUB_TOKEN for GitHub API authentication
- Optional GITHUB_API_BASE_URL override
- Network permissions for HTTP calls to GitHub
- File system write permissions for sandbox paths and documentation

# Testing & Verification

- Unit tests for --discussion-stats covering:
  - flag absence returns false
  - missing or invalid arguments logs error and exit code 1
  - GitHub API error handling
  - correct metric calculations on mock comment data
- Integration tests invoking CLI with --discussion-stats against a mock GitHub server
- Maintain existing unit and integration tests for other commands
- Ensure coverage thresholds and lint rules continue to pass