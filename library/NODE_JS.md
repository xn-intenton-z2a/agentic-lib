# NODE_JS

## Crawl Summary
Node.js v20 introduces an experimental Permission Model activated via `--experimental-permission`, custom ESM loader hooks running on a dedicated thread via `--experimental-loader`, and synchronous behavior for import.meta.resolve. The V8 engine is updated to version 11.3 featuring new string, array, and WebAssembly optimizations. The test_runner module is now stable. Ada 2.0 improves URL parsing without ICU dependency. Single executable applications now require blob injection from a JSON config, and the Web Crypto API now validates arguments per WebIDL. Additionally, official ARM64 Windows binaries are provided, and a mandatory WASI version must be specified. Detailed commit logs capture major, minor, and patch changes.

## Normalised Extract
## Table of Contents
1. Permission Model
2. Custom ESM Loader Hooks
3. Synchronous import.meta.resolve
4. V8 11.3 Updates
5. Stable Test Runner
6. Ada 2.0 URL Parser
7. SEA Blob Injection
8. Web Crypto API Validation
9. ARM64 Windows Support
10. WASI Version Requirement
11. Deprecations and Removals
12. Commit History

---

### 1. Permission Model
- **Flag:** `--experimental-permission`
- **Technical Detail:** Restricts runtime access to file system operations, child process spawning, and worker thread creation.

### 2. Custom ESM Loader Hooks
- **Flag:** `--experimental-loader=foo.mjs`
- **Technical Detail:** Loader hooks execute in an isolated dedicated thread to prevent interference with main application code.

### 3. Synchronous import.meta.resolve
- **Signature:** `import.meta.resolve(moduleSpecifier: string, baseURL?: string): string`
- **Technical Detail:** Always returns synchronously, independent of whether the user-defined resolve hook is async.

### 4. V8 11.3 Updates
- **Version:** 11.3 (Chromium 113)
- **Features:** 
   - `String.prototype.isWellFormed` & `toWellFormed`
   - Array and TypedArray copy methods
   - Resizable ArrayBuffer and growable SharedArrayBuffer
   - RegExp `v` flag with set notation
   - WebAssembly Tail Call support

### 5. Stable Test Runner
- **Module:** `test_runner`
- **Technical Detail:** Transitioned from experimental to stable for production use.

### 6. Ada 2.0 URL Parser
- **Technical Detail:** Enhanced performance for URL parsing via functions `url.domainToASCII` and `url.domainToUnicode`; removes dependency on ICU for hostname parsing.

### 7. SEA Blob Injection
- **Requirement:** Single executable apps require a pre-prepared blob (from JSON config) instead of raw JS injections.

### 8. Web Crypto API Validation
- **Technical Detail:** Function arguments are coerced and validated as per WebIDL, ensuring consistent interoperability.

### 9. ARM64 Windows Support
- **Technical Detail:** Provides native binaries (MSI, zip/7z, executable) specifically built for ARM64 Windows platforms.

### 10. WASI Version Requirement
- **Usage:** `new WASI({ version: '1.0', ... })` where the `version` parameter is required with no default.

### 11. Deprecations and Removals
- **Example:** `url.parse()` now issues warnings for URLs with non-numeric ports, following the WHATWG specification.

### 12. Commit History
- **Details:** Contains full commit logs for major (e.g., `[3bed5f11e0]`), minor, and patch changes covering modules such as async_hooks, buffer, build, crypto, deps, and more.


## Supplementary Details
## Implementation Specifications

1. **Activating Permission Model:**
   - Command: `node --experimental-permission app.js`
   - Effect: Restricts sensitive API access (fs, child_process, worker_threads).

2. **Custom ESM Loader Hooks Usage:**
   - Command: `node --experimental-loader=custom-loader.mjs app.mjs`
   - Example Loader (custom-loader.mjs):
     --------------------------------------------------
     // custom-loader.mjs
     export async function resolve(specifier, context, defaultResolve) {
       // Custom resolution logic
       return defaultResolve(specifier, context, defaultResolve);
     }
     --------------------------------------------------

3. **Using Synchronous import.meta.resolve:**
   - Example:
     --------------------------------------------------
     const resolved = import.meta.resolve('./module.js', import.meta.url);
     console.log(resolved);
     --------------------------------------------------

4. **WASI Initialization Example:**
   - Code:
     --------------------------------------------------
     const { WASI } = require('wasi');
     const wasi = new WASI({
       version: '1.0',
       args: process.argv,
       env: process.env,
       preopens: { '/sandbox': '/var/sandbox' }
     });
     --------------------------------------------------

5. **ARM64 Windows Build Configuration:**
   - Download binaries such as node-v20.0.0-arm64.msi from the official site.

6. **Best Practices for SEA Executables:**
   - Pre-generate a blob through Node.js from a JSON configuration file to enable embedding multiple resources.

7. **Troubleshooting Procedures:**
   - If permission errors occur, ensure the process is run with `--experimental-permission`.
   - Verify WASI version: Log the instance output after creation (e.g., `console.log(wasi)`).
   - For V8 build issues, review commit logs using: `git log --grep=V8`.

## Configuration Options

- **Permission Flag:** `--experimental-permission`
- **Loader Flag:** `--experimental-loader=path/to/loader.mjs`
- **WASI Version:** Must be explicitly provided (e.g., `{ version: '1.0' }`)


## Reference Details
## API Specifications and Code Examples

### 1. Permission Model API
- **Activation:** Run Node.js with the flag: `--experimental-permission`
- **Usage:** When enabled, all attempts to access restricted APIs (e.g., file system, process spawning) are validated at runtime.

### 2. Custom ESM Loader Hooks
- **Method Signature:**
  ```js
  async function resolve(specifier: string, context: { parentURL?: string }, defaultResolve: Function): Promise<{ url: string }>
  ```
- **Example Implementation:**
  --------------------------------------------------
  // custom-loader.mjs
  export async function resolve(specifier, context, defaultResolve) {
    // Custom resolution logic can be integrated here
    return defaultResolve(specifier, context, defaultResolve);
  }
  --------------------------------------------------

### 3. Synchronous import.meta.resolve
- **Signature:**
  ```js
  import.meta.resolve(moduleSpecifier: string, baseURL?: string): string
  ```
- **Usage Example:**
  --------------------------------------------------
  const resolvedURL = import.meta.resolve('./example.js', import.meta.url);
  console.log(resolvedURL);
  --------------------------------------------------

### 4. WASI Constructor
- **Constructor Signature:**
  ```js
  new WASI(options: {
    version: string,       // e.g., '1.0' (mandatory)
    args?: string[],
    env?: NodeJS.ProcessEnv,
    preopens?: { [key: string]: string }
  }): WASI
  ```
- **Example:**
  --------------------------------------------------
  const { WASI } = require('wasi');
  const wasi = new WASI({
    version: '1.0',
    args: process.argv,
    env: process.env,
    preopens: { '/sandbox': '/var/sandbox' }
  });
  --------------------------------------------------

### 5. HTTP Server Example (Standard Library)
- **Code Example:**
  --------------------------------------------------
  // server.mjs
  import { createServer } from 'node:http';

  const server = createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World!\n');
  });

  server.listen(3000, '127.0.0.1', () => {
    console.log('Listening on 127.0.0.1:3000');
  });
  // Run with: node server.mjs
  --------------------------------------------------

### 6. Troubleshooting Procedures
- **Check Node.js Version:** `node -v`
- **Run with Experimental Permission:** `node --experimental-permission app.js`
- **Verify WASI Instance:**
  ```js
  console.log(wasi);
  ```
- **Diagnose Loader Issues:** Insert diagnostic `console.log` statements in your custom loader file.
- **V8 Build Issue Check:** Run `git log --grep=V8` to review applied patches.

### 7. Configuration Options Summary
- **Experimental Permission Flag:** `--experimental-permission` enables runtime API access restrictions.
- **Custom Loader Flag:** `--experimental-loader=path/to/loader.mjs`
- **WASI Options:** Must include an explicit `version`, e.g., `{ version: '1.0' }` with optional args, env, and preopens.

## Best Practices
- **Explicit Configuration:** Always specify the WASI version explicitly.
- **Loader Isolation:** Test custom ESM loaders in isolation to prevent state contamination.
- **Official Binaries:** Use officially provided ARM64 Windows binaries to ensure compatibility.
- **Sync Resolution:** Employ synchronous import.meta.resolve for production consistency.
- **Commit Audit:** Refer to commit logs (e.g., [3bed5f11e0], [44710], [47391]) for troubleshooting and understanding breaking changes.

This detailed reference provides complete API specifications, method signatures, full code samples, configuration details, and troubleshooting steps to be used directly by developers in their projects.


## Original Source
Node.js v20 Documentation
https://nodejs.org/en/blog/release/v20.0.0/

## Digest of NODE_JS

## Node.js v20 Technical Details

**Retrieved:** 2023-10-07

### Permission Model
- **Activation Flag:** `--experimental-permission`
- **Effect:** Restricts access to critical runtime features such as file system operations, child process spawning, and worker thread creation.

### Custom ESM Loader Hooks
- **Activation Flag:** `--experimental-loader=foo.mjs`
- **Behavior:** Loader hooks now run in a dedicated, isolated thread to avoid cross-contamination with application code.

### Synchronous import.meta.resolve
- **Behavior:** Returns synchronously aligned with browser behavior, even when async resolve hooks are defined.
- **Signature:** `import.meta.resolve(moduleSpecifier: string, baseURL?: string): string`

### V8 11.3 Updates
- **Engine Version:** V8 11.3 from Chromium 113
- **New Features:**
  - `String.prototype.isWellFormed` and `toWellFormed`
  - Array and TypedArray copy methods
  - Resizable ArrayBuffer and growable SharedArrayBuffer
  - RegExp `v` flag with set notation and new string properties
  - WebAssembly Tail Call optimization

### Stable Test Runner
- **Module:** `test_runner`
- **Status:** Marked as stable (transitioned from experimental)

### Ada 2.0 URL Parser
- **Enhancements:** Improved performance of `url.domainToASCII` and `url.domainToUnicode`
- **Advantage:** Eliminates the ICU requirement for URL hostname parsing

### SEA Blob Injection for Single Executable Apps
- **Requirement:** Instead of injecting raw JS files, a blob prepared from a JSON configuration must now be injected.
- **Purpose:** Enables embedding multiple co-existing resources.

### Web Crypto API Validation
- **Change:** All function arguments are coerced and validated according to their WebIDL definitions.
- **Impact:** Increases compatibility with other Web Crypto API implementations.

### Official ARM64 Windows Support
- **Binaries Include:** MSI, zip/7z packages, and executable files for native ARM64 execution.
- **Testing:** Fully verified on ARM64 Windows CI.

### WASI Version Requirement
- **Usage:** When calling `new WASI()`, the `version` option must be explicitly specified with no default value.

### Deprecations and Removals
- **Example:** `url.parse()` now warns when parsing URLs with non-numeric ports, aligning with the WHATWG URL API.

### Commit History (Semver Commit Examples)
- **Major Commits:** Include changes to async_hooks, buffer API adjustments, build system updates, and deprecations (e.g. `[3bed5f11e0]` for `url.parse()` deprecation).
- **Minor & Patch:** Numerous detailed commits addressing specific module behaviors and improvements.


## Attribution
- Source: Node.js v20 Documentation
- URL: https://nodejs.org/en/blog/release/v20.0.0/
- License: License: Node.js Foundation License
- Crawl Date: 2025-04-17T17:01:36.138Z
- Data Size: 383115 bytes
- Links Found: 803

## Retrieved
2025-04-17
