# agentic-lib CLI

agentic-lib is a command line utility that provides a suite of arithmetic and echo commands to demonstrate the capabilities of the agentic development framework. The CLI is designed to be simple and resilient, offering basic arithmetic operations along with text echoing, demonstration modes, and extended GitHub Script functionality.

## Available Commands

- **echo**: Prints the provided arguments as a string.
- **add**: Sums up a list of numeric values.
- **multiply**: Multiplies a list of numeric values. If no arguments are provided, returns 0.
- **subtract**: Subtracts subsequent numbers from the first number provided.
- **divide**: Divides the first number by each subsequent number sequentially. Aborts if division by zero is encountered.
- **power**: Raises the first number (base) to the power of the second number (exponent).
- **mod**: Computes the modulo of the first number with each of the subsequent numbers. Aborts if modulo by zero is encountered.
- **demo**: Runs a series of demos showcasing all the commands with sample inputs and outputs.
- **githubscript**: Reads extended environment variables and file contents, mimicking the GitHub Script fragment. It logs details about the files and environment parameters such as model, API keys, issue numbers, and outputs from various commands. Note that GitHub API calls, OpenAI integration, and issue comment creation are not implemented.
- **help**: Displays usage instructions and lists available commands.

## Usage

Execute the main script using Node.js:

```
node src/lib/main.js <command> [arguments...]
```

If no command is provided, the CLI will list all available commands. For detailed behavior of each command, try running the demo or githubscript command:

```
node src/lib/main.js demo
```

```
node src/lib/main.js githubscript
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

- **GitHub Script Example** (requires appropriate environment variables):

```
node src/lib/main.js githubscript
```

## Testing

Unit tests have been set up using Vitest. The updated test suite now covers all core arithmetic commands along with additional command tests. To run the tests, execute:

```
npm test
```

## Next Up

The following improvements are planned for upcoming releases:

- Improve error handling across commands for robust input validation.
- Add new arithmetic commands and additional options.
- Integrate real GitHub API interactions to enable dynamic operations in the githubscript command.
- Expand test coverage with additional unit and integration tests.
- Enhance CLI help documentation with more comprehensive examples and interactive guidance.
- Implement an interactive mode to allow dynamic user input and command execution.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to open issues and submit pull requests.

## License

This project is licensed under the Apache-2.0 License.
