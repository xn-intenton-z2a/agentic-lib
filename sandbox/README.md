# agentic-lib Sandbox CLI

This sandbox provides a simple CLI to demonstrate the core mission of agentic-lib:

> Print the message: Hello World! as mentioned in reply Print the message: Hello World!

## CLI Usage

Run the sandbox script using Node.js or npm:

```bash
# Using npm script
npm run sandbox -- [options]

# Direct invocation with Node.js
node sandbox/source/main.js [options]
```

### Supported Options

- `--hello`
  Prints `Hello World!` to standard output and exits immediately.
- *(no flags)*
  Prints the provided argument list in the format `Run with: [...]`.

## Examples

```bash
# Print Hello World!
npm run sandbox -- --hello
# Output: Hello World!

node sandbox/source/main.js --hello
# Output: Hello World!

# Default behavior when no flags provided
npm run sandbox
# Output: Run with: []
```

---

For contribution guidelines, refer to [CONTRIBUTING.md](../CONTRIBUTING.md).
For the project mission, see [MISSION.md](./MISSION.md).
