package com.intentïon.AgenticLib;

import com.intentïon.S3SqsBridge.S3SqsBridgeStack;
import software.amazon.awscdk.App;
import software.amazon.awscdk.CfnOutput;

public class AgenticLibApp {
    public static void main(final String[] args) {
        App app = new App();

        // TODO: Build a new main.js from the one in the s3-sqs-bridge package

        // Create the AgenticLibStack with the s3 bucket name and the digest SQS queue
        AgenticLibStack agenticLibStack = AgenticLibStack.Builder.create(app, "AgenticLibStack")
                .githubActionsArnPrinciple(System.getenv("S3_GITHUB_ACTIONS_ARN_PRINCIPLE"))
                .s3BucketName(System.getenv("BUCKET_NAME"))
                .s3ObjectPrefix(System.getenv("OBJECT_PREFIX"))
                .s3UseExistingBucket(Boolean.parseBoolean(System.getenv("USE_EXISTING_BUCKET")))
                .s3RetainBucket(Boolean.parseBoolean(System.getenv("RETAIN_BUCKET")))
                .s3BucketWriterRoleName(System.getenv("S3_BUCKET_WRITER_ROLE_NAME"))
                .s3WebsiteBucketName(System.getenv("WEBSITE_BUCKET_NAME"))
                .s3UseExistingWebsiteBucket(Boolean.parseBoolean(System.getenv("USE_EXISTING_WEBSITE_BUCKET")))
                .s3RetainWebsiteBucket(Boolean.parseBoolean(System.getenv("RETAIN_WEBSITE_BUCKET")))
                .s3WebsiteBucketWriterRoleName(System.getenv("S3_WEBSITE_BUCKET_WRITER_ROLE_NAME"))
                .sqsDigestQueueName(System.getenv("SQS_DIGEST_QUEUE_NAME"))
                .sqsDigestQueueArn(System.getenv("SQS_DIGEST_QUEUE_ARN"))
                .sqsUseExistingDigestQueue(Boolean.parseBoolean(System.getenv("USE_EXISTING_DIGEST_QUEUE")))
                .sqsRetainDigestQueue(Boolean.parseBoolean(System.getenv("RETAIN_DIGEST_QUEUE"))) // TODO: Switch to removal policy
                .lambdaEntry(System.getenv("LAMBDA_ENTRY"))
                .digestLambdaFunctionName(System.getenv("DIGEST_LAMBDA_FUNCTION_NAME"))
                .digestLambdaHandlerFunctionName(System.getenv("DIGEST_LAMBDA_HANDLER_FUNCTION_NAME"))
                .githubAPIBaseUrl(System.getenv("GITHUB_API_BASE_URL"))
                .personalAccessToken(System.getenv("PERSONAL_ACCESS_TOKEN"))
                .build();

        CfnOutput.Builder.create(agenticLibStack, "EventsBucketArn")
                .value(agenticLibStack.eventsBucket.getBucketArn())
                .build();

        CfnOutput.Builder.create(agenticLibStack, "EventsS3AccessRoleArn")
                .value(agenticLibStack.s3EventsAccessRole.getRoleArn())
                .build();

        CfnOutput.Builder.create(agenticLibStack, "WebsiteBucketArn")
                .value(agenticLibStack.websiteBucket.getBucketArn())
                .build();

        CfnOutput.Builder.create(agenticLibStack, "S3WebsiteAccessRoleArn")
                .value(agenticLibStack.s3WebsiteAccessRole.getRoleArn())
                .build();

        CfnOutput.Builder.create(agenticLibStack, "DigestQueueUrl")
                .value(agenticLibStack.digestQueue.getQueueUrl())
                .build();

        CfnOutput.Builder.create(agenticLibStack, "DigestLambdaArn")
                .value(agenticLibStack.digestLambda.getFunctionArn())
                .build();

        // Reuse s3 bucket name and the digest SQS queue from the AgenticLibStack
        S3SqsBridgeStack s3SqsBridgeStack = S3SqsBridgeStack.Builder.create(app, "S3SqsBridgeStack")
                // TODO: LogGroup retention periods
                .s3BucketName(agenticLibStack.s3BucketName)
                .s3WriterRoleName(agenticLibStack.s3BucketWriterRoleName)
                // TODO: S3 LogGroup prefix
                // TODO: S3 bucket enable/disable cloudtrail
                .s3ObjectPrefix(System.getenv("OBJECT_PREFIX"))
                .s3UseExistingBucket(true)
                .s3RetainBucket(agenticLibStack.s3RetainBucket)
                // TODO: S3 bucket object lifecycle policy (delete after 1 month)
                // TODO: DLQ postfix
                // TODO: SQS Queue and DLQ retention period
                .sqsSourceQueueName(System.getenv("SQS_SOURCE_QUEUE_NAME"))
                .sqsReplayQueueName(System.getenv("SQS_REPLAY_QUEUE_NAME"))
                .sqsDigestQueueName(System.getenv("SQS_DIGEST_QUEUE_NAME"))
                .sqsDigestQueueArn(agenticLibStack.sqsDigestQueueArn)
                .sqsUseExistingDigestQueue(true)
                .sqsRetainDigestQueue(agenticLibStack.sqsRetainDigestQueue)
                .offsetsTableName(System.getenv("OFFSETS_TABLE_NAME"))
                // TODO: Offsets table partition key
                // TODO: Offsets table stack removal policy
                // TODO: Offsets table TTL (1 month)
                .projectionsTableName(System.getenv("PROJECTIONS_TABLE_NAME"))
                // TODO: Projections table partition key
                // TODO: Projections table stack removal policy
                // TODO: Projections table TTL (1 month)
                .lambdaEntry(System.getenv("LAMBDA_ENTRY"))
                // TODO: Lambda LogGroup prefix
                .replayBatchLambdaFunctionName(System.getenv("REPLAY_BATCH_LAMBDA_FUNCTION_NAME"))
                .replayBatchLambdaHandlerFunctionName(System.getenv("REPLAY_BATCH_LAMBDA_HANDLER_FUNCTION_NAME"))
                // TODO: Lambda timeout
                .sourceLambdaFunctionName(System.getenv("SOURCE_LAMBDA_FUNCTION_NAME"))
                .sourceLambdaHandlerFunctionName(System.getenv("SOURCE_LAMBDA_HANDLER_FUNCTION_NAME"))
                // TODO: Lambda timeout
                .replayLambdaFunctionName(System.getenv("REPLAY_LAMBDA_FUNCTION_NAME"))
                .replayLambdaHandlerFunctionName(System.getenv("REPLAY_LAMBDA_HANDLER_FUNCTION_NAME"))
                // TODO: Lambda timeout
                // TODO: As properties not variables: Enable/disable versioning (also allowing unlimited concurrency because we always read the latest state)
                .build();

        CfnOutput.Builder.create(s3SqsBridgeStack, "EventsBucketArn")
                .value(s3SqsBridgeStack.eventsBucket.getBucketArn())
                .build();

        CfnOutput.Builder.create(s3SqsBridgeStack, "EventsS3AccessRoleArn")
                .value(s3SqsBridgeStack.s3AccessRole.getRoleArn())
                .build();

        CfnOutput.Builder.create(s3SqsBridgeStack, "SourceQueueUrl")
                .value(s3SqsBridgeStack.sourceQueue.getQueueUrl())
                .build();

        CfnOutput.Builder.create(s3SqsBridgeStack, "ReplayQueueUrl")
                .value(s3SqsBridgeStack.replayQueue.getQueueUrl())
                .build();

        CfnOutput.Builder.create(s3SqsBridgeStack, "DigestQueueUrl")
                .value(s3SqsBridgeStack.digestQueue.getQueueUrl())
                .build();

        CfnOutput.Builder.create(s3SqsBridgeStack, "OffsetsTableArn")
                .value(s3SqsBridgeStack.offsetsTable.getTableArn())
                .build();

        CfnOutput.Builder.create(s3SqsBridgeStack, "ProjectionsTableArn")
                .value(s3SqsBridgeStack.projectionsTable.getTableArn())
                .build();

        CfnOutput.Builder.create(s3SqsBridgeStack, "ReplayBatchLambdaArn")
                .value(s3SqsBridgeStack.replayBatchLambda.getFunctionArn())
                .build();

        CfnOutput.Builder.create(s3SqsBridgeStack, "ReplayBatchLambdaLogGroupArn")
                .value(s3SqsBridgeStack.replayBatchLambdaLogGroup.getLogGroupArn())
                .build();

        CfnOutput.Builder.create(s3SqsBridgeStack, "ReplayBatchOneOffJobResourceRef")
                .value(s3SqsBridgeStack.replayBatchOneOffJobResource.getRef())
                .build();

        CfnOutput.Builder.create(s3SqsBridgeStack, "SourceLambdaArn")
                .value(s3SqsBridgeStack.sourceLambda.getFunctionArn())
                .build();

        CfnOutput.Builder.create(s3SqsBridgeStack, "ReplayLambdaArn")
                .value(s3SqsBridgeStack.replayLambda.getFunctionArn())
                .build();

        app.synth();
    }
}
