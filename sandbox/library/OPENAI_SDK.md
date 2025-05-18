# OPENAI_SDK

## Crawl Summary
Installation via npm or JSR; client constructor supports apiKey, maxRetries, timeout, httpAgent, fetch, dangerouslyAllowBrowser, azureADTokenProvider, apiVersion. Core methods: responses.create and chat.completions.create with streaming support. File uploads accept fs.ReadStream, File, fetch Response, Buffer/Uint8Array via toFile. Errors throw APIError subclasses mapped by status code. Default retries=2 for connection, timeout, conflict, rate limit, server errors. Default timeout=600000ms; override global or per-request. All responses include _request_id or withResponse(). Auto-pagination via async iterable. Realtime API via OpenAIRealtimeWebSocket. Azure integration using AzureOpenAI with DefaultAzureCredential. Advanced: raw response with .asResponse(), undocumented endpoints via client.get/post, custom fetch, logging DEBUG, HTTP agent for proxies. Requirements: TS>=4.5, Node>=18, Deno>=1.28, Bun>=1.0, Cloudflare Workers, Vercel Edge, Jest28+, Nitro>=2.6, browser support opt-in.

## Normalised Extract
Table of Contents
1. Installation and Imports
2. Client Initialization Options
3. Text Generation (Responses API)
4. Chat Completions API
5. Streaming with SSE
6. File Upload Patterns
7. Error Handling and Status Mapping
8. Retry Strategy and Configuration
9. Timeout Configuration
10. Request ID Extraction
11. Auto-pagination Patterns
12. Realtime WebSocket API
13. Azure OpenAI Integration
14. Raw Response Access
15. Custom HTTP Requests
16. Client Fetch Middleware
17. Logging and Debugging
18. HTTP/S Agent Configuration
19. Semantic Versioning Guidelines
20. Runtime Requirements

1. Installation and Imports
- npm install openai
- import OpenAI from 'openai'
- deno add jsr:@openai/openai or npx jsr add @openai/openai

2. Client Initialization Options
Constructor OpenAI({
  apiKey?: string;           // default from OPENAI_API_KEY
  maxRetries?: number;       // default 2
  timeout?: number;          // default 600000 ms
  httpAgent?: Agent;
  fetch?: (RequestInfo, RequestInit?) => Promise<Response>;
  dangerouslyAllowBrowser?: boolean;
  azureADTokenProvider?: TokenProvider;
  apiVersion?: string;
});

3. Text Generation (Responses API)
Method: client.responses.create(params, options?)
Params:
  model: string
  instructions?: string
  input?: string
  stream?: boolean
Options:
  maxRetries?: number
  timeout?: number
  httpAgent?: Agent
  fetch?: function
Returns:
  Promise<{ output_text: string; _request_id: string }>
  or AsyncIterable<ServerSentEvent> if stream=true

4. Chat Completions API
Method: client.chat.completions.create(params, options?)
Params:
  model: string
  messages: Array<{ role: 'system'|'developer'|'user'|'assistant'; content: string }>
  stream?: boolean
Returns:
  Promise<{ choices: Array<{ message: { role: string; content: string } }>; _request_id: string }>
  or AsyncIterable<ServerSentEvent>

5. Streaming with SSE
- Set stream:true in create()
- Iterate AsyncIterable<ServerSentEvent>

6. File Upload Patterns
Method: client.files.create({ file, purpose })
file can be: fs.ReadStream | File | Response | toFile(Buffer,email) helper
purpose: string (e.g., 'fine-tune')

7. Error Handling and Status Mapping
Throws APIError subclasses with: request_id, status, name, headers
Mapping: 400 BadRequestError; 401 AuthenticationError; 403 PermissionDeniedError; 404 NotFoundError; 422 UnprocessableEntityError; 429 RateLimitError; >=500 InternalServerError; connection errors APIConnectionError

8. Retry Strategy and Configuration
Default retries: 2 for connection errors, 408,409,429,>=500
Override: global maxRetries in constructor or per-request in options

9. Timeout Configuration
Default: 600000 ms; global override in constructor; per-request override in options
On timeout: throws APIConnectionTimeoutError; still retried by default

10. Request ID Extraction
_All response objects include _request_id_
Use .withResponse() to destructure { data, request_id }

11. Auto-pagination Patterns
Use for await…of on list() methods; or manual via page.hasNextPage() and page.getNextPage()

12. Realtime WebSocket API
Import OpenAIRealtimeWebSocket from 'openai/beta/realtime/websocket'
Constructor: new OpenAIRealtimeWebSocket({ model: string })
Events: 'response.text.delta'

13. Azure OpenAI Integration
Import AzureOpenAI; require azureADTokenProvider, apiVersion
auth via DefaultAzureCredential + getBearerTokenProvider

14. Raw Response Access
Use .asResponse() or .withResponse() to access fetch Response headers and statusText

15. Custom HTTP Requests
Use client.get/post/put/delete('/path', { body, query, headers })

16. Client Fetch Middleware
Pass fetch override in constructor to log/modify requests

17. Logging and Debugging
Set DEBUG=true to log all requests and responses automatically

18. HTTP/S Agent Configuration
Pass httpAgent in constructor or per-request; supports proxies (HttpsProxyAgent)

19. Semantic Versioning Guidelines
Follows SemVer; minor may include type-only or internal changes

20. Runtime Requirements
TypeScript>=4.5; Node >=18; Deno>=1.28; Bun>=1.0; Cloudflare Workers; Vercel Edge; Jest>=28; Nitro>=2.6; Browser support opt-in


## Supplementary Details
Client Constructor Options
- apiKey: default pull from environment variable OPENAI_API_KEY if not provided
- maxRetries: number of retry attempts, default 2; affects connection errors, HTTP 408,409,429,>=500
- timeout: request timeout in milliseconds; default 600000 ms
- httpAgent: instance of http.Agent or https.Agent for TCP keepAlive or custom proxy
- fetch: custom fetch implementation signature (url: RequestInfo, init?: RequestInit) => Promise<Response>
- dangerouslyAllowBrowser: boolean, default false, enables browser runtime support
- azureADTokenProvider: provider function for Azure AD tokens when using AzureOpenAI
- apiVersion: string such as '2024-10-01-preview' for AzureOpenAI

File Upload Parameters
- purpose: 'fine-tune' | 'answers' | 'search' | ... (OpenAI file purpose list)
- file: fs.ReadStream | web File | fetch.Response | toFile(buffer|Uint8Array, filename)

ServerSentEvent Object Properties
- event: string
- id?: string
- data: string

Error Classes and Properties
Class OpenAI.APIError extends Error
- request_id: string
- status: number
- name: string
- headers: Record<string,string>

Pagination Response Shape
ListResponse<T> {
  data: T[];
  hasNextPage(): boolean;
  getNextPage(): Promise<ListResponse<T>>;
}

Realtime WebSocket Events
'onresponse.text.delta': { delta: string }
'onresponse.audio.chunk': { audio_chunk: Blob }
'onresponse.function_call': { arguments: object }

AzureOpenAI vs OpenAI
- AzureOpenAI constructor _requires_ azureADTokenProvider and apiVersion
- Parameter shapes and return types nearly identical except base URL and auth

Error Handling Commands
- Use client.create(...).catch(err => { if(err instanceof OpenAI.APIError) console.log(err.request_id, err.status); })
- For CLI debugging, set DEBUG=true and inspect console logs


## Reference Details
OpenAI Class and Method Signatures

class OpenAI {
  constructor(options?: {
    apiKey?: string;
    maxRetries?: number;
    timeout?: number;
    httpAgent?: Agent;
    fetch?: (url: RequestInfo, init?: RequestInit) => Promise<Response>;
    dangerouslyAllowBrowser?: boolean;
  });

  responses: {
    create(params: {
      model: string;
      instructions?: string;
      input?: string;
      stream?: boolean;
    }, options?: {
      maxRetries?: number;
      timeout?: number;
      httpAgent?: Agent;
      fetch?: (url: RequestInfo, init?: RequestInit) => Promise<Response>;
    }): Promise<{ output_text: string; _request_id: string }> | AsyncIterable<ServerSentEvent>;
  };

  chat: {
    completions: {
      create(params: {
        model: string;
        messages: Array<{ role: 'system'|'developer'|'user'|'assistant'; content: string }>;
        stream?: boolean;
      }, options?: {
        maxRetries?: number;
        timeout?: number;
        httpAgent?: Agent;
        fetch?: (url: RequestInfo, init?: RequestInit) => Promise<Response>;
      }): Promise<{ choices: Array<{ message: { role: string; content: string } }>; _request_id: string }> | AsyncIterable<ServerSentEvent>;
    };
  };

  files: {
    create(params: { file: ReadStream|File|Response|Blob; purpose: 'fine-tune'|'answers'|'search'|'classifications'|'embeddings'; }, options?): Promise<{ id: string; object: string; bytes: number; created_at: number; purpose: string; filename: string }>;
  };

  fineTuning: {
    jobs: {
      create(params: { model: string; training_file: string; validation_file?: string; n_epochs?: number; batch_size?: number; learning_rate_multiplier?: number; prompt_loss_weight?: number; compute_classification_metrics?: boolean; classification_n_classes?: number; classification_positive_class?: string; classification_betas?: number[]; suffix?: string; }, options?): Promise<{ id: string; status: string; model: string; created_at: number }>;
      list(params: { limit?: number; }, options?): Promise<ListResponse<FineTuningJob>>;
    };
  };

  realtime: {
    websocket: typeof OpenAIRealtimeWebSocket;
  };

  get(path: string, options?: { query?: Record<string,any>; headers?: Record<string,string>; }): Promise<any>;
  post(path: string, options?: { body?: any; query?: Record<string,any>; headers?: Record<string,string>; }): Promise<any>;

  static APIError: typeof APIError;
  static APIConnectionError: typeof APIConnectionError;
  static APIConnectionTimeoutError: typeof APIConnectionTimeoutError;
}

ApiError Classes:
class APIError extends Error { request_id: string; status: number; headers: Record<string,string>; }
class APIConnectionError extends APIError {}
class APIConnectionTimeoutError extends APIError {}
// Specific HTTP errors:
class BadRequestError extends APIError {}
class AuthenticationError extends APIError {}
class PermissionDeniedError extends APIError {}
class NotFoundError extends APIError {}
class UnprocessableEntityError extends APIError {}
class RateLimitError extends APIError {}
class InternalServerError extends APIError {}

ServerSentEvent Interface:
interface ServerSentEvent { event: string; id?: string; data: string; }

Example Full Implementation Pattern:
1. Install: npm install openai
2. Import: import OpenAI, { toFile } from 'openai';
3. Initialize:
   const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, maxRetries: 3, timeout: 30000 });
4. Generate text:
   const { output_text, _request_id } = await client.responses.create({ model: 'gpt-4o', input: 'Hello' });
5. Handle errors:
   .catch(err => { if(err instanceof OpenAI.APIError) console.error(err.name, err.request_id); });
6. Upload file:
   await client.files.create({ file: await toFile(Uint8Array, 'data.jsonl'), purpose: 'fine-tune' });
7. Stream:
   for await(const ev of await client.responses.create({ model:'gpt-4o', input:'...', stream:true })) console.log(ev.data);
8. Paginate:
   for await(const job of client.fineTuning.jobs.list({ limit: 50 })) console.log(job.id);
9. Azure use-case:
   const azure = new AzureOpenAI({ azureADTokenProvider:provider, apiVersion:'2024-10-01-preview' });
   const res = await azure.chat.completions.create({ model:'gpt-4o', messages:[{role:'user',content:'Hi'}] });

Troubleshooting Commands:
- Set DEBUG=true to log requests: export DEBUG=true && node script.js
- Enable browser support: new OpenAI({ dangerouslyAllowBrowser: true })
- Use HTTP proxy: new OpenAI({ httpAgent: new HttpsProxyAgent(PROXY_URL) })
- If type errors: import 'openai/shims/web' before any import from 'openai'

Configuration Options Summary:
{
  apiKey: string;
  maxRetries: number;
  timeout: number;
  httpAgent: Agent;
  fetch: Function;
  dangerouslyAllowBrowser: boolean;
  azureADTokenProvider: Function;
  apiVersion: string;
}


## Information Dense Extract
OpenAI SDK: npm install openai; import OpenAI from 'openai'; constructor({apiKey?,maxRetries=2,timeout=600000,httpAgent?,fetch?,dangerouslyAllowBrowser=false});
responses.create({model:string,instructions?,input?,stream?},opts?)=>Promise<{output_text:string,_request_id:string}>|AsyncIterable<SSE>;
chat.completions.create({model:string,messages:Array<{role,content}>,stream?},opts?)=>Promise<{choices:Array<{message:{role,content}}>,_request_id:string}>|AsyncIterable<SSE>;
client.files.create({file:ReadStream|File|Response|toFile(buffer,name),purpose:'fine-tune'|'answers'|'search'|'classifications'|'embeddings'});
Errors: APIError subclasses with request_id,status,name,headers; map 400-429-5xx; connection errors retry; timeout=>APIConnectionTimeoutError; default retries=2; override via maxRetries global or per-request; override timeout global or per-request; all responses include _request_id or via .withResponse(); auto-pagination with for await or page.hasNextPage(); Realtime via OpenAIRealtimeWebSocket({model}); Azure: new AzureOpenAI({azureADTokenProvider,apiVersion}); Advanced: .asResponse(), client.get/post, custom fetch, DEBUG=true logging, httpAgent for proxies; shim imports for fetch behavior; TS>=4.5, Node>=18, Deno>=1.28, Bun>=1.0, Cloudflare, Vercel Edge, Jest>=28, Nitro>=2.6; browser support with dangerouslyAllowBrowser:true.

## Sanitised Extract
Table of Contents
1. Installation and Imports
2. Client Initialization Options
3. Text Generation (Responses API)
4. Chat Completions API
5. Streaming with SSE
6. File Upload Patterns
7. Error Handling and Status Mapping
8. Retry Strategy and Configuration
9. Timeout Configuration
10. Request ID Extraction
11. Auto-pagination Patterns
12. Realtime WebSocket API
13. Azure OpenAI Integration
14. Raw Response Access
15. Custom HTTP Requests
16. Client Fetch Middleware
17. Logging and Debugging
18. HTTP/S Agent Configuration
19. Semantic Versioning Guidelines
20. Runtime Requirements

1. Installation and Imports
- npm install openai
- import OpenAI from 'openai'
- deno add jsr:@openai/openai or npx jsr add @openai/openai

2. Client Initialization Options
Constructor OpenAI({
  apiKey?: string;           // default from OPENAI_API_KEY
  maxRetries?: number;       // default 2
  timeout?: number;          // default 600000 ms
  httpAgent?: Agent;
  fetch?: (RequestInfo, RequestInit?) => Promise<Response>;
  dangerouslyAllowBrowser?: boolean;
  azureADTokenProvider?: TokenProvider;
  apiVersion?: string;
});

3. Text Generation (Responses API)
Method: client.responses.create(params, options?)
Params:
  model: string
  instructions?: string
  input?: string
  stream?: boolean
Options:
  maxRetries?: number
  timeout?: number
  httpAgent?: Agent
  fetch?: function
Returns:
  Promise<{ output_text: string; _request_id: string }>
  or AsyncIterable<ServerSentEvent> if stream=true

4. Chat Completions API
Method: client.chat.completions.create(params, options?)
Params:
  model: string
  messages: Array<{ role: 'system'|'developer'|'user'|'assistant'; content: string }>
  stream?: boolean
Returns:
  Promise<{ choices: Array<{ message: { role: string; content: string } }>; _request_id: string }>
  or AsyncIterable<ServerSentEvent>

5. Streaming with SSE
- Set stream:true in create()
- Iterate AsyncIterable<ServerSentEvent>

6. File Upload Patterns
Method: client.files.create({ file, purpose })
file can be: fs.ReadStream | File | Response | toFile(Buffer,email) helper
purpose: string (e.g., 'fine-tune')

7. Error Handling and Status Mapping
Throws APIError subclasses with: request_id, status, name, headers
Mapping: 400 BadRequestError; 401 AuthenticationError; 403 PermissionDeniedError; 404 NotFoundError; 422 UnprocessableEntityError; 429 RateLimitError; >=500 InternalServerError; connection errors APIConnectionError

8. Retry Strategy and Configuration
Default retries: 2 for connection errors, 408,409,429,>=500
Override: global maxRetries in constructor or per-request in options

9. Timeout Configuration
Default: 600000 ms; global override in constructor; per-request override in options
On timeout: throws APIConnectionTimeoutError; still retried by default

10. Request ID Extraction
_All response objects include _request_id_
Use .withResponse() to destructure { data, request_id }

11. Auto-pagination Patterns
Use for awaitof on list() methods; or manual via page.hasNextPage() and page.getNextPage()

12. Realtime WebSocket API
Import OpenAIRealtimeWebSocket from 'openai/beta/realtime/websocket'
Constructor: new OpenAIRealtimeWebSocket({ model: string })
Events: 'response.text.delta'

13. Azure OpenAI Integration
Import AzureOpenAI; require azureADTokenProvider, apiVersion
auth via DefaultAzureCredential + getBearerTokenProvider

14. Raw Response Access
Use .asResponse() or .withResponse() to access fetch Response headers and statusText

15. Custom HTTP Requests
Use client.get/post/put/delete('/path', { body, query, headers })

16. Client Fetch Middleware
Pass fetch override in constructor to log/modify requests

17. Logging and Debugging
Set DEBUG=true to log all requests and responses automatically

18. HTTP/S Agent Configuration
Pass httpAgent in constructor or per-request; supports proxies (HttpsProxyAgent)

19. Semantic Versioning Guidelines
Follows SemVer; minor may include type-only or internal changes

20. Runtime Requirements
TypeScript>=4.5; Node >=18; Deno>=1.28; Bun>=1.0; Cloudflare Workers; Vercel Edge; Jest>=28; Nitro>=2.6; Browser support opt-in

## Original Source
OpenAI Node.js SDK Reference
https://github.com/openai/openai-node

## Digest of OPENAI_SDK

# Installation

npm install openai

deno add jsr:@openai/openai
npx jsr add @openai/openai

# Initialization

```typescript
import OpenAI from 'openai';
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // default
  maxRetries: 2,                      // default
  timeout: 600000,                    // default 10 minutes
});
```

# Responses API (Text Generation)

```typescript
const response = await client.responses.create({
  model: 'gpt-4o',
  instructions: 'You are a coding assistant that talks like a pirate',
  input: 'Are semicolons optional in JavaScript?',
});
console.log(response.output_text);
```

Signature:
```
responses.create(params: {
  model: string;
  instructions?: string;
  input?: string;
  stream?: boolean;
}, options?: {
  maxRetries?: number;
  timeout?: number;
  httpAgent?: Agent;
  fetch?: (url: RequestInfo, init?: RequestInit) => Promise<Response>;
}): Promise<{
  output_text: string;
  _request_id: string;
} | AsyncIterable<ServerSentEvent>>
```

# Chat Completions API

```typescript
const completion = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'developer', content: 'Talk like a pirate.' },
    { role: 'user', content: 'Are semicolons optional in JavaScript?' }
  ],
});
console.log(completion.choices[0].message.content);
```

Signature:
```
chat.completions.create(params: {
  model: string;
  messages: Array<{ role: 'system'|'developer'|'user'|'assistant'; content: string }>;
  stream?: boolean;
}, options?): Promise<{
  choices: Array<{ message: { role: string; content: string } }>;
  _request_id: string;
} | AsyncIterable<ServerSentEvent>>
```

# Streaming (SSE)

```typescript
const stream = await client.responses.create({ model: 'gpt-4o', input: 'Say Sheep sleep deep ten times fast!', stream: true });
for await (const event of stream) console.log(event);
```

# File Uploads

Supported inputs for `client.files.create({ file, purpose })`:
- fs.ReadStream
- web File
- fetch Response
- Buffer/Uint8Array via toFile helper

```typescript
await client.files.create({ file: fs.createReadStream('input.jsonl'), purpose: 'fine-tune' });
await client.files.create({ file: await toFile(Buffer.from('data'), 'file.jsonl'), purpose: 'fine-tune' });
```

# Error Handling

Throws subclasses of APIError with properties:
- request_id: string
- status: number
- name: string
- headers: Record<string,string>

Error to class mapping:
```
400 => BadRequestError
401 => AuthenticationError
403 => PermissionDeniedError
404 => NotFoundError
422 => UnprocessableEntityError
429 => RateLimitError
>=500 => InternalServerError
connection failures => APIConnectionError
```  

Example:
```typescript
try {
  await client.fineTuning.jobs.create({ model: 'gpt-4o', training_file: 'file-abc' });
} catch (err) {
  if (err instanceof OpenAI.APIError) {
    console.log(err.request_id, err.status, err.name, err.headers);
  }
}
```

# Retries & Backoff

- Default: 2 retries on connection errors, 408, 409, 429, 5xx
- Configure globally: `new OpenAI({ maxRetries: 0 })`
- Per-request: `client.chat.completions.create(params, { maxRetries: 5 })`

# Timeouts

- Default timeout: 600000ms
- Configure: `new OpenAI({ timeout: 20000 })`
- Per-request: `...create(params, { timeout: 5000 })`
- On timeout throws: APIConnectionTimeoutError

# Request IDs

- All response objects include `_request_id` from header `x-request-id`
- With `.withResponse()`:
```typescript
const { data, request_id } = await client.responses.create({ ... }, { stream: false }).withResponse();
```

# Auto-pagination

```typescript
const jobs = [];
for await (const job of client.fineTuning.jobs.list({ limit: 20 })) jobs.push(job);
```

Manual:
```typescript
let page = await client.fineTuning.jobs.list({ limit: 20 });
page.data.forEach(j => console.log(j));
while (page.hasNextPage()) { page = await page.getNextPage(); }
```

# Realtime API Beta

```typescript
import { OpenAIRealtimeWebSocket } from 'openai/beta/realtime/websocket';
const rt = new OpenAIRealtimeWebSocket({ model: 'gpt-4o-realtime-preview-2024-12-17' });
rt.on('response.text.delta', e => process.stdout.write(e.delta));
```

# Microsoft Azure OpenAI

```typescript
import { AzureOpenAI } from 'openai';
import { DefaultAzureCredential, getBearerTokenProvider } from '@azure/identity';
const provider = getBearerTokenProvider(new DefaultAzureCredential(), 'https://cognitiveservices.azure.com/.default');
const azure = new AzureOpenAI({ azureADTokenProvider: provider, apiVersion: '2024-10-01-preview' });
const result = await azure.chat.completions.create({ model: 'gpt-4o', messages: [{ role: 'user', content: 'Say hello!' }] });
```

# Advanced Usage

## Raw Response

```typescript
const raw = await client.responses.create({ model: 'gpt-4o', input: 'test' }).asResponse();
console.log(raw.headers.get('X-My-Header'), raw.statusText);
```

## Undocumented Requests

```typescript
await client.post('/some/path', { body: { foo:'bar' }, query:{baz:'qux'} });
// with extra params use // @ts-expect-error
```

# Client Customization

```typescript
import { fetch } from 'undici';
const client = new OpenAI({
  fetch: async (url, init) => { console.log(url, init); const res = await fetch(url, init); console.log(res); return res; }
});
```

# Logging & Middleware

- DEBUG=true logs all requests/responses

# HTTP(S) Agent (Proxy)

```typescript
import http from 'http';
import { HttpsProxyAgent } from 'https-proxy-agent';
const client = new OpenAI({ httpAgent: new HttpsProxyAgent(process.env.PROXY_URL) });
await client.models.list({ httpAgent: new http.Agent({ keepAlive: false }) });
```

# Semantic Versioning

- Follows SemVer, occasional minor breaking changes

# Requirements

- TypeScript >=4.5
- Node.js >=18 LTS
- Deno >=1.28
- Bun >=1.0
- Cloudflare Workers, Vercel Edge, Jest28+, Nitro v2.6+, Web: disable by default (dangerouslyAllowBrowser:true)


## Attribution
- Source: OpenAI Node.js SDK Reference
- URL: https://github.com/openai/openai-node
- License: License if known
- Crawl Date: 2025-05-18T06:30:06.758Z
- Data Size: 626664 bytes
- Links Found: 4960

## Retrieved
2025-05-18
