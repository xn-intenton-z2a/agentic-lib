# Purpose
Extend the CLI to provide two core capabilities: runtime usage statistics reporting and on-demand AI chat completion, directly from the command line.

# Value Proposition
Operators and developers gain immediate visibility into command usage and uptime without external monitoring. At the same time, they can prototype, debug, or automate AI interactions using the same CLI, eliminating the need for separate HTTP clients or scripts.

# Success Criteria & Requirements
1. Stats Reporting
   • Add a --stats flag recognized in all command paths (--help, --version, --digest, or default).  
   • Maintain a global invocation counter in globalThis.callCount, incremented at each entry point: main(), processHelp(), processVersion(), processDigest(), and digestLambdaHandler().  
   • Compute uptime via process.uptime() at the moment of stats output.  
   • After primary command output, if --stats is present, print JSON with callCount (integer) and uptime (seconds, millisecond precision).

2. AI Chat Completion
   • Add a --chat <prompt> flag to invoke OpenAI chat completion with model gpt-3.5-turbo.  
   • Support an optional --chat-json flag to emit the raw JSON response.  
   • Extract prompt text following the flag, call createChatCompletion using the existing openai dependency and OPENAI_API_KEY.  
   • On success, output either plain text content or raw JSON. On failure, log error via logError and exit with code 1.

3. General
   • No changes in behavior when neither --stats nor --chat flags are provided.  
   • If both a primary command and --stats or --chat flags are provided, process chat first, then stats.  
   • Do not introduce new external dependencies.

# Implementation Details
- In src/lib/main.js initialize globalThis.callCount = 0 if undefined at module load.  
- Implement shouldPrintStats(args) to detect --stats.  
- Implement processChat(args) async function: detect --chat or --chat-json, extract prompt, configure OpenAI client, call createChatCompletion, handle success and error.  
- In main(), before existing help/version/digest logic, call await processChat(args) and return if processed. After each command or chat, if shouldPrintStats(args), console.log(JSON.stringify({ callCount, uptime })).  
- Update generateUsage() to include descriptions for --stats, --chat, and --chat-json.

# Dependencies & Constraints
- Use the existing openai package.  
- Maintain compatibility with Node 20 and existing ESM code.  
- No additional dependencies beyond those declared in package.json.

# Verification & Acceptance
- Add tests in tests/unit/main.test.js and sandbox/tests to mock process.uptime and openai client.  
- Verify stats output in all command paths with and without --stats.  
- Test chat success with --chat and --chat-json flags; test error path triggers logError and non-zero exit.  
- Ensure ESLint, Prettier, and existing CI checks remain green.