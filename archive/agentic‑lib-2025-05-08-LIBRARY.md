sandbox/library/DOTENV.md
# sandbox/library/DOTENV.md
# DOTENV

## Crawl Summary
Installation commands: npm, yarn, bun. .env file location: project root. Loading methods: require('dotenv').config(options), import 'dotenv/config'. Supported multiline values with raw breaks or \n for private keys. Comment rules: skip # lines and inline comments; wrap values with # in quotes. Parsing: dotenv.parse(input, { debug }) returns Record<string,string>. Preload via node -r dotenv/config with CLI options dotenv_config_path, dotenv_config_debug, or environment variables DOTENV_CONFIG_PATH, DOTENV_CONFIG_DEBUG. API functions: config(options) returns parsed and error, parse(src, options) returns parsed object, populate(target, source, options) populates target. ESM: import 'dotenv/config' before other imports. Troubleshooting: debug mode, correct path, REACT_APP_ prefix for React, polyfills for Webpack.

## Normalised Extract
Table of Contents
 1 Installation
 2 Usage
 3 Configuration Options
 4 Multiline Values
 5 Comments
 6 Parsing Engine
 7 Preloading
 8 API Methods
 9 ESM Import Pitfall
 10 Troubleshooting

1 Installation
 Run npm install dotenv --save
 or yarn add dotenv
 or bun add dotenv

2 Usage
 Place a file named .env in the application working directory
 Format each line as KEY=VALUE
 Load variables at startup using require('dotenv').config() or import 'dotenv/config'
 Access values via process.env.KEY

3 Configuration Options
 option      default                      type               effect
 path        [process.cwd]/.env           string or string[] path to .env file or files
 encoding    utf8                          string             file encoding
 debug       false                         boolean            enable debug logs
 override    false                         boolean            overwrite existing env vars
 processEnv  process.env                   object             target object to populate

4 Multiline Values
 Supported in Node.js v15+
 Use double-quoted string with embedded newlines
 Or encode line breaks with \n

5 Comments
 Lines starting with # are ignored
 Inline comments: KEY=value # comment
 If value includes # wrap in quotes

6 Parsing Engine
 Input type: string or Buffer
 parse applies these rules:
  - skip empty lines
  - ignore lines beginning with #
  - split at first =
  - trim unquoted values
  - remove surrounding quotes from quoted values
  - expand \n in double-quoted values
  - support backtick-wrapped values
 Returns Record<string,string>

7 Preloading
 Use Node require hook: node -r dotenv/config your_script.js
 CLI options: dotenv_config_path, dotenv_config_debug as CLI args override env vars
 Environment variables: DOTENV_CONFIG_PATH, DOTENV_CONFIG_DEBUG, DOTENV_CONFIG_ENCODING, DOTENV_CONFIG_DEBUG
 Precedence: CLI args > env vars > defaults

8 API Methods
 config(options?) -> { parsed?: Record<string,string>; error?: Error }
 parse(src, options?) -> Record<string,string>
 populate(target, source, options?) -> void

9 ESM Import Pitfall
 Avoid importing dotenv or calling config after other imports
 Always use import 'dotenv/config' as the first import in ESM modules
 Or preload via --require

10 Troubleshooting
 Enable debug:true in config to log parsing errors and file path issues
 Ensure .env path is correct or specify custom path
 For React, prefix env variables with REACT_APP_
 For Webpack front-end, install node-polyfill-webpack-plugin and configure DefinePlugin or use dotenv-webpack

## Supplementary Details
• Version support: multiline values and comments inside quotes available from v15.0.0 onward
• Environment variable expansion requires dotenv-expand plugin
• CLI preload supports values: dotenv_config_path, dotenv_config_encoding, dotenv_config_debug
• Environment variable parallels: DOTENV_CONFIG_PATH, DOTENV_CONFIG_ENCODING, DOTENV_CONFIG_DEBUG, DOTENV_CONFIG_OVERRIDE
• Order of loading multiple files: provided order in options.path array; default merge behavior: first wins unless override=true
• Recommended file structure: place .env at project root or specify path


## Reference Details
TypeScript Method Signatures

```ts
interface DotenvConfigOptions {
  path?: string | string[]                   // default path.resolve(process.cwd(), '.env')
  encoding?: string                          // default 'utf8'
  debug?: boolean                            // default false
  override?: boolean                         // default false
  processEnv?: Record<string, string>        // default process.env
}

type DotenvConfigOutput = {
  parsed?: Record<string, string>
  error?: Error
}

export function config(options?: DotenvConfigOptions): DotenvConfigOutput

export function parse(
  src: string | Buffer,
  options?: { debug?: boolean }
): Record<string, string>

export function populate(
  target: Record<string, unknown>,
  source: Record<string, string>,
  options?: { override?: boolean; debug?: boolean }
): void
```

Code Examples

```js
// Load .env with custom path and override enabled
const result = require('dotenv').config({
  path: './config/.env',
  encoding: 'latin1',
  debug: true,
  override: true,
  processEnv: {}
});
if (result.error) throw result.error;
console.log(result.parsed);

// Parse a buffer manually
const dotenv = require('dotenv');
const buf = Buffer.from('HOST=localhost\nPORT=3000');
const configObj = dotenv.parse(buf, { debug: true });
console.log(configObj.HOST, configObj.PORT);

// Populate a custom target object
const target = {};
const source = { NODE_ENV: 'production' };
dotenv.populate(target, source, { override: false, debug: true });
console.log(target.NODE_ENV);
```

CLI Preload Patterns

```
# Preload default .env
node -r dotenv/config server.js

# Set custom path and enable debug via CLI args
node -r dotenv/config server.js dotenv_config_path=./.env.development dotenv_config_debug=true

# Set via environment variables
DOTENV_CONFIG_PATH=./.env.test DOTENV_CONFIG_DEBUG=true node -r dotenv/config test.js
```

Webpack Front-end Integration

```js
// webpack.config.js
require('dotenv').config();
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const webpack = require('webpack');
module.exports = {
  plugins: [
    new NodePolyfillPlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        API_URL: process.env.API_URL
      })
    })
  ]
};
```

Troubleshooting Commands

```
# Enable debug logs
require('dotenv').config({ debug: true });
# Expected output if file missing
[dotenv][DEBUG] ENOENT: no such file or directory, open '/path/to/.env'
```


## Information Dense Extract
config options path:string|string[]=cwd+/.env encoding:string=utf8 debug:boolean=false override:boolean=false processEnv:object=parse target
parse input:string|Buffer options.debug:boolean returns Record<string,string>
populate target:object source:Record<string,string> options.override:boolean debug:boolean
install via npm/yarn/bun load via require('dotenv').config() or import 'dotenv/config'
preload CLI node -r dotenv/config with dotenv_config_path, dotenv_config_debug args or DOTENV_CONFIG_PATH, DOTENV_CONFIG_DEBUG env vars
multiline values in double quotes raw or \n comments skip lines starting # inline comments wrap values containing #
EMM: import 'dotenv/config' before other imports
troubleshoot: config({debug:true, path}) logs ENOENT errors React: prefix REACT_APP_ Webpack: polyfills or dotenv-webpack

## Sanitised Extract
Table of Contents
 1 Installation
 2 Usage
 3 Configuration Options
 4 Multiline Values
 5 Comments
 6 Parsing Engine
 7 Preloading
 8 API Methods
 9 ESM Import Pitfall
 10 Troubleshooting

1 Installation
 Run npm install dotenv --save
 or yarn add dotenv
 or bun add dotenv

2 Usage
 Place a file named .env in the application working directory
 Format each line as KEY=VALUE
 Load variables at startup using require('dotenv').config() or import 'dotenv/config'
 Access values via process.env.KEY

3 Configuration Options
 option      default                      type               effect
 path        [process.cwd]/.env           string or string[] path to .env file or files
 encoding    utf8                          string             file encoding
 debug       false                         boolean            enable debug logs
 override    false                         boolean            overwrite existing env vars
 processEnv  process.env                   object             target object to populate

4 Multiline Values
 Supported in Node.js v15+
 Use double-quoted string with embedded newlines
 Or encode line breaks with 'n

5 Comments
 Lines starting with # are ignored
 Inline comments: KEY=value # comment
 If value includes # wrap in quotes

6 Parsing Engine
 Input type: string or Buffer
 parse applies these rules:
  - skip empty lines
  - ignore lines beginning with #
  - split at first =
  - trim unquoted values
  - remove surrounding quotes from quoted values
  - expand 'n in double-quoted values
  - support backtick-wrapped values
 Returns Record<string,string>

7 Preloading
 Use Node require hook: node -r dotenv/config your_script.js
 CLI options: dotenv_config_path, dotenv_config_debug as CLI args override env vars
 Environment variables: DOTENV_CONFIG_PATH, DOTENV_CONFIG_DEBUG, DOTENV_CONFIG_ENCODING, DOTENV_CONFIG_DEBUG
 Precedence: CLI args > env vars > defaults

8 API Methods
 config(options?) -> { parsed?: Record<string,string>; error?: Error }
 parse(src, options?) -> Record<string,string>
 populate(target, source, options?) -> void

9 ESM Import Pitfall
 Avoid importing dotenv or calling config after other imports
 Always use import 'dotenv/config' as the first import in ESM modules
 Or preload via --require

10 Troubleshooting
 Enable debug:true in config to log parsing errors and file path issues
 Ensure .env path is correct or specify custom path
 For React, prefix env variables with REACT_APP_
 For Webpack front-end, install node-polyfill-webpack-plugin and configure DefinePlugin or use dotenv-webpack

## Original Source
dotenv – Environment Configuration
https://github.com/motdotla/dotenv#readme

## Digest of DOTENV

# Install

npm install dotenv --save

yarn add dotenv
bun add dotenv

# Usage (.env)

Create a file named .env in your project root with KEY=VALUE pairs, for example:

```
S3_BUCKET="YOURS3BUCKET"
SECRET_KEY="YOURSECRETKEYGOESHERE"
```

In your application entry point, as early as possible, load environment variables:

```
// CommonJS
require('dotenv').config()

// ES Module
import 'dotenv/config'
```

After loading, process.env contains all defined variables.

# Multiline Values

Supported for Node.js >= v15.0.0. Use raw line breaks inside double quotes:

```
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
...line2
...line3
-----END RSA PRIVATE KEY-----"
```

Or encode newlines with \n:

```
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n"
```

# Comments

- Lines beginning with # are skipped.
- Inline comments are allowed after value: `KEY=value # comment`.
- If value contains # wrap it in quotes.

# Parsing Engine

```js
const dotenv = require('dotenv')
const buf = Buffer.from('BASIC=basic')
const parsed = dotenv.parse(buf)
console.log(parsed) // { BASIC: 'basic' }
```

# Preload

Use the Node.js require hook to preload:

```
node -r dotenv/config your_script.js
```

Supported CLI options:

```
node -r dotenv/config your_script.js dotenv_config_path=/custom/.env dotenv_config_debug=true
```

Or via environment variables:

```
DOTENV_CONFIG_PATH=/custom/.env DOTENV_CONFIG_DEBUG=true node -r dotenv/config your_script.js
```

# API Reference

## config(options?)

Reads .env file(s), parses contents, assigns to process.env, returns:

```ts
type DotenvConfigOptions = {
  path?: string | string[]
  encoding?: string
  debug?: boolean
  override?: boolean
  processEnv?: Record<string,string>
}

type DotenvConfigOutput = {
  parsed?: Record<string,string>
  error?: Error
}

function config(options?: DotenvConfigOptions): DotenvConfigOutput
```

## parse(src, options?)

Parses a string or Buffer and returns an object:

```ts
function parse(src: string | Buffer, options?: { debug?: boolean }): Record<string,string>
```

## populate(target, source, options?)

Populates target object with source variables:

```ts
function populate(
  target: Record<string,unknown>,
  source: Record<string,string>,
  options?: { override?: boolean; debug?: boolean }
): void
```

# ESM Import Pitfall

Do not import dotenv after other modules. Instead:

```js
import 'dotenv/config'
import otherModule from './module.js'
```

# Troubleshooting

- If .env not found: use `config({ path: '/full/path/.env', debug: true })` to see ENOENT errors.
- For React apps: prefix variables with REACT_APP_.
- For Webpack: install node-polyfill-webpack-plugin and configure DefinePlugin or use dotenv-webpack.


## Attribution
- Source: dotenv – Environment Configuration
- URL: https://github.com/motdotla/dotenv#readme
- License: BSD-2-Clause
- Crawl Date: 2025-05-07T03:35:22.834Z
- Data Size: 899400 bytes
- Links Found: 5873

## Retrieved
2025-05-07
