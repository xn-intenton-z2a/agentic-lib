# Overview

Add a new CLI option --serve to launch an HTTP API server that provides endpoints for fetching entity summaries and relation triples. This feature extends the CLI tool to offer a programmable HTTP interface for building and querying the knowledge graph.

# Value Proposition

This feature enables users and downstream applications to integrate knowledge graph data in real time via RESTful endpoints. It provides a simple, always-on service that wraps existing crawl functionality, lowering the barrier for automation and orchestration in data pipelines.

# Success Criteria & Requirements

- Add a processServe function in src/lib/main.js to handle the --serve flag and optional port argument.
- Use express to start an HTTP server on the specified port (default 3000).  
- Define GET /entity endpoint that accepts query parameter name and internally calls processCrawl to fetch summary.  
- Define GET /relations endpoint that accepts query parameter name and internally calls processRelations to fetch relation triples.  
- On success, respond with JSON and HTTP 200.  
- On missing or invalid query, respond with HTTP 400 and error JSON.  
- On internal error, respond with HTTP 500 and log error via logError.  
- Write unit tests using supertest to cover server startup, valid requests, missing parameters, and error handling.  
- Update README.md to document the new --serve flag, port option, endpoints, parameters, and examples.

# Dependencies & Constraints

- Introduce express as a dependency (already present) and supertest in devDependencies.  
- Maintain ESM standards and existing code style.  
- Changes limited to src/lib/main.js, sandbox/tests, tests/unit, README.md, and package.json if needed for scripts.

# User Scenarios & Examples

A user starts the server on default port:  
node src/lib/main.js --serve  
Then fetch an entity summary:  
curl http://localhost:3000/entity?name=Eiffel Tower  
Fetch relations for an entity:  
curl http://localhost:3000/relations?name=Berlin

# Verification & Acceptance

- Unit tests start the server in test mode and use supertest to call endpoints.  
- Tests cover valid name requests for /entity and /relations and verify JSON schema.  
- Tests cover missing query parameter and confirm HTTP 400 and error response.  
- Tests simulate internal fetch errors and confirm HTTP 500 and error logged.  
- Manual test by running server and making HTTP requests with browser or curl.  
- README updated with flag description, endpoints, parameters, and example requests.