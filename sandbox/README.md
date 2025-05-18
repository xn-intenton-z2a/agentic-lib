## Mission Statement

This project is guided by the core mission of agentic-lib to enable autonomous, continuous agentic interactions through issues, branches, and pull requests. For full mission details, see [Mission Statement](../MISSION.md).

# agentic-lib

`agentic-lib` is a drop-in JavaScript SDK for autonomous GitHub workflows. Inspired by our mission to enable continuous, agentic interactions through issues, branches, and pull requests, this library provides core utilities to configure environments, handle AWS SQS events, power CLI-driven workflows, and optionally launch a self-hosted HTTP server for health, readiness, metrics, and documentation.

With `agentic-lib`, you can seamlessly integrate environment validation, structured logging, AWS utilities, Lambda handlers, CLI and programmatic workflows into your Node.js projects, ensuring reproducible, testable, and maintainable automation.

## Key Features

- **Environment configuration** (dotenv + Zod)  
  Mission Alignment: Validates and loads environment variables to ensure consistent, reproducible conditions essential for autonomous workflows.
- **Logging helpers** (logInfo, logError)  
  Mission Alignment: Provides structured, consistent logs to enable transparent audit trails for agentic operations.
- **AWS utilities** (createSQSEventFromDigest)  
  Mission Alignment: Simplifies SQS event creation for seamless integration into continuous, event-driven workflows.
- **Lambda handler** (digestLambdaHandler)  
  Mission Alignment: Automates message processing and error handling to maintain continuous, autonomous system reliability.
- **HTTP Server** (startServer function with `/health`, `/ready`, `/metrics`, `/openapi.json`, `/docs` endpoints, with configurable rate limiting and Basic Auth support)  
  Mission Alignment: Exposes self-hosted endpoints for observability, readiness checks, metrics (including request duration histogram), and interactive documentation, supporting ongoing, autonomous monitoring.
- **Request duration histogram** (`http_request_duration_seconds{method,route,status}`)  
  Mission Alignment: Exposes request duration metrics for performance monitoring.
- **CLI flags**: `--help`, `--version`, `--digest`  
  Mission Alignment: Offers intuitive CLI interfaces to drive agentic workflows directly from the command line.
