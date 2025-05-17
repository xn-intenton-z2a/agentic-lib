# Objective & Scope
Extend library core event handler to include agentic AI driven code analysis and suggestion alongside existing CLI support and HTTP endpoints

# Value Proposition
- Enable autonomous analysis and suggestion flows triggered by GitHub issues or pull requests via CLI or HTTP
- Simplify integration into CI pipelines and workflow calls
- Maintain consistent JSON logging across CLI HTTP and lambda handlers for observability

# Success Criteria & Requirements
## Event Handler
- createSQSEventFromDigest generate aws sqs records from digest
- digestLambdaHandler process sqs event records parse JSON bodies log info collect and return batch failures

## Agentic Handler
- agenticHandler accept event payload containing issueUrl or id fetch issue details via GitHub api use openai createChatCompletion call with system and user messages return structured suggestions including message refinement summary
- handle errors return error code and message identifier

## CLI Commands
- help display usage instructions
- version output version timestamp as JSON
- digest simulate sqs digest event call digestLambdaHandler
- agentic accept issueUrl or id call agenticHandler output suggestions as JSON

## HTTP Endpoints
- POST /digest accept JSON body as digest convert to sqs event invoke digestLambdaHandler respond with batch failures and handler metadata
- POST /stats accept JSON body with discussionUrl or id run statistics retrieval respond with metrics
- POST /agentic accept JSON body with issueUrl or id invoke agenticHandler respond with suggestion JSON
- GET /health return service name uptime and callCount

# Testability & Stability
- unit tests for agenticHandler mocking openai and github apis validate success and error paths
- integration tests for CLI agentic command validate output status codes and JSON schema
- supertest mocks for HTTP endpoints verify correct responses and error handling

# Dependencies & Constraints
- Node 20 esm module standard
- use openai client no additional dependencies
- configurable via environment variables GITHUB_API_BASE_URL GITHUB_TOKEN OPENAI_API_KEY HTTP_PORT
- use built in http module and zod for input validation

# User Scenarios & Examples
- CLI run agentic with issueUrl value prints suggestions
- HTTP POST /agentic with JSON body containing issueUrl returns suggestion JSON

# Verification & Acceptance
- npm test passes tests covering agentic flows and existing features
- endpoints respond with 200 success 400 bad request 500 server error as defined
- no unhandled exceptions or crashes across CLI HTTP or lambda handlers