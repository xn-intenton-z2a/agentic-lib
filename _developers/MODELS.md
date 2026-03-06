# Copilot SDK Available Models

Last updated: 2026-03-06 (via `client.listModels()`)

## Models

| ID                | Name            | Provider  | Premium   | Context | Max Output | Vision         | Tools          | Reasoning Effort       |
| ----------------- | --------------- | --------- | --------- | ------- | ---------- | -------------- | -------------- | ---------------------- |
| `claude-sonnet-4` | Claude Sonnet 4 | Anthropic | Yes (1x)  | 216K    | 16K        | Yes (5 images) | Yes (parallel) | No (has thinking mode) |
| `gpt-5-mini`      | GPT-5 mini      | OpenAI    | No (free) | 264K    | 64K        | Yes (1 image)  | Yes (parallel) | Yes (low/medium/high)  |
| `gpt-4.1`         | GPT-4.1         | OpenAI    | No (free) | 128K    | 16K        | Yes (1 image)  | Yes (parallel) | No                     |

## Default Models

There are two defaults in the system:

- **CLI default** (`npx agentic-lib init`): **`claude-sonnet-4`** (via Copilot SDK)
- **TOML/workflow default** (`agentic-lib.toml`, `agentic-lib-workflow.yml`): **`gpt-5-mini`**

The TOML `[tuning].model` field controls what model the workflow uses. The CLI default is for interactive use.

## Reasoning Effort

The `reasoning-effort` tuning parameter (low/medium/high/none) is only supported by:

- **gpt-5-mini** — mapped to OpenAI's reasoning effort parameter
- **o4-mini** — mapped to OpenAI's reasoning effort parameter

For other models (claude-sonnet-4, gpt-4.1), the parameter is silently ignored. Set `reasoning-effort = "none"` to explicitly disable it.

The allowlist is maintained in `src/actions/agentic-step/copilot.js` (`MODELS_SUPPORTING_REASONING_EFFORT`).

## Billing Tiers

Premium models (like Claude Sonnet 4) are restricted to:

- Pro, Pro Plus, Max, Business, Enterprise, Edu plans

Free models (GPT-5 mini, GPT-4.1) are available to all Copilot plans.

## Notes

- Model IDs are what you pass to `createSession({ model: "..." })`
- The previously used `claude-sonnet-4.5` is NOT a valid model ID
- Use `node scripts/test-copilot-local.js` to list current models
- Models may change — GitHub controls what's available through the Copilot API
