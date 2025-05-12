# CHAT_COMPLETIONS

## Crawl Summary
Endpoint POST /v1/chat/completions with JSON body. Required parameters: model (string), messages (array of {role,content,name?}). Optional parameters with defaults: temperature=1.0, top_p=1.0, n=1, stream=false, stop, max_tokens, presence_penalty=0.0, frequency_penalty=0.0, logit_bias map, user. Response returns id, object, created timestamp, model, usage tokens, choices array with index, message(role,content), finish_reason. Streaming via SSE with data: events. Rate limit 3500rpm. Context window sizes.

## Normalised Extract
Table of Contents
 1 HTTP Endpoint & Headers
 2 Required Parameters
 3 Optional Parameters & Defaults
 4 Response Schema
 5 Streaming Implementation

1 HTTP Endpoint & Headers
   Endpoint: POST https://api.openai.com/v1/chat/completions
   Headers:
     Authorization: Bearer <API_KEY>
     Content-Type: application/json

2 Required Parameters
   model: string (e.g. "gpt-4" or "gpt-3.5-turbo")
   messages: array of objects
     role: "system" | "user" | "assistant"
     content: string
     name: string (optional,  name of user)

3 Optional Parameters & Defaults
   temperature: number (0 to 2), default=1.0
   top_p: number (0 to 1), default=1.0
   n: integer, default=1
   stream: boolean, default=false
   stop: string or array of strings, default=none
   max_tokens: integer, default=API limit
   presence_penalty: number (-2.0 to 2.0), default=0.0
   frequency_penalty: number (-2.0 to 2.0), default=0.0
   logit_bias: map<string,number> tokens to bias scores
   user: string, default=none

4 Response Schema
   id: string
   object: "chat.completion"
   created: integer (unix timestamp)
   model: string
   usage:
     prompt_tokens: integer
     completion_tokens: integer
     total_tokens: integer
   choices: array
     index: integer
     message:
       role: string
       content: string
     finish_reason: string

5 Streaming Implementation
   request: set stream=true
   response: text/event-stream
   events:
     data: {"choices":[{"delta":{"content":"..."},"index":0,"finish_reason":null}]}
     data: [DONE]



## Supplementary Details
Configuration Limits:
  Max context window: 4096 tokens (gpt-3.5), 8192 tokens (gpt-4)
  Rate limits: 3500 requests/minute

Header Requirements:
  Authorization: Bearer API_KEY
  Content-Type: application/json

Error Codes:
  400 Bad Request: schema validation failure
  401 Unauthorized: invalid API key
  429 Too Many Requests: rate limit exceeded, Retry-After header (seconds)

Implementation Steps:
 1. Install OpenAI SDK: npm install openai or pip install openai
 2. Instantiate client with apiKey
 3. Build messages array
 4. Call create method
 5. Handle response or stream events


## Reference Details
API Endpoint:
  POST /v1/chat/completions HTTP/1.1
  Host: api.openai.com
  Authorization: Bearer <API_KEY>
  Content-Type: application/json

Request Body JSON Schema:
 {
   "model": "string",
   "messages": [
     {"role":"string","content":"string","name":"string?"}
   ],
   "temperature": 0.0-2.0 (default 1.0),
   "top_p": 0.0-1.0 (default 1.0),
   "n": integer >=1 (default=1),
   "stream": boolean (default=false),
   "stop": string | [string],
   "max_tokens": integer,
   "presence_penalty": -2.0-2.0 (default0.0),
   "frequency_penalty": -2.0-2.0 (default0.0),
   "logit_bias": {"token_id": number},
   "user": "string"
 }

Response Body JSON Schema:
 {
   "id": "string",
   "object": "chat.completion",
   "created": integer,
   "model": "string",
   "usage": {"prompt_tokens":integer,"completion_tokens":integer,"total_tokens":integer},
   "choices":[
     {"index":integer,
      "message":{"role":"string","content":"string"},
      "finish_reason":"string"
     }
   ]
 }

SDK Method Signatures:
 JavaScript:
   openai.chat.completions.create(params: {
     model: string;
     messages: {role:string;content:string;name?:string}[];
     temperature?:number;
     top_p?:number;
     n?:number;
     stream?:boolean;
     stop?:string|string[];
     max_tokens?:number;
     presence_penalty?:number;
     frequency_penalty?:number;
     logit_bias?:Record<string,number>;
     user?:string;
   }): Promise<{
     id: string;
     object: string;
     created: number;
     model: string;
     usage: {prompt_tokens:number;completion_tokens:number;total_tokens:number};
     choices: {index:number;message:{role:string;content:string};finish_reason:string}[];
   }>;

 Python:
   response = openai.ChatCompletion.create(
     model="string",
     messages=[{"role":"string","content":"string","name":"string?"}],
     temperature=1.0,
     top_p=1.0,
     n=1,
     stream=False,
     stop=None,
     max_tokens=None,
     presence_penalty=0.0,
     frequency_penalty=0.0,
     logit_bias=None,
     user=None
   )

Concrete Best Practices:
 • Group system instructions in the first message 
 • Limit messages history to fit context window 
 • Use stop sequences to avoid trailing tokens 
 • Monitor usage for cost control

Troubleshooting Commands:
 $ curl -i -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"Hello"}]}' \
    https://api.openai.com/v1/chat/completions

Expected 200 OK and JSON response
On 429 inspect Retry-After header: curl -i shows Retry-After: 60


## Information Dense Extract
POST/v1/chat/completions
Headers: Authorization: Bearer KEY; Content-Type: application/json
Body: {model:string,messages:[{role:string,content:string,name?:string}],temperature:0–2(1),top_p:0–1(1),n:int(1),stream:bool(false),stop:str|[str],max_tokens:int,presence_penalty:-2–2(0),frequency_penalty:-2–2(0),logit_bias:{token_id:number},user:str}
Response: {id:str,object:"chat.completion",created:int,model:str,usage:{prompt_tokens:int,completion_tokens:int,total_tokens:int},choices:[{index:int,message:{role:str,content:str},finish_reason:str}]}
SDK JS: openai.chat.completions.create(params):Promise<{...}>
SDK PY: openai.ChatCompletion.create(...)
Limits: context 4096/8192 tokens, rate 3500rpm
Streaming: stream=true → SSE events data: JSON deltas + [DONE]
Error: 400,401,429 Retry-After; backoff recommended

## Sanitised Extract
Table of Contents
 1 HTTP Endpoint & Headers
 2 Required Parameters
 3 Optional Parameters & Defaults
 4 Response Schema
 5 Streaming Implementation

1 HTTP Endpoint & Headers
   Endpoint: POST https://api.openai.com/v1/chat/completions
   Headers:
     Authorization: Bearer <API_KEY>
     Content-Type: application/json

2 Required Parameters
   model: string (e.g. 'gpt-4' or 'gpt-3.5-turbo')
   messages: array of objects
     role: 'system' | 'user' | 'assistant'
     content: string
     name: string (optional,  name of user)

3 Optional Parameters & Defaults
   temperature: number (0 to 2), default=1.0
   top_p: number (0 to 1), default=1.0
   n: integer, default=1
   stream: boolean, default=false
   stop: string or array of strings, default=none
   max_tokens: integer, default=API limit
   presence_penalty: number (-2.0 to 2.0), default=0.0
   frequency_penalty: number (-2.0 to 2.0), default=0.0
   logit_bias: map<string,number> tokens to bias scores
   user: string, default=none

4 Response Schema
   id: string
   object: 'chat.completion'
   created: integer (unix timestamp)
   model: string
   usage:
     prompt_tokens: integer
     completion_tokens: integer
     total_tokens: integer
   choices: array
     index: integer
     message:
       role: string
       content: string
     finish_reason: string

5 Streaming Implementation
   request: set stream=true
   response: text/event-stream
   events:
     data: {'choices':[{'delta':{'content':'...'},'index':0,'finish_reason':null}]}
     data: [DONE]

## Original Source
OpenAI Chat Completions API Reference
https://platform.openai.com/docs/api-reference/chat/create

## Digest of CHAT_COMPLETIONS

# Chat Completions API Reference  (Retrieved 2024-06-10)

## HTTP Endpoint
POST https://api.openai.com/v1/chat/completions

## Request Headers
  Authorization: Bearer YOUR_API_KEY
  Content-Type: application/json

## Request Body Parameters
| Name              | Type                     | Required | Default | Description                                                               |
|-------------------|--------------------------|----------|---------|---------------------------------------------------------------------------|
| model             | string                   | yes      | —       | ID of the model to use (e.g., gpt-4, gpt-3.5-turbo)                       |
| messages          | array of message objects | yes      | —       | Conversation history; each object: {role: string, content: string, name?: string} |
| temperature       | number                   | no       | 1.0     | Sampling temperature between 0 and 2                                      |
| top_p             | number                   | no       | 1.0     | Nucleus sampling probability                                             |
| n                 | integer                  | no       | 1       | Number of chat completion choices to generate                             |
| stream            | boolean                  | no       | false   | If true, partial message deltas will be sent as they become available     |
| stop              | string or array          | no       | —       | Up to 4 sequences where the API will stop generating further tokens       |
| max_tokens        | integer                  | no       | —       | Maximum tokens to generate in the completion                              |
| presence_penalty  | number                   | no       | 0.0     | Penalty for new tokens based on whether they appear in the text so far    |
| frequency_penalty | number                   | no       | 0.0     | Penalty for new tokens based on their existing frequency in the text      |
| logit_bias        | map[string, number]      | no       | —       | Modify likelihood of specified tokens appearing by token ID               |
| user              | string                   | no       | —       | Unique user identifier for abuse monitoring                               |

## Response Schema (200)
```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-3.5-turbo-0301",
  "usage": {"prompt_tokens": 13,"completion_tokens": 7,"total_tokens": 20},
  "choices": [
    {"index": 0,
     "message": {"role": "assistant","content": "Hello!"},
     "finish_reason": "stop"
    }
  ]
}
```

## SDK Method Signature (JavaScript)
```js
openai.chat.completions.create({
  model: string,
  messages: [{role: string, content: string, name?: string}],
  temperature?: number,
  top_p?: number,
  n?: number,
  stream?: boolean,
  stop?: string|string[],
  max_tokens?: number,
  presence_penalty?: number,
  frequency_penalty?: number,
  logit_bias?: {[token: string]: number},
  user?: string
});
```

## Common Configuration Options
- Max context window: 4096 tokens (gpt-3.5) or 8192 tokens (gpt-4)
- Rate limit: 3500 requests/minute per API key

## Streaming Implementation Pattern
1. Set stream to true in request body
2. Listen to SSE chunks at Content-Type: text/event-stream
3. Parse lines prefixed with "data: "
4. Concatenate content deltas until [DONE]

## Troubleshooting
- HTTP 429: inspect Retry-After header, implement exponential backoff
- Invalid API key (401): verify Authorization header
- Malformed JSON (400): validate schema against request body



## Attribution
- Source: OpenAI Chat Completions API Reference
- URL: https://platform.openai.com/docs/api-reference/chat/create
- License: License: OpenAI API Terms (proprietary)
- Crawl Date: 2025-05-12T03:36:49.250Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-05-12
