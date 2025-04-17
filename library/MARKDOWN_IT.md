# MARKDOWN_IT

## Crawl Summary
This document provides exact technical specifications for markdown-it. It covers installation commands, usage examples including both full render and inline render, initialization presets with configuration options and default values, plugin usage syntax with .use() chaining, and detailed syntax highlighting configurations with and without full wrapper override. The content also lists methods to enable/disable rules, provides example benchmark commands, and includes precise performance measurements.

## Normalised Extract
## Table of Contents
1. Install
2. Usage Examples
3. Initialization with Options
4. Plugin Integration
5. Syntax Highlighting
6. Linkify Configuration
7. API & Syntax Extensions
8. Rule Management
9. Benchmarking
10. Authors & License

### 1. Install
- Node.js: `npm install markdown-it`
- Browser CDN: jsDeliver and cdnjs.com

### 2. Usage Examples
- **Simple Rendering:**
  ```javascript
  import markdownit from 'markdown-it';
  const md = markdownit();
  const result = md.render('# markdown-it rulezz!');
  ```
- **Inline Rendering:**
  ```javascript
  const inline = md.renderInline('__markdown-it__ rulezz!');
  ```

### 3. Initialization with Options
- Preset Modes:
  - CommonMark: `markdownit('commonmark')`
  - Default: `markdownit()`
  - Full options: 
    ```javascript
    const md = markdownit({
      html: true,
      linkify: true,
      typographer: true
    });
    ```
- Full Options List with Defaults explained in code comments.

### 4. Plugin Integration
- Use the `.use()` method to load plugins:
  ```javascript
  const md = markdownit()
    .use(plugin1)
    .use(plugin2, { /* options */ })
    .use(plugin3);
  ```

### 5. Syntax Highlighting
- Highlight option using highlight.js with default and full wrapper override provided.

### 6. Linkify Configuration
- Enable linkify via options and configure using `md.linkify.set({ fuzzyEmail: false })`.

### 7. API & Syntax Extensions
- Integrated support for tables, strikethrough, and additional plugins (subscript, superscript, etc.).
- Refer to markdown-it API documentation for detailed extension development.

### 8. Rule Management
- Enable/Disable rules:
  ```javascript
  const md = markdownit()
    .disable(['link', 'image'])
    .enable(['link'])
    .enable('image');
  ```

### 9. Benchmarking
- Running `npm run benchmark-deps` provides performance metrics: ops/sec for different parsing modes.

### 10. Authors & License
- Credits to Alex Kocharin and Vitaly Puzrin, MIT license.


## Supplementary Details
### Configuration Options and Default Values
- html: false (default). When true, HTML tags are allowed in source.
- xhtmlOut: false. Use '/' to close single tags when true.
- breaks: false. When true, converts '\n' to <br> tags in paragraphs.
- langPrefix: 'language-'. Prefix added to CSS classes for fenced code blocks.
- linkify: false (default). When true, auto-detects URL-like text and converts to links.
- typographer: false. When true, enables smart quotes and language-neutral replacements.
- quotes: '“”‘’'. Application: used if typographer is enabled.
- highlight: function(str, lang). Custom highlight function; default returns empty string. Use highlight.js integration for syntax highlighting.

### Implementation Steps for Key Features
1. **Installation:** Use npm to install markdown-it in Node.js environment.
2. **Basic Usage:** Import markdown-it and use either `render` for full document or `renderInline` for inline text.
3. **Initialization:** Initialize with preset modes or custom options as required.
4. **Plugins:** Load additional plugins by chaining `.use(pluginName)` calls.
5. **Syntax Highlighting:** Integrate highlight.js by providing a custom highlight function that wraps code in `<pre><code class="hljs">` tags.
6. **Linkify:** Enable linkify option and further customize via `md.linkify.set()`.
7. **Rule Management:** Enable or disable specific markdown rules using the `.disable()` and `.enable()` methods.

### Detailed Implementation Steps
- **Step 1:** Import markdown-it: `import markdownit from 'markdown-it';`
- **Step 2:** Instantiate the parser: `const md = markdownit(options);`
- **Step 3:** Render markdown string using `md.render(markdownText)`.
- **Step 4:** For inline markdown, use `md.renderInline(text)`.
- **Step 5:** To add plugins, chain them: `.use(plugin, pluginOptions)`.
- **Step 6:** Configure syntax highlighting by passing a function to the `highlight` option.


## Reference Details
### API Specifications and SDK Method Signatures

- **Constructor:**

  ```javascript
  // new markdownit(preset?: string, options?: Object)
  // preset: 'commonmark' | 'default' | 'zero'
  // options: {
  //   html: boolean,
  //   xhtmlOut: boolean,
  //   breaks: boolean,
  //   langPrefix: string,
  //   linkify: boolean,
  //   typographer: boolean,
  //   quotes: string | string[],
  //   highlight: function(str: string, lang: string): string
  // }
  import markdownit from 'markdown-it';
  const md = markdownit('default', { /* see options above */ });
  ```

- **Method render:**

  ```javascript
  // md.render(source: string) => string
  const htmlOutput = md.render('# Markdown-It example');
  ```

- **Method renderInline:**

  ```javascript
  // md.renderInline(source: string) => string
  const inlineOutput = md.renderInline('__bold text__');
  ```

- **Plugin Integration:** 

  ```javascript
  // md.use(plugin: Function, ...options) => MarkdownIt instance
  // Example plugin usage:
  const mdPlugin = markdownit().use(myPlugin, { optionKey: 'value' });
  ```

- **Utility Methods:**

  ```javascript
  // md.utils.escapeHtml(source: string) => string
  const escaped = md.utils.escapeHtml('<div>Example</div>');
  ```

### Complete Code Example with Comments

```javascript
// Import the markdown-it module
import markdownit from 'markdown-it';
import hljs from 'highlight.js';

// Initialize markdown-it with full options and a custom highlight function
const md = markdownit({
  html: false,           // Do not allow HTML tags in the source
  xhtmlOut: false,       // Self-close single tags in HTML
  breaks: false,         // Do not convert newline to <br>
  langPrefix: 'language-',
  linkify: false,
  typographer: false,
  quotes: '“”‘’',
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        // Attempt to highlight using hljs
        return '<pre><code class="hljs">' +
               hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
               '</code></pre>';
      } catch (__) { /* ignore errors */ }
    }
    // Fallback: escape and wrap text
    return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

// Render a markdown string to HTML
const markdownString = '# Hello Markdown-It\nThis is a sample text.';
const htmlResult = md.render(markdownString);
console.log(htmlResult);

// Demonstrate inline rendering
const inlineMarkdown = '__Bold text__ without wrapping paragraph.';
const inlineResult = md.renderInline(inlineMarkdown);
console.log(inlineResult);

// Use a plugin
// Example: using a dummy plugin that adds a rule
function myPlugin(md, options) {
  // A simple plugin that replaces the text 'foo' with 'bar'
  function replaceFoo(state) {
    state.tokens.forEach(token => {
      if (token.type === 'inline' && token.content.includes('foo')) {
        token.content = token.content.replace(/foo/g, 'bar');
      }
    });
  }
  md.core.ruler.push('replace_foo', replaceFoo);
}

md.use(myPlugin);

// Render after applying the plugin
const pluginTest = md.render('foo should become bar.');
console.log(pluginTest);
```

### Troubleshooting Procedures

1. **Installation Issues:**
   - Command: `npm install markdown-it`
   - Expected Output: Successful installation messages in the terminal.

2. **Syntax Errors:**
   - Running code: Ensure ES Module support if using 'import'.
   - Command: Use Node.js version that supports ESM or use CommonJS syntax: `const markdownit = require('markdown-it');`

3. **Plugin Failures:**
   - Validate that plugins are functions and check for proper option structure.
   - Enable debugging by logging intermediate token states within plugin functions.

4. **Highlighting Errors:**
   - Verify that the language passed to highlight exists in highlight.js using `hljs.getLanguage(lang)`.
   - If errors occur, wrap highlight call in try-catch and fallback to escaping HTML.

5. **Linkify Issues:**
   - Confirm that the linkify option is enabled and configured via `md.linkify.set({ fuzzyEmail: false })`.
   - Test with URL strings to ensure proper conversion.

For any error responses, check the console output and ensure that all dependencies (like highlight.js) are correctly installed and imported.


## Original Source
markdown-it Documentation
https://github.com/markdown-it/markdown-it

## Digest of MARKDOWN_IT

# Markdown-It Technical Digest (Retrieved: 2023-10-22)

## Install

**Node.js:**

```bash
npm install markdown-it
```

**Browser (CDN):**

- jsDeliver CDN
- cdnjs.com CDN

## Usage Examples

### Simple Usage

```javascript
// For Node.js (CommonJS or ES Module):
import markdownit from 'markdown-it';
const md = markdownit();
const result = md.render('# markdown-it rulezz!');

// For browser (UMD build added to window):
const mdBrowser = window.markdownit();
const resultBrowser = mdBrowser.render('# markdown-it rulezz!');
```

### Inline Rendering

```javascript
import markdownit from 'markdown-it';
const md = markdownit();
const inlineResult = md.renderInline('__markdown-it__ rulezz!');
```

## Initialization with Presets and Options

Presets can be "commonmark", "zero", or "default".

```javascript
import markdownit from 'markdown-it';

// CommonMark mode
const mdCommon = markdownit('commonmark');

// Default mode
const mdDefault = markdownit();

// Enable everything with full options
const mdFull = markdownit({
  html: true,
  linkify: true,
  typographer: true
});
```

### Full Options (Defaults)

```javascript
const mdOptions = markdownit({
  html:         false,          // Disable HTML tags in source
  xhtmlOut:     false,          // Use '/' to close single tags
  breaks:       false,          // Convert '\n' into <br>
  langPrefix:   'language-',    // CSS prefix for fenced blocks
  linkify:      false,          // Autoconvert URL-like text to links
  typographer:  false,          // Enable language-neutral replacement and quotes beautification
  quotes: '“”‘’',              // Quote replacement; can be string or array
  highlight: function (/*str, lang*/) { return ''; } // Highlighter function
});
```

## Plugins Load

```javascript
import markdownit from 'markdown-it';

const mdPlugins = markdownit()
  .use(plugin1)
  .use(plugin2, { /* options */ })
  .use(plugin3);
```

## Syntax Highlighting

### Using Default Highlight Function with Highlight.js

```javascript
import markdownit from 'markdown-it';
import hljs from 'highlight.js';

const mdHighlight = markdownit({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return ''; // fallback escaping
  }
});
```

### With Full Wrapper Override

```javascript
const mdHighlightFull = markdownit({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre><code class="hljs">' +
               hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
               '</code></pre>';
      } catch (__) {}
    }
    return '<pre><code class="hljs">' + mdHighlightFull.utils.escapeHtml(str) + '</code></pre>';
  }
});
```

## Linkify

Enabling linkify automatically uses linkify-it. Configure via the linkify instance:

```javascript
const mdLinkify = markdownit({ linkify: true });
mdLinkify.linkify.set({ fuzzyEmail: false });  // Disable email to link conversion
```

## API Overview and Syntax Extensions

- **API Documentation:** Detailed at developer docs for plugin development.
- **Syntax Extensions:**
  - Embedded by default: Tables (GFM) and Strikethrough (GFM)
  - Via plugins: subscript, superscript, footnote, definition list, abbreviation, emoji, custom container, insert, mark, etc.

## Manage Rules

Rules can be enabled or disabled using methods:

```javascript
import markdownit from 'markdown-it';

const mdRules = markdownit()
  .disable(['link', 'image'])
  .enable(['link'])
  .enable('image');

// Alternatively, enable everything:
const mdAllRules = markdownit({
  html: true,
  linkify: true,
  typographer: true
});
```

## Benchmark Results

Example benchmark command:

```bash
npm run benchmark-deps
# benchmark/benchmark.mjs readme
```

Sample performance data (ops/sec) from README.md:

- commonmark-reference: 1222 ops/sec
- current: 743 ops/sec
- current-commonmark: 1568 ops/sec
- marked: 1587 ops/sec

Note: Differences in performance may be due to additional features in markdown-it.

## Authors and Attribution

- Alex Kocharin: github/rlidwka
- Vitaly Puzrin: github/puzrin

## License

MIT License


## Attribution
- Source: markdown-it Documentation
- URL: https://github.com/markdown-it/markdown-it
- License: License: MIT
- Crawl Date: 2025-04-17T17:47:03.173Z
- Data Size: 611023 bytes
- Links Found: 5177

## Retrieved
2025-04-17
