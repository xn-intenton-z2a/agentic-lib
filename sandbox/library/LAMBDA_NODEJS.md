# LAMBDA_NODEJS

## Crawl Summary
Init: npm init; ES module or CommonJS index.js/mjs. Handler signature: async(event[,context]) returns Promise<any>. Environment variable RECEIPT_BUCKET required. Initialize SDK clients outside handler for reuse. Use @aws-sdk/client-s3: S3Client(), PutObjectCommand({Bucket,Key,Body}). Handler property: file.export. IAM needs s3:PutObject. Input event JSON shape: {order_id:string,amount:number,item:string}.

## Normalised Extract
Table of Contents
1 Project Initialization
2 Handler Definition
3 Input Event Object
4 Environment Variables
5 SDK Client Initialization
6 S3 Upload Function
7 IAM and Permissions
8 Handler Configuration

1 Project Initialization
npm init
Files:
 index.mjs or index.js
 package.json
 package-lock.json
 node_modules/

2 Handler Definition
function exported as handler in index.js/mjs
Valid signatures:
 export const handler=async(event):Promise<any>
 export const handler=async(event,context):Promise<any>
 export const handler=(event,context,callback)

3 Input Event Object
Expected JSON keys:
 order_id (string)
 amount (number)
 item (string)
JSDoc:
 @param {Object} event
 @param {string} event.order_id
 @param {number} event.amount
 @param {string} event.item
 @returns {Promise<string>}

4 Environment Variables
RECEIPT_BUCKET: string; throw Error if undefined
Access: const bucketName=process.env.RECEIPT_BUCKET

5 SDK Client Initialization
npm install @aws-sdk/client-s3
import:{S3Client,PutObjectCommand}
const s3Client=new S3Client(); // outside handler

6 S3 Upload Function
async function uploadReceiptToS3(bucketName,key,body):Promise<void>
 const cmd=new PutObjectCommand({Bucket:bucketName,Key:key,Body:body});
 await s3Client.send(cmd);
 error handling: catch and throw new Error(msg)

7 IAM and Permissions
Execution role must include:
 {"Effect":"Allow","Action":"s3:PutObject","Resource":"arn:aws:s3:::<bucket>/receipts/*"}

8 Handler Configuration
Handler setting: index.handler or index.handler for mjs
Change in console: Runtime settings > Handler


## Supplementary Details
Parameter Values:
- RECEIPT_BUCKET: name of S3 bucket where receipts are stored
- key prefix: receipts/${order_id}.txt

Configuration Options:
- Handler: index.handler
- Runtime: nodejs16.x or nodejs18.x
- Environment Variables: Add RECEIPT_BUCKET
- Timeout: default 3 sec, adjust if S3 upload large
- Memory: >=128MB

Implementation Steps:
1 Create project folder
2 Run npm init
3 npm install @aws-sdk/client-s3 --save
4 Create index.mjs per example
5 Define RECEIPT_BUCKET env var
6 Assign IAM role with s3:PutObject
7 Deploy via zip or container



## Reference Details
SDK Method Signatures:
S3Client(config?:S3ClientConfig)
PutObjectCommand(input:PutObjectRequest)
interface PutObjectRequest{Bucket:string;Key:string;Body:any;ACL?:string;CacheControl?:string;ContentType?:string;}

Complete Handler:
```js
import {S3Client,PutObjectCommand} from '@aws-sdk/client-s3';
const s3Client=new S3Client({region:process.env.AWS_REGION});
/**
 * @param {Object} event
 * @param {string} event.order_id
 * @param {number} event.amount
 * @param {string} event.item
 * @param {Object} context
 * @param {(err: Error|null, res?: any) => void} callback
 * @returns {Promise<string>}
 */
export const handler=async(event,context,callback)=>{
 try{
  const bucket=process.env.RECEIPT_BUCKET;
  if(!bucket)throw new Error('RECEIPT_BUCKET not set');
  const content=`OrderID: ${event.order_id}\nAmount: $${event.amount.toFixed(2)}\nItem: ${event.item}`;
  const key=`receipts/${event.order_id}.txt`;
  const cmd=new PutObjectCommand({Bucket:bucket,Key:key,Body:content});
  await s3Client.send(cmd);
  const msg='Success'; console.log(msg);
  return callback(null,msg);
 }catch(e){console.error(e); callback(e); throw e;}
};
```

Best Practices Code:
- Separate upload logic
- Use async/await
- Initialize clients globally
- Validate env vars
- Idempotent: handle duplicate order_id

Troubleshooting:
1 PermissionDenied: ensure IAM policy includes s3:PutObject on arn:aws:s3:::<bucket>/receipts/*
2 EnvVar missing: set RECEIPT_BUCKET in function configuration
3 LambdaTimeout: increase Timeout setting
4 Cold start: minimize dependencies, use SnapStart
5 Connection errors: enable keep-alive via http.Agent keepAlive:true


## Information Dense Extract
init: npm init; install @aws-sdk/client-s3; ES module index.mjs
handler async(event[,context]) returns Promise<string>
env RECEIPT_BUCKET required
import:{S3Client,PutObjectCommand}
s3Client=new S3Client()
uploadReceiptToS3(bucket,key,body):PutObjectCommand({Bucket,Key,Body});s3Client.send()
JSDoc event shape:{order_id:string,amount:number,item:string}
IAM: s3:PutObject on arn:aws:s3:::<bucket>/receipts/*
Handler config: index.handler


## Sanitised Extract
Table of Contents
1 Project Initialization
2 Handler Definition
3 Input Event Object
4 Environment Variables
5 SDK Client Initialization
6 S3 Upload Function
7 IAM and Permissions
8 Handler Configuration

1 Project Initialization
npm init
Files:
 index.mjs or index.js
 package.json
 package-lock.json
 node_modules/

2 Handler Definition
function exported as handler in index.js/mjs
Valid signatures:
 export const handler=async(event):Promise<any>
 export const handler=async(event,context):Promise<any>
 export const handler=(event,context,callback)

3 Input Event Object
Expected JSON keys:
 order_id (string)
 amount (number)
 item (string)
JSDoc:
 @param {Object} event
 @param {string} event.order_id
 @param {number} event.amount
 @param {string} event.item
 @returns {Promise<string>}

4 Environment Variables
RECEIPT_BUCKET: string; throw Error if undefined
Access: const bucketName=process.env.RECEIPT_BUCKET

5 SDK Client Initialization
npm install @aws-sdk/client-s3
import:{S3Client,PutObjectCommand}
const s3Client=new S3Client(); // outside handler

6 S3 Upload Function
async function uploadReceiptToS3(bucketName,key,body):Promise<void>
 const cmd=new PutObjectCommand({Bucket:bucketName,Key:key,Body:body});
 await s3Client.send(cmd);
 error handling: catch and throw new Error(msg)

7 IAM and Permissions
Execution role must include:
 {'Effect':'Allow','Action':'s3:PutObject','Resource':'arn:aws:s3:::<bucket>/receipts/*'}

8 Handler Configuration
Handler setting: index.handler or index.handler for mjs
Change in console: Runtime settings > Handler

## Original Source
AWS Lambda Node.js Handler
https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html

## Digest of LAMBDA_NODEJS

# AWS Lambda Node.js Handler (retrieved 2023-10-11)

## Project Setup

npm init
index.mjs — ES module handler
package.json
package-lock.json
node_modules/

## Example index.mjs

```js
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
const s3Client=new S3Client();

/**
 * @param {Object} event
 * @param {string} event.order_id
 * @param {number} event.amount
 * @param {string} event.item
 * @returns {Promise<string>}
 */
export const handler=async(event)=>{
  const bucketName=process.env.RECEIPT_BUCKET;
  if(!bucketName)throw new Error('RECEIPT_BUCKET not set');
  const receipt=`OrderID: ${event.order_id}\nAmount: $${event.amount.toFixed(2)}\nItem: ${event.item}`;
  const key=`receipts/${event.order_id}.txt`;
  await uploadReceiptToS3(bucketName,key,receipt);
  return 'Success';
};

async function uploadReceiptToS3(bucketName,key,body){
  const cmd=new PutObjectCommand({Bucket:bucketName,Key:key,Body:body});
  await s3Client.send(cmd);
}
```

## Handler Patterns

async(event)
async(event,context)
(event,context,callback)

## Environment Variables

RECEIPT_BUCKET: string, required

## IAM Policy

Action: s3:PutObject
Resource: arn:aws:s3:::${RECEIPT_BUCKET}/receipts/*


## Attribution
- Source: AWS Lambda Node.js Handler
- URL: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
- License: License
- Crawl Date: 2025-05-19T12:30:38.031Z
- Data Size: 1647813 bytes
- Links Found: 3411

## Retrieved
2025-05-19
