# Objective
Implement a new CLI command that replays all objects in a specified S3 bucket or prefix by sending each object as an SQS digest event to the existing digestLambdaHandler. This enables full-bucket replays directly from the agentic-lib CLI, closing the gap between real S3 data and test simulation.

# Value Proposition
This feature lets users trigger end-to-end processing of S3 contents without writing custom scripts: it automatically enumerates objects in S3, formats each as a digest event, and invokes the handler. It directly increases the library’s utility in real pipelines and workflows.

# Requirements & Specification

- Introduce a new CLI flag `--replay-bucket`
- Respect environment variables:
  - `S3_BUCKET_NAME` (required): the target bucket
  - `S3_PREFIX` (optional): object key prefix filter
  - AWS credentials from standard environment or shared config
- Import and use `S3Client` and `ListObjectsV2Command` from `@aws-sdk/client-s3`
- In `processReplayBucket(args)`:
  1. Create `S3Client`
  2. List all objects in the bucket (and prefix)
  3. For each object record, build a digest with `key`, `eTag`, and `lastModified`
  4. Generate an SQS event via `createSQSEventFromDigest`
  5. Invoke `digestLambdaHandler` for each event
- Integrate `processReplayBucket` into `main` after version and digest flags

# Success Criteria

- The `--replay-bucket` flag triggers a full S3 enumeration and calls `digestLambdaHandler` for every returned object
- Unit tests mock `S3Client` to return a sample set of objects and verify that `digestLambdaHandler` is called the correct number of times with correct payloads
- README updated with usage example
- Dependency `@aws-sdk/client-s3` added to `package.json`