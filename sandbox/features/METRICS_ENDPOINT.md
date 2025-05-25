# Objective

Expose an HTTP endpoint at path /metrics that returns runtime metrics for the service in JSON format

# Value Proposition

Enable operators and monitoring systems to gather key performance indicators such as total requests served, current process uptime, CPU and memory usage, and help with autoscaling, alerting, and capacity planning without relying on external tooling.

# Requirements

- Extend the existing Express HTTP server
- Read the port from environment variable METRICS_PORT or use HEALTH_PORT fallback
- Track total number of HTTP requests received since service start
- Respond to GET /metrics with JSON object containing:
  - requestCount: number of HTTP requests served since launch
  - uptime: process uptime in seconds
  - memoryUsage: RSS, heapTotal, heapUsed (from process.memoryUsage())

# Success Criteria & Requirements

- GET /metrics returns HTTP status code 200
- Response JSON has keys requestCount, uptime, memoryUsage
- memoryUsage is an object with keys rss, heapTotal, heapUsed as numeric values

# User Scenarios & Examples

- As an operator I can curl http://localhost:METRICS_PORT/metrics to view current metrics
- As a Prometheus exporter I can scrape /metrics endpoint periodically for custom metrics

# Verification & Acceptance

- Write unit tests to start server on an ephemeral port and assert GET /metrics returns correct status and JSON shape
- Update sandbox/tests to cover /metrics endpoint behavior
- Update sandbox/README.md with usage and example curl command
