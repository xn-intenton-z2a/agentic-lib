# agenticHandler

Enables AI-driven agentic workflows by sending a prompt to the OpenAI API and returning structured JSON results.

## Function Signature

```js
import { agenticHandler } from "@xn-intenton-z2a/agentic-lib";

async function agenticHandler(
  prompt: string,
  options?: { model?: string }
): Promise<object>
```

### Parameters

- `prompt` (string): The user prompt to send to the AI.
- `options.model` (string, optional): The OpenAI model to use (default: `"gpt-4"`).

### Returns

A `Promise` that resolves to the parsed JSON object returned by the AI.

### Errors

- Throws an `Error` with message `Missing OPENAI_API_KEY` if the API key is not configured.
- Throws an `Error` `Failed to parse JSON response: <raw>` if the API response is not valid JSON.

## Example

```js
import { agenticHandler } from "@xn-intenton-z2a/agentic-lib";

async function run() {
  try {
    const result = await agenticHandler("Refine this text", { model: "gpt-4" });
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}

run();
// Sample output:
// { refinedText: "Refined version of this text", suggestions: [...] }
```