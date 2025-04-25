# NODEJS

## Crawl Summary
Node.js documentation covers detailed API specifications for core modules including HTTP, File System, Streams, Child Processes, and more. Specific API methods include createServer from 'node:http', fs.readFile, process.exit, and async_hooks.createHook. The documentation lists configuration options such as CLI flags (--inspect, --max-old-space-size) and includes code examples, detailed parameter types, method signatures, and operational best practices.

## Normalised Extract
Table of Contents:
1. Assertion Testing: Methods such as assert.ok(value, message) and assert.strictEqual(actual, expected, message) for test validation.
2. Asynchronous Context Tracking: APIs to trace execution context across asynchronous calls.
3. Async Hooks: createHook({ init, before, after, destroy }) returns a hook with enable/disable. Callback signature: (asyncId: number, type: string, triggerAsyncId: number, resource: Object).
4. Buffer: Buffer.from(input[, encoding]) and Buffer.alloc(size[, fill[, encoding]]) with detailed parameters.
5. C++ Addons: Node-API functions like napi_create_function(execEnv, name, strlen(name), callback, data, &result) with precise types.
6. Child Processes & Cluster: Using require('child_process').fork(modulePath, args, options) with detailed options; cluster.fork() returns a Worker with messaging via worker.send(message).
7. Command-line Options: Flags such as --inspect for debugging, --max-old-space-size for memory limits.
8. HTTP Server: createServer(callback: (req: http.IncomingMessage, res: http.ServerResponse) => void) returns http.Server; server.listen(port: number, hostname: string, callback: () => void) with exactly defined parameters.
9. Modules: CommonJS require(module) vs ES Module import syntax; node:module API providing enhanced loading.
10. Worker Threads: worker_threads.Worker(filename, { workerData, argv, eval }) with return of a Worker instance and on('message', ...) event.

Each section contains exact method signatures, parameter types, expected behavior and error handling procedures directly usable in production code.

## Supplementary Details
Technical specifications include:
- createServer: Function signature createServer((req: http.IncomingMessage, res: http.ServerResponse) => void): http.Server.
- server.listen: Method signature listen(port: number, hostname: string, backlog?: number, callback?: () => void): this.
- async_hooks.createHook: Accepts an object with functions init(asyncId: number, type: string, triggerAsyncId: number, resource: Object), before(asyncId: number), after(asyncId: number), destroy(asyncId: number).
- Buffer methods: Buffer.from(data: string | Array, encoding?: string): Buffer; Buffer.alloc(size: number, fill?: string | Buffer | number, encoding?: string): Buffer.
- CLI Flags: --inspect (enables debugger), --max-old-space-size=VALUE (sets V8 memory limit).
Implementation steps:
1. Import required module using either require() or import statement.
2. Create a server instance with appropriate callback.
3. Configure server.listen with explicit port and host parameters.
4. Handle errors using try-catch for synchronous functions and error callbacks for async APIs.
5. Use child_process.fork() for multi-process patterns and cluster.fork() to scale across CPUs.

Best practices:
- Use asynchronous non-blocking APIs for I/O operations.
- Validate input and outputs using assert methods.
- Utilize process.on('uncaughtException') for global error catching.

Troubleshooting procedures:
- If the server fails to start, run node server.js and check for EADDRINUSE errors; use netstat to identify port usage.
- For debugging, start node with --inspect flag and connect via Chrome DevTools.
- Validate configuration flag values by inspecting process.argv output.

## Reference Details
API Specifications:
1. http.createServer(callback: (req: http.IncomingMessage, res: http.ServerResponse) => void): http.Server
   - Returns a Server instance. Callback must handle req and res objects.
2. Server.listen(port: number, hostname: string, backlog?: number, callback?: () => void): this
   - port: listening port number
   - hostname: bind address (e.g. '127.0.0.1')
   - backlog: Optional, maximum pending connections
   - callback: Called when the server starts listening

SDK Method Signatures:
- Buffer.from(input: string | Array, encoding?: string): Buffer
- Buffer.alloc(size: number, fill?: string | Buffer | number, encoding?: string): Buffer
- async_hooks.createHook(callbacks: { init(asyncId: number, type: string, triggerAsyncId: number, resource: Object): void, before?(asyncId: number): void, after?(asyncId: number): void, destroy?(asyncId: number): void }): AsyncHook

Code Examples:
// HTTP Server Example
import { createServer } from 'node:http';

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });  // Set header
  res.end('Hello World!\n');  // End response
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3000');
});

// Async Hook Example
import async_hooks from 'async_hooks';
const hook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    // Initialize hook for async operation
  },
  before(asyncId) {
    // Before callback
  },
  after(asyncId) {
    // After callback
  },
  destroy(asyncId) {
    // Cleanup
  }
});
hook.enable();

Configuration Options:
--inspect: Enables V8 inspector for debugging.
--max-old-space-size: Sets the maximum heap size for V8 (in MB).

Best Practices:
- Always use non-blocking asynchronous APIs.
- Validate parameters using assert module.
- Use cluster module for scaling across CPU cores.

Troubleshooting:
- Command: node --inspect server.mjs
  Expected output: 'Debugger listening on ws://127.0.0.1:9229'
- For port conflicts, check: netstat -an | grep 3000

Detailed Steps:
1. Import module with require or import syntax.
2. Create resources (server, buffers) with exact parameter values.
3. Use error-first callbacks to catch and handle exceptions.
4. Verify command line flags by checking process.execArgv output.

## Information Dense Extract
Node.js docs. createServer(callback(req:http.IncomingMessage, res:http.ServerResponse):void)->http.Server; server.listen(port:number, hostname:string, [backlog:number], [callback:()=>void]); Buffer.from(data, [encoding]); Buffer.alloc(size, [fill, encoding]); async_hooks.createHook({init(asyncId:number,type:string,triggerAsyncId:number,resource:object), before?(asyncId:number), after?(asyncId:number), destroy?(asyncId:number)}); CLI: --inspect, --max-old-space-size; Modules: CommonJS require vs ES import; child_process.fork(modulePath, args, options); cluster.fork(); worker_threads.Worker(filename, {workerData, argv, eval}); troubleshooting: check netstat, use --inspect, process.on('uncaughtException').

## Sanitised Extract
Table of Contents:
1. Assertion Testing: Methods such as assert.ok(value, message) and assert.strictEqual(actual, expected, message) for test validation.
2. Asynchronous Context Tracking: APIs to trace execution context across asynchronous calls.
3. Async Hooks: createHook({ init, before, after, destroy }) returns a hook with enable/disable. Callback signature: (asyncId: number, type: string, triggerAsyncId: number, resource: Object).
4. Buffer: Buffer.from(input[, encoding]) and Buffer.alloc(size[, fill[, encoding]]) with detailed parameters.
5. C++ Addons: Node-API functions like napi_create_function(execEnv, name, strlen(name), callback, data, &result) with precise types.
6. Child Processes & Cluster: Using require('child_process').fork(modulePath, args, options) with detailed options; cluster.fork() returns a Worker with messaging via worker.send(message).
7. Command-line Options: Flags such as --inspect for debugging, --max-old-space-size for memory limits.
8. HTTP Server: createServer(callback: (req: http.IncomingMessage, res: http.ServerResponse) => void) returns http.Server; server.listen(port: number, hostname: string, callback: () => void) with exactly defined parameters.
9. Modules: CommonJS require(module) vs ES Module import syntax; node:module API providing enhanced loading.
10. Worker Threads: worker_threads.Worker(filename, { workerData, argv, eval }) with return of a Worker instance and on('message', ...) event.

Each section contains exact method signatures, parameter types, expected behavior and error handling procedures directly usable in production code.

## Original Source
Development & Testing Tools Documentation
https://nodejs.org/en/docs/

## Digest of NODEJS

# Node.js Documentation

Retrieved Date: 2023-10-18

## Overview
This document contains the full technical details extracted from the Node.js documentation available at https://nodejs.org/en/docs/.

## Topics Table of Contents
1. Assertion Testing
2. Asynchronous Context Tracking
3. Async Hooks
4. Buffer
5. C++ Addons and Node-API
6. Child Processes and Cluster
7. Command-line Options
8. Console and Crypto
9. Debugger and Deprecated APIs
10. Diagnostics Channel
11. DNS, Domain, Errors, and Events
12. File System and Globals
13. HTTP, HTTP/2, HTTPS
14. Inspector and Internationalization
15. Modules (CommonJS, ECMAScript, node:module API, Packages, TypeScript)
16. Net, OS, and Path
17. Performance Hooks, Permissions, Process
18. Punycode, Query Strings, QUIC
19. Readline, REPL, Report
20. Single Executable Applications, SQLite
21. Stream, String Decoder, Test Runner, Timers
22. TLS/SSL, Trace Events, TTY, UDP/datagram, URL
23. Utilities, V8, VM, WASI
24. Web Crypto API, Web Streams API, Worker Threads, Zlib

## Detailed Technical Content

### 1. Assertion Testing
- Built-in assertion module to validate expected outcomes in tests. 
- API: assert.ok(value[, message]) and additional methods assert.strictEqual(actual, expected[, message]).

### 2. Asynchronous Context Tracking
- Provides functions to track execution context across asynchronous calls.
- Used for logging, debugging and performance analysis.

### 3. Async Hooks
- API to register hooks for asynchronous events. 
- Methods: async_hooks.createHook({ init, before, after, destroy }) returns a Hook object with enable() and disable() methods.

### 4. Buffer
- Implementation of binary data. 
- Methods: Buffer.from, Buffer.alloc with precise parameters and return types.

### 5. C++ Addons and Node-API
- Allows C/C++ integration using Node-API.
- Specifications: Exposes functions such as napi_create_function with exact parameter types.

### 6. Child Processes and Cluster
- API: require('child_process') for spawning processes (e.g. spawn, exec, fork). 
- Cluster module allows load balancing: cluster.fork() returns a worker object.

### 7. Command-line Options
- Various CLI flags such as --inspect, --max-old-space-size, with effects on debugging and memory limits.

### 8. Console and Crypto
- Console: Global methods console.log, console.error available in the runtime.
- Crypto: Provides cryptographic functions, e.g. crypto.createHash(algorithm) which returns a Hash object.

### 9. Debugger and Deprecated APIs
- Debugger: External debugger integration via --inspect flag.
- Deprecated APIs are documented with version details and migration guidelines.

### 10. Diagnostics Channel
- Introduces new diagnostic APIs to subscribe to internal events.

### 11. DNS, Domain, Errors, and Events
- DNS: Methods like dns.lookup(hostname[, options], callback) with detailed parameter types.
- Domain: Deprecated exception handling mechanism.
- Error handling: Standard Error objects with stack traces.
- Events: Implementation of event emitter (e.g. EventEmitter.on(event, listener)).

### 12. File System and Globals
- fs module APIs: fs.readFile(path, options, callback) and fs.writeFile(path, data, options, callback).
- Global objects like process, __dirname, and __filename provided by Node.js.

### 13. HTTP, HTTP/2, HTTPS
- HTTP server creation: http.createServer((req, res) => {}) returns instance of http.Server.
- Server listen method: server.listen(port, hostname, callback) with port (number) and hostname (string).

### 14. Inspector and Internationalization
- Inspector: Integrated debugging tool, activated with command-line flags.
- Internationalization: Provides ICU support for formatting.

### 15. Modules
- CommonJS: require() system.
- ECMAScript: import/export syntax supported via .mjs extension.
- node:module API: Enhanced module resolution and loading.
- Packages: npm package management details.
- TypeScript: Typings and support via declaration files.

### 16. Net, OS, and Path
- Net: API for TCP/IPC sockets.
- OS: Provides operating system-specific information, e.g. os.platform(), os.release().
- Path: Path module methods like path.join, path.resolve with string parameters.

### 17. Performance Hooks, Permissions, Process
- Performance hooks: Methods like performance.now() and monitoring tools.
- Process: process object with process.env, process.argv, process.exit([code]).
- Permissions: Experimental APIs to manage resource permissions.

### 18. Punycode, Query Strings, QUIC
- Punycode: Conversion utilities for domain names.
- Query Strings: qs.parse and qs.stringify for URL parameters.
- QUIC: Experimental support in HTTP/3 modules.

### 19. Readline, REPL, Report
- Readline: Command interface for reading input.
- REPL: Interactive shell provided by Node.js.
- Report: Usage of process.report for diagnostic reports.

### 20. Single Executable Applications, SQLite
- Mechanisms to compile Node.js applications into single executables.
- SQLite: Integration details with underlying binary support.

### 21. Stream, String Decoder, Test Runner, Timers
- Streams: API for readable, writable, duplex, and transform streams.
- String Decoder: Utility to decode buffer streams.
- Test Runner: Built-in test runner with assertions.
- Timers: setTimeout, setInterval, and setImmediate with their callback patterns.

### 22. TLS/SSL, Trace Events, TTY, UDP/datagram, URL
- TLS/SSL: Secure communication using tls.createServer(options, secureConnectionListener).
- Trace Events: Capturing internal events for profiling.
- TTY: Terminal interface support.
- UDP/datagram: dgram module methods for UDP sockets.
- URL: URL module to parse and format URLs.

### 23. Utilities, V8, VM, WASI
- Utilities: util module for inherits, promisify, and debugging.
- V8: V8 engine integration and performance APIs.
- VM: Virtual machine sandbox via vm.Script and vm.runInContext.
- WASI: WebAssembly System Interface for WASM modules.

### 24. Web Crypto API, Web Streams API, Worker Threads, Zlib
- Web Crypto API: Subset of modern browser crypto functions available in Node.js.
- Web Streams API: Standard streams for web compatibility.
- Worker Threads: Multi-threading support using worker_threads module.
- Zlib: Data compression, with methods zlib.gzip, zlib.deflate supporting buffer and stream modes.

## Code Example: HTTP Server

A sample HTTP server using ES modules:

import { createServer } from 'node:http';

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!\n');
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3000');
});

Run with command: node server.mjs

## Attribution

Crawled from https://nodejs.org/en/docs/ with a data size of 101501 bytes; 1797 links found; No errors.

## Attribution
- Source: Development & Testing Tools Documentation
- URL: https://nodejs.org/en/docs/
- License: License: Multiple Licenses (e.g., MIT, others)
- Crawl Date: 2025-04-25T11:28:59.745Z
- Data Size: 101501 bytes
- Links Found: 1797

## Retrieved
2025-04-25
