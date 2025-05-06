# S3_SQS_BRIDGE

## Crawl Summary
s3-sqs-bridge integrates S3 object PUT events with SQS for versioned replay. It provides a Node.js Lambda handler that processes SQS records, validates payloads with Zod, inserts or upserts projections in PostgreSQL, applies exponential-backoff retry (PG_MAX_RETRIES = 3, PG_RETRY_DELAY_MS = 1000), logs with sensitive data masking, collects in-memory metrics (totalEvents, successfulEvents, skippedEvents, dbFailures, dbRetryCount, deadLetterEvents), supports an optional DEAD_LETTER_QUEUE_URL for failed records, exposes Express HTTP endpoints (/metrics, /status), and offers a CLI (--replay, --healthcheck, --metrics, --status-endpoint). Key environment variables configure AWS (BUCKET_NAME, OBJECT_PREFIX, REPLAY_QUEUE_URL, DIGEST_QUEUE_URL, AWS_ENDPOINT) and PostgreSQL (PG_CONNECTION_STRING, GITHUB_PROJECTIONS_TABLE, GITHUB_EVENT_QUEUE_URL).

## Normalised Extract
Table of Contents
1. Lambda Handler Configuration
2. Environment Variables and Defaults
3. PostgreSQL Retry Logic
4. Zod Schema Validation
5. Metrics Collection Interface
6. CLI Commands Implementation
7. HTTP Health and Metrics Endpoints

1. Lambda Handler Configuration
Signature:
  export async function handler(event: SQSEvent, context: Context): Promise<void>
Steps:
  1. Parse each record: JSON.parse(record.body)
  2. Validate with Zod schema
  3. Connect to Postgres using Client({ connectionString: process.env.PG_CONNECTION_STRING })
  4. Retry inserts/upserts via retryWithBackoff(fn)
  5. On failure after all retries, if DEAD_LETTER_QUEUE_URL set, send record to DLQ
  6. Update in-memory metrics
  7. Close DB connection

2. Environment Variables and Defaults
BUCKET_NAME      = required
OBJECT_PREFIX    = ""
REPLAY_QUEUE_URL = required
DIGEST_QUEUE_URL = required
AWS_ENDPOINT     = unset
PG_CONNECTION_STRING = postgres://user:pass@localhost:5432/db
GITHUB_PROJECTIONS_TABLE = github_event_projections
GITHUB_EVENT_QUEUE_URL   = https://test/000000000000/github-event-queue-test
PG_MAX_RETRIES    = 3
PG_RETRY_DELAY_MS = 1000
DEAD_LETTER_QUEUE_URL = optional

3. PostgreSQL Retry Logic
Function:
  async function retryWithBackoff<T>(fn: () => Promise<T>, retries = Number(process.env.PG_MAX_RETRIES), delay = Number(process.env.PG_RETRY_DELAY_MS)): Promise<T> {
    for (let i = 1; i <= retries; i++) {
      try { return await fn() } catch (err) {
        if (i === retries) throw err;
        await new Promise(r => setTimeout(r, delay * Math.pow(2, i - 1)));
      }
    }
  }

4. Zod Schema Validation
const GitHubEventSchema = z.object({
  action: z.string(),
  repository: z.object({ id: z.number(), full_name: z.string() }),
  sender: z.object({ id: z.number(), login: z.string() }),
  // extend with payload fields as needed
});
Usage:
  const event = GitHubEventSchema.parse(parsedBody);

5. Metrics Collection Interface
let metrics = {
  totalEvents: 0,
  successfulEvents: 0,
  skippedEvents: 0,
  dbFailures: 0,
  dbRetryCount: 0,
  deadLetterEvents: 0
};
export function getMetrics(): typeof metrics { return { ...metrics }; }

6. CLI Commands Implementation
Using yargs:
  yargs
    .option('source-projection', { type: 'boolean' })
    .option('replay', { type: 'boolean' })
    .option('healthcheck', { type: 'boolean' })
    .option('metrics', { type: 'boolean' })
    .option('status-endpoint', { type: 'boolean' })
    .argv;
Actions:
  if (argv['source-projection']) handler(...)
  if (argv.replay) replayAllObjects()

7. HTTP Health and Metrics Endpoints
const app = express();
app.get('/metrics', (_, res) => res.json(getMetrics()));
app.get('/status', (_, res) => res.status(200).send('OK'));
app.listen(process.env.STATUS_PORT || 3000);


## Supplementary Details
• Deployment: Use AWS CDK stack in aws/ directory: new S3SQSBridgeStack(app, 'BridgeStack', { bucketName: process.env.BUCKET_NAME, prefix: process.env.OBJECT_PREFIX, queueUrl: process.env.REPLAY_QUEUE_URL, deadLetterQueueUrl: process.env.DEAD_LETTER_QUEUE_URL });

• Environment setup:
  export BUCKET_NAME=my-bucket
  export PG_CONNECTION_STRING=postgres://user:password@host:5432/db
  export PG_MAX_RETRIES=5
  export PG_RETRY_DELAY_MS=2000
  export DEAD_LETTER_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/123456789012/my-dlq

• Local run:
  npm start                   # runs handler against dummy event
  npm run healthcheck         # starts /status on port 8080
  npm run metrics             # starts /metrics on port 3000
  npm run replay              # invokes replay sequence


## Reference Details
AWS Lambda SQS Event Handler Signature:
  import { SQSEvent, Context } from 'aws-lambda';
  export async function handler(event: SQSEvent, context: Context): Promise<void>;

PostgreSQL Client Instantiation (pg 8.x):
  import { Client, ClientConfig } from 'pg';
  const client = new Client({ connectionString: process.env.PG_CONNECTION_STRING });
  await client.connect();
  await client.query(text: string, values?: any[]): Promise<QueryResult>;
  await client.end();

retryWithBackoff API:
  async function retryWithBackoff<T>(fn: () => Promise<T>, retries?: number, delay?: number): Promise<T>;

Zod Schema API:
  import { z } from 'zod';
  const GitHubEventSchema: ZodObject<{ action: ZodString; repository: ZodObject<{ id: ZodNumber; full_name: ZodString }>; sender: ZodObject<{ id: ZodNumber; login: ZodString }>; }>; 
  const parsed = GitHubEventSchema.parse(input: unknown);

Metrics Interface:
  interface Metrics { totalEvents: number; successfulEvents: number; skippedEvents: number; dbFailures: number; dbRetryCount: number; deadLetterEvents: number; }
  export function getMetrics(): Metrics;

CLI Implementation (yargs 17.x):
  import yargs from 'yargs';
  yargs(process.argv.slice(2))
    .option('source-projection', { type: 'boolean', description: 'Process source S3 events' })
    .option('replay', { type: 'boolean', description: 'Replay all S3 object versions' })
    .option('healthcheck', { type: 'boolean', description: 'Start health check server' })
    .option('metrics', { type: 'boolean', description: 'Start metrics endpoint' })
    .option('status-endpoint', { type: 'boolean', description: 'Start status endpoint' })
    .parse();

Express Endpoints:
  import express from 'express';
  const app = express();
  app.get('/metrics', (req, res) => res.json(getMetrics()));
  app.get('/status', (req, res) => res.status(200).send('OK'));
  app.listen(port: number = Number(process.env.STATUS_PORT) || 3000);

Best Practices:
  • Mask sensitive info via logger.mask({ keyPattern: /(token|password)=\S+/g, mask: '****' });
  • Use exponential backoff for all DB operations
  • Validate all inputs strictly before DB writes

Troubleshooting:
  • Check DLQ messages: aws sqs receive-message --queue-url $DEAD_LETTER_QUEUE_URL --max-number-of-messages 10
  • Tail Lambda logs: aws logs tail /aws/lambda/$SOURCE_LAMBDA_FUNCTION_NAME --follow
  • Verify DB connectivity: psql "$PG_CONNECTION_STRING" -c '\dt'


## Information Dense Extract
s3-sqs-bridge: Lambda handler(event:SQSEvent):Promise<void> → for each record: parse JSON, GitHubEventSchema.parse(), replace sensitive via maskRegex, client=new Client({connectionString}), retryWithBackoff(() => client.query(upsert projection), PG_MAX_RETRIES=3, PG_RETRY_DELAY_MS=1000), on final failure sendToDLQ if DEAD_LETTER_QUEUE_URL, metrics counters. Env: PG_CONNECTION_STRING, GITHUB_PROJECTIONS_TABLE, PG_MAX_RETRIES, PG_RETRY_DELAY_MS, DEAD_LETTER_QUEUE_URL, BUCKET_NAME, REPLAY_QUEUE_URL. CLI: yargs opts: --source-projection, --replay, --healthcheck, --metrics, --status-endpoint. HTTP: express GET /metrics→getMetrics(), GET /status→200 OK. retryWithBackoff(fn,retries,delay) uses for-loop, exponential backoff delay*2^(i-1). getMetrics():Metrics. Troubleshooting: aws sqs receive-message, aws logs tail, psql connectivity check.

## Sanitised Extract
Table of Contents
1. Lambda Handler Configuration
2. Environment Variables and Defaults
3. PostgreSQL Retry Logic
4. Zod Schema Validation
5. Metrics Collection Interface
6. CLI Commands Implementation
7. HTTP Health and Metrics Endpoints

1. Lambda Handler Configuration
Signature:
  export async function handler(event: SQSEvent, context: Context): Promise<void>
Steps:
  1. Parse each record: JSON.parse(record.body)
  2. Validate with Zod schema
  3. Connect to Postgres using Client({ connectionString: process.env.PG_CONNECTION_STRING })
  4. Retry inserts/upserts via retryWithBackoff(fn)
  5. On failure after all retries, if DEAD_LETTER_QUEUE_URL set, send record to DLQ
  6. Update in-memory metrics
  7. Close DB connection

2. Environment Variables and Defaults
BUCKET_NAME      = required
OBJECT_PREFIX    = ''
REPLAY_QUEUE_URL = required
DIGEST_QUEUE_URL = required
AWS_ENDPOINT     = unset
PG_CONNECTION_STRING = postgres://user:pass@localhost:5432/db
GITHUB_PROJECTIONS_TABLE = github_event_projections
GITHUB_EVENT_QUEUE_URL   = https://test/000000000000/github-event-queue-test
PG_MAX_RETRIES    = 3
PG_RETRY_DELAY_MS = 1000
DEAD_LETTER_QUEUE_URL = optional

3. PostgreSQL Retry Logic
Function:
  async function retryWithBackoff<T>(fn: () => Promise<T>, retries = Number(process.env.PG_MAX_RETRIES), delay = Number(process.env.PG_RETRY_DELAY_MS)): Promise<T> {
    for (let i = 1; i <= retries; i++) {
      try { return await fn() } catch (err) {
        if (i === retries) throw err;
        await new Promise(r => setTimeout(r, delay * Math.pow(2, i - 1)));
      }
    }
  }

4. Zod Schema Validation
const GitHubEventSchema = z.object({
  action: z.string(),
  repository: z.object({ id: z.number(), full_name: z.string() }),
  sender: z.object({ id: z.number(), login: z.string() }),
  // extend with payload fields as needed
});
Usage:
  const event = GitHubEventSchema.parse(parsedBody);

5. Metrics Collection Interface
let metrics = {
  totalEvents: 0,
  successfulEvents: 0,
  skippedEvents: 0,
  dbFailures: 0,
  dbRetryCount: 0,
  deadLetterEvents: 0
};
export function getMetrics(): typeof metrics { return { ...metrics }; }

6. CLI Commands Implementation
Using yargs:
  yargs
    .option('source-projection', { type: 'boolean' })
    .option('replay', { type: 'boolean' })
    .option('healthcheck', { type: 'boolean' })
    .option('metrics', { type: 'boolean' })
    .option('status-endpoint', { type: 'boolean' })
    .argv;
Actions:
  if (argv['source-projection']) handler(...)
  if (argv.replay) replayAllObjects()

7. HTTP Health and Metrics Endpoints
const app = express();
app.get('/metrics', (_, res) => res.json(getMetrics()));
app.get('/status', (_, res) => res.status(200).send('OK'));
app.listen(process.env.STATUS_PORT || 3000);

## Original Source
@xn-intenton-z2a/s3-sqs-bridge
https://github.com/xn-intenton-z2a/s3-sqs-bridge

## Digest of S3_SQS_BRIDGE

# s3-sqs-bridge

Retrieved on: 2024-06-28
Data Size: 571299 bytes

## Features

### Dead-Letter Queue Support

When DEAD_LETTER_QUEUE_URL is set, records that fail validation or exhaust retry attempts are sent to the specified SQS dead-letter queue.

### Enhanced Retry Logic

• PG_MAX_RETRIES: 3 (default)  
• PG_RETRY_DELAY_MS: 1000 ms (default)  
• Exponential backoff: delay × 2^(attempt – 1)

### Strict Validation

• Uses Zod 3.x  
• Schema: GitHubEventSchema = z.object({ action: z.string(), repository: z.object({ id: z.number(), full_name: z.string() }), sender: z.object({ id: z.number(), login: z.string() }), ... })

### In-Memory Metrics

• totalEvents   
• successfulEvents   
• skippedEvents   
• dbFailures   
• dbRetryCount   
• deadLetterEvents  

### HTTP Endpoints

• GET /metrics → JSON metrics  
• GET /status → 200 OK

### CLI

• --help  
• --source-projection  
• --replay-projection  
• --replay  
• --healthcheck  
• --metrics  
• --status-endpoint

## Configuration

| Env Var                          | Default                                              | Description                                     |
|----------------------------------|------------------------------------------------------|-------------------------------------------------|
| BUCKET_NAME                      | (none)                                               | S3 bucket name                                  |
| OBJECT_PREFIX                    | ""                                                  | S3 object key prefix                            |
| REPLAY_QUEUE_URL                 | (none)                                               | SQS URL for replayed events                     |
| DIGEST_QUEUE_URL                 | (none)                                               | SQS URL for digest events                       |
| OFFSETS_TABLE_NAME               | "offsets"                                           | DynamoDB/Postgres table for offsets             |
| PROJECTIONS_TABLE_NAME           | "projections"                                       | Postgres table for projections                  |
| SOURCE_LAMBDA_FUNCTION_NAME      | (none)                                               | Lambda name                                     |
| AWS_ENDPOINT                     | (none)                                               | Custom AWS endpoint                             |
| PG_CONNECTION_STRING             | postgres://user:pass@localhost:5432/db               | Postgres connection URI                         |
| GITHUB_PROJECTIONS_TABLE         | github_event_projections                             | Postgres table for GitHub projections           |
| GITHUB_EVENT_QUEUE_URL           | https://test/000000000000/github-event-queue-test    | Default SQS URL for GitHub events               |
| PG_MAX_RETRIES                   | 3                                                    | Max DB retry attempts                           |
| PG_RETRY_DELAY_MS                | 1000                                                 | Delay between DB retries (ms)                   |
| DEAD_LETTER_QUEUE_URL            | (optional)                                           | SQS DLQ URL for failed projections              |


## Attribution
- Source: @xn-intenton-z2a/s3-sqs-bridge
- URL: https://github.com/xn-intenton-z2a/s3-sqs-bridge
- License: License: MIT
- Crawl Date: 2025-05-06T07:28:37.327Z
- Data Size: 571299 bytes
- Links Found: 4668

## Retrieved
2025-05-06
