# Value Proposition
Provide a unified command-line interface in both sandbox and core contexts that allows users to discover project information, inspect mission details, simulate event streams, and retrieve version metadata, all from a single entry point.

# Success Criteria & Requirements

## 1. Help Command (--help)
- When invoked with --help in either sandbox/source/main.js or src/lib/main.js, display usage instructions and all available flags.
- Update generateUsage in both modules to enumerate supported flags: --help, --mission, --digest, --version.
- After printing help, exit early without executing any other logic.

## 2. Mission Command (--mission)
- When invoked with --mission in sandbox/source/main.js and src/lib/main.js, read the MISSION.md file in the project root as UTF-8 text.
- On success, print the raw markdown content to stdout and exit early.
- On failure to read the file, call logError with a descriptive message and error details, then exit early.
- Add tests for core CLI in tests/unit to assert that --mission reads MISSION.md and logs content; error path logs error.

## 3. Version Command (--version)
- When invoked with --version, load package.json from the project root, parse the version field, and construct an object containing version and current ISO timestamp.
- Print the object as a JSON string to stdout and exit early.
- On any error, call logError with a descriptive message and stack if available, then exit early.

## 4. Digest Command (--digest)
- When invoked with --digest, construct a sample digest payload containing key, value, and lastModified timestamp.
- Use createSQSEventFromDigest to build an SQS event and call digestLambdaHandler with it.
- Ensure that logInfo and logError calls within the handler surface event receipt, record processing, and any failures.
- After handler completes, exit early.

## 5. Default Behavior
- If no recognized flag is provided, print "No command argument supplied.", then display usage instructions.
- Ensure that only one command path executes per invocation.

# Usage Documentation
- Update sandbox/docs/USAGE.md and sandbox/README.md to reflect help, mission, version, and digest options with examples.
- Update core CLI documentation in README.md and docs/USAGE.md to match sandbox behavior, including --mission examples.

# Tests Coverage
- Add or update unit tests in sandbox/tests and tests/unit:
  - --help prints usage and exits early in both CLI modules.
  - --mission reads MISSION.md and logs content; error path logs error in both CLI modules.
  - --version prints JSON with correct version and timestamp; error path logs error.
  - --digest invokes createSQSEventFromDigest and digestLambdaHandler; mock logging for success and failure.
  - Default invocation prints no-argument message and usage.

# Dependencies & Constraints
- Use existing ESM modules: fs/promises, zod, dotenv, and native fetch support.
- Do not introduce new external packages beyond those listed in package.json.
- Maintain Node >=20 compatibility and ESM structure.
- Limit changes to source files, test files, README files, and package.json if fetch polyfill is required.