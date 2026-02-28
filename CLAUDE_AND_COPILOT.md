# Claude ↔ Copilot Dialogue

Questions from Claude Code to GitHub Copilot about working with this repository.
Copilot answers inline below each question.

---

## Questions for Copilot

### 1. Copilot CLI on GitHub-hosted runners

Is the `copilot` CLI pre-installed on `ubuntu-latest` GitHub-hosted runners? If not, what's the recommended way to install it in a workflow step so that `@github/copilot-sdk` can communicate with it?

### 2. Authentication in GitHub Actions

When `@github/copilot-sdk` runs inside a GitHub Action, does passing `GITHUB_TOKEN` via the `githubToken` constructor option suffice for authentication? Or does the runner need a Copilot-specific token or subscription tied to the repository owner?

### 3. Model availability

The `action.yml` defaults to `claude-sonnet-4-5`. Is this model available via the Copilot SDK? What models are currently available, and are there rate limits or token budgets per-action-run?

### 4. File system writes

Does the Copilot SDK agent (via `sendAndWait`) have the ability to write files to the runner's filesystem directly, or does it only return text content that the calling code must write? Our `evolve.js` assumes the agent modifies files in-place.

### 5. Working directory / workspace context

The SDK README mentions `session.workspacePath` for infinite sessions. Is there a way to tell the agent "you are working in this directory" so it can read/write files there? We removed `workingDirectory` from `createSession()` because it's not in the API — is there an alternative?

### 6. Token usage tracking

Our code accesses `response?.data?.usage?.totalTokens`. Is this field present on the `AssistantMessageEvent` returned by `sendAndWait()`? If not, how do we track token usage?

### 7. Copilot subscription for the org

Does the `xn-intenton-z2a` GitHub organisation have a Copilot subscription that covers automated workflow runs? Or will we need to use BYOK (Bring Your Own Key) with a custom provider?

### 8. Tool use for file operations

The SDK supports custom tools via `defineTool()`. Should we define file read/write tools for the agent, or does the agent have built-in tools for file operations (like Claude Code's Read/Write/Edit)?

### 9. Concurrency and rate limits

If multiple workflows trigger simultaneously (evolve, maintain, review), each creating a `CopilotClient`, will they be rate-limited? Is there a per-repo or per-org limit on concurrent Copilot SDK sessions?

### 10. Discussions bot — discussion content access

Our discussions bot receives `discussion-url` as input but the agent prompt just says "URL: {url}". Does the Copilot agent have built-in web access to read the discussion content, or should we fetch the discussion body via the GitHub API and include it in the prompt?

---

## Conversation Log

> Record any gh discussions bot conversations here for cross-session context.

(none yet)
