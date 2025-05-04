sandbox/library/OPENAI_API.md
# sandbox/library/OPENAI_API.md
# OPENAI_API

## Crawl Summary
Endpoint POST /v1/completions and POST /v1/chat/completions with detailed parameter sets including model, prompt/messages, max_tokens, temperature, top_p, n, stream, logprobs, stop; configuration via API key and JSON body; error codes 400, 401, 429, 500; troubleshooting via curl commands with explicit header and body information.

## Normalised Extract
Table of Contents:
1. Completions Endpoint
  - URL: /v1/completions
  - Method: POST
  - Required Parameters: model (string), prompt (string|string[]), max_tokens (number)
  - Optional Parameters: suffix (string), temperature (number, default 1.0), top_p (number, default 1.0), n (number, default 1), stream (boolean, default false), logprobs (number), stop (string|string[])
  - Return: JSON with id, created, model, choices (each with text, index, logprobs, finish_reason) and usage stats.
2. Chat Completions Endpoint
  - URL: /v1/chat/completions
  - Method: POST
  - Required Parameters: model (string), messages (array of objects with role and content)
  - Optional: temperature, top_p, n, stream settings
  - Return: JSON with id, model, and message choices with role and content.
3. Embeddings Endpoint
  - URL: /v1/embeddings
  - Method: POST
  - Parameters: model (string), input (string|string[])
  - Return: JSON with embedding vectors and usage stats.
4. Error Handling & Troubleshooting
  - HTTP error codes: 400, 401, 429, 500
  - Example curl command provided for testing API responses.
5. SDK Methods
  - createCompletion with full signature, parameters and return type details provided.
Each section provides exact specification details allowing direct implementation with full parameter sets and expected outputs.

## Supplementary Details
Completions Endpoint detailed specs: POST /v1/completions requires model (string) and prompt (string|string[]); defaults: temperature 1.0, top_p 1.0, n 1, stream false. Chat Endpoint: POST /v1/chat/completions with messages array (each with role and content). Embeddings: POST /v1/embeddings taking model and input. Configuration: API base URL https://api.openai.com/v1, header 'Authorization: Bearer <API_KEY>'; detailed parameter validation necessary. Troubleshooting includes using curl commands with explicit JSON bodies and checking HTTP status codes (400: Bad Request, 401: Unauthorized, 429: Rate Limit Exceeded, 500: Internal Error). Implementation steps include constructing JSON payloads, setting headers correctly, and handling responses as per provided schema. SDK method createCompletion is defined with comprehensive type annotations for parameters and return values.

## Reference Details
API SPECIFICATIONS:
Method: POST /v1/completions
Headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer <API_KEY>' }
Parameters:
  model: string (required)
  prompt: string|string[] (required)
  suffix?: string
  max_tokens: number (required)
  temperature?: number (default: 1.0)
  top_p?: number (default: 1.0)
  n?: number (default: 1)
  stream?: boolean (default: false)
  logprobs?: number
  stop?: string|string[]
Return: { id: string, object: string, created: number, model: string, choices: Array<{ text: string, index: number, logprobs: object|null, finish_reason: string|null }>, usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number } }

SDK Method Signature:
createCompletion(model: string, prompt: string|string[], options?: { suffix?: string, max_tokens?: number, temperature?: number, top_p?: number, n?: number, stream?: boolean, logprobs?: number, echo?: boolean, stop?: string|string[], presence_penalty?: number, frequency_penalty?: number, best_of?: number, logit_bias?: { [token: string]: number }, user?: string }): Promise<CompletionResponse>

Troubleshooting Command:
curl https://api.openai.com/v1/completions -H "Authorization: Bearer $OPENAI_API_KEY" -H "Content-Type: application/json" -d '{"model": "text-davinci-003", "prompt": "Hello, world!", "max_tokens": 5}'

Configuration Options:
API Base URL: https://api.openai.com/v1
Default Parameter Values: temperature 1.0, top_p 1.0, n 1, stream false

Best Practices:
- Validate and sanitize inputs
- Use proper error handling mechanism based on HTTP status codes
- Monitor returned usage stats for cost management
- Implement retries on rate limit errors with exponential backoff

## Information Dense Extract
POST /v1/completions: model(string), prompt(string|string[]), max_tokens(number); optional: suffix(string), temperature(number=1.0), top_p(number=1.0), n(number=1), stream(boolean=false), logprobs(number), stop(string|string[]). Returns JSON {id, created, model, choices: [{text, index, logprobs, finish_reason}], usage: {prompt_tokens, completion_tokens, total_tokens}}. POST /v1/chat/completions: model(string), messages(array:{role, content}); similar optional parameters. Embeddings: POST /v1/embeddings with model(string), input(string|string[]). SDK createCompletion(model, prompt, options) returns Promise<CompletionResponse>; full type definitions provided. Use headers: Content-Type: application/json, Authorization: Bearer <API_KEY>. Troubleshoot with curl; error codes 400, 401, 429, 500. API Base URL: https://api.openai.com/v1.

## Sanitised Extract
Table of Contents:
1. Completions Endpoint
  - URL: /v1/completions
  - Method: POST
  - Required Parameters: model (string), prompt (string|string[]), max_tokens (number)
  - Optional Parameters: suffix (string), temperature (number, default 1.0), top_p (number, default 1.0), n (number, default 1), stream (boolean, default false), logprobs (number), stop (string|string[])
  - Return: JSON with id, created, model, choices (each with text, index, logprobs, finish_reason) and usage stats.
2. Chat Completions Endpoint
  - URL: /v1/chat/completions
  - Method: POST
  - Required Parameters: model (string), messages (array of objects with role and content)
  - Optional: temperature, top_p, n, stream settings
  - Return: JSON with id, model, and message choices with role and content.
3. Embeddings Endpoint
  - URL: /v1/embeddings
  - Method: POST
  - Parameters: model (string), input (string|string[])
  - Return: JSON with embedding vectors and usage stats.
4. Error Handling & Troubleshooting
  - HTTP error codes: 400, 401, 429, 500
  - Example curl command provided for testing API responses.
5. SDK Methods
  - createCompletion with full signature, parameters and return type details provided.
Each section provides exact specification details allowing direct implementation with full parameter sets and expected outputs.

## Original Source
OpenAI API Reference
https://platform.openai.com/docs/api-reference

## Digest of OPENAI_API

# OpenAI API Reference

Retrieved on 2023-10-11

## Overview
This document details the OpenAI API endpoints with exact specifications, method signatures, parameters, configuration options, and troubleshooting procedures. It is intended for developers needing actionable, immediately usable technical details.

## Completions Endpoint
- Endpoint: POST /v1/completions
- Required Headers: Content-Type: application/json, Authorization: Bearer <API_KEY>
- Parameters:
  - model (string, required): The ID of the model to use.
  - prompt (string or array, required): The input text prompt.
  - suffix (string, optional): Text to append after completion.
  - max_tokens (number, required): Maximum tokens for the completion.
  - temperature (number, optional, default 1.0): Controls randomness.
  - top_p (number, optional, default 1.0): Nucleus sampling probability.
  - n (number, optional, default 1): Number of completions to generate.
  - stream (boolean, optional, default false): Whether to stream the output.
  - logprobs (number, optional): Include log probabilities for top tokens.
  - stop (string or array, optional): Sequence(s) where the API will stop generating further tokens.
- Return: JSON object including an id, created timestamp, model name, choices (with text, index, logprobs, finish_reason), and usage stats (prompt_tokens, completion_tokens, total_tokens).

## Chat Completions Endpoint
- Endpoint: POST /v1/chat/completions
- Required Headers: Similar to Completions.
- Parameters:
  - model (string, required): Chat model identifier.
  - messages (array of message objects, required): Each message with role (system, user, assistant) and content (string).
  - temperature, top_p, n, stream (optional): Configurations similar to completions.
- Return: JSON including unique id, timestamp, model, and an array of message choices with roles and content.

## Embeddings Endpoint
- Endpoint: POST /v1/embeddings
- Parameters:
  - model (string, required): Embeddings model identifier.
  - input (string or array, required): Text input for embedding generation.
- Return: JSON object with embedding vectors and usage details.

## Error Handling and Troubleshooting
- Common error responses include HTTP status codes 400 (Bad Request), 401 (Unauthorized), 429 (Too Many Requests), and 500 (Internal Server Error).
- Troubleshooting Command Example:
  curl https://api.openai.com/v1/completions -H "Authorization: Bearer $OPENAI_API_KEY" -H "Content-Type: application/json" -d '{"model": "text-davinci-003", "prompt": "Hello, world!", "max_tokens": 5}'
- Expected outputs include a JSON payload or error message with details.

## SDK Method Signatures and Code Patterns
- createCompletion(model: string, prompt: string | string[], options?: {
    suffix?: string,
    max_tokens?: number,
    temperature?: number,
    top_p?: number,
    n?: number,
    stream?: boolean,
    logprobs?: number,
    echo?: boolean,
    stop?: string | string[],
    presence_penalty?: number,
    frequency_penalty?: number,
    best_of?: number,
    logit_bias?: { [token: string]: number },
    user?: string
}): Promise<{
    id: string,
    object: string,
    created: number,
    model: string,
    choices: Array<{ text: string, index: number, logprobs: object|null, finish_reason: string|null }>,
    usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number }
}>

- Additional methods exist for chat and embeddings with similar structure.

## Configuration Options
- API Base URL: https://api.openai.com/v1
- API Key must be passed in the Authorization header.
- Defaults for parameters: temperature defaults to 1.0, top_p defaults to 1.0, n defaults to 1, stream defaults to false.

## Best Practices
- Validate inputs to avoid errors and excessive token usage.
- Use proper error handling to catch and respond to API errors.
- Monitor usage data provided in the response to manage costs.

## Attribution and Data Size
- Crawled Data Size: 0 bytes
- Source: OpenAI API Reference at https://platform.openai.com/docs/api-reference


## Attribution
- Source: OpenAI API Reference
- URL: https://platform.openai.com/docs/api-reference
- License: License: OpenAI API Terms
- Crawl Date: 2025-05-03T19:22:24.475Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-05-03
