# ES_MODULES

## Crawl Summary
ECMAScript Modules (ESM) in Node.js are enabled via file extensions, package.json configuration, or flags. Import specifiers are categorized as relative, bare, or absolute. URL based resolution supports file:, node:, and data:. Import attributes are used with syntax 'with { type: "json" }' for JSON modules. The import.meta object provides properties (url, filename, dirname, and resolve) for runtime metadata. Detailed algorithms (ESM_RESOLVE, ESM_FILE_FORMAT, PACKAGE_RESOLVE, PACKAGE_EXPORTS_RESOLVE) define module resolution with specific error handling and file format determination.

## Normalised Extract
Table of Contents:
1. Introduction
   - Overview of ESM support in Node.js
2. Enabling Modules
   - .mjs extension, package.json "type": "module", --input-type flag usage
3. Import Specifiers
   - Relative, Bare, Absolute; mandatory file extensions; package resolution via "exports"
4. URL Schemes
   - file:, node:, data: URLs; percent-encoding rules; use of url.pathToFileURL
5. Import Attributes
   - Syntax: import foo from './foo.json' with { type: 'json' };
   - Requirement of type attribute for JSON modules
6. Built-in Modules and Dynamic Imports
   - Built-in modules expose named exports and default export; dynamic import() support
7. import.meta Usage
   - Properties: import.meta.url, import.meta.filename, import.meta.dirname, import.meta.resolve(specifier)
   - Method signature: import.meta.resolve(specifier: string, [parent: string|URL]) returns string
8. Resolution Algorithms
   - ESM_RESOLVE: Resolves module specifiers using URL resolution, error conditions, and file/directory checks
   - ESM_FILE_FORMAT: Determines module format (.mjs -> module, .cjs -> commonjs, .json -> json, .wasm with flag, .js based on package.json "type")
9. Package Resolution
   - Algorithms: PACKAGE_RESOLVE, PACKAGE_EXPORTS_RESOLVE, PACKAGE_IMPORTS_RESOLVE
   - Conditions for valid package names, handling of bare specifiers, and error conditions

Detailed Technical Information:
- Use .mjs for ESM, .cjs for CommonJS; if unspecified, inspect code for ES module syntax.
- Data URLs support MIME types text/javascript, application/json, application/wasm.
- import.meta.resolve synchronously returns the absolute URL string for a given specifier. It supports an optional parent URL parameter.
- Resolution algorithm involves validating URL encodings, checking file existence, resolving directory indexes, and throwing errors if target is a directory or non-existent.
- ESM_FILE_FORMAT inspects the file extension and package.json "type" field to determine module format.
- Package resolution includes strict checks for invalid specifiers, proper usage of ./ prefixes, and correct handling of Node.js builtin modules using node: URLs.

## Supplementary Details
Exact Technical Specifications:
- Enabling ESM:
  .mjs files, package.json {"type": "module"}, or --input-type=module
- import.meta Properties:
  • import.meta.url: string (absolute file URL)
  • import.meta.filename: string (absolute file path, requires file: protocol)
  • import.meta.dirname: string (derived from import.meta.filename)
  • import.meta.resolve(specifier: string, [parent: string|URL]): string
- ESM_RESOLVE Algorithm (pseudocode):
  1. If specifier is a valid URL, parse and reserialize it.
  2. If specifier begins with '/', './', or '../', resolve with URL relative to parentURL.
  3. If specifier begins with '#', use PACKAGE_IMPORTS_RESOLVE.
  4. Otherwise, treat as a bare specifier and use PACKAGE_RESOLVE.
  5. Validate resolved URL: no forbidden percent encodings; file exists; not a directory.
  6. Determine format via ESM_FILE_FORMAT.

- ESM_FILE_FORMAT Function:
  • .mjs -> 'module'
  • .cjs -> 'commonjs'
  • .json -> 'json'
  • .wasm (if flag enabled) -> 'wasm'
  • .js -> Check package.json "type" field; detect module syntax

- Package Resolution Functions (PACKAGE_RESOLVE, PACKAGE_EXPORTS_RESOLVE):
  • Handle bare specifiers, lookup in node_modules, check package.json "exports" field
  • Throw errors for invalid package configuration or missing exports

- Configuration Options:
  • Command-line flags: --input-type, --experimental-wasm-modules, --experimental-addon-modules, --experimental-import-meta-resolve
  • package.json "type" field: 'module' or 'commonjs'

- Best Practices:
  • Always specify file extensions in import statements
  • Use import.meta for resolving relative file paths in ESM
  • When interoperating with CommonJS, use module.createRequire if necessary

- Troubleshooting Procedures:
  • Commands:
    - Check module resolution: node --trace-resolutions app.mjs
    - Diagnose invalid specifiers: Verify percent-encoding in file URLs
    - Validate package.json configuration using JSON lint tools
  • Expected errors include: Invalid Module Specifier, Module Not Found, Unsupported Directory Import

## Reference Details
API Specifications and Implementation Patterns:
• import.meta.resolve(specifier: string, [parent: string|URL]) -> string
  - Resolves a module-relative specifier synchronously.
  - Throws errors if specifier is invalid or if resolution encounters file system issues.

Example Usage:
  // In an ES module file, use import.meta properties:
  const resolvedUrl = import.meta.resolve('./dep.js');
  // resolvedUrl returns the absolute file URL of './dep.js'

Resolution Algorithm (ESM_RESOLVE):
  function ESM_RESOLVE(specifier, parentURL) {
    if (isValidURL(specifier)) {
      return reserialize(parseURL(specifier));
    } else if (specifier.startsWith('/') || specifier.startsWith('./') || specifier.startsWith('../')) {
      return resolveURL(specifier, parentURL);
    } else if (specifier.startsWith('#')) {
      return PACKAGE_IMPORTS_RESOLVE(specifier, parentURL, conditions);
    } else {
      return PACKAGE_RESOLVE(specifier, parentURL);
    }
  }

• ESM_FILE_FORMAT(url: string): string
  - Returns:
    .mjs: 'module'
    .cjs: 'commonjs'
    .json: 'json'
    .wasm: 'wasm' (if experimental flag enabled)
    .js: Based on package.json "type" and source detection

• Configuration Flags and Effects:
  --input-type=module / --input-type=commonjs: Overrides default module system detection
  --experimental-wasm-modules: Enables loading .wasm files as modules
  --experimental-addon-modules: Enables loading .node files
  --experimental-import-meta-resolve: Allows an optional second parameter (parent) in import.meta.resolve

• Best Practice Code Pattern:
  Using import.meta for relative path resolution in an ES module:
    import { readFileSync } from 'node:fs';
    const fileUrl = new URL('./data.proto', import.meta.url);
    const buffer = readFileSync(fileUrl);

• Troubleshooting:
  1. Run Node.js with --trace-resolutions to log module resolution details.
  2. Verify that file extensions are correctly specified in import paths.
  3. Check package.json for the correct "type" field to match the intended module system.
  4. Use url.pathToFileURL to correctly convert local paths to file URLs if issues arise.

Return Types:
  - import.meta.resolve: returns string representing absolute URL
  - ESM_RESOLVE and ESM_FILE_FORMAT: return string (module format)
  - Functions throw errors such as Invalid Module Specifier, Module Not Found, or Unsupported Directory Import

Full SDK Method Signature Example:
  // Example of constructing a require function in an ES module:
  import { createRequire } from 'module';
  const require = createRequire(import.meta.url);
  const commonJSModule = require('./cjsModule.cjs');


## Information Dense Extract
ESM enabled via .mjs, package.json type:module, or --input-type flag; Import specifiers: relative (with extension), bare (node_modules, exports field), absolute (file://); URL schemes: file:, node:, data:; Import attributes syntax: import foo from './foo.json' with { type:'json' }; import.meta properties: url (string), filename (string, file: only), dirname (derived), resolve(specifier: string, [parent]) returns absolute URL string; Resolution algorithms: ESM_RESOLVE validates URL, resolves relative paths, processes bare specifiers via PACKAGE_RESOLVE; ESM_FILE_FORMAT: .mjs->module, .cjs->commonjs, .json->json, .js based on package.json type and detected syntax, .wasm if flag enabled; Configuration flags: --experimental-wasm-modules, --experimental-addon-modules, --experimental-import-meta-resolve; Best practices: specify file extensions, use import.meta for relative resolution, createRequire for CommonJS interop; Troubleshooting: use --trace-resolutions, validate percent encoding, check package.json; API: import.meta.resolve(specifier: string, [parent: string|URL]) -> string; Detailed algorithm pseudocode provided for module resolution, error handling includes Invalid Module Specifier, Module Not Found.

## Sanitised Extract
Table of Contents:
1. Introduction
   - Overview of ESM support in Node.js
2. Enabling Modules
   - .mjs extension, package.json 'type': 'module', --input-type flag usage
3. Import Specifiers
   - Relative, Bare, Absolute; mandatory file extensions; package resolution via 'exports'
4. URL Schemes
   - file:, node:, data: URLs; percent-encoding rules; use of url.pathToFileURL
5. Import Attributes
   - Syntax: import foo from './foo.json' with { type: 'json' };
   - Requirement of type attribute for JSON modules
6. Built-in Modules and Dynamic Imports
   - Built-in modules expose named exports and default export; dynamic import() support
7. import.meta Usage
   - Properties: import.meta.url, import.meta.filename, import.meta.dirname, import.meta.resolve(specifier)
   - Method signature: import.meta.resolve(specifier: string, [parent: string|URL]) returns string
8. Resolution Algorithms
   - ESM_RESOLVE: Resolves module specifiers using URL resolution, error conditions, and file/directory checks
   - ESM_FILE_FORMAT: Determines module format (.mjs -> module, .cjs -> commonjs, .json -> json, .wasm with flag, .js based on package.json 'type')
9. Package Resolution
   - Algorithms: PACKAGE_RESOLVE, PACKAGE_EXPORTS_RESOLVE, PACKAGE_IMPORTS_RESOLVE
   - Conditions for valid package names, handling of bare specifiers, and error conditions

Detailed Technical Information:
- Use .mjs for ESM, .cjs for CommonJS; if unspecified, inspect code for ES module syntax.
- Data URLs support MIME types text/javascript, application/json, application/wasm.
- import.meta.resolve synchronously returns the absolute URL string for a given specifier. It supports an optional parent URL parameter.
- Resolution algorithm involves validating URL encodings, checking file existence, resolving directory indexes, and throwing errors if target is a directory or non-existent.
- ESM_FILE_FORMAT inspects the file extension and package.json 'type' field to determine module format.
- Package resolution includes strict checks for invalid specifiers, proper usage of ./ prefixes, and correct handling of Node.js builtin modules using node: URLs.

## Original Source
Node.js ES Modules Documentation
https://nodejs.org/api/esm.html

## Digest of ES_MODULES

# Introduction
Node.js supports ECMAScript Modules (ESM) as the official standard for modular JavaScript. The documentation details module definitions using import/export statements, usage examples, enabling mechanisms, and interoperability with CommonJS.

# Enabling ESM
Modules can be enabled by:
- Using the .mjs file extension
- Setting the package.json "type" field to "module"
- Using the --input-type=module flag

For CommonJS, use .cjs extension, package.json "type": "commonjs", or --input-type=commonjs. When unspecified, Node.js inspects the source code for ES module syntax.

# Import Specifiers
Specifiers in import statements are categorized into:
- Relative (e.g. ./startup.js, ../config.mjs) – file extension required
- Bare (e.g. some-package, some-package/shuffle) – resolved via package entry or "exports" field
- Absolute (e.g. file:///opt/nodejs/config.js) – fully qualified

# URL Schemes
Module resolution uses URL semantics. Supported schemes include:
- file:
- node:
- data:

Special characters must be percent-encoded. For file URLs, use url.pathToFileURL for correct conversion. Data URLs support MIME types text/javascript, application/json, and application/wasm.

# Import Attributes
Import attributes allow additional information with the module specifier. The syntax is:

  import fooData from './foo.json' with { type: 'json' };

The type attribute is mandatory for JSON modules. Only the 'type' attribute is supported in Node.js and accepts values such as 'json'.

# Built-in Modules and Dynamic Imports
Built-in modules (e.g. 'node:fs', 'node:events') expose both named exports and a default export corresponding to CommonJS exports. Dynamic import() expressions are supported in both ESM and CommonJS contexts.

# import.meta and Its Properties
The import.meta object contains module-specific metadata:
- import.meta.url: Absolute file URL of the module
- import.meta.filename: Resolved absolute path (for file: modules only)
- import.meta.dirname: Directory name derived from import.meta.filename
- import.meta.resolve(specifier): Synchronously resolves a specifier to an absolute URL string

Method signature:
  import.meta.resolve(specifier: string, [parent: string|URL]): string

# Resolution and Loading Algorithms
Node.js uses a two-stage resolution process:
1. ESM_RESOLVE: Resolves a module specifier against a parent URL.
   - Handles relative paths, bare specifiers, and URL validity
   - Validates file existence and directory imports
   - Returns the module format using ESM_FILE_FORMAT

2. ESM_FILE_FORMAT:
   - .mjs returns "module"
   - .cjs returns "commonjs"
   - .json returns "json"
   - .wasm (with flag) returns "wasm"
   - For .js, the package.json "type" field and source detection determine the format

Additionally, package resolution involves:
- PACKAGE_RESOLVE for bare specifiers
- PACKAGE_EXPORTS_RESOLVE and PACKAGE_IMPORTS_RESOLVE for exports/imports mappings
- Error handling including Invalid Module Specifier, Module Not Found, and Unsupported Directory Import errors

# Detailed Resolution Algorithms
The documentation includes detailed pseudocode for algorithms such as:
- ESM_RESOLVE(specifier, parentURL)
- PACKAGE_RESOLVE(packageSpecifier, parentURL)
- PACKAGE_EXPORTS_RESOLVE(packageURL, subpath, exports, conditions)
- ESM_FILE_FORMAT(url)

Each algorithm outlines conditions, error cases, and the process of resolving a module specifier to a concrete URL and determining its format.

Retrieved on: 2023-10-06
Attribution: Node.js v23.11.0 documentation; Data Size: 3548275 bytes

## Attribution
- Source: Node.js ES Modules Documentation
- URL: https://nodejs.org/api/esm.html
- License: License: Public Domain
- Crawl Date: 2025-05-02T20:08:23.060Z
- Data Size: 3548275 bytes
- Links Found: 2270

## Retrieved
2025-05-02
