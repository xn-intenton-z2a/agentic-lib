# agentic-lib (Versioned Amazon S3 Object Put Event replay capable queuing to SQS)

An alternate version of the Deployment to AWS with localstack and direct execution of JavaScript.

---

## Getting Started Locally

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

Run digest processor job:
```bash
cat >>EOF > digest.json
{
  "branches": {
    "main": {
      "id": "main",
      "workflowRuns": {
        "test.yml": {
          "id": "test.yml",
          "workflowRunId": "1234567890",
          "workflowRunAttempt": 1,
          "status": "completed",
          "conclusion": "success",
          "createdAt": "2025-03-18T21:22:35.000Z",
          "updatedAt": "2025-03-18T21:22:35.000Z"
        }
      }
    }
  }
}
EOF
PROJECTIONS_TABLE_NAME=agentic-lib-projections-table-local \
AWS_ENDPOINT='http://localhost:4566' \
npm run digest-processor -- --digest-file digest.json
```

Output:
```log
TODO
```

### Start Local Services

Launch with LocalStack (Simulates AWS S3 and SQS endpoints):
```bash

docker compose up --detach localstack
```

Create the digest queue:
```bash

aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name agentic-lib-digest-queue-local
```

Add a message to the digest queue:
```bash
cat >>EOF > digest.json
{
  "branches": {
    "main": {
      "id": "main",
      "workflowRuns": {
        "test.yml": {
          "id": "test.yml",
          "workflowRunId": "1234567890",
          "workflowRunAttempt": 1,
          "status": "completed",
          "conclusion": "success",
          "createdAt": "2025-03-18T21:22:35.000Z",
          "updatedAt": "2025-03-18T21:22:35.000Z"
        }
      }
    }
  }
}
EOF
aws --endpoint-url=http://localhost:4566 sqs send-message \
  --queue-url http://sqs.eu-west-2.localhost.localstack.cloud:4566/000000000000/agentic-lib-digest-queue-local \
  --message-body file://digest.json
```

Observe message on the SQS digest queue:
```bash

aws --endpoint-url=http://localhost:4566 sqs receive-message \
--queue-url http://sqs.eu-west-2.localhost.localstack.cloud:4566/000000000000/agentic-lib-digest-queue-local
```

Message on digest queue:
```json
{
  "Messages": [
    {
      "MessageId": "f3b0c4a2-5d8e-4b7c-9f1d-6a0e5f3c8b2d",
      "ReceiptHandle": "AQEBwJ...==",
      "MD5OfBody": "d41d8cd98f00b204e9800998ecf8427e",
      "Body": "{\"branches\":{\"main\":{\"id\":\"main\",\"workflowRuns\":{\"test.yml\":{\"id\":\"test.yml\",\"workflowRunId\":\"1234567890\",\"workflowRunAttempt\":1,\"status\":\"completed\",\"conclusion\":\"success\",\"createdAt\":\"2025-03-18T21:22:35.000Z\",\"updatedAt\":\"2025-03-18T21:22:35.000Z\"}}}}}"
    }
  ]
}
```

Launch the digest processor in a Container (the same Docker file is used for the lambda):
```bash

docker compose up --detach digest-processor
```

docker compose logs digest-processor
```bash

docker compose logs digest-processor
```

Check the Docker logs for a message consumed from the digest queue:
```log
TODO
```

---

### Handy Commands

Handy cleanup, Docker:
```bash

docker system prune --all --force --volumes
```

Handy cleanup, Node:
```bash

rm -rf node_modules ; rm -rf package-lock.json ; npm install
```

Run the Docker container with a shell instead of the default entrypoint:
```bash

docker build -t agentic-lib .
docker run -it \
  --env BUCKET_NAME='agentic-lib-bucket-local' \
  --env OBJECT_PREFIX='events/' \
  --env REPLAY_QUEUE_URL='http://sqs.eu-west-2.localhost.localstack.cloud:4566/000000000000/agentic-lib-replay-queue-local' \
  --env AWS_ENDPOINT='http://localhost:4566' \
  --entrypoint /bin/bash \
  agentic-lib:latest
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
