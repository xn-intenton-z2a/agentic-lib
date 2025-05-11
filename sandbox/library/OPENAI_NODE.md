# OPENAI_NODE

## Crawl Summary
Installation commands, client constructor options (apiKey, maxRetries, timeout, httpAgent, fetch, dangerouslyAllowBrowser), method signatures for responses.create, chat.completions.create, files.create, fineTuning.jobs.create/list, streaming SSE, error types with HTTP status mapping, retry/timeout defaults and overrides, auto-pagination pattern, AzureOpenAI init, HTTP agent customization, supported runtimes.

## Normalised Extract
Table of Contents
1. Installation
2. Client Initialization
3. API Method Signatures
  3.1 responses.create
  3.2 chat.completions.create
  3.3 files.create
  3.4 fineTuning.jobs.create
  3.5 fineTuning.jobs.list
4. Streaming Responses
5. Error Handling
6. Retry & Timeout Configuration
7. Auto-pagination
8. Azure Integration
9. HTTP Agent & Fetch Overrides
10. Requirements & Runtimes

1. Installation
npm install openai
deno add jsr:@openai/openai
npx jsr add @openai/openai

2. Client Initialization
OpenAI({ apiKey:string, maxRetries?:number, timeout?:number, httpAgent?:Agent, fetch?:(url,init)=>Promise<Response>, dangerouslyAllowBrowser?:boolean })

3. API Method Signatures
3.1 responses.create
params: { model:string, input?:string, instructions?:string, stream?:boolean, user?:string, suffix?:string }
options: { maxRetries?:number, timeout?:number, httpAgent?:Agent }
returns: Promise<{ output_text:string, _request_id:string }> or AsyncIterable<SSE.Event>

3.2 chat.completions.create
params: { model:string, messages:Array<{ role:'system'|'developer'|'user'|'assistant'; content:string }>, temperature?:number, top_p?:number, n?:number, stream?:boolean, stop?:string|string[], max_tokens?:number, presence_penalty?:number, frequency_penalty?:number, logit_bias?:Record<string,number>, user?:string }
options: { maxRetries?:number, timeout?:number, httpAgent?:Agent }
returns: Promise<{ choices:Array<{ message:{ role:string; content:string }; finish_reason:string }>, _request_id:string }> or AsyncIterable<SSE.Event>

3.3 files.create
params: { file:File|Response|fs.ReadStream|{ path:string; data:Buffer }, purpose:'fine-tune' }
options: { maxRetries?:number, timeout?:number }
returns: Promise<{ id:string, object:string, bytes:number, created_at:number, filename:string, purpose:string, _request_id:string }>

3.4 fineTuning.jobs.create
params: { model:string, training_file:string, validation_file?:string, n_epochs?:number, batch_size?:number, learning_rate_multiplier?:number, use_packing?:boolean, prompt_loss_weight?:number, compute_classification_metrics?:boolean, classification_n_classes?:number, classification_positive_class?:string, classification_betas?:[number,number] }
returns: Promise<{ id:string, status:string, model:string, created_at:number, fine_tuned_model:string, hyperparams:any, _request_id:string }>

3.5 fineTuning.jobs.list
params: { limit?:number, page?:number }
returns: Promise<{ data:any[]; hasNextPage():boolean; getNextPage():Promise<this>; _request_id:string }>

4. Streaming Responses
const stream=await client.responses.create({ model, input, stream:true }); for await(event of stream){ /* event:{ id?:string, data:string, event?:string, retry?:number } */ }

5. Error Handling
Err subclass APIError for non-2xx. Map: 400 BadRequestError, 401 AuthenticationError, 403 PermissionDeniedError, 404 NotFoundError, 422 UnprocessableEntityError, 429 RateLimitError, >=500 InternalServerError, N/A APIConnectionError. err properties: request_id:string, status:number, name:string, headers:Record<string,string>

6. Retry & Timeout Configuration
Default retries:2 on connection errors,408,409,429,>=500. Default timeout:600000ms. Options at client or per-request via maxRetries, timeout. Timeout throws APIConnectionTimeoutError; follows retry policy.

7. Auto-pagination
for await(item of client.fineTuning.jobs.list({ limit:20 })){ /* accumulate items */ }

8. Azure Integration
AzureOpenAI({ azureADTokenProvider:TokenProvider, apiVersion:string }) ; use chat.completions.create same signature

9. HTTP Agent & Fetch Overrides
client=new OpenAI({ httpAgent: Agent, fetch:async(url,init)=>Response }); per-request httpAgent override

10. Requirements & Runtimes
Node.js>=18, TS>=4.5, Deno>=1.28, Bun>=1.0; Cloudflare Workers, Vercel Edge, Nitro>=2.6, Jest>=28; browser only if dangerouslyAllowBrowser:true

## Supplementary Details
Default Options
 maxRetries:2
 timeout:600000ms (10 minutes)
Retry Behavior
 retriableErrors: ['ECONNRESET','ENOTFOUND','ETIMEDOUT','EPIPE','ECONNREFUSED','ESOCKETTIMEDOUT','EHOSTUNREACH','EAI_AGAIN']
 HTTP codes:408,409,429,>=500
Exponential Backoff: base=100ms, cap=1000ms, factor=2, jitter:50%
Streaming SSE
 Event format: { id?:string; event?:string; data:string; retry?:number }
 Handlers: third-party libraries or built-in AsyncIterable
File Upload Helpers
 toFile(data:Buffer|Uint8Array, filename:string): Promise<{ path:string; data:Buffer }>
Agent Configuration
 httpAgent: instance of http.Agent or https.Agent
 fetch: following signature matches Web Fetch
Azure Token Provider
 azureADTokenProvider: (scopes:string[])->Promise<string>
dangerouslyAllowBrowser
 boolean, default:false, must be explicitly true to enable browser support

## Reference Details
// Full Method Signatures with Types

// OpenAI Client Constructor
declare class OpenAI {
  constructor(options?: {
    apiKey?: string;
    baseURL?: string;
    maxRetries?: number;
    timeout?: number;
    httpAgent?: http.Agent | https.Agent;
    fetch?: (url: RequestInfo, init?: RequestInit) => Promise<Response>;
    dangerouslyAllowBrowser?: boolean;
  });

  responses: {
    create(
      params: {
        model: string;
        input?: string;
        instructions?: string;
        stream?: boolean;
        user?: string;
        suffix?: string;
      },
      options?: { maxRetries?: number; timeout?: number; httpAgent?: http.Agent | https.Agent }
    ): Promise<{ output_text: string; _request_id: string }>
      | Promise<AsyncIterable<{ id?: string; event?: string; data: string; retry?: number }>>;
  }

  chat: {
    completions: {
      create(
        params: {
          model: string;
          messages: Array<{ role: 'system' | 'developer' | 'user' | 'assistant'; content: string }>;
          temperature?: number;
          top_p?: number;
          n?: number;
          stream?: boolean;
          stop?: string | string[];
          max_tokens?: number;
          presence_penalty?: number;
          frequency_penalty?: number;
          logit_bias?: Record<string, number>;
          user?: string;
        },
        options?: { maxRetries?: number; timeout?: number; httpAgent?: http.Agent | https.Agent }
      ): Promise<{
        choices: Array<{ message: { role: string; content: string }; finish_reason: string }>;
        _request_id: string;
      }> | Promise<AsyncIterable<{ id?: string; event?: string; data: string; retry?: number }>>;
    };
  };

  files: {
    create(
      params: { file: File | Response | fs.ReadStream | { path: string; data: Buffer }; purpose: 'fine-tune' },
      options?: { maxRetries?: number; timeout?: number }
    ): Promise<{
      id: string;
      object: string;
      bytes: number;
      created_at: number;
      filename: string;
      purpose: string;
      _request_id: string;
    }>;
  };

  fineTuning: {
    jobs: {
      create(
        params: {
          model: string;
          training_file: string;
          validation_file?: string;
          n_epochs?: number;
          batch_size?: number;
          learning_rate_multiplier?: number;
          use_packing?: boolean;
          prompt_loss_weight?: number;
          compute_classification_metrics?: boolean;
          classification_n_classes?: number;
          classification_positive_class?: string;
          classification_betas?: [number, number];
        },
        options?: { maxRetries?: number; timeout?: number }
      ): Promise<{
        id: string;
        status: string;
        model: string;
        created_at: number;
        fine_tuned_model: string;
        hyperparams: Record<string, unknown>;
        _request_id: string;
      }>;

      list(
        params: { limit?: number; page?: number },
        options?: { maxRetries?: number; timeout?: number }
      ): Promise<{
        data: Array<Record<string, unknown>>;
        hasNextPage(): boolean;
        getNextPage(): Promise<any>;
        _request_id: string;
      }>;
    };
  };

  // Generic HTTP methods
  get(path: string, options?: { query?: Record<string, unknown>; headers?: Record<string, string>; body?: Record<string, unknown> }): Promise<any>;
  post(path: string, options?: { query?: Record<string, unknown>; headers?: Record<string, string>; body?: Record<string, unknown> }): Promise<any>;
  patch(path: string, options?: { query?: Record<string, unknown>; headers?: Record<string, string>; body?: Record<string, unknown> }): Promise<any>;
  delete(path: string, options?: { query?: Record<string, unknown>; headers?: Record<string, string> }): Promise<any>;
}

// Best Practices Examples

// Configure client with proxy:
import { HttpsProxyAgent } from 'https-proxy-agent';
const client = new OpenAI({ httpAgent: new HttpsProxyAgent(process.env.PROXY_URL), maxRetries: 3, timeout: 30000 });

// Streaming chat:
(async () => {
  const stream = await client.chat.completions.create({ model: 'gpt-4o', messages: [{ role: 'user', content: 'Hello' }], stream: true });
  for await (const chunk of stream) process.stdout.write(chunk.data);
})();

// Troubleshooting

// Check request ID and headers:
(async () => {
  const { data, response } = await client.responses.create({ model: 'gpt-4o', input: 'test' }).withResponse();
  console.log(response.status, response.headers.get('x-request-id'));
})();

// On TIMEOUT:
// Throws APIConnectionTimeoutError, retried twice.

// On RATE LIMIT:
// Throws RateLimitError; default retry twice with exponential backoff.


## Information Dense Extract
openai-node: install npm install openai | deno add jsr:@openai/openai. init OpenAI({apiKey:string(default env),maxRetries:2,timeout:600000,httpAgent,fetch,dangerouslyAllowBrowser}). responses.create(params:{model,input?,instructions?,stream?,user?,suffix?},options)->Promise<{output_text,_request_id}>|AsyncIterable<SSE.Event>. chat.completions.create(params:{model,messages:[{role,content}],temperature?,top_p?,n?,stream?,stop?,max_tokens?,presence_penalty?,frequency_penalty?,logit_bias?,user?},options)->Promise<{choices:[{message:{role,content},finish_reason}],_request_id}>|AsyncIterable<SSE.Event>. files.create({file:File|Response|fs.ReadStream|{path,data},purpose:'fine-tune'},options)->Promise<{id,object,bytes,created_at,filename,purpose,_request_id}>. fineTuning.jobs.create({model,training_file,validation_file?,n_epochs?,batch_size?,learning_rate_multiplier?,use_packing?,prompt_loss_weight?,compute_classification_metrics?,classification_n_classes?,classification_positive_class?,classification_betas?},options)->Promise<{id,status,model,created_at,fine_tuned_model,hyperparams,_request_id}>. list({limit?,page?},options)->Promise<{data[],hasNextPage(),getNextPage(),_request_id}>. errors: HTTP map 400->BadRequestError,401->AuthenticationError,403->PermissionDeniedError,404->NotFoundError,422->UnprocessableEntityError,429->RateLimitError,>=500->InternalServerError,N/A->APIConnectionError. default retry 2 on network,408,409,429,>=500; timeout=600000ms throws APIConnectionTimeoutError, retried. SSE event:{id?,event?,data,retry?}. auto-pagination: for await item of client.fineTuning.jobs.list({limit}). azure: AzureOpenAI({azureADTokenProvider,apiVersion}). override httpAgent per-request. requirements: Node>=18,TS>=4.5,Deno>=1.28,Bun>=1.0,Cloudflare,Edge,Nitro>=2.6,Jest>=28, browser if dangerouslyAllowBrowser=true.

## Sanitised Extract
Table of Contents
1. Installation
2. Client Initialization
3. API Method Signatures
  3.1 responses.create
  3.2 chat.completions.create
  3.3 files.create
  3.4 fineTuning.jobs.create
  3.5 fineTuning.jobs.list
4. Streaming Responses
5. Error Handling
6. Retry & Timeout Configuration
7. Auto-pagination
8. Azure Integration
9. HTTP Agent & Fetch Overrides
10. Requirements & Runtimes

1. Installation
npm install openai
deno add jsr:@openai/openai
npx jsr add @openai/openai

2. Client Initialization
OpenAI({ apiKey:string, maxRetries?:number, timeout?:number, httpAgent?:Agent, fetch?:(url,init)=>Promise<Response>, dangerouslyAllowBrowser?:boolean })

3. API Method Signatures
3.1 responses.create
params: { model:string, input?:string, instructions?:string, stream?:boolean, user?:string, suffix?:string }
options: { maxRetries?:number, timeout?:number, httpAgent?:Agent }
returns: Promise<{ output_text:string, _request_id:string }> or AsyncIterable<SSE.Event>

3.2 chat.completions.create
params: { model:string, messages:Array<{ role:'system'|'developer'|'user'|'assistant'; content:string }>, temperature?:number, top_p?:number, n?:number, stream?:boolean, stop?:string|string[], max_tokens?:number, presence_penalty?:number, frequency_penalty?:number, logit_bias?:Record<string,number>, user?:string }
options: { maxRetries?:number, timeout?:number, httpAgent?:Agent }
returns: Promise<{ choices:Array<{ message:{ role:string; content:string }; finish_reason:string }>, _request_id:string }> or AsyncIterable<SSE.Event>

3.3 files.create
params: { file:File|Response|fs.ReadStream|{ path:string; data:Buffer }, purpose:'fine-tune' }
options: { maxRetries?:number, timeout?:number }
returns: Promise<{ id:string, object:string, bytes:number, created_at:number, filename:string, purpose:string, _request_id:string }>

3.4 fineTuning.jobs.create
params: { model:string, training_file:string, validation_file?:string, n_epochs?:number, batch_size?:number, learning_rate_multiplier?:number, use_packing?:boolean, prompt_loss_weight?:number, compute_classification_metrics?:boolean, classification_n_classes?:number, classification_positive_class?:string, classification_betas?:[number,number] }
returns: Promise<{ id:string, status:string, model:string, created_at:number, fine_tuned_model:string, hyperparams:any, _request_id:string }>

3.5 fineTuning.jobs.list
params: { limit?:number, page?:number }
returns: Promise<{ data:any[]; hasNextPage():boolean; getNextPage():Promise<this>; _request_id:string }>

4. Streaming Responses
const stream=await client.responses.create({ model, input, stream:true }); for await(event of stream){ /* event:{ id?:string, data:string, event?:string, retry?:number } */ }

5. Error Handling
Err subclass APIError for non-2xx. Map: 400 BadRequestError, 401 AuthenticationError, 403 PermissionDeniedError, 404 NotFoundError, 422 UnprocessableEntityError, 429 RateLimitError, >=500 InternalServerError, N/A APIConnectionError. err properties: request_id:string, status:number, name:string, headers:Record<string,string>

6. Retry & Timeout Configuration
Default retries:2 on connection errors,408,409,429,>=500. Default timeout:600000ms. Options at client or per-request via maxRetries, timeout. Timeout throws APIConnectionTimeoutError; follows retry policy.

7. Auto-pagination
for await(item of client.fineTuning.jobs.list({ limit:20 })){ /* accumulate items */ }

8. Azure Integration
AzureOpenAI({ azureADTokenProvider:TokenProvider, apiVersion:string }) ; use chat.completions.create same signature

9. HTTP Agent & Fetch Overrides
client=new OpenAI({ httpAgent: Agent, fetch:async(url,init)=>Response }); per-request httpAgent override

10. Requirements & Runtimes
Node.js>=18, TS>=4.5, Deno>=1.28, Bun>=1.0; Cloudflare Workers, Vercel Edge, Nitro>=2.6, Jest>=28; browser only if dangerouslyAllowBrowser:true

## Original Source
OpenAI Node.js Client
https://github.com/openai/openai-node

## Digest of OPENAI_NODE

# OpenAI Node.js Client Library Detailed Technical Specifications (Retrieved on 2024-06-11)

## Installation

### npm
```bash
npm install openai
```

### JSR (Deno)
```bash
deno add jsr:@openai/openai
npx jsr add @openai/openai
```

## Client Initialization

```ts
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: string,               // default: process.env.OPENAI_API_KEY
  maxRetries?: number,          // default: 2
  timeout?: number,             // default: 600000 (10 minutes)
  httpAgent?: Agent,            // node http(s) agent
  fetch?: (url: RequestInfo, init?: RequestInit) => Promise<Response>,
  dangerouslyAllowBrowser?: boolean,
});
```

## API Methods

### Responses API

```ts
responses.create(
  params: {
    model: string;
    input?: string;
    instructions?: string;
    stream?: boolean;
    user?: string;
    suffix?: string;
  },
  options?: { maxRetries?: number; timeout?: number; httpAgent?: Agent }
): Promise<{ output_text: string; _request_id: string } | AsyncIterable<SSE.Event>>
```

### Chat Completions API

```ts
chat.completions.create(
  params: {
    model: string;
    messages: Array<{ role: 'system'|'developer'|'user'|'assistant'; content: string }>;
    temperature?: number;
    top_p?: number;
    n?: number;
    stream?: boolean;
    stop?: string | string[];
    max_tokens?: number;
    presence_penalty?: number;
    frequency_penalty?: number;
    logit_bias?: Record<string, number>;
    user?: string;
  },
  options?: { maxRetries?: number; timeout?: number; httpAgent?: Agent }
): Promise<{ choices: Array<{ message: { role: string; content: string }; finish_reason: string }> ; _request_id: string } | AsyncIterable<SSE.Event>>
```

### Files API

```ts
files.create(
  params: { file: File|Response|fs.ReadStream|{ path: string; data: Buffer }; purpose: 'fine-tune' },
  options?: { maxRetries?: number; timeout?: number }
): Promise<{ id: string; object: string; bytes: number; created_at: number; filename: string; purpose: string; _request_id: string }>
```

### Fine-tuning Jobs API

```ts
fineTuning.jobs.create(
  params: { model: string; training_file: string; validation_file?: string; n_epochs?: number; batch_size?: number; learning_rate_multiplier?: number; use_packing?: boolean; prompt_loss_weight?: number; compute_classification_metrics?: boolean; classification_n_classes?: number; classification_positive_class?: string; classification_betas?: [number,number] },
  options?: { maxRetries?: number; timeout?: number }
): Promise<{ id: string; status: string; model: string; created_at: number; fine_tuned_model: string; hyperparams: any; _request_id: string }>

fineTuning.jobs.list(
  params: { limit?: number; page?: number },
  options?: { maxRetries?: number; timeout?: number }
): Promise<{ data: any[]; hasNextPage(): boolean; getNextPage(): Promise<this>; _request_id: string }>
```

## Streaming Responses (SSE)

```ts
const stream = await client.responses.create({ model, input, stream: true });
for await (const event of stream) {
  // event: { id?: string; data: string; event?: string; retry?: number }
}
```

## Error Handling

All non-2xx HTTP responses throw subclass of APIError:

| Status Code | Error Type               |
|------------:|--------------------------|
| 400         | BadRequestError          |
| 401         | AuthenticationError      |
| 403         | PermissionDeniedError    |
| 404         | NotFoundError            |
| 422         | UnprocessableEntityError |
| 429         | RateLimitError           |
| >=500       | InternalServerError      |
| N/A         | APIConnectionError       |

```ts
try {
  const result = await client.fineTuning.jobs.create({ model: 'gpt-4o', training_file: 'file-abc123' });
} catch (err) {
  if (err instanceof OpenAI.APIError) {
    const { request_id, status, name, headers } = err;
  } else throw err;
}
```

## Retry and Timeout Configuration

- Default retries: 2 (on network errors, 408, 409, 429, >=500)
- Override default or per-request via `maxRetries`.
- Default timeout: 600000 ms; override via `timeout`.
- Timeout throws `APIConnectionTimeoutError` and is retried according to retry policy.

## Auto-pagination

```ts
async function fetchAllJobs() {
  const jobs: any[] = [];
  for await (const job of client.fineTuning.jobs.list({ limit: 20 })) {
    jobs.push(job);
  }
  return jobs;
}
```

## Azure Integration

```ts
import { AzureOpenAI } from 'openai';
import { getBearerTokenProvider, DefaultAzureCredential } from '@azure/identity';

const openai = new AzureOpenAI({ azureADTokenProvider: getBearerTokenProvider(new DefaultAzureCredential(), 'https://cognitiveservices.azure.com/.default'), apiVersion: string });
```

## HTTP Agent & Fetch Overrides

```ts
import http from 'http';
import { HttpsProxyAgent } from 'https-proxy-agent';

const client = new OpenAI({
  httpAgent: new HttpsProxyAgent(process.env.PROXY_URL),
});

await client.models.list({ limit: 10 }, { httpAgent: new http.Agent({ keepAlive: false }) });
```

## Requirements

- Node.js 18 LTS+
- TypeScript >=4.5
- Deno >=1.28.0
- Bun >=1.0

## Runtimes
- Cloudflare Workers, Vercel Edge, Nitro v2.6+, Jest 28+, Web (dangerouslyAllowBrowser)


## Attribution
- Source: OpenAI Node.js Client
- URL: https://github.com/openai/openai-node
- License: License: MIT License
- Crawl Date: 2025-05-11T09:57:44.272Z
- Data Size: 733137 bytes
- Links Found: 5377

## Retrieved
2025-05-11
