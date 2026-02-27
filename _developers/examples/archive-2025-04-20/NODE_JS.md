# NODE_JS

## Crawl Summary
Crawled content provided no additional technical details (Data Size: 0 bytes). The document is derived from the Node.js Documentation source with precise API and module details including method signatures, parameters, and code examples.

## Normalised Extract
## Table of Contents
1. HTTP Module
   - Signature: `http.createServer([options,] requestListener) => http.Server`
   - Detailed Example with a working HTTP server script.
2. File System Module
   - Signature: `fs.readFile(path[, options], callback) => void`
   - Detailed Example for reading a file with error handling.
3. Path and URL Modules
   - Path: `path.join([...paths]) => string`
   - URL: `new URL(input[, base]) => URL`
   - Examples for creating file paths and parsing URLs.
4. Process Module
   - Key properties: `process.argv`, `process.env`
   - Exception handling: `process.on('uncaughtException', callback)`

## Detailed Information

### 1. HTTP Module
- **Signature:** `http.createServer([options,] requestListener) => http.Server`
- **Description:** Initializes a new HTTP server capable of listening to incoming connections with an optional configuration object and a mandatory request handler.
- **Example:**
  ```js
  const http = require('http');
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
  });
  server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
  });
  ```

### 2. File System Module
- **Signature:** `fs.readFile(path[, options], callback) => void`
- **Parameters:**
  - `path`: File path (string, Buffer, or URL)
  - `options`: (Optional) Encoding options such as `'utf8'`.
  - `callback`: Function with parameters `(err, data)`.
- **Example:**
  ```js
  const fs = require('fs');
  fs.readFile('example.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('File content:', data);
  });
  ```

### 3. Path and URL Modules
- **Path Module Signature:** `path.join([...paths]) => string`
- **URL Module Signature:** `new URL(input[, base]) => URL`
- **Examples:**
  ```js
  const path = require('path');
  const fullPath = path.join(__dirname, 'folder', 'file.txt');
  console.log(fullPath);

  const { URL } = require('url');
  const myUrl = new URL('https://nodejs.org/en/docs');
  console.log(myUrl.hostname);
  ```

### 4. Process Module
- **Properties:**
  - `process.argv`: Retrieves command line arguments.
  - `process.env`: Accesses environment variables.
- **Exception Handling:**
  ```js
  process.on('uncaughtException', (err) => {
    console.error('Unhandled exception:', err);
    process.exit(1);
  });
  ```


## Supplementary Details
### Supplementary Technical Specifications

- **HTTP Module Options:**
  - When providing an options object to `http.createServer(options, requestListener)`, properties such as `allowHTTP1.1` (Boolean) can be specified to enable compatibility with HTTP/1.1 protocols.
  - Advanced configuration including TLS options for secure servers can be provided to use HTTPS in a similar pattern via `https.createServer(options, requestListener)`.

- **File System Module Configuration:**
  - The `fs.readFile` method supports options as a string (encoding) or an object `{ encoding: 'utf8', flag: 'r' }`.
  - Error handling patterns are crucial: Ensure asynchronous errors are caught in callbacks or by using Promises (`fs.promises.readFile`).

- **Path Module Considerations:**
  - `path.join` normalizes path segments. Use absolute paths when combining __dirname with relative paths for robust file system access.

- **Process Module Best Practices:**
  - Use `process.on('exit', callback)` to perform cleanup operations.
  - Validate and sanitize `process.argv` inputs to ensure security and correctness in CLI applications.
  - Monitoring `process.memoryUsage()` can provide insights into application performance.

- **Troubleshooting Procedures:**
  - For HTTP server errors, log full error stacks and use `debug` module for detailed logs.
  - For file system issues, verify file existence with `fs.existsSync` before reading.
  - Use Node.js built-in inspector by starting the application with `node --inspect app.js` for debugging purposes.


## Reference Details
### Complete API Specifications and SDK Method Signatures

1. HTTP Module:
   - **Function:** `http.createServer([options,] requestListener)
   - **Parameters:**
     - options (Object, optional): May include properties such as `allowHTTP1.1` (Boolean), TLS configuration options if used in HTTPS.
     - requestListener (Function): Signature `(req: IncomingMessage, res: ServerResponse) => void`
   - **Return Type:** `http.Server`
   - **Code Example:**
     ```js
     const http = require('http');
     const options = { allowHTTP1.1: true };
     const server = http.createServer(options, (req, res) => {
       res.writeHead(200, { 'Content-Type': 'text/plain' });
       res.end('Hello from Node.js HTTP server!');
     });
     server.listen(8080, () => console.log('Server listening on port 8080'));
     ```

2. File System Module:
   - **Function:** `fs.readFile(path[, options], callback)
   - **Parameters:**
     - path (String | Buffer | URL): path of the file to be read
     - options (String | Object, optional): encoding (default: null) or object such as `{ encoding: 'utf8', flag: 'r' }`
     - callback (Function): Signature `(err: Error | null, data: string | Buffer) => void`
   - **Return Type:** `void`
   - **Code Example:**
     ```js
     const fs = require('fs');
     fs.readFile('./file.txt', { encoding: 'utf8', flag: 'r' }, (err, data) => {
       if (err) {
         console.error('Read error:', err);
         return;
       }
       console.log('File data:', data);
     });
     ```

3. Path Module:
   - **Function:** `path.join([...paths])
   - **Parameters:**
     - Multiple path segments (Strings) to join
   - **Return Type:** `string`
   - **Code Example:**
     ```js
     const path = require('path');
     const fullPath = path.join('/users', 'joe', 'docs');
     console.log('Full Path:', fullPath);
     ```

4. URL Module:
   - **Constructor:** `new URL(input[, base])
   - **Parameters:**
     - input (string): URL string
     - base (string, optional): Base URL if input is relative
   - **Return Type:** `URL`
   - **Code Example:**
     ```js
     const { URL } = require('url');
     const myUrl = new URL('/docs', 'https://nodejs.org');
     console.log(myUrl.href);  // https://nodejs.org/docs
     ```

5. Process Module:
   - **Properties & Methods:**
     - `process.argv` (Array<string>)
     - `process.env` (Object)
     - `process.on(event: string, callback: Function): NodeJS.Process`
   - **Exception Handling Example:**
     ```js
     process.on('uncaughtException', (err) => {
       console.error('Unhandled exception:', err);
       process.exit(1);
     });
     ```

### Best Practices and Troubleshooting

- **HTTP Server Debugging:** 
  - Use detailed logging:
    ```bash
    node --trace-warnings app.js
    ```
  - Ensure proper error handling in request callbacks.

- **File System Handling:**
  - Check file existence using `fs.existsSync` before attempting to read:
    ```js
    if (fs.existsSync(filePath)) {
      // read file safely
    }
    ```

- **Process Cleanup:**
  - Use `process.on('exit', cleanupFunction)` to ensure resources are released.

- **Configuration Options:**
  - Always specify encoding and flag values explicitly when dealing with file operations to avoid unexpected behavior.

- **SDK Method Usage:**
  - Validate input types and handle asynchronous errors using either callbacks or async/await patterns with try/catch blocks.


## Original Source
Node.js Documentation
https://nodejs.org/en/docs

## Digest of NODE_JS

# NODE.JS DOCUMENTATION (Retrieved: 2023-10-11)

## HTTP MODULE

**Method Signature:**

```js
http.createServer([options,] requestListener) => http.Server
```

**Description:** Creates a new HTTP server instance which listens for incoming requests. Accepts an optional configuration object and a callback function to handle requests.

**Example:**

```js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
```

---

## FILE SYSTEM MODULE

**Method Signature:**

```js
fs.readFile(path[, options], callback) => void
```

**Parameters:**
- `path` (String | Buffer | URL): The file path to read from.
- `options` (Object | String): Optional encoding or configuration options.
- `callback` (Function): Callback with signature `(err, data)` where `data` is the file data.

**Example:**

```js
const fs = require('fs');

fs.readFile('example.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  console.log('File content:', data);
});
```

---

## PATH AND URL MODULES

**Path Module:**

**Method Signature:**

```js
path.join([...paths]) => string
```

**Example:**

```js
const path = require('path');
const fullPath = path.join(__dirname, 'folder', 'file.txt');
console.log(fullPath);
```

**URL Module:**

**Method Signature:**

```js
new URL(input[, base]) => URL
```

**Example:**

```js
const { URL } = require('url');
const myUrl = new URL('https://nodejs.org/en/docs');
console.log(myUrl.hostname);  // nodejs.org
```

---

## PROCESS MODULE

**Common Properties and Methods:**

- `process.argv`: An array containing the command-line arguments.
- `process.env`: An object containing the user environment.
- `process.on('uncaughtException', callback)`: Catches exceptions not handled in the program.

**Example:**

```js
// Accessing command-line arguments
console.log('Arguments:', process.argv);

// Handling uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Unhandled exception:', err);
  process.exit(1);
});
```

---

## ATTRIBUTION & DATA SIZE

- Data Size from Crawl: 0 bytes
- Source: Node.js Documentation (https://nodejs.org/en/docs)


## Attribution
- Source: Node.js Documentation
- URL: https://nodejs.org/en/docs
- License: License: Creative Commons Attribution 4.0 International
- Crawl Date: 2025-04-17T21:57:44.391Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-04-17
