# Overview
Provide a unified CLI tool in sandbox mode that validates key repository artifacts (documentation, examples, manifest, linting, test coverage, license, dependencies), enables bridging from S3 to SQS, supports an HTTP API server for remote workflow invocation, metrics reporting, and health monitoring. Extend this tool with a branch-sweeper capability to automatically prune inactive agent branches according to configuration.

# --branch-sweeper
Auto-prune inactive agent branches in a Git repository based on user-defined criteria. The CLI flag triggers scanning and deletion of stale branches without manual intervention.

Behavior
 • Accept a --config option pointing to a JSON file with sweep parameters (default .branch-sweeper.json).
 • Support inline overrides: --days-inactive N and --branch-prefix PREFIX.
 • Perform a dry run when --dry-run is supplied, listing branches that would be deleted without actual removal.
 • When not in dry-run, delete branches both locally and remotely (git push origin --delete).
 • Emit JSON logs for each branch evaluated: name, lastCommitDate, inactiveDays, action (listed or deleted).
 • On completion emit a summary JSON info log with totalBranches, prunedCount, and exit code 0 if successful or 1 on error.
 • Gracefully handle git errors and missing configuration, logging a JSON error and exiting with code 1.

# Configuration File
The JSON config may include:
 {
   "daysInactive": number,      // minimum days since last commit to consider branch inactive
   "branchPrefixes": [string],  // list of branch name prefixes to include in sweep
   "remote": string             // remote name (default origin)
 }

# Testing and Validation
 • Add a sandbox/tests/branch-sweeper.test.js to mock git commands and verify dry-run and delete modes.
 • Mock file system reads for configuration and git subprocess responses for branch listing and deletion.
 • Verify JSON logs for each action and correct exit codes.
 • Update sandbox/README.md and sandbox/docs/USAGE.md to document the --branch-sweeper flag and its behavior.