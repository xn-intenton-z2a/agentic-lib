# NODEJS_HANDLER

## Crawl Summary
Project initialization: npm init generates package.json and package-lock.json. Directory: index.mjs, package.json, package-lock.json, node_modules/. Handler: index.mjs exports async handler(event) returning Promise<string>; uses S3Client and PutObjectCommand. JSDoc defines event.order_id:string, event.amount:number, event.item:string. Handler config: fileName.exportedHandler. Input event shape JSON with order_id, amount, item. Valid signatures: async(event), async(event,context), callback(event,context,callback). SDK v3 integration: npm install @aws-sdk/client-s3@^3.0.0; import S3Client,PutObjectCommand; initialize client outside handler; send PutObjectCommand with Bucket,Key,Body. Environment variables: process.env.RECEIPT_BUCKET required. Initialization optimization: SDK client outside handler. Best practices: separate logic, bundle dependencies, minimize package size, reuse init phase, keep-alive, env vars for config, avoid recursion, no non-public APIs, idempotent code.

## Normalised Extract
Table of Contents:
1  Project Initialization
2  Directory Structure
3  Handler Implementation
4  Input Event Schema
5  Handler Signatures
6  AWS SDK Integration
7  Environment Variables
8  Initialization Optimization
9  Best Practices

1  Project Initialization
npm init
Generates package.json and package-lock.json

2  Directory Structure
/project-root
  index.mjs — main handler
  package.json — metadata
  package-lock.json — lock file
  node_modules/ — dependencies

3  Handler Implementation
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
const s3Client = new S3Client()
export const handler = async(event) => {
    const bucketName = process.env.RECEIPT_BUCKET
    if (!bucketName) throw new Error('RECEIPT_BUCKET environment variable is not set')
    const receiptContent = `OrderID: ${event.order_id}\nAmount: $${event.amount.toFixed(2)}\nItem: ${event.item}`
    const key = `receipts/${event.order_id}.txt`
    await uploadReceiptToS3(bucketName, key, receiptContent)
    return 'Success'
}

4  Input Event Schema
order_id: string
amount: number
item: string

5  Handler Signatures
export const handler = async (event)
export const handler = async (event, context)
export const handler = (event, context, callback)
callback(error: Error|null, response: any)

6  AWS SDK Integration
npm install @aws-sdk/client-s3@^3.0.0
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
const s3Client = new S3Client()
const command = new PutObjectCommand({Bucket: bucketName, Key: key, Body: receiptContent})
await s3Client.send(command)

7  Environment Variables
RECEIPT_BUCKET required
Access via process.env.RECEIPT_BUCKET
Throw Error('RECEIPT_BUCKET environment variable is not set') if undefined

8  Initialization Optimization
Place client initialization outside handler to reuse across invocations

9  Best Practices
Separate handler and core logic
Bundle dependencies in deployment package
Minimize package size
Reuse execution environment; avoid global mutable state
Use keep-alive for HTTP connections
Pass configuration via environment variables
Avoid recursive invocations; use reserved concurrency to throttle
Do not use non-public AWS Lambda APIs
Implement idempotent handlers


## Supplementary Details
- Handler property: fileName.exportedFunctionName (default index.handler)
- AWS CLI to change handler:
  aws lambda update-function-configuration --function-name <name> --handler index.handler
- IAM permission required: Action: s3:PutObject; Resource: arn:aws:s3:::<RECEIPT_BUCKET>/*
- Environment variable definition via AWS CLI:
  aws lambda update-function-configuration --function-name <name> --environment Variables={RECEIPT_BUCKET=my-bucket}
- SDK client version: @aws-sdk/client-s3@^3.0.0
- Timeout default: 3s; adjust with --timeout <seconds> using AWS CLI
- Memory default: 128 MB; adjust with --memory-size <MB>
- Node.js runtimes support ES modules (.mjs) and CommonJS (.js)
- Context object fields: functionName:string, memoryLimitInMB:string, awsRequestId:string, getRemainingTimeInMillis():number
- Keep-alive directive example:
  import https from 'https'
  const agent = new https.Agent({ keepAlive: true })
  const s3Client = new S3Client({ requestHandler: new NodeHttpHandler({ httpsAgent: agent }) })
- Reserved concurrency throttle:
  aws lambda put-function-concurrency --function-name <name> --reserved-concurrent-executions 0


## Reference Details
- S3Client constructor
  constructor S3Client(config?: S3ClientConfig)
  S3ClientConfig fields: region?:string, credentials?:AwsCredentialIdentity, endpoint?:string, requestHandler?:HttpHandlerOptions

- PutObjectCommand
  constructor PutObjectCommand(input: PutObjectRequest)
  PutObjectRequest fields:
    Bucket: string (required)
    Key: string (required)
    Body: Uint8Array|Buffer|string|ReadableStream (required)
    ACL?: 'private'|'public-read'|'public-read-write'|'authenticated-read'|string
    ContentType?: string
    Metadata?: { [key:string]: string }
  response metadata in PutObjectOutput

- Handler signature
  export const handler(event: {order_id:string;amount:number;item:string}, context?: Context, callback?: (error: Error|null, response: any) => void): Promise<string> | void

- uploadReceiptToS3
  async function uploadReceiptToS3(bucketName: string, key: string, receiptContent: string): Promise<void>

- AWS CLI commands
  aws lambda update-function-configuration --function-name MyFunction --timeout 30
  aws lambda update-function-configuration --function-name MyFunction --memory-size 256
  aws lambda update-function-configuration --function-name MyFunction --environment Variables={RECEIPT_BUCKET=my-bucket}
  aws lambda get-function-configuration --function-name MyFunction --query Environment.Variables
  aws lambda put-function-concurrency --function-name MyFunction --reserved-concurrent-executions 0

- Logging and troubleshooting
  CloudWatch Logs filter:
    filter @message ERROR
  Expected log lines:
    START RequestId:... Duration:... ms
    Processed order 12345, stored in my-bucket
    END RequestId:... 
    REPORT RequestId:... Billed Duration:... ms Memory Size:... MB Max Memory Used:... MB

- Idempotency pattern
  import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb'
  async function processOrder(event) {
    const client = new DynamoDBClient()
    const key = { order_id: { S: event.order_id } }
    const existing = await client.send(new GetItemCommand({ TableName:'Orders', Key:key }))
    if (existing.Item) return 'Duplicate'
    // process and store
    await client.send(new PutItemCommand({ TableName:'Orders', Item:{ order_id:{S:event.order_id}, status:{S:'processed'} }}))
    return 'Success'
  }

- Code signing
  Enable via AWS Console or AWS CLI: 
    aws lambda update-function-configuration --function-name MyFunction --code-signing-config-arn <arn>


## Information Dense Extract
npm init; structure index.mjs,package.json,package-lock.json,node_modules. ESModule or CommonJS handler: export const handler(event[,context]):Promise<string> or callback. Input schema: order_id:string,amount:number,item:string. Bundled @aws-sdk/client-s3@^3.0.0; import S3Client,PutObjectCommand; initialize client outside handler. PutObjectCommand({Bucket,Key,Body}); await s3Client.send(command). Env var RECEIPT_BUCKET required; process.env.RECEIPT_BUCKET; throw if unset. IAM: s3:PutObject on arn:aws:s3:::<bucket>/*. Handler config index.handler. Valid signatures async(event), async(event,context), (event,context,callback). Best practices: separate logic, bundle deps, minimize size, reuse init, keep-alive agent, idempotency, avoid recursion, no non-public APIs. Troubleshoot: aws lambda update-function-configuration commands, CloudWatch Logs filter @message ERROR, expected START/END/REPORT lines.

## Sanitised Extract
Table of Contents:
1  Project Initialization
2  Directory Structure
3  Handler Implementation
4  Input Event Schema
5  Handler Signatures
6  AWS SDK Integration
7  Environment Variables
8  Initialization Optimization
9  Best Practices

1  Project Initialization
npm init
Generates package.json and package-lock.json

2  Directory Structure
/project-root
  index.mjs  main handler
  package.json  metadata
  package-lock.json  lock file
  node_modules/  dependencies

3  Handler Implementation
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
const s3Client = new S3Client()
export const handler = async(event) => {
    const bucketName = process.env.RECEIPT_BUCKET
    if (!bucketName) throw new Error('RECEIPT_BUCKET environment variable is not set')
    const receiptContent = 'OrderID: ${event.order_id}'nAmount: $${event.amount.toFixed(2)}'nItem: ${event.item}'
    const key = 'receipts/${event.order_id}.txt'
    await uploadReceiptToS3(bucketName, key, receiptContent)
    return 'Success'
}

4  Input Event Schema
order_id: string
amount: number
item: string

5  Handler Signatures
export const handler = async (event)
export const handler = async (event, context)
export const handler = (event, context, callback)
callback(error: Error|null, response: any)

6  AWS SDK Integration
npm install @aws-sdk/client-s3@^3.0.0
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
const s3Client = new S3Client()
const command = new PutObjectCommand({Bucket: bucketName, Key: key, Body: receiptContent})
await s3Client.send(command)

7  Environment Variables
RECEIPT_BUCKET required
Access via process.env.RECEIPT_BUCKET
Throw Error('RECEIPT_BUCKET environment variable is not set') if undefined

8  Initialization Optimization
Place client initialization outside handler to reuse across invocations

9  Best Practices
Separate handler and core logic
Bundle dependencies in deployment package
Minimize package size
Reuse execution environment; avoid global mutable state
Use keep-alive for HTTP connections
Pass configuration via environment variables
Avoid recursive invocations; use reserved concurrency to throttle
Do not use non-public AWS Lambda APIs
Implement idempotent handlers

## Original Source
AWS Lambda Node.js Handler
https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html

## Digest of NODEJS_HANDLER

# AWS Lambda Node.js Handler
Date Retrieved: 2024-06-04

# 1. Project Initialization

- Command: npm init
- Generates: package.json (metadata), package-lock.json (lock file)
- Supported file extensions: .js, .mjs

# 2. Directory Structure

/project-root
  ├── index.mjs      Contains main handler  
  ├── package.json   Project metadata and dependencies  
  ├── package-lock.json  Dependency lock file  
  └── node_modules/  Installed dependencies

# 3. Example Handler Implementation (index.mjs)

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

// Initialize the S3 client outside the handler for reuse
const s3Client = new S3Client()

/**
 * Lambda handler for processing orders and storing receipts in S3.
 * @param {Object} event               Input event containing order details
 * @param {string} event.order_id      Unique identifier for the order
 * @param {number} event.amount        Order amount
 * @param {string} event.item          Item purchased
 * @returns {Promise<string>}          Success message
 */
export const handler = async(event) => {
    try {
        const bucketName = process.env.RECEIPT_BUCKET
        if (!bucketName) throw new Error('RECEIPT_BUCKET environment variable is not set')

        const receiptContent = `OrderID: ${event.order_id}\nAmount: $${event.amount.toFixed(2)}\nItem: ${event.item}`
        const key = `receipts/${event.order_id}.txt`

        await uploadReceiptToS3(bucketName, key, receiptContent)
        console.log(`Processed order ${event.order_id}, stored in ${bucketName}`)
        return 'Success'
    } catch (error) {
        console.error(`Failed to process order: ${error.message}`)
        throw error
    }
}

async function uploadReceiptToS3(bucketName, key, receiptContent) {
    try {
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: receiptContent
        })
        await s3Client.send(command)
    } catch (error) {
        throw new Error(`Failed to upload receipt to S3: ${error.message}`)
    }
}

# 4. Handler Configuration

- Handler setting: fileName.exportedHandler (default index.handler)
- To change in console: Functions > Code > Runtime settings > Edit Handler > Save

# 5. Input Event Object

Expected JSON shape:
{
  "order_id": "12345",
  "amount": 199.99,
  "item": "Wireless Headphones"
}

# 6. Valid Handler Patterns

Async/await patterns:
export const handler = async(event) => { }
export const handler = async(event, context) => { }

Callback pattern:
export const handler = (event, context, callback) => { }
- callback(error: Error|null, response: any)
- context.callbackWaitsForEmptyEventLoop = false to send response immediately

# 7. AWS SDK for JavaScript v3

- Runtime includes SDK v3; recommended to bundle specific clients
- Install: npm install @aws-sdk/client-s3@^3.0.0
- Import: import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
- Initialize: const s3Client = new S3Client()

# 8. Environment Variables

- Access: process.env.RECEIPT_BUCKET
- Required: throw error if undefined
- Define in function configuration or deployment

# 9. Initialization Phase Optimization

- Initialize SDK clients, database connections outside handler
- Lambdas reuse initialized resources across invocations

# 10. Code Best Practices

- Separate handler and core logic for unit testing
- Bundle dependencies to control versions and updates
- Minimize deployment package size
- Reuse execution environment, avoid storing sensitive data globally
- Use keep-alive directive for persistent connections (see Reusing Connections with Keep-Alive in Node.js)
- Use environment variables for configuration
- Avoid recursive invocations; throttle by setting reserved concurrency to 0 if needed
- Do not use non-public Lambda internal APIs
- Write idempotent code and validate duplicate events



## Attribution
- Source: AWS Lambda Node.js Handler
- URL: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
- License: Amazon Software License (ASL)
- Crawl Date: 2025-05-10T13:10:00.670Z
- Data Size: 1987488 bytes
- Links Found: 35704

## Retrieved
2025-05-10
