# NODE_JS

## Crawl Summary
HTTP Server creation using createServer with a callback that takes http.IncomingMessage and http.ServerResponse; asynchronous non-blocking I/O via Node.js event loop; configuration of debugger with flags (--inspect, --inspect-brk, --inspect-wait) including binding options and security considerations; npm commands for installing dependencies, updating packages and running tasks with scripts specified in package.json; ECMAScript feature support based on V8 releases and usage of runtime flags to enable staged features; WebAssembly integration using fs module to read .wasm files and WebAssembly.instantiate for instantiation and interaction with exports.

## Normalised Extract
# Table of Contents
1. HTTP Server Setup
   - createServer method details
   - Callback signature: (req: http.IncomingMessage, res: http.ServerResponse)
   - Code examples in ESM and CommonJS
2. Asynchronous I/O & Event Loop
   - Non-blocking I/O primitives
   - Single process event loop architecture
3. Debugging and Inspector Usage
   - Activation flags: --inspect, --inspect-brk, --inspect-wait
   - Binding details and security best practices
   - Example commands and URL format for inspectors
4. npm Package Manager Usage
   - Command: npm install, npm update
   - Flag details (--save-dev, --save-optional, --no-save)
   - Sample package.json scripts and execution examples
5. ECMAScript 2015 and V8 Integration
   - Native support of modern ECMAScript features
   - Flags for experimental features (--harmony)
   - Command to check V8 version
6. WebAssembly Integration
   - Process for reading .wasm files using fs.readFileSync
   - Instantiation via WebAssembly.instantiate
   - Code sample demonstrating export usage and OS interaction workaround

---

## 1. HTTP Server Setup
- Use `createServer(callback)` with callback: `(req: http.IncomingMessage, res: http.ServerResponse) => void`
- **ES Module Example:**
```js
import { createServer } from 'node:http';
const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!\n');
});
server.listen(3000, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3000');
});
```
- **CommonJS Example:**
```js
const http = require('node:http');
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});
server.listen(3000, '127.0.0.1', () => {
  console.log('Server running on http://127.0.0.1:3000/');
});
```

## 2. Asynchronous I/O & Event Loop
- Designed for non-blocking operations using asynchronous callbacks.
- Utilizes the event loop to handle I/O operations without spawning new threads for each request.

## 3. Debugging and Inspector Usage
- **Flags:**
  - `--inspect` (default bind: 127.0.0.1:9229)
  - `--inspect=[host:port]`
  - `--inspect-brk` (breaks before executing user code)
  - `--inspect-wait` (waits for debugger attachment)
- **URL Format:** `ws://127.0.0.1:9229/UUID`
- **Best Practices:** Bind to localhost to avoid exposing debug port externally.

## 4. npm Package Manager Usage
- **Install Dependencies:**
  - `npm install` (reads package.json and installs node_modules)
- **Install Specific Package:**
  - `npm install <package-name>` with optional flags:
    - `--save-dev` (-D) for development dependencies
    - `--save-optional` (-O) for optional dependencies
    - `--no-save` to avoid saving in package.json
- **Update Packages:**
  - `npm update` or `npm update <package-name>`
- **Scripts:** Defined in package.json, executed via `npm run <script-name>`

## 5. ECMAScript 2015 and V8 Integration
- Node.js supports modern ECMAScript features out-of-the-box using the V8 engine.
- Use the flag `--harmony` (or `--es_staging`) to enable staged features if needed.
- Verify V8 version with: `node -p process.versions.v8`

## 6. WebAssembly Integration
- **Steps:**
  1. Use `fs.readFileSync` to load a .wasm file.
  2. Instantiate the module with `WebAssembly.instantiate(wasmBuffer)`.
  3. Utilize exported functions from `wasmModule.instance.exports`.
- **Example:**
```js
const fs = require('node:fs');
const wasmBuffer = fs.readFileSync('/path/to/add.wasm');
WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
  const { add } = wasmModule.instance.exports;
  console.log('Sum:', add(5, 6));
});
```


## Supplementary Details
# Supplementary Technical Specifications

## HTTP Server Configuration
- **Method:** `createServer(callback)`
  - **Callback Parameter Types:**
    - `req`: An instance of `http.IncomingMessage`
    - `res`: An instance of `http.ServerResponse`
- **Server Listening:**
  - Method: `server.listen(port, hostname, callback)`
  - **Default hostname:** '127.0.0.1'
  - **Port Example:** 3000

## Debugger Configuration Options
- **Flags and their Defaults:**
  - `--inspect`: Binds to 127.0.0.1:9229
  - `--inspect=[host:port]`: Allows custom binding
  - `--inspect-brk`: Same as --inspect, but pauses execution before user code
  - `--inspect-wait`: Wait for a debugger to attach before proceeding
- **Security Considerations:**
  - Always bind to localhost unless external access is explicitly required
  - Use firewall rules when exposing debugging ports

## npm Command Options & Flags
- **Installation Commands:**
  - `npm install` installs all dependencies
  - `npm install <package-name> [--save-dev | --save-optional | --no-save]`
- **Script Execution:**
  - Defined in package.json under the "scripts" object
  - Execute using `npm run <script-name>`

## WebAssembly Options
- **File Format:**
  - Binary: .wasm
  - Text: .wat
- **APIs used:**
  - `WebAssembly.instantiate(buffer)` returns a Promise with module instance
  - Exported functions accessed via `instance.exports`

## Development Best Practices
- Use official Node.js distribution and version managers for consistency
- Always test on both development and production configurations; set NODE_ENV=production in production environments
- Leverage npm scripts to standardize common tasks
- For debugging, use local binding (127.0.0.1) and secure remote debugging using SSH tunnels if necessary


## Reference Details
# Complete API Specifications and Implementation Details

## 1. HTTP Server API

**Function:** `http.createServer(callback)`
- **Parameters:**
  - `callback`: (req: http.IncomingMessage, res: http.ServerResponse) => void
- **Return Type:** `http.Server`

**Example Implementation:**
```js
// Using ES Modules
import { createServer } from 'node:http';

const server = createServer((req, res) => {
  // Set HTTP response header with status and content type
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  // End the response with text content
  res.end('Hello World!\n');
});

// Configure the server to listen on port 3000 and IP 127.0.0.1
server.listen(3000, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3000');
});
```

**Method:** `server.listen(port, hostname, callback)`
- **Parameters:**
  - `port`: number (e.g., 3000)
  - `hostname`: string (e.g., '127.0.0.1')
  - `callback`: function to be executed when server is ready

## 2. Debugger & Inspector API

**Activation Commands and Flags:**
- Start Node.js with inspector enabled:
  - `node --inspect server.js`
  - Custom binding: `node --inspect=0.0.0.0:9230 server.js`
- Break before user code using:
  - `node --inspect-brk server.js`

**Security Recommendations:**
- Default binding is to 127.0.0.1; avoid using 0.0.0.0 unless necessary
- Use firewall or SSH tunnels when remote access is required

## 3. npm SDK & CLI Commands

**Install Dependencies:**
```bash
npm install
```
- Reads package.json and installs every dependency into the node_modules folder.

**Install a Specific Package:**
```bash
npm install express
```
- Automatically adds the package to dependencies (npm >= 5).

**Using Flags:**
```bash
npm install mocha --save-dev
npm install some-optional-package --save-optional
npm install some-package --no-save
```

**Running Scripts:**
- Example package.json scripts:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node server-dev.js",
    "prod": "NODE_ENV=production node server-prod.js"
  }
}
```
- Execute with: `npm run start`

## 4. ECMAScript & V8 Integration

- **Enable Staged Features:**
  - Run Node.js using: `node --harmony`
- **Check V8 Version:**
```bash
node -p process.versions.v8
```

## 5. WebAssembly API

**Instantiating a WebAssembly Module:**
```js
const fs = require('node:fs');
const wasmBuffer = fs.readFileSync('/path/to/module.wasm');

WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
  // Access exported functions
  const { add } = wasmModule.instance.exports;
  const result = add(5, 6);
  console.log('Sum:', result); // Expected output: 11
}).catch(err => {
  console.error('WebAssembly instantiation failed:', err);
});
```
- **Notes:**
  - Exports are available on `wasmModule.instance.exports`
  - Error handling is crucial during instantiation

## 6. Troubleshooting Procedures

- **Inspecting Node.js Debugger Connection:**
  1. Start Node.js with: `node --inspect server.js`
  2. Verify connection URL from console output (e.g., `ws://127.0.0.1:9229/UUID`)
  3. Ensure browser or IDE is configured to connect to that URL

- **Checking Version Information:**
```bash
node -p process.versions
```
- Use this command to verify versions of Node.js, V8, and other dependencies.

- **Common Issues:**
  - If the server does not listen as expected, check for port conflicts using `lsof -i :3000` on Unix-based systems.
  - For debugging, ensure no firewall restrictions are in place if binding to external interfaces.


## Original Source
Node.js Official Documentation
https://nodejs.org/en/docs/

## Digest of NODE_JS

# Node.js Documentation Digest

**Retrieved Date:** 2023-11-04
**Data Size:** 201133 bytes
**Attribution:** Crawled from Node.js Official Documentation (https://nodejs.org/en/docs/)

---

# Table of Contents
1. HTTP Server Example
2. Asynchronous I/O and Event Loop
3. Debugger & Inspector
4. npm Package Manager
5. ECMAScript & V8 Engine
6. WebAssembly Integration

---

# 1. HTTP Server Example

**Method Signature:**
`createServer(callback: (req: http.IncomingMessage, res: http.ServerResponse) => void): http.Server`

**Usage Example (ESM):**
```js
import { createServer } from 'node:http';

// Create a new HTTP server that responds with 'Hello World!'
const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!\n');
});

// Listen on port 3000 and host 127.0.0.1
server.listen(3000, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3000');
});

// Run with: node server.mjs
```

**Usage Example (CommonJS):**
```js
const http = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

---

# 2. Asynchronous I/O and Event Loop

- Node.js uses non-blocking asynchronous I/O primitives to handle thousands of concurrent connections.
- A Node.js application runs on a single process leveraging the V8 engine with an internal event loop.
- Typical operations include networking, file system access, and callbacks that resume once the I/O operation completes.

---

# 3. Debugger & Inspector

**Activation Flags & Options:**

- `--inspect`
  - Enables the Inspector agent.
  - Default binding: 127.0.0.1:9229
  - Example: `node --inspect server.js`

- `--inspect=[host:port]`
  - Binds the Inspector to a specific host and port.
  - Example: `node --inspect=0.0.0.0:9230 server.js`

- `--inspect-brk`
  - Enables the Inspector, binds to 127.0.0.1:9229, and breaks before user code starts.
  - Example: `node --inspect-brk server.js`

- `--inspect-wait`
  - Waits for a debugger to attach before executing user code.

**Sample URL Format for Inspector:**
```
ws://127.0.0.1:9229/UUID
```

**Troubleshooting Commands:**
- To view V8 version: `node -p process.versions.v8`

---

# 4. npm Package Manager

**Common Commands:**

- **Installing all dependencies:**
  - Command: `npm install`
  - Installs modules listed in package.json into the node_modules folder.

- **Installing a single package:**
  - Command: `npm install <package-name>`
  - By default (since npm 5), adds the package to dependencies in package.json.

- **Flag Options:**
  - `--save-dev` or `-D`: Adds package to devDependencies.
  - `--save-optional` or `-O`: Adds package to optionalDependencies.
  - `--no-save`: Installs without updating package.json.

- **Updating Packages:**
  - Command: `npm update` (or `npm update <package-name>` for a specific package)

**Script Example in package.json:**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node lib/server-development.js",
    "prod": "NODE_ENV=production node lib/server-production.js"
  }
}
```

Run a script with: `npm run <script-name>`

---

# 5. ECMAScript & V8 Engine

- Node.js runs on the V8 JavaScript engine, used in Google Chrome.
- **ECMAScript Features:**
  - All stable ECMAScript 2015 (ES6) features ship by default.
  - Staged features require the `--harmony` flag (alias: `--es_staging`).
  - In progress features can be enabled individually with their respective harmony flags.

- **Checking V8 Version:**
  - Use: `node -p process.versions.v8`

---

# 6. WebAssembly Integration

**Key Concepts:**
- **Module:** A compiled WebAssembly binary (.wasm file).
- **Memory:** A resizable ArrayBuffer interfaced via WebAssembly.Memory.
- **Table:** A resizable typed array for function references.
- **Instance:** The instantiated WebAssembly module with exports.

**Usage Example:**
```js
// Reading and Instantiating a WebAssembly module
const fs = require('node:fs');

// Read the binary contents of the .wasm file
const wasmBuffer = fs.readFileSync('/path/to/add.wasm');

// Instantiate the WebAssembly module
WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
  // Access exported function 'add'
  const { add } = wasmModule.instance.exports;
  const result = add(5, 6);
  console.log('Result:', result); // Expected Output: 11
});
```

**Interoperability Tip:**
- Direct OS access from WebAssembly is not available; use third-party tools like Wasmtime with WASI API for OS interactions.


## Attribution
- Source: Node.js Official Documentation
- URL: https://nodejs.org/en/docs/
- License: License: MIT
- Crawl Date: 2025-04-17T21:40:36.196Z
- Data Size: 201133 bytes
- Links Found: 1990

## Retrieved
2025-04-17
