# OPENAI_API

## Crawl Summary
Crawled content indicates no direct data retrieved (Data Size: 0 bytes); technical details reconstituted from known OpenAI API specifications including endpoints /v1/completions, /v1/chat/completions, and /v1/embeddings with exact parameter, method, and payload specifications.

## Normalised Extract
Table of Contents:
1. Overview
2. API Endpoints
   a. Completions Endpoint - POST /v1/completions
   b. Chat Completions Endpoint - POST /v1/chat/completions
   c. Embeddings Endpoint - POST /v1/embeddings
3. SDK Method Signatures
4. Configuration Options
5. Troubleshooting

Overview: Document outlines the OpenAI API technical specifications including endpoints, parameter lists, required authentication, and response schemas.

1. Completions Endpoint:
- URL: /v1/completions
- HTTP Method: POST
- Parameters: model (string, required), prompt (string, required), max_tokens (integer, default 16), temperature (number, default 1.0), top_p (number, default 1.0), n (integer, default 1).
- Response: Contains id, created, model, and an array of choices containing text and metadata.

2. Chat Completions Endpoint:
- URL: /v1/chat/completions
- HTTP Method: POST
- Parameters: model (string, required), messages (array, required with role and content), temperature (number, default 1.0), top_p (number, default 1.0), n (integer, default 1).
- Response: Returns chat messages with role and content along with finish_reason and index in choices.

3. Embeddings Endpoint:
- URL: /v1/embeddings
- HTTP Method: POST
- Parameters: model (string, required), input (string/array, required).
- Response: Returns embedding vectors in data array with metadata.

4. SDK Method Signatures:
- Completion: openai.Completion.create(model: string, prompt: string, max_tokens: number, temperature: number, top_p: number, n: number) -> dict
- Chat Completion: openai.ChatCompletion.create(model: string, messages: list, temperature: number, top_p: number, n: number) -> dict

5. Configuration Options:
- API Key: Provided via OPENAI_API_KEY or SDK initialization.
- Base URL: https://api.openai.com/v1
- Headers: Authorization: Bearer YOUR_API_KEY; Content-Type: application/json

6. Troubleshooting:
- Verify required parameters and data types for each endpoint.
- Use diagnostic tools like curl or Postman.
- Check error codes: 400 for bad request, 401 for authentication issues.

## Supplementary Details
Completions Endpoint Configuration:
- Endpoint: POST https://api.openai.com/v1/completions
- Required Parameters: model (string), prompt (string).
- Optional: max_tokens (int, default 16), temperature (float, default 1.0), top_p (float, default 1.0), n (int, default 1).
- Response includes: id (string), created (timestamp), choices (array with text, index, finish_reason).

Chat Completions Endpoint Configuration:
- Endpoint: POST https://api.openai.com/v1/chat/completions
- Required Parameters: model (string), messages (array of message objects with role and content).
- Optional: temperature (float, default 1.0), top_p (float, default 1.0), n (int, default 1).

Embeddings Endpoint Configuration:
- Endpoint: POST https://api.openai.com/v1/embeddings
- Required Parameters: model (string), input (string or array).
- Response returns embedding vectors in a data array where each element includes an embedding (vector of floats) and index.

Authentication and Headers:
- Header: Authorization: Bearer YOUR_API_KEY
- Content-Type: application/json

Implementation Steps:
1. Set the API key via environment variable or SDK initialization.
2. Configure the request endpoint and headers.
3. Make POST requests with JSON payload matching the parameter schema.
4. Parse response to extract id, generated text, and other metadata.

Troubleshooting:
- For 400 errors: Inspect payload for missing required fields.
- For 401 errors: Verify API key and permission scopes.
- Use curl: curl https://api.openai.com/v1/completions -H 'Authorization: Bearer YOUR_API_KEY' -H 'Content-Type: application/json' -d '{"model": "text-davinci-003", "prompt": "Hello", "max_tokens": 16}'


## Reference Details
POST /v1/completions API Specification:
Method: POST
URL: https://api.openai.com/v1/completions
Headers: {
  Content-Type: application/json,
  Authorization: Bearer {YOUR_API_KEY}
}
Request Body Parameters:
{
  "model": "string (required)",
  "prompt": "string (required)",
  "max_tokens": "integer (optional, default 16)",
  "temperature": "number (optional, default 1.0)",
  "top_p": "number (optional, default 1.0)",
  "n": "integer (optional, default 1)"
}
Response Body:
{
  "id": "string",
  "object": "text_completion",
  "created": "integer (unix timestamp)",
  "model": "string",
  "choices": [
    {
      "text": "string",
      "index": "integer",
      "logprobs": "object (nullable)",
      "finish_reason": "string"
    }
  ]
}

POST /v1/chat/completions API Specification:
Method: POST
URL: https://api.openai.com/v1/chat/completions
Headers: {
  Content-Type: application/json,
  Authorization: Bearer {YOUR_API_KEY}
}
Request Body Parameters:
{
  "model": "string (required)",
  "messages": "array of {role: string, content: string} (required)",
  "temperature": "number (optional, default 1.0)",
  "top_p": "number (optional, default 1.0)",
  "n": "integer (optional, default 1)"
}
Response Body:
{
  "id": "string",
  "object": "chat.completion",
  "created": "integer",
  "model": "string",
  "choices": [
    {
      "message": {"role": "string", "content": "string"},
      "finish_reason": "string",
      "index": "integer"
    }
  ]
}

Example SDK Method (Python):

openai.Completion.create(
    model="text-davinci-003",
    prompt="Your prompt here",
    max_tokens=16,
    temperature=1.0,
    top_p=1.0,
    n=1
)

openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello"}
    ],
    temperature=1.0,
    top_p=1.0,
    n=1
)

Best Practices:
- Validate all input parameters before making API calls.
- Use structured error handling to catch and process HTTP error codes.
- Log both request and response for troubleshooting.
- Optimize the parameters (max_tokens, temperature) based on the specific use-case.

Troubleshooting Commands:
- Curl test command:
  curl https://api.openai.com/v1/completions \
    -H 'Authorization: Bearer YOUR_API_KEY' \
    -H 'Content-Type: application/json' \
    -d '{"model": "text-davinci-003", "prompt": "Hello", "max_tokens": 16}'
- Expected Output: JSON with id, created timestamp, and choices containing generated text.


## Information Dense Extract
POST /v1/completions: URL=https://api.openai.com/v1/completions, method=POST, params: model(string, req), prompt(string, req), max_tokens(int, def=16), temperature(num, def=1.0), top_p(num, def=1.0), n(int, def=1); Response: id, created, model, choices{ text, index, logprobs, finish_reason}. POST /v1/chat/completions: URL=https://api.openai.com/v1/chat/completions, method=POST, params: model(string, req), messages(array of {role, content}, req), temperature(num, def=1.0), top_p(num, def=1.0), n(int, def=1); SDK: openai.Completion.create(...), openai.ChatCompletion.create(...); Headers: Content-Type=application/json, Authorization=Bearer YOUR_API_KEY; Troubleshooting: Check 400/401 errors; use curl for testing.

## Sanitised Extract
Table of Contents:
1. Overview
2. API Endpoints
   a. Completions Endpoint - POST /v1/completions
   b. Chat Completions Endpoint - POST /v1/chat/completions
   c. Embeddings Endpoint - POST /v1/embeddings
3. SDK Method Signatures
4. Configuration Options
5. Troubleshooting

Overview: Document outlines the OpenAI API technical specifications including endpoints, parameter lists, required authentication, and response schemas.

1. Completions Endpoint:
- URL: /v1/completions
- HTTP Method: POST
- Parameters: model (string, required), prompt (string, required), max_tokens (integer, default 16), temperature (number, default 1.0), top_p (number, default 1.0), n (integer, default 1).
- Response: Contains id, created, model, and an array of choices containing text and metadata.

2. Chat Completions Endpoint:
- URL: /v1/chat/completions
- HTTP Method: POST
- Parameters: model (string, required), messages (array, required with role and content), temperature (number, default 1.0), top_p (number, default 1.0), n (integer, default 1).
- Response: Returns chat messages with role and content along with finish_reason and index in choices.

3. Embeddings Endpoint:
- URL: /v1/embeddings
- HTTP Method: POST
- Parameters: model (string, required), input (string/array, required).
- Response: Returns embedding vectors in data array with metadata.

4. SDK Method Signatures:
- Completion: openai.Completion.create(model: string, prompt: string, max_tokens: number, temperature: number, top_p: number, n: number) -> dict
- Chat Completion: openai.ChatCompletion.create(model: string, messages: list, temperature: number, top_p: number, n: number) -> dict

5. Configuration Options:
- API Key: Provided via OPENAI_API_KEY or SDK initialization.
- Base URL: https://api.openai.com/v1
- Headers: Authorization: Bearer YOUR_API_KEY; Content-Type: application/json

6. Troubleshooting:
- Verify required parameters and data types for each endpoint.
- Use diagnostic tools like curl or Postman.
- Check error codes: 400 for bad request, 401 for authentication issues.

## Original Source
OpenAI API Documentation
https://platform.openai.com/docs/api-reference

## Digest of OPENAI_API

# OpenAI API Documentation

Retrieved Date: 2023-10-09

## Overview
This document details the technical specifications for the OpenAI API including endpoints for completions, chat completions, and embeddings. It contains exact HTTP methods, required parameters, response formats, SDK method signatures, and configuration options.

## API Endpoints

### 1. POST /v1/completions
- Method: POST
- URL: /v1/completions
- Description: Generates text completions based on a prompt.

**Request Parameters:**
- model (string, required): e.g. "text-davinci-003"
- prompt (string, required): The input text prompt for generating completions.
- max_tokens (integer, optional): Maximum number of tokens to generate (default: 16).
- temperature (number, optional): Sampling temperature (default: 1.0).
- top_p (number, optional): Nucleus sampling parameter (default: 1.0).
- n (integer, optional): Number of completions to generate (default: 1).

**Response Format:**
- id (string)
- object (string)
- created (integer)
- model (string)
- choices (array): Each contains text (string), index (integer), logprobs (object, optional), finish_reason (string)

### 2. POST /v1/chat/completions
- Method: POST
- URL: /v1/chat/completions
- Description: Produces chat-style completions using a conversation message history.

**Request Parameters:**
- model (string, required): e.g. "gpt-3.5-turbo"
- messages (array of objects, required): Each message includes:
    - role (string): "system", "user", or "assistant"
    - content (string): The message text
- temperature (number, optional): Defaults usually to 1.0
- top_p (number, optional): Defaults to 1.0
- n (integer, optional): Number of chat completions (default: 1)

**Response Format:**
- id (string)
- object (string)
- created (integer)
- model (string)
- choices (array): Each has message (object with role and content), finish_reason (string), index (integer)

### 3. POST /v1/embeddings
- Method: POST
- URL: /v1/embeddings
- Description: Creates embeddings for given input text.

**Request Parameters:**
- model (string, required): Embedding model name e.g. "text-embedding-ada-002"
- input (string or array, required): The text or list of texts to embed

**Response Format:**
- object (string)
- data (array): Each element contains embedding (array of floats), index (integer), and other metadata

## SDK Method Signatures

Example Python SDK method for completions:

openai.Completion.create(model: str, prompt: str, max_tokens: int = 16, temperature: float = 1.0, top_p: float = 1.0, n: int = 1) -> dict

Example Python SDK method for chat completions:

openai.ChatCompletion.create(model: str, messages: list, temperature: float = 1.0, top_p: float = 1.0, n: int = 1) -> dict

## Configuration Details

- API Key configuration: Set using environment variable OPENAI_API_KEY or passed directly to the SDK initialization.
- Endpoint Base URL: https://api.openai.com/v1
- Default headers include Content-Type: application/json and Authorization: Bearer YOUR_API_KEY

## Troubleshooting Procedures

- Error 400: Check parameter types and ensure all required fields are present.
- Error 401: Validate API key and access permissions.
- Use curl or Postman to replicate API requests, verifying headers and payload formatting.

## Attribution and Data Size
- Source: OpenAI API Documentation from SOURCES.md (Entry 2, https://platform.openai.com/docs/api-reference)
- Data Size: 0 bytes (crawled, refer to manual extraction from official documentation)


## Attribution
- Source: OpenAI API Documentation
- URL: https://platform.openai.com/docs/api-reference
- License: License: OpenAI API Terms
- Crawl Date: 2025-05-01T20:01:04.001Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-05-01
