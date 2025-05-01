# PRETTIER

## Crawl Summary
Prettier is an opinionated code formatter supporting multiple languages by reprinting code based on an AST, respecting maximum line lengths, and applying wrapping rules. It offers configuration options such as trailingComma, tabWidth, printWidth, and new options like objectWrap and experimentalOperatorPosition. Usage via CLI and API is supported with methods like format, check, and formatWithCursor, and it integrates with plugins using ECMAScript modules.

## Normalised Extract
Table of Contents:
1. Supported Languages
   - JavaScript, JSX, Angular, Vue, Flow, TypeScript, CSS, Less, SCSS, HTML, Ember/Handlebars, JSON, GraphQL, Markdown (GFM, MDX v1), YAML
2. Formatting Mechanism
   - AST based reprinting, maximum line length enforcement, argument wrapping patterns
3. Configuration Options
   - trailingComma: 'all' (default now), tabWidth: 2, printWidth: 80, semi, singleQuote, objectWrap, experimentalOperatorPosition
4. CLI & API Usage
   - CLI commands: prettier --write ., prettier --check .
   - API methods: format(source: string, options?: PrettierOptions): string; check(source: string, options?: PrettierOptions): boolean; formatWithCursor(source: string, options: PrettierOptions & { cursorOffset: number }): { formatted: string, cursorOffset: number }
5. Plugin Interface
   - Supports ECMAScript Modules and async parsers
6. Release Notes
   - Version 3.5: objectWrap, experimentalOperatorPosition; Version 3.0: ECMAScript Modules migration, trailingComma default 'all'

Detailed Technical Information:
1. Supported Languages are explicitly listed and determine the parser used.
2. Formatting Mechanism involves removing original styling and reprinting code according to Prettier rules, e.g., splitting long function calls into multi-line arguments.
3. Configuration Options must be set in a .prettierrc file with exact values; for instance, setting trailingComma to 'all' ensures commas are appended even in single-line objects.
4. CLI & API Usage: The API provides straightforward methods to format or check code. The CLI commands are used to integrate formatting in development workflows. Use options objects with precise parameter types.
5. Plugin Interface: Custom plugins can extend parsing and formatting, requiring async support under ECMAScript modules.
6. Release Notes document improvements and bug fixes that are critical for migration and compliance testing.

## Supplementary Details
Configuration Options:
- trailingComma: Acceptable values are 'none', 'es5', or 'all'. Default in later versions is 'all'.
- tabWidth: Number value, typically 2.
- printWidth: Maximum characters per line, typically 80.
- semi: Boolean value to determine if semicolons are included (default true).
- singleQuote: Boolean value for using single quotes (default false unless specified).
- objectWrap (v3.5): Option to control wrapping of objects with values, accepts boolean or specific style strings.
- experimentalOperatorPosition (v3.5): Enables new formatting for operators; use with caution in production.

Implementation Steps for CLI:
1. Install Prettier via npm: npm install --save-dev prettier
2. Create a .prettierrc file with your configuration options.
3. Integrate into your project by adding a script in package.json: "format": "prettier --write ."
4. Run the command to format your codebase.

Troubleshooting Procedures:
- To check formatting without modifying files: run 'prettier --check .'
- For debugging configuration issues, run 'prettier --loglevel debug' to see detailed processing information.
- Ensure that plugins are loaded correctly by verifying the module format (CommonJS vs ECMAScript Modules) if custom plugins are used.

API Integration Example (pseudo-code):
// Import Prettier
import { format } from 'prettier';

const sourceCode = "function foo ( a, b ){ return a+b; }";
const options = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: "all"
};

// Get formatted code
const formattedCode = format(sourceCode, options);
console.log(formattedCode);

This example demonstrates calling the format method with explicit options, ensuring the output conforms to the specified configuration.

## Reference Details
API Specifications:
Method: format
Signature: format(source: string, options?: PrettierOptions) => string
Parameters:
  - source: string - The source code to format.
  - options: PrettierOptions (interface includes:
      printWidth: number (default 80),
      tabWidth: number (default 2),
      useTabs: boolean (default false),
      semi: boolean (default true),
      singleQuote: boolean (default false),
      trailingComma: 'none' | 'es5' | 'all' (default 'es5' or 'all' in v3.0+),
      parser?: string, 
      plugins?: Array<string>
    )
Returns: string - the formatted source code.

Method: check
Signature: check(source: string, options?: PrettierOptions) => boolean
Description: Returns true if the source is already formatted according to the options.

Method: formatWithCursor
Signature: formatWithCursor(source: string, options: PrettierOptions & { cursorOffset: number }) => { formatted: string, cursorOffset: number }

SDK Example Code:
// Example usage of Prettier API
import { format } from 'prettier';

const codeSnippet = "const foo = (a,b,c)=>{return a+b+c;}";
const config = {
  printWidth: 80,
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  trailingComma: "all"
};

const result = format(codeSnippet, config);
console.log(result);

Configuration File Example (.prettierrc):
{
  "printWidth": 80,
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all"
}

CLI Command Examples:
- Format files: prettier --write .
- Check formatting: prettier --check .
- Debug logging: prettier --loglevel debug

Best Practices:
- Always integrate Prettier into pre-commit hooks to enforce coding style.
- Use consistent configuration across projects to reduce debates over style.
- Update plugins and configuration when migrating to new Prettier major versions, following the migration guide provided in the documentation.

Troubleshooting:
1. Run 'prettier --check .' to list files with formatting issues.
2. Use '--debug-check' to compare output and diagnose discrepancies.
3. Verify module compatibility if using custom plugins.

These technical specifications provide exact API signatures, configuration options with defaults, sample code and commands necessary for immediate integration and troubleshooting.

## Information Dense Extract
Prettier: opinionated code formatter; Languages: JS, JSX, Angular, Vue, Flow, TS, CSS, Less, SCSS, HTML, Ember/Handlebars, JSON, GraphQL, Markdown, YAML; Mechanism: AST parse and reprint, max line length, argument wrapping; Options: trailingComma ('all'), tabWidth (2), printWidth (80), semi (true), singleQuote (true), objectWrap, experimentalOperatorPosition; CLI: prettier --write ., --check ., --loglevel debug; API: format(source: string, options?: PrettierOptions): string; check(source: string, options?: PrettierOptions): boolean; formatWithCursor(source, {cursorOffset}): {formatted, cursorOffset}; Configuration via .prettierrc JSON; Plugin support: ECMAScript Modules; Troubleshooting: use check and debug commands; Best practices: integrate in pre-commit hooks; Release notes detail version-specific updates (v3.5, v3.0, etc).

## Sanitised Extract
Table of Contents:
1. Supported Languages
   - JavaScript, JSX, Angular, Vue, Flow, TypeScript, CSS, Less, SCSS, HTML, Ember/Handlebars, JSON, GraphQL, Markdown (GFM, MDX v1), YAML
2. Formatting Mechanism
   - AST based reprinting, maximum line length enforcement, argument wrapping patterns
3. Configuration Options
   - trailingComma: 'all' (default now), tabWidth: 2, printWidth: 80, semi, singleQuote, objectWrap, experimentalOperatorPosition
4. CLI & API Usage
   - CLI commands: prettier --write ., prettier --check .
   - API methods: format(source: string, options?: PrettierOptions): string; check(source: string, options?: PrettierOptions): boolean; formatWithCursor(source: string, options: PrettierOptions & { cursorOffset: number }): { formatted: string, cursorOffset: number }
5. Plugin Interface
   - Supports ECMAScript Modules and async parsers
6. Release Notes
   - Version 3.5: objectWrap, experimentalOperatorPosition; Version 3.0: ECMAScript Modules migration, trailingComma default 'all'

Detailed Technical Information:
1. Supported Languages are explicitly listed and determine the parser used.
2. Formatting Mechanism involves removing original styling and reprinting code according to Prettier rules, e.g., splitting long function calls into multi-line arguments.
3. Configuration Options must be set in a .prettierrc file with exact values; for instance, setting trailingComma to 'all' ensures commas are appended even in single-line objects.
4. CLI & API Usage: The API provides straightforward methods to format or check code. The CLI commands are used to integrate formatting in development workflows. Use options objects with precise parameter types.
5. Plugin Interface: Custom plugins can extend parsing and formatting, requiring async support under ECMAScript modules.
6. Release Notes document improvements and bug fixes that are critical for migration and compliance testing.

## Original Source
Prettier Documentation
https://prettier.io/docs/en/index.html

## Digest of PRETTIER

# OVERVIEW
Retrieved Date: 2023-10-12

Prettier is an opinionated code formatter that reprints code from scratch to enforce a consistent style. It supports a variety of languages including JavaScript (and experimental features), JSX, Angular, Vue, Flow, TypeScript, CSS (including Less and SCSS), HTML, Ember/Handlebars, JSON, GraphQL, Markdown (including GFM and MDX v1), and YAML.

# SUPPORTED LANGUAGES
- JavaScript, JSX, Angular, Vue, Flow, TypeScript
- CSS, Less, SCSS, HTML
- Ember/Handlebars, JSON, GraphQL
- Markdown (GFM, MDX v1), YAML

# FORMATTING MECHANISM
Prettier parses the input code into an AST and then reprints it according to its rules. It takes the maximum line length into account and wraps code as needed. For instance, a function call that exceeds the line length is formatted with each argument on a separate line.

Example transformation:
Input: foo(arg1, arg2, arg3, arg4);
Output: foo(
  arg1,
  arg2,
  arg3,
  arg4,
);

# CONFIGURATION OPTIONS
Key options include:
- trailingComma: Controls trailing commas in objects and arrays. (Default in version 3.0 is "all".)
- tabWidth: Number of spaces per indentation level (commonly 2).
- printWidth: Maximum line length (commonly 80).
- objectWrap: New in version 3.5; supports wrapping objects in a defined style.
- experimentalOperatorPosition: Experimental option to adjust operator positioning.
- support for TypeScript configuration file integration.

Configuration files (e.g., .prettierrc) typically use JSON format:
{
  "trailingComma": "all",
  "tabWidth": 2,
  "printWidth": 80,
  "semi": true,
  "singleQuote": true
}

# API USAGE & CLI
Prettier can be used in CLI mode as well as via its API. Typical CLI commands include:
- prettier --write .   (Formats the code in place)
- prettier --check .   (Checks if files are formatted)

# SDK METHOD SIGNATURES
Prettier exposes functions for formatting code. For example:

format(source: string, options?: PrettierOptions): string
check(source: string, options?: PrettierOptions): boolean
formatWithCursor(source: string, options: PrettierOptions & { cursorOffset: number }): { formatted: string, cursorOffset: number }

# PLUGIN INTERFACE
Prettier supports plugins written as ECMAScript modules. The plugin interface allows asynchronous parsers and custom formatting rules.

# RELEASE NOTES & UPDATES
Recent versions include:
- Version 3.5: Introduced objectWrap and experimentalOperatorPosition options with full support for TypeScript configuration files.
- Version 3.0: Migration to ECMAScript Modules and changing default trailingComma to "all".
- Earlier versions added support for JSONC parsing, Angular ICU expressions, and experimental ternary formatting.

# ATTRIBUTION & CRITICAL DATA
Data Size: 926666 bytes
Links Found: 2366

This document extracts actionable technical specifications and configurations directly from the Prettier documentation.

## Attribution
- Source: Prettier Documentation
- URL: https://prettier.io/docs/en/index.html
- License: License: MIT
- Crawl Date: 2025-05-01T19:52:37.788Z
- Data Size: 926666 bytes
- Links Found: 2366

## Retrieved
2025-05-01
