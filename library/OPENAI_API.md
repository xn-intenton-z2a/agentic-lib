# OPENAI_API

## Crawl Summary
OpenAI API endpoints such as /v1/completions and /v1/chat/completions accept JSON payloads. They require API key based authentication using the Authorization header. Key parameters include model (string), prompt/messages, temperature (number), max_tokens (integer), n (integer), and stop sequences. The response is a JSON object containing id, object, created time, choices with text, and token usage. Error responses carry explicit HTTP status codes and error details.

## Normalised Extract
TABLE OF CONTENTS:
1. Authentication
2. Endpoints
3. Request Parameters
4. Response Structure
5. Error Handling

1. Authentication:
- Use header Authorization with value 'Bearer YOUR_API_KEY'.

2. Endpoints:
- /v1/completions: POST request to generate text completions.
- /v1/chat/completions: POST request for conversation based completions.

3. Request Parameters:
- model: string value for the selected model (e.g., text-davinci-003).
- prompt/messages: string or array input for generating responses.
- temperature: numeric value controlling randomness (e.g. 0.7).
- max_tokens: integer defining maximum token count.
- n: integer to specify number of completions.
- stop: string or array delineating stop sequences.

4. Response Structure:
- id: unique identifier string.
- object: type identifier string.
- created: integer timestamp.
- choices: array with objects containing text, index, finish_reason, and optionally logprobs.
- usage: object detailing prompt_tokens, completion_tokens, total_tokens.

5. Error Handling:
- Return HTTP error codes (400, 401, 429, 500) with detailed JSON error objects including message, type, param, and code.

## Supplementary Details
Authentication: Set header Authorization = 'Bearer {your_api_key}' and Content-Type = 'application/json'.

Endpoint Details:
- POST /v1/completions:
  Body must include: model (e.g., 'text-davinci-003'), prompt, temperature (default 1.0 if not specified), max_tokens, n, and stop. 
- POST /v1/chat/completions:
  Body must include: model (e.g., 'gpt-3.5-turbo'), messages (array of message objects with roles 'system', 'user', 'assistant'), temperature, top_p, max_tokens.

Configuration Options:
- temperature: default 1.0, recommended range: 0 to 2.
- max_tokens: recommended value depends on use case; ensure response tokens do not exceed model limits.

Implementation Steps:
1. Prepare request payload with exact parameters.
2. Set proper HTTP headers for authentication and content type.
3. Issue POST request to the required endpoint.
4. Validate response JSON for id, choices and handle errors based on status code.

Best Practices:
- Validate API key and usage limits before making calls.
- Check error responses for specific troubleshooting messages.
- Use explicit parameter values for consistency across requests.

## Reference Details
API Endpoint: POST https://api.openai.com/v1/completions
Method Signature: function generateCompletion(apiKey: string, model: string, prompt: string, temperature: number, max_tokens: number, n?: number, stop?: string | string[]): Promise<{ id: string, object: string, created: number, choices: Array<{ text: string, index: number, finish_reason: string, logprobs?: object }>, usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number } }>
Parameters:
- apiKey: string - Your OpenAI API key.
- model: string - e.g., 'text-davinci-003'.
- prompt: string - The text prompt for completion.
- temperature: number - Controls sample randomness; range [0, 2].
- max_tokens: number - Maximum number of tokens to generate.
- n: number (optional) - Number of completions to generate.
- stop: string or string[] (optional) - Sequence(s) to stop generation.

Example Request:
POST https://api.openai.com/v1/completions
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_API_KEY
Body:
{
  "model": "text-davinci-003",
  "prompt": "Explain the theory of relativity.",
  "temperature": 0.7,
  "max_tokens": 150,
  "n": 1,
  "stop": ["\n"]
}

Return:
{
  "id": "cmpl-xxxxx",
  "object": "text_completion",
  "created": 1610078135,
  "choices": [
    {
      "text": "The theory of relativity, developed by Einstein...",
      "index": 0,
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 50,
    "total_tokens": 60
  }
}

Troubleshooting Commands:
- Validate API key presence and correctness.
- Use curl command for testing:
  curl https://api.openai.com/v1/completions -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_API_KEY" -d '{"model":"text-davinci-003","prompt":"Hello, world!","temperature":0.7,"max_tokens":5}'
- Check network connectivity and endpoint availability.

SDK Integration Pattern:
1. Initialize HTTP client with base URL 'https://api.openai.com/v1/'.
2. Attach headers for authentication.
3. Define function generateCompletion with typed parameters as above.
4. Implement error handling for HTTP statuses 400, 401, 429, 500.

Configuration Options Summary:
- schedule: schedule-1
- sourcesLimit: 8
- documentsLimit: 16
- featuresWipLimit: 2
- featureDevelopmentIssuesWipLimit: 3
- maintenanceIssuesWipLimit: 2
- attemptsPerBranch: 2
- attemptsPerIssue: 2

## Information Dense Extract
OpenAI API; Authentication: Bearer token; Endpoints: POST /v1/completions, /v1/chat/completions; Parameters: model (string), prompt/messages, temperature (float, default 1.0), max_tokens (int), n (optional int), stop (optional string/array); Response: id (string), created (int), choices (array{text, index, finish_reason, logprobs?}), usage (object with prompt_tokens, completion_tokens, total_tokens); SDK Signature: generateCompletion(apiKey: string, model: string, prompt: string, temperature: number, max_tokens: number, n?: number, stop?: string|string[]): Promise<Response>; Troubleshooting: Validate API key, use curl testing, check HTTP status codes; Config Options: schedule=schedule-1, sourcesLimit=8, documentsLimit=16, featuresWipLimit=2, attemptsPerBranch=2.

## Sanitised Extract
TABLE OF CONTENTS:
1. Authentication
2. Endpoints
3. Request Parameters
4. Response Structure
5. Error Handling

1. Authentication:
- Use header Authorization with value 'Bearer YOUR_API_KEY'.

2. Endpoints:
- /v1/completions: POST request to generate text completions.
- /v1/chat/completions: POST request for conversation based completions.

3. Request Parameters:
- model: string value for the selected model (e.g., text-davinci-003).
- prompt/messages: string or array input for generating responses.
- temperature: numeric value controlling randomness (e.g. 0.7).
- max_tokens: integer defining maximum token count.
- n: integer to specify number of completions.
- stop: string or array delineating stop sequences.

4. Response Structure:
- id: unique identifier string.
- object: type identifier string.
- created: integer timestamp.
- choices: array with objects containing text, index, finish_reason, and optionally logprobs.
- usage: object detailing prompt_tokens, completion_tokens, total_tokens.

5. Error Handling:
- Return HTTP error codes (400, 401, 429, 500) with detailed JSON error objects including message, type, param, and code.

## Original Source
OpenAI API Documentation
https://platform.openai.com/docs/api-reference

## Digest of OPENAI_API

# OpenAI API Documentation

Retrieved Date: 2023-10-26

## Overview
The OpenAI API offers a set of endpoints that interface with language models such as text-davinci-003 and gpt-3.5-turbo. The service requires authentication via API keys and operates using HTTPS with JSON payloads.

## Endpoints and Method Signatures
- POST /v1/completions
  - Description: Generate completions for provided prompts.
  - Method Signature: POST https://api.openai.com/v1/completions
  - Required Headers: Content-Type: application/json, Authorization: Bearer {api_key}
- POST /v1/chat/completions
  - Description: Generate chat-based completions with conversation context.
  - Method Signature: POST https://api.openai.com/v1/chat/completions

## Request Parameters
- model (string): The identifier of the model to use (e.g., "text-davinci-003" or "gpt-3.5-turbo").
- prompt or messages: Input text prompt or list of messages for chat endpoint.
- temperature (number): Controls randomness (default 1.0, range 0 to 2).
- max_tokens (integer): Maximum tokens to generate in the completion.
- n (integer): Number of completions to generate for each prompt.
- stop (string or array): Up to 4 sequences where the API will stop generating further tokens.

## Response Structure
- id (string): Unique identifier of the response.
- object (string): Type of returned object.
- created (integer): Unix timestamp of creation.
- choices (array): List of completion objects containing text, index, and logprobs.
- usage (object): Contains token usage (prompt_tokens, completion_tokens, total_tokens).

## Error Handling
- Error Responses include HTTP status codes (e.g., 400, 401, 429, 500) with a JSON body.
- Sample Error Response: { "error": { "message": "Invalid API key.", "type": "invalid_request_error", "param": null, "code": "invalid_api_key" } }

## Attribution
- Source: OpenAI API Documentation
- URL: https://platform.openai.com/docs/api-reference
- License: License: OpenAI API Terms
- Crawl Date: 2025-04-25T21:13:16.206Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-04-25
