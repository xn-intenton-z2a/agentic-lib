# OPENAI_NODE_SDK

## Crawl Summary
- Installation via npm, deno, JSR with exact commands
- Client constructor options: apiKey, maxRetries, timeout, fetch, httpAgent, dangerouslyAllowBrowser
- Responses API: create signature, params, response fields
- Chat Completions API: create signature, params, response fields
- Streaming support: SSE event object, AsyncIterable return
- File uploads: supported file types, FilesCreateParams signature
- Error classes: APIError subclasses mapped to status codes, APIConnectionTimeoutError
- Retry policy: default retries, backoff, configurable via maxRetries
- Timeouts: default 600000ms, configurable via timeout, timeout error type
- Request IDs: _request_id field, .withResponse() method
- Auto-pagination: PagedResult<T>, async iteration and manual pagination
- Realtime API Beta: WebSocket signature and events
- Azure OpenAI: AzureOpenAI constructor, azureADTokenProvider, apiVersion
- Advanced usage: raw response access, undocumented endpoints/params, fetch customization, HTTP agent
- Browser support flag: dangerouslyAllowBrowser requirement and risks
- Supported runtimes: TS>=4.5, Node>=18, Deno>=1.28, Bun>=1.0, Workers, Edge, Jest, Nitro

## Normalised Extract
Table of Contents
1 Installation
2 Client Initialization
3 Responses API
4 Chat Completions API
5 Streaming Responses
6 File Uploads
7 Error Handling
8 Retries and Backoff
9 Timeouts
10 Request IDs
11 Auto-Pagination
12 Realtime API Beta
13 Azure OpenAI
14 Advanced Usage
15 Browser Support
16 Requirements

1 Installation
  Commands:
    npm install openai
    deno add jsr:@openai/openai
    npx jsr add @openai/openai

2 Client Initialization
  new OpenAI({
    apiKey?:string,         default process.env.OPENAI_API_KEY
    maxRetries?:number,     default 2
    timeout?:number,        default 600000
    fetch?:(url,init)=>Promise<Response>
    httpAgent?:http.Agent|HttpsProxyAgent
    dangerouslyAllowBrowser?:boolean default false
  })
  new AzureOpenAI({
    azureADTokenProvider:()=>Promise<string>
    apiVersion:string       e.g. "2024-10-01-preview"
  })

3 Responses API
  Method: client.responses.create
  Params:{ model:string; instructions?:string; input:string; stream?:boolean }
  Options:{ maxRetries?:number; timeout?:number; httpAgent?:http.Agent }
  Returns:Promise<{ output_text:string; _request_id:string }>

4 Chat Completions API
  Method: client.chat.completions.create
  Params:{ model:string; messages:{role:'system'|'user'|'assistant'|'developer';content:string}[]; stream?:boolean }
  Returns:Promise<{ choices:{message:{role:string;content:string}}[]; _request_id:string }>

5 Streaming Responses
  Call create with stream:true
  Returns AsyncIterable<{ type:string; data:string; id?:string }>

6 File Uploads
  Method: client.files.create
  Params:{ file:ReadStream|File|Response|ReturnType<typeof toFile>; purpose:'fine-tune' }

7 Error Handling
  Throws subclasses of OpenAI.APIError:
    BadRequestError(400), AuthenticationError(401), PermissionDeniedError(403), NotFoundError(404), UnprocessableEntityError(422), RateLimitError(429), InternalServerError(>=500), APIConnectionError
  Timeout throws APIConnectionTimeoutError

8 Retries and Backoff
  Default maxRetries=2
  Retries on network errors, 408,409,429,>=500
  Override via maxRetries

9 Timeouts
  Default timeout=600000
  Override via timeout
  Throws APIConnectionTimeoutError

10 Request IDs
  Responses include _request_id from x-request-id
  .withResponse() returns { data, request_id, response }

11 Auto-Pagination
  List methods return PagedResult<T> with .data[], .hasNextPage(), .getNextPage()
  Async iteration across pages

12 Realtime API Beta
  import { OpenAIRealtimeWebSocket } from 'openai/beta/realtime/websocket'
  new OpenAIRealtimeWebSocket({ model:string })
  on('response.text.delta', callback)

13 Azure OpenAI
  import { AzureOpenAI } from 'openai'
  new AzureOpenAI({ azureADTokenProvider, apiVersion })

14 Advanced Usage
  .asResponse(), .withResponse()
  client.get/post for undocumented endpoints
  ts-ignore extra params

15 Browser Support
  dangerouslyAllowBrowser:true to enable
  exposes secret key risks

16 Requirements
  TS>=4.5, Node>=18, Deno>=1.28, Bun>=1.0, Cloudflare Workers, Vercel Edge, Jest28(node), Nitro>=2.6

## Supplementary Details
- maxRetries default 2, set to 0 to disable retry
- timeout default 600000 ms, minimum 1000 ms recommended
- exponential backoff initial delay 100 ms, multiplier 2, max jitter 50 ms
- SSE event field schema: { type:string, data:string, id?:string }
- File upload helper toFile(input: Buffer|Uint8Array, filename: string): Promise<FileObject>
- APIError properties: request_id:string, status:number, name:string, headers: Record<string,string>
- PagedResult<T>: { data:T[]; hasNextPage():boolean; getNextPage():Promise<PagedResult<T>> }
- .withResponse() signature: APIPromise<T>.withResponse(): Promise<{ data:T; response: Response; request_id:string }>
- HTTP agent reuse TCP keepAlive default true
- to use proxy: new HttpsProxyAgent(process.env.PROXY_URL)
- fetch override logs request and response when DEBUG=true


## Reference Details
- client.responses.create
  Path: POST /v1/responses
  Params interface ResponsesCreateParams {
    model: string;
    instructions?: string;
    input: string;
    stream?: boolean;
  }
  Returns JSON { output_text: string; _request_id: string }
  Throws APIError subclasses, APIConnectionError, APIConnectionTimeoutError

- client.chat.completions.create
  Path: POST /v1/chat/completions
  Params interface ChatCompletionsCreateParams {
    model: string;
    messages: { role: 'system'|'user'|'assistant'|'developer'; content: string }[];
    stream?: boolean;
  }
  Returns JSON { choices: { message: { role: string; content: string } }[]; _request_id:string }

- client.files.create
  Path: POST /v1/files
  Params interface FilesCreateParams {
    file: ReadStream | File | Response | FileObject;
    purpose: 'fine-tune';
  }
  Returns { id: string; object: 'file'; bytes: number; created_at: number; filename: string; purpose: string; _request_id:string }

- Error codes mapping:
  400 => BadRequestError
  401 => AuthenticationError
  403 => PermissionDeniedError
  404 => NotFoundError
  422 => UnprocessableEntityError
  429 => RateLimitError
  >=500 => InternalServerError
  network => APIConnectionError

- Code example: Catching errors
  try {
    await client.fineTuning.jobs.create({ model, training_file });
  } catch (err) {
    if (err instanceof OpenAI.APIError) {
      console.log(err.request_id, err.status, err.name, err.headers);
    }
  }

- Retry configuration
  Global: new OpenAI({ maxRetries: 0 })
  Per-request: client.chat.completions.create(params, { maxRetries: 5 })

- Timeout configuration
  Global: new OpenAI({ timeout: 20000 })
  Per-request: client.chat.completions.create(params, { timeout: 5000 })

- Streaming example
  const stream = await client.responses.create({ model, input, stream:true });
  for await (const ev of stream) { console.log(ev.data) }

- Auto-pagination example
  async function fetchAllJobs() {
    const result = [];
    for await (const job of client.fineTuning.jobs.list({ limit:20 })) result.push(job);
    return result;
  }

- Realtime WebSocket
  const rt = new OpenAIRealtimeWebSocket({ model });
  rt.on('response.text.delta', e => process.stdout.write(e.delta));

- Azure example
  const openai = new AzureOpenAI({ azureADTokenProvider, apiVersion });
  await openai.chat.completions.create({ model, messages });

- Fetch override
  new OpenAI({ fetch: async (url,init) => { console.log(url); return fetch(url,init); } });

- HTTP agent override
  new OpenAI({ httpAgent: new HttpsProxyAgent(PROXY_URL) });
  client.models.list({ httpAgent: new http.Agent({ keepAlive:false }) });

- Browser support
  new OpenAI({ dangerouslyAllowBrowser: true });

- Troubleshooting CLI
  npx jsr add @openai/openai
  Expected import OpenAI from 'jsr:@openai/openai';

- Requirements enforcement
  TS>=4.5, Node>=18, Deno>=1.28, Bun>=1.0, Workers, Edge


## Information Dense Extract
install:npm install openai|deno add jsr:@openai/openai|npx jsr add @openai/openai;init:new OpenAI({apiKey?,maxRetries=2,timeout=600000,fetch?,httpAgent?,dangerouslyAllowBrowser=false});responses.create(params:{model,input,instructions?,stream?},options?):Promise<{output_text, _request_id}>;chat.completions.create(params:{model,messages[],stream?},options?):Promise<{choices[{message:{role,content}}],_request_id}>;stream: AsyncIterable<{type,data,id?}>;files.create({file:ReadStream|File|Response|toFile, purpose:'fine-tune'});errors:APIError subclasses per status;retry default2 configurable;timeout default600000ms configurable;withResponse()=>{data,request_id,response};pagination: for await or .hasNextPage();realtime: OpenAIRealtimeWebSocket({model}).on('response.text.delta');Azure: new AzureOpenAI({azureADTokenProvider,apiVersion});custom:req via client.get/post;fetch override;httpAgent override;browser:dangerouslyAllowBrowser;requirements:TS>=4.5,Node>=18,Deno>=1.28,Bun>=1.0,Workers,Edge

## Sanitised Extract
Table of Contents
1 Installation
2 Client Initialization
3 Responses API
4 Chat Completions API
5 Streaming Responses
6 File Uploads
7 Error Handling
8 Retries and Backoff
9 Timeouts
10 Request IDs
11 Auto-Pagination
12 Realtime API Beta
13 Azure OpenAI
14 Advanced Usage
15 Browser Support
16 Requirements

1 Installation
  Commands:
    npm install openai
    deno add jsr:@openai/openai
    npx jsr add @openai/openai

2 Client Initialization
  new OpenAI({
    apiKey?:string,         default process.env.OPENAI_API_KEY
    maxRetries?:number,     default 2
    timeout?:number,        default 600000
    fetch?:(url,init)=>Promise<Response>
    httpAgent?:http.Agent|HttpsProxyAgent
    dangerouslyAllowBrowser?:boolean default false
  })
  new AzureOpenAI({
    azureADTokenProvider:()=>Promise<string>
    apiVersion:string       e.g. '2024-10-01-preview'
  })

3 Responses API
  Method: client.responses.create
  Params:{ model:string; instructions?:string; input:string; stream?:boolean }
  Options:{ maxRetries?:number; timeout?:number; httpAgent?:http.Agent }
  Returns:Promise<{ output_text:string; _request_id:string }>

4 Chat Completions API
  Method: client.chat.completions.create
  Params:{ model:string; messages:{role:'system'|'user'|'assistant'|'developer';content:string}[]; stream?:boolean }
  Returns:Promise<{ choices:{message:{role:string;content:string}}[]; _request_id:string }>

5 Streaming Responses
  Call create with stream:true
  Returns AsyncIterable<{ type:string; data:string; id?:string }>

6 File Uploads
  Method: client.files.create
  Params:{ file:ReadStream|File|Response|ReturnType<typeof toFile>; purpose:'fine-tune' }

7 Error Handling
  Throws subclasses of OpenAI.APIError:
    BadRequestError(400), AuthenticationError(401), PermissionDeniedError(403), NotFoundError(404), UnprocessableEntityError(422), RateLimitError(429), InternalServerError(>=500), APIConnectionError
  Timeout throws APIConnectionTimeoutError

8 Retries and Backoff
  Default maxRetries=2
  Retries on network errors, 408,409,429,>=500
  Override via maxRetries

9 Timeouts
  Default timeout=600000
  Override via timeout
  Throws APIConnectionTimeoutError

10 Request IDs
  Responses include _request_id from x-request-id
  .withResponse() returns { data, request_id, response }

11 Auto-Pagination
  List methods return PagedResult<T> with .data[], .hasNextPage(), .getNextPage()
  Async iteration across pages

12 Realtime API Beta
  import { OpenAIRealtimeWebSocket } from 'openai/beta/realtime/websocket'
  new OpenAIRealtimeWebSocket({ model:string })
  on('response.text.delta', callback)

13 Azure OpenAI
  import { AzureOpenAI } from 'openai'
  new AzureOpenAI({ azureADTokenProvider, apiVersion })

14 Advanced Usage
  .asResponse(), .withResponse()
  client.get/post for undocumented endpoints
  ts-ignore extra params

15 Browser Support
  dangerouslyAllowBrowser:true to enable
  exposes secret key risks

16 Requirements
  TS>=4.5, Node>=18, Deno>=1.28, Bun>=1.0, Cloudflare Workers, Vercel Edge, Jest28(node), Nitro>=2.6

## Original Source
OpenAI Node.js SDK Reference
https://github.com/openai/openai-node

## Digest of OPENAI_NODE_SDK

# OPENAI Node.js SDK Detailed Digest - 2024-06-14

# Installation

- npm install openai
- deno add jsr:@openai/openai
- npx jsr add @openai/openai

# Client Initialization

Exact constructor signature:

```ts
import OpenAI, { AzureOpenAI } from 'openai';
import { getBearerTokenProvider, DefaultAzureCredential } from '@azure/identity';

new OpenAI({
  apiKey?: string         // default from OPENAI_API_KEY env
  maxRetries?: number     // default 2, retriable errors: network, 408, 409, 429, 5xx
  timeout?: number        // default 600000 ms (10m)
  fetch?: (url: RequestInfo, init?: RequestInit) => Promise<Response>
  httpAgent?: http.Agent | HttpsProxyAgent
  dangerouslyAllowBrowser?: boolean // default false
});

new AzureOpenAI({
  azureADTokenProvider: () => Promise<string>
  apiVersion: string      // e.g. "2024-10-01-preview"
});
```

# Responses API

create(params, options?) => Promise<ResponsesCreateResponse>

Signature:

```ts
interface ResponsesCreateParams {
  model: string;
  instructions?: string;
  input: string;
  stream?: boolean;
}

interface ResponsesCreateResponse {
  output_text: string;
  _request_id: string;
}

client.responses.create(
  params: ResponsesCreateParams,
  options?: { maxRetries?: number; timeout?: number; httpAgent?: http.Agent }
): Promise<ResponsesCreateResponse>;
``` 

# Chat Completions API

create(params, options?) => Promise<ChatCompletionsCreateResponse>

```ts
interface ChatCompletionsCreateParams {
  model: string;
  messages: { role: 'system'|'user'|'assistant'|'developer'; content: string }[];
  stream?: boolean;
}

interface ChatCompletionChoice {
  message: { role: string; content: string };
}

interface ChatCompletionsCreateResponse {
  choices: ChatCompletionChoice[];
  _request_id: string;
}

client.chat.completions.create(
  params: ChatCompletionsCreateParams,
  options?: { maxRetries?: number; timeout?: number; httpAgent?: http.Agent }
): Promise<ChatCompletionsCreateResponse>;
```

# Streaming Responses

- SSE event object fields: `type: string`, `data: string`, `id?: string`
- Return type: `AsyncIterable<{ type: string; data: string; id?: string }>`

```ts
const stream = await client.responses.create({ model, input, stream: true });
for await (const event of stream) {
  console.log(event.type, event.data);
}
```

# File Uploads

Supported file types:
- Node fs.ReadStream
- Web File
- fetch Response
- toFile(helper) output

```ts
interface FilesCreateParams {
  file: ReadStream | File | Response | ReturnType<typeof toFile>;
  purpose: 'fine-tune';
}

client.files.create({ file: fs.createReadStream('input.jsonl'), purpose: 'fine-tune' });
client.files.create({ file: new File(['bytes'], 'input.jsonl'), purpose: 'fine-tune' });
client.files.create({ file: await fetch(url), purpose: 'fine-tune' });
client.files.create({ file: await toFile(Buffer.from(...), 'input.jsonl'), purpose: 'fine-tune' });
``` 

# Error Handling

Thrown exceptions:
- APIError base
- subclasses by status code mapping:
  400 BadRequestError
  401 AuthenticationError
  403 PermissionDeniedError
  404 NotFoundError
  422 UnprocessableEntityError
  429 RateLimitError
  >=500 InternalServerError
  network/APIConnectionError
  APIConnectionTimeoutError (on timeout)

```ts
try {
  await client.fineTuning.jobs.create({ model, training_file });
} catch (err) {
  if (err instanceof OpenAI.APIError) {
    console.log(err.request_id, err.status, err.name, err.headers);
  }
}
```

# Retries

- Default maxRetries = 2
- Retries on: network errors, 408, 409, 429, >=500
- Exposed option: `maxRetries` global or per-request

# Timeouts

- Default timeout = 600000 ms
- Exposed option: `timeout` global or per-request
- On timeout throws `APIConnectionTimeoutError`

# Request IDs

- All responses include `_request_id` from `x-request-id`
- `.withResponse()` returns `{ data, request_id, response }`

# Auto-Pagination

- List methods return `PagedResult<T>` with `.data`, `.hasNextPage()`, `.getNextPage()`
- Async iteration across pages

# Realtime API Beta

```ts
import { OpenAIRealtimeWebSocket } from 'openai/beta/realtime/websocket';
const rt = new OpenAIRealtimeWebSocket({ model: 'gpt-4o-realtime-preview-2024-12-17' });
rt.on('response.text.delta', event => process.stdout.write(event.delta));
```

# Azure OpenAI

```ts
import { AzureOpenAI } from 'openai';
const openai = new AzureOpenAI({ azureADTokenProvider, apiVersion: '2024-10-01-preview' });
await openai.chat.completions.create({ model, messages });
```

# Advanced Usage

- `.asResponse()`, `.withResponse()` for raw Fetch Response
- Undocumented requests: `client.get`, `client.post`, pass extra params
- Fetch client customization via `fetch` option
- HTTP(S) agent via `httpAgent`

# Browser Support

- Default disabled
- `dangerouslyAllowBrowser: true` to enable

# Requirements

- TypeScript >=4.5
- Node.js >=18, Deno >=1.28.0, Bun >=1.0, Cloudflare Workers, Vercel Edge, Jest 28 (node env), Nitro v2.6+, browsers with caution

# Attribution and Crawl Data

Source: https://github.com/openai/openai-node
Data Size: 666371 bytes
Links Found: 5282
Error: None

## Attribution
- Source: OpenAI Node.js SDK Reference
- URL: https://github.com/openai/openai-node
- License: License if known
- Crawl Date: 2025-05-18T03:38:51.855Z
- Data Size: 666371 bytes
- Links Found: 5282

## Retrieved
2025-05-18
