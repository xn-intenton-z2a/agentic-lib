# OPENAI_API

## Crawl Summary
OpenAI API Reference details a POST /v1/completions endpoint requiring a valid Bearer token. It specifies parameters: model (string), prompt (string), temperature (number, default 1), and max_tokens (number, default 16). Returns a CompletionResponse with choices and usage details.

## Normalised Extract
Table of Contents:
1. Authentication
2. API Endpoint /v1/completions
3. Parameter Details
4. Return Types
5. Error Handling

1. Authentication:
- Requires HTTPS with header Authorization: Bearer YOUR_API_KEY.

2. API Endpoint (/v1/completions):
- Method: POST
- URL: https://api.openai.com/v1/completions

3. Parameter Details:
- model: string; valid engine id (e.g., 'text-davinci-003').
- prompt: string; text input for completion.
- temperature: number; optional, controls output randomness, default is 1.
- max_tokens: number; optional, sets maximum tokens for the response, default is 16 (max 2048).

4. Return Types:
- CompletionResponse object containing a choices array with each element having text, index, logprobs (nullable), finish_reason, and a usage object with token counts.

5. Error Handling:
- Status codes: 200 success, 400 bad requests, 401 unauthorized, 429 rate limit errors. Implements standard error message payloads.

## Supplementary Details
Essential technical specifications include:
- HTTPS required with Content-Type application/json.
- Parameter constraints: temperature range [0,1]; max_tokens up to 2048.
- Rate limiting enforced; best practices include using retries with exponential backoff.
- Implementation Steps:
  1) Set HTTP headers: Authorization with Bearer token and Content-Type.
  2) Construct JSON payload with required parameters.
  3) POST to https://api.openai.com/v1/completions.
  4) Process response ensuring it conforms to the CompletionResponse schema.
  5) Handle errors based on HTTP status codes.
- Additional endpoints (e.g., /v1/engines, /v1/files) follow similar conventions.

## Reference Details
API Specification:
Method: POST /v1/completions
Parameters:
  - model (string): e.g., 'text-davinci-003'
  - prompt (string): text input
  - temperature (number, optional): default 1, range 0 to 1
  - max_tokens (number, optional): default 16, maximum 2048
Return Type: CompletionResponse object structured as:
{
  choices: [
    {
      text: string,
      index: number,
      logprobs: object or null,
      finish_reason: string
    }
  ],
  usage: {
    prompt_tokens: number,
    completion_tokens: number,
    total_tokens: number
  }
}

SDK Method Signature:
function createCompletion(model: string, prompt: string, temperature?: number, max_tokens?: number): Promise<CompletionResponse>

Code Example:
// Initialize request parameters
const payload = {
  model: 'text-davinci-003',
  prompt: 'Say this is a test',
  temperature: 0,
  max_tokens: 7
};

// Set headers
const headers = {
  'Authorization': 'Bearer YOUR_API_KEY',
  'Content-Type': 'application/json'
};

// Make POST request
const response = await fetch('https://api.openai.com/v1/completions', {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(payload)
});

// Process response
if (response.ok) {
  const data = await response.json();
  // Utilize CompletionResponse data
} else {
  // Handle errors (e.g., 400, 401, 429)
}

Configuration Options:
- timeout: 60000ms
- retries: 3
- baseURL: 'https://api.openai.com'

Troubleshooting Procedures:
- For HTTP 429, check account rate limits and implement backoff.
- For HTTP 401, verify the correctness of the API key in Authorization header.
- For HTTP 400, ensure the JSON payload adheres to required schema.

## Information Dense Extract
POST /v1/completions, Headers: Authorization: Bearer YOUR_API_KEY, Content-Type: application/json; Parameters: model(string, eg text-davinci-003), prompt(string), temperature(number, default1, range0-1), max_tokens(number, default16, max2048); Returns: CompletionResponse{choices:[{text, index, logprobs, finish_reason}], usage:{prompt_tokens, completion_tokens, total_tokens}}; SDK: createCompletion(model:string, prompt:string, temperature?:number, max_tokens?:number):Promise<CompletionResponse>; Config: timeout 60000ms, retries 3, baseURL https://api.openai.com; Errors: 400 bad request, 401 unauthorized, 429 rate limit.

## Sanitised Extract
Table of Contents:
1. Authentication
2. API Endpoint /v1/completions
3. Parameter Details
4. Return Types
5. Error Handling

1. Authentication:
- Requires HTTPS with header Authorization: Bearer YOUR_API_KEY.

2. API Endpoint (/v1/completions):
- Method: POST
- URL: https://api.openai.com/v1/completions

3. Parameter Details:
- model: string; valid engine id (e.g., 'text-davinci-003').
- prompt: string; text input for completion.
- temperature: number; optional, controls output randomness, default is 1.
- max_tokens: number; optional, sets maximum tokens for the response, default is 16 (max 2048).

4. Return Types:
- CompletionResponse object containing a choices array with each element having text, index, logprobs (nullable), finish_reason, and a usage object with token counts.

5. Error Handling:
- Status codes: 200 success, 400 bad requests, 401 unauthorized, 429 rate limit errors. Implements standard error message payloads.

## Original Source
OpenAI API Reference
https://platform.openai.com/docs/api-reference

## Digest of OPENAI_API

# OPENAI API REFERENCE
Date Retrieved: 2023-10-07

# Endpoints

POST /v1/completions

Parameters:
  - model (string): Identifier of the model to be used. Example: 'text-davinci-003'.
  - prompt (string): The text prompt to generate a completion from.
  - temperature (number, optional): Controls randomness in output (default: 1). Acceptable range 0-1.
  - max_tokens (number, optional): Maximum number of tokens to generate (default: 16, max: 2048).

Returns:
  - CompletionResponse: {
      choices: [
        {
          text: string,
          index: number,
          logprobs: object or null,
          finish_reason: string
        }
      ],
      usage: {
        prompt_tokens: number,
        completion_tokens: number,
        total_tokens: number
      }
    }

API Example Request (JSON):
{
  "model": "text-davinci-003",
  "prompt": "Say this is a test",
  "temperature": 0,
  "max_tokens": 7
}

# Authentication

All requests require an HTTPS POST with an HTTP header:
  Authorization: Bearer YOUR_API_KEY

# Error Handling

Standard HTTP status codes are used:
  - 200 for success
  - 400 for malformed requests
  - 401 for authentication errors
  - 429 for rate limiting issues

# Configuration and Best Practices

- Use Content-Type: application/json
- Validate the JSON response to match CompletionResponse schema.
- Implement exponential backoff retry for 429 errors.
- Ensure valid engine id is supplied in the model parameter.

## Attribution
- Source: OpenAI API Reference
- URL: https://platform.openai.com/docs/api-reference
- License: License: OpenAI API Terms
- Crawl Date: 2025-05-02T20:22:19.348Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-05-02
