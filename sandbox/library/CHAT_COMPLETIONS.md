# CHAT_COMPLETIONS

## Crawl Summary
POST https://api.openai.com/v1/chat/completions with JSON body. Required: model (string), messages (array of {role,content}). Optional: temperature (number 0–2, default 1), top_p (number 0–1, default 1), n (int, default 1), stream (bool, default false), stop (string|array), max_tokens (int), presence_penalty (–2 to 2, default 0), frequency_penalty (–2 to 2, default 0), logit_bias (map int to –100–100), user (string). Response: id, object, created, usage {prompt_tokens,completion_tokens,total_tokens}, choices [{index,message{role,content},finish_reason}]. Common errors: 400,401,429,500.

## Normalised Extract
Table of Contents
1 Endpoint Definition
2 Authentication
3 Core Request Parameters
4 Response Structure
5 Error Responses

1 Endpoint Definition
 Path: /v1/chat/completions
 Method: POST

2 Authentication
 Header: Authorization: Bearer <API_KEY>

3 Core Request Parameters
 model: string
   Allowed values: gpt-3.5-turbo, gpt-4, etc.
 messages: array of Message
   Message object: role: user|assistant|system, content: string
 temperature: number [0.0,2.0], default 1.0
 top_p: number [0.0,1.0], default 1.0
 n: integer >=1, default 1
 stream: boolean, default false
 stop: string or array of strings
 max_tokens: integer >0
 presence_penalty: number [-2.0,2.0], default 0.0
 frequency_penalty: number [-2.0,2.0], default 0.0
 logit_bias: object mapping token_id to bias [-100,100]
 user: string up to 64 chars

4 Response Structure
 id: string
 object: chat.completion
 created: integer (UNIX timestamp)
 usage:
   prompt_tokens: integer
   completion_tokens: integer
   total_tokens: integer
 choices: array of {
   index: integer
   message: { role: string, content: string }
   finish_reason: stop|length|function_call
 }

5 Error Responses
 400: Bad Request – invalid or missing parameters
 401: Unauthorized – invalid API key
 429: Too Many Requests – rate limit exceeded
 500: Internal Server Error


## Supplementary Details
Installation and Setup
1 Install OpenAI SDK: npm install openai
2 Set environment variable: export OPENAI_API_KEY=your_key

Initialization (Node.js)
import OpenAI from 'openai'
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

Call Pattern
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: 'You are helpful.' },
    { role: 'user', content: 'Translate this text.' }
  ],
  temperature: 0.7,
  max_tokens: 100
})

Streaming
const stream = await openai.chat.completions.create(
  { model: 'gpt-4', messages, stream: true },
  { responseType: 'stream' }
)
stream.on('data', chunk => process.stdout.write(chunk))

Configuration Options
HTTP timeout: 60s
Retries: 3 (exponential backoff)


## Reference Details
API Endpoint: POST /v1/chat/completions
Headers:
  Authorization: Bearer <API_KEY>
  Content-Type: application/json

Request Body Schema:
{
  model: string,
  messages: [ { role: 'user'|'assistant'|'system', content: string } ],
  temperature?: number,
  top_p?: number,
  n?: number,
  stream?: boolean,
  stop?: string|string[],
  max_tokens?: number,
  presence_penalty?: number,
  frequency_penalty?: number,
  logit_bias?: { [token_id: number]: number },
  user?: string
}

Response Body Schema:
{
  id: string,
  object: string,
  created: number,
  usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number },
  choices: [
    { index: number,
      message: { role: string, content: string },
      finish_reason: string
    }
  ]
}

Node.js SDK Method Signature:
openai.chat.completions.create(
  options: {
    model: string,
    messages: { role: string, content: string }[],
    temperature?: number,
    top_p?: number,
    n?: number,
    stream?: boolean,
    stop?: string|string[],
    max_tokens?: number,
    presence_penalty?: number,
    frequency_penalty?: number,
    logit_bias?: Record<number, number>,
    user?: string
  }, httpOptions?: { responseType: 'json'|'stream', timeout?: number, retries?: number }
): Promise<{ id: string, object: string, created: number, usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number }, choices: { index: number, message: { role: string, content: string }, finish_reason: string }[] }>

Best Practices
• Use streaming for large outputs to reduce latency.
• Handle rate limit (429) by exponential backoff: wait 1s, 2s, 4s.
• Set max_tokens to control cost and output size.

Troubleshooting
Curl Test:
curl https://api.openai.com/v1/chat/completions \
  -H 'Authorization: Bearer $OPENAI_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"model":"gpt-4","messages":[{"role":"user","content":"Hi"}]}'

Expected Response: HTTP 200 with JSON id, object, choices

Error Response Example:
HTTP/1.1 401 Unauthorized
{
  "error": {"message":"Invalid API key","type":"authentication_error"}
}

## Information Dense Extract
POST /v1/chat/completions  Authorization: Bearer API_KEY  Body{model:string,messages:[{role:string,content:string}],temperature:number(0–2)=1,top_p:number(0–1)=1,n:int=1,stream:bool=false,stop:string|string[],max_tokens:int,presence_penalty:-2–2=0,frequency_penalty:-2–2=0,logit_bias:{token_id:number=>-100–100},user:string}  Response{id:string,object:string,created:int,usage:{prompt_tokens:int,completion_tokens:int,total_tokens:int},choices:[{index:int,message:{role:string,content:string},finish_reason:string}]}  SDK: openai.chat.completions.create(options,httpOptions)⇒Promise<response>  Best practices: streaming, backoff on 429, set max_tokens, timeout=60s,retries=3

## Sanitised Extract
Table of Contents
1 Endpoint Definition
2 Authentication
3 Core Request Parameters
4 Response Structure
5 Error Responses

1 Endpoint Definition
 Path: /v1/chat/completions
 Method: POST

2 Authentication
 Header: Authorization: Bearer <API_KEY>

3 Core Request Parameters
 model: string
   Allowed values: gpt-3.5-turbo, gpt-4, etc.
 messages: array of Message
   Message object: role: user|assistant|system, content: string
 temperature: number [0.0,2.0], default 1.0
 top_p: number [0.0,1.0], default 1.0
 n: integer >=1, default 1
 stream: boolean, default false
 stop: string or array of strings
 max_tokens: integer >0
 presence_penalty: number [-2.0,2.0], default 0.0
 frequency_penalty: number [-2.0,2.0], default 0.0
 logit_bias: object mapping token_id to bias [-100,100]
 user: string up to 64 chars

4 Response Structure
 id: string
 object: chat.completion
 created: integer (UNIX timestamp)
 usage:
   prompt_tokens: integer
   completion_tokens: integer
   total_tokens: integer
 choices: array of {
   index: integer
   message: { role: string, content: string }
   finish_reason: stop|length|function_call
 }

5 Error Responses
 400: Bad Request  invalid or missing parameters
 401: Unauthorized  invalid API key
 429: Too Many Requests  rate limit exceeded
 500: Internal Server Error

## Original Source
OpenAI Chat Completions API Reference
https://platform.openai.com/docs/api-reference/chat/create

## Digest of CHAT_COMPLETIONS

# OpenAI Chat Completions API Reference

Date Retrieved: 2024-06-04

## Endpoint
POST https://api.openai.com/v1/chat/completions

## HTTP Headers
  Authorization: Bearer <YOUR_API_KEY>
  Content-Type: application/json

## Request Parameters
  model            string       required. ID of model to use, e.g. gpt-4.
  messages         Message[]    required. Array of message objects with fields role and content.
  temperature      number       optional. 0 to 2. Default 1. Higher values increase randomness.
  top_p            number       optional. 0 to 1. Default 1. controls nucleus sampling.
  n                integer      optional. Number of completions to generate. Default 1.
  stream           boolean      optional. If true, partial message deltas will be sent as server-sent events. Default false.
  stop             string|array optional. Up to 4 sequences where API will stop generating further tokens.
  max_tokens       integer      optional. Maximum number of tokens to generate. Default infimum based on model.
  presence_penalty number       optional. -2.0 to 2.0. Default 0.
  frequency_penalty number     optional. -2.0 to 2.0. Default 0.
  logit_bias       object       optional. map from token to bias value between -100 and 100.
  user             string       optional. Unique identifier for end user.

## Example Request
```json
{
  "model": "gpt-4",
  "messages": [{"role":"user","content":"Hello!"}],
  "max_tokens": 150,
  "temperature": 0
}
```

## Response Schema
  id       string  unique id of completion
  object   string  "chat.completion"
  created  integer timestamp
  usage    object  prompt_tokens, completion_tokens, total_tokens
  choices  array   of Choice {
                index, message {role, content}, finish_reason
              }

## Errors
  400 Bad Request: invalid parameters
  401 Unauthorized: invalid API key
  429 Rate Limit Exceeded
  500 Internal Server Error


## Attribution
- Source: OpenAI Chat Completions API Reference
- URL: https://platform.openai.com/docs/api-reference/chat/create
- License: License: Proprietary (see OpenAI Terms of Service)
- Crawl Date: 2025-05-09T03:35:07.407Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-05-09
