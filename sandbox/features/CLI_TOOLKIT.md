# Objective & Scope

Extend the unified command-line interface to support a new --health flag that performs environment and connectivity health checks for required services.

# Value Proposition

• Provide users and CI pipelines with a quick verification tool to confirm that environment variables and external services are reachable before executing workflows.
• Surface missing or misconfigured settings early, reducing time spent debugging runtime failures.

# Success Criteria & Requirements

• Invocation of --health returns exit code zero when all checks pass and non-zero when any check fails.
• Health report output includes a JSON or human-readable summary of each check, indicating pass or fail and any error messages.
• Users may pass --health --format=json to receive a structured JSON document with fields for each health check.
• CLI help usage text updated to document --health and --format flags.
• Achieve at least 90% line coverage in main.js covering processHealth logic and error handling.

# Implementation Details

1. Add processHealth(args) helper in main.js:
   • Detect --health flag and optional --format=json flag.
   • Verify that config.GITHUB_API_BASE_URL and config.OPENAI_API_KEY are defined; log error for any missing variable.
   • Perform simple fetch HEAD requests to GITHUB_API_BASE_URL and OPENAI API base endpoint; handle network errors and timeouts.
   • Aggregate results into a healthReport object listing each check name, status, and error message if applicable.
   • If format is json, output JSON string of healthReport; otherwise output formatted text summary.
   • Return true and exit code zero when all checks pass; otherwise log errors and return false or non-zero code.
2. Export processHealth for direct testing.
3. Update generateUsage() to include --health and --format flags in help text.
4. Invoke processHealth(args) in main() prior to the fallback usage and exit handling.

# Testing & Verification

• Create Vitest tests under tests/unit for:
  – processHealth([--health]) returns true and logs a summary string when all checks mock succeed.
  – processHealth([--health,--format=json]) returns an object matching the healthReport schema.
  – Missing environment variables triggers error logs and non-zero exit code.
  – Simulated network failure for fetch results in failed status for the corresponding check.
• Mock global fetch and environment variables to verify behavior.

# Documentation Updates

• Update sandbox/README.md usage section to include examples for --health and --format=json outputs.
• Document list of health checks, expected statuses, and CI integration examples.