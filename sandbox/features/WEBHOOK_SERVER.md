# Webhook Server

# Objective and Scope
Extend the CLI to support an HTTP server mode that listens on a configurable port for incoming JSON digest events. The mode will be activated by adding a --webhook-port option when invoking the CLI. This feature targets local testing and integration scenarios and does not modify existing default CLI behavior.

# Value Proposition
This feature simplifies local development and debugging of digest processing by allowing users to send HTTP requests instead of simulating SQS events. It enables rapid iteration on event formats and handler logic without deploying to AWS or invoking CLI flags manually.

# Requirements

- Introduce a new CLI flag --webhook-port that accepts a port number
- When --webhook-port is present, start an HTTP server on the specified port and bypass existing flag processing
- Accept POST requests with JSON body and respond with status 200 on valid payload or 400 on invalid JSON
- On valid requests, transform the JSON body into an SQS event and invoke digestLambdaHandler with proper structure
- Preserve existing logInfo and logError behavior in server context
- Handle process termination signals to shut down the server gracefully

# User Scenarios and Examples

A developer runs the CLI with --webhook-port 4000. The server listens on port 4000. The developer sends a POST request with a JSON payload representing a digest. The CLI logs the receipt of the event and processes each record through the digest handler.

# Verification and Acceptance

- Add unit tests for argument parsing and server startup with random port assignment
- Add integration style tests that start the server, send valid and invalid requests, and verify response codes and log output
- Ensure existing tests for help version and digest flags continue to pass
- Manual verification by sending requests using curl and observing JSON log entries