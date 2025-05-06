# S3_SQS_BRIDGE

## Crawl Summary
Environment variables: BUCKET_NAME, OBJECT_PREFIX(default), REPLAY_QUEUE_URL, DIGEST_QUEUE_URL, OFFSETS_TABLE_NAME(default offsets), PROJECTIONS_TABLE_NAME(default projections), SOURCE_LAMBDA_FUNCTION_NAME, AWS_ENDPOINT(optional). PostgreSQL: PG_CONNECTION_STRING(default postgres://user:pass@localhost:5432/db), GITHUB_PROJECTIONS_TABLE(default github_event_projections), GITHUB_EVENT_QUEUE_URL(default https://test/...); Retry: PG_MAX_RETRIES=3, PG_RETRY_DELAY_MS=1000; Metrics counters: totalEvents, successfulEvents, skippedEvents, dbFailures, dbRetryCount, deadLetterEvents; HTTP Express endpoints: GET /metrics on METRICS_PORT, GET /status on STATUS_PORT; CLI flags: --source-projection, --replay-projection, --replay, --healthcheck, --metrics, --status-endpoint; npm scripts: start, healthcheck, replay; testing: npm test

## Normalised Extract
Table of Contents:
1 Configuration
2 Retry Logic
3 Metrics Collection
4 HTTP Endpoints
5 CLI Usage
6 Local Development
7 Testing

1 Configuration
Environment Variables and Defaults
BUCKET_NAME: required
OBJECT_PREFIX: default ''
REPLAY_QUEUE_URL: required
DIGEST_QUEUE_URL: required
OFFSETS_TABLE_NAME: default 'offsets'
PROJECTIONS_TABLE_NAME: default 'projections'
SOURCE_LAMBDA_FUNCTION_NAME: required
AWS_ENDPOINT: optional override
PG_CONNECTION_STRING: default 'postgres://user:pass@localhost:5432/db'
GITHUB_PROJECTIONS_TABLE: default 'github_event_projections'
GITHUB_EVENT_QUEUE_URL: default 'https://test/000000000000/github-event-queue-test'
PG_MAX_RETRIES: default 3
PG_RETRY_DELAY_MS: default 1000
DEAD_LETTER_QUEUE_URL: optional

2 Retry Logic
Algorithm: exponential backoff
BaseDelay: PG_RETRY_DELAY_MS
MaxAttempts: PG_MAX_RETRIES
Pseudo-code:
let count=0
while count < PG_MAX_RETRIES:
  try client.query
  catch:
    sleep PG_RETRY_DELAY_MS * 2**count
    count++
    on final failure throw

3 Metrics Collection
Counters:
metric.totalEvents
metric.successfulEvents
metric.skippedEvents
metric.dbFailures
metric.dbRetryCount
metric.deadLetterEvents
Method: increment counters in code, export getMetrics()

4 HTTP Endpoints
Express on ports METRICS_PORT, STATUS_PORT
define GET /metrics => JSON(getMetrics())
define GET /status  => { status: 'OK' }

5 CLI Usage
Parser: Commander.js
Flags mapping:
--source-projection => runSourceProjection = true
--replay-projection => runReplayProjection = true
--replay => replayAll = true
--healthcheck => startHealth = true
--metrics => startMetrics = true
--status-endpoint => startStatus = true

6 Local Development
npm start: invokes handler
npm run healthcheck: launches health server
npm run replay: executes replay logic
Note: dummy events skip DB connect

7 Testing
npm test: runs Vitest suite
Tests located in tests/unit


## Supplementary Details
Default values: PG_CONNECTION_STRING=postgres://user:pass@localhost:5432/db; GITHUB_PROJECTIONS_TABLE=github_event_projections; GITHUB_EVENT_QUEUE_URL=https://test/000000000000/github-event-queue-test; METRICS_PORT=3000; STATUS_PORT=3000; PG_MAX_RETRIES=3; PG_RETRY_DELAY_MS=1000; OFFSETS_TABLE_NAME='offsets'; PROJECTIONS_TABLE_NAME='projections'.

Deployment steps:
1. npm install
2. npm run build
3. cdk deploy --require-approval never
4. aws lambda update-function-code --function-name $SOURCE_LAMBDA_FUNCTION_NAME --zip-file fileb://dist/function.zip
5. export required ENV variables
6. docker-compose up -d if using LocalStack

PostgreSQL setup:
psql $PG_CONNECTION_STRING -c "CREATE TABLE IF NOT EXISTS $GITHUB_PROJECTIONS_TABLE (id SERIAL PRIMARY KEY, payload JSONB);"

Dead-letter queue configuration:
aws sqs set-queue-attributes --queue-url $REPLAY_QUEUE_URL --attributes '{"RedrivePolicy":"{\"deadLetterTargetArn\":\"arn:aws:sqs:region:account:DLQ-name\",\"maxReceiveCount\":5}"}'


## Reference Details
AWS SDK v3 SQS Client
import { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';

Constructor:
new SQSClient({ region: string, endpoint?: string, credentials?: AwsCredentialIdentity })

SendMessageCommand:
Input:
interface SendMessageCommandInput {
  QueueUrl: string;          // required
  MessageBody: string;        // required
  DelaySeconds?: number;
  MessageAttributes?: { [key:string]: MessageAttributeValue };
  MessageGroupId?: string;
  MessageDeduplicationId?: string;
}
Output:
interface SendMessageCommandOutput {
  MD5OfMessageBody: string;
  MD5OfMessageAttributes?: string;
  MessageId: string;
  SequenceNumber?: string;
}

ReceiveMessageCommand:
Input:
interface ReceiveMessageCommandInput {
  QueueUrl: string;          // required
  AttributeNames?: string[];
  MessageAttributeNames?: string[];
  MaxNumberOfMessages?: number; // default 1
  VisibilityTimeout?: number;
  WaitTimeSeconds?: number;     // default 0
}
Output:
interface ReceiveMessageCommandOutput {
  Messages?: Message[];
}
interface Message {
  MessageId?: string;
  ReceiptHandle?: string;
  MD5OfBody?: string;
  Body?: string;
  Attributes?: { [key:string]: string };
  MessageAttributes?: { [key:string]: MessageAttributeValue };
}

DeleteMessageCommand:
Input:
interface DeleteMessageCommandInput {
  QueueUrl: string;          // required
  ReceiptHandle: string;      // required
}

Code Examples:

// Initialize client
const client = new SQSClient({ region: 'us-east-1', endpoint: process.env.AWS_ENDPOINT });

// Receive messages
const receiveParams: ReceiveMessageCommandInput = {
  QueueUrl: process.env.REPLAY_QUEUE_URL,  
  MaxNumberOfMessages: 10,
  WaitTimeSeconds: 20,
};
const response = await client.send(new ReceiveMessageCommand(receiveParams));

// Process and delete
if (response.Messages) {
  for (const msg of response.Messages) {
    const body = JSON.parse(msg.Body);
    // Zod validation example
    const result = eventSchema.safeParse(body);
    if (!result.success) {
      metrics.skippedEvents++;
      continue;
    }
    try {
      await dbClient.query('INSERT INTO ' + process.env.GITHUB_PROJECTIONS_TABLE + ' (payload) VALUES ($1)', [body]);
      metrics.successfulEvents++;
    } catch (dbErr) {
      metrics.dbFailures++;
      // DLQ routing
      await client.send(new SendMessageCommand({ QueueUrl: process.env.DEAD_LETTER_QUEUE_URL, MessageBody: msg.Body }));
      metrics.deadLetterEvents++;
    }
    // Delete handled message
    await client.send(new DeleteMessageCommand({ QueueUrl: process.env.REPLAY_QUEUE_URL, ReceiptHandle: msg.ReceiptHandle! }));
  }
}

Lambda Handler Signature:
import { SQSEvent, SQSRecord, Context, Callback } from 'aws-lambda';
export const handler = async (event: SQSEvent): Promise<void> => { /* implementation */ };

Zod Schema Definition:
import { z } from 'zod';
const eventSchema = z.object({
  repository: z.string(),
  action: z.string(),
  sender: z.object({ id: z.number(), login: z.string() }),
});

Best Practices:
- Mask sensitive data in logs: logger.info({ event:'db-query', query }, { mask: ['password'] });
- Use structured logging for correlation IDs.
- Idempotent DB upserts: INSERT ... ON CONFLICT(key) DO UPDATE.

Troubleshooting Procedures:
1. Verify DLQ RedrivePolicy:
   aws sqs get-queue-attributes --queue-url $REPLAY_QUEUE_URL --attribute-names RedrivePolicy
   # Expect JSON with deadLetterTargetArn and maxReceiveCount

2. Inspect Lambda logs for ERRORs:
   aws logs filter-log-events --log-group-name /aws/lambda/${SOURCE_LAMBDA_FUNCTION_NAME} --start-time $(date +%s --date='-10 minutes')000 --filter-pattern "ERROR"

3. Test PostgreSQL connectivity:
   psql "$PG_CONNECTION_STRING" -c "SELECT 1;"
   # Expect output '1'

4. Replay events and verify:
   npm run replay
   # Expect console: "Replayed X events"
   psql "$PG_CONNECTION_STRING" -c "SELECT count(*) FROM $GITHUB_PROJECTIONS_TABLE;"


## Information Dense Extract
ENVs: BUCKET_NAME, OBJECT_PREFIX='', REPLAY_QUEUE_URL, DIGEST_QUEUE_URL, OFFSETS_TABLE_NAME='offsets', PROJECTIONS_TABLE_NAME='projections', SOURCE_LAMBDA_FUNCTION_NAME, AWS_ENDPOINT?; PG: PG_CONNECTION_STRING='postgres://user:pass@localhost:5432/db', GITHUB_PROJECTIONS_TABLE='github_event_projections', GITHUB_EVENT_QUEUE_URL='https://test/...'; Retries: PG_MAX_RETRIES=3, PG_RETRY_DELAY_MS=1000ms; Metrics: counters totalEvents, successfulEvents, skippedEvents, dbFailures, dbRetryCount, deadLetterEvents via getMetrics(); HTTP: Express GET /metrics on METRICS_PORT(3000), GET /status on STATUS_PORT(3000); CLI flags: --source-projection, --replay-projection, --replay, --healthcheck, --metrics, --status-endpoint; Scripts: npm start, npm run healthcheck, npm run replay, npm test; SDK: SQSClient({region, endpoint}), SendMessageCommand(Input), ReceiveMessageCommand(Input), DeleteMessageCommand(Input); Lambda: handler(event:SQSEvent)=>Promise<void>; Zod: define eventSchema; use client.query with expo backoff; log mask, structured logs; DLQ redrivePolicy; DB upsert on conflict; Troubleshoot: aws sqs get-queue-attributes, aws logs filter-log-events, psql connectivity, npm run replay + psql count.

## Sanitised Extract
Table of Contents:
1 Configuration
2 Retry Logic
3 Metrics Collection
4 HTTP Endpoints
5 CLI Usage
6 Local Development
7 Testing

1 Configuration
Environment Variables and Defaults
BUCKET_NAME: required
OBJECT_PREFIX: default ''
REPLAY_QUEUE_URL: required
DIGEST_QUEUE_URL: required
OFFSETS_TABLE_NAME: default 'offsets'
PROJECTIONS_TABLE_NAME: default 'projections'
SOURCE_LAMBDA_FUNCTION_NAME: required
AWS_ENDPOINT: optional override
PG_CONNECTION_STRING: default 'postgres://user:pass@localhost:5432/db'
GITHUB_PROJECTIONS_TABLE: default 'github_event_projections'
GITHUB_EVENT_QUEUE_URL: default 'https://test/000000000000/github-event-queue-test'
PG_MAX_RETRIES: default 3
PG_RETRY_DELAY_MS: default 1000
DEAD_LETTER_QUEUE_URL: optional

2 Retry Logic
Algorithm: exponential backoff
BaseDelay: PG_RETRY_DELAY_MS
MaxAttempts: PG_MAX_RETRIES
Pseudo-code:
let count=0
while count < PG_MAX_RETRIES:
  try client.query
  catch:
    sleep PG_RETRY_DELAY_MS * 2**count
    count++
    on final failure throw

3 Metrics Collection
Counters:
metric.totalEvents
metric.successfulEvents
metric.skippedEvents
metric.dbFailures
metric.dbRetryCount
metric.deadLetterEvents
Method: increment counters in code, export getMetrics()

4 HTTP Endpoints
Express on ports METRICS_PORT, STATUS_PORT
define GET /metrics => JSON(getMetrics())
define GET /status  => { status: 'OK' }

5 CLI Usage
Parser: Commander.js
Flags mapping:
--source-projection => runSourceProjection = true
--replay-projection => runReplayProjection = true
--replay => replayAll = true
--healthcheck => startHealth = true
--metrics => startMetrics = true
--status-endpoint => startStatus = true

6 Local Development
npm start: invokes handler
npm run healthcheck: launches health server
npm run replay: executes replay logic
Note: dummy events skip DB connect

7 Testing
npm test: runs Vitest suite
Tests located in tests/unit

## Original Source
@xn-intenton-z2a/s3-sqs-bridge
https://github.com/xn-intenton-z2a/s3-sqs-bridge

## Digest of S3_SQS_BRIDGE

# Configuration

Environment variables configure all AWS and PostgreSQL integration parameters:

- BUCKET_NAME: S3 bucket name (no default, required).
- OBJECT_PREFIX: S3 key prefix filter (default empty string).
- REPLAY_QUEUE_URL: SQS queue URL for replayed events (no default, required).
- DIGEST_QUEUE_URL: SQS queue URL for digest events (no default, required).
- OFFSETS_TABLE_NAME: DynamoDB table name for offset tracking (default offsets).
- PROJECTIONS_TABLE_NAME: DynamoDB/RDS table for projections (default projections).
- SOURCE_LAMBDA_FUNCTION_NAME: Name of the Lambda forwarding S3 events (required).
- AWS_ENDPOINT: Custom AWS endpoint for local testing (optional).

PostgreSQL specific variables:

- PG_CONNECTION_STRING: postgres://user:pass@localhost:5432/db (default)
- GITHUB_PROJECTIONS_TABLE: github_event_projections (default)
- GITHUB_EVENT_QUEUE_URL: https://test/000000000000/github-event-queue-test (default)

Retry configuration:

- PG_MAX_RETRIES: 3 (default)
- PG_RETRY_DELAY_MS: 1000 ms (default)

Dead-letter queue:

- DEAD_LETTER_QUEUE_URL: SQS URL for failed record routing (optional)

# Retry Strategy

Implementation uses exponential backoff for PostgreSQL operations:

```
let attempts = 0;
while (attempts < PG_MAX_RETRIES) {
  try {
    await client.query(sql);
    break;
  } catch (err) {
    attempts++;
    await new Promise(r => setTimeout(r, PG_RETRY_DELAY_MS * 2 ** attempts));
    if (attempts === PG_MAX_RETRIES) throw err;
  }
}
```

# Metrics Collection

In-memory counters tracked via getMetrics():

- totalEvents: number
- successfulEvents: number
- skippedEvents: number
- dbFailures: number
- dbRetryCount: number
- deadLetterEvents: number

# HTTP Endpoints

Express server exposes:

GET /metrics on port METRICS_PORT (3000 default) returns JSON of all metrics counters.
GET /status on port STATUS_PORT (3000 default) returns HTTP 200 with body { status: "OK" }.

# CLI Usage

Flags supported by CLI:

--help             Show usage instructions
--source-projection Run source S3 event handler
--replay-projection Run replayed event handler
--replay           Replay all S3 object versions
--healthcheck      Start HTTP health check server on port 8080
--metrics          Start metrics endpoint on METRICS_PORT
--status-endpoint  Start status endpoint on STATUS_PORT

# Local Development

npm start            Launch GitHub event projection handler (src/lib/main.js)
npm run healthcheck   Start health check server
npm run replay        Replay S3 events sequence

# Testing

npm test             Execute unit tests via Vitest

## Attribution
- Source: @xn-intenton-z2a/s3-sqs-bridge
- URL: https://github.com/xn-intenton-z2a/s3-sqs-bridge
- License: License: MIT
- Crawl Date: 2025-05-06T04:30:17.280Z
- Data Size: 570410 bytes
- Links Found: 4667

## Retrieved
2025-05-06
