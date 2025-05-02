# NODE_ESM

## Crawl Summary
Node.js ESM documentation details enabling ES modules using .mjs extension, package.json type, and input flags. It specifies strict import attribute syntax (e.g., { type: 'json' } for JSON imports), describes the import.meta object with its dirname, filename, url, and resolve() method, and outlines a detailed multi-stage resolution algorithm including ESM_RESOLVE, ESM_FILE_FORMAT, and PACKAGE_RESOLVE functions with precise error conditions. The interoperability with CommonJS is addressed including the default export for CommonJS modules, module.createRequire() for require, and limitations such as no __dirname or __filename in ESM.

## Normalised Extract
Table of Contents:
1. Introduction
   - Definition and basic usage with export/import syntax.
2. Enabling ESM
   - Use .mjs extension, package.json "type": "module", or --input-type flag.
3. Import Attributes
   - Usage: import foo from './foo.json' with { type: 'json' }.
   - Mandatory attribute for JSON modules.
4. import.meta Object
   - Contains dirname (string), filename (string), url (string), and resolve(specifier: string) which returns an absolute URL string.
5. Resolution and Loading Algorithm
   - ESM_RESOLVE(specifier, parentURL): Returns { format, resolved }.
   - ESM_FILE_FORMAT(url): Determines module format based on file extension (.mjs, .cjs, .json, .wasm, .node).
   - PACKAGE_RESOLVE, PACKAGE_EXPORTS_RESOLVE, and PACKAGE_IMPORTS_RESOLVE handle bare specifiers and package configuration errors.
6. Interoperability with CommonJS
   - CommonJS modules are imported with default export; supports module.createRequire() for require.

Detailed Topics:
1. Introduction: ES modules use explicit syntax with export and import. Example provided for simple utility functions.
2. Enabling ESM: File marking using extensions and package.json field eliminates need for additional flags if ESM syntax is detected.
3. Import Attributes: Inline with statements to convey additional module metadata; currently supports only the type attribute with JSON modules requiring { type: 'json' }.
4. import.meta: Provides module environment information:
   - import.meta.dirname: directory of module (file: only).
   - import.meta.filename: absolute resolved filename.
   - import.meta.url: file: URL of the module.
   - import.meta.resolve(specifier): resolves a module specifier relative to the current module synchronously.
5. Resolution Algorithm: Involves steps to validate specifiers, resolve relative, absolute, and bare specifiers. Handles errors such as Invalid Module Specifier, Module Not Found, and Unsupported Directory Import.
6. CommonJS Interop: ES module can import CommonJS. When imported, module.exports becomes the default export. For advanced use, module.createRequire() is used to construct a require function.


## Supplementary Details
Exact technical specifications:
- Enabling flags: --input-type=module or --input-type=commonjs establish interpretation mode.
- File Extensions: .mjs enforces module format; .cjs enforces CommonJS; .json enforces JSON module with { type: 'json' }.
- import.meta.resolve API:
  Signature: import.meta.resolve(specifier: string): string. Returns resolved URL string. Throws errors for invalid paths or unsupported protocols.
- ESM_FILE_FORMAT: Returns 'module' for .mjs, 'commonjs' for .cjs, 'json' for .json. Optional experimental flags determine support for .wasm (requires --experimental-wasm-modules) and .node (requires --experimental-addon-modules).
- Resolution Algorithm details:
  * ESM_RESOLVE performs URL resolution using relative URL semantics when specifiers start with '/', './' or '../'.
  * Bare specifiers trigger PACKAGE_RESOLVE which appends 'node_modules/' and applies package.json exports.
  * Detailed error conditions include invalid specifiers if containing special characters (%2F, %5C) or if referencing directories.
- Interoperability: CommonJS modules are wrapped to include a default export and potentially named exports via static analysis. Use module.createRequire(import.meta.url) to call require in ESM.
- Best Practice: Use url.pathToFileURL for converting file system paths to import compatible URLs.


## Reference Details
API Specifications and Implementation Details:
1. import.meta.resolve(specifier: string): string
   - Inputs: specifier (string) that may be relative, absolute, or bare.
   - Returns: Absolute URL as a string.
   - Errors: Throws Invalid Module Specifier error if resolution fails.

2. ESM_RESOLVE(specifier: string, parentURL: string): { format: string, resolved: string }
   - Determines the module format using ESM_FILE_FORMAT. Returns an object with format ('module', 'commonjs', 'json', 'wasm', 'addon') and the resolved URL.
   - Throws errors: Invalid Module Specifier, Module Not Found, Unsupported Directory Import.

3. ESM_FILE_FORMAT(url: string): string
   - Checks file extension:
     .mjs -> 'module'
     .cjs -> 'commonjs'
     .json -> 'json'
     .wasm -> 'wasm' (if --experimental-wasm-modules enabled)
     .node -> 'addon' (if --experimental-addon-modules enabled)
   - Fallback: if .js then applies package.json "type" field and detection of module syntax.

4. module.createRequire(moduleURL: string): Function
   - Usage: const require = module.createRequire(import.meta.url);
   - Returns: A function that mimics CommonJS require. Supports require.resolve and require.cache functionalities.

5. Example Code:
   // Using import.meta and module.createRequire
   import { readFileSync } from 'node:fs';
   const require = module.createRequire(import.meta.url);
   const pkg = require('./package.json');
   console.log('Package Name:', pkg.name);

6. Configuration Options:
   - --input-type: 'module' or 'commonjs'
   - --experimental-wasm-modules: Enables .wasm import support
   - --experimental-addon-modules: Enables .node addon support

7. Troubleshooting Procedures:
   - If import.meta properties are undefined, verify that the module is loaded via file: protocol.
   - For resolution errors, check that file extensions are provided and URL encoding is correct (e.g., use %23 for '#').
   - Use the command: node --input-type=module yourModule.mjs to explicitly enforce ESM.
   - Validate package.json exports field when using bare specifiers; errors include Invalid Package Target or Package Path Not Exported.

8. Best Practices:
   - Always include file extensions in import statements in ESM.
   - Use import.meta.url with url.pathToFileURL for dynamic file path resolution.
   - Leverage module.createRequire to maintain interoperability when mixing ESM and CommonJS.
   - For JSON imports, always include with { type: 'json' }.
   - Examine error messages from ESM_RESOLVE to adjust module specifiers as needed.


## Information Dense Extract
ESM: .mjs forces module; .cjs forces CommonJS; package.json "type" key; --input-type flag. import.meta includes dirname, filename, url, resolve(specifier:string):string. ESM_RESOLVE(specifier, parentURL) returns {format, resolved} with formats: module (.mjs), commonjs (.cjs), json (.json), wasm (with flag), addon (with flag). ESM_FILE_FORMAT inspects extension; fallback on package.json type for .js. Dynamic import() supported. module.createRequire(import.meta.url) for CommonJS interop. Error conditions: invalid module specifier, unsupported directory import, module not found. Best practice: use full file extensions, url.pathToFileURL for conversion, include type attribute for JSON.

## Sanitised Extract
Table of Contents:
1. Introduction
   - Definition and basic usage with export/import syntax.
2. Enabling ESM
   - Use .mjs extension, package.json 'type': 'module', or --input-type flag.
3. Import Attributes
   - Usage: import foo from './foo.json' with { type: 'json' }.
   - Mandatory attribute for JSON modules.
4. import.meta Object
   - Contains dirname (string), filename (string), url (string), and resolve(specifier: string) which returns an absolute URL string.
5. Resolution and Loading Algorithm
   - ESM_RESOLVE(specifier, parentURL): Returns { format, resolved }.
   - ESM_FILE_FORMAT(url): Determines module format based on file extension (.mjs, .cjs, .json, .wasm, .node).
   - PACKAGE_RESOLVE, PACKAGE_EXPORTS_RESOLVE, and PACKAGE_IMPORTS_RESOLVE handle bare specifiers and package configuration errors.
6. Interoperability with CommonJS
   - CommonJS modules are imported with default export; supports module.createRequire() for require.

Detailed Topics:
1. Introduction: ES modules use explicit syntax with export and import. Example provided for simple utility functions.
2. Enabling ESM: File marking using extensions and package.json field eliminates need for additional flags if ESM syntax is detected.
3. Import Attributes: Inline with statements to convey additional module metadata; currently supports only the type attribute with JSON modules requiring { type: 'json' }.
4. import.meta: Provides module environment information:
   - import.meta.dirname: directory of module (file: only).
   - import.meta.filename: absolute resolved filename.
   - import.meta.url: file: URL of the module.
   - import.meta.resolve(specifier): resolves a module specifier relative to the current module synchronously.
5. Resolution Algorithm: Involves steps to validate specifiers, resolve relative, absolute, and bare specifiers. Handles errors such as Invalid Module Specifier, Module Not Found, and Unsupported Directory Import.
6. CommonJS Interop: ES module can import CommonJS. When imported, module.exports becomes the default export. For advanced use, module.createRequire() is used to construct a require function.

## Original Source
Node.js ESM Modules
https://nodejs.org/api/esm.html

## Digest of NODE_ESM

# Introduction
Node.js supports ECMAScript modules (ESM) as the official standard for packaging JavaScript code. ES modules are defined using import and export statements. Example:

// addTwo.mjs
function addTwo(num) {
  return num + 2;
}
export { addTwo };

// app.mjs
import { addTwo } from './addTwo.mjs';
console.log(addTwo(4));

# Enabling ESM
ESM can be enabled in Node.js by:
- Using the .mjs extension.
- Setting the package.json "type" field to "module".
- Using the --input-type=module flag.

For CommonJS, use .cjs, type "commonjs", or --input-type=commonjs.
If no marker is present, Node.js inspects the code for ESM syntax.

# Import Attributes
Node.js supports inline import attributes to pass metadata alongside the module specifier. For example:

import fooData from './foo.json' with { type: 'json' };

When using JSON modules the attribute { type: 'json' } is mandatory.

# Built-in Modules and Dynamic Import
Built-in modules provide a default export that matches CommonJS exports. Dynamic import() expressions are available in both ESM and CommonJS. Example:

import fs from 'node:fs';
import { readFile } from 'node:fs';

# import.meta
The import.meta object includes:
- import.meta.dirname: Directory of the current module (file: modules only).
- import.meta.filename: Absolute path and filename with symlinks resolved.
- import.meta.url: Absolute file URL of the module.
- import.meta.resolve(specifier): Synchronously resolves a module specifier relative to the current module.

Example use:
const resolved = import.meta.resolve('./dep.js');

# Resolution and Loading Algorithm
The ESM resolution involves several algorithms:
- ESM_RESOLVE(specifier, parentURL): Returns { format, resolved }.
- ESM_FILE_FORMAT(url): Determines the file format based on extension (.mjs -> module, .cjs -> commonjs, .json -> json, .wasm with flag -> wasm, .node with flag -> addon).
- PACKAGE_RESOLVE and PACKAGE_EXPORTS_RESOLVE: Handle bare specifiers and package export/import resolutions.

Detailed error handling includes:
- Invalid Module Specifier
- Invalid Package Configuration
- Module Not Found
- Unsupported Directory Import

# Interoperability with CommonJS
ES modules can import CommonJS modules using import statements. In CommonJS, require() is used; however, module.createRequire() allows access to require in ESM. CommonJS modules yield their module.exports as the default export and may also expose named exports via static analysis.

# Additional Features
- JSON modules: Imported using { type: 'json' } and always expose a default export.
- Top-level await: Allows await in the module body; if unresolved, process exits with code 13.
- Data URL imports and node: imports: Special URL schemes are supported and require proper encoding.

# Attribution
Content retrieved from Node.js ESM Modules documentation on 2023-10-XX. Data Size: 4350742 bytes.

## Attribution
- Source: Node.js ESM Modules
- URL: https://nodejs.org/api/esm.html
- License: License: Creative Commons (as per Node.js documentation)
- Crawl Date: 2025-05-02T17:53:58.907Z
- Data Size: 4350742 bytes
- Links Found: 5376

## Retrieved
2025-05-02
