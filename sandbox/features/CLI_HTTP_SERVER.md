# Purpose
Extend the existing CLI with an HTTP server mode that exposes runtime usage statistics, on-demand AI chat completion, and GitHub issue creation via RESTful endpoints, in addition to the current command-line flags.

# Value Proposition
Developers and automation systems can integrate with agentic-lib programmatically over HTTP without spawning separate CLI processes. It enables external services to poll metrics, trigger AI prompts, or file GitHub issues through simple HTTP requests, streamlining workflows and monitoring.

# Success Criteria & Requirements
1. HTTP Server Startup
   • Add a --http flag to main() to launch an HTTP server on a configurable port (default 3000).
   • Support an optional --http-port <port> flag or HTTP_PORT environment variable.
   • When --http is provided, skip CLI flag processing and start server.

2. Runtime Stats Endpoint
   • GET /api/stats should return JSON { callCount: number, uptime: number }.

3. AI Chat Endpoint
   • POST /api/chat accepts JSON body { prompt: string, chatJson?: boolean }.
   • Invoke OpenAI chat completion with model gpt-3.5-turbo using existing openai dependency.
   • Respond with plain text content or raw JSON based on chatJson flag.

4. GitHub Issue Endpoint
   • POST /api/issue accepts JSON body { title: string, body: string, labels?: string[] }.
   • Read GITHUB_API_BASE_URL and GITHUB_TOKEN from config, post to /repos/{owner}/{repo}/issues.
   • Respond with JSON containing issue number, URL, and repository.

5. CLI Flags Compatibility
   • Preserve existing --stats, --chat, and --issue flags for backward compatibility.
   • If --http is absent, retain existing CLI behavior unchanged.

# Implementation Details
• Implement serveHttp(args) in src/lib/main.js using Node built-in http module.
• Define request router for /api/stats, /api/chat, /api/issue.
• Reuse processChat and processIssue functions for HTTP handlers.
• Update generateUsage() to document --http and --http-port flags.

# Dependencies & Constraints
• Use only Node 20 built-in http module; no new external dependencies.
• Maintain ESM compatibility and adhere to existing code style.
• Ensure low impact on startup performance when HTTP mode is not used.

# Verification & Acceptance
• Add unit tests in tests/unit/main.test.js mocking http.createServer and request handling.
• Test default and custom HTTP ports, endpoint routing, and error handling.
• Verify existing CLI tests for --stats, --chat, and --issue remain green.