# BYOK (Bring Your Own Key) Configuration Guide

**Purpose:** Configure the agentic-step action to use custom AI providers when GitHub Copilot subscription is unavailable.

**Status:** RESEARCH NEEDED — SDK documentation incomplete

---

## What is BYOK?

BYOK allows the `@github/copilot-sdk` to use **custom AI providers** (OpenAI, Anthropic, etc.) instead of GitHub's managed Copilot service.

**Use cases:**
- Org doesn't have Copilot Business/Enterprise subscription
- Need specific models not available through Copilot
- Testing with alternative providers

---

## SDK Support Status

The `@github/copilot-sdk` README mentions BYOK support, but **documentation is sparse**. We need to:

1. **Check SDK source code** for BYOK configuration options
2. **Test empirically** with a custom provider
3. **Document findings** in this file

---

## Hypothesized Configuration

Based on SDK patterns, BYOK configuration likely happens via:

### Option 1: Constructor parameter

```javascript
import { CopilotClient } from '@github/copilot-sdk';

const client = new CopilotClient({
  // Standard GitHub auth
  githubToken: process.env.GITHUB_TOKEN,
  
  // BYOK provider (hypothesized)
  provider: 'anthropic', // or 'openai'
  apiKey: process.env.ANTHROPIC_API_KEY,
  
  // Optional: custom endpoint
  endpoint: 'https://api.anthropic.com/v1/messages'
});
```

### Option 2: Environment variables

```bash
# GitHub Actions secret configuration
COPILOT_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
```

### Option 3: Session-level configuration

```javascript
const session = await client.createSession({
  model: 'claude-sonnet-4.5',
  
  // BYOK provider config (hypothesized)
  provider: {
    type: 'anthropic',
    apiKey: process.env.ANTHROPIC_API_KEY
  },
  
  systemMessage: { content: prompt },
  tools: agentTools
});
```

---

## Required Research

### 1. SDK Source Code Review

Check `@github/copilot-sdk` source for:
- `CopilotClient` constructor options
- `createSession()` parameters
- Provider abstraction interface
- BYOK-specific methods

### 2. SDK Examples

Look for:
- Example code showing BYOK usage
- Test files demonstrating provider configuration
- Documentation in package README or docs/

### 3. SDK Version Compatibility

- Current version: `^0.1.26` (resolves to 0.1.29)
- BYOK support may be in newer versions
- Check changelog for BYOK feature additions

---

## Integration Plan

Once BYOK configuration is understood:

### Step 1: Add secrets to repository

In repository0 (and agentic-lib if needed):
```bash
gh secret set COPILOT_BYOK_PROVIDER --body "anthropic"
gh secret set ANTHROPIC_API_KEY --body "sk-ant-..."
```

### Step 2: Update agentic-step action

Modify `.github/agentic-lib/actions/agentic-step/index.js`:

```javascript
// Detect BYOK mode
const isBYOK = !!process.env.COPILOT_BYOK_PROVIDER;

const client = new CopilotClient({
  githubToken: process.env.GITHUB_TOKEN,
  
  // Conditional BYOK config
  ...(isBYOK && {
    provider: process.env.COPILOT_BYOK_PROVIDER,
    apiKey: process.env.ANTHROPIC_API_KEY // or OPENAI_API_KEY
  })
});
```

### Step 3: Update workflow files

Add secrets to workflow environments:

```yaml
- name: Run agentic-step
  uses: ./.github/agentic-lib/actions/agentic-step
  with:
    task: evolve
    model: claude-sonnet-4.5
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    COPILOT_BYOK_PROVIDER: ${{ secrets.COPILOT_BYOK_PROVIDER }}
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

### Step 4: Test fallback logic

```javascript
try {
  const client = new CopilotClient({ githubToken });
  await client.listModels(); // Test connection
  core.info('Using GitHub Copilot');
} catch (err) {
  if (err.message.includes('subscription')) {
    core.warning('No Copilot subscription, falling back to BYOK');
    // Initialize BYOK client
  } else {
    throw err;
  }
}
```

---

## Discussions Bot BYOK

The `agent-discussions-bot.yml` workflow is a **prime candidate for BYOK** because:

1. It's a ChatGPT-style conversational bot (not code generation)
2. It doesn't need GitHub-specific Copilot features
3. Claude or GPT-4 models work well for discussion responses

**Configuration:**
```yaml
- name: Run discussions task
  uses: ./.github/agentic-lib/actions/agentic-step
  with:
    task: discussions
    model: gpt-4-turbo # or claude-sonnet-4.5
    discussion_url: ${{ github.event.discussion.html_url }}
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    COPILOT_BYOK_PROVIDER: anthropic
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

---

## Open Questions for Copilot

@copilot — Can you provide guidance on:

1. **BYOK configuration format** — What are the actual constructor options or env vars?
2. **Provider support** — Which providers are supported? (OpenAI, Anthropic, Azure OpenAI, others?)
3. **Authentication patterns** — How does the SDK authenticate with non-GitHub providers?
4. **Model name mapping** — Do model names change? (e.g., `claude-sonnet-4.5` vs `claude-3-5-sonnet-20241022`)
5. **Feature parity** — Does BYOK support all SDK features (tools, streaming, etc.)?
6. **Example code** — Is there example code showing BYOK configuration?

---

## Status

**Current:** Research phase — BYOK configuration patterns unknown  
**Next Step:** Wait for Copilot's guidance or inspect SDK source code  
**Blocking:** Integration tests for agentic-step action

---

## Related Documents

- **[CLAUDE_AND_COPILOT.md](../CLAUDE_AND_COPILOT.md)** — Q&A with Copilot
- **[PLAN_STABILISE_AND_DEPLOY.md](../PLAN_STABILISE_AND_DEPLOY.md)** — SDK integration status
