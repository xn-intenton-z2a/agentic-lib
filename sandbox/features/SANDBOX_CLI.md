> See our [Mission Statement](../../MISSION.md)

# SANDBOX CLI

Detailed information about the sandbox CLI commands provided in this repository. Use the commands below to interact with the sandbox environment:

- **--validate-features**: Ensure all feature files in `sandbox/features/` reference the mission statement.
- **--fix-features**: Add missing mission statement references to feature files in `sandbox/features/`.
- **--generate-interactive-examples**: Render Mermaid workflow code blocks in `sandbox/README.md` into interactive HTML examples.
- **--features-overview**: Generate a summary of all sandbox CLI flags and their descriptions.
- **--audit-dependencies**: Audit npm dependencies for vulnerabilities by severity threshold.
- **--bridge-s3-sqs**: Upload payloads to S3 and dispatch SQS messages.
- **--validate-package**: Validate the root `package.json` manifest fields.
- **--validate-tests**: Check that test coverage metrics meet the 80% threshold.
- **--validate-lint**: Run ESLint on sandbox source and tests.
- **--validate-license**: Verify `LICENSE.md` exists and contains a valid SPDX identifier.
- **--validate-readme**: Check that `sandbox/README.md` contains critical references including MISSION.md, CONTRIBUTING.md, LICENSE.md, and the repository URL.
- **--validate-dependency-licenses**: Scan all installed npm dependencies to ensure each has a valid SPDX license identifier. Log errors for any dependencies with missing or invalid license fields and optionally generate a markdown summary report at `sandbox/docs/DEPENDENCY_LICENSES.md` summarizing each dependency and its license.
