# S3_SQS_BRIDGE

## Crawl Summary
Env vars: BUCKET_NAME, OBJECT_PREFIX, REPLAY_QUEUE_URL, DIGEST_QUEUE_URL, OFFSETS_TABLE_NAME, PROJECTIONS_TABLE_NAME, SOURCE_LAMBDA_FUNCTION_NAME, AWS_ENDPOINT; Postgres: PG_CONNECTION_STRING(default postgres://user:pass@localhost:5432/db), GITHUB_PROJECTIONS_TABLE, GITHUB_EVENT_QUEUE_URL; Retry: PG_MAX_RETRIES=3, PG_RETRY_DELAY_MS=1000; Optional DEAD_LETTER_QUEUE_URL; Metrics: totalEvents, successfulEvents, skippedEvents, dbFailures, dbRetryCount, deadLetterEvents; Express endpoints /metrics and /status; CLI: source-projection, replay-projection, replay, healthcheck, metrics, status-endpoint; Local: npm start, npm run healthcheck, npm run replay; Testing: npm test with Vitest.

## Normalised Extract
Table of Contents:
1. Configuration
2. PostgreSQL Connection & Retry
3. Dead-Letter Queue
4. Metrics Collection
5. HTTP Health & Metrics API
6. CLI Commands
7. Local Development Scripts
8. Testing

1. Configuration
Environment variables control behavior. Set BUCKET_NAME, OBJECT_PREFIX, REPLAY_QUEUE_URL, DIGEST_QUEUE_URL, OFFSETS_TABLE_NAME, PROJECTIONS_TABLE_NAME, SOURCE_LAMBDA_FUNCTION_NAME, AWS_ENDPOINT. Defaults apply when unset.

2. PostgreSQL Connection & Retry
PG_CONNECTION_STRING: default postgres://user:pass@localhost:5432/db
PG_MAX_RETRIES: default 3
PG_RETRY_DELAY_MS: default 1000ms
3 retry attempts with exponential backoff: delay=PG_RETRY_DELAY_MS*(2**attempt).

3. Dead-Letter Queue
Set DEAD_LETTER_QUEUE_URL to route failed records after retries. Handler calls sqs.sendMessage for each dead-letter event.

4. Metrics Collection
In-memory counters: totalEvents, successfulEvents, skippedEvents, dbFailures, dbRetryCount, deadLetterEvents. Expose via getMetrics(): { totalEvents, ... }.

5. HTTP Health & Metrics API
Express setup:
 app.get('/status', (_, res) => res.sendStatus(200));
 app.get('/metrics', (_, res) => res.json(getMetrics()));
Ports: STATUS_PORT default 3000, METRICS_PORT default 3000.

6. CLI Commands
Supported flags:
 --source-projection: invoke handler on S3 events
 --replay-projection: invoke handler on replayed events
 --replay: iterate S3 versions in order
 --healthcheck: start express /status on port 8080
 --metrics: start express /metrics on METRICS_PORT
 --status-endpoint: alias for --healthcheck with custom port

7. Local Development Scripts
 npm start (runs handler)
 npm run healthcheck (starts /status server)
 npm run replay (invokes replay logic)

8. Testing
 Vitest configuration in vitest.config.js
 Unit tests in tests/unit using `npm test`

## Supplementary Details
Zod Schema:
zod.object({
  id: z.string(),
  type: z.string(),
  payload: z.record(z.any())
}).strict()

AWS SQS Client:
 const sqs = new SQSClient({ endpoint: AWS_ENDPOINT });

Postgres Client Retry Pattern:
 async function connectWithRetry() {
  for (let i = 0; i < PG_MAX_RETRIES; i++) {
    try {
      await client.connect();
      return;
    } catch (e) {
      await new Promise(r => setTimeout(r, PG_RETRY_DELAY_MS * 2 ** i));
    }
  }
  throw new Error('Failed to connect after retries');
 }

Dead-Letter send:
 await sqs.send(new SendMessageCommand({ QueueUrl: DEAD_LETTER_QUEUE_URL, MessageBody: JSON.stringify(record) }));

## Reference Details
AWS SDK SQSClient:
 constructor(config: { region?: string; endpoint?: string; credentials?: AWSCredentials });
 send(command: SendMessageCommand): Promise<SendMessageCommandOutput>;

SendMessageCommandInput:
 interface SendMessageCommandInput { QueueUrl: string; MessageBody: string; DelaySeconds?: number; }
SendMessageCommandOutput: { MD5OfMessageBody: string; MessageId: string; }

PostgreSQL pg.Client:
 constructor(config: { connectionString: string });
 connect(): Promise<void>;
 query(query: string, values?: any[]): Promise<{ rows: any[]; rowCount: number; };
 end(): Promise<void>;

Express API:
 app.get(path: string, handler: (req: Request, res: Response) => void): Express;
 listen(port: number, callback?: () => void): Server;

Commander.js CLI:
 program.command(name: string)
   .description(text: string)
   .action(fn: () => Promise<void>)

Example best practice:
 program
   .command('replay')
   .description('Replay all S3 versions')
   .action(async () => { await replayAll(); });

Troubleshooting:
 aws sqs send-message --queue-url $REPLAY_QUEUE_URL --message-body '{}' --profile default
 Expected: { MD5OfMessageBody: "..", MessageId: "..." }

Local health check:
 curl http://localhost:8080/status
 Expected: HTTP/1.1 200 OK

## Information Dense Extract
BUCKET_NAME,OBJECT_PREFIX,REPLAY_QUEUE_URL,DIGEST_QUEUE_URL,OFFSETS_TABLE_NAME,PROJECTIONS_TABLE_NAME,SOURCE_LAMBDA_FUNCTION_NAME,AWS_ENDPOINT;PG_CONNECTION_STRING(default postgres://user:pass@localhost:5432/db),GITHUB_PROJECTIONS_TABLE, GITHUB_EVENT_QUEUE_URL;PG_MAX_RETRIES=3,PG_RETRY_DELAY_MS=1000;DEAD_LETTER_QUEUE_URL optional;Metrics: totalEvents,successfulEvents,skippedEvents,dbFailures,dbRetryCount,deadLetterEvents;Express /status (port STATUS_PORT=3000)/metrics (port METRICS_PORT=3000);CLI flags: --source-projection,--replay-projection,--replay,--healthcheck,--metrics,--status-endpoint;npm start,npm run healthcheck,npm run replay;npm test (Vitest).

## Sanitised Extract
Table of Contents:
1. Configuration
2. PostgreSQL Connection & Retry
3. Dead-Letter Queue
4. Metrics Collection
5. HTTP Health & Metrics API
6. CLI Commands
7. Local Development Scripts
8. Testing

1. Configuration
Environment variables control behavior. Set BUCKET_NAME, OBJECT_PREFIX, REPLAY_QUEUE_URL, DIGEST_QUEUE_URL, OFFSETS_TABLE_NAME, PROJECTIONS_TABLE_NAME, SOURCE_LAMBDA_FUNCTION_NAME, AWS_ENDPOINT. Defaults apply when unset.

2. PostgreSQL Connection & Retry
PG_CONNECTION_STRING: default postgres://user:pass@localhost:5432/db
PG_MAX_RETRIES: default 3
PG_RETRY_DELAY_MS: default 1000ms
3 retry attempts with exponential backoff: delay=PG_RETRY_DELAY_MS*(2**attempt).

3. Dead-Letter Queue
Set DEAD_LETTER_QUEUE_URL to route failed records after retries. Handler calls sqs.sendMessage for each dead-letter event.

4. Metrics Collection
In-memory counters: totalEvents, successfulEvents, skippedEvents, dbFailures, dbRetryCount, deadLetterEvents. Expose via getMetrics(): { totalEvents, ... }.

5. HTTP Health & Metrics API
Express setup:
 app.get('/status', (_, res) => res.sendStatus(200));
 app.get('/metrics', (_, res) => res.json(getMetrics()));
Ports: STATUS_PORT default 3000, METRICS_PORT default 3000.

6. CLI Commands
Supported flags:
 --source-projection: invoke handler on S3 events
 --replay-projection: invoke handler on replayed events
 --replay: iterate S3 versions in order
 --healthcheck: start express /status on port 8080
 --metrics: start express /metrics on METRICS_PORT
 --status-endpoint: alias for --healthcheck with custom port

7. Local Development Scripts
 npm start (runs handler)
 npm run healthcheck (starts /status server)
 npm run replay (invokes replay logic)

8. Testing
 Vitest configuration in vitest.config.js
 Unit tests in tests/unit using 'npm test'

## Original Source
S3 Payload Handling & Library
https://github.com/xn-intenton-z2a/s3-sqs-bridge

## Digest of S3_SQS_BRIDGE

# S3-SQS Bridge Configuration
Date Retrieved: 2024-06-18
Data Size: 563229 bytes

# Environment Variables
BUCKET_NAME: name of S3 bucket to watch
OBJECT_PREFIX: prefix filter for S3 keys
REPLAY_QUEUE_URL: SQS URL for object replay queue
DIGEST_QUEUE_URL: SQS URL for digest queue
OFFSETS_TABLE_NAME: DynamoDB/Postgres table for offsets
PROJECTIONS_TABLE_NAME: Postgres table for projections
SOURCE_LAMBDA_FUNCTION_NAME: Lambda logical name in CDK
AWS_ENDPOINT: Custom AWS endpoint (for LocalStack)

# PostgreSQL Connection
PG_CONNECTION_STRING: postgres://user:pass@localhost:5432/db (default)
GITHUB_PROJECTIONS_TABLE: github_event_projections (default)
GITHUB_EVENT_QUEUE_URL: https://test/000000000000/github-event-queue-test

# Retry Configuration
PG_MAX_RETRIES: 3
PG_RETRY_DELAY_MS: 1000

# Dead-Letter Queue
DEAD_LETTER_QUEUE_URL: optional SQS queue URL for failed records

# Metrics Collected
totalEvents, successfulEvents, skippedEvents, dbFailures, dbRetryCount, deadLetterEvents

# HTTP Endpoints
/metrics (port METRICS_PORT default 3000)
/status (port STATUS_PORT default 3000)

# CLI Commands
--help, --source-projection, --replay-projection, --replay, --healthcheck, --metrics, --status-endpoint

# Local Scripts
npm start, npm run healthcheck, npm run replay

# Testing
Vitest: npm test

## Attribution
- Source: S3 Payload Handling & Library
- URL: https://github.com/xn-intenton-z2a/s3-sqs-bridge
- License: License: MIT (library), Public Domain (AWS documentation)
- Crawl Date: 2025-05-06T09:29:23.712Z
- Data Size: 563229 bytes
- Links Found: 4638

## Retrieved
2025-05-06
