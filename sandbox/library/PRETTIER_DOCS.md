# PRETTIER_DOCS

## Crawl Summary
Prettier documentation outlines an opinionated formatter that reformats code by parsing to an AST and reprinting based on a maximum line length. Key features include support for multiple languages, configuration options like --trailing-comma (default 'all'), caching options, new flags in v3.5 (objectWrap, experimentalOperatorPosition), CLI integration with commands 'prettier --write' and 'prettier --check', and plugin support using ECMAScript Modules.

## Normalised Extract
Table of Contents: Overview; Core Functionality; Code Formatting Mechanism; Configuration Options; Command Line Interface; Plugin Architecture; Release Features; Troubleshooting. Overview: Prettier auto-formats by removing non-essential styling. Core Functionality: Supports JavaScript, JSX, Angular, Vue, Flow, TypeScript, CSS, Less, SCSS, HTML, Ember/Handlebars, JSON, GraphQL, Markdown (GFM, MDX v1), YAML. Code Formatting Mechanism: Parses code to AST, applies maximum line length and wraps as needed. Configuration Options: --trailing-comma (default 'all'), --cache (boolean), --cache-location (string), --objectWrap (boolean), --experimentalOperatorPosition (boolean), support for TS config files. Command Line Interface: Use 'prettier --write <file>' for formatting and 'prettier --check <file>' to verify; integrates with editors for auto-format on save. Plugin Architecture: Plugins can be written as ECMAScript Modules with support for async parsing. Release Features: Version updates provide specific new features such as experimental ternaries and control flow syntax. Troubleshooting: Validate settings in .prettierrc, use 'prettier --check' for diagnostics, and run with '--loglevel debug' for detailed output.

## Supplementary Details
Configuration Parameters: trailingComma set to 'all' (default for v3.0+), caching enabled with --cache (boolean) and --cache-location (path string), additional options include --objectWrap and --experimentalOperatorPosition (both boolean). File configuration via .prettierrc supports keys like printWidth, tabWidth, useTabs, semi, singleQuote, bracketSpacing, jsxBracketSameLine, arrowParens, endOfLine. Implementation Steps: 1. Install Prettier via npm. 2. Create/update .prettierrc with desired configuration. 3. Integrate editor plugins for auto-formatting. 4. Use CLI commands to format or verify code. Best Practices: Enforce formatting via pre-commit hooks; format on save in IDE; regularly update configuration to reflect new features; use '--check' and '--loglevel debug' for troubleshooting.

## Reference Details
API Specifications and CLI Usage:
- CLI Command: prettier --write <path>
- CLI Command: prettier --check <path> 
- Options:
  --trailing-comma: string value; allowed options: 'none', 'es5', 'all' (default: 'all')
  --cache: boolean flag
  --cache-location: string path
  --objectWrap: boolean flag (v3.5 feature)
  --experimentalOperatorPosition: boolean flag (v3.5 feature)

Library API:
function format(source: string, options: PrettierOptions): string

PrettierOptions (object) includes:
  parser: string,
  printWidth: number,
  tabWidth: number,
  useTabs: boolean,
  semi: boolean,
  singleQuote: boolean,
  trailingComma: 'none' | 'es5' | 'all',
  bracketSpacing: boolean,
  jsxBracketSameLine: boolean,
  arrowParens: 'avoid' | 'always',
  endOfLine: string

Code Example:
// Using the API in a Node.js environment
// Import the formatting function
// const { format } = require('prettier');
// const sourceCode = "foo(arg1, arg2, arg3, arg4);";
// const options = { parser: 'babel', trailingComma: 'all', printWidth: 80 };
// const formatted = format(sourceCode, options);
// console.log(formatted);

Configuration Example (.prettierrc):
{
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}

Troubleshooting Procedure:
1. Run 'prettier --check <file>' to inspect formatting errors. Expected output: exit code 0 if files are formatted correctly.
2. Use '--loglevel debug' for verbose logging if unexpected formatting occurs.
3. Verify .prettierrc configuration for correctness and compatibility with project requirements.

## Information Dense Extract
Prettier reprints source based on AST parsing. Languages: JS, JSX, Angular, Vue, Flow, TS, CSS, Less, SCSS, HTML, Ember/Handlebars, JSON, GraphQL, Markdown (GFM, MDX v1), YAML. CLI: 'prettier --write <file>', 'prettier --check <file>'. Options: --trailing-comma ('all'), --cache (bool), --cache-location (string), --objectWrap (bool), --experimentalOperatorPosition (bool). API: format(source: string, options: PrettierOptions): string; PrettierOptions: parser, printWidth, tabWidth, useTabs, semi, singleQuote, trailingComma, bracketSpacing, jsxBracketSameLine, arrowParens, endOfLine. Config file (.prettierrc) keys: printWidth:80, tabWidth:2, useTabs:false, semi:true, singleQuote:true, trailingComma:'all', bracketSpacing:true, jsxBracketSameLine:false, arrowParens:'always', endOfLine:'lf'. Troubleshooting: use '--loglevel debug', check with 'prettier --check'.

## Sanitised Extract
Table of Contents: Overview; Core Functionality; Code Formatting Mechanism; Configuration Options; Command Line Interface; Plugin Architecture; Release Features; Troubleshooting. Overview: Prettier auto-formats by removing non-essential styling. Core Functionality: Supports JavaScript, JSX, Angular, Vue, Flow, TypeScript, CSS, Less, SCSS, HTML, Ember/Handlebars, JSON, GraphQL, Markdown (GFM, MDX v1), YAML. Code Formatting Mechanism: Parses code to AST, applies maximum line length and wraps as needed. Configuration Options: --trailing-comma (default 'all'), --cache (boolean), --cache-location (string), --objectWrap (boolean), --experimentalOperatorPosition (boolean), support for TS config files. Command Line Interface: Use 'prettier --write <file>' for formatting and 'prettier --check <file>' to verify; integrates with editors for auto-format on save. Plugin Architecture: Plugins can be written as ECMAScript Modules with support for async parsing. Release Features: Version updates provide specific new features such as experimental ternaries and control flow syntax. Troubleshooting: Validate settings in .prettierrc, use 'prettier --check' for diagnostics, and run with '--loglevel debug' for detailed output.

## Original Source
Prettier Documentation
https://prettier.io/docs/en/index.html

## Digest of PRETTIER_DOCS

# PRETTIER DOCUMENTATION

Retrieved on: 2023-10-05

# Overview
Prettier is an opinionated code formatter that supports numerous languages including JavaScript (with experimental features), JSX, Angular, Vue, Flow, TypeScript, CSS, Less, SCSS, HTML, Ember/Handlebars, JSON, GraphQL, Markdown (GFM and MDX v1) and YAML. It reformats code by parsing it into an AST and reprinting it according to its own internal rules while largely removing the original styling.

# Core Functionality
- Reprints source code by considering the maximum line length; if a statement fits on one line, it remains unchanged. If not, it is reformatted with proper indentation.
- Preserves minimal original styling (empty lines, multi-line objects) where practical.

# Code Formatting Mechanism
- Reads source code, parses into an AST, then outputs formatted code respecting options such as line length.
- Example: A function call that exceeds the line length is reformatted by placing each argument on its own line with proper indentation.

# Configuration Options
- --trailing-comma: Default is "all" as of version 3.0.
- Caching Options: --cache (boolean) and --cache-location (string path).
- New Options in v3.5: --objectWrap (boolean) and --experimentalOperatorPosition (boolean).
- Support for a TypeScript configuration file.

# Command Line Interface (CLI)
- Integration with editors allows formatting on save.
- CLI commands include: 'prettier --write <file>' to reformat files and 'prettier --check <file>' to verify code formatting.

# Plugin Architecture
- Supports plugins written as ECMAScript Modules with asynchronous parsing capabilities.

# Release Features
- Release notes indicate improvements and new features in versions v3.5, v3.4, v3.3, etc., including feature enhancements and bug fixes.

# Troubleshooting
- When issues occur, verify the configuration in your .prettierrc file, run 'prettier --check' to diagnose formatting problems, and use '--loglevel debug' for detailed logs.

# Attribution
- Crawled Data Size: 1882101 bytes
- Retrieved from: https://prettier.io/docs/en/index.html


## Attribution
- Source: Prettier Documentation
- URL: https://prettier.io/docs/en/index.html
- License: License: MIT
- Crawl Date: 2025-05-02T19:12:29.036Z
- Data Size: 1882105 bytes
- Links Found: 3310

## Retrieved
2025-05-02
