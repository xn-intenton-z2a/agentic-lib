# PRETTIER

## Crawl Summary
Prettier is an opinionated code formatter that parses source code into an AST and reprints it with a consistent style. It supports multiple languages (JavaScript, TypeScript, HTML, CSS, etc.) and offers configurable options like trailing commas, object wrapping, and experimental formatting for ternaries and operators. The formatting algorithm considers maximum line length and wraps lines as needed. CLI usage and Node.js API examples demonstrate how to format code, check versions, and integrate Prettier into workflows.

## Normalised Extract
## Table of Contents
1. Overview and Supported Languages
2. Formatting Algorithm
3. Configuration Options
4. CLI Usage and API Integration
5. Troubleshooting

---

### 1. Overview and Supported Languages
- **Languages:** JavaScript, JSX, Angular, Vue, Flow, TypeScript, CSS, Less, SCSS, HTML, Ember/Handlebars, JSON, GraphQL, Markdown (GFM, MDX v1), YAML.
- **Key Behavior:** Removes original styling (except necessary cases like empty lines) and reprints code based on AST.

### 2. Formatting Algorithm
- **Process:**
  a. Parse original source code into an AST.
  b. Reprint code based on rules (e.g., maximum line length).
- **Example:**
  - Input: `foo(arg1, arg2, arg3, arg4);`
  - Output when wrapping needed:
    ```
    foo(
      reallyLongArg(),
      omgSoManyParameters(),
      IShouldRefactorThis(),
      isThereSeriouslyAnotherOne(),
    );
    ```

### 3. Configuration Options
- **--trailing-comma:** Values: "none", "es5", "all" (default changed to "all").
- **--object-wrap:** (New in version 3.5) Controls object formatting.
- **--experimental-operator-position:** Enables experimental positioning of operators.
- **--experimental-ternaries:** Flag for indenting nested ternaries for better clarity.
- **TypeScript Config Support:** Reads TS configuration for formatting adaptation.

### 4. CLI Usage and API Integration
- **CLI Command:**
  ```bash
  prettier --write "src/**/*.js"
  ```
- **Node.js API Example:**
  ```javascript
  const prettier = require("prettier");

  const code = "function foo(a, b){ return a + b; }";
  const options = {
    parser: "babel",
    trailingComma: "all",
    tabWidth: 2,
    useTabs: false
  };

  const formatted = prettier.format(code, options);
  console.log(formatted);
  ```
- **Method Signature:**
  `prettier.format(source: string, options?: PrettierOptions): string`

### 5. Troubleshooting
- **Syntax Errors:** Ensure valid source code and correct parser. Use:
  ```bash
  prettier --check "src/**/*.js"
  ```
- **Performance:** Use caching options:
  ```bash
  prettier --write --cache "src/**/*.js"
  ```
- **Editor Integration:** Verify that editor plugins/extensions are installed and configured.


## Supplementary Details
### Detailed Configuration and Implementation Steps

1. **Configuration File (.prettierrc):**
   Example JSON configuration:
   ```json
   {
     "trailingComma": "all",
     "tabWidth": 2,
     "useTabs": false,
     "printWidth": 80,
     "objectWrap": "preserve",
     "experimentalOperatorPosition": true,
     "experimentalTernaries": true
   }
   ```

2. **Using Prettier in the CLI:**
   - Install Prettier globally or as a dev dependency:
     ```bash
     npm install --save-dev prettier
     ```
   - Format code:
     ```bash
     prettier --write "src/**/*.js"
     ```
   - Check for formatting issues without modifying files:
     ```bash
     prettier --check "src/**/*.js"
     ```

3. **Integrating with Node.js:**
   - Import the library:
     ```javascript
     const prettier = require("prettier");
     ```
   - Format code with options:
     ```javascript
     const formattedCode = prettier.format("const x=1;", {
       parser: "babel",
       trailingComma: "all",
       tabWidth: 2
     });
     console.log(formattedCode);
     ```

4. **Plugin Integration:**
   - For ECMAScript Modules support and asynchronous parsers, ensure your project uses the updated plugin API. Refer to the migration guide for plugin developers when updating from CommonJS usage.

5. **Best Practices:**
   - Always add Prettier as part of your pre-commit hooks to enforce code style automatically using tools like lint-staged.
   - Combine Prettier with ESLint: Use Prettier for formatting and ESLint for code quality checks.

6. **Troubleshooting Commands:**
   - To view Prettier version:
     ```bash
     prettier --version
     ```
   - To diagnose cache issues, specify cache location explicitly:
     ```bash
     prettier --write --cache-location ./node_modules/.cache/prettier "src/**/*.js"
     ```
   - If encountering parsing problems, test with a minimal file and adjust the parser option accordingly.


## Reference Details
### Complete API Specifications and Code Examples

1. **Prettier Node.js API**
   - **Method:** `prettier.format(source: string, options?: PrettierOptions): string`
   - **Parameters:**
     - `source`: The string of code to format.
     - `options`: An object conforming to the interface:
       ```typescript
       interface PrettierOptions {
         parser: string;             // e.g., 'babel', 'typescript', 'css', 'html'
         trailingComma?: 'none' | 'es5' | 'all'; // Default: 'all' in v3.0+
         tabWidth?: number;          // e.g., 2
         useTabs?: boolean;          // false for spaces
         printWidth?: number;        // Maximum line length, default 80
         objectWrap?: 'preserve' | 'force'; // New in v3.5
         experimentalOperatorPosition?: boolean; // Flag for experimental formatting
         experimentalTernaries?: boolean; // Flag for ternary formatting
       }
       ```
   - **Return:** A formatted string based on the provided options.
   - **Exceptions:** Throws syntax errors when source cannot be parsed.

2. **CLI Usage**
   - **Command:**
     ```bash
     prettier --write "src/**/*.js"
     ```
   - **Options:**
     - `--check`: Checks files without writing changes.
     - `--cache` and `--cache-location`: Improves performance on large codebases.

3. **Full Code Example with Comments (Node.js):**
   ```javascript
   // Import the Prettier library
   const prettier = require("prettier");

   // Define source code to format
   const code = "function add(a, b) { return a+b; }";

   // Define formatting options (following PrettierOptions interface)
   const options = {
     parser: "babel",
     trailingComma: "all",
     tabWidth: 2,
     useTabs: false,
     printWidth: 80,
     objectWrap: "preserve",
     experimentalOperatorPosition: true,
     experimentalTernaries: true
   };

   try {
     // Format the code
     const formatted = prettier.format(code, options);
     console.log('Formatted Code:\n', formatted);
   } catch (error) {
     // Output detailed error if formatting fails
     console.error('Formatting error:', error.message);
   }
   ```

4. **Configuration Options and Their Effects**
   - `trailingComma`:
     - "none": No trailing commas are added.
     - "es5": Trailing commas are added where valid in ES5 (objects, arrays, etc.).
     - "all": Trailing commas are added for all multiline structures.
   - `tabWidth`: Number of spaces per indentation level (default is 2).
   - `printWidth`: Defines maximum line length; lines longer than this will be wrapped.
   - `objectWrap`: Controls whether objects maintain original wrapping or are force-wrapped.
   - Experimental flags (`experimentalOperatorPosition`, `experimentalTernaries`): Enable non-default formatting patterns for operators and nested ternary expressions respectively.

5. **Detailed Troubleshooting Procedure**
   - **Step 1:** Run Prettier in check mode to identify unformatted files:
     ```bash
     prettier --check "src/**/*.js"
     ```
     *Expected Output:* List of files that do not conform to the style.
   - **Step 2:** If a syntax error occurs, verify that the correct parser is set and that the source code is valid. For instance, if using TypeScript, ensure `parser: "typescript"` is supplied.
   - **Step 3:** For performance issues with large projects, use caching:
     ```bash
     prettier --write --cache --cache-location ./node_modules/.cache/prettier "src/**/*.js"
     ```
     *Expected Output:* Reduced formatting time on repeated runs.
   - **Step 4:** For editor integration problems, confirm that your Prettier plugin is updated and that the configuration file (.prettierrc) is correctly formatted.
   - **Step 5:** Consult logs and error messages for precise failure points, and test with minimal input to isolate configuration issues.


## Original Source
Prettier Documentation
https://prettier.io/docs/en/index.html

## Digest of PRETTIER

# Prettier Documentation Digest

**Retrieved Date:** 2023-10-05

## Overview
Prettier is an opinionated code formatter that reprints code from its parsed AST. It supports numerous languages including:
- JavaScript (including experimental features)
- JSX
- Angular
- Vue
- Flow
- TypeScript
- CSS, Less, and SCSS
- HTML
- Ember/Handlebars
- JSON
- GraphQL
- Markdown (including GFM and MDX v1)
- YAML

Prettier strips (or preserves where practical) the original styling and outputs code with a consistent style. It respects configuration options such as maximum line length, and will reformat the code accordingly.

## Formatting Algorithm
When formatting code, Prettier:
- Parses the original source code into an AST.
- Reprints the code from the AST using its own rules, ignoring most original formatting.
- Adjusts formatting based on options like maximum line length, wrapping lists, or function call arguments.

### Example Transformation
Before Formatting:
```
foo(arg1, arg2, arg3, arg4);
```
After Formatting (if line exceeds limit):
```
foo(
  reallyLongArg(),
  omgSoManyParameters(),
  IShouldRefactorThis(),
  isThereSeriouslyAnotherOne(),
);
```

## Configuration Options
Prettier comes with several configuration options that influence formatting:

- **--trailing-comma**: Determines trailing comma usage. Valid values: `"none"`, `"es5"`, `"all"`. In Prettier 3.0, the default was changed to `"all"`.
- **--object-wrap**: New option in Prettier 3.5 to control wrapping of objects.
- **--experimental-operator-position**: Experimental flag to control operator position in formatted code.
- **--experimental-ternaries**: Enables an alternative formatting style for nested ternaries, adding indentation for better readability.
- **TypeScript Configuration File Support**: Extended support for reading TS config files to adjust formatting.

## CLI Commands and Usage Examples

**Basic CLI usage:**
```
prettier --write "src/**/*.js"
```

**Node.js API Usage Example:**
```javascript
const prettier = require("prettier");

const sourceCode = "function foo(arg1, arg2){return arg1+arg2;}";
const options = {
  parser: "babel", // Specify the parser (e.g., babel, typescript, css, html, etc.)
  trailingComma: "all", // Options: "none", "es5", "all"
  tabWidth: 2,
  useTabs: false
};

const formattedCode = prettier.format(sourceCode, options);
console.log(formattedCode);
```

**Version Check Command:**
```
prettier --version
```

## API Specifications and Integration

For integration as a library:

**Method Signature:**

Function: `prettier.format(source: string, options?: PrettierOptions): string`

Where `PrettierOptions` may include:
- `parser`: string (e.g., "babel", "typescript", "css", etc.)
- `trailingComma`: "none" | "es5" | "all"
- `tabWidth`: number
- `useTabs`: boolean
- `printWidth`: number (max line length, default 80)
- Additional flags such as `objectWrap`, `experimentalOperatorPosition`, and `experimentalTernaries` may be included.

**Error Handling:**
- Throws syntax errors if the input source cannot be parsed.

## Troubleshooting Procedures

1. **Parsing Errors**: If Prettier throws a syntax error, ensure that the source code is valid and that the correct parser is specified.

   **Command Example:**
   ```bash
   prettier --check "src/**/*.js"
   ```
   Expected output: A list of files with formatting issues or errors.

2. **Configuration Issues**: Validate your configuration file (e.g., `.prettierrc`) using JSON schema validators to ensure options are correct.

3. **Performance Concerns**: For large codebases, use the `--cache` and `--cache-location` options to improve performance.

   **Command Example:**
   ```bash
   prettier --write --cache "src/**/*.js"
   ```

4. **Integration**: When integrating with editors (VS Code, Vim, etc.), ensure that the correct extensions/plugins are installed and configured for on-save formatting.

## Attribution and Data Size

- **Data Size:** 1031862 bytes
- **Links Found:** 2567
- **Source URL:** https://prettier.io/docs/en/index.html



## Attribution
- Source: Prettier Documentation
- URL: https://prettier.io/docs/en/index.html
- License: License: MIT
- Crawl Date: 2025-04-17T16:25:28.865Z
- Data Size: 1031862 bytes
- Links Found: 2567

## Retrieved
2025-04-17
