# S3_SQS_BRIDGE

## Crawl Summary
s3-sqs-bridge integrates S3 PUT event routing to SQS and Lambda with versioned replay and PostgreSQL upsert projection. Uses Node.js handler with signature exports.handler(event:SQSEvent,context:Context):Promise<{statusCode:200}>. Configured via ENV vars: BUCKET_NAME, OBJECT_PREFIX, REPLAY_QUEUE_URL, DIGEST_QUEUE_URL, OFFSETS_TABLE_NAME, PROJECTIONS_TABLE_NAME, SOURCE_LAMBDA_FUNCTION_NAME, AWS_ENDPOINT; PG_CONNECTION_STRING, GITHUB_PROJECTIONS_TABLE, GITHUB_EVENT_QUEUE_URL; PG_MAX_RETRIES(3), PG_RETRY_DELAY_MS(1000), DEAD_LETTER_QUEUE_URL. Implements exponential backoff retry, Zod-based schema validation, in-memory metrics (totalEvents, successfulEvents, skippedEvents, dbFailures, dbRetryCount, deadLetterEvents), Express endpoints (/metrics, /status) on METRICS_PORT(3000), STATUS_PORT(3000). CLI via npm scripts: start, healthcheck, replay, test and flags --source-projection, --replay-projection, --replay, --healthcheck, --metrics, --status-endpoint.

## Normalised Extract
Table of Contents:
1 Lambda Handler Interface
2 Environment Variables and Defaults
3 PostgreSQL Retry Configuration
4 In-Memory Metrics
5 CLI Operations

1 Lambda Handler Interface
  Signature
    exports.handler(event:SQSEvent,context:Context):Promise<{statusCode:200}>
  Event Record Structure
    event.Records is array of { messageId:string, receiptHandle:string, body:string, messageAttributes:Record<string,any> }
  Returns
    { statusCode:200 } on success

2 Environment Variables and Defaults
  BUCKET_NAME           required            S3 bucket
  OBJECT_PREFIX         default ''         key prefix filter
  REPLAY_QUEUE_URL      required           SQS URL for replay
  DIGEST_QUEUE_URL      required           SQS URL for digest
  OFFSETS_TABLE_NAME    default 'offsets'   table for offsets
  PROJECTIONS_TABLE_NAME default 'projections' table for projections
  SOURCE_LAMBDA_FUNCTION_NAME required       Lambda function name
  AWS_ENDPOINT          optional           override AWS endpoint
  PG_CONNECTION_STRING  default 'postgres://user:pass@localhost:5432/db'
  GITHUB_PROJECTIONS_TABLE default 'github_event_projections'
  GITHUB_EVENT_QUEUE_URL default 'https://test/000000000000/github-event-queue-test'
  PG_MAX_RETRIES        default 3         max DB retries
  PG_RETRY_DELAY_MS     default 1000      ms between retries
  DEAD_LETTER_QUEUE_URL optional           SQS URL for DLQ
  METRICS_PORT          default 3000      HTTP metrics port
  STATUS_PORT           default 3000      HTTP status port

3 PostgreSQL Retry Configuration
  On connect/query failures do up to PG_MAX_RETRIES
  Delay between attempts = PG_RETRY_DELAY_MS ms (exponential backoff)

4 In-Memory Metrics
  Counters:
    totalEvents, successfulEvents, skippedEvents, dbFailures, dbRetryCount, deadLetterEvents
  Access
    getMetrics(): { totalEvents:number, successfulEvents:number, skippedEvents:number, dbFailures:number, dbRetryCount:number, deadLetterEvents:number }

5 CLI Operations
  npm start             runs src/lib/main.js
  npm run healthcheck   starts HTTP /status on STATUS_PORT
  npm run replay        replays S3 versions
  npm test              runs unit tests
  Flags:
    --help
    --source-projection
    --replay-projection
    --replay
    --healthcheck
    --metrics
    --status-endpoint

## Supplementary Details
Deployment Steps:
1 Configure AWS credentials via AWS CLI: aws configure
2 Deploy CDK stack:
   cd aws/cdk
   npm install
   npx cdk deploy --profile your-profile
3 Grant Lambda IAM permissions: SQS ReceiveMessage, SQS DeleteMessage, S3 GetObject, S3 ListBucket, RDS/PostgreSQL connect
4 Set environment variables in Lambda console or via CDK context
5 Ensure network access: Lambda VPC with subnet and SG allowing egress to RDS
6 Verify PostgreSQL schema:
   CREATE TABLE github_event_projections ( id SERIAL PRIMARY KEY, event_id TEXT UNIQUE, payload JSONB, created_at TIMESTAMPTZ DEFAULT now() );
7 For local run, use LocalStack endpoint: AWS_ENDPOINT=http://localhost:4566

Logging and Masking:
Use built-in logger:
logger.info({ eventId, repository }, 'Processing event')
Mask sensitive fields:
logger.mask('requestMetadata.password')

## Reference Details
AWS.SQS.sendMessage
Signature:
  sendMessage(params: {
    QueueUrl: string;
    MessageBody: string;
    MessageAttributes?: Record<string,{ DataType:string; StringValue:string }>;
    DelaySeconds?: number;
  }): Promise<{ MessageId: string; MD5OfMessageBody: string }>
Example:
  await sqs.sendMessage({ QueueUrl: process.env.REPLAY_QUEUE_URL, MessageBody: JSON.stringify(payload) })

PostgreSQL Connection with retry:
```js
import { Client } from 'pg';
async function connectWithRetry() {
  let attempts = 0;
  while (attempts < Number(process.env.PG_MAX_RETRIES)) {
    try {
      const client = new Client({ connectionString: process.env.PG_CONNECTION_STRING });
      await client.connect();
      return client;
    } catch (err) {
      attempts++;
      await new Promise(r => setTimeout(r, Number(process.env.PG_RETRY_DELAY_MS) * Math.pow(2, attempts -1)));
    }
  }
  throw new Error('PostgreSQL connection failed after retries');
}
```

Zod Validation:
```js
import { z } from 'zod';
const EventSchema = z.object({
  action: z.string(),
  repository: z.object({ id: z.number(), full_name: z.string() }),
  sender: z.object({ id: z.number(), login: z.string() }),
});
const event = EventSchema.parse(JSON.parse(record.body));
```

Express Endpoints:
```js
import express from 'express';
const app = express();
app.get('/metrics', (req,res) => res.json(getMetrics()));
app.get('/status', (req,res) => res.sendStatus(200));
app.listen(process.env.STATUS_PORT);
```

Best Practices:
- Validate input with Zod before DB operations
- Mask sensitive fields in logs
- Use exponential backoff for DB retries
- Route failed records to DLQ after retries

Troubleshooting:
1 View Lambda logs:
   aws logs tail /aws/lambda/SOURCE_LAMBDA_FUNCTION_NAME --follow
2 Test local handler:
   node -e "require('./src/lib/main').handler({ Records: [] }, {})"
   Expect { statusCode:200 }
3 Check SQS queue:
   aws sqs get-queue-attributes --queue-url REPLAY_QUEUE_URL --attribute-names ApproximateNumberOfMessages
4 Validate PostgreSQL connectivity:
   psql process.env.PG_CONNECTION_STRING -c '\dt'


## Information Dense Extract
handler(event:SQSEvent,context:Context):Promise<{statusCode:200}>
Env vars:BUCKET_NAME(required),OBJECT_PREFIX(default ''),REPLAY_QUEUE_URL, DIGEST_QUEUE_URL, OFFSETS_TABLE_NAME(default 'offsets'), PROJECTIONS_TABLE_NAME(default 'projections'), SOURCE_LAMBDA_FUNCTION_NAME, AWS_ENDPOINT, PG_CONNECTION_STRING(default 'postgres://user:pass@localhost:5432/db'), GITHUB_PROJECTIONS_TABLE(default 'github_event_projections'), GITHUB_EVENT_QUEUE_URL(default 'https://test/000000000000/github-event-queue-test'), PG_MAX_RETRIES(default 3), PG_RETRY_DELAY_MS(default 1000), DEAD_LETTER_QUEUE_URL, METRICS_PORT(default 3000), STATUS_PORT(default 3000)
Retry: exponential backoff, max attempts PG_MAX_RETRIES, base delay PG_RETRY_DELAY_MS
Metrics:getMetrics():{ totalEvents,successfulEvents,skippedEvents,dbFailures,dbRetryCount,deadLetterEvents }
AWS.SQS.sendMessage({QueueUrl,MessageBody,MessageAttributes?,DelaySeconds?}):Promise<{MessageId,MD5OfMessageBody}>
connectWithRetry():Client or throw
Zod schema: EventSchema.parse(JSON.parse(body))
CLI:npm start, npm run healthcheck, npm run replay, npm test; flags --source-projection,--replay-projection,--replay,--healthcheck,--metrics,--status-endpoint
Express endpoints: /metrics and /status on ports METRICS_PORT and STATUS_PORT
Troubleshoot: aws logs tail, psql -c '\dt', aws sqs get-queue-attributes

## Sanitised Extract
Table of Contents:
1 Lambda Handler Interface
2 Environment Variables and Defaults
3 PostgreSQL Retry Configuration
4 In-Memory Metrics
5 CLI Operations

1 Lambda Handler Interface
  Signature
    exports.handler(event:SQSEvent,context:Context):Promise<{statusCode:200}>
  Event Record Structure
    event.Records is array of { messageId:string, receiptHandle:string, body:string, messageAttributes:Record<string,any> }
  Returns
    { statusCode:200 } on success

2 Environment Variables and Defaults
  BUCKET_NAME           required            S3 bucket
  OBJECT_PREFIX         default ''         key prefix filter
  REPLAY_QUEUE_URL      required           SQS URL for replay
  DIGEST_QUEUE_URL      required           SQS URL for digest
  OFFSETS_TABLE_NAME    default 'offsets'   table for offsets
  PROJECTIONS_TABLE_NAME default 'projections' table for projections
  SOURCE_LAMBDA_FUNCTION_NAME required       Lambda function name
  AWS_ENDPOINT          optional           override AWS endpoint
  PG_CONNECTION_STRING  default 'postgres://user:pass@localhost:5432/db'
  GITHUB_PROJECTIONS_TABLE default 'github_event_projections'
  GITHUB_EVENT_QUEUE_URL default 'https://test/000000000000/github-event-queue-test'
  PG_MAX_RETRIES        default 3         max DB retries
  PG_RETRY_DELAY_MS     default 1000      ms between retries
  DEAD_LETTER_QUEUE_URL optional           SQS URL for DLQ
  METRICS_PORT          default 3000      HTTP metrics port
  STATUS_PORT           default 3000      HTTP status port

3 PostgreSQL Retry Configuration
  On connect/query failures do up to PG_MAX_RETRIES
  Delay between attempts = PG_RETRY_DELAY_MS ms (exponential backoff)

4 In-Memory Metrics
  Counters:
    totalEvents, successfulEvents, skippedEvents, dbFailures, dbRetryCount, deadLetterEvents
  Access
    getMetrics(): { totalEvents:number, successfulEvents:number, skippedEvents:number, dbFailures:number, dbRetryCount:number, deadLetterEvents:number }

5 CLI Operations
  npm start             runs src/lib/main.js
  npm run healthcheck   starts HTTP /status on STATUS_PORT
  npm run replay        replays S3 versions
  npm test              runs unit tests
  Flags:
    --help
    --source-projection
    --replay-projection
    --replay
    --healthcheck
    --metrics
    --status-endpoint

## Original Source
S3-SQS Bridge Middleware
https://github.com/xn-intenton-z2a/s3-sqs-bridge#readme

## Digest of S3_SQS_BRIDGE

# S3-SQS Bridge Middleware Detailed Digest
Retrieved on 2024-06-03
Data Size: 565681 bytes

## Architecture Overview

s3-sqs-bridge connects Amazon S3 PUT events to AWS SQS with versioned replay support and real-time processing via AWS Lambda and PostgreSQL:

- AWS S3 bucket with event notification to SQS (standard queue or FIFO).
- AWS SQS queue forwarding to Lambda handler.
- Lambda (Node.js) processes SQSEvent (github event payloads).
- PostgreSQL projection table for upserts with retry and exponential backoff.
- In-memory metrics and Express HTTP endpoints for /metrics and /status.
- Optional Dead-Letter Queue routing on failure.

## Lambda Handler Signature

```js
// src/lib/main.js
exports.handler = async function(event, context) {
  // event: { Records: Array<{ body: string; messageAttributes: Record<string, any>; }> }
  // context: AWS Lambda Context object
  // returns: Promise<{ statusCode: 200 }>
}
```

## Configuration Variables

Environment variables and defaults:

BUCKET_NAME               (required)          S3 bucket name
OBJECT_PREFIX             (default empty)     S3 key prefix filter
REPLAY_QUEUE_URL          (required)          SQS URL for replay operations
DIGEST_QUEUE_URL          (required)          SQS URL for digest operations
OFFSETS_TABLE_NAME        (default: offsets)  DynamoDB/PostgreSQL offsets table
PROJECTIONS_TABLE_NAME    (default: projections) PostgreSQL projections table
SOURCE_LAMBDA_FUNCTION_NAME (required)        Name of source Lambda
AWS_ENDPOINT              (optional)          Custom AWS endpoint

PostgreSQL:
PG_CONNECTION_STRING      (default: postgres://user:pass@localhost:5432/db)
GITHUB_PROJECTIONS_TABLE  (default: github_event_projections)
GITHUB_EVENT_QUEUE_URL    (default: https://test/000000000000/github-event-queue-test)

Retry:
PG_MAX_RETRIES            (default: 3)
PG_RETRY_DELAY_MS         (default: 1000)

Dead-Letter:
DEAD_LETTER_QUEUE_URL     (optional)

Metrics HTTP ports:
METRICS_PORT              (default: 3000)
STATUS_PORT               (default: 3000)

## Retry Logic

- Exponential backoff on PostgreSQL connect/query:
  - Retries: PG_MAX_RETRIES
  - Delay: PG_RETRY_DELAY_MS ms

## Metrics Collection

In-memory counters:
- totalEvents
- successfulEvents
- skippedEvents
- dbFailures
- dbRetryCount
- deadLetterEvents

Interface:
```js
const metrics = getMetrics()
// returns { totalEvents: number, successfulEvents: number, skippedEvents: number, dbFailures: number, dbRetryCount: number, deadLetterEvents: number }
```

## CLI Commands

npm scripts and CLI flags:

- npm start                  Run Lambda handler (src/lib/main.js)
- npm run healthcheck         Start /status server on STATUS_PORT
- npm run replay              Replay S3 versions
- npm test                    Run Vitest tests

Flags:
--help
--source-projection
--replay-projection
--replay
--healthcheck
--metrics
--status-endpoint

## Attribution
- Source: S3-SQS Bridge Middleware
- URL: https://github.com/xn-intenton-z2a/s3-sqs-bridge#readme
- License: License: MIT
- Crawl Date: 2025-05-06T22:27:59.380Z
- Data Size: 565681 bytes
- Links Found: 4731

## Retrieved
2025-05-06
