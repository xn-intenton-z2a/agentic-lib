# Objective

Provide common CLI flags in the sandbox wrapper to improve usability and align with core library behavior.

# Value Proposition

- Enables users to discover and understand available commands via a help flag without inspecting source code.
- Provides version information tied to package.json, ensuring transparency about the current release in sandbox mode.
- Retains existing behavior when no known flags are provided, preserving backwards compatibility.

# Requirements & Success Criteria

1. Update sandbox/source/main.js to detect and handle the following flags:
   - `--help`: print a usage summary showing supported flags and exit with code 0.
   - `--version`: read the version field from package.json and print it, then exit with code 0.
2. When neither `--help` nor `--version` is supplied, maintain the current behavior of printing the raw argument array.
3. Add automated tests in sandbox/tests/main.test.js or a new sandbox test file to cover:
   - Invocation with `--help` returns exit code 0 and prints a usage summary.
   - Invocation with `--version` returns exit code 0 and prints the correct version from package.json.
   - Invocation with no flags or unknown flags continues to print the argument array without error.
4. Update sandbox/README.md with examples for:
   - Running `node sandbox/source/main.js --help`.
   - Running `node sandbox/source/main.js --version`.
   - Running `node sandbox/source/main.js some arbitrary args`.
5. Ensure no additional dependencies are introduced.
6. Preserve existing sandbox/test setup so that current tests for basic termination continue to pass.

# Dependencies & Constraints

- Use ESM dynamic import or `import packageJson from '../../package.json' assert { type: 'json' }` to read version.
- Maintain Node 20 compatibility and ESM standards in sandbox/source/main.js.
- Tests should use Vitest as configured in sandbox package.json.

# User Scenarios

1. A new developer runs `node sandbox/source/main.js --help` to see available commands.
2. A CI script queries `node sandbox/source/main.js --version` to verify the deployed sandbox version.
3. An engineer experiments with sandbox CLI by passing custom arguments and observing the raw output.

# Verification & Acceptance

- All new and existing tests in sandbox/tests pass without modification to core library files.
- Manual testing confirms help and version flags behave as specified, and default behavior is unchanged.
