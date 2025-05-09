# Objective
Extend the existing CLI exit-code support to include a new dashboard visualization mode for repository metrics.

# Value Proposition
Providing an interactive dashboard allows developers and DevOps engineers to visualize key repository metrics (open issues, pull requests, stars, forks) in real time without leaving the terminal environment. This enhances monitoring, debugging, and decision-making workflows by offering immediate insights into repository health and activity.

# Scope
- Update src/lib/main.js:
  - Introduce a new processDashboard(args) handler that triggers when --dashboard is provided.
  - Extend generateUsage() to list the --dashboard flag with usage instructions.
  - Read repository owner and name from package.json’s repository field to construct API calls.
  - Use Node 20’s global fetch and config.GITHUB_API_BASE_URL to call /repos/:owner/:repo and retrieve metrics.
  - Spin up an HTTP server on default port 8080 (configurable via DASHBOARD_PORT environment variable).
  - Serve two routes:
    - GET /metrics: returns a JSON object with open_issues_count, stargazers_count, forks_count.
    - GET /: returns a simple HTML page that fetches /metrics and displays a table or chart.
- Update sandbox/tests/consoleCapture.test.js:
  - Add tests for processDashboard by mocking fetch and verifying server responses on /metrics and /.
- Update sandbox/README.md:
  - Document the --dashboard flag, environment variables, default port, and how to view the dashboard.
- Ensure all exit-code semantics remain intact: dashboard server startup exits with code 0 on success or 1 on error.

# Requirements
- Default port is 8080, overridable via DASHBOARD_PORT.
- Error handling: if fetch fails or server cannot bind, log error and exit with code 1.
- Tests must mock global fetch and HTTP requests without real network calls.
- Maintain ESM format and Node 20+ compatibility.

# Success Criteria
- Running node src/lib/main.js --dashboard starts a server, and GET /metrics returns valid JSON of metrics.
- GET / returns an HTML page containing embedded script to fetch and display metrics.
- Automated tests validate both endpoints under mocked conditions.

# Verification
1. npm test should include new dashboard tests and pass.
2. node src/lib/main.js --dashboard should log server listening and exit with 0 if PID detached.
3. curl http://localhost:8080/metrics returns a JSON object with numeric metrics.
4. curl http://localhost:8080/ returns HTML with a script tag that references /metrics.
