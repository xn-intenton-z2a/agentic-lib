# MARKDOWN_GITHUB

## Crawl Summary
Installation command npm install markdown-it-github  
Import plugin as require('markdown-it-github') and apply via md.use(plugin)  
Generated H1 tags have classes md-github md-github__h1; anchors have md-github__anchor; lists have md-github__ul and items md-github__li  
Styling requires github.css and wrapper .md-github__body with min-width:200px, max-width:980px

## Normalised Extract
Table of Contents:
1 Installation
2 Plugin Initialization
3 Generated HTML Structure
4 Styling Integration

1 Installation
Execute npm install markdown-it-github to add the plugin to project dependencies.

2 Plugin Initialization
Require modules:
  const markdownIt = require('markdown-it')
  const githubPlugin = require('markdown-it-github')
Instantiate and register plugin:
  const md = markdownIt().use(githubPlugin)

3 Generated HTML Structure
Headings
  <h1 class="md-github md-github__h1">
    <a class="md-github__anchor" name="<slug>" href="#<slug>">
      <svg class="md-github__octicon md-github__octicon-link">…</svg>
    </a>
    Content
  </h1>
Lists
  <ul class="md-github md-github__ul">
    <li class="md-github md-github__li">Item</li>
  </ul>

4 Styling Integration
Import github.css in <head> and wrap generated HTML in <div class="md-github__body">. Apply CSS:
  .md-github__body { min-width: 200px; max-width: 980px; }

## Supplementary Details
Plugin Function Signature:
  module.exports = function githubPlugin(md: MarkdownIt): void

Package Version: 0.5.0
License: Unlicense
Main entry: index.js
Dependencies: markdown-it >=8.0.0
Files: index.js, dist/css/github.css, assets/svg-link-icon.svg, README.md

CSS File Path: node_modules/markdown-it-github/dist/css/github.css

Default Behavior:
  No configuration options. All inline headings and lists receive GitHub classes.

Implementation Steps:
  1 npm install markdown-it-github
  2 import and use plugin
  3 ensure CSS is loaded
  4 render markdown and inject into styled container

## Reference Details
Complete Usage Code Example:
```javascript
// index.js
const fs = require('fs')
const markdownIt = require('markdown-it')
const githubPlugin = require('markdown-it-github')

// Initialize MarkdownIt with GitHub style plugin
const md = markdownIt({
  html: true,
  linkify: true,
  typographer: true
}).use(githubPlugin)

// Read markdown input file
const input = fs.readFileSync('index.md', 'utf-8')

// Render and output HTML
const output = md.render(input)
console.log(output)
```

Configuration Options: none

Container Integration HTML:
```html
<link rel="stylesheet" href="github.css">
<div class="md-github__body">
  <!-- rendered HTML -->
</div>
```

Best Practices:
- Enable markdown-it options html, linkify and typographer for full GitHub-like rendering.
- Load github.css after any global styles to override defaults.
- Wrap output in .md-github__body to apply width constraints.

Troubleshooting:
1 If heading anchors missing:
   Ensure markdown-it was instantiated with html:true.
2 If CSS styles not applied:
   Verify <link> path to github.css and .md-github__body wrapper present.
3 Debug Rendering:
   console.log(md.renderInline('text')) to inspect inline conversions


## Information Dense Extract
install markdown-it-github via npm; import with require('markdown-it-github'); apply plugin via markdownIt().use(githubPlugin); generated tags: headings with classes md-github md-github__h1, anchors md-github__anchor, lists md-github__ul, items md-github__li; wrap output in <div class="md-github__body">; load github.css; CSS .md-github__body{min-width:200px;max-width:980px;}

## Sanitised Extract
Table of Contents:
1 Installation
2 Plugin Initialization
3 Generated HTML Structure
4 Styling Integration

1 Installation
Execute npm install markdown-it-github to add the plugin to project dependencies.

2 Plugin Initialization
Require modules:
  const markdownIt = require('markdown-it')
  const githubPlugin = require('markdown-it-github')
Instantiate and register plugin:
  const md = markdownIt().use(githubPlugin)

3 Generated HTML Structure
Headings
  <h1 class='md-github md-github__h1'>
    <a class='md-github__anchor' name='<slug>' href='#<slug>'>
      <svg class='md-github__octicon md-github__octicon-link'></svg>
    </a>
    Content
  </h1>
Lists
  <ul class='md-github md-github__ul'>
    <li class='md-github md-github__li'>Item</li>
  </ul>

4 Styling Integration
Import github.css in <head> and wrap generated HTML in <div class='md-github__body'>. Apply CSS:
  .md-github__body { min-width: 200px; max-width: 980px; }

## Original Source
Markdown Rendering & Mermaid Workflows
https://www.npmjs.com/package/markdown-it-github

## Digest of MARKDOWN_GITHUB

# markdown-it-github Plugin Detailed Digest
Date Retrieved: 2024-06-15
Data Size: 257856 bytes
Links Found: 2847

## Installation

Run:

```bash
npm install markdown-it-github
```

## Plugin Usage Example

index.md:
```
# This is an H1

- Red
- Green
- Blue
```

index.js:
```javascript
const fs = require('fs')
const markdownIt = require('markdown-it')
const githubPlugin = require('markdown-it-github')

const md = markdownIt().use(githubPlugin)
const input = fs.readFileSync('index.md', 'utf-8')
const result = md.render(input)
console.log(result)
```

## Output HTML Structure

Generated markup for H1:

```html
<h1 class="md-github md-github__h1">
  <a class="md-github__anchor" name="this-is-an-h1" href="#this-is-an-h1">
    <svg class="md-github__octicon md-github__octicon-link" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
      <path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9z"></path>
    </svg>
  </a>
  This is an H1
</h1>
```

List markup:

```html
<ul class="md-github md-github__ul">
  <li class="md-github md-github__li">Red</li>
  <li class="md-github md-github__li">Green</li>
  <li class="md-github md-github__li">Blue</li>
</ul>
```

## Styling Integration

Add GitHub CSS and container wrapper:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="github.css">
  <style>
    .md-github__body {
      min-width: 200px;
      max-width: 980px;
    }
  </style>
</head>
<body>
  <div class="md-github__body">
    <!-- output inserted here -->
  </div>
</body>
</html>
```


## Attribution
- Source: Markdown Rendering & Mermaid Workflows
- URL: https://www.npmjs.com/package/markdown-it-github
- License: License: MIT
- Crawl Date: 2025-05-14T16:15:07.476Z
- Data Size: 257856 bytes
- Links Found: 2847

## Retrieved
2025-05-14
