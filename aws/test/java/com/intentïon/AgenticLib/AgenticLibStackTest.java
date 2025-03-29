package com.intentïon.AgenticLib;

import org.junit.jupiter.api.Test;
import software.amazon.awscdk.App;
import software.amazon.awscdk.assertions.Template;

public class AgenticLibStackTest {

    @Test
    public void testStackResources() {
        App app = new App();

        AgenticLibStack stack = AgenticLibStack.Builder.create(app, "S3SqsBridgeConfigureAndBuildStack")
                .s3WriterArnPrinciple("arn:aws:iam::123456789012:user/test")
                .s3WriterRoleName("agentic-lib-bucket-writer-role-test")
                .s3BucketName("agentic-lib-bucket-test")
                .s3ObjectPrefix("test/")
                .s3UseExistingBucket(false)
                .s3RetainBucket(false)
                .sqsSourceQueueName("agentic-lib-source-queue-test")
                .sqsReplayQueueName("agentic-lib-replay-queue-test")
                .sqsDigestQueueName("agentic-lib-digest-queue-test")
                // TODO: The digest queue ARN should be optional and omitted in this test.
                .sqsDigestQueueArn("arn:aws:sqs:eu-west-2:123456789012:agentic-lib-digest-queue-test")
                .sqsUseExistingDigestQueue(false)
                .sqsRetainDigestQueue(false)
                .offsetsTableName("agentic-lib-offsets-table-test")
                .projectionsTableName("agentic-lib-projections-table-test")
                .lambdaEntry("src/lib/main.")
                .replayBatchLambdaFunctionName("agentic-lib-replay-batch-function")
                .replayBatchLambdaHandlerFunctionName("replayBatchLambdaHandler")
                .sourceLambdaFunctionName("agentic-lib-source-function")
                .sourceLambdaHandlerFunctionName("sourceLambdaHandler")
                .replayLambdaFunctionName("agentic-lib-replay-function")
                .replayLambdaHandlerFunctionName("replayLambdaHandler")
                .build();

        Template template = Template.fromStack(stack);
        template.resourceCountIs("AWS::SQS::Queue", 6);
        template.resourceCountIs("AWS::Lambda::Function", 6);
    }
}
