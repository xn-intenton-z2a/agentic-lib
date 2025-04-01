# agentic-lib (Debugging on AWS)

An expanded version of the Deployment to AWS with additional utility commands and debugging steps.

---

## Deployment to AWS

### Clone the Repository

```bash

git clone https://github.com/xn-intenton-z2a/agentic-lib.git
cd agentic-lib
```

### Install Node.js Dependencies and test

```bash

npm install
npm test
```

Package the CDK, deploy the CDK stack which rebuilds the Docker image, and deploy the AWS infrastructure:
```bash

./mvnw clean package
```

Maven build output:
```log
...truncated...
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] 
[INFO] --- maven-jar-plugin:2.4:jar (default-jar) @ agentic-lib ---
[INFO] Building jar: /Users/antony/projects/agentic-lib/target/agentic-lib-0.0.1.jar
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  13.743 s
[INFO] Finished at: 2025-03-18T22:19:37Z
[INFO] ------------------------------------------------------------------------
Unexpected error in background thread "software.amazon.jsii.JsiiRuntime.ErrorStreamSink": java.lang.NullPointerException: Cannot read field "stderr" because "consoleOutput" is null
```
(Yes... the last line, the error "is a bug in the CDK, but it doesn't affect the deployment", according to Copilot.)

Destroy a previous stack and delete related log groups:
```bash

npx cdk 
```
(The commands go in separately because the CDK can be interactive.)
```bash

aws logs delete-log-group \
  --log-group-name "/aws/lambda/agentic-lib-digest-function"
```

Deploys the AWS infrastructure:
```bash

npx cdk deploy
```

Example output:
```log
...truncated...
S3SqsBridgeStack: success: Published f23b4641b15bfe521c575e572ebe41ca2c4613e3e1ea8a9c8ef816c73832cddf:current_account-current_region
S3SqsBridgeStack: deploying... [1/1]
S3SqsBridgeStack: creating CloudFormation changeset...

 ✅  S3SqsBridgeStack

✨  Deployment time: 105.48s

Outputs:
S3SqsBridgeStack.BucketArn = arn:aws:s3:::agentic-lib-bucket
S3SqsBridgeStack.OffsetsTableArn = arn:aws:dynamodb:eu-west-2:541134664601:table/offsets
S3SqsBridgeStack.OneOffJobLambdaArn = arn:aws:lambda:eu-west-2:541134664601:function:replayBatchLambdaHandler
S3SqsBridgeStack.ReplayQueueUrl = https://sqs.eu-west-2.amazonaws.com/541134664601/agentic-lib-replay-queue
...truncated...
S3SqsBridgeStack.s3BucketName = agentic-lib-bucket (Source: CDK context.)
S3SqsBridgeStack.s3ObjectPrefix = events/ (Source: CDK context.)
S3SqsBridgeStack.s3RetainBucket = false (Source: CDK context.)
S3SqsBridgeStack.s3UseExistingBucket = false (Source: CDK context.)
Stack ARN:
arn:aws:cloudformation:eu-west-2:541134664601:stack/S3SqsBridgeStack/30cf37a0-0504-11f0-b142-06193d47b789

✨  Total time: 118.12s

```

Write to S3 (2 keys, 2 times each, interleaved):
```bash

aws s3 ls agentic-lib-bucket/events/
for value in $(seq 1 2); do
  for id in $(seq 1 2); do
    echo "{\"id\": \"${id?}\", \"value\": \"$(printf "%010d" "${value?}")\"}" > "${id?}.json"
    aws s3 cp "${id?}.json" s3://agentic-lib-bucket/events/"${id?}.json"
  done
done
aws s3 ls agentic-lib-bucket/events/
```

Output:
```
upload: ./1.json to s3://agentic-lib-bucket/events/1.json    
upload: ./1.json to s3://agentic-lib-bucket/events/1.json   
...
upload: ./2.json to s3://agentic-lib-bucket/events/2.json   
2025-03-19 23:47:07         31 1.json
2025-03-19 23:52:12         31 2.json
```

List the versions of all s3 objects:
```bash

aws s3api list-object-versions \
  --bucket agentic-lib-bucket \
  --prefix events/ \
  | jq -r '.Versions[] | "\(.LastModified) \(.Key) \(.VersionId) \(.IsLatest)"' \
  | head -5 \
  | tail -r
```

Output (note grouping by key, requiring a merge by LastModified to get the Put Event order):
```log
2025-03-23T02:37:10+00:00 events/2.json NGxS.PCWdSlxMPVIRreb_ra_WsTjc4L5 false
2025-03-23T02:37:12+00:00 events/2.json 7SDSiqco1dgFGKZmRk8bjSoyi5eD5ZLW true
2025-03-23T02:37:09+00:00 events/1.json cxY1weJ62JNq4DvqrgfvIWKJEYDQinly false
2025-03-23T02:37:11+00:00 events/1.json wHEhP8RdXTD8JUsrrUlMfSANzm7ahDlv true
```

Check the projections table:
```bash

aws dynamodb scan \
  --table-name agentic-lib-projections-table \
  --output json \
  | jq --compact-output '.Items[] | with_entries(if (.value | has("S")) then .value = .value.S else . end)' \
  | tail --lines=5
```

Output:
```json lines
{"id":"events/1.json","value":"{\"id\": \"1\", \"value\": \"0000000002\"}\n"}
{"id":"events/2.json","value":"{\"id\": \"2\", \"value\": \"0000000002\"}\n"}
```

Count the attributes on the digest queue:
```bash

aws sqs get-queue-attributes \
  --queue-url https://sqs.eu-west-2.amazonaws.com/541134664601/agentic-lib-digest-queue \
  --attribute-names ApproximateNumberOfMessages
```

Output:
```json
{
  "Attributes": {
    "ApproximateNumberOfMessages": "4"
  }
}
```

---

## Debugging

List the versions of one s3 object:
```bash

aws s3api list-object-versions \
  --bucket agentic-lib-bucket \
  --prefix events/1.json \
  | jq -r '.Versions[] | "\(.LastModified) \(.VersionId)"' \
  | head -5 \
  | tail -r
```
      
output:
```log
2025-03-20T19:41:00+00:00 2noSga6Gzo8Tgv_LRN6KhDyfxItokdhV
2025-03-20T19:41:01+00:00 IVvCthHy3USr7htaRW_Px12gLmDUMDci
2025-03-20T19:41:01+00:00 YI1qVe4r1jlQJU7K7.KUrQhuXa_N7Gzc
2025-03-20T19:41:02+00:00 alzPWnOMUMOmpM5St8EvnDAZ4jR3L5WM
2025-03-20T19:41:03+00:00 krC5yOc7ESrGCo2KQn.V_5FuT6WK7m_U
```

Count the attributes on the digest queue:
```bash

aws sqs get-queue-attributes \
  --queue-url https://sqs.eu-west-2.amazonaws.com/541134664601/agentic-lib-digest-queue \
  --attribute-names ApproximateNumberOfMessages
```

Output:
```json
{
    "Attributes": {
        "ApproximateNumberOfMessages": "0"
    }
}
```

### Handy Commands

Handy cleanup, Docker:
```bash

docker system prune --all --force --volumes
```

Handy cleanup, CDK:
```bash

rm -rf cdk.out
```

Handy cleanup, Node:
```bash

rm -rf node_modules ; rm -rf package-lock.json ; npm install
```


Delete log groups:
```bash

aws logs delete-log-group \
  --log-group-name "/aws/lambda/agentic-lib-digest-function"
```

Handy cleanup, CDK:
```bash

rm -rf cdk.out
```

---

## License

This project is licensed under the GNU General Public License (GPL). See [LICENSE](LICENSE) for details.

License notice:
```
agentic-lib
Copyright (C) 2025 Polycode Limited

agentic-lib is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License v3.0 (GPL‑3).
along with this program. If not, see <https://www.gnu.org/licenses/>.

IMPORTANT: Any derived work must include the following attribution:
"This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
```

*IMPORTANT*: The project README and any derived work should always include the following attribution:
_"This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"_
