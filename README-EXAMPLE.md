# agentic-lib CLI

agentic-lib is a command line utility that provides a suite of arithmetic and echo commands to demonstrate capabilities of the agentic development framework. The CLI is designed to be simple and resilient, offering basic arithmetic operations along with text echoing and demonstration modes.

## Available Commands

- **echo**: Prints the provided arguments as a string.
- **add**: Sums up a list of numeric values.
- **multiply**: Multiplies a list of numeric values. If no arguments are provided, returns 0.
- **subtract**: Subtracts subsequent numbers from the first number provided.
- **divide**: Divides the first number by each subsequent number sequentially. Aborts if division by zero is encountered.
- **power**: Raises the first number (base) to the power of the second number (exponent).
- **mod**: Computes the modulo of the first number with each of the subsequent numbers. Aborts if modulo by zero is encountered.
- **demo**: Runs a series of demos showcasing all the commands with sample inputs and outputs.
- **help**: Displays usage instructions and lists available commands.

## Usage

Execute the main script using Node.js:

```
node src/lib/main.js <command> [arguments...]
```

If no command is provided, the CLI will list all available commands. For detailed behavior of each command, try running the demo command:

```
node src/lib/main.js demo
```

## Examples

- **Echo Example**:

```
node src/lib/main.js echo Hello world
```

- **Addition Example**:

```
node src/lib/main.js add 2 3 4
```

- **Division Example** (with error handling):

```
node src/lib/main.js divide 20 4
```

## Testing

Unit tests have been set up using Vitest. To run the tests, execute:

```
npm test
```

The tests ensure that the self-test command and core functionalities are working as expected.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to open issues and submit pull requests.

## License

This project is licensed under the Apache-2.0 License.
