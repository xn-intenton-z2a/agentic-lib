# Overview

Unified CLI interface that consolidates sandbox environment utilities and core agentic-lib features into a single command-line tool. Provides maintenance workflows, validation checks, dependency management, AWS integrations, autonomous event handling under one entry point, and an HTTP server mode for local event ingestion.

# Commands

• --help  
  Show usage instructions and available command-line options.

• --version  
  Display current version information and timestamp.

• --digest  
  Simulate an AWS SQS event for a digest workflow, invoking the digestLambdaHandler with a sample payload.

• --generate-interactive-examples  
  Scan sandbox/README.md for mermaid-workflow blocks and render them into interactive HTML snippets in an idempotent Examples section.

• --fix-features  
  Inject mission statement references into markdown files under sandbox/features that lack one.

• --validate-features  
  Ensure all markdown files in sandbox/features reference the mission statement, failing on any missing references.

• --validate-readme  
  Verify sandbox/README.md contains links to MISSION.md, CONTRIBUTING.md, LICENSE.md, and the repository URL.

• --features-overview  
  Generate a FEATURES_OVERVIEW.md summarizing each supported CLI flag with descriptions.

• --audit-dependencies  
  Run npm audit with a configurable severity threshold and fail on vulnerabilities at or above that level.

• --bridge-s3-sqs  
  Upload payloads to S3 and dispatch an SQS message with the object location and optional message attributes.

• --validate-package  
  Parse and validate the root package.json for required fields including name, version, description, main, scripts.test, and engines.node >=20.0.0.

• --validate-tests  
  Read coverage/coverage-summary.json and ensure statements, branches, functions, and lines metrics each meet at least 80% coverage.

• --validate-lint  
  Run ESLint on sandbox source and tests, reporting any violations and failing on errors or warnings.

• --validate-license  
  Confirm LICENSE.md exists and its first non-empty line begins with a valid SPDX identifier (MIT, ISC, Apache-2.0, GPL-3.0).

• --serve-http  
  Start a lightweight HTTP server exposing a POST /events endpoint that accepts AWS SQS event payloads. The endpoint invokes digestLambdaHandler on each request and responds with JSON containing batchItemFailures and handler metadata. Supports optional --port flag to specify the listening port (default 3000) and environment variable VERBOSE_STATS to include runtime statistics in the response.

# Requirements

Node.js 20 or higher with ESM support. Git CLI for release operations. AWS credentials and region for S3/SQS bridge. Free port for HTTP server (default 3000). Dev dependencies: markdown-it, markdown-it-github, js-yaml, npm-check-updates, fastify or native http module.

# Verification & Testing

Unit tests should mock filesystem operations, child_process.spawnSync, AWS integrations, HTTP server requests, and Lambda handler logic. Integration tests can use fastify inject or native http request to send POST /events calls with a sample SQS event payload and verify correct HTTP status code, JSON response structure, and console outputs. Ensure error paths return proper 4xx or 5xx status and log JSON error messages.