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
                .sqsDigestQueueName("agentic-lib-digest-queue-test")
                .sqsDigestQueueArn("arn:aws:sqs:eu-west-2:123456789012:agentic-lib-digest-queue-test")
                .sqsUseExistingDigestQueue(false)
                .sqsRetainDigestQueue(false)
                .lambdaEntry("src/lib/main.")
                .digestLambdaFunctionName("agentic-lib-digest-function-test")
                .digestLambdaHandlerFunctionName("digestLambdaHandler")
                .githubAPIBaseUrl("https://api.github.com.test/")
                .personalAccessToken("ghp_test")
                .build();

        Template template = Template.fromStack(stack);
        template.resourceCountIs("AWS::SQS::Queue", 2);
        template.resourceCountIs("AWS::Lambda::Function", 2);
    }
}
