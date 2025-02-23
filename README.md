# agentic-lib Agentic Coding Systems SDK

You probably want to start with the workflow documentation here: [WORKFLOWS-README.md](WORKFLOWS-README.md)

This project is licensed under the GNU General Public License (GPL).

## Quick Start

To get started, run the following command to see available options:

Usage: node src/lib/main.js <command> [arguments...]

Available commands:
  - self-test: Runs the self-test suite.
  - demo: Runs a demonstration of functionalities.
  - publish: Runs the publish command (stubbed functionality, full implementation planned).
  - config: Displays configuration options.
  - help: Displays this help message.
  - version: Displays the current version.
  - timestamp: Displays the current timestamp.
  - about: Displays project information.
  - status: Displays a summary of the project status (name, version, and current timestamp).

## Extended Functionality

This release refactors the CLI to simplify package management by introducing a helper function to load package details and centralize error handling. New commands such as "about" and "status" provide extended insights about the project configuration and current state.

**Note:** The publish functionality is currently a stub. Full publishing capabilities and further automated enhancements are planned for future releases.

## Future Work

- Full publish command implementation with automated deployment.
- Enhanced task management features including dependency updates, formatting, and linting automation.
- Integration with continuous deployment pipelines and extended OpenAI API based code reviews.

## Running Tests

To run tests, execute:

  npm test

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the GNU General Public License (GPL). See [LICENSE](LICENSE) for details.
