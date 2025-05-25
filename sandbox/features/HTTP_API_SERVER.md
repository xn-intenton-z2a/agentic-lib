# HTTP API Server
Provide an Express based HTTP server to receive digest events over HTTP and forward them to digestLambdaHandler for processing

# Routes
- GET /health check endpoint returns status code 200 and JSON status OK
- POST /digest receives a JSON body representing a digest object validates required fields key value and lastModified then invokes digestLambdaHandler with a synthetic SQS event

# Configuration
PORT environment variable controls server listen port defaulting to 3000

# Logging and Error Handling
Incoming requests and responses are logged using logInfo and logError functions
Invalid JSON payload or processing errors return status code 400 or 500 with structured error response
Batch item failures from digest processing are returned in POST response

# Testing and Verification
Add supertest based tests for GET health and POST digest scenarios covering successful processing invalid payload and handler failures
Verify server starts and listens on configured port
Ensure tests run under sandbox path tests using npm test