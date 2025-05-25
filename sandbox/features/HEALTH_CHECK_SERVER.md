# Objective & Scope
Provide a built-in HTTP server that exposes health and runtime metrics for monitoring and integration with observability systems. This complements the existing CLI and Lambda functionality by offering a lightweight Express endpoint to verify service health and retrieve runtime statistics.

# Value Proposition
- Enables external systems to perform health checks (e.g., Kubernetes, load balancers).  
- Allows retrieval of call count and uptime metrics at runtime.  
- Improves transparency and monitoring of agentic-lib in production environments.

# Success Criteria & Requirements
- Add a new CLI flag `--serve` in `src/lib/main.js` to start the health server.  
- Use Express (already in dependencies) to launch an HTTP server on a configurable port (default 3000).  
- Implement two routes:  
  - `/health` returns HTTP 200 with JSON `{ status: "ok" }`.  
  - `/metrics` returns HTTP 200 with JSON `{ callCount, uptime }`.  
- Ensure graceful shutdown on SIGINT/SIGTERM.
- Add necessary tests using supertest in `tests/unit` to verify endpoints and shutdown behavior.
- Document usage examples and CLI invocation in `sandbox/README.md`.

# Test Scenarios & Examples
- Starting the server with `node src/lib/main.js --serve --port 4000` and requesting `GET /health` returns `{ status: "ok" }`.  
- Requesting `GET /metrics` returns current `callCount` and `uptime` in seconds.  
- Verify server stops cleanly on process termination signals.

# Verification & Acceptance
- Automated tests in `tests/unit/health-server.test.js` pass coverage for both endpoints and shutdown.  
- Manual tests confirm endpoints respond correctly and port configuration is honored.  
- README updated with usage examples and instructions.