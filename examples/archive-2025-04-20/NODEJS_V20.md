# NODEJS_V20

## Crawl Summary
Technical details extracted from Node.js v20 release notes include the Permission Model (enabled via --experimental-permission), dedicated thread execution for custom ESM loader hooks using --experimental-loader, synchronous behavior of import.meta.resolve despite async hooks, V8 engine update to 11.3 with new JS API features, stable test_runner module, Ada 2.0 URL parsing improvements eliminating the ICU dependency, new mechanism for packaging single executable apps using injected blobs from JSON config, updated Web Crypto API argument coercion as per WebIDL, official ARM64 Windows binaries and mandatory WASI version specification. The release notes also list extensive commit details across Semver-Major, -Minor, and -Patch changes along with download links and SHASUMS for verification.

## Normalised Extract
# Table of Contents
1. Permission Model
2. Custom ESM Loader Hooks
3. Synchronous import.meta.resolve()
4. V8 11.3 Update
5. Stable Test Runner
6. Ada 2.0 URL Parser
7. Single Executable Application Packaging
8. Web Crypto API Enhancements
9. ARM64 Windows Support
10. WASI Version Requirement
11. Deprecations and Removals
12. Commit Details and Build Configurations
13. Download Binaries and SHASUMS

---

## 1. Permission Model
- Activation: Use flag `--experimental-permission`.
- Effects: Restricts file system, child process, and worker thread operations.
- Use Case: Prevents untrusted code from sensitive operations.

## 2. Custom ESM Loader Hooks
- Activation via: `--experimental-loader=foo.mjs`.
- Implementation: Runs loader hooks on a separate thread to ensure isolation.
- Note: Loader code remains separated from application logic.

## 3. Synchronous import.meta.resolve()
- Behavior: Always returns synchronously.
- Developer Override: User resolve hooks can be async, but the final result is synchronous.

## 4. V8 11.3 Update
- New Features:
  - `String.prototype.isWellFormed` and `.toWellFormed`
  - Array/TypedArray copy methods
  - Resizable ArrayBuffer / growable SharedArrayBuffer
  - RegExp enhancements with `v` flag and string properties
  - Support for WebAssembly Tail Call
- Version: V8 11.3 (Chromium 113) implementation.

## 5. Stable Test Runner
- Module Status: Now stable, ready for production.
- Impact: Previously experimental, now fully supported.

## 6. Ada 2.0 URL Parser
- Enhancements: Improved performance in parsing URLs via `url.domainToASCII` and `url.domainToUnicode`.
- Configuration: Eliminates ICU requirement for hostname parsing.

## 7. Single Executable Application Packaging
- New Requirement: Inject a Blob generated from a JSON config rather than raw JS.
- Result: Enables bundling multiple co-existing resources within the SEA framework.

## 8. Web Crypto API Enhancements
- Behavior: Function arguments are coerced and validated strictly according to WebIDL definitions.
- Impact: Ensures interoperability with other Web Crypto implementations.

## 9. ARM64 Windows Support
- Availability: Binaries (MSI, zip/7z, exe) available for ARM64 Windows.
- Testing: CI now runs full test suite on ARM64 Windows to ensure compatibility.

## 10. WASI Version Requirement
- Change: Constructor `new WASI({ version: '<specific_version>' })` requires explicit version parameter.
- Impact: Code relying on default version must be updated.

## 11. Deprecations and Removals
- Specific Example: `url.parse()` now emits warnings on URLs with non-numeric ports, moving towards WHATWG compliance.

## 12. Commit Details and Build Configurations
- List includes Semver-Major updates (async_hooks deprecation, buffer validations, build configuration resets, crypto API adjustments), Semver-Minor updates (filesystem and WASI improvements), and Semver-Patch commits (bootstrap optimizations, dependency updates, build file modifications).
- Example Commit Format: [commit_hash] - (SEMVER-MAJOR) <module>: <detailed change> (#issue_number).

## 13. Download Binaries and SHASUMS
- Provides direct links for various platforms:
  - Windows: node-v20.0.0-x86.msi, node-v20.0.0-x64.msi, node-v20.0.0-arm64.msi
  - macOS: node-v20.0.0.pkg, node-v20.0.0-darwin-arm64.tar.gz, node-v20.0.0-darwin-x64.tar.gz
  - Linux: node-v20.0.0-linux-x64.tar.xz, and others for ARM, PPC LE, s390x, AIX
- SHASUMS provided with PGP signatures for verification.


## Supplementary Details
# Supplementary Technical Specifications and Implementation Details

## Permission Model Implementation
- To enable, run Node.js with `node --experimental-permission app.js`.
- No direct API but affects underlying system calls; code does not need to change but must handle permission errors.

## Loader Hooks Configuration
- Example usage:
  // loader file: foo.mjs
  export async function resolve(specifier, context, defaultResolve) {
    // Custom resolution logic
    return defaultResolve(specifier, context, defaultResolve);
  }

- Run with: `node --experimental-loader=./foo.mjs app.mjs`

## import.meta.resolve() Example
- Example usage in an ES module:
  const url = import.meta.resolve('moduleSpecifier');
  console.log(url);

## V8 API Additions
- New JS methods:
  String.prototype.isWellFormed(): Boolean
  String.prototype.toWellFormed(): String
- Array methods: Use non-mutating copies, e.g. arr.copyWithin() enhancements not altering input array.
- Resizable ArrayBuffer: new ArrayBuffer(initialSize, { maxByteLength: maxSize })

## WASI Constructor Change
- Example: 
  const wasi = new WASI({
    version: 'wasi_snapshot_preview1', // explicit version required
    args: process.argv,
    env: process.env,
    preopens: { '/sandbox': './sandbox' }
  });

## Build and Configuration Options
- For ARM64 Windows, binaries are built with specific flags; no additional configuration required by developers.
- Single Executable Apps require creating a JSON config file and then generating a Blob:
  {
    "resources": [
       { "name": "resource1", "data": "<base64 encoded>" },
       { "name": "resource2", "data": "<base64 encoded>" }
    ]
  }
- This blob is injected during build time using internal Node.js tools.

## Best Practices
- Always use explicit versioning for WASI to avoid runtime errors.
- Enable permission model in development to catch security issues early.
- Use dedicated loader hooks to prevent side effects in module resolution.

## Troubleshooting Procedures
- If a module fails due to permission errors, run Node.js with increased logging: 
  node --experimental-permission --trace-warnings app.js
- For loader hook failures, add debug prints in the loader file and validate the returned format:
  node --experimental-loader=./foo.mjs --trace-loader app.mjs
- Verify binary downloads with provided SHASUMS:
  shasum -a 256 node-v20.0.0.tar.gz
- Use verbose mode for WASI errors:
  node --trace-wasi app.js


## Reference Details
# Complete API Specifications and Code Examples

## HTTP Server Example

// server.mjs
import { createServer } from 'node:http';

const server = createServer((req, res) => {
  // Set HTTP status code and headers
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  // End the response with message
  res.end('Hello World!\n');
});

// Listening on port 3000, host 127.0.0.1
server.listen(3000, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3000');
});

/*
SDK Method Signature:
  createServer(listener: (req: IncomingMessage, res: ServerResponse) => void): Server
  - IncomingMessage: provides headers, url, method (string), etc.
  - ServerResponse: provides methods setHeader(name: string, value: string), writeHead(statusCode: number, headers?: OutgoingHttpHeaders), end(data?: any): void
*/

## WASI API Example

// Example of creating a WASI instance explicitly specifying version
import { WASI } from 'node:wasi';

const wasi = new WASI({
  version: 'wasi_snapshot_preview1',  // required explicit version
  args: process.argv,
  env: process.env,
  preopens: { '/sandbox': './sandbox' }
});

/*
WASI Constructor Signature:
  new WASI(options: {
    version: string,      // No default; must be provided
    args?: string[],
    env?: { [key: string]: string },
    preopens?: { [key: string]: string }
  })
*/

## Loader Hook API Example (ESM)

// foo.mjs
export async function resolve(specifier, context, defaultResolve) {
  // Custom resolution logic here
  return defaultResolve(specifier, context, defaultResolve);
}

/*
Loader Hook Signature:
  resolve(specifier: string, context: { parentURL?: string }, defaultResolve: Function): Promise<{ url: string }>
*/

## Configuration Options

- Permission Model: Flag --experimental-permission (no value required)
- Loader Hooks: Flag --experimental-loader=<path to loader>
- WASI: Requires 'version' key in options. Example: version: 'wasi_snapshot_preview1'

## Best Practices

- Always validate external input when using the experimental permission model. 
- Use debug/logging flags such as --trace-warnings and --trace-loader for diagnosing issues.
- Verify all binary downloads using provided SHA256 commands:
    shasum -a 256 <downloaded-file>

## Troubleshooting Commands

1. To trace permission issues:
   node --experimental-permission --trace-warnings app.js

2. To debug loader hooks:
   node --experimental-loader=./foo.mjs --trace-loader app.mjs

3. To verify WASI instantiation:
   node --trace-wasi app.js

4. To verify downloaded binary SHASUM:
   shasum -a 256 node-v20.0.0.tar.gz

Each API and configuration option is documented with complete parameter lists, types, default behaviors, and error handling steps. Developers can refer to these examples directly in their code.


## Original Source
Node.js v20 Documentation
https://nodejs.org/en/blog/release/v20.0.0/

## Digest of NODEJS_V20

# Node.js v20.0.0 Technical Digest (Retrieved: 2023-10-29)

## Permission Model
- Experimental feature enabled with flag: `--experimental-permission`.
- Restricts access to file system operations, child process spawning, and worker thread creation.
- Prevents applications from accessing/modifying sensitive data.
- Contributed by Rafael Gonzaga (#44004).

## Custom ESM Loader Hooks
- Use loader flag: `--experimental-loader=foo.mjs`.
- ESM hooks now execute in a dedicated, isolated thread to prevent cross-contamination with main application code.

## Synchronous import.meta.resolve()
- Now returns synchronously, matching browser behavior.
- User-defined resolve hooks can be async or sync but overall `import.meta.resolve` operates synchronously for application code.
- Contributors include: Anna Henningsen, Antoine du Hamel, Geoffrey Booth, Guy Bedford, Jacob Smith and Michaël Zasso (#44710).

## V8 11.3 Update
- V8 engine updated to version 11.3 (part of Chromium 113).
- New API additions:
  - `String.prototype.isWellFormed` and `String.prototype.toWellFormed`
  - Methods to change Array and TypedArray by copy
  - Resizable ArrayBuffer and growable SharedArrayBuffer
  - RegExp `v` flag with set notation and additional string properties
  - WebAssembly Tail Call support
- Contributed by Michaël Zasso (#47251).

## Stable Test Runner
- The `test_runner` module is now marked as stable (no longer experimental).
- Contributed by Colin Ihrig (#46983).

## Ada 2.0 URL Parser
- Integrated Ada 2.0 for URL parsing with performance improvements.
- Enhancements to `url.domainToASCII` and `url.domainToUnicode` functions.
- Eliminates ICU requirement for hostname parsing.
- Contributed by Yagiz Nizipli and Daniel Lemire (#47339).

## Single Executable Applications
- Building a single executable app now requires injecting a blob prepared by Node.js from a JSON config instead of a raw JS file.
- Enables multiple co-existing embedded resources.
- Contributed by Joyee Cheung (#47125).

## Web Crypto API Enhancements
- Web Crypto API function arguments are now coerced and validated as per WebIDL definitions.
- Improves interoperability with other Web Crypto implementations.
- Change implemented by Filip Skokan (#46067).

## ARM64 Windows Support
- Node.js now includes binaries for ARM64 Windows.
- MSI, zip/7z packages, and executables available along with traditional platforms.
- CI updated to test on ARM64 Windows.
- Upgraded to tier 2 support by Stefan Stojanovic (#47233).

## WASI Version Requirement
- When invoking `new WASI()`, the `version` option is now mandatory with no default.
- Code that relied on defaults must be updated to specify a version.
- Change made by Michael Dawson (#47391).

## Deprecations and Removals
- `url.parse()` with invalid ports now emits a warning and will throw errors in future releases (#45526).

## Semver Commit Details
- A detailed list of Semver-Major, -Minor, and -Patch commits with exact commit hashes and descriptions is provided (e.g., async_hooks deprecation, buffer improvements, V8 updates, and many build/dependency updates).

## Download Links & SHASUMS
- Multiple installers and binaries for Windows (x86, x64, ARM64), macOS (pkg, tar.gz for darwin-arm64 and darwin-x64), Linux (tar.xz for x64, ppc64le, s390x, ARM variants), AIX, source tarballs, and documentation links are provided.
- Complete SHASUMS with PGP signed verification are included.


## Attribution
- Source: Node.js v20 Documentation
- URL: https://nodejs.org/en/blog/release/v20.0.0/
- License: License: Node.js Foundation License
- Crawl Date: 2025-04-17T15:57:50.703Z
- Data Size: 383115 bytes
- Links Found: 803

## Retrieved
2025-04-17
