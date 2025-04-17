# ECMASCRIPT_MODULES

## Crawl Summary
The technical details detail the Node.js ECMAScript modules implementation. Major topics include enabling ES modules via .mjs and package.json type field, module resolution for relative, bare, and absolute specifiers, required file extensions, URL-based resolution schemes, use of import.meta properties (dirname, filename, url, resolve), interoperability with CommonJS (handling of default export and named export detection), support for JSON and Wasm modules, top-level await usage, and the complete resolution algorithm including subroutines like ESM_RESOLVE, ESM_FILE_FORMAT, PACKAGE_RESOLVE and PACKAGE_TARGET_RESOLVE. The document also covers error conditions and custom loader integration.

## Normalised Extract
Table of Contents:
1. Introduction
   - Native import/export syntax examples for ES modules.
2. Enabling
   - Activation via .mjs, package.json "type": "module", --input-type flag.
3. Packages
   - Package file resolution and explicit file extensions.
4. Import Specifiers
   - Types: Relative, Bare, Absolute and their resolution.
5. Mandatory File Extensions & URLs
   - Requirement for file extensions, usage of URL schemes, percent encoding details.
6. File: URLs
   - Behavior when using query parameters and fragments.
7. Data: and Node: Imports
   - Importing data using MIME types and built-in module via node: URLs.
8. Import Attributes
   - Inline syntax and supported attributes (type for JSON).
9. Built-in Modules & import() expressions
   - Default and named exports examples; dynamic import usage.
10. import.meta
    - Properties: dirname, filename, url, resolve(specifier) with usage examples.
11. Interoperability with CommonJS
    - Handling of CommonJS modules, absence of __filename/__dirname, and alternative require.resolve.
12. JSON and Wasm Modules
    - Correct import syntax and experimental flag usage for Wasm.
13. Top-Level Await
    - Syntax usage and process exit condition if unresolved.
14. Loaders and Resolution Algorithms
    - Detailed steps for module resolution including algorithms: ESM_RESOLVE and ESM_FILE_FORMAT, handling errors such as Invalid Module Specifier, Package Not Found, and Unsupported Directory Import.
15. Customizing Resolution
    - Custom loader integration and overriding default behavior.

Each topic includes specific code examples, exact command line flags, and algorithmic steps developers can directly implement in Node.js environment.

## Supplementary Details
Detailed Implementation Steps:
- To enable an ES module, rename file to .mjs or set package.json to { "type": "module" }.
- For CommonJS, use .cjs or set package.json to { "type": "commonjs" }.
- Importing JSON modules must include with { type: 'json' }. Example:
  import config from './config.json' with { type: 'json' };
- Use import.meta.resolve(specifier) to synchronously resolve module URLs. Example:
  const assetURL = import.meta.resolve('./asset.css');

Resolution Algorithm Details:
- ESM_RESOLVE(specifier, parentURL):
  if (isValidURL(specifier)) {
    return { format: undefined, resolved: new URL(specifier).toString() };
  } else if (specifier.startsWith("/")) {
    // Resolve relative to parentURL
  } else if (specifier.startsWith("./") || specifier.startsWith("../")) {
    // Use relative URL resolution
  } else if (specifier.startsWith("#")) {
    // Call PACKAGE_IMPORTS_RESOLVE
  } else {
    // Bare specifier resolution through PACKAGE_RESOLVE
  }

- ESM_FILE_FORMAT(url):
  if (url.endsWith('.mjs')) return 'module';
  if (url.endsWith('.cjs')) return 'commonjs';
  if (url.endsWith('.json')) return 'json';
  if (experimentalWasmModules && url.endsWith('.wasm')) return 'wasm';
  if (experimentalAddonModules && url.endsWith('.node')) return 'addon';
  if (url.endsWith('.js')) {
    // Check package.json "type" field and module syntax detection
  }

Configuration Options:
- --input-type=module or --input-type=commonjs forces module interpretation.
- --experimental-wasm-modules: Enables .wasm module import.
- --experimental-addon-modules: Enables addon module import for .node files.

Troubleshooting Procedures:
- If a module fails to load with an "Invalid Module Specifier" error, ensure the specifier is a valid URL or relative path including the file extension.
- For JSON modules, verify the use of { type: 'json' } in the import statement.
- To debug resolution issues, log the output of import.meta.resolve(specifier) to verify URL resolution.
- Use node --trace-resolutions flag to trace the resolution process during startup for detailed diagnostic information.

Best Practices:
- Always use explicit file extensions in import statements.
- In mixed module projects, clearly separate ES modules (.mjs) from CommonJS (.cjs).
- Employ import.meta properties to derive local paths when __dirname or __filename are not available.
- Validate package.json exports/imports configuration when using bare specifiers.


## Reference Details
Complete API Specifications:

1. import.meta.resolve(specifier, parent?)
   - Parameters:
     * specifier (string): The module specifier to resolve relative to the current module.
     * parent (string|URL) [optional]: An absolute parent module URL to use for resolution. Default is import.meta.url.
   - Returns: string – The absolute URL string of the resolved module.
   - Exceptions: Throws if specifier is invalid or resolution fails.

2. ESM_RESOLVE(specifier, parentURL)
   - An internal algorithm that:
     * Checks if specifier is a valid URL and reserializes it.
     * Resolves relative specifiers using URL resolution.
     * For bare specifiers, delegates to PACKAGE_RESOLVE.
   - Returns: { format: string | undefined, resolved: string }
   - Throws errors: Invalid Module Specifier, Module Not Found, Unsupported Directory Import.

3. ESM_FILE_FORMAT(url)
   - Input: url (string) representing the file URL of the module.
   - Returns:
     * "module" for .mjs
     * "commonjs" for .cjs
     * "json" for .json
     * "wasm" if experimental flag enabled and file ends with .wasm
     * "addon" if experimental flag enabled and file ends with .node
     * For .js files, returns package type based on package.json or detected module syntax.
   - Throws during load phase if format is undefined.

4. Dynamic Import Example:
   // In a CommonJS module, to import an ES module:
   (async () => {
     const module = await import('./module.mjs');
     console.log(module);
   })();

5. CommonJS Interoperability Example:
   // Import a CommonJS module in an ES module
   import cjs from './cjs.cjs';
   console.log(cjs);
   
   // Using module.createRequire() when __filename and __dirname are needed:
   import { createRequire } from 'module';
   const require = createRequire(import.meta.url);
   const path = require('path');

Detailed Troubleshooting:
- Command: node --trace-resolutions app.mjs
  Expected output: Detailed logs of module resolution steps, including resolved file URLs and any errors in specifier parsing.
- If top-level await causes process exit with code 13, check for unresolved promises in the module body.

Implementation Patterns:
- Always validate import specifiers with explicit file extensions.
- Leverage import.meta for resolving relative resources:
  const filePath = new URL('./data.proto', import.meta.url);
  const data = readFileSync(filePath);

Configuration Options Summary:
- --input-type: 'module' or 'commonjs' (default based on file extension or package.json "type")
- --experimental-wasm-modules: boolean (enables .wasm imports)
- --experimental-addon-modules: boolean (enables .node addon imports)

Return Types:
- All resolution functions return strings (absolute URL) or a structured object containing format and resolved.

SDK Method Signatures included above are directly usable in Node.js environment as per v23.11.0 documentation.


## Original Source
Node.js ECMAScript Modules Documentation
https://nodejs.org/api/esm.html

## Digest of ECMASCRIPT_MODULES

# ECMASCRIPT MODULES

**Retrieved:** 2023-10-19

This document contains the detailed technical specifications for Node.js ECMAScript modules as presented in the Node.js v23.11.0 documentation. The content includes implementation details regarding enabling modules, import specifiers, resolution algorithms, module formats, load process, and interoperability with CommonJS.

## Introduction

- ECMAScript modules use native import/export syntax.
- Example export:
  
  // addTwo.mjs
  function addTwo(num) {
    return num + 2;
  }
  
  export { addTwo };

- Example import:
  
  // app.mjs
  import { addTwo } from './addTwo.mjs';
  console.log(addTwo(4));

## Enabling

- ES modules activated by:
  - .mjs file extension
  - package.json with "type": "module"
  - --input-type=module flag

- CommonJS is enforced by:
  - .cjs file extension
  - package.json with "type": "commonjs"
  - --input-type=commonjs flag

## Packages

- Package resolution rules require explicit file extensions for relative and absolute paths.
- Directory index files must be fully specified (e.g. './startup/index.js').

## Import Specifiers

- Specifiers classified as:
  1. **Relative:** './startup.js', '../config.mjs'
  2. **Bare:** 'some-package' or 'some-package/shuffle'
  3. **Absolute:** 'file:///opt/nodejs/config.js'

- Node.js resolves bare specifiers through its module resolution and loading algorithm.

## Mandatory File Extensions and URLs

- File extension required when using import. 
- ES modules are resolved as URLs with percent encoding for special characters.
- Supported schemes: file:, node:, data:

## File: URLs

- Modules loaded multiple times if query/fragment differs.
- Use url.pathToFileURL for resolving paths.

## Data: and Node: Imports

- data: imports support MIME types:
  - text/javascript for ES modules
  - application/json for JSON
  - application/wasm for Wasm

- Node: imports allow builtin modules to be referenced with a URL (e.g. import fs from 'node:fs/promises').

## Import Attributes

- Syntax: 
  import fooData from './foo.json' with { type: 'json' };
- Only the type attribute is supported; required for JSON modules.

## Built-in Modules & import() expressions

- Built-in modules (like 'node:fs' and 'node:events') export both named and default exports.
- Dynamic import: supported in both CommonJS and ES modules.

## import.meta

- Contains properties:
  - import.meta.dirname: directory of current module (file: modules only)
  - import.meta.filename: absolute path with symlinks resolved (file: modules only)
  - import.meta.url: file URL of the module
  - import.meta.resolve(specifier): synchronous resolution of a specifier relative to the current module

## Interoperability with CommonJS

- ES module import can load CommonJS modules:
  - When using CommonJS, module.exports is available as the default export.
  - Named exports may be obtained via static analysis.
  - No __filename, __dirname; use import.meta
  - No Addon Loading, require.resolve, NODE_PATH, require.extensions, require.cache

## JSON and Wasm Modules

- JSON modules must be imported with: 
  import packageConfig from './package.json' with { type: 'json' };
- Wasm modules supported via --experimental-wasm-modules flag, e.g. import * as M from './module.wasm';

## Top-Level Await

- Top-level await is allowed in ES modules. Example:
  export const five = await Promise.resolve(5);

- Unresolved promises cause exit with status 13.

## Loaders and Resolution Algorithms

- The default resolver uses:
  - FileURL-based resolution
  - Relative/absolute URL resolution
  - No default file extensions or folder mains
  - Bare specifier lookup via node_modules
- **ESM_RESOLVE(specifier, parentURL)** returns a tuple { format, resolved } after performing:
  - URL parsing and reserializing if valid
  - Relative resolution if specifier starts with "/", "./", or "../"
  - PACKAGE_RESOLVE for bare specifiers

- **ESM_FILE_FORMAT(url)** algorithm:
  - Returns "module" for .mjs
  - Returns "commonjs" for .cjs
  - Returns "json" for .json
  - Additional experimental formats: "wasm", "addon"
  - If .js extension exists, detection of module syntax is performed.

## Resolution Algorithm Specification

- Outlines detailed steps for:
  - PACKAGE_RESOLVE
  - PACKAGE_SELF_RESOLVE
  - PACKAGE_EXPORTS_RESOLVE
  - PACKAGE_IMPORTS_RESOLVE
  - PACKAGE_TARGET_RESOLVE
  - PATTERN_KEY_COMPARE

- Exceptions:
  - Invalid Module Specifier, Package Configuration, Package Target, Module Not Found, Unsupported Directory Import

## Customizing ESM Specifier Resolution

- Custom loaders can override default resolution behavior.
- Example provided: commonjs-extension-resolution-loader


## Attribution
- Source: Node.js ECMAScript Modules Documentation
- URL: https://nodejs.org/api/esm.html
- License: License: Node.js Foundation License
- Crawl Date: 2025-04-17T17:55:34.151Z
- Data Size: 3503502 bytes
- Links Found: 2152

## Retrieved
2025-04-17
