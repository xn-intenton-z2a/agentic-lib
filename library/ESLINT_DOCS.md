# ESLINT_DOCS

## Crawl Summary
Topics covered include: (1) Use ESLint in Your Project: details on configuration files (.eslintrc.json), CLI commands (eslint . and --fix), (2) Extend ESLint: instructions for creating custom rules with complete rule module examples, (3) Integrate ESLint: using the Node.js API with ESLint class including methods lintFiles, loadFormatter, (4) Contribute to ESLint: guidelines for setting up a development environment and repository structure, (5) Maintain ESLint: release notes and version management (v9.25.0, v9.26.0). Sample code snippets and configuration examples are provided.

## Normalised Extract
## Table of Contents
1. Use ESLint in Your Project
2. Extend ESLint
3. Integrate ESLint
4. Contribute to ESLint
5. Maintain ESLint

### 1. Use ESLint in Your Project
- Configuration: 
  - .eslintrc.json sample configuration:
    {
      "env": { "browser": true, "node": true },
      "extends": "eslint:recommended",
      "rules": {
        "semi": ["error", "always"],
        "quotes": ["error", "double"]
      }
    }
- CLI Commands:
  - `eslint .` to scan project files.
  - `eslint --fix` to automatically fix problems.

### 2. Extend ESLint
- Custom Rule Module Example:
```js
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow the use of var',
      category: 'ECMAScript 6',
      recommended: true
    },
    schema: []
  },
  create(context) {
    return {
      VariableDeclaration(node) {
        if (node.kind === 'var') {
          context.report({
            node,
            message: 'Unexpected var, use let or const instead.'
          });
        }
      }
    };
  }
};
```

### 3. Integrate ESLint
- Node.js API Usage:
```js
const { ESLint } = require('eslint');

(async function main() {
  const eslint = new ESLint({ fix: true });
  const results = await eslint.lintFiles(['src/**/*.js']);
  const formatter = await eslint.loadFormatter('stylish');
  console.log(formatter.format(results));
})();
```
- Key Methods:
  - `lintFiles(patterns: string[]): Promise<LintResult[]>`
  - `loadFormatter(name?: string): Promise<Formatter>`

### 4. Contribute to ESLint
- Development Setup:
  - Fork repository, run `npm install` to install dependencies, and `npm test` to run tests.
- Repository structure is standardized for open source contribution.

### 5. Maintain ESLint
- Version release notes provide detailed changelogs (e.g., v9.25.0, v9.24.0).
- Maintainers use continuous integration and version management practices.


## Supplementary Details
### Configuration Options
- .eslintrc.json options:
  - "env": { "browser": true, "node": true } (sets environment globals)
  - "extends": "eslint:recommended" (includes ESLint recommended rules)
  - "rules": Object mapping rule names to error levels and options.

### Command Line Execution
- Run ESLint with: `eslint .`
- Auto-fixing issues: `eslint --fix`
- Specify configuration file: `eslint --config path/to/.eslintrc.json`

### ESLint Node.js API
- Instantiate ESLint:
  - Syntax: `const eslint = new ESLint(options)`
  - Options include:
    - fix: boolean - to enable auto-fix
    - overrideConfig: Object - to provide inline configuration

Example:
```js
const { ESLint } = require('eslint');

(async function() {
  const eslint = new ESLint({ fix: true, overrideConfig: { parserOptions: { ecmaVersion: 2020 } } });
  const results = await eslint.lintFiles(['**/*.js']);
  await ESLint.outputFixes(results);
})();
```

### Custom Rule Implementation
- Steps to create a custom rule:
  1. Define meta data: type, docs, and schema.
  2. Implement the create function that returns visitor methods for AST nodes.
  3. Report issues using context.report with node reference and error message.

### Integration Best Practices
- Maintain consistency by using the same ESLint configuration across editors and CI pipelines.
- Regularly update ESLint and plugins to benefit from performance and bug fixes.


## Reference Details
### Complete API Specifications

#### ESLint Class

Constructor: 
  ESLint(options: ESLint.Options)
  - options.fix: boolean (default: false) - enable auto-fixing.
  - options.overrideConfig: object (optional) - inline configuration overrides.
  - options.resolvePluginsRelativeTo: string (optional) - path to resolve plugins.

Methods:
- lintFiles(patterns: string[]): Promise<LintResult[]>
  - patterns: array of file glob strings
  - Returns a promise that resolves to an array of linting results.

- loadFormatter(name?: string): Promise<Formatter>
  - name: string, the formatter name (default is 'stylish')
  - Returns a promise that resolves to a formatter object with a `format(results: LintResult[]): string` method.

- outputFixes(results: LintResult[]): Promise<void>
  - Applies fixes to files if available.

#### SDK Method Signature Example

```js
const { ESLint } = require('eslint');

(async function main() {
  // Create an instance with auto-fix enabled and custom parser options
  const eslint = new ESLint({
    fix: true,
    overrideConfig: {
      parserOptions: { ecmaVersion: 2020 },
      env: { browser: true, node: true },
      rules: {
        'no-var': 'error',
        'semi': ['error', 'always']
      }
    }
  });

  // Lint files matching the glob pattern
  const results = await eslint.lintFiles(['src/**/*.js']);

  // Load the 'stylish' formatter
  const formatter = await eslint.loadFormatter('stylish');
  const resultText = formatter.format(results);

  // Output results
  console.log(resultText);

  // Write fixes to disk
  await ESLint.outputFixes(results);
})();
```

#### Troubleshooting Procedures

1. Run ESLint in debug mode using the CLI option: 
   ```bash
   eslint . --debug
   ```
   Expected output: Detailed logging including file paths and rule evaluations.

2. If a custom rule is not reporting errors:
   - Verify that the rule file exports the correct meta and create structure.
   - Add console logs within the visitor functions to ensure they are triggered.
   - Ensure the rule is enabled in the ESLint configuration under the 'rules' section.

3. For configuration errors, run:
   ```bash
   eslint --print-config path/to/file.js
   ```
   Expected output: The fully resolved configuration for the file, helping identify conflicts or missing options.

### Best Practices
- Always synchronize ESLint configuration between local development and continuous integration.
- Regularly update dependencies to avoid deprecated rules or plugins.
- Use inline configuration overrides sparingly to maintain consistency.

This documentation provides actual method signatures, full code examples, configuration details, concrete best practices with implementation code, and troubleshooting procedures that developers can directly use.

## Original Source
ESLint Documentation
https://eslint.org/docs/latest

## Digest of ESLINT_DOCS

# ESLINT DOCS

Retrieved: 2025-04-18

## Use ESLint in Your Project

- Core commands:
  - Run ESLint from the command line: `eslint .`
  - Use configuration file `.eslintrc.json` with properties such as `env`, `extends`, `rules`.

Example `.eslintrc.json`:
```json
{
  "env": { "browser": true, "node": true },
  "extends": "eslint:recommended",
  "rules": {
    "semi": ["error", "always"],
    "quotes": ["error", "double"]
  }
}
```

- Command line options include `--fix` to auto-correct issues and `--config <file>` to specify a configuration file.

## Extend ESLint

- Create custom rules by writing a rule module. The rule receives a visitor object for AST nodes.

Example custom rule (my-rule.js):
```js
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow the use of var',
      category: 'ECMAScript 6',
      recommended: true
    },
    schema: []
  },
  create(context) {
    return {
      VariableDeclaration(node) {
        if (node.kind === 'var') {
          context.report({
            node,
            message: 'Unexpected var, use let or const instead.'
          });
        }
      }
    };
  }
};
```

- Register the plugin in your ESLint configuration under `plugins` and adding rules with the plugin prefix.

## Integrate ESLint

- Use the Node.js API to integrate ESLint in custom tools or build pipelines.

Example using the ESLint class:
```js
const { ESLint } = require('eslint');

(async function main() {
  const eslint = new ESLint({ fix: true });
  const results = await eslint.lintFiles(['src/**/*.js']);
  const formatter = await eslint.loadFormatter('stylish');
  const resultText = formatter.format(results);
  console.log(resultText);
})();
```

- API Methods include `lintFiles()`, `loadFormatter()`, and `outputFixes()`.

## Contribute to ESLint

- The contribution guidelines detail repository structure, coding standards, and setup of a development environment.
- Fork the repository, install dependencies with `npm install`, and run tests using `npm test`.

## Maintain ESLint

- Versioning and release notes: For example, ESLint v9.25.0 and upcoming versions such as v9.26.0.
- Maintainers follow coding standards, review pull requests, and manage release pipelines.

---

Attribution: Data exclusively crawled from https://eslint.org/docs/latest
Data Size: 2375199 bytes

## Attribution
- Source: ESLint Documentation
- URL: https://eslint.org/docs/latest
- License: License: MIT License
- Crawl Date: 2025-04-20T00:37:56.410Z
- Data Size: 2375199 bytes
- Links Found: 5186

## Retrieved
2025-04-20
