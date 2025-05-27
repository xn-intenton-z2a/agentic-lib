# intentïon `agentic-lib`

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your
repository to operate in an “agentic” manner. Autonomous workflows communicate through branches and
issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using
GitHub’s `workflow_call` event, so they can be composed together like an SDK. This project itself is evolving, using this
tool and the reusable workflows shall become bundled actions in due course.

*Warning:* Executing these workflows shall incur charges on your OpenAI account and consume chargeable GitHub Actions resources minutes.

*Warning:* Experimental. This coding system has generated a few interesting examples (I have been educated) but nothing of personal utility.

*Warning:* This project is not yet ready for production use. You should not point the `agentic-lib` workflows a repository containing existing intellectual property.

Mixed licensing:
* This project is licensed under the GNU General Public License (GPL).
* This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
* This file is licensed under the MIT License. For details, see LICENSE-MIT

[Start using the Repository Template](https://github.com/xn-intenton-z2a/repository0)

Examples:
* [`repository0-plot-code-lib`](https://github.com/xn-intenton-z2a/repository0-plot-code-lib) - A CLI generating SVG and novel formats plots for formulae.
* Send a PR to add your example, either descending from `repository0` or using the `agentic-lib` SDK directly.

## Should you use the `agentic-lib` Coding System?

* Can you access an OpenAI account with API keys that can access at least `o3-mini` ?
* Are you willing to incur charges the resources consumed by the OpenAI API and GitHub Actions ?
* Are you curious as to where self-evolving code might lead ?
* Would you like to see how such a system can be built and has been built ?
* Do you like that it's OpenAI and GitHub API calls wired together in JS (GitHub Script) and packaged as GitHub Workflows* ?
* Do you appreciate that you need `dotenv, openai, zod` in your `package.json` because the JS has dependencies on them ?

*Actions with bundled JS coming soon.

---

## Getting Started

Clone a seed repository which is pre-configured with the reusable workflows and scripts: https://github.com/xn-intenton-z2a/repository0

### Initiating the workflow

Run the action "Create Issue" and enter some text to create an issue. This will create an issue and trigger the
"Issue Worker" to write the code. If the Issue Worker is able to resolve the issue a Pull Request is raised, the change
automatically merged. The issue reviewed and closed if the change is deemed to have delivered whatever was requested in the issue.

Development Workflows:
```
On timer / Manual: Create Issue (new issue opened) 
-> Issue Worker (code changed, issue updated) 
-> Automerge (code merged)
-> Review Issue (issue reviewed and closed)

On timer: Issue Worker (code changed, issue updated) 
-> Automerge (code merged)
-> Review Issue (issue reviewed and closed)

On timer: Automerge (code merged)
-> Review Issue (issue reviewed and closed)

On timer: Review Issue (issue reviewed and closed)
```
(Each workflow is triggered by the previous one and also on a schedule so that failures can be recovered from.)

### Tuning the agentic coding system

The default set-up is quite open which can be chaotic. To temper this chaos you can change these files which the workflow takes into consideration:
- `CONTRIBUTING.md` - The workflow is itself a contributor and will be asked to follow these guidelines. Start by writing your owm mission statement.
- `eslint.config.js` - Code style rules and additional plugins can be added here.

The following files are also taken into consideration but may also be changed (even blanked out completely) by the workflow:
- `README.md`
- `package.json`
- `src/lib/main.js`
- `tests/unit/main.test.js`

**Chain Workflows Together:**  
Use outputs from one workflow as inputs for another. For example, if an issue review workflow outputs `fixed`, then trigger an automerge workflow based on that flag.

**Customize Parameters:**  
Each workflow accepts parameters with sensible defaults. Override them as needed to fit your project’s structure and requirements.

**Seed and Evolve:**  
With a simple prompt (e.g. a new issue), the system will automatically review, generate fixes using ChatGPT, commit changes, and merge them—allowing the program to evolve autonomously.

---

## Feature Chain Workflows
These workflows work together to maintain and publish feature documentation, creating a continuous chain from source material to published web content. For detailed information, see the [WORKFLOW_CHAIN.md](features/WORKFLOW_CHAIN.md) feature file.

### Library Worker (`library-worker.yml`)
- **Function:** Maintains the library of documents by creating, updating, or extending documents based on source material.
- **Reusable Workflow:** [`wfr-completion-maintain-library.yml`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-completion-maintain-library.yml)

### Source Worker (`source-worker.yml`)
- **Function:** Maintains the sources files (SOURCES*.md) that provide URLs and metadata for the library worker.
- **Reusable Workflow:** [`wfr-completion-maintain-sources.yml`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-completion-maintain-sources.yml)

### Publish Web (`publish-web.yml`)
- **Function:** Publishes feature documentation to GitHub Pages as HTML.
- **Reusable Workflow:** [`wfr-github-publish-web.yml`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-github-publish-web.yml)

### Workflow Chain
The workflows interact in sequence: Source Worker maintains `SOURCES*.md` files → Library Worker creates/updates feature documents → Publish Web converts features to HTML and publishes to GitHub Pages. This chain can be extended with OWL semantic markup for machine-readable metadata, document traceability, and attribution information.

---

# Agentic Development System Guide

This guide explains how the various workflows of the Agentic Coding Systems work together to automate and streamline your development process. Think of these workflows as modular SDK components that encapsulate common operations—publishing, testing, issue management, dependency updates, code formatting, and more—allowing you to build an agentic development system for your projects.

---

## Issue Management Workflows
These workflows generalize the concept of work items as “tasks” rather than platform-specific issues.

### Issue Creator (`issue-creator.yml`)
- **Function:** Creates a new task based on predefined prompts.
- **Reusable Workflow:** [`wfr-create-issue.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-issue.yml@1.2.0)
- **Trigger:** Manual dispatch or scheduled events with input parameters.

### Issue Worker (`issue-worker.yml`)
- **Function:** Selects, validates, and initiates work on existing tasks.
- **Reusable Workflows:**
  - [`wfr-select-issue.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-select-issue.yml@1.2.0)
  - [`wfr-apply-issue-resolution.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-apply-issue-resolution.yml@1.2.0)
  - [`wfr-create-pr.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-pr.yml@1.2.0)

### Issue Reviewer (`issue-reviewer.yml`)
- **Function:** Reviews and finalizes tasks once work is complete.
- **Reusable Workflow:** [`wfr-review-issue.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-review-issue.yml@1.2.0)

### Automerge Workflow (`automerge.yml`)
- **Function:** Automatically merges pull requests when criteria are met.
- **Reusable Workflows:**
  - [`wfr-automerge-find-pr-from-pull-request.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-find-pr-from-pull-request.yml@1.2.0)
  - [`wfr-automerge-find-pr-in-check-suite.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-find-pr-in-check-suite.yml@1.2.0)
  - [`wfr-automerge-label-issue.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-label-issue.yml@1.2.0)
  - [`wfr-automerge-merge-pr.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-automerge-merge-pr.yml@1.2.0)

---

## Reusable Workflows SDK Guide

Think of each reusable workflow as a function in an SDK:
- **Inputs:** Parameters (e.g., `versionIncrement`, `buildScript`, `issueTitle`) customize workflow behavior.
- **Outputs:** Results such as task status, pull request numbers, or merge status.
- **Integration:** Invoke these workflows via GitHub Actions workflow calls, schedule triggers, or manual dispatch. They encapsulate complex operations into modular, reusable components.

### Example: Invoking the Issue Creator Workflow
```yaml
on:
  workflow_dispatch:
    inputs:
      issueTitle:
        description: 'Title for the new task'
        required: false
        default: ''
```
Internally, this triggers [`wfr-create-issue.yml@1.2.0`](https://github.com/xn-intenton-z2a/agentic-lib/.github/workflows/wfr-create-issue.yml@1.2.0) to generate an issue template based on provided parameters.

---

## Repository Setup Guide

Follow these steps to set up your repository using the agentic development system:

1. **Create a Repository from Template:**
  - Begin with a repository template that includes the top-level workflows (e.g., `publish.yml`, `test.yml`, `issue-creator.yml`, etc.).
  - Clone the repository locally.

2. **Configure Repository Settings:**
  - Ensure your repository supports Node.js (v20+).
  - Add the necessary secrets (e.g., `CHATGPT_API_SECRET_KEY`, `GITHUB_TOKEN`) via your repository settings.

3. **Customize Workflow Inputs:**
  - Edit workflow files under `.github/workflows/` to match your project specifics (e.g., branch names, file paths).
  - Update configuration files such as `dependabot.yml` and `FUNDING.yml` as needed.

---

## Component Breakdown

This repository is organized into three distinct areas to help you understand the purpose and maturity level of each component:

### 1. Re‑usable Workflows (Core Functionality)
- **Purpose:**  
  These workflows form the backbone of the agentic‑lib system, enabling automated coding processes such as testing, publishing, and issue management.
- **Stability:**  
  They are stable and well‑tested, designed to be integrated into your CI/CD pipelines.
- **Licensing:**  
  The core workflows are released under GPL‑3 and include an attribution requirement for any derived work.
- **Location:**  
  Find these in the `.github/workflows/` directory.

### 2. Example Workflows (Demonstrative Content)
- **Purpose:**  
  These files provide practical examples of how to use the core workflows. They serve as learning tools and reference implementations.
- **Stability:**  
  While functional, they are intended primarily for demonstration and experimentation.
- **Licensing:**  
  The example workflows are covered by the MIT license to allow for broader use and modification.
- **Location:**  
  Look in the `examples/` directory for sample implementations.

### 3. The Evolving main.js (Experimental Work in Progress)
- **Purpose:**  
  This file showcases experimental features and serves as a testbed for integrating new ideas into the system.
- **Stability:**  
  It is under active development and may change frequently. It represents bleeding‑edge functionality that might not yet be production‑ready.
- **Licensing:**  
  As part of the core project, it is under GPL‑3 with the attribution clause.
- **Location:**  
  The experimental code is located in `src/lib/main.js`.

Each of these components is documented separately to ensure you can quickly determine which parts are ready for use and which are intended as examples or experimental features.

---

## Project Structure

The key components of the project are organized as follows:

```text
.
├── Dockerfile
├── package.json
├── cdk.json
├── pom.xml
├── compose.yml
├── src/lib/main.js
├── aws/main/java/com/intention/AgenticLib/AgenticLibApp.java
├── aws/main/java/com/intention/AgenticLib/AgenticLibStack.java
├── aws/test/java/com/intentïon/AgenticLib/AgenticLibStackTest.java
└── tests/unit/main.test.js
```

Additional files include GitHub workflows (for CI/CD and maintenance scripts) and various helper scripts under the `scripts/` directory.

---

## Getting Started with local development

### Prerequisites

- [Node.js v20+](https://nodejs.org/)
- [AWS CLI](https://aws.amazon.com/cli/) (configured with sufficient permissions)
- [Java JDK 11+](https://openjdk.java.net/)
- [Apache Maven](https://maven.apache.org/)
- [AWS CDK 2.x](https://docs.aws.amazon.com/cdk/v2/guide/home.html) (your account should be CDK bootstrapped)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

---

## Local Development Environment

### Clone the Repository

```bash

git clone https://github.com/xn-intenton-z2a/agentic-lib.git
cd agentic-lib
```

### Install Node.js dependencies and test

```bash

npm install
npm test
```

### Build and test the Java Application

```bash
./mvnw clean package
```

## Setup for AWS CDK

You'll need to have run `cdk bootstrap` to set up the environment for the CDK. This is a one-time setup per AWS account and region.
General administrative permissions are required to run this command. (NPM installed the CDK.)

In this example for a user `antony-local-user` and a role `agentic-lib-github-actions-role` (create them if you need to)
we would add the following trust policy so that they can assume the role: `agentic-lib-deployment-role`:
```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "Statement1",
			"Effect": "Allow",
			"Action": ["sts:AssumeRole", "sts:TagSession"],
			"Resource": ["arn:aws:iam::541134664601:role/agentic-lib-deployment-role"]
		}
	]
}
```

The `agentic-lib-github-actions-role` also needs the following trust entity to allow GitHub Actions to assume the role:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::541134664601:oidc-provider/token.actions.githubusercontent.com"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
                },
                "StringLike": {
                    "token.actions.githubusercontent.com:sub": "repo:xn-intenton-z2a/agentic-lib:*"
                }
            }
        }
    ]
}
```

Create the IAM role with the necessary permissions to assume role from your authenticated user:
```bash

cat <<'EOF' > agentic-lib-deployment-trust-policy.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": [
          "arn:aws:iam::541134664601:user/antony-local-user",
          "arn:aws:iam::541134664601:role/agentic-lib-github-actions-role"
        ]
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
aws iam create-role \
  --role-name agentic-lib-deployment-role \
  --assume-role-policy-document file://agentic-lib-deployment-trust-policy.json
```

Add the necessary permissions to deploy `agentic-lib`:
```bash

cat <<'EOF' > agentic-lib-deployment-permissions-policy.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudformation:*",
        "iam:*",
        "s3:*",
        "cloudtrail:*",
        "logs:*",
        "events:*",
        "lambda:*",
        "dynamodb:*",
        "sqs:*",
        "sts:AssumeRole"
      ],
      "Resource": "*"
    }
  ]
}
EOF
aws iam put-role-policy \
  --role-name agentic-lib-deployment-role \
  --policy-name agentic-lib-deployment-permissions-policy \
  --policy-document file://agentic-lib-deployment-permissions-policy.json
```

Assume the deployment role:
```bash

unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY
unset AWS_SESSION_TOKEN
ROLE_ARN="arn:aws:iam::541134664601:role/agentic-lib-deployment-role"
SESSION_NAME="agentic-lib-deployment-session-local"
ASSUME_ROLE_OUTPUT=$(aws sts assume-role --role-arn "$ROLE_ARN" --role-session-name "$SESSION_NAME" --output json)
if [ $? -ne 0 ]; then
  echo "Error: Failed to assume role."
  exit 1
fi
export AWS_ACCESS_KEY_ID=$(echo "$ASSUME_ROLE_OUTPUT" | jq -r '.Credentials.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo "$ASSUME_ROLE_OUTPUT" | jq -r '.Credentials.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo "$ASSUME_ROLE_OUTPUT" | jq -r '.Credentials.SessionToken')
EXPIRATION=$(echo "$ASSUME_ROLE_OUTPUT" | jq -r '.Credentials.Expiration')
echo "Assumed role successfully. Credentials valid until: $EXPIRATION"
```
Output:
```log
Assumed role successfully. Credentials valid until: 2025-03-25T02:27:18+00:00
```

Check the session:
```bash

aws sts get-caller-identity
```

Output:
```json
{
  "UserId": "AROAX37RDWOM7ZHORNHKD:3-sqs-bridge-deployment-session",
  "Account": "541134664601",
  "Arn": "arn:aws:sts::541134664601:assumed-role/agentic-lib-deployment-role/3-sqs-bridge-deployment-session"
}
```

Check the permissions of the role:
```bash

aws iam list-role-policies \
  --role-name agentic-lib-deployment-role
```
Output (the policy we created above):
```json
{
  "PolicyNames": [
    "agentic-lib-deployment-permissions-policy"
  ]
}
```

An example of the GitHub Actions role being assumed in a GitHub Actions Workflow:
```yaml
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::541134664601:role/agentic-lib-deployment-role
          aws-region: eu-west-2
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install -g aws-cdk
      - run: aws s3 ls --region eu-west-2
```

## Deployment to AWS

See also:
* local running using [Localstack](LOCALSTACK.md).
* Debugging notes for the AWS deployment here [DEBUGGING](DEBUGGING.md).

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
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] 
[INFO] --- jar:3.4.1:jar (default-jar) @ agentic-lib ---
[INFO] Building jar: /Users/antony/projects/agentic-lib/target/agentic-lib-2.8.1-0.jar
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  18.775 s
[INFO] Finished at: 2025-04-02T00:59:55+01:00
[INFO] ------------------------------------------------------------------------
Unexpected error in background thread "software.amazon.jsii.JsiiRuntime.ErrorStreamSink": java.lang.NullPointerException: Cannot read field "stderr" because "consoleOutput" is null
```
(Yes... the last line, the error "is a bug in the CDK, but it doesn't affect the deployment", according to Copilot.)

Destroy a previous stack and delete related log groups:
```bash

npx cdk destroy
```
(The commands go in separately because the CDK can be interactive.)
```bash

aws logs delete-log-group \
  --log-group-name "/aws/s3/agentic-lib-telemetry-bucket"
aws logs delete-log-group \
  --log-group-name "/aws/lambda/agentic-lib-digest-function"
```

Create a file `secrets.env` with the following content:
```bash

export PERSONAL_ACCESS_TOKEN=Your Personal Access Token with packages:read
```

Deploys the AWS infrastructure including an App Runner service, an SQS queue, Lambda functions, and a PostgreSQL table.
```bash

. ./secrets.env
npx cdk deploy
```

Example output:
```log
...truncated...
AgenticLibStack: deploying... [1/1]
AgenticLibStack: creating CloudFormation changeset...

 ✅  AgenticLibStack

✨  Deployment time: 78.98s

Outputs:
AgenticLibStack.DigestLambdaArn = arn:aws:lambda:eu-west-2:541134664601:function:agentic-lib-digest-function
AgenticLibStack.DigestQueueUrl = https://sqs.eu-west-2.amazonaws.com/541134664601/agentic-lib-digest-queue
AgenticLibStack.EventsBucketArn = arn:aws:s3:::agentic-lib-telemetry-bucket
AgenticLibStack.EventsS3AccessRoleArn = arn:aws:iam::541134664601:role/agentic-lib-telemetry-bucket-writer-role
AgenticLibStack.digestLambdaFunctionName = agentic-lib-digest-function (Source: CDK context.)
AgenticLibStack.digestLambdaHandlerFunctionName = digestLambdaHandler (Source: CDK context.)
...truncated...
AgenticLibStack.sqsDigestQueueArn = arn:aws:sqs:eu-west-2:541134664601:agentic-lib-digest-queue (Source: CDK context.)
AgenticLibStack.sqsDigestQueueName = agentic-lib-digest-queue (Source: CDK context.)
Stack ARN:
arn:aws:cloudformation:eu-west-2:541134664601:stack/AgenticLibStack/62d89c60-0f62-11f0-852e-02fc4561559f

✨  Total time: 116.49s

```

Write to S3 (2 keys, 2 times each, interleaved):
```bash

aws s3 ls agentic-lib-telemetry-bucket/events/
for value in $(seq 1 2); do
  for id in $(seq 1 2); do
    echo "{\"id\": \"${id?}\", \"value\": \"$(printf "%010d" "${value?}")\"}" > "${id?}.json"
    aws s3 cp "${id?}.json" s3://agentic-lib-telemetry-bucket/events/"${id?}.json"
  done
done
aws s3 ls agentic-lib-telemetry-bucket/events/
```

Output:
```
upload: ./1.json to s3://agentic-lib-telemetry-bucket/events/1.json    
upload: ./1.json to s3://agentic-lib-telemetry-bucket/events/1.json   
...
upload: ./2.json to s3://agentic-lib-telemetry-bucket/events/2.json   
2025-03-19 23:47:07         31 1.json
2025-03-19 23:52:12         31 2.json
```

List the versions of all s3 objects:
```bash

aws s3api list-object-versions \
  --bucket agentic-lib-telemetry-bucket \
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

### TODO

Re-usable GitHub Actions Workflows:
- [x] Implement "apply-fix" by raising a bug, then running start-issue (with a new name) in a tolerant mode allowing builds to fail but gathering output.
- [x] Run apply fix on a schedule checking if a fix is necessary.
- [x] Add check for failed Test run then re-instate. e.g. #workflow_run:  workflows: - "Tests" / types: - completed
- [x] Detect failing build rather than relying on a passive no change
- [x] Trigger apply fix when a test run completes and attempt a fix if the tests failed, ideally just for automated branches (issues, agentic-lib-formatting, apply-linting). <- This will then fix a broken PR branch or a broken main branch.
- [x] Write issue body when creating an issue from a linting error.
- [x] repository0 init workflow which archives the 4 files (1 of 4): a generic README, package.json, src/lib/main.js, tests/unit/main.test.js, and initialises a CONTRIBUTING.md.
- [x] apply fix should create a PR if it passes.
- [x] use a single branch pre-fix and check it to avoid conflicts.
- [x] pass the change description for the commit message.
- [x] locate the issue number in apply-fix and comment the issue.
- [x] apply-fix to be able to apply a fix to the main branch.
- [x] apply-fix check branches for conflicts and try to resolve them.
- [x] pull before changes to reduce the chance of conflicts.
- [x] Dashboard metrics from github (e.g. GitHub Insights? commits by agents).
- [x] apply-fix to add issue details to the completion request.
- [x] semantic versioning for releasing versions.
- [x] [MVP] Grab the issue comments when working on an issue or a fix or a review.
- [x] [MVP] Extract prompt text to AGENT.md files.
- [x] [MVP] Add an issue refiner that picks and issues either sets 'ready', improves the issue, or closes it if irrelevant. (Then change the issue worker to look for 'ready' issues.)
- [x] [MVP] Mark in-progress issues as such, and change the issue worker to ignore 'in-progress' issues.
- [x] [MVP] Add to agentic-lib.yml a list of filepath patterns which are allowed to be changed by agents (default: [ "features/*", "library/*", "src/lib/*", "tests/unit/*", "package.json", "README.md" ]) and have these checked before writing to a file.
- [x] [MVP] Allow user supplied sources files for building the library.
- [x] [MVP] Add to agentic-lib.yml a mapping for concepts such as src / tests / docs / sources / library  and use these as defaults when invoking the workflows and at any time a default is applied.
- [x] [MVP] Why don't tests run after merge? (Possibly because it down stream of auto-merge PRs under a token of some kind .)
- [x] [MVP] Why did the issue get closed right after the merge?
- [x] [MVP] Fix (feature story): Enhance '${featureName}' CLI Command with Help Option and Usage Documentation #1653
- [x] [MVP] Attach relevant context from the library to an issue during refinement (and stop sending the whole libary to the issue worker).
- [x] [MVP] In the refiner replace the need to truncate like this ${libraryDocuments.substring(0, 10000)} by exacting the summary of each library document extracted from the markdown by extracting the summary
- [x] [MVP] In the feature maintainer replace ${libraryDocuments.substring(0, 10000)} with a condensed form of the library documents (a new section to be added to the library)
- [x] [MVP] Support creation, edit, and deletion of multiple files of each type (src, tests, docs) etc.
- [x] [MVP] Change the fix code workflows to just write to docs and read the readme
- [x] [MVP] Move the workflows except the fix code ones to read the docs and the readme.
- [x] [MVP] Remove defaulting where agentic-lib has a default directory value.
- [x] [MVP] Add a workflow to change the readme.
- [x] [Launch] Create a readOnlyFilepaths alongside readWriteFilepaths
- [x] [Launch] Support the deletion of files by specifying "delete" as the contents but ignore of it's just empty.
- [x] [Launch] Find out why issues autoclose when the PR closes (because of fixes #123) and stop this to that the issue is closed when the review is done.
- [x] [Launch] Allow the reviewer to remove an 'in-progress' label and restore 'automated' if the issue is not resolved.
- [x] [Launch] Move AGENT- files to ./github/agentic-lib/agent-*.md
- [x] [Launch] Move agentic-lib.yml to ./github/agentic-lib/agentic-lib.yml
- [x] [Launch] Find a better name for sources
- [x] [Launch] Fix these examples to match the actual behaviour: 'Can include wildcards for multiple files. e.g. "SOURCES.md" or "SOURCES*.md"'
- [x] [MVP] Check these to see that we do use semi-colon separation: allTestsPaths.split(';');
- [x] [Launch] Check to make sure we check writeability of the file before writing.
- [x] [Launch] Ensure every file path or external element referenced by the workflows, defaults to the value in agentic-lib.yml
- [x] [MVP] Set up agentic-lib to only write to supplementary files (`./sandbox`).
- [x] [MVP] Get the sandbox tests and code to run with the npm test command.
- [x] [MVP] Set up s3-sqs-bridge to only do essential updates (maintainer role)
- [x] [MVP] Set up repository0 to only write to sandbox files, reset every week by deleting the sandbox folder.
- [x] [MVP] Set up repository0-crucible to use multiple file outputs and support initialisation from a seed.
- [x] [MVP] Set up plot-code-lib to use single file outputs
- [x] Create one block per file for multiples of things like these: SOURCE_FILES_START
- [x] Add the URL of the workflow run to every issue that is touched by the workflow.
- [x] Add In-progress issue sweeper.
- [x] Clean the paths to avoid //
- [x] Recover stuck issues that are in-progress but not being worked on.
- [x] Add branch sweeper.
- [x] Add a list of all projects files to the context.
- [x] [Launch] When enhancing issues do not add duplicated documents
- [x] [Launch] Comment every issue that a worker touches with the workflow information.
- [x] [Launch] Don't run the completion jobs when there is no chatGPT key
- [x] [Launch] Don't run the contents updating jobs when there are no writable files
- [x] [Launch] Review repository and reseed if stale.
- [x] [Launch] Review mission and stop when done or failing to progress.
- [x] [Launch] Stop updating features when the features would deliver the mission.
- [x] [Launch] If the progress has been halted for <agent-lib-defined> time, then seed the repository.
- [x] [Launch] Add intentïon.md to the context.
- [x] [Launch] Update packages during reseed.
- [x] [Launch] Label issues with the related feature.
- [x] [Launch] Create up to 3 the features needed during a reseed by doing 'if featuresWIP >=1 create-one, if featuresWIP >= 2 create-two, if featuresWIP >= 3 create-three, etc...'
- [x] [Launch] Run fix code if the seed resolve issue fails.
- [x] [Launch] Add PR closure/abandonment to intentïon.md and mention the related feature.
- [x] [Launch] remove in-progress when merging or when the branch limit is reached.
- [~] [Launch] Rename seed-repository agent-flow-seed-repository-and-feature-development.yml
- [~] [Launch] Call agent-flow-seed-repository-and-feature-development.yml for flow feature development (which raises an issue).
- [~] [Launch] Give the bot the ability to create an issue by invoking the agent-flow-seed-repository-and-feature-development.yml workflow.
  (TODO: passing issue to a version of wfr-completion-generate-feature-development-issue.yml, updating the prompt.)
- [~] [Launch] Go through all the flows and transitions and where the tests are performed inside the wfr_* workflows, remove them from the outer workflows.
- [ ] [Launch] In the activity log, add a link to the commit URL for any commit applied
- [ ] [Launch] Log the outcome of attempts checks in the intentïon.md file.
- [ ] [Launch] Add a job to clear old intention branches that were not completed.
- [ ] [Launch] If the issue is already done, have the issue to code completion return a nop and handle it positively.
- [ ] [Launch] Be more ruthless about deleting features.
- [ ] [Launch] Be more bullish about declaring the mission complete.
- [ ] [Launch] When declaring mission-complete rename the branch intentïon-mission-complete-<mission name>-<date>.
- [ ] [Launch] Keep repository0 clean for use as a template and reference current experiments in repository0-js-lib (renamed from crucible) and repository0-web
- [ ] [Launch] Gather complete experiments from experiments from repository0-js-lib and repository0-web (drop plot-code-lib) for the intentïon.com showcase.
- [ ] [Launch] Set the initial states to a "Hello World!" and capture this output.
- [ ] [Launch] For all issue comments, add context to the comment such as: "After review, this issue was found to be already done."
- [ ] [Launch] Pull into agentic-lib.yml: startsWith("apply-fix-"));
- [ ] [Launch] Pull into agentic-lib.yml: startsWith("issue-worker-"));
- [ ] [Launch] Move branch pre-fix to agentic-lib.yml
- [ ] [Launch] Make the agent prompts match the top level workflow file names
- [ ] [Launch] Make the reusable workflow names match the top level workflow file names
- [ ] [Launch] When adding issue comments to a prompt, just add the last <configurable> comments.
- [ ] [Launch] Reduce the recent commits attached to prompts to 10 and only send these to review issue, discussions, and fix code.
- [ ] Allow the bot to update and delete features pro-activity and when asked to create features and include full feature detail in the response.
- [ ] Suggest that the Bot pushes back if a feature request violates the missing and contributing guidelines.
- [ ] Suggest the bot guides users towards a reseed with a new mission when a feature request is not aligned with the mission.
- [ ] Separate out writable and non-writable file paths in the prompt
- [ ] Diagram the workflow interactions.
- [ ] Pull any max file sizes into the agent config
- [ ] Commentator: news feed sources, news feed updates, news feed commentary, web publish.
- [ ] Literate: Support a more TDD / literate approach by starting a feature branch with a failing test then fix code should extract the issue details and be alerted to the test addition as TDD.
- [ ] Add a PR review workflow with a reviewer and responder.
- [ ] Update CHANGELOG.md when publishing a release version of the changes since the last release.
- [ ] Generate API.md based on the source file.
- [ ] Move check-attempts-limit into a reusable workflow.
- [ ] Investigate MCP for exposing access to repository files and github features.
- [ ] Create an MCP sever for the repositor actions and pass to ChatGPT to act.

Discussions Bot [MVP]:
- [x] On GitHub Discussions creation: Reads title and description, seeds with that as the mission, saves a trace back to documenationPath with a file a URL pointing -> the GitHub Discussion from the event,
- [x] Add workflow files to context
- [x] Answers questions about the repository in the discussion thread.
- [x] Refines the mission before getting the go-ahead to seed.
- [x] Mission file and features can be refined based on these discussions during development.
- [x] Pass posting user information to the bot.
- [x] Pass the stats to the bot to be used in the discussion.
- [x] Pass build, main and test output to the bot to be used in the discussion.
- [x] If not triggered by a discussion, use SEED_DISCUSSIONS to find the last discussion and use that to post the reply.
- [x] On schedule, set a default body of: Summarise the current state of the repository, activity since the last update and how we are tracking against the mission ad recommends next steps.
- [x] Bot to take actions within a stream (dev, seed, etc...)
- [x] When an LLM tries to write to an unwritable folder error out (ignoring creates an opportunity for a failed build.)
- [ ] [Later, JS port] Summarise and sanitize all the workflows so that they can be passed to the bot.
- [ ] [Later] Post the cost of the response in each response.

intentïon user journey [Launch UX]:
- [x] repository0-crucible seeds the repository with the mission and reports back with the intentïon branch.
- [x] Floating box logs into github and gives you an embedded formatted discussions thread.
- [x] Discussions updates also posted intentïon.com.
- [x] On intentïon.com, user provides an intention which is posted on GitHub Discussions thread.
- [x] Add branch URL to intentïon.md
- [x] Archive workflow periodically pushed to an intentïon-<date> branch (which does not run the workflows)
- [x] intentïon.com shows: Running experiment:  <link to branch>
- [x] intentïon.com shows: Running experiment:  <link to branch> + random lines from intentïon.md
- [x] Put every commit comment into intentïon.md plus some none commit activities. (copy trace-discussion from the bot)
- [x] Rename (intentionBot, intentionFilepath) to (intentionBot, intentionFilepath)
- [x] [Launch] Markdown in intentïon.md (e.g. # Activity logs\n\n ## 2025-04-20....)
- [x] [Launch] Extract the mission file from the repository and put it in the intentïon.md
- [x] [Launch] Add links to issues to intentïon.md
- [x] [Launch] Add code change Git diff output to the intentïon.md
- [x] [Launch] Add main output examples to intentïon.md
- [x] [Launch] Remove tmp files before the Git Diff
- [x] [Launch] Change link to running experiment to be a link to intentïon.md on that branch.
- [x] [Launch] Replace the sandbox with a full repository.
- [x] [Launch] Change link to running experiment to be a link to intentïon.md on main.
- [~] [Launch] Simple stream of updates from a seed to deliver a single feature.
- [ ] [Launch] Script the process from request to cloning the repository and setting it up to run the workflows.
- [ ] [Launch] Screen capture the scripted flow and post a link to this on Youtube.
- [ ] Request a promotional video.
- [ ] Automate a test Script for the process from request to cloning the repository and setting it up to run the workflows.
- [ ] Add API call duration to usage
- [ ] Echo Bot Repository summary messages in intentïon.md.
- [ ] intentïon.com shows: past experiments as websites (see comment in .com project).
- [ ] Automated demo workflow: demo.sh + DEMO.md, Maintain a demo script of commands, which the system will run and show the output for, then ask for a new version.
- [ ] Extract demo output to publish in the discussion thread and request feedback and next steps.

Collaboration
- [ ] Completion to mine past intention branches for code fragments to implement main branch features
- [ ] Completion to mine other workflows by posting on their GitHub Discussions, requesting source files mined from their history to be attached to a reply.
- [ ] Bot can process attachments, check licenses, link to the context of the feature being requested, and select the relevant parts for that feature to incorporate into the codebase.
- [ ] Free premium features for collaborating repositories requiring compatible permissive licenses.
- [ ] intentïon Feature marketplace service to allow users to request features from a community which delegate as well as share.
- [ ] Farm features using spare capacity to build features for the community.
- [ ] Token cost is available for the features creating a marketplace for low-cost (low-impact to build) features.

Marketplace GitHub Actions [Launch]:
- [x] Review all the parameters where re-usable workflows are used and ensure that any parameters that are filepaths are stated explicitly in the calling workflow.
- [x] Do this everywhere: echo "${{ env.npmAuthOrganisation }}:registry=https://npm.pkg.github.com" >> .npmrc
- [ ] Place all AWS config in repository variables and handle blank by skipping the steps if blank.
- [ ] Collect examples of demo output for the Actions documentation.
- [ ] Switch from github script actions to `run: node` and have the action run against a moving 'latest' tag.
  See: [ACTIONS_JS_STEPS.md](examples/archive-2025-04-20/ACTIONS_JS_STEPS.md)
- [ ] Add tests for the actions library JS and organise the code.
- [ ] Move JS Steps to a GitHub distributed Action.
- [ ] Convert the actions library JS to an SDK.
- [ ] Make the SDK available as an API.
- [ ] Make the API available as an MCP server.

Recycle with cost model:
- [ ] Harvest repositor0-* files into agentic-lib when reset and show case past results.
- [ ] Use the archived projects to mine for features.
- [ ] Build features in a modular way so that they can be reused in other projects.
- [ ] Bot to summarise the features in the archive and mine these during feature development.
- [ ] Log costs assigned to features in OpenAI tokens, API minutes, GitHub Actions minutes, and AWS costs.
- [ ] Optimise costs per feature against parameters in agentic-lib.yml, e.g. attemptsPerBranch or attemptsPerIssue.
- [ ] A / B test to measure value per feature.
- [ ] Explore the differentiating factors that attribute costs to features. - insight into how to work with
- [ ] Scan archived branches for implemented features which can be re-cycled.

supervisor:
- [x] Deploy a s3-sqs-bridge Stack from the agentic-lib project.
- [x] Publish GitHub telemetry data to S3.
- [x] Reintegrate the s3-sqs-bridge workflows with agentic-lib.
- [x] Switch to generating issues based on the prompts.
- [x] Reinstate the agentic workflows in s3-sqs-bridge with maintenance focused tasks.
- [x] Create a feature refiner.
- [x] Provide the feature set to all LLM submissions.
- [x] Create a feature issue creator that creates issues for a feature (like the mission prompt) for a feature picked from 'features/build'.
- [x] Distribute the issue maintenance agentic-lib workflows to the other repositories and remove the renamed ones.
- [x] Prune the features.
- [x] Scan the rejects (names) and avoid adding similar features.
- [x] Dashboard metrics from s3 into the existing all stats dashboard.
- [x] remove urls from the bottom of the stats pages
- [x] fix deployment
- [x] change stats assume role to agentic-lib-bucket-writer-role
- [x] copy website and stats json files to the bucket agentic-lib-public-website-stats-bucket
- [x] rename agentic-lib-bucket to agentic-lib-telemetry-bucket
- [x] create an issue WIP limit in agentic-lib.yml
- [x] Add a NaN filter to stop any NaN issues from being created.
- [x] In Apply Fix, limit the number if attempts to [work++fix] a branch on an issue to 3 (as per agentic-lib.yml), then comment the issue and delete the branch.
- [x] In Issue Worker, limit the number if attempts to [work] an issue on an issue to 2 (as per agentic-lib.yml), then comment and close the issue.
- [x] Before trying to apply fix a make sure there isn't an open PR.
- [x] In auto-merge, close PRs and delete branches which have conflicts.
- [x] Expose check states in the stats.
- [ ] Invoke agentic-lib workflows based on GitHub telemetry projections (e.g. build broken => apply fix) and relabel "engine" to "schedule".

supervisor: chat-pro
- [~] (free) Orchestrate the creation of a repository0-web templated repository via GitHub Discussions Chat.
- [ ] (paid) Guide and receive feedback from a repository0-web templated repository via a Slack bot or GitHub Discussions
- [ ] (capped) Join the AI repositories about their features to talk about their features on Slack.
- [ ] Re-occurring billing platform integration.
- [ ] (paid) Provision ChatGPT API keys directly to the target repository.
- [ ] Usage analytics for users.
- [ ] (paid) Usage throttling for issued ChatGPT API keys.
- [ ] Costing model for ChatGPT API keys.
- [ ] Support multiple keys per repository.
- [ ] Support multiple repositories per account.
- [ ] Add page to libray browser plugin.
- [ ] Talk to the code: Slack bot in your work Slack taking instructions from humans.
- [ ] (paid) Remember all interactions and use as context for future interactions.
- [ ] (paid) Analyse user interactions vs actual outcomes and bring this to the user's attention.
- [ ] (paid) Suggest improvements to the user and changes in direction with the user.
- [ ] Principle: Charge a margin on top of dynamically calculated shared platform costs.
- [ ] Principle: Offer free tier features where there is no running cost (e.g. libraries).
- [ ] Principle: For every paid feature there is a self-hosted or BYOKeys alternative.
- [ ] Website with auth by github or Google etc... all features available (paid via purchase of action subscription).
- [ ] Website kicks off creation and invites to Chat (support various platforms).
- [ ] Content filtering required for the website.
- [ ] Website allows submission of prompts (one at a time) for an experiment repo which runs for a bit on a branch and shares the permalink.

Supervisor launch:
- [ ] Show which agent is operating in a swim lane with a solid region where they were active.
- [ ] Live links to the repository on a commit branch visualisation with draggable timeline.
- [ ] Generate and publish to GitHub pages for the repository.
- [ ] An Agent annotation of the change linked to a commit branch visualisation.
- [ ] Animate issue workflow.
- [ ] Animate git logs applying changes to files
- [ ] Animate raising PRs.
- [ ] Include this in the repository0 template.
- [ ] Run live mode with a real-time scrolling timeline.

Repository0-web:
- [~] Set up repository0-web to documents only (elaboration role), hand off to "Repository0-web" tasklist
- [ ] New template for the repository0-web repository (without AWS).
- [ ] Reduce running of workflows to web publishing and node ci only. (role: elaborator)
- [ ] Create example templates using content from the library.
- [ ] Create a generator script / action to create the mission from some supplied text.
- [ ] agent-discussions to be able to re-initialise the repository from a discussions post.
- [ ] Identify a range of means of accessing the library content (e.g. EJS, REST).
- [ ] Add owl tags to the library content.
- [ ] Extract owl from the library content into JSON and publish as content.
- [ ] Collect a library of assets downloaded from the crawls.
- [ ] Store and present license and content attribution information on the generated website.
- [ ] Hand off to supervisor:chat : (free) Orchestrate the creation of a repository0-web templated repository via GitHub Discussions Chat.
- [ ] ./news Similar to ./library but event based news sources are scanned and new articles collected and catalogued.
- [ ] ./analysis news articles reviewed in the context of v library topics
- [ ] ./socials feed of commentary created from analysis articles
- [ ] (paid) Post to socials
- [ ] (paid) Responders suggestions of content in comments added to sources.

---

## Diary of an agentic coding system - Day 1
(An narrative exploration from ChatGPT of the repository's evolution based on the commit log, when the repository was asked to create an Equation Plotter Library.)

In the early hours, `repository0` burst into existence with a bold declaration: an Equation Plotter Library that transformed simple mathematical functions into vivid SVG art. The very first strokes on the canvas showcased the elegance of quadratic curves and the rhythmic flow of sine waves—a promise of what was to come.

Almost immediately, the code’s story took a literary turn. A series of impassioned revisions reimagined the header comment block—evolving it into a refreshed, README-style narrative. Each update sought to capture the essence of the project, meticulously detailing features like interactive zooming, custom styling, and the export of elegant SVG files. This poetic reinvention underscored a deep commitment to clarity and vision.

Then came a daring expansion. A new chapter was written when polar plot functionality emerged—a feature that redefined boundaries by converting polar coordinates into stunning Cartesian displays. The SVG output itself grew, expanding in height to make room for this new visual symphony. The addition of the polar plot was a moment of triumph, heralding a leap into unexplored dimensions.

Yet, the journey was not linear. As the repository matured, the narrative shifted once more. The demo run, once content with console outputs, was transformed to generate a tangible SVG file—a clear, striking emblem of the project’s potential. Alongside these innovations, there was a continuous cycle of refining code formatting and documentation, ensuring that every line of code echoed the clarity of its ambition.

In a final act to secure its legacy, `repository0` embraced stability by adding a package-lock file. This strategic move locked in dependencies and promised reproducible builds, cementing the project’s foundation for the future.

This has been story of [`repository0-plot-code-lib`](https://github.com/xn-intenton-z2a/repository0-plot-code-lib).

**Summary:**  
`repository0`’s evolution is marked by distinct arcs of initiative. It began with the core plotting of quadratic and sine functions, then shifted into a series of documentation and formatting enhancements. The dramatic introduction of polar plotting expanded its visual vocabulary, while changes in demo output transformed user interaction. Throughout, iterative revisions—sometimes even undoing earlier stylistic choices—revealed a dynamic, evolving vision striving for clarity and excellence.

---

## Q & A

Q.  Can you give me a summary of what it’s trying to achieve?

A. Eventually the scope will be to jump from a sentence describing anything that you could do in a single GitHub repository, 
to an in-flight software development project which runs and deploys, this is not unique with some established services out there.
My unique selling points are that you can clone your repository, which continues to evolve under your own account.
You can interact with a bot that is fed your code and previous chat history, and the prompts are customisable, including chat Bot.

Right now I’m allowing public access to a single sandbox directly from the home page. This example doesn’t scale well,
or communicate what the product is very well. I need to replace this with a simplified set of steps and an animation of
these but in a 1-2-3 it is:
1. Create a GitHub repository from our template.
2. Save a mission statement for your project.
3. Watch and interact with the AI driven refinement and development until it’s done or reset and try-again.

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
