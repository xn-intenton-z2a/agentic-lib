# Purpose
Extend the CLI to provide three core capabilities: runtime usage statistics reporting, on-demand AI chat completion, and GitHub issue creation directly from the command line.

# Value Proposition
Operators and developers gain immediate visibility into command usage and uptime without external monitoring. They can prototype, debug, or automate AI interactions using the same CLI. Additionally, they can file GitHub issues programmatically without leaving the terminal, streamlining feedback and triage for repositories.

# Success Criteria & Requirements
1. Stats Reporting
   • Add a --stats flag recognized in all command paths (--help, --version, --digest, --chat, --issue, or default).  
   • Maintain a global invocation counter in globalThis.callCount, incremented at each entry point.  
   • Compute uptime via process.uptime() at the moment of stats output.  
   • After primary command output, if --stats is present, print JSON with callCount (integer) and uptime (seconds, millisecond precision).

2. AI Chat Completion
   • Add a --chat <prompt> flag to invoke OpenAI chat completion with model gpt-3.5-turbo.  
   • Support an optional --chat-json flag to emit the raw JSON response.  
   • Extract prompt text following the flag, call createChatCompletion using the existing openai dependency and OPENAI_API_KEY.  
   • On success, output either plain text content or raw JSON. On failure, log error via logError and exit with code 1.

3. GitHub Issue Creation
   • Add a --issue flag to create a GitHub issue.  
   • Require --issue-title "<title>" and --issue-body "<body>" flags; support optional --labels "bug,enhancement".  
   • Read GITHUB_API_BASE_URL and GITHUB_TOKEN from environment.  
   • On invocation, POST to /repos/{owner}/{repo}/issues with JSON payload { title, body, labels }.  
   • On success, output JSON with issue number, URL, and repository. On failure, logError and exit with code 1.

4. General Behavior
   • No changes in behavior when none of these flags are provided.  
   • When multiple flags are provided, process in order: chat, issue, then stats.  
   • Do not introduce new external dependencies.

# Implementation Details
- Extend configSchema to include GITHUB_TOKEN as an optional string.  
- Implement shouldPrintStats, processChat, and new processIssue(args) functions in src/lib/main.js.  
- processIssue should parse title, body, and labels, call fetch using global this fetch, handle HTTP response, and log success or error.  
- In main(), before existing command logic, call await processChat(args); then await processIssue(args); then check other commands; after each, if shouldPrintStats(args), console.log stats.
- Update generateUsage() to describe --issue, --issue-title, --issue-body, and --labels flags.

# Dependencies & Constraints
- Use global fetch available in Node 20.  
- Do not add external libraries beyond those declared.  
- Maintain compatibility with ESM, Node 20, and existing code style.

# Verification & Acceptance
- Add unit tests in tests/unit/main.test.js to mock fetch and environment variables, verifying success and error paths for issues.  
- Test ordering: ensure --chat and --issue both trigger respective handlers in sequence.  
- Verify stats output across all commands when --stats is provided.  
- Ensure existing stats and chat tests remain green.