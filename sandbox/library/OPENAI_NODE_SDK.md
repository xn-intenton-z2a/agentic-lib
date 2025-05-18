# OpenAI Node SDK Integration

## Mission Alignment

The OpenAI Node SDK integration simplifies communication with OpenAI APIs within agentic-lib, enabling continuous, autonomous agentic workflows by abstracting API interactions and environment management. For mission details, see [Mission Statement](../MISSION.md).

## Installation

```bash
npm install openai @xn-intenton-z2a/agentic-lib
```

## Configuration

Set the `OPENAI_API_KEY` environment variable:

```bash
export OPENAI_API_KEY=your_api_key
```

## Usage

```js
import { Configuration, OpenAIApi } from "openai";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

openai.createChatCompletion({
  model: "gpt-4o",
  messages: [ { role: "user", content: "Hello" } ]
}).then(response => {
  console.log(response.data);
});
```