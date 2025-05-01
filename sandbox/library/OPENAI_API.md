# OPENAI_API

## Crawl Summary
Crawled content contained no data. Technical extraction uses established OpenAI API specifications with endpoints for completions and chat completions. Details include authentication via Bearer token, precise parameter definitions, request and response formats, error codes, and rate limit information.

## Normalised Extract
Table of Contents:
1. Authentication
   - Header: Authorization: Bearer <API_KEY>
   - Environment variable: OPENAI_API_KEY
2. Completions Endpoint
   - Method: POST /v1/completions
   - Required parameters: model (string)
   - Optional parameters: prompt (string), suffix (string), max_tokens (int), temperature (float, default 1), top_p (float, default 1), n (int), stream (bool), logprobs (int), echo (bool), stop (string or list), presence_penalty (float), frequency_penalty (float), best_of (int), logit_bias (map<string,number>), user (string)
3. Chat Completions Endpoint
   - Method: POST /v1/chat/completions
   - Required parameters: model (string), messages (array of objects with role and content)
   - Optional parameters: functions (object), temperature (float, default 1), top_p (float, default 1), n (int), stream (bool), stop (string or list), max_tokens (int), presence_penalty (float), frequency_penalty (float), logit_bias (map<string,number>), user (string)
4. Error Handling
   - Standard HTTP error codes: 400, 401, 429, 500
5. Rate Limits
   - Provided via response headers and API dashboard
Each item lists exact parameter types and endpoint paths for direct implementation.

## Supplementary Details
Authentication: Include header 'Authorization: Bearer YOUR_API_KEY'.
Environment Setup: Set the environment variable OPENAI_API_KEY with your API key.
Endpoint Implementation:
- For completions: send a POST request to https://api.openai.com/v1/completions with a JSON body containing model, prompt, max_tokens, etc. Default temperature is 1, default top_p is 1.
- For chat completions: send a POST request to https://api.openai.com/v1/chat/completions with a JSON body containing model and messages (each message contains role and content). Optional functions parameter allows extended functionality.
Configuration Options:
- temperature: controls randomness (0 to 2, default 1)
- max_tokens: controls response length; check model limits
- logit_bias: provides fine-grained control over token probabilities
Implementation Steps:
1. Verify API key and environment variable.
2. Construct request JSON with required and optional parameters.
3. Execute REST request using HTTPS POST.
4. Parse JSON response for id, created timestamp, choices array, and usage statistics.
5. Implement error handling based on returned HTTP codes.
Troubleshooting:
- Validate JSON structure and parameter types
- Confirm API key correctness
- Use verbose logging for HTTP requests to capture header details
- Check response error codes for specific guidance.

## Reference Details
API Specifications:
1. POST /v1/completions
   - Method Signature: function callCompletions(params: {
       model: string,
       prompt?: string,
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
       logit_bias?: Record<string, number>,
       user?: string
     }): Promise<{
       id: string,
       object: string,
       created: number,
       choices: Array<{
         text: string,
         index: number,
         logprobs: any,
         finish_reason: string
       }>,
       usage: {
         prompt_tokens: number,
         completion_tokens: number,
         total_tokens: number
       }
     }>

2. POST /v1/chat/completions
   - Method Signature: function callChatCompletions(params: {
       model: string,
       messages: Array<{
         role: string,
         content: string
       }>,
       functions?: any,
       temperature?: number,
       top_p?: number,
       n?: number,
       stream?: boolean,
       stop?: string | string[],
       max_tokens?: number,
       presence_penalty?: number,
       frequency_penalty?: number,
       logit_bias?: Record<string, number>,
       user?: string
     }): Promise<{
       id: string,
       object: string,
       created: number,
       choices: Array<{
         index: number,
         message: {
           role: string,
           content: string
         },
         finish_reason: string
       }>,
       usage: {
         prompt_tokens: number,
         completion_tokens: number,
         total_tokens: number
       }
     }>

cURL Example for /v1/completions:
  curl https://api.openai.com/v1/completions 
    -H 'Content-Type: application/json' 
    -H 'Authorization: Bearer YOUR_API_KEY' 
    -d '{ "model": "text-davinci-003", "prompt": "Say this is a test", "max_tokens": 7 }'

Troubleshooting Commands:
- Check API key: echo $OPENAI_API_KEY
- Validate JSON with command: jq . < request.json
- Use cURL verbose: curl -v https://api.openai.com/v1/completions ...

Configuration Options:
- temperature: default 1 (range 0 to 2)
- top_p: default 1 (range 0 to 1)
- max_tokens: model-specific limits
- logit_bias: mapping of token id to bias value

Best Practices:
- Always validate inputs before sending API requests.
- Monitor rate limit headers in API responses.
- Implement exponential backoff for 429 errors.
- Log complete error details for troubleshooting.


## Information Dense Extract
Auth: Bearer token via header; Env var OPENAI_API_KEY. POST /v1/completions: model:string req, prompt:string opt, suffix:string, max_tokens:int, temperature:float (default 1), top_p:float (default 1), n:int, stream:bool, logprobs:int, echo:bool, stop:string|list, presence_penalty:float, frequency_penalty:float, best_of:int, logit_bias:map<string,number>, user:string. POST /v1/chat/completions: model:string req, messages:array<{role:string,content:string}>, optional functions, temperature, top_p, n, stream, stop, max_tokens, presence_penalty, frequency_penalty, logit_bias, user. Returns JSON with id, created, choices[], usage. cURL example provided. Error codes: 400,401,429,500. Rate limit via headers; troubleshooting through API key check, JSON validation, and verbose logging.

## Sanitised Extract
Table of Contents:
1. Authentication
   - Header: Authorization: Bearer <API_KEY>
   - Environment variable: OPENAI_API_KEY
2. Completions Endpoint
   - Method: POST /v1/completions
   - Required parameters: model (string)
   - Optional parameters: prompt (string), suffix (string), max_tokens (int), temperature (float, default 1), top_p (float, default 1), n (int), stream (bool), logprobs (int), echo (bool), stop (string or list), presence_penalty (float), frequency_penalty (float), best_of (int), logit_bias (map<string,number>), user (string)
3. Chat Completions Endpoint
   - Method: POST /v1/chat/completions
   - Required parameters: model (string), messages (array of objects with role and content)
   - Optional parameters: functions (object), temperature (float, default 1), top_p (float, default 1), n (int), stream (bool), stop (string or list), max_tokens (int), presence_penalty (float), frequency_penalty (float), logit_bias (map<string,number>), user (string)
4. Error Handling
   - Standard HTTP error codes: 400, 401, 429, 500
5. Rate Limits
   - Provided via response headers and API dashboard
Each item lists exact parameter types and endpoint paths for direct implementation.

## Original Source
OpenAI API Documentation
https://platform.openai.com/docs/api-reference

## Digest of OPENAI_API

# OpenAI API Documentation

Retrieved Date: 2023-10-04

# Authentication
- Use Bearer authentication in the HTTP header: Authorization: Bearer <API_KEY>
- The API key is provided via the OPENAI_API_KEY environment variable.

# Endpoints

## Completions Endpoint
- Endpoint: POST /v1/completions
- Request Body Parameters:
  - model (string, required): Identifier of the model to use.
  - prompt (string, optional): The input text prompt.
  - suffix (string, optional): A string appended after the generated text.
  - max_tokens (integer, optional): Maximum tokens to generate. Varies by model.
  - temperature (number, optional, default 1): Sampling temperature (value between 0 and 2).
  - top_p (number, optional, default 1): Nucleus sampling parameter (value <= 1).
  - n (integer, optional): Number of completions to generate.
  - stream (boolean, optional): Whether to stream back partial progress.
  - logprobs (integer, optional): Include the log probabilities of tokens.
  - echo (boolean, optional): Echo back the prompt in addition to the completion.
  - stop (string or list, optional): One or more sequences where the API will stop generating further tokens.
  - presence_penalty (number, optional): Penalizes new tokens based on whether they appear in the text so far.
  - frequency_penalty (number, optional): Penalizes new tokens based on their existing frequency in the text so far.
  - best_of (integer, optional): Generates multiple completions server-side and returns the best one.
  - logit_bias (object, optional): Adjust the likelihood of specified tokens, specified as a mapping of token to bias value.
  - user (string, optional): A unique identifier representing the end-user.

## Chat Completions Endpoint
- Endpoint: POST /v1/chat/completions
- Request Body Parameters:
  - model (string, required): Identifier of the chat model to use.
  - messages (array of objects, required): List of message objects with keys role (system, user, assistant) and content (string).
  - functions (object, optional): Optional functions for extended behavior.
  - temperature (number, optional, default 1): Sampling temperature.
  - top_p (number, optional, default 1): Nucleus sampling parameter.
  - n (integer, optional): Number of chat messages to generate.
  - stream (boolean, optional): Whether to stream the response.
  - stop (string or list, optional): Sequences where the API should stop generating further tokens.
  - max_tokens (integer, optional): Maximum number of tokens allowed in the generated answer.
  - presence_penalty (number, optional): Controls diversity via presence penalty.
  - frequency_penalty (number, optional): Controls diversity via frequency penalty.
  - logit_bias (object, optional): Mapping token id to bias value.
  - user (string, optional): End-user identifier.

# Error Handling
- API returns standard HTTP errors:
  - 400 Bad Request: Malformed or invalid request parameters.
  - 401 Unauthorized: Missing or invalid API key.
  - 429 Too Many Requests: Rate limit exceeded.
  - 500 Internal Server Error: Server issues.

# Rate Limits and Quotas
- Rate limits are enforced per API key, returned in response headers. Consult your API dashboard for specific quotas.

# Code Examples

Example cURL for Completions:

curl https://api.openai.com/v1/completions \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{
    "model": "text-davinci-003",
    "prompt": "Say this is a test",
    "max_tokens": 7
  }'

# Attribution
- Source: OpenAI API Documentation, retrieved from https://platform.openai.com/docs/api-reference
- Data Size: 0 bytes (crawled content empty, reference based on source entry 7)


## Attribution
- Source: OpenAI API Documentation
- URL: https://platform.openai.com/docs/api-reference
- License: License: OpenAI API Terms
- Crawl Date: 2025-05-01T22:40:37.457Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-05-01
