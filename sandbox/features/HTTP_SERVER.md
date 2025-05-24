# HTTP Server

Enable the library to serve HTTP endpoints for health checks and remote invocation of the digest handler, making it easier to integrate with external services or for local development and monitoring.

# API Endpoints

## GET /health

Return a JSON object with a status field indicating whether the server is running. This supports readiness and liveness checks in containerized or cloud environments.

## POST /digest

Accept a JSON payload representing a digest message, invoke the existing digestLambdaHandler with the supplied data, and return the result including any batch item failures. This endpoint enables remote clients to push events through the same handler logic used in AWS environments.

# CLI Flag

Add a --serve flag to the main CLI. When supplied, the application will start an Express server on a port defined by the environment variable HTTP_PORT or default to 3000. All other CLI flags are ignored when --serve is active.

# Configuration

Environment variables:
- HTTP_PORT (optional): TCP port to bind the HTTP server.
- VERBOSE_STATS: When true, include callCount and uptime in metrics responses.

# Tests

Use supertest to verify each endpoint:
- GET /health returns status up and HTTP 200.
- POST /digest with a valid digest returns a JSON containing batchItemFailures array and handler name.
- Server should respect HTTP_PORT env variable and start on that port in tests.

# README Documentation

Update README to document the new HTTP API usage examples, including curl commands for GET /health and POST /digest.
