# Purpose
Add new command line flags to support GitHub operations directly from the CLI entrypoint, enabling users to create issues and post comments without writing code.

# Value Proposition
Provide a unified CLI interface for agentic workflows to interact with GitHub repositories. Users can open issues and comment on existing issues through simple flags, improving developer efficiency and enabling automation in CI pipelines without additional scripting.

# Success Criteria & Requirements
* Detect and handle --create-issue flag alongside required --owner and --repo parameters and an --issue-json parameter pointing to a JSON string or file path representing title, body, labels, and assignees.
* Detect and handle --comment flag alongside required --owner, --repo, --issue-number and --comment-body parameters.
* On invocation of either flag, call the corresponding functions createRepoIssue or createIssueComment imported from main library.
* Require parameters for each command; if missing or invalid, logError with descriptive message and exit with code 1.
* Increment globalThis.callCount on successful execution of each command.
* Preserve existing CLI behavior for --help, --version, --digest and other flags.
* No new dependencies beyond those already declared.

# Implementation Details
1. In src/lib/main.js, after processDigest, define a new async function processGitHubCLI(args).
2. processGitHubCLI must:
   - Check for args.includes("--create-issue") or args.includes("--comment").
   - For --create-issue: parse owner, repo, and either a JSON string or read file from --issue-json. Validate presence of title and body.
   - For --comment: parse owner, repo, issueNumber, and comment body. Validate each.
   - Import and invoke createRepoIssue(owner, repo, issueObject) or createIssueComment(owner, repo, issueNumber, body).
   - On success, console.log JSON response and return true to signal flag handled.
   - Catch errors, call logError with context and exit with non-zero status.
3. In main(args), before falling back to default output, call if (await processGitHubCLI(args)) { if (VERBOSE_STATS) print stats; return; }.
4. Update README.md under CLI Usage to document:
   - --create-issue --owner <owner> --repo <repo> --issue-json <json or path>
   - --comment --owner <owner> --repo <repo> --issue-number <number> --comment-body <text>
   - Provide example invocations and sample output.
5. Add Vitest tests in tests/unit/main.test.js:
   - Mock createRepoIssue and createIssueComment to return dummy JSON and verify console.log output and callCount increment.
   - Test missing parameters for each command logs error and process.exit is called with code 1.

# Verification & Acceptance
* Successful invocations of --create-issue and --comment produce JSON output and increment callCount.
* Missing required parameters cause logError and exit code 1.
* Existing CLI flags continue to work without regression.
* npm test passes with new tests and no failures in existing tests.