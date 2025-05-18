# LANGCHAIN Quickstart

## Mission Alignment

The LangChain Quickstart guide demonstrates how to leverage LangChain within agentic-lib to build autonomous, continuous LLM-driven workflows, supporting our mission to empower agentic interactions. For mission details, see [Mission Statement](../MISSION.md).

## Prerequisites

- Node.js >= 20
- npm or yarn

## Installation

```bash
npm install langchain @xn-intenton-z2a/agentic-lib
```

## Usage

```js
import { AgenticChain } from "@xn-intenton-z2a/agentic-lib";
import { LLMChain } from "langchain";

const chain = new AgenticChain({
  llmChain: new LLMChain({ llm: /* your llm here */ }),
});

chain.run("Your prompt").then(console.log);
```