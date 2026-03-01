# Copilot SDK Available Models

Last updated: 2026-03-01 (via `client.listModels()`)

## Models

| ID                | Name            | Provider  | Premium   | Context | Max Output | Vision         | Tools          | Reasoning                |
| ----------------- | --------------- | --------- | --------- | ------- | ---------- | -------------- | -------------- | ------------------------ |
| `claude-sonnet-4` | Claude Sonnet 4 | Anthropic | Yes (1x)  | 216K    | 16K        | Yes (5 images) | Yes (parallel) | Thinking (1K-32K budget) |
| `gpt-5-mini`      | GPT-5 mini      | OpenAI    | No (free) | 264K    | 64K        | Yes (1 image)  | Yes (parallel) | Yes (low/medium/high)    |
| `gpt-4.1`         | GPT-4.1         | OpenAI    | No (free) | 128K    | 16K        | Yes (1 image)  | Yes (parallel) | No                       |

## Default Model

The default model for agentic-step workflows is **`claude-sonnet-4`**.

## Billing Tiers

Premium models (like Claude Sonnet 4) are restricted to:

- Pro, Pro Plus, Max, Business, Enterprise, Edu plans

Free models (GPT-5 mini, GPT-4.1) are available to all Copilot plans.

## Notes

- Model IDs are what you pass to `createSession({ model: "..." })`
- The previously used `claude-sonnet-4.5` is NOT a valid model ID
- Use `node scripts/test-copilot-local.js` to list current models
- Models may change — GitHub controls what's available through the Copilot API
