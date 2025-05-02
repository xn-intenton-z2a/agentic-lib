START_OF_README_BEGINNING

# intentïon agentic-lib

You probably want to start with the workflow documentation here: [WORKFLOWS-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/WORKFLOWS-README.md)

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your
repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and
issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using
GitHub’s `workflow_call` event, so they can be composed together like an SDK.

[Start using the Repository Template](https://github.com/xn-intenton-z2a/repository0)

[Also on GitHub Pages](https://xn-intenton-z2a.github.io/agentic-lib/index.html)

[See the latest repository stats](https://xn-intenton-z2a.github.io/agentic-lib/latest.html)

Mixed licensing:
* This project is licensed under the GNU General Public License (GPL).
* This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
* This file is licensed under the MIT License. For details, see LICENSE-MIT

This README file will evolve as the test experiment within this repository evolves but the above links remain stable.

END_OF_README_BEGINNING

# Agentic-lib Usage Guide

This document provides clear instructions for using agentic-lib's CLI functionality, designed to support autonomous workflows.

## CLI Commands

### --help

Displays usage instructions.

Example:

  node src/lib/main.js --help

**Expected Output:**

It will print the usage instructions:

  Usage:
    --help                     Show this help message and usage instructions.
    --digest                   Run a full bucket replay simulating an SQS event.
    --version                  Show version information with current timestamp.

### --version

Displays the library's version information along with the current timestamp.

Example:

  node src/lib/main.js --version

**Expected Output:**

A JSON object containing keys "version" and "timestamp".

### --digest

Simulates an SQS event containing a digest payload.

Example:

  node src/lib/main.js --digest

**Expected Output:**

Logs confirming the receipt and processing of a simulated digest event.

## Mission and Integration

agentic-lib is designed to integrate seamlessly into autonomous workflow systems, enabling self-evolving repositories. For a detailed explanation of its purpose and integration in an autonomous workflow, please refer to the [MISSION.md](../MISSION.md) file.

## Conclusion

Follow the instructions above to deploy and interact with agentic-lib effectively. This guide will be updated as new features and improvements are introduced.