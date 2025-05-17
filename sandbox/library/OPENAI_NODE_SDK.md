# OPENAI_NODE_SDK

## Crawl Summary
Installed via npm or JSR. Constructor options: apiKey, maxRetries, timeout, fetch, httpAgent, dangerouslyAllowBrowser. Key methods: responses.create, chat.completions.create, client.files.create. Streaming via SSE on stream:true. File uploads accept fs.ReadStream, File, Response, toFile. Errors: APIError subclasses with status and request_id. Retries: default 2 for network and specific status codes; configurable via maxRetries. Timeouts: default 600000ms, configurable; throws APIConnectionTimeoutError. All responses expose _request_id and .withResponse(). Auto-pagination via for await on list methods or page methods. Beta realtime via OpenAIRealtimeWebSocket. Azure uses AzureOpenAI with azureADTokenProvider and apiVersion. Advanced: raw access via .asResponse()/.withResponse(), undocumented via client.get/post, environment shims, logging via fetch override or DEBUG, httpAgent config. Requirements: TS>=4.5, Node18+, Deno1.28+, Bun1+, Cloudflare, Vercel, Jest28+, Nitro2.6+, browser support opt-in.

## Normalised Extract
Table of Contents
1 Client Initialization
2 Text Generation API
3 Chat Completions API
4 Streaming Responses
5 File Uploads
6 Error Types and Properties
7 Retry Policy
8 Timeout Configuration
9 Request ID Handling
10 Pagination Patterns
11 Realtime WebSocket API
12 Azure OpenAI Integration
13 Raw Response Methods
14 Undocumented HTTP Methods
15 Environment Shims
16 Logging and Middleware
17 HTTP Agent Usage
18 Supported Runtimes

1 Client Initialization
Options:
  apiKey: string                 Environment variable OPENAI_API_KEY if omitted
  maxRetries: number             Defaults to 2
  timeout: number                Defaults to 600000 (ms)
  fetch: (url, init) => Promise<Response>
  httpAgent: Agent               Node http.Agent or https.Agent
  dangerouslyAllowBrowser: boolean Defaults to false

2 Text Generation API
Method Signature:
  responses.create(
    params: { model: string; input?: string; instructions?: string; stream?: boolean },
    options?: { maxRetries?: number; timeout?: number; httpAgent?: Agent }
  ) => Promise<{ output_text: string; _request_id: string }> | AsyncIterable<{ data:any; _request_id:string }>

3 Chat Completions API
Method Signature:
  chat.completions.create(
    params: {
      model: string;
      messages: { role: 'system'|'user'|'assistant'|'developer'; content:string }[];
      temperature?: number;
      max_tokens?: number;
      stream?: boolean;
    },
    options?: { maxRetries?: number; timeout?: number }
  ) => Promise<{ choices:{ message:{ role:string; content:string }}[]; _request_id:string }>

4 Streaming Responses
  Set params.stream=true; iterate returned AsyncIterable<event>.

5 File Uploads
Allowed file types:
  fs.ReadStream
  Web File
  fetch.Response
  toFile(data: Buffer|Uint8Array, filename:string)
Usage:
  files.create({ file, purpose:'fine-tune' }): Promise<{ id:string; object:string }>

6 Error Types and Properties
Error subclasses thrown:
  BadRequestError(400), AuthenticationError(401), PermissionDeniedError(403), NotFoundError(404), UnprocessableEntityError(422), RateLimitError(429), InternalServerError(>=500), APIConnectionError
Error instance properties:
  request_id: string, status: number, name: string, headers: Record<string,string>

7 Retry Policy
Defaults: maxRetries=2 for network errors, 408,409,429,>=500
Override globally or per-request via maxRetries option

8 Timeout Configuration
Defaults: timeout=600000ms
Override globally or per-request via timeout option
On timeout throws APIConnectionTimeoutError

9 Request ID Handling
All methods return _request_id from x-request-id
.withResponse() yields { data, request_id }

10 Pagination Patterns
List methods return Page object:
  data: T[]; hasNextPage(): boolean; getNextPage(): Promise<Page<T>>
Use for await...of to auto-paginate

11 Realtime WebSocket API
Import:
  import { OpenAIRealtimeWebSocket } from 'openai/beta/realtime/websocket'
Usage:
  new OpenAIRealtimeWebSocket({ model:string })
  .on('response.text.delta', (event:{ delta:string }) => {})

12 Azure OpenAI Integration
Import:
  import { AzureOpenAI } from 'openai'; import { getBearerTokenProvider, DefaultAzureCredential } from '@azure/identity'
Initialization:
  new AzureOpenAI({ azureADTokenProvider:TokenProvider, apiVersion:string })
Use identical chat.completions.create API

13 Raw Response Methods
.asResponse(): Promise<Response>
.withResponse(): Promise<{ data:any; response:Response }>

14 Undocumented HTTP Methods
client.get(path:string, options), client.post(path:string,{ body:any; query:any; headers:any })

15 Environment Shims
import 'openai/shims/web' to use global fetch in Node
import 'openai/shims/node' to use node-fetch

16 Logging and Middleware
Provide fetch override in constructor to log requests and responses
DEBUG=true auto-logs all

17 HTTP Agent Usage
Pass httpAgent globally or per-request to control TCP/TLS behavior

18 Supported Runtimes
TypeScript>=4.5, Node>=18, Deno>=1.28, Bun>=1.0, Cloudflare Workers, Vercel Edge, Jest>=28 (node), Nitro>=2.6, Browsers (dangerouslyAllowBrowser=true)


## Supplementary Details
- apiKey: string | undefined, obtained from process.env.OPENAI_API_KEY if not provided
- maxRetries: number, default 2
- timeout: number, default 600000
- httpAgent: http.Agent or https.Agent, reused across all requests unless overridden per-request
- fetch: custom fetch implementation signature (url: RequestInfo, init?: RequestInit) => Promise<Response>
- dangerouslyAllowBrowser: boolean, default false; when true, enables SDK in browser environments
- toFile(input: Buffer|Uint8Array|string, filename: string) => FileLike object for uploads
- File uploads: purpose must be one of ['fine-tune', 'answers', 'classifications', 'search', 'summaries']
- SSE streaming: uses EventSource; events emitted are objects with fields { data: any; event: string }
- RequestOptions: interface { maxRetries?: number; timeout?: number; httpAgent?: Agent }
- Error retry on codes: 408,409,429,>=500 and on APIConnectionError
- APIConnectionTimeoutError extends APIConnectionError, thrown on timeout
- .withResponse() returns Tuple<{ data: T; response: Response; request_id: string }>
- Auto-pagination: interface Paged<T> { data: T[]; hasNextPage(): boolean; getNextPage(): Promise<Paged<T>> }
- Realtime WebSocket events: response.text.delta, response.text, response.audio.data, response.function_call
- AzureOpenAI apiVersion: semantic version string, e.g. '2024-10-01-preview'


## Reference Details
1. API Client Constructor
Signature:
  constructor(options?: {
    apiKey?: string;
    maxRetries?: number;
    timeout?: number;
    fetch?: (url: RequestInfo, init?: RequestInit) => Promise<Response>;
    httpAgent?: Agent;
    dangerouslyAllowBrowser?: boolean;
  })
Behavior: stores options, applies defaults, and uses them on every request.

2. responses.create
Signature:
  create(
    params: {
      model: string;
      input?: string;
      instructions?: string;
      stream?: boolean;
    },
    options?: { maxRetries?: number; timeout?: number; httpAgent?: Agent }
  ): Promise<{ output_text: string; _request_id: string }> | AsyncIterable<{ data: any; _request_id: string }>
Example:
  const { output_text } = await client.responses.create({ model:'gpt-4o', input:'Hello' });
  for await (const event of await client.responses.create({ model:'gpt-4o', input:'Hello', stream:true })) console.log(event)

3. chat.completions.create
Signature:
  create(
    params: {
      model: string;
      messages: { role:'system'|'user'|'assistant'|'developer'; content:string }[];
      temperature?: number;
      max_tokens?: number;
      stream?: boolean;
    },
    options?: { maxRetries?: number; timeout?: number }
  ): Promise<{ choices:{ message:{ role:string; content:string } }[]; _request_id:string }>
Example:
  const completion = await client.chat.completions.create({ model:'gpt-4o', messages:[{ role:'user', content:'Hi' }], temperature:0.7, max_tokens:100 });

4. files.create
Signature:
  create(
    params: { file: ReadStream|File|Response; purpose: 'fine-tune'|'answers'|'search'|'classifications'|'summaries' },
    options?: { maxRetries?: number; timeout?: number }
  ): Promise<{ id:string; object:string; _request_id:string }>
Example:
  const fileObj = await toFile(Buffer.from('data'), 'data.jsonl');
  const response = await client.files.create({ file:fileObj, purpose:'fine-tune' });

5. Error Handling
Throws instance of OpenAI.APIError (abstract) or one of:
  BadRequestError, AuthenticationError, PermissionDeniedError, NotFoundError, UnprocessableEntityError, RateLimitError, InternalServerError, APIConnectionError
Properties:
  err.request_id: string
  err.status: number
  err.name: string
  err.headers: Record<string,string>

6. Retry Behavior
Default maxRetries = 2
Automatic retry on network errors, status codes 408,409,429,>=500
Override via maxRetries in constructor or per request

7. Timeout Behavior
Default timeout = 600000 ms
Override via timeout in constructor or per request
On timeout throws APIConnectionTimeoutError

8. Request ID Extraction
All parsed responses contain _request_id string
withResponse(): returns { data: T; response: Response; request_id: string }

9. Pagination
list methods signature:
  list(params: { limit?: number; page?: string }, options?): Promise<{ data:T[]; hasNextPage():boolean; getNextPage():Promise<Page<T>>; _request_id:string }>
Use for await (const item of client.resource.list({limit:20}))

10. Realtime WebSocket
new OpenAIRealtimeWebSocket(opts: { model: string }): instance emits events: 'open','close','error','response.text.delta','response.audio.data'

11. AzureOpenAI
constructor(opts: { azureADTokenProvider:TokenProvider; apiVersion:string; maxRetries?:number; timeout?:number; httpAgent?:Agent }): instance methods identical to OpenAI except request path includes /azure/openai/{apiVersion}

12. Raw Response Methods
.asResponse(): Promise<Response>
.withResponse(): Promise<{ data:T; response:Response; request_id:string }>

13. Undocumented HTTP Requests
client.get(path:string, options?:{ query?:Record<string,string>; headers?:Record<string,string> }): Promise<Response>
client.post(path:string, options:{ body:any; query?:Record<string,string>; headers?:Record<string,string> }): Promise<Response>

14. Shims
Add import 'openai/shims/web' before OpenAI imports to use global fetch
Add import 'openai/shims/node' to enforce node-fetch

15. Logging
Pass fetch override in constructor to log request URL, init and response
Set DEBUG=true to enable automatic console logging of requests and responses

16. HTTP Agent
Pass httpAgent: new HttpsProxyAgent(url) for proxies
Override per-request via options.httpAgent

17. Best Practices
Use environment variable OPENAI_API_KEY
Manage retries and timeouts according to network conditions
Stream large completions to reduce memory
Use auto-pagination for listing resources
Use .withResponse() for debugging headers and status
Use toFile helper for browser-agnostic file uploads

18. Troubleshooting
Command: DEBUG=true node app.js
Expected output: logs of each request URL, init options, and response status
On network failure: APIConnectionError thrown, retry attempts visible in logs
On rate limit: RateLimitError thrown after retries


## Information Dense Extract
OpenAI constructor options: apiKey(string),maxRetries(2),timeout(600000),fetch(fn),httpAgent(Agent),dangerouslyAllowBrowser(false). Key methods: responses.create({model:string,input?,instructions?,stream?},opts)->Promise<{output_text,string}>|AsyncIterable; chat.completions.create({model:string,messages:Message[],temperature?,max_tokens?,stream?},opts)->Promise<{choices:Message[]}>, files.create({file:ReadStream|File|Response|toFile, purpose:'fine-tune'|'answers'|'search'|'classifications'|'summaries'},opts)->Promise<{id,object}>. Streaming via stream:true yields AsyncIterable events. File: fs.ReadStream,Web File,fetch.Response,toFile(data, filename). Errors: APIError subclasses by status code with request_id,status,name,headers. Retries default on network,408,409,429,>=500; maxRetries override. Timeout default 600000ms; override; throws APIConnectionTimeoutError. Request ID in _request_id; .withResponse()->{data,response,request_id}. Pagination: list(params)->Page{data,hasNextPage(),getNextPage()}. Realtime WebSocket via OpenAIRealtimeWebSocket({model}). AzureOpenAI similar with azureADTokenProvider,apiVersion. .asResponse() returns raw fetch Response. Undocumented: client.get/post. Shims: import 'openai/shims/web' or 'node'. Logging: fetch override or DEBUG=true. HTTP Agent: global or per-request. Requirements: TS>=4.5, Node>=18, Deno>=1.28, Bun>=1, Cloudflare, Vercel, Jest>=28,node, Nitro>=2.6, Browser opt-in.

## Sanitised Extract
Table of Contents
1 Client Initialization
2 Text Generation API
3 Chat Completions API
4 Streaming Responses
5 File Uploads
6 Error Types and Properties
7 Retry Policy
8 Timeout Configuration
9 Request ID Handling
10 Pagination Patterns
11 Realtime WebSocket API
12 Azure OpenAI Integration
13 Raw Response Methods
14 Undocumented HTTP Methods
15 Environment Shims
16 Logging and Middleware
17 HTTP Agent Usage
18 Supported Runtimes

1 Client Initialization
Options:
  apiKey: string                 Environment variable OPENAI_API_KEY if omitted
  maxRetries: number             Defaults to 2
  timeout: number                Defaults to 600000 (ms)
  fetch: (url, init) => Promise<Response>
  httpAgent: Agent               Node http.Agent or https.Agent
  dangerouslyAllowBrowser: boolean Defaults to false

2 Text Generation API
Method Signature:
  responses.create(
    params: { model: string; input?: string; instructions?: string; stream?: boolean },
    options?: { maxRetries?: number; timeout?: number; httpAgent?: Agent }
  ) => Promise<{ output_text: string; _request_id: string }> | AsyncIterable<{ data:any; _request_id:string }>

3 Chat Completions API
Method Signature:
  chat.completions.create(
    params: {
      model: string;
      messages: { role: 'system'|'user'|'assistant'|'developer'; content:string }[];
      temperature?: number;
      max_tokens?: number;
      stream?: boolean;
    },
    options?: { maxRetries?: number; timeout?: number }
  ) => Promise<{ choices:{ message:{ role:string; content:string }}[]; _request_id:string }>

4 Streaming Responses
  Set params.stream=true; iterate returned AsyncIterable<event>.

5 File Uploads
Allowed file types:
  fs.ReadStream
  Web File
  fetch.Response
  toFile(data: Buffer|Uint8Array, filename:string)
Usage:
  files.create({ file, purpose:'fine-tune' }): Promise<{ id:string; object:string }>

6 Error Types and Properties
Error subclasses thrown:
  BadRequestError(400), AuthenticationError(401), PermissionDeniedError(403), NotFoundError(404), UnprocessableEntityError(422), RateLimitError(429), InternalServerError(>=500), APIConnectionError
Error instance properties:
  request_id: string, status: number, name: string, headers: Record<string,string>

7 Retry Policy
Defaults: maxRetries=2 for network errors, 408,409,429,>=500
Override globally or per-request via maxRetries option

8 Timeout Configuration
Defaults: timeout=600000ms
Override globally or per-request via timeout option
On timeout throws APIConnectionTimeoutError

9 Request ID Handling
All methods return _request_id from x-request-id
.withResponse() yields { data, request_id }

10 Pagination Patterns
List methods return Page object:
  data: T[]; hasNextPage(): boolean; getNextPage(): Promise<Page<T>>
Use for await...of to auto-paginate

11 Realtime WebSocket API
Import:
  import { OpenAIRealtimeWebSocket } from 'openai/beta/realtime/websocket'
Usage:
  new OpenAIRealtimeWebSocket({ model:string })
  .on('response.text.delta', (event:{ delta:string }) => {})

12 Azure OpenAI Integration
Import:
  import { AzureOpenAI } from 'openai'; import { getBearerTokenProvider, DefaultAzureCredential } from '@azure/identity'
Initialization:
  new AzureOpenAI({ azureADTokenProvider:TokenProvider, apiVersion:string })
Use identical chat.completions.create API

13 Raw Response Methods
.asResponse(): Promise<Response>
.withResponse(): Promise<{ data:any; response:Response }>

14 Undocumented HTTP Methods
client.get(path:string, options), client.post(path:string,{ body:any; query:any; headers:any })

15 Environment Shims
import 'openai/shims/web' to use global fetch in Node
import 'openai/shims/node' to use node-fetch

16 Logging and Middleware
Provide fetch override in constructor to log requests and responses
DEBUG=true auto-logs all

17 HTTP Agent Usage
Pass httpAgent globally or per-request to control TCP/TLS behavior

18 Supported Runtimes
TypeScript>=4.5, Node>=18, Deno>=1.28, Bun>=1.0, Cloudflare Workers, Vercel Edge, Jest>=28 (node), Nitro>=2.6, Browsers (dangerouslyAllowBrowser=true)

## Original Source
OpenAI Node.js SDK Reference
https://github.com/openai/openai-node

## Digest of OPENAI_NODE_SDK

# OpenAI Node.js SDK Reference

Date Retrieved: 2024-06-07
Data Size: 642645 bytes

## Installation

npm install openai

deno add jsr:@openai/openai
npx jsr add @openai/openai

## Client Initialization

```typescript
new OpenAI(options?: {
  apiKey?: string               // default from environment OPENAI_API_KEY
  maxRetries?: number           // default 2, controls retry count
  timeout?: number              // default 600000 ms (10 min)
  fetch?: (url: RequestInfo, init?: RequestInit) => Promise<Response>
  httpAgent?: Agent             // Node http(s) agent for all requests
  dangerouslyAllowBrowser?: boolean // default false
}
```  

## Text Generation (Responses API)

```typescript
client.responses.create(params: {
  model: string
  input?: string
  instructions?: string
  stream?: boolean
}, requestOptions?: {
  maxRetries?: number
  timeout?: number
  httpAgent?: Agent
}): Promise<{ output_text: string; _request_id: string } | AsyncIterable<{ data: any; _request_id: string }>>
```

## Chat Completions

```typescript
client.chat.completions.create(params: {
  model: string
  messages: { role: 'system' | 'user' | 'assistant' | 'developer'; content: string }[]
  temperature?: number
  max_tokens?: number
  stream?: boolean
}, requestOptions?: { maxRetries?: number; timeout?: number }): Promise<{ choices: { message: { role: string; content: string } }[]; _request_id: string }>
```

## Streaming Responses

Enable SSE streaming by setting stream: true. Returns AsyncIterable of events.

## File Uploads

Supported input types for file parameter:
- fs.ReadStream
- File API instance
- fetch Response
- toFile(Buffer|string|Uint8Array, filename)

```typescript
client.files.create({ file: ReadStream|File|Response, purpose: 'fine-tune' }): Promise<{ id: string; object: string }>
```

## Error Handling

Throws subclasses of APIError on failure:  
BadRequestError(400), AuthenticationError(401), PermissionDeniedError(403), NotFoundError(404), UnprocessableEntityError(422), RateLimitError(429), InternalServerError(>=500), APIConnectionError

Error object properties:
- request_id: string
- status: number
- name: string
- headers: Record<string,string>

## Retries

Default retries: 2 for connection errors, 408,409,429,>=500.  
Override with maxRetries option globally or per-request.

## Timeouts

Default timeout: 600000 ms.  
Override with timeout option globally or per-request.  
On timeout throws APIConnectionTimeoutError.

## Request IDs

All responses include _request_id from x-request-id header.  
Use .withResponse() to retrieve raw Response and request_id.

## Auto-pagination

List methods return pages with data: T[] and methods hasNextPage(), getNextPage().  
Use for await...of to iterate all items.

## Realtime API (Beta)

```typescript
new OpenAIRealtimeWebSocket({ model: string })
rt.on('response.text.delta', (event: { delta: string }) => {})
```

## Azure OpenAI

```typescript
new AzureOpenAI({ azureADTokenProvider: TokenProvider, apiVersion: string })
openai.chat.completions.create({ model: string; messages: [...] })
```

## Advanced Usage

### Raw Response Access

- .asResponse(): returns raw fetch Response
- .withResponse(): returns { data, response }

### Undocumented Requests

- client.get(path: string, options)
- client.post(path: string, { body, query, headers })

### Environment Shims

- import 'openai/shims/web' to use global fetch in Node
- import 'openai/shims/node' to force node-fetch polyfill

### Logging and Middleware

Pass fetch override to OpenAI constructor to intercept requests and responses.  
Set DEBUG=true for automatic logging.

### HTTP Agent Configuration

Pass httpAgent: Agent globally or per-request to customize TCP/TLS behavior.

## Requirements

- TypeScript >=4.5
- Node.js >=18 LTS
- Deno >=1.28.0
- Bun >=1.0
- Cloudflare Workers
- Vercel Edge Runtime
- Jest >=28 (node env)
- Nitro >=2.6
- Browsers (dangerouslyAllowBrowser must be true)


## Attribution
- Source: OpenAI Node.js SDK Reference
- URL: https://github.com/openai/openai-node
- License: License if known
- Crawl Date: 2025-05-17T22:38:07.723Z
- Data Size: 642645 bytes
- Links Found: 5192

## Retrieved
2025-05-17
