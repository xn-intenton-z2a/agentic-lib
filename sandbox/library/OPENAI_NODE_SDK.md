# OPENAI_NODE_SDK

## Crawl Summary
Install via npm or deno. Initialize OpenAI client with options apiKey(default env), timeout(default600000ms), maxRetries(default2), fetch override, httpAgent, dangerouslyAllowBrowser. Key APIs: responses.create, chat.completions.create with exact param types and return types or AsyncIterable on stream. File uploads accept ReadStream|File|Response|toFile helper. Errors: subclasses of APIError mapped to status codes, retried errors, default retry logic with exponential backoff, timeout default10min configurable. Request IDs via _request_id and withResponse. Auto-pagination via for await, manual paging methods. Realtime WebSocket API. AzureOpenAI client init. Advanced raw response methods .asResponse() and .withResponse(). Custom HTTP verbs client.get/post for undocumented endpoints. Fetch client override. HTTP(S) agent config for proxies. Requirements: TS>=4.5, Node18+, Deno1.28+, Bun1+, Workers, Edge, Jest28+

## Normalised Extract
Table of Contents

1 Installation
2 Client Initialization
3 Responses API
4 Chat Completions API
5 Streaming Responses
6 File Uploads
7 Error Handling
8 Retries & Backoff
9 Timeouts
10 Request IDs
11 Auto-Pagination
12 Realtime API Beta
13 Azure OpenAI
14 Advanced Usage
15 Custom Requests
16 Fetch Client Customization
17 HTTP(S) Agent Configuration
18 Semantic Versioning & Requirements

1 Installation
Commands:
  npm install openai
  deno add jsr:@openai/openai

2 Client Initialization
Signature:
  new OpenAI(options?: {
    apiKey?: string       // default env OPENAI_API_KEY
    timeout?: number      // default 600000 ms
    maxRetries?: number   // default 2
    fetch?: (url, init) => Promise<Response>
    httpAgent?: Agent     // for proxy or keepAlive config
    dangerouslyAllowBrowser?: boolean // default false
  })

3 Responses API
Method:
  client.responses.create(
    params: { model: string; instructions?: string; input?: string; stream?: boolean },
    options?: { timeout?: number; maxRetries?: number }
  )
Returns:
  Promise<{ output_text: string; _request_id: string }>
  OR AsyncIterable<{ data: string; done: boolean }>

4 Chat Completions API
Method:
  client.chat.completions.create(
    params: { model: string; messages: Array<{ role: string; content: string }>; stream?: boolean },
    options?: { timeout?: number; maxRetries?: number }
  )
Returns:
  Promise<{ choices: Array<{ message: { role: string; content: string } }>; _request_id: string }>
  OR AsyncIterable<{ delta: string; index: number; finish_reason: string }>

5 Streaming Responses
Enable with stream: true in params. Receive events via for await.

6 File Uploads
Method:
  client.files.create(
    params: { file: ReadStream | File | Response | Awaited<ReturnType<typeof toFile>>; purpose: 'fine-tune' }
  )
Returns:
  Promise<{ id: string; object: 'file'; bytes: number; created_at: number; filename: string; purpose: string }>

7 Error Handling
Threw subclass of APIError on 4xx/5xx or connection issue.
Mapping:
 400 BadRequestError
 401 AuthenticationError
 403 PermissionDeniedError
 404 NotFoundError
 422 UnprocessableEntityError
 429 RateLimitError
 >=500 InternalServerError
 Connection failures APIConnectionError

8 Retries & Backoff
Default maxRetries: 2. Retried errors: network, 408, 409, 429, >=500. Configure via maxRetries in client or per request.

9 Timeouts
Default timeout: 600000 ms. Throws APIConnectionTimeoutError on expiry. Override via timeout in client or per request.

10 Request IDs
Response objects include _request_id. Method withResponse returns { data, response, request_id }.

11 Auto-Pagination
List methods return AsyncIterable. Use for await. Manual pagination via .list({ limit }).page.data and page.hasNextPage()/page.getNextPage().

12 Realtime API Beta
Class OpenAIRealtimeWebSocket({ model: string }). Event types: 'response.text.delta', etc.

13 Azure OpenAI
Class AzureOpenAI({ azureADTokenProvider: Provider; apiVersion: string }).chat.completions.create(signature as above).

14 Advanced Usage
.asResponse() returns raw fetch Response. .withResponse() returns { data, response }.

15 Custom Requests
client.get(path: string, options?: { query?: any; headers?: any });
client.post(path: string, options?: { body?: any; query?: any; headers?: any });

16 Fetch Client Customization
Pass fetch override in client options to inspect/alter requests.

17 HTTP(S) Agent Configuration
Pass httpAgent in client or per-request options for proxy or keepAlive control.

18 Semantic Versioning & Requirements
Package follows SemVer. Requirements: TypeScript>=4.5, Node.js>=18 LTS, Deno>=1.28, Bun>=1.0, Cloudflare Workers, Vercel Edge, Jest>=28 node env.

## Supplementary Details
Configuration Options

client options:
  apiKey: string        // default process.env.OPENAI_API_KEY
  timeout: number       // default 600000 ms
  maxRetries: number    // default 2
  fetch: function       // override fetch client
  httpAgent: Agent      // http/https agent
  dangerouslyAllowBrowser: boolean // disable browser runtime protection

per-request options:
  timeout: number       // override client default
  maxRetries: number    // override client default
  httpAgent: Agent      // override client default

File parameter types:
  fs.ReadStream       // use fs.createReadStream(path)
  File                // Web File API
  fetch Response      // fetch(url)
  toFile(helper)      // toFile(Buffer|Uint8Array, filename)

Error Classes:
  OpenAI.APIError: base
    BadRequestError extends APIError
    AuthenticationError
    PermissionDeniedError
    NotFoundError
    UnprocessableEntityError
    RateLimitError
    InternalServerError
    APIConnectionError
    APIConnectionTimeoutError

Retryable status codes: 408, 409, 429, >=500

Timeout Error: APIConnectionTimeoutError

Request methods list:
  client.responses
  client.chat.completions
  client.files
  client.models
  client.fineTuning.jobs

WebSocket usage:
  import OpenAIRealtimeWebSocket from 'openai/beta/realtime/websocket'
  events: 'response.text.delta', 'response.audio.chunk', 'response.function.call'

AzureOpenAI differences: uses azureADTokenProvider and apiVersion in client options

Manual pagination:
  let page = await client.fineTuning.jobs.list({ limit: number })
  page.data: Array<Job>
  page.hasNextPage(): boolean
  page.getNextPage(): Promise<Page>

Advanced fetch methods:
  .asResponse(): Promise<Response>
  .withResponse(): Promise<{ data: any; response: Response; request_id: string }>

Custom HTTP methods:
  client.get(path, options)
  client.post(path, options)
  client.put, patch, delete similar

Fetch override signature:
  (url: RequestInfo, init?: RequestInit) => Promise<Response>

HTTP(S) Agent example:
  import { HttpsProxyAgent } from 'https-proxy-agent'
  new OpenAI({ httpAgent: new HttpsProxyAgent(process.env.PROXY_URL) })

## Reference Details
1. Client Initialization
Signature:
 new OpenAI(options?: {
   apiKey?: string;
   timeout?: number;
   maxRetries?: number;
   fetch?: (url: RequestInfo, init?: RequestInit) => Promise<Response>;
   httpAgent?: Agent;
   dangerouslyAllowBrowser?: boolean;
 });

2. Responses API
Method signature:
 client.responses.create(
   params: { model: string; instructions?: string; input?: string; stream?: boolean },
   options?: { timeout?: number; maxRetries?: number }
 ): Promise<{ output_text: string; _request_id: string }>
  | AsyncIterable<{ data: string; done: boolean }>;

Example:
 const response = await client.responses.create({ model: 'gpt-4o', input: 'Hello' });
 console.log(response.output_text);

Streaming example:
 const stream = await client.responses.create({ model: 'gpt-4o', input: 'Hi', stream: true });
 for await (const event of stream) console.log(event.data);

3. Chat Completions API
Signature:
 client.chat.completions.create(
   params: { model: string; messages: Array<{ role: 'system'|'user'|'assistant'; content: string }>; stream?: boolean },
   options?: { timeout?: number; maxRetries?: number }
 ): Promise<{ choices: Array<{ message: { role: string; content: string } }>; _request_id: string }>
  | AsyncIterable<{ delta: string; index: number; finish_reason: string }>;

4. File Uploads API
Signature:
 client.files.create(
   params: { file: ReadStream|File|Response|Awaited<ReturnType<typeof toFile>>; purpose: 'fine-tune' }
 ): Promise<{ id: string; object: 'file'; bytes: number; created_at: number; filename: string; purpose: string }>;

5. Raw Response Methods
.asResponse(): Promise<Response>
.withResponse(): Promise<{ data: any; response: Response; request_id: string }>;

6. Custom Request Methods
client.get(path: string, options?: { query?: any; headers?: any }): Promise<any>;
client.post(path: string, options?: { body?: any; query?: any; headers?: any }): Promise<any>;

7. Error Classes & Mapping
class APIError extends Error { request_id: string; status: number; headers: Record<string,string> }
class BadRequestError extends APIError
class AuthenticationError extends APIError
class PermissionDeniedError extends APIError
class NotFoundError extends APIError
class UnprocessableEntityError extends APIError
class RateLimitError extends APIError
class InternalServerError extends APIError
class APIConnectionError extends APIError
class APIConnectionTimeoutError extends APIError

8. Configuration Defaults & Effects
maxRetries default 2 applies exponential backoff on retryable errors
timeout default 600000 ms aborts request and raises APIConnectionTimeoutError, retried twice
httpAgent reuse TCP, disable via keepAlive false

9. Best Practices
• reuse client instance
• catch OpenAI.APIError to inspect request_id, status, name, headers
• configure maxRetries for critical operations
• set timeout to bound request duration
• use .withResponse() for advanced logging
• use auto-pagination for list methods

10. Troubleshooting Procedures
Command: node script.js  // run code
If network error:
  retry default 2 times
If stuck on streaming:
  verify SSE events via console log
If file upload fails:
  ensure correct file parameter type, check helper toFile usage
If missing API key:
  set env OPENAI_API_KEY or pass apiKey in client options


## Information Dense Extract
install npm install openai; init new OpenAI({apiKey?,timeout=600000,maxRetries=2,fetch?,httpAgent?,dangerouslyAllowBrowser=false}); responses.create({model:string,instructions?:string,input?:string,stream?:boolean},options?:{timeout?,maxRetries?})→Promise<{output_text:string,_request_id:string}>|AsyncIterable<{data:string,done:boolean}>; chat.completions.create({model:string,messages:Array<{role:string,content:string}>,stream?:boolean},options?)→Promise<{choices:Array<{message:{role:string,content:string}}>,_request_id:string}>|AsyncIterable<{delta:string,index:number,finish_reason:string}>; files.create({file:ReadStream|File|Response|toFile, purpose:'fine-tune'})→Promise<{id:string,object:'file',bytes:number,created_at:number,filename:string,purpose:string}>; errors: APIError subclasses mapping 400→BadRequestError,401→AuthenticationError,403→PermissionDeniedError,404→NotFoundError,422→UnprocessableEntityError,429→RateLimitError,>=500→InternalServerError,network→APIConnectionError,timeout→APIConnectionTimeoutError; retries default2 on network,408,409,429,>=500; timeouts default600000ms; request_id via _request_id or withResponse(); auto-pagination via for await or page.getNextPage(); realtime WebSocket via OpenAIRealtimeWebSocket; AzureOpenAI({azureADTokenProvider,apiVersion}); advanced .asResponse(), .withResponse(); custom client.get/post; override fetch; httpAgent for proxy; TS>=4.5, Node>=18,Deno>=1.28,Bun>=1.0,Workers,Edge,Jest>=28 node

## Sanitised Extract
Table of Contents

1 Installation
2 Client Initialization
3 Responses API
4 Chat Completions API
5 Streaming Responses
6 File Uploads
7 Error Handling
8 Retries & Backoff
9 Timeouts
10 Request IDs
11 Auto-Pagination
12 Realtime API Beta
13 Azure OpenAI
14 Advanced Usage
15 Custom Requests
16 Fetch Client Customization
17 HTTP(S) Agent Configuration
18 Semantic Versioning & Requirements

1 Installation
Commands:
  npm install openai
  deno add jsr:@openai/openai

2 Client Initialization
Signature:
  new OpenAI(options?: {
    apiKey?: string       // default env OPENAI_API_KEY
    timeout?: number      // default 600000 ms
    maxRetries?: number   // default 2
    fetch?: (url, init) => Promise<Response>
    httpAgent?: Agent     // for proxy or keepAlive config
    dangerouslyAllowBrowser?: boolean // default false
  })

3 Responses API
Method:
  client.responses.create(
    params: { model: string; instructions?: string; input?: string; stream?: boolean },
    options?: { timeout?: number; maxRetries?: number }
  )
Returns:
  Promise<{ output_text: string; _request_id: string }>
  OR AsyncIterable<{ data: string; done: boolean }>

4 Chat Completions API
Method:
  client.chat.completions.create(
    params: { model: string; messages: Array<{ role: string; content: string }>; stream?: boolean },
    options?: { timeout?: number; maxRetries?: number }
  )
Returns:
  Promise<{ choices: Array<{ message: { role: string; content: string } }>; _request_id: string }>
  OR AsyncIterable<{ delta: string; index: number; finish_reason: string }>

5 Streaming Responses
Enable with stream: true in params. Receive events via for await.

6 File Uploads
Method:
  client.files.create(
    params: { file: ReadStream | File | Response | Awaited<ReturnType<typeof toFile>>; purpose: 'fine-tune' }
  )
Returns:
  Promise<{ id: string; object: 'file'; bytes: number; created_at: number; filename: string; purpose: string }>

7 Error Handling
Threw subclass of APIError on 4xx/5xx or connection issue.
Mapping:
 400 BadRequestError
 401 AuthenticationError
 403 PermissionDeniedError
 404 NotFoundError
 422 UnprocessableEntityError
 429 RateLimitError
 >=500 InternalServerError
 Connection failures APIConnectionError

8 Retries & Backoff
Default maxRetries: 2. Retried errors: network, 408, 409, 429, >=500. Configure via maxRetries in client or per request.

9 Timeouts
Default timeout: 600000 ms. Throws APIConnectionTimeoutError on expiry. Override via timeout in client or per request.

10 Request IDs
Response objects include _request_id. Method withResponse returns { data, response, request_id }.

11 Auto-Pagination
List methods return AsyncIterable. Use for await. Manual pagination via .list({ limit }).page.data and page.hasNextPage()/page.getNextPage().

12 Realtime API Beta
Class OpenAIRealtimeWebSocket({ model: string }). Event types: 'response.text.delta', etc.

13 Azure OpenAI
Class AzureOpenAI({ azureADTokenProvider: Provider; apiVersion: string }).chat.completions.create(signature as above).

14 Advanced Usage
.asResponse() returns raw fetch Response. .withResponse() returns { data, response }.

15 Custom Requests
client.get(path: string, options?: { query?: any; headers?: any });
client.post(path: string, options?: { body?: any; query?: any; headers?: any });

16 Fetch Client Customization
Pass fetch override in client options to inspect/alter requests.

17 HTTP(S) Agent Configuration
Pass httpAgent in client or per-request options for proxy or keepAlive control.

18 Semantic Versioning & Requirements
Package follows SemVer. Requirements: TypeScript>=4.5, Node.js>=18 LTS, Deno>=1.28, Bun>=1.0, Cloudflare Workers, Vercel Edge, Jest>=28 node env.

## Original Source
OpenAI Node.js SDK Reference
https://github.com/openai/openai-node

## Digest of OPENAI_NODE_SDK

# Installation

• Command Line
  npm install openai
  deno add jsr:@openai/openai
  npx jsr add @openai/openai

# Client Initialization

```typescript
new OpenAI(options?: {
  apiKey?: string           // default from env OPENAI_API_KEY
  timeout?: number          // default 600000 ms
  maxRetries?: number       // default 2
  fetch?: (url: RequestInfo, init?: RequestInit) => Promise<Response>
  httpAgent?: Agent         // http or https agent for proxy/config
  dangerouslyAllowBrowser?: boolean // default false
})
```

# Responses API (Text Generation)

```typescript
client.responses.create(
  params: {
    model: string,
    instructions?: string,
    input?: string,
    stream?: boolean
  },
  options?: {
    timeout?: number,
    maxRetries?: number
  }
):
  Promise<{ output_text: string; _request_id: string }>
  | AsyncIterable<{ data: string; done: boolean }>
```

# Chat Completions API

```typescript
client.chat.completions.create(
  params: {
    model: string,
    messages: Array<{ role: 'system'|'developer'|'user'|'assistant'; content: string }>;
    stream?: boolean
  },
  options?: { timeout?: number; maxRetries?: number }
):
  Promise<{ choices: Array<{ message: { role: string; content: string } }>; _request_id: string }>
  | AsyncIterable<{ delta: string; index: number; finish_reason: string }>
```

# Streaming Responses

• Pass stream: true in params
to receive AsyncIterable events

# File Uploads

```typescript
client.files.create(
  params: {
    file: ReadStream | File | Response | Awaited<ReturnType<typeof toFile>>;
    purpose: 'fine-tune'
  }
): Promise<{
  id: string;
  object: 'file';
  bytes: number;
  created_at: number;
  filename: string;
  purpose: string;
}>
```

# Error Handling

• Thrown subclass of OpenAI.APIError on 4xx/5xx or connection failure

Status Code → Error Class:
400 → BadRequestError
401 → AuthenticationError
403 → PermissionDeniedError
404 → NotFoundError
422 → UnprocessableEntityError
429 → RateLimitError
>=500 → InternalServerError
Network issues → APIConnectionError

# Retries & Backoff

default maxRetries: 2
errors retried: connection errors, 408, 409, 429, >=500
override via options or client config

# Timeouts

default timeout: 600000 ms
throws APIConnectionTimeoutError on expiry
configurable per request or client

# Request IDs

• property _request_id on response objects
• method withResponse() returns { data, response, request_id }

# Auto-pagination

• for await … of list methods
default page size via limit param
automatic fetch of next pages

# Realtime API Beta

```typescript
import { OpenAIRealtimeWebSocket } from 'openai/beta/realtime/websocket';
const rt = new OpenAIRealtimeWebSocket({ model: string });
rt.on('response.text.delta', (event) => {});
```

# Microsoft Azure OpenAI

```typescript
new AzureOpenAI({
  azureADTokenProvider: Provider,
  apiVersion: string
}).chat.completions.create(params, options)
```

# Advanced Usage

• .asResponse() to get raw fetch Response
• .withResponse() to get parsed data plus raw Response

# Custom/Undocumented Requests

```typescript
client.get(path: string, options?: { query?: Record<string,any>; headers?: Record<string,any> });
client.post(path: string, options?: { body?: any; query?: any; headers?: any });
```

# Fetch Client Customization

• Override global fetch via client option fetch

# HTTP(S) Agent Configuration

```typescript
new OpenAI({ httpAgent: agentInstance });
client.models.list(params, { httpAgent: agentInstance });
```

# Semantic Versioning & Requirements

• Typescript >=4.5
• Node.js >=18 LTS, Deno >=v1.28, Bun >=1.0, Cloudflare Workers, Vercel Edge, Jest >=28 "node"
• browser support disabled unless dangerouslyAllowBrowser: true

## Attribution
- Source: OpenAI Node.js SDK Reference
- URL: https://github.com/openai/openai-node
- License: License: MIT
- Crawl Date: 2025-05-08T03:36:03.699Z
- Data Size: 597618 bytes
- Links Found: 4789

## Retrieved
2025-05-08
