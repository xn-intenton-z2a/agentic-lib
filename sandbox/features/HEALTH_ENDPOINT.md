# Objective

Provide an HTTP endpoint at path /health that returns the current status of the service

# Value Proposition

Enables monitoring and orchestration systems to verify that the agentic library process is running and healthy without invoking CLI commands

# Requirements

- Use express to stand up a minimal HTTP server
- Read the port from environment variable HEALTH_PORT or use default port 3000
- Respond with a JSON object containing fields status, uptime and timestamp

# Success Criteria & Requirements

- /health returns HTTP status code 200
- Response JSON has keys status uptime timestamp
- status is always set to ok when the process is running
- uptime is the process uptime in seconds
- timestamp is the current ISO timestamp

# User Scenarios & Examples

- As an operator I can curl http localhost colon HEALTH_PORT slash health to check service status
- As a kubernetes readiness or liveness probe I can configure http get on slash health to retrieve ok status

# Verification & Acceptance

- Write unit tests to start server on an ephemeral port and request slash health and assert correct status code and response shape
- Manual test with curl against running sandbox source CLI with --serve flag should return valid JSON
- Include integration test in sandbox tests directory