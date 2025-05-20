# SERVICE_INTERFACE Feature

# Description
Provide a unified interface layer exposing the library’s core digest logic through both a CLI and an HTTP server. Users can interact via command-line flags or a RESTful API, enabling flexible integration in scripts, local development, and external services.

# Value Proposition
- Simplify access to digest processing without AWS infrastructure.  
- Support automation workflows via CLI flags for help, version, mission, and digest triggers.  
- Enable programmatic integration via HTTP POST, lowering barrier for third-party services to invoke digest logic.

# Success Criteria & Requirements
- CLI commands respond to the following flags:
  - --help: prints usage instructions and exits.
  - --version: prints package version and timestamp.
  - --mission: prints mission statement and exits.
  - --digest: simulates an SQS event and invokes digestLambdaHandler.
  - --serve [--port <number>]: starts HTTP server (default port 3000 or PORT env).
- HTTP server behavior:
  - Endpoint: POST /digest
  - Accepts JSON body matching AWS SQS event schema (Records array or single record).
  - Returns HTTP 200 with JSON { batchItemFailures: [] } on success.
  - Graceful shutdown on SIGINT/SIGTERM.

# CLI Specification
- Implement flags in main(): processHelp, processVersion, processMission, processDigest, and processServe.
- processHelp prints usage and exits.
- processVersion reads version from package.json, prints JSON { version, timestamp }.
- processMission reads MISSION.md, prints content.
- processDigest builds example digest, creates SQS event, calls digestLambdaHandler.
- processServe starts HTTP server when --serve is present.

# HTTP API Specification
- Launch when main is invoked with --serve.
- Use Express or node http module to listen on configured port.
- Accept POST requests at /digest with JSON body.
- On receipt, call digestLambdaHandler with parsed event.
- Respond with status 200 and JSON listing batchItemFailures.
- Cleanly close server on termination signals.

# Verification & Acceptance
- Unit tests cover each CLI flag behavior, verifying console output and exit flow.
- HTTP endpoint tests simulate POST /digest with valid and invalid payloads, asserting status codes and JSON responses.
- Manual verification using curl:
  curl -X POST localhost:3000/digest -d '{"Records":[{"body":"{\"key\":\"value\"}"}]}' 
