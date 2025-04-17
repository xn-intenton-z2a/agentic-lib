# EJS_TEMPLATE

## Crawl Summary
EJS uses plain JavaScript for templating with simple scriptlet tags (<% %>, <%= %>, <%- %>). It compiles templates into intermediate JS functions for fast execution via caching, provides detailed debugging with template line numbers, and enjoys active development support. Core methods: ejs.render, ejs.compile, ejs.renderFile with explicit configuration options.

## Normalised Extract
## Table of Contents
1. Overview
2. Templating Syntax
3. Execution and Performance
4. Debugging
5. API Methods

### 1. Overview
EJS is a templating engine that allows JavaScript to directly generate HTML. It eliminates the need for custom templating languages by leveraging plain JavaScript. 

### 2. Templating Syntax
- **Control Flow:** Use `<% code %>` for running JavaScript logic.
- **Escaped Output:** Use `<%= expression %>` to output variables as escaped HTML.
- **Unescaped Output:** Use `<%- expression %>` to output raw HTML.

### 3. Execution and Performance
- **Compilation:** Templates are compiled into JavaScript functions.
- **Caching:** Intermediate functions are cached, dramatically increasing performance in production environments.

### 4. Debugging
- **Error Reporting:** Errors are thrown as JavaScript exceptions with precise template line numbers to aid debugging.
- **Debug Options:** Option `compileDebug: true` can be enabled to include additional debugging information in development.

### 5. API Methods
- **ejs.render:** Renders a template string into HTML.
- **ejs.compile:** Compiles a template string into a reusable function.
- **ejs.renderFile:** Renders a template file asynchronously using a callback function.


## Supplementary Details
### Function Signatures and Configuration Options

1. ejs.render(template: string, data?: object, options?: {
    cache?: boolean,          // Cache the compiled function. Defaults to false.
    filename?: string,        // Filename to be used for caching and error reporting.
    root?: string | string[], // Root path(s) for includes when using renderFile.
    delimiter?: string,       // Delimiter character for template tags. Default is '%'.
    strict?: boolean,         // Enforces strict mode, affecting variable scoping.
    compileDebug?: boolean,   // When true, includes debugging information in the compiled function.
    debug?: boolean,          // Outputs additional debug info during rendering.
    rmWhitespace?: boolean    // When true, removes unnecessary whitespace from the output.
}): string

2. ejs.compile(template: string, options?: Object): (data: object) => string

3. ejs.renderFile(filename: string, data?: object, options?: Object, callback?: (err: Error | null, str?: string) => void): void

### Sample Code

// Basic inline rendering
var ejs = require('ejs');
var template = "<h1><%= title %></h1>";
var data = { title: 'Hello EJS' };
var html = ejs.render(template, data, { cache: true, compileDebug: false });
console.log(html);

// Compile template for reuse
var compiled = ejs.compile(template, { delimiter: '%' });
console.log(compiled(data));

// Asynchronous file rendering
ejs.renderFile('template.ejs', data, { cache: false }, function(err, str) {
    if(err) {
        console.error('Render error:', err);
        return;
    }
    console.log(str);
});

### Configuration and Best Practices
- Set `cache: true` in production to enhance performance.
- Use `compileDebug: false` in production to minimize overhead.
- Define a consistent `delimiter` if custom tags are required.
- Always provide a `filename` when using includes, to ensure correct error reporting.

### Troubleshooting Procedures
1. If a template error occurs, verify the line number provided in the error output against your .ejs file.
2. Run with `compileDebug: true` during development to get detailed error stacks.
3. Ensure that the correct file paths are used when rendering from file using ejs.renderFile.
4. Enable `debug: true` temporarily to log rendering process details.


## Reference Details
### Complete API Specifications

#### Method: ejs.render
- **Signature:**
  ejs.render(template: string, data?: object, options?: {
      cache?: boolean,          // (optional) Enables caching of the compiled function. [Default: false]
      filename?: string,        // (optional) Filename for the template. Important for caching and error reporting.
      root?: string | string[], // (optional) Root directory for included templates.
      delimiter?: string,       // (optional) Custom tag delimiter. [Default: '%']
      strict?: boolean,         // (optional) Enforces strict mode. [Default: false]
      compileDebug?: boolean,   // (optional) Include debugging information in compiled function. [Default: true]
      debug?: boolean,          // (optional) Outputs debug information during rendering. [Default: false]
      rmWhitespace?: boolean    // (optional) Removes redundant whitespace for optimized output. [Default: false]
  }): string

- **Returns:** Rendered HTML as a string.
- **Exceptions:** Throws a JavaScript Error with template line reference if the template contains syntax errors.

#### Method: ejs.compile
- **Signature:**
  ejs.compile(template: string, options?: {
      cache?: boolean,
      filename?: string,
      root?: string | string[],
      delimiter?: string,
      strict?: boolean,
      compileDebug?: boolean,
      debug?: boolean,
      rmWhitespace?: boolean
  }): (data: object) => string

- **Returns:** A function that accepts a data object and returns a rendered string.

#### Method: ejs.renderFile
- **Signature:**
  ejs.renderFile(filename: string, data?: object, options?: {
      cache?: boolean,
      filename?: string,
      root?: string | string[],
      delimiter?: string,
      strict?: boolean,
      compileDebug?: boolean,
      debug?: boolean,
      rmWhitespace?: boolean
  }, callback: (err: Error | null, str?: string) => void): void

- **Behavior:** Asynchronously reads the file, compiles it if needed, and returns the rendered HTML through the callback.

### Full Code Example with Comments

/*
 * Example: Rendering an EJS template from a file
 */
const ejs = require('ejs');
const path = require('path');

// Data to pass into the template
const data = {
  title: 'Welcome to EJS',
  user: { name: 'Developer' }
};

// Options including caching and file resolution
const options = {
  cache: true,                // Enable caching for performance
  compileDebug: false,        // Disable compile-time debugging info in production
  delimiter: '%',             // Default delimiter
  filename: path.join(__dirname, 'views', 'index.ejs') // Required for includes
};

// Asynchronous rendering with error checking
ejs.renderFile(options.filename, data, options, (err, html) => {
  if (err) {
    console.error('Error rendering EJS template:', err);
    // Troubleshooting: Verify template syntax and file path.
    return;
  }
  console.log('Rendered HTML:', html);
});

// Best Practice: In production, clear cache only when templates are updated.

### Troubleshooting Commands and Expected Outputs
// Command to run a Node.js script that uses EJS:
// $ node app.js
// Expected Output: Rendered HTML string or an error message with template location and line number.

// For debugging template issues, temporarily enable debugging options:
// Set compileDebug: true and use console logs to trace the rendering process.


## Original Source
EJS Template Engine Documentation
https://ejs.co/

## Digest of EJS_TEMPLATE

# EJS TEMPLATE ENGINE DOCUMENTATION

**Retrieved:** 2023-11-24

## Overview
EJS (Embedded JavaScript) is a templating engine that leverages plain JavaScript for dynamic HTML rendering. It avoids proprietary syntax by using standard JavaScript within scriptlet tags so developers write native code. 

## Templating Syntax
- <% code %>: Executes JavaScript code without output.
- <%= expression %>: Evaluates expression and escapes HTML.
- <%- expression %>: Evaluates expression and outputs unescaped HTML.

## Execution and Performance
- EJS compiles templates into intermediate JavaScript functions using the V8 engine.
- It caches these functions to improve execution speed.

## Debugging
- Errors in EJS are thrown as plain JavaScript exceptions.
- Template errors include line numbers, aiding in quick debugging.

## Active Development
- EJS is under continuous improvement with an active and supportive community.

## Additional Technical Details
- API methods include ejs.render, ejs.compile, and ejs.renderFile with well-defined parameter configurations and callback mechanisms.


## Attribution
- Source: EJS Template Engine Documentation
- URL: https://ejs.co/
- License: License: MIT License
- Crawl Date: 2025-04-17T14:09:10.537Z
- Data Size: 9176 bytes
- Links Found: 33

## Retrieved
2025-04-17
