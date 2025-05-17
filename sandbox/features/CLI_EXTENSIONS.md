# CLI Extensions Feature

## Mission Alignment

The `--stream` flag enables real-time streaming outputs from chat completions, advancing the mission to facilitate responsive, autonomous agentic workflows that evolve continuously. For full mission details, see [Mission Statement](../MISSION.md).

## Feature Overview

The `--stream` extension allows users to receive incremental messages from OpenAI as they are generated, creating an interactive, low-latency experience for real-time decision-making in automated workflows.

### Usage

```bash
npx agentic-lib --stream
```

- Starts the CLI in streaming mode.
- Prints chat completions line by line as they are received.

### Benefits

- Reduced latency for large responses.
- Enhanced interactivity for autonomous agents.
