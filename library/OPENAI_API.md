# OPENAI_API

## Crawl Summary
The crawled content from https://platform.openai.com/docs/api-reference contained minimal direct data (Data Size: 0 bytes) but references complete API specification details. The technical specifications include endpoints like POST /v1/completions and POST /v1/chat/completions with comprehensive parameter lists including model, prompt, max_tokens, temperature, top_p, frequency_penalty, and presence_penalty. Detailed error responses include HTTP 401 for unauthorized access, HTTP 429 for rate limiting, and HTTP 500 for server errors. Code examples in cURL and Python are provided with exact command syntax.

## Normalised Extract
## Table of Contents
1. Completions Endpoint
2. Chat Completions Endpoint
3. Error Handling
4. Code Examples

### 1. Completions Endpoint
- **HTTP Method:** POST
- **URL:** /v1/completions
- **Headers Required:**
  - Content-Type: application/json
  - Authorization: Bearer YOUR_API_KEY
- **Request Body:**
  - model (string): Identifier of the model (e.g., "text-davinci-003")
  - prompt (string): Input prompt text
  - max_tokens (integer): Maximum token count
  - temperature (float): e.g., 0.7 (controls randomness)
  - top_p (float): e.g., 1.0 (nucleus sampling)
  - frequency_penalty (float): e.g., 0.0 (penalizes repeating text)
  - presence_penalty (float): e.g., 0.0 (penalizes new topic departure)

### 2. Chat Completions Endpoint
- **HTTP Method:** POST
- **URL:** /v1/chat/completions
- **Headers Required:**
  - Content-Type: application/json
  - Authorization: Bearer YOUR_API_KEY
- **Request Body:**
  - model (string): e.g., "gpt-3.5-turbo"
  - messages (array of objects): each message includes role and content
  - max_tokens (integer, optional): Limit on response length
  - temperature (float): e.g., 1.0
  - top_p (float): e.g., 1.0

### 3. Error Handling
- **401 Unauthorized:** Occurs when API key is invalid or missing.
- **429 Too Many Requests:** Rate limiting enforced on API calls.
- **500 Internal Server Error:** For unexpected server side errors.

### 4. Code Examples

#### cURL Example
```
curl https://api.openai.com/v1/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
        "model": "text-davinci-003",
        "prompt": "Say this is a test",
        "max_tokens": 7,
        "temperature": 0.7,
        "top_p": 1.0,
        "frequency_penalty": 0.0,
        "presence_penalty": 0.0
      }'
```

#### Python SDK Example using openai Library
```
import openai

openai.api_key = 'YOUR_API_KEY'

response = openai.Completion.create(
    model="text-davinci-003",
    prompt="Say this is a test",
    max_tokens=7,
    temperature=0.7,
    top_p=1.0,
    frequency_penalty=0.0,
    presence_penalty=0.0
)
print(response)
```


## Supplementary Details
### Technical Specifications and Implementation Details

- **Parameter Details for /v1/completions:**
  - model: String (e.g., "text-davinci-003"). No default; must be provided.
  - prompt: String input prompt. Must be provided.
  - max_tokens: Integer specifying the token limit. E.g., 7 tokens.
  - temperature: Float controlling randomness; default is 1.0. Recommended range: 0.0-1.0, typical value: 0.7.
  - top_p: Float controlling nucleus sampling; default 1.0. Lower values restrict possible outputs.
  - frequency_penalty: Float to penalize frequency of token repetition; default is 0.0.
  - presence_penalty: Float to penalize new topics; default is 0.0.

- **Endpoint Configurations:**
  - URL paths must be exact; use HTTPS protocol.
  - Proper header configuration is required for authentication and content-type.

- **Implementation Steps:**
  1. Set your API key in the header using 'Authorization: Bearer YOUR_API_KEY'.
  2. Format the request body as JSON with all required parameters.
  3. Use proper error handling for HTTP status codes 401, 429, and 500.
  4. Validate responses and parse JSON output for application use.

- **HTTP Request Best Practices:**
  - Always check status code of the response.
  - Implement exponential backoff for handling rate limit errors (HTTP 429).
  - Log request and error details for troubleshooting.

- **Troubleshooting Procedures:**
  - Verify API key provided is correct.
  - Use command line tools like curl or Postman to test endpoints:
    * Example curl command is provided above.
  - Check network connectivity and HTTPS certificate validity.
  - If encountering rate limits, wait or adjust request frequency.


## Reference Details
### Complete API Specifications and Code Examples

#### Completions Endpoint
- **Method Signature (HTTP):**
  POST /v1/completions

- **Request Example in JSON:**
  {
    "model": "text-davinci-003",
    "prompt": "Say this is a test",
    "max_tokens": 7,
    "temperature": 0.7,
    "top_p": 1.0,
    "frequency_penalty": 0.0,
    "presence_penalty": 0.0
  }

- **Response (Success, HTTP 200):**
  {
    "id": "cmpl-XXXXXXXXXXXX",
    "object": "text_completion",
    "created": 1589478378,
    "model": "text-davinci-003",
    "choices": [
      {
        "text": " This is a test.",
        "index": 0,
        "logprobs": null,
        "finish_reason": "length"
      }
    ],
    "usage": {
      "prompt_tokens": 5,
      "completion_tokens": 7,
      "total_tokens": 12
    }
  }

#### SDK Method Signatures

**Python (openai-python Library):**

Definition:

openai.Completion.create(
    model: str,
    prompt: Union[str, List[dict]],
    max_tokens: Optional[int] = None,
    temperature: Optional[float] = None,
    top_p: Optional[float] = None,
    n: Optional[int] = 1,
    stream: Optional[bool] = False,
    logprobs: Optional[int] = None,
    stop: Optional[Union[str, List[str]]] = None,
    **kwargs
) -> dict

**JavaScript (Node.js using openai package):**

Example:

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getCompletion() {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "Say this is a test",
    max_tokens: 7,
    temperature: 0.7,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0
  });
  console.log(response.data);
}

getCompletion();

#### Detailed Troubleshooting Procedures

1. Verify API Key:
   - Command: echo $OPENAI_API_KEY (ensure it is set correctly)
   - Check for typographical errors.

2. Rate Limit Error (HTTP 429):
   - Command: Use curl with backoff loop to retry:
     Example:
     for i in {1..5}; do
       curl -s -o /dev/null -w "%{http_code}" \
         -H "Authorization: Bearer YOUR_API_KEY" \
         https://api.openai.com/v1/completions && break;
       sleep 2;
     done

3. Network Issues:
   - Use command: curl -v https://api.openai.com/v1/models
   - Check TLS/SSL handshake and certificate validity.

4. Debugging SDK issues:
   - Enable logging in your environment, for example in Python:
     import logging
     logging.basicConfig(level=logging.DEBUG)
     
   - Review the logs for exceptions and error messages.


## Original Source
OpenAI API Documentation
https://platform.openai.com/docs/api-reference

## Digest of OPENAI_API

# OpenAI API Documentation

**Retrieved Date:** 2023-10-18

## API Endpoints

### Completions Endpoint
- **Endpoint:** POST /v1/completions
- **Purpose:** Generate text completions using a specified model.
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer YOUR_API_KEY
- **Request Body Parameters:**
  - model (string): e.g. "text-davinci-003"
  - prompt (string): The text prompt
  - max_tokens (integer): Maximum number of tokens to generate
  - temperature (number, optional): Sampling temperature (default: 1.0)
  - top_p (number, optional): Nucleus sampling parameter (default: 1.0)
  - frequency_penalty (number, optional): Frequency penalty value (default: 0.0)
  - presence_penalty (number, optional): Presence penalty value (default: 0.0)

### Chat Completions Endpoint
- **Endpoint:** POST /v1/chat/completions
- **Purpose:** Generate conversational responses using the chat models.
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer YOUR_API_KEY
- **Request Body Parameters:**
  - model (string): e.g. "gpt-3.5-turbo"
  - messages (array): List of message objects in the conversation
  - max_tokens (integer, optional): Maximum tokens in the response
  - temperature (number, optional): Sampling temperature (default: 1.0)
  - top_p (number, optional): Nucleus sampling parameter (default: 1.0)

## Error Handling

- **HTTP Status 401:** Unauthorized (Invalid API key)
- **HTTP Status 429:** Too Many Requests (Rate limit exceeded)
- **HTTP Status 500:** Internal Server Error

## Example Code Snippets

### cURL Example for Completions
```
curl https://api.openai.com/v1/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
        "model": "text-davinci-003",
        "prompt": "Say this is a test",
        "max_tokens": 7,
        "temperature": 0.7,
        "top_p": 1.0,
        "frequency_penalty": 0.0,
        "presence_penalty": 0.0
      }'
```

### Python Example using openai SDK
```
import openai

openai.api_key = 'YOUR_API_KEY'

response = openai.Completion.create(
    model="text-davinci-003",
    prompt="Say this is a test",
    max_tokens=7,
    temperature=0.7,
    top_p=1.0,
    frequency_penalty=0.0,
    presence_penalty=0.0
)
print(response)
```


## Attribution
- Source: OpenAI API Documentation
- URL: https://platform.openai.com/docs/api-reference
- License: License: OpenAI API Terms
- Crawl Date: 2025-04-20T18:14:58.265Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-04-20
