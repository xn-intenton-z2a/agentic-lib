# OPENAI_API

## Crawl Summary
Endpoint POST /v1/completions accepts parameters: engine (string), prompt (string), max_tokens (int), temperature (number), top_p (number), frequency_penalty (number), presence_penalty (number), stop (array). GET /v1/models returns a list of models with id and metadata. SDK method openai.Completion.create signature provided with explicit default values. Configuration options include API key via environment variable, base URL https://api.openai.com/v1, and a 30 second timeout. Troubleshooting includes handling HTTP 401, 429, 500 errors with specific recommendations.

## Normalised Extract
Table of Contents:
1. Endpoints
  a. POST /v1/completions
  b. GET /v1/models
2. SDK Methods
3. Configuration Options
4. Troubleshooting

1. Endpoints:
POST /v1/completions
  - engine: string (e.g., davinci, curie)
  - prompt: string
  - max_tokens: integer (default 16)
  - temperature: number (default 1.0, range 0 to 2)
  - top_p: number (default 1.0)
  - frequency_penalty: number (default 0.0)
  - presence_penalty: number (default 0.0)
  - stop: array of strings (optional)
GET /v1/models
  - Returns list of models with properties: id (string), object (string), created (timestamp), owned_by (string)

2. SDK Methods:
Python: openai.Completion.create(engine: str, prompt: str, max_tokens: int = 16, temperature: float = 1.0, top_p: float = 1.0, frequency_penalty: float = 0.0, presence_penalty: float = 0.0, stop: Optional[List[str]] = None) -> dict

3. Configuration Options:
- API Key setup via OPENAI_API_KEY environment variable
- Base URL: https://api.openai.com/v1
- Request timeout default: 30 seconds

4. Troubleshooting:
- HTTP 401: Check API key validity
- HTTP 429: Implement retry with exponential backoff
- HTTP 500: Retry request or consult support


## Supplementary Details
Endpoint POST /v1/completions detailed specifications:
  Parameter: engine must be a valid string identifier for the model.
  Parameter: prompt requires non-empty string input.
  Parameter: max_tokens integer governs the response length; default is 16 but may go higher based on engine capacity.
  Parameter: temperature influences randomness; typical default 1.0 with recommended range from 0.0 (deterministic) to 2.0 (highly variable).
  Parameter: top_p used for nucleus sampling, default is 1.0.
  Parameter: frequency_penalty and presence_penalty both default to 0.0 and adjust repetition control.
  Parameter: stop can be provided as an array of strings to designate stop sequences.

SDK method openai.Completion.create in Python uses keyword arguments with type hints. Ensure to supply non-null prompt and valid numerical parameters.

Configuration options:
  - API Key required at runtime via environment variable OPENAI_API_KEY.
  - Base URL is fixed at https://api.openai.com/v1 and should not include trailing slash.
  - Timeout defaults to 30 seconds but can be overridden per API call if necessary.

Troubleshooting steps include verifying API key, network connectivity, checking error response codes, and enabling detailed logging to trace request-response cycles.

## Reference Details
API Endpoint: POST /v1/completions
Params: engine: string, prompt: string, max_tokens: int (default 16), temperature: float (default 1.0), top_p: float (default 1.0), frequency_penalty: float (default 0.0), presence_penalty: float (default 0.0), stop: list[string] (optional)
Return: JSON object containing choices, usage, and metadata.

SDK Method Signature (Python):
openai.Completion.create(engine: str, prompt: str, max_tokens: int = 16, temperature: float = 1.0, top_p: float = 1.0, frequency_penalty: float = 0.0, presence_penalty: float = 0.0, stop: Optional[List[str]] = None) -> dict

Example Usage (Python):
import openai
response = openai.Completion.create(engine='davinci', prompt='Hello, world!', max_tokens=5, temperature=0.5)

Configuration Parameters:
- API Key: set via OPENAI_API_KEY environment variable
- Base URL: https://api.openai.com/v1
- Timeout: 30 seconds, configurable

Troubleshooting:
- For 401 errors, verify header Authorization: Bearer YOUR_API_KEY
- For 429 errors, implement retry logic using exponential backoff (e.g., wait 1, 2, 4, 8 seconds)
- For 500 errors, log details and retry; check server status

Best Practices:
- Validate prompt input to avoid empty strings
- Monitor usage via the returned usage field
- Use consistent error handling to capture HTTP error codes and messages


## Information Dense Extract
Endpoints: POST /v1/completions (engine: string, prompt: string, max_tokens: int=16, temperature: float=1.0, top_p: float=1.0, frequency_penalty: float=0.0, presence_penalty: float=0.0, stop: list[string]) and GET /v1/models (returns list with id, object, created, owned_by). SDK: openai.Completion.create(engine: str, prompt: str, max_tokens: int=16, temperature: float=1.0, top_p: float=1.0, frequency_penalty: float=0.0, presence_penalty: float=0.0, stop: Optional[List[str]]=None) -> dict. Config: API key via OPENAI_API_KEY, Base URL https://api.openai.com/v1, Timeout 30s. Troubleshooting: handle HTTP 401 (invalid key), 429 (rate limit; use exponential backoff), 500 (retry or consult support). Example: import openai; response = openai.Completion.create(engine='davinci', prompt='Hello, world!', max_tokens=5, temperature=0.5).

## Escaped Extract
Table of Contents:
1. Endpoints
  a. POST /v1/completions
  b. GET /v1/models
2. SDK Methods
3. Configuration Options
4. Troubleshooting

1. Endpoints:
POST /v1/completions
  - engine: string (e.g., davinci, curie)
  - prompt: string
  - max_tokens: integer (default 16)
  - temperature: number (default 1.0, range 0 to 2)
  - top_p: number (default 1.0)
  - frequency_penalty: number (default 0.0)
  - presence_penalty: number (default 0.0)
  - stop: array of strings (optional)
GET /v1/models
  - Returns list of models with properties: id (string), object (string), created (timestamp), owned_by (string)

2. SDK Methods:
Python: openai.Completion.create(engine: str, prompt: str, max_tokens: int = 16, temperature: float = 1.0, top_p: float = 1.0, frequency_penalty: float = 0.0, presence_penalty: float = 0.0, stop: Optional[List[str]] = None) -> dict

3. Configuration Options:
- API Key setup via OPENAI_API_KEY environment variable
- Base URL: https://api.openai.com/v1
- Request timeout default: 30 seconds

4. Troubleshooting:
- HTTP 401: Check API key validity
- HTTP 429: Implement retry with exponential backoff
- HTTP 500: Retry request or consult support

## Original Source
OpenAI API Documentation
https://platform.openai.com/docs/api-reference

## Digest of OPENAI_API

# OPENAI API REFERENCE

Date Retrieved: 2023-10-05

## Endpoints

### POST /v1/completions
- Description: Generates completions based on prompt provided.
- Parameters:
  - engine: string (e.g. "davinci", "curie")
  - prompt: string
  - max_tokens: integer (default 16, max depends on engine)
  - temperature: number (default 1.0, range 0 to 2)
  - top_p: number (default 1.0)
  - frequency_penalty: number (default 0.0)
  - presence_penalty: number (default 0.0)
  - stop: array of strings (optional termination sequences)

### GET /v1/models
- Description: Retrieves the list of available models.
- Returns: JSON list where each model has id (string), object (string), and other metadata.

## SDK Method Signatures

### Python SDK (openai.Completion.create)
Signature: openai.Completion.create(
    engine: str,
    prompt: str,
    max_tokens: int = 16,
    temperature: float = 1.0,
    top_p: float = 1.0,
    frequency_penalty: float = 0.0,
    presence_penalty: float = 0.0,
    stop: Optional[List[str]] = None
) -> dict

## Configuration Details

- API Key: Must be set via environment variable OPENAI_API_KEY or passed directly.
- Base URL: https://api.openai.com/v1
- Timeout: Default 30 seconds, configurable per request.

## Troubleshooting

- Common Errors:
  - HTTP 401: Invalid API key. Recheck API credentials.
  - HTTP 429: Rate limit exceeded. Implement exponential backoff.
  - HTTP 500: Internal server error. Retry request or contact support.
- Logging: Enable detailed logging for request and response bodies for debugging.


## Attribution
- Source: OpenAI API Documentation
- URL: https://platform.openai.com/docs/api-reference
- License: License: OpenAI API Terms
- Crawl Date: 2025-04-22T02:27:40.631Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-04-22
