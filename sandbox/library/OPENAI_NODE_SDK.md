# OPENAI_NODE_SDK

## Crawl Summary
Installation: npm install openai; deno add jsr:@openai/openai. Client config options: apiKey, maxRetries( default 2), timeout(default 600000ms), fetch, httpAgent, dangerouslyAllowBrowser, azureADTokenProvider, apiVersion. Methods: responses.create(params, opts) → Promise<{output_text, _request_id}> or AsyncIterable<SSEEvent>; chat.completions.create(params, opts) → Promise<{choices,message}[]> or stream. File uploads via client.files.create with fs.ReadStream|File|Response|toFile. Error handling via OpenAI.APIError subclasses mapped to HTTP status codes. Retries: default 2 on connection errors, 408,409,429,≥500. Timeouts: default 10min, configurable; throws APIConnectionTimeoutError. Request ID in `_request_id` and `.withResponse()`. Auto-pagination for list methods. Realtime API uses WebSocket events. Azure support via AzureOpenAI. Advanced: .asResponse(), .withResponse(). Custom HTTP verbs: client.get/post. Custom fetch middleware. HTTP(S) agent support. SemVer conventions. Supported runtimes and browser option.

## Normalised Extract
Table of Contents
1 Installation
2 Constructor Options
3 Responses API
4 Chat Completions API
5 Streaming Responses
6 File Uploads
7 Error Handling
8 Retries & Backoff
9 Timeouts
10 Request IDs
11 Auto-pagination
12 Realtime API Beta
13 Azure OpenAI
14 Advanced Usage
15 Custom Requests
16 Fetch Middleware
17 HTTP(S) Agent
18 Semantic Versioning
19 Requirements

1 Installation
• npm install openai
• deno add jsr:@openai/openai
• npx jsr add @openai/openai

2 Constructor Options
• apiKey?: string (env OPENAI_API_KEY)
• maxRetries: number = 2
• timeout: number = 600000
• fetch?: (url, init?) => Promise<Response>
• httpAgent?: http.Agent | HttpsProxyAgent
• dangerouslyAllowBrowser?: boolean
• azureADTokenProvider?: TokenProvider
• apiVersion?: string

3 Responses API
Signature:
client.responses.create(
  params: { model: string; input: string; instructions?: string; stream?: boolean },
  opts?: { maxRetries?: number; timeout?: number; httpAgent?: Agent }
): Promise<{ output_text: string; _request_id: string }> | AsyncIterable<SSEEvent>

4 Chat Completions API
Signature:
client.chat.completions.create(
  params: { model: string; messages: { role: 'system'|'developer'|'user'|'assistant'; content: string }[]; stream?: boolean; functions?: any[] },
  opts?: RequestOptions
): Promise<{ choices: { message: { role: string; content: string } }[]; _request_id: string }> | AsyncIterable<ChatStreamEvent>

5 Streaming Responses
• stream: true returns AsyncIterable events following SSE spec

6 File Uploads
Signature:
client.files.create(
  params: { file: fs.ReadStream | File | Response | ReturnType<typeof toFile>; purpose: 'fine-tune' }
): Promise<{ id: string; object: string; bytes: number; _request_id: string }>

7 Error Handling
Type: OpenAI.APIError
Properties: request_id: string, status: number, name: string, headers: Record<string,string>
Subclasses by status code:
400: BadRequestError
401: AuthenticationError
403: PermissionDeniedError
404: NotFoundError
422: UnprocessableEntityError
429: RateLimitError
>=500: InternalServerError
N/A: APIConnectionError

8 Retries & Backoff
Default retries: 2
Retry on: connection errors, 408, 409, 429, >=500
Configure: maxRetries globally or per-request

9 Timeouts
Default: 600000ms
Per-request override via opts.timeout
On timeout: throws APIConnectionTimeoutError

10 Request IDs
_all responses include _request_id from X-Request-Id
.withResponse() → { data: T; request_id: string }

11 Auto-pagination
Use for await … of on list methods
list(params: { limit: number }) → Page<T>
Page<T>.data: T[]
Page<T>.hasNextPage(): boolean
Page<T>.getNextPage(): Promise<Page<T>>

12 Realtime API Beta
new OpenAIRealtimeWebSocket({ model: string })
on events: 'response.text.delta', 'response.audio.delta', etc

13 Azure OpenAI
new AzureOpenAI({ azureADTokenProvider: TokenProvider, apiVersion: string })
Chat completions same signature under azureOpenAI.chat.completions.create

14 Advanced Usage
.asResponse(): Promise<Response>
.withResponse(): Promise<{ data: T; response: Response }>

15 Custom Requests
client.get(path: string, opts: { query?: any; headers?: any }): Promise<any>
client.post(path: string, opts: { body?: any; query?: any; headers?: any }): Promise<any>

16 Fetch Middleware
Provide fetch in constructor: logs or modifies RequestInit

17 HTTP(S) Agent
Constructor: httpAgent: Agent
Per-request: opts.httpAgent

18 Semantic Versioning
Follows SemVer; minor releases may include type-only changes

19 Requirements
TypeScript >=4.5
Node.js >=18 LTS
Deno >=1.28
Bun >=1.0
Cloudflare Workers
Vercel Edge Runtime
Nitro >=2.6
Jest >=28 (node environment)
Browser support disabled; enable via dangerouslyAllowBrowser:true

## Supplementary Details
Constructor default values:
• maxRetries = 2
• timeout = 600000
• apiKey default reads process.env.OPENAI_API_KEY

Default retry backoff: exponential, base delay ~100ms

toFile helper signature:
export function toFile(bytes: Buffer | Uint8Array, filename: string): Promise<{ data: Buffer; filename: string }>

SSEEvent type:
interface SSEEvent { type: string; id?: string; data: string }

ChatStreamEvent type:
interface ChatStreamEvent { delta: string; role?: string; function_call?: { name: string; arguments: string } }

Agent types:
http.Agent from 'http'
HttpsProxyAgent from 'https-proxy-agent'

TokenProvider for Azure:
type TokenProvider = () => Promise<{ token: string; expiresOnTimestamp: number }>

Environment variable:
• DEBUG=true enables automatic request/response logging

File upload max size: governed by API limits (default file size <=100MB)

Error headers include retry-after for rate limits


## Reference Details
OpenAI Constructor
Signature:
new OpenAI(options?: {
  apiKey?: string
  maxRetries?: number
  timeout?: number
  fetch?: (url: RequestInfo, init?: RequestInit) => Promise<Response>
  httpAgent?: http.Agent | HttpsProxyAgent
  dangerouslyAllowBrowser?: boolean
})
Description: Instantiates client, applies fetch, retries, timeout, agent

Responses API
Method: client.responses.create
Params interface:
interface ResponsesCreateParams {
  model: string
  input: string
  instructions?: string
  stream?: boolean
}
Options interface:
interface RequestOptions { maxRetries?: number; timeout?: number; httpAgent?: Agent }
Return types:
Promise<{ output_text: string; _request_id: string }>
AsyncIterable<SSEEvent> when stream=true

Code example:
const response = await client.responses.create({ model: 'gpt-4o', instructions: 'You are a pirate', input: 'Semicolons?' });
console.log(response.output_text);

Chat Completions API
Method: client.chat.completions.create
Params interface:
interface ChatCompletionCreateParams {
  model: string
  messages: Array<{ role: 'system'|'developer'|'user'|'assistant'; content: string }>
  stream?: boolean
  functions?: Array<{ name:string; parameters:object }>
}
Return types:
Promise<{ choices: Array<{ message: { role:string; content:string } }>; _request_id: string }>
AsyncIterable<ChatStreamEvent> when stream=true

Code example:
const completion = await client.chat.completions.create({ model:'gpt-4o', messages:[{role:'user',content:'Tell pirate jokes'}] });
console.log(completion.choices[0].message.content);

Streaming Responses
Behavior: SSE events emitted, use for await. Each event: { type: 'event', data: JSON }

File Uploads
Method: client.files.create
Params:
interface FilesCreateParams { file: FileInput; purpose: 'fine-tune' }
type FileInput = fs.ReadStream | File | Response | ReturnType<typeof toFile>
Return: Promise<{ id: string; object: string; bytes: number; _request_id: string }>

Error Handling
APIError base:
class APIError extends Error { request_id: string; status: number; headers: Record<string,string> }
Subclasses mapping HTTP codes

Retries
Default retry count =2
Retryable codes: Connection errors, 408, 409, 429, >=500
Global override in constructor; per-request via opts.maxRetries

Timeouts
Default timeout=600000ms
Override via opts.timeout
Throws APIConnectionTimeoutError on timeout

Request IDs
Access via response._request_id
.withResponse(): returns request_id separate

Auto-pagination
list methods return Page<T>
interface Page<T> { data: T[]; hasNextPage(): boolean; getNextPage(): Promise<Page<T>> }

Realtime API Beta
Class: OpenAIRealtimeWebSocket
Constructor opts: { model: string }
Events: 'response.text.delta', 'response.audio.delta', 'function_call'}

Azure OpenAI
Constructor: new AzureOpenAI({ azureADTokenProvider: TokenProvider; apiVersion: string })
Methods identical under azure chat/completions

Advanced Usage
.asResponse(): returns raw Response from fetch
.withResponse(): returns { data, response }

Custom/Undocumented Requests
client.get(path:string, { query?, headers? })
client.post(path:string, { body?, query?, headers? })

Custom Fetch
Provide fetch fn to constructor

HTTP(S) Agent
Provide httpAgent in constructor or per-request

Best Practices
• Use fs.createReadStream for large files
• Inspect err.request_id for support
• Set DEBUG=true for logs

Troubleshooting:
Command: DEBUG=true node app.js
Expected: logs of URL, init, response
Error status handling: log err.status, err.name, err.request_id

Configuration Effects
maxRetries=0 disables retries
timeout small values abort early
httpAgent customizes TCP connections

## Information Dense Extract
OpenAI({apiKey?:string, maxRetries:number=2, timeout:number=600000, fetch?(url,init?):Promise<Response>, httpAgent?:Agent, dangerouslyAllowBrowser?:boolean})
responses.create({model:string,input:string,instructions?:string,stream?:boolean}, {maxRetries?:number,timeout?:number,httpAgent?:Agent}): Promise<{output_text:string,_request_id:string}>|AsyncIterable<SSEEvent>
chat.completions.create({model:string,messages:{role:string,content:string}[],stream?:boolean,functions?:any[]}, RequestOptions): Promise<{choices:{message:{role:string,content:string}}[],_request_id:string}>|AsyncIterable<ChatStreamEvent>
files.create({file:fs.ReadStream|File|Response|toFile(Buffer|Uint8Array,filename:string),purpose:'fine-tune'}):Promise<{id:string,object:string,bytes:number,_request_id:string}>
Error subclasses: BadRequestError(400),AuthenticationError(401),PermissionDeniedError(403),NotFoundError(404),UnprocessableEntityError(422),RateLimitError(429),InternalServerError(>=500),APIConnectionError
Default retries=2 on conn errors,408,409,429,>=500; override via maxRetries
Default timeout=600000ms; override via timeout; throws APIConnectionTimeoutError
.withResponse():{data,response}; .asResponse():Response
Auto-pagination: for await … of on list(); page.data, page.hasNextPage(), page.getNextPage()
OpenAIRealtimeWebSocket({model:string}) on 'response.text.delta'
AzureOpenAI({azureADTokenProvider,apiVersion})
client.get/post(path,{body?,query?,headers?})
Requirements: TS>=4.5, Node>=18, Deno>=1.28,Bun>=1.0,Cloudflare,VercelEdge,Nitro>=2.6,Jest>=28; browser support via dangerouslyAllowBrowser:true

## Sanitised Extract
Table of Contents
1 Installation
2 Constructor Options
3 Responses API
4 Chat Completions API
5 Streaming Responses
6 File Uploads
7 Error Handling
8 Retries & Backoff
9 Timeouts
10 Request IDs
11 Auto-pagination
12 Realtime API Beta
13 Azure OpenAI
14 Advanced Usage
15 Custom Requests
16 Fetch Middleware
17 HTTP(S) Agent
18 Semantic Versioning
19 Requirements

1 Installation
 npm install openai
 deno add jsr:@openai/openai
 npx jsr add @openai/openai

2 Constructor Options
 apiKey?: string (env OPENAI_API_KEY)
 maxRetries: number = 2
 timeout: number = 600000
 fetch?: (url, init?) => Promise<Response>
 httpAgent?: http.Agent | HttpsProxyAgent
 dangerouslyAllowBrowser?: boolean
 azureADTokenProvider?: TokenProvider
 apiVersion?: string

3 Responses API
Signature:
client.responses.create(
  params: { model: string; input: string; instructions?: string; stream?: boolean },
  opts?: { maxRetries?: number; timeout?: number; httpAgent?: Agent }
): Promise<{ output_text: string; _request_id: string }> | AsyncIterable<SSEEvent>

4 Chat Completions API
Signature:
client.chat.completions.create(
  params: { model: string; messages: { role: 'system'|'developer'|'user'|'assistant'; content: string }[]; stream?: boolean; functions?: any[] },
  opts?: RequestOptions
): Promise<{ choices: { message: { role: string; content: string } }[]; _request_id: string }> | AsyncIterable<ChatStreamEvent>

5 Streaming Responses
 stream: true returns AsyncIterable events following SSE spec

6 File Uploads
Signature:
client.files.create(
  params: { file: fs.ReadStream | File | Response | ReturnType<typeof toFile>; purpose: 'fine-tune' }
): Promise<{ id: string; object: string; bytes: number; _request_id: string }>

7 Error Handling
Type: OpenAI.APIError
Properties: request_id: string, status: number, name: string, headers: Record<string,string>
Subclasses by status code:
400: BadRequestError
401: AuthenticationError
403: PermissionDeniedError
404: NotFoundError
422: UnprocessableEntityError
429: RateLimitError
>=500: InternalServerError
N/A: APIConnectionError

8 Retries & Backoff
Default retries: 2
Retry on: connection errors, 408, 409, 429, >=500
Configure: maxRetries globally or per-request

9 Timeouts
Default: 600000ms
Per-request override via opts.timeout
On timeout: throws APIConnectionTimeoutError

10 Request IDs
_all responses include _request_id from X-Request-Id
.withResponse()  { data: T; request_id: string }

11 Auto-pagination
Use for await  of on list methods
list(params: { limit: number })  Page<T>
Page<T>.data: T[]
Page<T>.hasNextPage(): boolean
Page<T>.getNextPage(): Promise<Page<T>>

12 Realtime API Beta
new OpenAIRealtimeWebSocket({ model: string })
on events: 'response.text.delta', 'response.audio.delta', etc

13 Azure OpenAI
new AzureOpenAI({ azureADTokenProvider: TokenProvider, apiVersion: string })
Chat completions same signature under azureOpenAI.chat.completions.create

14 Advanced Usage
.asResponse(): Promise<Response>
.withResponse(): Promise<{ data: T; response: Response }>

15 Custom Requests
client.get(path: string, opts: { query?: any; headers?: any }): Promise<any>
client.post(path: string, opts: { body?: any; query?: any; headers?: any }): Promise<any>

16 Fetch Middleware
Provide fetch in constructor: logs or modifies RequestInit

17 HTTP(S) Agent
Constructor: httpAgent: Agent
Per-request: opts.httpAgent

18 Semantic Versioning
Follows SemVer; minor releases may include type-only changes

19 Requirements
TypeScript >=4.5
Node.js >=18 LTS
Deno >=1.28
Bun >=1.0
Cloudflare Workers
Vercel Edge Runtime
Nitro >=2.6
Jest >=28 (node environment)
Browser support disabled; enable via dangerouslyAllowBrowser:true

## Original Source
OpenAI Node.js SDK Reference
https://github.com/openai/openai-node

## Digest of OPENAI_NODE_SDK

# Installation

• npm install openai
• deno add jsr:@openai/openai
• npx jsr add @openai/openai

# Client Configuration

```ts
new OpenAI({
  apiKey?: string,              // default: process.env.OPENAI_API_KEY
  maxRetries?: number,         // default: 2
  timeout?: number,            // default: 600000 ms (10 minutes)
  fetch?: (url: RequestInfo, init?: RequestInit) => Promise<Response>,
  httpAgent?: http.Agent | HttpsProxyAgent,
  dangerouslyAllowBrowser?: boolean,
  azureADTokenProvider?: TokenProvider,
  apiVersion?: string
})
```

# Responses API

```ts
client.responses.create(
  { model: string; input: string; instructions?: string; stream?: boolean },
  { maxRetries?: number; timeout?: number; httpAgent?: Agent }
): Promise<{ output_text: string; _request_id: string }>
```

# Chat Completions API

```ts
client.chat.completions.create(
  { model: string; messages: Array<{ role: 'system'|'developer'|'user'|'assistant'; content: string }>; stream?: boolean; functions?: any[] },
  RequestOptions
): Promise<{ choices: Array<{ message: { role: string; content: string } }>; _request_id: string }>
```

# Streaming Responses

• server-sent events: When `stream: true`, returns `AsyncIterable<SSEEvent>`

# File Uploads

```ts
client.files.create(
  { file: fs.ReadStream|File|Response|toFile(Buffer|Uint8Array, filename: string); purpose: 'fine-tune' }
): Promise<{ id: string; object: string; bytes: number; _request_id: string }>
```

# Error Handling

```ts
if (err instanceof OpenAI.APIError) {
  err.request_id: string
  err.status: number
  err.name: string
  err.headers: Record<string,string>
}
```

APIError subclasses:
• 400 → BadRequestError
• 401 → AuthenticationError
• 403 → PermissionDeniedError
• 404 → NotFoundError
• 422 → UnprocessableEntityError
• 429 → RateLimitError
• ≥500 → InternalServerError
• N/A → APIConnectionError

# Retries and Backoff

• Default: 2 retries on connection errors, 408, 409, 429, ≥500
• Configure: `maxRetries` globally or per-request

# Timeouts

• Default: 600000 ms
• Override globally or per-request via `timeout` option
• On timeout: throws APIConnectionTimeoutError

# Request IDs

• All responses attach `_request_id` from X-Request-Id header
• `.withResponse()` returns `{ data, request_id }`

# Auto-pagination

```ts
for await (const item of client.fineTuning.jobs.list({ limit: number })) { /*...*/ }
```
• `page = await list(...); page.data[]`; `while(page.hasNextPage()) page = await page.getNextPage()`

# Realtime API Beta

```ts
import { OpenAIRealtimeWebSocket } from 'openai/beta/realtime/websocket';
const rt = new OpenAIRealtimeWebSocket({ model: string });
rt.on('response.text.delta', (event) => event.delta);
```

# Microsoft Azure OpenAI

```ts
new AzureOpenAI({ azureADTokenProvider: TokenProvider, apiVersion: string });
```

# Advanced Usage

• `.asResponse()`: raw Response
• `.withResponse()`: `{ data, response }`

# Custom Requests

```ts
await client.post(path: string, { body?: any; query?: Record<string,any>; headers?: Record<string,string> });
``` 

# Custom Fetch & Middleware

• Provide `fetch` in constructor to inspect/alter requests
• `DEBUG=true` logs all requests and responses

# HTTP(S) Agent Configuration

```ts
new OpenAI({ httpAgent: new HttpsProxyAgent(url) });
client.models.list({ httpAgent: new http.Agent({ keepAlive: false }) });
```

# Semantic Versioning

• Follows SemVer; minor releases may contain type-only or internal changes

# Requirements

• TypeScript ≥4.5
• Node.js ≥18 LTS, Deno ≥1.28, Bun ≥1.0, Cloudflare Workers, Vercel Edge, Nitro ≥2.6, Jest ≥28 (node env)
• Browser support disabled by default; enable via `dangerouslyAllowBrowser: true`

## Attribution
- Source: OpenAI Node.js SDK Reference
- URL: https://github.com/openai/openai-node
- License: License if known
- Crawl Date: 2025-05-17T22:27:09.705Z
- Data Size: 642566 bytes
- Links Found: 5163

## Retrieved
2025-05-17
