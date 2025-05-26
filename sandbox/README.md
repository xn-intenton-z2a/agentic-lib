# Agentic-lib Sandbox CLI

This sandbox CLI for the Agentic-lib demonstrates basic Hello World functionality.

**Mission:** Print the message: "Hello World!"

See [MISSION](./MISSION.md) for the full mission statement.

## Usage

```sh
node sandbox/source/main.js [options]
```

Options:

- `--hello`        Print Hello World!
- (no arguments)   Print Hello World!
- `--help`         Show help message (`node sandbox/source/main.js --help`)
- `--version`      Show version information (`node sandbox/source/main.js --version`)
- `--digest`       Run a full bucket replay simulating an SQS event (`node sandbox/source/main.js --digest`)

### Examples

Print Hello World! (default)

```sh
$ node sandbox/source/main.js
Hello World!
```

Print Hello World! with flag

```sh
$ node sandbox/source/main.js --hello
Hello World!
```

Show help

```sh
$ node sandbox/source/main.js --help
Usage:
  --help                     Show this help message and usage instructions.
  --digest                   Run a full bucket replay simulating an SQS event.
  --version                  Show version information with current timestamp.
```

For more information, see:

- [Contributing](../CONTRIBUTING.md)
- [License](../LICENSE.md)
- [Agentic-lib Repository](https://github.com/xn-intenton-z2a/agentic-lib)
