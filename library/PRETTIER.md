# PRETTIER

## Crawl Summary
Prettier is an automated code formatter that processes source code into a consistent style by parsing it into an AST, disregarding original styling details, and reprinting it according to rules that respect maximum line length. The documentation includes detailed examples of before and after formatting, CLI command usage, configuration options like --trailing-comma, --object-wrap, and experimental flags as well as integration with editors and best practices for using Prettier in code bases.

## Normalised Extract
## Table of Contents
1. Overview
2. Formatting Mechanism
3. Code Examples
4. CLI Usage
5. Configuration Options
6. API Integration
7. Best Practices & Troubleshooting

## 1. Overview
- Prettier is an opinionated formatter supporting languages: JavaScript, JSX, Angular, Vue, Flow, TypeScript, CSS, Less, SCSS, HTML, Ember/Handlebars, JSON, GraphQL, Markdown, and YAML.

## 2. Formatting Mechanism
- Parses code into an AST.
- Removes original styling (except key structural formatting).
- Reprints code adhering to maximum line length and formatting rules.

## 3. Code Examples
**Input Code:**
```
foo(arg1, arg2, arg3, arg4);
```

**Formatted Output:**
```
foo(
  reallyLongArg(),
  omgSoManyParameters(),
  IShouldRefactorThis(),
  isThereSeriouslyAnotherOne(),
);
```

## 4. CLI Usage
- Format file(s): `prettier --write "src/**/*.js"`
- Check formatting: `prettier --check .`

## 5. Configuration Options
- `--trailing-comma <none|es5|all>`: Trailing commas style, default value can be "all" in recent versions.
- `--object-wrap`: Controls wrapping of objects, new in recent release.
- `--experimental-operator-position`: Experimental flag for operator formatting.

## 6. API Integration
- **Primary Function:**
  ```js
  function format(sourceCode: string, options?: PrettierOptions): string
  ```
- **Options Interface Example:** See the PrettierOptions specification in the detailed digest above.

## 7. Best Practices & Troubleshooting
- **Pre-commit Hooks:** Integrate with tools like Husky.
- **Editor Integration:** Use plugins for VS Code, Sublime Text, Vim to auto-format on save.
- **Troubleshooting:** Use `--loglevel debug` for in-depth logging and check for cache issues with `--cache` option.


## Supplementary Details
### Detailed Configuration and Implementation Steps

1. **CLI configuration:**
   - To format files: `prettier --write "src/**/*.js"`.
   - To verify formatting: `prettier --check .`
   - Use flags as needed: `--trailing-comma`, `--object-wrap`, and `--experimental-operator-position`.

2. **PrettierOptions Configuration Example (in JSON):
   ```json
   {
     "printWidth": 100,
     "tabWidth": 2,
     "useTabs": false,
     "semi": true,
     "singleQuote": true,
     "trailingComma": "all",
     "bracketSpacing": true,
     "jsxBracketSameLine": false,
     "parser": "babel"
   }
   ```

3. **Integration Steps:**
   - Install Prettier locally or globally via npm.
   - Configure your editor to run Prettier on file save.
   - Optionally add a pre-commit hook using Husky and lint-staged to enforce formatting.

4. **Troubleshooting Commands:**
   - Debug formatting: `prettier --loglevel debug "src/app.js"`
   - Clear cache if using cache options: `rm -rf node_modules/.cache/prettier`
   - Validate configuration: `prettier --find-config-path myfile.js`


## Reference Details
### Complete API Specifications & Implementation Patterns

#### Prettier Core API

- **Function Signature:**
  ```ts
  function format(sourceCode: string, options?: PrettierOptions): string;
  ```

- **PrettierOptions Interface:**
  ```ts
  interface PrettierOptions {
    printWidth?: number;          // Default: 80 or project-specific
    tabWidth?: number;            // Default: 2
    useTabs?: boolean;            // Default: false
    semi?: boolean;               // Default: true
    singleQuote?: boolean;        // Default: false
    trailingComma?: 'none' | 'es5' | 'all'; // Default: often 'es5' or 'all' as per config
    bracketSpacing?: boolean;     // Default: true
    jsxBracketSameLine?: boolean; // Default: false
    parser?: string;              // Examples: "babel", "flow", "typescript"
    filepath?: string;            // Optional, used for inference
  }
  ```

#### SDK Method Usage Example

```js
// Importing Prettier
const prettier = require('prettier');

// Source code to format
const sourceCode = `function sum(a, b){return a+b;}`;

// Define options
const options = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  parser: 'babel'
};

// Format the code
const formattedCode = prettier.format(sourceCode, options);
console.log(formattedCode);
```

#### CLI Command Options

- **Command:** `prettier [options] [file/glob ...]`

- **Key Options:**
  - `--write`: Overwrites the file with formatted output.
  - `--check`: Verifies if files are formatted.
  - `--config <path>`: Specifies the path to a configuration file.
  - `--loglevel <level>`: Set log level (e.g., debug, warn, error).
  - `--cache`: Enables caching to improve performance.

#### Best Practices with Prettier

- **Integration with Git Hooks:**
  Use tools such as Husky with a command in package.json:
  ```json
  "husky": {
    "hooks": {
      "pre-commit": "prettier --check . || exit 1"
    }
  }
  ```

- **Editor Configuration:**
  Configure VS Code by adding to settings.json:
  ```json
  {
    "editor.formatOnSave": true,
    "prettier.requireConfig": true
  }
  ```

#### Troubleshooting Procedures

1. **Verify Prettier Version:**
   ```sh
   prettier --version
   ```
2. **Run in Debug Mode:**
   ```sh
   prettier --loglevel debug "src/app.js"
   ```
3. **Find Configuration File:**
   ```sh
   prettier --find-config-path myfile.js
   ```

These details provide the full specification of Prettier's API, method signatures, configuration options, implementation patterns, user commands, and best practices for integrating and troubleshooting within development workflows.

## Original Source
Prettier Documentation
https://prettier.io/docs/en/index.html

## Digest of PRETTIER

# PRETTIER DOCUMENTATION

**Retrieved Date:** 2023-10-12

# Overview
Prettier is an opinionated code formatter that reprints your code from scratch, disregarding original styling and enforcing consistency by taking the maximum line length into account. It supports a wide range of languages including JavaScript (and experimental features), JSX, Angular, Vue, Flow, TypeScript, CSS (Less, SCSS), HTML, Ember/Handlebars, JSON, GraphQL, Markdown (GFM, MDX v1) and YAML.

# Formatting Mechanism
- Parses the code into an Abstract Syntax Tree (AST).
- Removes original styling except essential layout such as empty lines and multi-line objects.
- Reprints the code based on its internal rules and maximum line length configuration.
- Wraps code when necessary.

# Code Example

**Before Formatting:**

```
foo(arg1, arg2, arg3, arg4);
```

**After Formatting:**

```
foo(
  reallyLongArg(),
  omgSoManyParameters(),
  IShouldRefactorThis(),
  isThereSeriouslyAnotherOne(),
);
```

# CLI & Integration

- **CLI Command Example:**

  ```bash
  prettier --write "src/**/*.js"
  ```

- **Editor Integration:** Works with VS Code, Sublime Text, Vim, and more. In many cases, code is formatted on save via editor plugins.

# Key Configuration Options

- `--trailing-comma <none|es5|all>`
  - **Description:** Controls the printing of trailing commas.
  - **Default:** In some releases changed to "all".

- `--object-wrap <option>`
  - **Description:** New option to control object wrapping behavior.

- `--experimental-operator-position`
  - **Description:** Experimental flag to adjust operator positioning.

# Table of Contents
1. Overview
2. Formatting Mechanism
3. Code Examples
4. CLI Usage
5. Configuration Options
6. API & Integration Details
7. Best Practices and Troubleshooting

# API & Integration Details

- **Function Signature:**

  ```js
  function format(sourceCode: string, options?: PrettierOptions): string
  ```

- **PrettierOptions Specification:**

  ```ts
  interface PrettierOptions {
    printWidth?: number;       // Maximum line length, default: 80
    tabWidth?: number;         // Spaces per indentation, default: 2
    useTabs?: boolean;         // Indent with tabs instead of spaces, default: false
    semi?: boolean;            // Print semicolons at the ends of statements, default: true
    singleQuote?: boolean;     // Use single quotes instead of double quotes, default: false
    trailingComma?: 'none' | 'es5' | 'all';  // Trailing commas style, default may vary (often "es5" or "all")
    bracketSpacing?: boolean;  // Print spaces between brackets, default: true
    jsxBracketSameLine?: boolean; // Put the `>` of a multi-line JSX element at the end of the last line instead of being alone on the next line, default: false
    parser?: string;           // The parser to use, e.g., "babel", "flow", "typescript", etc.
  }
  ```

- **Usage Example in Code:**

  ```js
  const prettier = require('prettier');

  const code = "function sum(a, b){return a+b;}";
  const options = {
    printWidth: 100,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    bracketSpacing: true,
    parser: 'babel'
  };

  const formatted = prettier.format(code, options);
  console.log(formatted);
  ```

# Best Practices and Troubleshooting

- **Best Practices:**
  - Integrate Prettier as a pre-commit hook (using Husky or lint-staged) to enforce style consistency.
  - Use editor integrations for on-save formatting to reduce manual formatting.
  - Combine Prettier with a linter (ESLint, TSLint, or stylelint) since Prettier only handles formatting.

- **Troubleshooting Steps:**
  1. **Check version consistency:** Ensure the Prettier version used by your CLI and editor plugin match.
  2. **Configuration Validation:** Run `prettier --check .` to detect files that do not match your expected formatting.
  3. **Verbose Mode:** Use `prettier --loglevel debug` for detailed logging of formatting decisions.
  4. **Cache Issues:** If using caching with the `--cache` flag, clear the cache with `rm -rf node_modules/.cache/prettier` if unexpected behavior is observed.


## Attribution
- Source: Prettier Documentation
- URL: https://prettier.io/docs/en/index.html
- License: License: MIT License
- Crawl Date: 2025-04-17T14:32:56.249Z
- Data Size: 3422474 bytes
- Links Found: 4340

## Retrieved
2025-04-17
