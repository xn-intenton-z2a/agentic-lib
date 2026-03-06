# agentic-lib MCP Server

An MCP (Model Context Protocol) server that exposes autonomous code development tools. Create a workspace from a mission description, iterate on it with any LLM, and watch working code emerge.

## Quick Start

```bash
npx @xn-intenton-z2a/agentic-lib mcp
```

This starts an MCP server on stdio. Connect any MCP client (Claude Code, Cursor, etc.) to use the tools.

## Three Modes

The MCP server supports three ways to provide the LLM intelligence:

### 1. Claude Mode (recommended for Claude Code users)

Claude IS the LLM. No external API needed.

The MCP server handles workspace management and context gathering. Claude reads the context, reasons about the code, and writes files directly.

**Flow:**
1. `workspace_create` — set up workspace from a mission seed
2. `prepare_iteration` — gather mission, features, source, test results
3. Claude reads the context and decides what to do
4. `workspace_write_file` — Claude writes code changes
5. `run_tests` — verify changes work
6. Repeat from step 2

**Setup — Claude Code (`~/.claude/settings.json`):**

```json
{
  "mcpServers": {
    "agentic-lib": {
      "command": "npx",
      "args": ["-y", "@xn-intenton-z2a/agentic-lib@latest", "mcp"]
    }
  }
}
```

No API keys needed. Claude provides the intelligence directly.

**Example conversation:**

> You: Run the hamming-distance mission with lowest resources
>
> Claude: *calls `workspace_create(mission: "hamming-distance")`*
> *calls `prepare_iteration(workspace: "hamming-distance-...")`*
> *reads context, writes code via `workspace_write_file`*
> *calls `run_tests` — tests failing*
> *reads failures, fixes code, calls `run_tests` again*
> Tests pass after 3 iterations.
>
> You: Now try fizz-buzz
>
> Claude: *creates new workspace, iterates until tests pass*

### 2. Copilot Mode (autonomous, no human in the loop)

GitHub Copilot SDK runs as the LLM. The `iterate` tool handles everything autonomously — you just set the workspace and number of cycles.

**Setup — Claude Code:**

```json
{
  "mcpServers": {
    "agentic-lib": {
      "command": "npx",
      "args": ["-y", "@xn-intenton-z2a/agentic-lib@latest", "mcp"],
      "env": {
        "COPILOT_GITHUB_TOKEN": "your-copilot-token"
      }
    }
  }
}
```

**Flow:**
1. `workspace_create` — set up workspace
2. `iterate` — runs N autonomous cycles (maintain-features → transform → test → fix-code)
3. `workspace_status` — see results

**Example conversation:**

> You: Run hamming-distance with lowest resources, then increase and compare
>
> Claude: *calls `workspace_create(mission: "hamming-distance", profile: "min")`*
> *calls `iterate(workspace: "...", cycles: 10)`*
> Min profile: 10 iterations, tests still failing.
>
> *calls `config_set(workspace: "...", profile: "recommended")`*
> *calls `iterate(workspace: "...", cycles: 5)`*
> Recommended profile: tests pass after 2 iterations.

### 3. Ollama Mode (local LLM, fully offline)

Use a local model via Ollama. Same `iterate` flow as Copilot mode but running on your machine. No API keys, no cloud calls.

**Setup — install Ollama and pull a model:**

```bash
# Install Ollama (macOS)
brew install ollama

# Pull a coding model
ollama pull qwen2.5-coder:7b
```

**Setup — Claude Code:**

```json
{
  "mcpServers": {
    "agentic-lib": {
      "command": "npx",
      "args": ["-y", "@xn-intenton-z2a/agentic-lib@latest", "mcp"],
      "env": {
        "OLLAMA_MODEL": "qwen2.5-coder:7b",
        "OLLAMA_BASE_URL": "http://localhost:11434"
      }
    }
  }
}
```

> **Note:** Ollama integration is planned but not yet implemented. The env vars above show the intended interface. For now, use Claude mode (no API needed) or Copilot mode.

## Available Tools

### Workspace Lifecycle

| Tool | Description |
|------|-------------|
| `list_missions` | List available mission seeds (hamming-distance, fizz-buzz, etc.) |
| `workspace_create` | Create workspace from a mission seed with a tuning profile |
| `workspace_list` | List all active workspaces with status |
| `workspace_status` | Full status: mission, features, source, tests, iteration history |
| `workspace_destroy` | Delete a workspace |

### Autonomous Iteration (Copilot/Ollama mode)

| Tool | Description |
|------|-------------|
| `iterate` | Run N cycles of maintain-features → transform → test → fix-code |
| `config_get` | Read agentic-lib.toml configuration |
| `config_set` | Change tuning profile, model, or individual knobs |

### Claude-as-LLM (Claude mode)

| Tool | Description |
|------|-------------|
| `prepare_iteration` | Gather full context (mission, features, source, tests) for Claude to act on |
| `workspace_read_file` | Read a file from a workspace |
| `workspace_write_file` | Write a file to a workspace |
| `workspace_exec` | Run a shell command in a workspace |
| `run_tests` | Run tests and return pass/fail with output |

## Tuning Profiles

Control resource usage with three profiles:

| Profile | Model | Context | Use case |
|---------|-------|---------|----------|
| `min` | gpt-5-mini | Small scans, low reasoning | Fast/cheap CI, experimentation |
| `recommended` | claude-sonnet-4 | Balanced scans | Daily development |
| `max` | gpt-4.1 | Large scans, high reasoning | Thorough transformations |

Change profile mid-run:
```
config_set(workspace: "...", profile: "max")
```

Override individual knobs:
```
config_set(workspace: "...", overrides: { "reasoning-effort": "high", "source-scan": 20 })
```

## Available Missions

Run `list_missions` to see all seeds, or browse:

| Mission | Description |
|---------|-------------|
| hamming-distance | Calculate Hamming distance between strings |
| fizz-buzz | Classic FizzBuzz implementation |
| roman-numerals | Roman numeral conversion |
| string-utils | String utility library |
| dense-encoding | Dense binary encoding |
| cron-engine | Cron expression parser |
| lunar-lander | Lunar lander simulation |
| owl-ontology | OWL ontology processor |
| plot-code-lib | Code visualization library |
| time-series-lab | Time series analysis |
| empty | Blank slate — write your own MISSION.md |

## Workspace Location

Workspaces are created in `~/.agentic-lib/workspaces/` by default.

Override with:
```bash
export AGENTIC_LIB_WORKSPACES=/path/to/workspaces
```

Each workspace is a self-contained Node.js project with its own `package.json`, source code, tests, and configuration.

## Requirements

- Node.js >= 24
- npm
- An MCP client (Claude Code, Cursor, or any MCP-compatible tool)
- For Copilot mode: `COPILOT_GITHUB_TOKEN` with Copilot access
- For Ollama mode: Ollama installed locally (planned)
- For Claude mode: nothing extra — Claude provides the intelligence
