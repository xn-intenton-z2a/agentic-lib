# OPENAI_API

## Crawl Summary
API Base URL: https://api.openai.com/v1
Endpoints: /v1/completions and /v1/chat/completions with POST method.
Request Parameters include model (string), prompt (string/array), max_tokens (int), temperature (float, default 1.0), top_p (float), n (int), stream (bool), logprobs (int), and stop (string/array).
Response contains id, object, created, model, choices (with text, index, logprobs, finish_reason), and usage (prompt_tokens, completion_tokens, total_tokens).
SDK method signatures for Completion.create and ChatCompletion.create in Python provided with full parameter types.
Includes full code examples with error handling and configuration options.

## Normalised Extract
Table of Contents:
1. API Endpoints and Base URL
   - Base URL: https://api.openai.com/v1
   - Endpoints: /v1/completions, /v1/chat/completions (POST)

2. Request Parameters and Options
   - model (string, required): Model identifier (e.g., "text-davinci-003")
   - prompt (string or array, required): Input text
   - max_tokens (integer, required): Maximum tokens to generate
   - temperature (float, optional): Sampling rate (default 1.0, example 0.7)
   - top_p (float, optional): Nucleus sampling parameter
   - n (integer, optional): Number of completions
   - stream (boolean, optional): Stream partial responses (default false)
   - logprobs (integer, optional): Include top log probabilities
   - stop (string or array, optional): Stop sequence(s)

3. Response Structure and Data Schemas
   - id (string): Unique identifier
   - object (string): Object type
   - created (integer): UNIX timestamp
   - model (string): Model name
   - choices (array): Contains multiple choices each with text, index, logprobs, finish_reason
   - usage (object): Contains token usage details

4. SDK Method Signatures and Code Examples
   - Completion.create with signature:
     openai.Completion.create(model: str, prompt: Union[str, List[str]], max_tokens: int, temperature: float = 1.0, top_p: float = 1.0, n: int = 1, stream: bool = False, logprobs: Optional[int] = None, stop: Optional[Union[str, List[str]]] = None) -> Dict
   - ChatCompletion.create with signature:
     openai.ChatCompletion.create(model: str, messages: List[Dict[str, str]], temperature: float = 1.0, top_p: float = 1.0, n: int = 1, stream: bool = False, stop: Optional[Union[str, List[str]]] = None) -> Dict
   - Code examples in Python demonstrating API calls and error handling

5. Error Codes and Troubleshooting
   - 401 Unauthorized: Check API key configuration
   - 429 Too Many Requests: Adjust rate limits and implement backoff
   - 500 Internal Server Error: Retry request after delay


## Supplementary Details
Supplementary Technical Specifications:
- Parameter Defaults: temperature defaults to 1.0; stream defaults to false.
- Headers must include:
  {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  }
- Implementation Steps:
  1. Validate the API key is set correctly in the environment.
  2. Construct a JSON payload with required parameters (model, prompt, max_tokens).
  3. Execute an HTTPS POST request to the appropriate endpoint (e.g., /v1/completions).
  4. Parse the JSON response and extract values from choices and usage.
- Configuration Options:
  - temperature: Adjusts randomness (e.g., 0.7 for moderate randomness).
  - top_p: Alternative method to control diversity via nucleus sampling.
  - n: Determines the number of completions to generate per request.
- Best Practices:
  - Validate input data types before making API calls.
  - Implement robust error handling for 401, 429, and 500 error responses.
  - Use exponential backoff for retrying failed requests due to rate limits.


## Reference Details
Complete API Specifications and Implementation Details:

1. API Endpoint Details:
   - Base URL: https://api.openai.com/v1
   - Completions API:
     • Method: POST /v1/completions
     • Headers:
       - Authorization: Bearer YOUR_API_KEY
       - Content-Type: application/json
     • Request Body JSON Example:
       {
         "model": "text-davinci-003",
         "prompt": "Once upon a time",
         "max_tokens": 100,
         "temperature": 0.7,
         "top_p": 1.0,
         "n": 1,
         "stream": false,
         "logprobs": null,
         "stop": "\n"
       }
     • Response JSON Example:
       {
         "id": "cmpl-XXXXXXXXXXXX",
         "object": "text_completion",
         "created": 1614800000,
         "model": "text-davinci-003",
         "choices": [
             {
               "text": " the generated text",
               "index": 0,
               "logprobs": null,
               "finish_reason": "stop"
             }
         ],
         "usage": {
           "prompt_tokens": 5,
           "completion_tokens": 95,
           "total_tokens": 100
         }
       }

2. SDK Method Signatures (Python):
   - Completion.create:
     def create_completion(model: str, prompt: Union[str, List[str]], max_tokens: int, temperature: float = 1.0, top_p: float = 1.0, n: int = 1, stream: bool = False, logprobs: Optional[int] = None, stop: Optional[Union[str, List[str]]] = None) -> Dict:
         # Implementation using HTTP POST to https://api.openai.com/v1/completions

   - ChatCompletion.create:
     def create_chat_completion(model: str, messages: List[Dict[str, str]], temperature: float = 1.0, top_p: float = 1.0, n: int = 1, stream: bool = False, stop: Optional[Union[str, List[str]]] = None) -> Dict:
         # Implementation using HTTP POST to https://api.openai.com/v1/chat/completions

3. Full Code Example (Python):
```python
import openai
from typing import Union, List, Optional, Dict

# Set your API key
openai.api_key = "YOUR_API_KEY"

try:
    # Call the completions API
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt="Generate a short story in a fantasy style.",
        max_tokens=150,
        temperature=0.8,
        top_p=1.0,
        n=1,
        stream=False
    )
    # Access and print the generated text
    print("Completion:", response['choices'][0]['text'])
except openai.error.OpenAIError as e:
    # Detailed error handling
    print("Error encountered:", e)
```

4. Troubleshooting Procedures:
   - For a 401 Unauthorized Error, ensure that:
     • The API key is correctly set in the environment variable or in the code.
     • The key has the proper permissions.
   - For a 429 Rate Limit Error:
     • Implement exponential backoff:
       Example command flow:
         1. Detect HTTP 429 response.
         2. Wait for a calculated delay (e.g., 2^n seconds).
         3. Retry the API call.
   - For a 500 Internal Server Error:
     • Log the full response and error message.
     • Retry after a short delay.

5. Configuration Options and Their Effects:
   - temperature: Lower values (e.g., 0.2) make output more deterministic; higher values (e.g., 0.8) increase randomness.
   - top_p: When set to 1.0, no nucleus sampling is applied; lower values constrain token selection.
   - n: Specifies how many independent completions to generate.
   - stream: When true, responses are sent as data-only server-sent events; when false, entire response is returned at once.

6. Best Practices:
   - Validate input types and ranges before calling the API.
   - Monitor token usage via the 'usage' field in responses to manage cost.
   - Use detailed logging and error capture to handle service disruptions effectively.


## Original Source
OpenAI API Documentation
https://platform.openai.com/docs/api-reference

## Digest of OPENAI_API

# OpenAI API Reference

Retrieved on: 2023-11-24

## Endpoints
- Base URL: https://api.openai.com/v1
- Completions Endpoint: POST /v1/completions
- Chat Completions Endpoint: POST /v1/chat/completions

## Request Parameters for Completions
- **model** (string): The ID of the model (e.g., "text-davinci-003")
- **prompt** (string or array): The input text(s) for the model
- **max_tokens** (integer): Maximum tokens to generate
- **temperature** (number): Sampling temperature (default 1.0, example: 0.7)
- **top_p** (number): Nucleus sampling parameter
- **n** (integer): Number of completions to generate
- **stream** (boolean): Whether to stream back partial progress
- **logprobs** (integer): Number of top log probabilities to include
- **stop** (string or array): Token(s) that indicate where to stop generation

## Response Format
- **id** (string): Unique identifier for the completion
- **object** (string): The type of returned object
- **created** (integer): Timestamp of creation
- **model** (string): Model used
- **choices** (array): List of completion choices, each with:
  - **text**: Generated text
  - **index**: Choice index
  - **logprobs**: Log probability data
  - **finish_reason**: Reason for termination
- **usage** (object): Token usage info (prompt_tokens, completion_tokens, total_tokens)

## SDK Method Signatures (Python Example)
- **Completion.create**: 
  ```python
  openai.Completion.create(
      model: str, 
      prompt: Union[str, List[str]], 
      max_tokens: int, 
      temperature: float = 1.0, 
      top_p: float = 1.0, 
      n: int = 1, 
      stream: bool = False, 
      logprobs: Optional[int] = None, 
      stop: Optional[Union[str, List[str]]] = None
  ) -> Dict
  ```
- **ChatCompletion.create**: 
  ```python
  openai.ChatCompletion.create(
      model: str, 
      messages: List[Dict[str, str]], 
      temperature: float = 1.0, 
      top_p: float = 1.0,
      n: int = 1,
      stream: bool = False,
      stop: Optional[Union[str, List[str]]] = None
  ) -> Dict
  ```

## Code Examples
### Python SDK Example
```python
import openai

openai.api_key = "YOUR_API_KEY"

response = openai.Completion.create(
    model="text-davinci-003",
    prompt="Translate 'Hello, world!' into French.",
    max_tokens=60,
    temperature=0.7
)

print(response)
```

## Error Handling
- **401 Unauthorized:** Invalid API key. Verify and update the API key.
- **429 Too Many Requests:** Rate limit exceeded. Implement retry/backoff.
- **500 Internal Server Error:** Server error. Check status and retry.

## Configuration Details
- **Headers**: 
  - Authorization: Bearer YOUR_API_KEY
  - Content-Type: application/json


## Attribution
- Source: OpenAI API Documentation
- URL: https://platform.openai.com/docs/api-reference
- License: License: OpenAI API Terms
- Crawl Date: 2025-04-20T16:44:03.895Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-04-20
