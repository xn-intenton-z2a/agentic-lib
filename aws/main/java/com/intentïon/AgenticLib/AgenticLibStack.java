package com.intentïon.AgenticLib;

import software.amazon.awscdk.CfnOutput;
import software.amazon.awscdk.Duration;
import software.amazon.awscdk.RemovalPolicy;
import software.amazon.awscdk.Stack;
import software.amazon.awscdk.StackProps;
import software.amazon.awscdk.services.cloudtrail.S3EventSelector;
import software.amazon.awscdk.services.cloudtrail.Trail;
import software.amazon.awscdk.services.iam.ArnPrincipal;
import software.amazon.awscdk.services.iam.Effect;
import software.amazon.awscdk.services.iam.PolicyDocument;
import software.amazon.awscdk.services.iam.PolicyStatement;
import software.amazon.awscdk.services.iam.Role;
import software.amazon.awscdk.services.lambda.AssetImageCodeProps;
import software.amazon.awscdk.services.lambda.DockerImageCode;
import software.amazon.awscdk.services.lambda.DockerImageFunction;
import software.amazon.awscdk.services.lambda.eventsources.SqsEventSource;
import software.amazon.awscdk.services.lambda.eventsources.SqsEventSourceProps;
import software.amazon.awscdk.services.logs.LogGroup;
import software.amazon.awscdk.services.logs.LogGroupProps;
import software.amazon.awscdk.services.logs.RetentionDays;
import software.amazon.awscdk.services.s3.Bucket;
import software.amazon.awscdk.services.s3.IBucket;
import software.amazon.awscdk.services.sqs.DeadLetterQueue;
import software.amazon.awscdk.services.sqs.IQueue;
import software.amazon.awscdk.services.sqs.Queue;
import software.constructs.Construct;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class AgenticLibStack extends Stack {

    public IBucket eventsBucket;
    public LogGroup eventsBucketLogGroup;
    public Trail eventsBucketTrail;
    public Role s3EventsAccessRole;
    public IBucket websiteBucket;
    public  LogGroup websiteBucketLogGroup;
    public Trail websiteBucketTrail;
    public Role s3WebsiteAccessRole;
    public IQueue digestQueue;
    public Queue digestQueueDLQ;
    public DockerImageFunction digestLambda;
    public LogGroup digestLambdaLogGroup;

    public static class Builder {
        public Construct scope;
        public String id;
        public StackProps props;
        public String s3WriterArnPrinciple;
        public String s3WriterRoleName;
        public String s3BucketName;
        public String s3ObjectPrefix;
        public boolean s3UseExistingBucket;
        public boolean s3RetainBucket;
        public String s3WebsiteBucketName;
        public boolean s3UseExistingWebsiteBucket;
        public boolean s3RetainWebsiteBucket;
        public String sqsDigestQueueName;
        public String sqsDigestQueueArn;
        public boolean sqsUseExistingDigestQueue;
        public boolean sqsRetainDigestQueue;
        public String lambdaEntry;
        public String digestLambdaFunctionName;
        public String digestLambdaHandlerFunctionName;
        public String githubAPIBaseUrl;
        public String personalAccessToken;

        public Builder(Construct scope, String id, StackProps props) {
            this.scope = scope;
            this.id = id;
            this.props = props;
        }

        public static Builder create(Construct scope, String id) {
            Builder builder = new Builder(scope, id, null);
            return builder;
        }

        public static Builder create(Construct scope, String id, StackProps props) {
            Builder builder = new Builder(scope, id, props);
            return builder;
        }

        public Builder s3WriterArnPrinciple(String s3WriterArnPrinciple) {
            this.s3WriterArnPrinciple = s3WriterArnPrinciple;
            return this;
        }

        public Builder s3WriterRoleName(String s3WriterRoleName) {
            this.s3WriterRoleName = s3WriterRoleName;
            return this;
        }

        public Builder s3BucketName(String s3BucketName) {
            this.s3BucketName = s3BucketName;
            return this;
        }

        public Builder s3ObjectPrefix(String s3ObjectPrefix) {
            this.s3ObjectPrefix = s3ObjectPrefix;
            return this;
        }

        public Builder s3UseExistingBucket(boolean s3UseExistingBucket) {
            this.s3UseExistingBucket = s3UseExistingBucket;
            return this;
        }

        public Builder s3RetainBucket(boolean s3RetainBucket) {
            this.s3RetainBucket = s3RetainBucket;
            return this;
        }

        public Builder s3WebsiteBucketName(String s3WebsiteBucketName) {
            this.s3WebsiteBucketName = s3WebsiteBucketName;
            return this;
        }

        public Builder s3UseExistingWebsiteBucket(boolean s3UseExistingWebsiteBucket) {
            this.s3UseExistingWebsiteBucket = s3UseExistingWebsiteBucket;
            return this;
        }

        public Builder s3RetainWebsiteBucket(boolean s3RetainWebsiteBucket) {
            this.s3RetainWebsiteBucket = s3RetainWebsiteBucket;
            return this;
        }

        public Builder sqsDigestQueueName(String sqsDigestQueueName) {
            this.sqsDigestQueueName = sqsDigestQueueName;
            return this;
        }

        public Builder sqsDigestQueueArn(String sqsDigestQueueArn) {
            this.sqsDigestQueueArn = sqsDigestQueueArn;
            return this;
        }

        public Builder sqsUseExistingDigestQueue(boolean sqsUseExistingDigestQueue) {
            this.sqsUseExistingDigestQueue = sqsUseExistingDigestQueue;
            return this;
        }

        public Builder sqsRetainDigestQueue(boolean sqsRetainDigestQueue) {
            this.sqsRetainDigestQueue = sqsRetainDigestQueue;
            return this;
        }

        public Builder lambdaEntry(String lambdaEntry) {
            this.lambdaEntry = lambdaEntry;
            return this;
        }

        public Builder digestLambdaFunctionName(String digestLambdaFunctionName) {
            this.digestLambdaFunctionName = digestLambdaFunctionName;
            return this;
        }

        public Builder digestLambdaHandlerFunctionName(String digestLambdaHandlerFunctionName) {
            this.digestLambdaHandlerFunctionName = digestLambdaHandlerFunctionName;
            return this;
        }

        public Builder githubAPIBaseUrl(String githubAPIBaseUrl) {
            this.githubAPIBaseUrl = githubAPIBaseUrl;
            return this;
        }

        public Builder personalAccessToken(String personalAccessToken) {
            this.personalAccessToken = personalAccessToken;
            return this;
        }

        public AgenticLibStack build() {
            AgenticLibStack stack = new AgenticLibStack(this.scope, this.id, this.props, this);
            return stack;
        }

    }

    public String s3BucketName;
    public String s3ObjectPrefix;
    public boolean s3UseExistingBucket;
    public boolean s3RetainBucket;
    public String s3WebsiteBucketName;
    public boolean s3UseExistingWebsiteBucket;
    public boolean s3RetainWebsiteBucket;
    public String sqsDigestQueueArn;
    public boolean sqsUseExistingDigestQueue;
    public boolean sqsRetainDigestQueue;
    public String digestLambdaFunctionName;
    public String digestLambdaHandlerFunctionName;

    public AgenticLibStack(Construct scope, String id, AgenticLibStack.Builder builder) {
        this(scope, id, null, builder);
    }

    public AgenticLibStack(Construct scope, String id, StackProps props, AgenticLibStack.Builder builder) {
        super(scope, id, props);

        this.s3BucketName = this.getConfigValue(builder.s3BucketName, "s3BucketName");
        this.s3ObjectPrefix = this.getConfigValue(builder.s3ObjectPrefix, "s3ObjectPrefix");
        this.s3UseExistingBucket = Boolean.parseBoolean(this.getConfigValue(Boolean.toString(builder.s3UseExistingBucket), "s3UseExistingBucket"));
        this.s3RetainBucket = Boolean.parseBoolean(this.getConfigValue(Boolean.toString(builder.s3RetainBucket), "s3RetainBucket"));
        this.s3WebsiteBucketName = this.getConfigValue(builder.s3WebsiteBucketName, "s3WebsiteBucketName");
        this.s3UseExistingWebsiteBucket = Boolean.parseBoolean(this.getConfigValue(Boolean.toString(builder.s3UseExistingWebsiteBucket), "s3UseExistingWebsiteBucket"));
        this.s3RetainWebsiteBucket = Boolean.parseBoolean(this.getConfigValue(Boolean.toString(builder.s3RetainWebsiteBucket), "s3RetainWebsiteBucket"));
        String s3WriterRoleName = this.getConfigValue(builder.s3WriterRoleName, "s3WriterRoleName");
        String s3WriterArnPrinciple = this.getConfigValue(builder.s3WriterArnPrinciple, "s3WriterArnPrinciple");
        String sqsDigestQueueName = this.getConfigValue(builder.sqsDigestQueueName, "sqsDigestQueueName");
        this.sqsDigestQueueArn = this.getConfigValue(builder.sqsDigestQueueArn, "sqsDigestQueueArn");
        this.sqsUseExistingDigestQueue = Boolean.parseBoolean(this.getConfigValue(Boolean.toString(builder.sqsUseExistingDigestQueue), "sqsUseExistingDigestQueue"));
        this.sqsRetainDigestQueue = Boolean.parseBoolean(this.getConfigValue(Boolean.toString(builder.sqsRetainDigestQueue), "sqsRetainDigestQueue"));
        String lambdaEntry = this.getConfigValue(builder.lambdaEntry, "lambdaEntry");
        this.digestLambdaHandlerFunctionName = this.getConfigValue(builder.digestLambdaHandlerFunctionName, "digestLambdaHandlerFunctionName");
        this.digestLambdaFunctionName = this.getConfigValue(builder.digestLambdaFunctionName, "digestLambdaFunctionName");
        String githubAPIBaseUrl = this.getConfigValue(builder.githubAPIBaseUrl, "githubAPIBaseUrl");
        String personalAccessToken = this.getConfigValue(builder.personalAccessToken, "personalAccessToken");

        if (s3UseExistingBucket) {
            this.eventsBucket = Bucket.fromBucketName(this, "EventsBucket", s3BucketName);
        } else {
            this.eventsBucket = Bucket.Builder.create(this, "EventsBucket")
                    .bucketName(s3BucketName)
                    .versioned(true)
                    .removalPolicy(s3RetainBucket ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY)
                    .autoDeleteObjects(!s3RetainBucket)
                    .build();
            this.eventsBucketLogGroup = LogGroup.Builder.create(this, "EventsBucketLogGroup")
                    .logGroupName("/aws/s3/" + this.eventsBucket.getBucketName())
                    .retention(RetentionDays.THREE_DAYS)
                    .build();
            this.eventsBucketTrail = Trail.Builder.create(this, "EventsBucketAccessTrail")
                    .trailName(this.eventsBucket.getBucketName() + "-access-trail")
                    .cloudWatchLogGroup(this.eventsBucketLogGroup)
                    .sendToCloudWatchLogs(true)
                    .cloudWatchLogsRetention(RetentionDays.THREE_DAYS)
                    .includeGlobalServiceEvents(false)
                    .isMultiRegionTrail(false)
                    .build();
            this.eventsBucketTrail.addS3EventSelector(Arrays.asList(S3EventSelector.builder()
                    .bucket(this.eventsBucket)
                    .objectPrefix(s3ObjectPrefix)
                    .build()
            ));
        }

        PolicyStatement eventsObjectCrudPolicyStatement = PolicyStatement.Builder.create()
                .effect(Effect.ALLOW)
                .actions(List.of(
                        "s3:PutObject",
                        "s3:GetObject",
                        "s3:ListBucket",
                        "s3:DeleteObject"
                ))
                .resources(List.of(
                        this.eventsBucket.getBucketArn(),
                        this.eventsBucket.getBucketArn() + "/" + s3ObjectPrefix + "*"
                ))
                .build();
        this.s3EventsAccessRole = Role.Builder.create(this, "EventsS3AccessRole")
                .roleName(s3WriterRoleName)
                .assumedBy(new ArnPrincipal(s3WriterArnPrinciple))
                .inlinePolicies(java.util.Collections.singletonMap("S3AccessPolicy", PolicyDocument.Builder.create()
                        .statements(List.of(eventsObjectCrudPolicyStatement))
                        .build()))
                .build();

        if (s3UseExistingWebsiteBucket) {
            this.websiteBucket = Bucket.fromBucketName(this, "WebsiteBucket", s3WebsiteBucketName);
        } else {
            this.websiteBucket = Bucket.Builder.create(this, "WebsiteBucket")
                    .bucketName(s3WebsiteBucketName)
                    .websiteIndexDocument("index.html")
                    //.websiteErrorDocument("error.html")
                    .removalPolicy(s3RetainWebsiteBucket ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY)
                    .autoDeleteObjects(!s3RetainWebsiteBucket)
                    .build();
            this.websiteBucketLogGroup = LogGroup.Builder.create(this, "WebsiteBucketLogGroup")
                    .logGroupName("/aws/s3/" + this.websiteBucket.getBucketName())
                    .retention(RetentionDays.THREE_DAYS)
                    .build();
            this.websiteBucketTrail = Trail.Builder.create(this, "WebsiteucketAccessTrail")
                    .trailName(this.websiteBucket.getBucketName() + "-access-trail")
                    .cloudWatchLogGroup(this.websiteBucketLogGroup)
                    .sendToCloudWatchLogs(true)
                    .cloudWatchLogsRetention(RetentionDays.THREE_DAYS)
                    .includeGlobalServiceEvents(false)
                    .isMultiRegionTrail(false)
                    .build();
            this.websiteBucketTrail.addS3EventSelector(Arrays.asList(S3EventSelector.builder()
                    .bucket(this.websiteBucket)
                    .build()
            ));
        }

        PolicyStatement websiteObjectCrudPolicyStatement = PolicyStatement.Builder.create()
                .effect(Effect.ALLOW)
                .actions(List.of(
                        "s3:PutObject",
                        "s3:GetObject",
                        "s3:ListBucket",
                        "s3:DeleteObject"
                ))
                .resources(List.of(
                        this.websiteBucket.getBucketArn(),
                        this.websiteBucket.getBucketArn() + "/*"
                ))
                .build();
        this.s3WebsiteAccessRole = Role.Builder.create(this, "S3WebsiteAccessRole")
                .roleName(s3WriterRoleName)
                .assumedBy(new ArnPrincipal(s3WriterArnPrinciple))
                .inlinePolicies(java.util.Collections.singletonMap("S3AccessPolicy", PolicyDocument.Builder.create()
                        .statements(List.of(websiteObjectCrudPolicyStatement))
                        .build()))
                .build();

        Duration digestLambdaDuration = Duration.seconds(5);
        Duration digestQueueDuration = Duration.seconds(digestLambdaDuration.toSeconds().intValue() * 2);
        if (sqsUseExistingDigestQueue) {
            this.digestQueue = Queue.fromQueueArn(this, "DigestQueue", sqsDigestQueueArn);
        } else {
            this.digestQueueDLQ = Queue.Builder.create(this, "DigestQueueDLQ")
                    .queueName(sqsDigestQueueName + "-dlq")
                    .retentionPeriod(Duration.days(3))
                    .build();
            this.digestQueue = Queue.Builder.create(this, "DigestQueue")
                    .queueName(sqsDigestQueueName)
                    .visibilityTimeout(digestQueueDuration)
                    .removalPolicy(sqsRetainDigestQueue ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY)
                    .retentionPeriod(Duration.hours(24))
                    .deadLetterQueue(DeadLetterQueue.builder()
                            .queue(this.digestQueueDLQ)
                            .maxReceiveCount(5)
                            .build())
                    .build();
        }

        this.digestLambda = DockerImageFunction.Builder.create(this, "DigestLambda")
                .code(DockerImageCode.fromImageAsset(".", AssetImageCodeProps.builder()
                        .buildArgs(Map.of("HANDLER", lambdaEntry + digestLambdaHandlerFunctionName))
                        .buildArgs(Map.of("PERSONAL_ACCESS_TOKEN", personalAccessToken))
                        .build()))
                .environment(Map.of(
                        "GITHUB_API_BASE_URL", githubAPIBaseUrl
                ))
                .functionName(digestLambdaFunctionName)
                .reservedConcurrentExecutions(1)
                .timeout(digestLambdaDuration)
                .build();
        this.digestLambdaLogGroup = new LogGroup(this, "DigestLambdaLogGroup", LogGroupProps.builder()
                .logGroupName("/aws/lambda/" + this.digestLambda.getFunctionName())
                .retention(RetentionDays.THREE_DAYS)
                .removalPolicy(RemovalPolicy.DESTROY)
                .build());
        this.digestLambda.addEventSource(new SqsEventSource(this.digestQueue, SqsEventSourceProps.builder()
                .batchSize(1)
                .maxBatchingWindow(Duration.seconds(0))
                .build()));
    }

    private String getConfigValue(String customValue, String contextKey) {
        if (customValue == null || customValue.isEmpty()) {
            Object contextValue = null;
            try {
                contextValue = this.getNode().tryGetContext(contextKey);
            }catch (Exception e) {
                // NOP
            }
            if (contextValue != null && !contextValue.toString().isEmpty()) {
                CfnOutput.Builder.create(this, contextKey)
                        .value(contextValue.toString() + " (Source: CDK context.)")
                        .build();
                return contextValue.toString();
            } else {
                throw new IllegalArgumentException("No customValue found or context key " + contextKey);
            }
        }
        return customValue;
    }
}
