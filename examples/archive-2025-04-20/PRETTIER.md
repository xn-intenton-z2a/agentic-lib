# PRETTIER

## Crawl Summary
Prettier is an opinionated code formatter that reprints source code by ignoring original styling and applying consistent formatting according to line length. It supports multiple languages (JavaScript, JSX, Angular, etc.) and has options such as trailingComma, tabWidth, and experimental features like objectWrap and experimentalOperatorPosition. It integrates with editors and automated workflows (CLI, pre-commit hooks) and its releases include detailed changes and bug fixes.

## Normalised Extract
# Table of Contents
1. Supported Languages
2. Formatting Mechanism
3. Code Examples
4. Configuration Options
5. Integration and Usage
6. Release Notes
7. Comparison with Linters

---

## 1. Supported Languages
- JavaScript (including experimental features)
- JSX
- Angular, Vue
- Flow, TypeScript
- CSS, Less, SCSS
- HTML, Ember/Handlebars
- JSON, GraphQL
- Markdown (GFM, MDX v1)
- YAML

## 2. Formatting Mechanism
- Prettier parses code into an AST to disregard original styling (only preserving necessary parts such as empty lines and multi-line object formats) and reprints the code conforming to a maximum line length.
- If code fits in one line, it remains unchanged; otherwise, it is reformatted to multiple lines.

## 3. Code Examples
**Before Formatting:**

    foo(arg1, arg2, arg3, arg4);

**After Formatting (for long argument list):**

    foo(
      reallyLongArg(),
      omgSoManyParameters(),
      IShouldRefactorThis(),
      isThereSeriouslyAnotherOne(),
    );

## 4. Configuration Options
- "trailingComma": Default "all". Inserts trailing commas in multi-line structures.
- "tabWidth": Number of spaces per indent (default: 2).
- "semi": Boolean flag to add semicolons (default: true).
- "singleQuote": Boolean to enforce single quotes (default: false).
- "objectWrap": New option in 3.5 for wrapping objects.
- "experimentalOperatorPosition": Experimental flag for controlling operator positioning.
- Optional TypeScript configuration file support for enhanced integration.

## 5. Integration and Usage
- CLI command: `prettier --write "./src/**/*.{js,jsx,ts,tsx}"`
- Use in editors through plugins (VS Code, Sublime, Vim, etc.)
- Integrate in pre-commit hooks.

## 6. Release Notes
- **Prettier 3.5:** New `objectWrap` and `experimentalOperatorPosition` options; TypeScript config file support.
- **Prettier 3.1:** Introduced `--experimental-ternaries` for improved nested ternary formatting and Angular control flow syntax.
- **Prettier 3.0:** Migrated to ECMAScript Modules; breaking changes in markdown formatting and plugin API.

## 7. Comparison with Linters
- Prettier handles formatting exclusively by reprinting code, while linters manage code quality (unused variables, implicit globals, etc.).


## Supplementary Details
# Supplementary Technical Specifications

## Prettier Configuration Example (.prettierrc)

    {
      "trailingComma": "all",
      "tabWidth": 2,
      "semi": true,
      "singleQuote": false,
      "printWidth": 80,
      "objectWrap": "preserve",  // New option in 3.5
      "experimentalOperatorPosition": false
    }

## Command Line Usage

- Format files and overwrite them:

      prettier --write "./src/**/*.{js,jsx,ts,tsx}"

- Check formatting without writing changes:

      prettier --check "./src/**/*.{js,jsx,ts,tsx}"

## Integration Examples

### VS Code Settings

    "editor.formatOnSave": true,
    "prettier.singleQuote": false,
    "prettier.trailingComma": "all",
    "prettier.tabWidth": 2

### Git Pre-commit Hook Example (using Husky)

    // package.json
    "husky": {
      "hooks": {
        "pre-commit": "prettier --write ."
      }
    }

## Implementation Steps
1. Install Prettier: `npm install --save-dev prettier`
2. Add configuration file (.prettierrc) with desired options.
3. Integrate with your editor or add a pre-commit hook.
4. Run `prettier --write` for automatic code formatting.

## Detailed Parameter Values and Effects
- trailingComma: "all" ensures that all multi-line arrays and objects have a trailing comma, which improves diff clarity.
- tabWidth: 2 (default) defines how many spaces represent one indentation level.
- semi: true appends a semicolon at the end of statements, reducing potential ASI pitfalls.
- printWidth: 80 characters per line forces code wrapping to maintain readability.


## Reference Details
# Complete API and SDK Specifications

## Prettier API (Node.js)

Import and format code using the Prettier API:

    // Import the Prettier module
    const prettier = require('prettier');

    /**
     * Formats the given source code string based on options.
     * @param {string} source - The source code to format.
     * @param {Object} options - Formatting options.
     * @param {string} [options.parser] - The parser to use (e.g., "babel", "typescript", "css", "html").
     * @param {"all"|"none"|"es5"} [options.trailingComma] - Trailing comma configuration.
     * @param {number} [options.tabWidth] - Number of spaces per indent (default is 2).
     * @param {boolean} [options.semi] - Whether to add semicolons (default is true).
     * @param {boolean} [options.singleQuote] - Whether to use single quotes (default is false).
     * @returns {string} - The formatted code string.
     * @throws {Error} - Throws an error if formatting fails.
     */
    function formatCode(source, options) {
      try {
        return prettier.format(source, options);
      } catch (error) {
        console.error('Formatting error:', error);
        throw error;
      }
    }

// Example usage:

    const sourceCode = "function sum(a, b){return a+b;}";

    const options = {
      parser: "babel",
      trailingComma: "all",
      tabWidth: 2,
      semi: true,
      singleQuote: false
    };

    const formatted = formatCode(sourceCode, options);
    console.log(formatted);

## SDK Method Signatures

- Method: prettier.format(source: string, options: PrettierOptions): string

Where PrettierOptions is defined as:

    interface PrettierOptions {
      parser: string;             // e.g., "babel", "typescript", "css", "html"
      trailingComma?: "all" | "none" | "es5";
      tabWidth?: number;          // default 2
      semi?: boolean;             // default true
      singleQuote?: boolean;      // default false
      printWidth?: number;        // default 80
      // Additional experimental options
      objectWrap?: string;        // e.g., "preserve"
      experimentalOperatorPosition?: boolean;
    }

## Full Code Example with Comments

    // Example: Formatting a JavaScript function using Prettier API
    const prettier = require('prettier');

    // Source code to be formatted
    const code = `function greet(name){console.log("Hello, " + name + "!");}`;

    // Define formatting options
    const options = {
      parser: "babel",
      trailingComma: "all",
      tabWidth: 2,
      semi: true,
      singleQuote: false,
      printWidth: 80
    };

    try {
      // Format the code using Prettier
      const formattedCode = prettier.format(code, options);
      console.log('Formatted Code:\n', formattedCode);
    } catch (error) {
      // Detailed troubleshooting: print error and exit
      console.error('Error during formatting:', error);
    }

## Troubleshooting Procedures

1. If formatting fails with an error, run Prettier in debug mode:

       DEBUG=prettier:* prettier --write .

   Expected output: Detailed logs of the parsing and formatting process.

2. Verify that the correct parser is installed and specified (e.g., use "babel" for JavaScript).

3. For plugin issues, check that plugins support the ECMAScript Modules if using Prettier 3.0+.

4. If integration in editors fails, check the editor console for errors and ensure that the Prettier plugin extension is up-to-date.

5. Use the command:

       prettier --check "./src/**/*.{js,jsx,ts,tsx}"

   to determine which files are improperly formatted.

6. Consult the Prettier repository issues for similar error messages and resolutions.


## Original Source
Prettier Documentation
https://prettier.io/docs/en/index.html

## Digest of PRETTIER

# Prettier Documentation

Date Retrieved: 2023-10-06

## Overview
Prettier is an opinionated code formatter. It supports many languages including JavaScript (with experimental features), JSX, Angular, Vue, Flow, TypeScript, CSS (Less/SCSS), HTML, Ember/Handlebars, JSON, GraphQL, Markdown (GFM and MDX v1) and YAML. It works by parsing the source code into an abstract syntax tree (AST) and then reprinting it following its own rules to enforce a consistent code style.

## Formatting Mechanism
- **Input:** Original source code.
- **Process:** Parses the code into an AST. Ignores original formatting/styling (with some preserved elements like empty lines and multi-line objects) and reprints the code while considering the maximum line length, wrapping where necessary.
- **Output:** Reformatted code that conforms to a consistent style.

## Code Example

Before Formatting:

    foo(arg1, arg2, arg3, arg4);

After Formatting (for long parameter list):

    foo(
      reallyLongArg(),
      omgSoManyParameters(),
      IShouldRefactorThis(),
      isThereSeriouslyAnotherOne(),
    );

## Supported Options and Configuration

Prettier supports several configuration options. For example:

- **trailingComma**: Controls trailing commas in multi-line constructs. The default in recent versions is set to "all".
- **tabWidth**: A number that specifies the number of spaces per indentation level (default is 2).
- **semi**: Boolean indicating whether to add semicolons at the ends of statements (default is true).
- **singleQuote**: Boolean indicating whether to use single quotes instead of double quotes (default is false).
- **objectWrap**: A new option in Prettier 3.5 which manages how objects are wrapped.
- **experimentalOperatorPosition**: An experimental flag to control operator positioning.
- **TypeScript Config File Support**: Added for integrating TypeScript configuration seamlessly.

## Integration and Usage

Prettier is integrated into multiple environments including editor integrations and Git hooks. Commands include:

- Formatting from CLI: `prettier --write "./src/**/*.{js,jsx,ts,tsx}"`
- Use in pre-commit hook for automated formatting.

## Release Notes Highlights

Key recent updates:

- **Prettier 3.5**: Added options for `objectWrap`, `experimentalOperatorPosition`, and support for TypeScript config files.
- **Prettier 3.4 and 3.3**: Bug fixes and new Flow features.
- **Prettier 3.1**: Introduced experimental formatting for nested ternaries with `--experimental-ternaries` flag alongside Angular control flow syntax support.
- **Prettier 3.0**: Transition to ECMAScript Modules; breaking changes in markdown formatting and plugin interface.

## Comparison with Linters

- **Formatting Rules:** Prettier completely reprints the source code eliminating the need for traditional formatting rules found in linters such as ESLint.
- **Code Quality Rules:** Prettier does not enforce code quality rules (like no-unused-vars or no-extra-bind); these remain under the domain of linters.

## Attribution and Data Size

- Data Size: 1015925 bytes
- Links Found: 2519
- Source: https://prettier.io/docs/en/index.html


## Attribution
- Source: Prettier Documentation
- URL: https://prettier.io/docs/en/index.html
- License: License: MIT License
- Crawl Date: 2025-04-17T21:05:52.638Z
- Data Size: 1015925 bytes
- Links Found: 2519

## Retrieved
2025-04-17
