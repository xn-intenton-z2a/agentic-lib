# DOTENV

## Crawl Summary
Version: >=16.0.0. Install: npm install dotenv. Usage: require('dotenv').config() or import 'dotenv/config'. Supports multiline values with native breaks and \n. Comments: '#' marks, inline allowed, values with '#' must be quoted. parse(buffer, options) returns key/value object. Preload with node -r dotenv/config, supports dotenv_config_<option> CLI args and DOTENV_CONFIG_<OPTION> env vars. Exposes config(options), parse(input,options), populate(target,source,options), decrypt(for dotenvx). Config options: path (string|array, default cwd/.env), encoding (utf8), debug (false), override (false), processEnv (process.env). Parsing rules: skip empty lines, comments, trim whitespace, preserve quoted whitespace, expand \n in double quotes, support backticks. Troubleshooting: debug mode, correct file path, React requires REACT_APP_, use polyfills or dotenv-webpack.

## Normalised Extract
Table of Contents:
1 Installation
2 Basic Usage
3 Config Function
4 Parse Function
5 Populate Function
6 Config Options
7 Parsing Rules
8 Preload
9 Troubleshooting

1 Installation
  Command: npm install dotenv --save
  Alternative: yarn add dotenv, bun add dotenv

2 Basic Usage
  Create .env at project root
  CommonJS import: require('dotenv').config()
  ES Module import: import 'dotenv/config'
  After import, process.env contains variables

3 Config Function
  Signature: config(options?)
  Returns: { parsed: Record<string,string>, error?: Error }
  Options:
    path: string or string[], default cwd/.env
    encoding: string, default 'utf8'
    debug: boolean, default false
    override: boolean, default false
    processEnv: object, default process.env
  Behavior:
    Load files in order, combine values; first wins unless override true

4 Parse Function
  Signature: parse(input: Buffer|string, options?: { debug?: boolean }) => Record<string,string>
  Accepts Buffer or string of KEY=VAL pairs
  Options:
    debug: boolean, default false
  Returns parsed object

5 Populate Function
  Signature: populate(target: object, source: Record<string,string>, options?: { override?: boolean, debug?: boolean })
  Assigns source to target according to override flag

6 Config Options
  Option path: single path or array, default cwd/.env
  Option encoding: 'utf8' or other
  Option debug: true|false
  Option override: true|false
  Option processEnv: destination object

7 Parsing Rules
  empty lines skipped
  lines starting '#' skipped unless inside quoted value
  unquoted values trimmed both ends
  single/double quoted values maintain whitespace
  double quoted values expand \n into new lines
  backticked values support mixed quotes

8 Preload
  Node CLI: node -r dotenv/config your_script.js
  CLI args: dotenv_config_path, dotenv_config_debug, dotenv_config_encoding
  Env vars: DOTENV_CONFIG_PATH, DOTENV_CONFIG_DEBUG, DOTENV_CONFIG_ENCODING

9 Troubleshooting
  Debug mode: config({ debug: true }) logs parsing reasons
  Missing variables: verify .env location, correct filename
  React: only REACT_APP_ prefixed vars are injected
  Webpack front-end: install node-polyfill-webpack-plugin or use dotenv-webpack

## Supplementary Details
Supported Node versions: v10+.
Multiline variable syntax:
  -----BEGIN RSA PRIVATE KEY-----
  ...
  -----END RSA PRIVATE KEY-----
Alternative: use \n within double quotes.
Comment syntax:
  # comment at line start
  value # inline comment
Escape rules:
  JSON={"foo":"bar"} => preserves inner quotes
  BACKTICK_KEY=`mixed 'quotes' and \"double\" inside`
Precedence:
  default: do not override existing process.env
  override: last file wins
ProcessEnv override:
  Pass custom object to config or populate instead of process.env
Example:
  const myEnv = {}
  require('dotenv').config({ processEnv: myEnv })
CLI usage with custom path and debug:
  DOTENV_CONFIG_PATH=/etc/app/.env DOTENV_CONFIG_DEBUG=true node -r dotenv/config index.js

## Reference Details
Function: config(options?) => { parsed: Record<string,string>, error?: Error }
Parameters:
  options.path: string or string[] = path.resolve(cwd,'.env')
  options.encoding: string = 'utf8'
  options.debug: boolean = false
  options.override: boolean = false
  options.processEnv: object = process.env
Returns:
  parsed: key/value pairs loaded
  error: error object if file read/parsing failed

Function: parse(input: Buffer|string, options?: { debug?: boolean }) => Record<string,string>
Parameters:
  input: Buffer|string containing KEY=VAL lines
  options.debug: boolean = false
Returns:
  object mapping keys to values
Errors:
  Throws if invalid input and debug mode triggers error

Function: populate(target: object, source: Record<string,string>, options?: { override?: boolean, debug?: boolean }) => void
Parameters:
  target: object to receive values
  source: parsed key/value object
  options.override: boolean = false
  options.debug: boolean = false
Behavior:
  Assigns each key in source to target
  Skips existing keys unless override true

Function: decrypt(...) reserved for dotenvx plugin

Example Implementation Pattern:
1. require('dotenv').config({ path: ['.env.local','.env'], override: true, debug: process.env.DEBUG })
2. Access variables: const db = process.env.DB_HOST

Best Practices:
- Do not commit .env to VCS
- Use one .env per environment; name .env.production, .env.test
- For React, prefix variables with REACT_APP_

Troubleshooting Commands:
$ node -r dotenv/config app.js
$ require('dotenv').config({ debug: true }) // logs parser details
Expected output: [dotenv] loaded .env

Webpack Front-end Fix:
npm install node-polyfill-webpack-plugin
Add to webpack.config.js:
  const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
  plugins: [ new NodePolyfillPlugin(), new webpack.DefinePlugin({'process.env': ...}) ]
Alternatively: npm install dotenv-webpack and add plugin

## Information Dense Extract
dotenv vX: install npm install dotenv. Usage: require('dotenv').config(opts) or import 'dotenv/config'. Exposed: config({path:string|[],encoding:'utf8',debug:false,override:false,processEnv:object}), parse(input:Buffer|string,{debug:false}):Record<string,string>, populate(target:object,source:Record<string,string>,{override:false,debug:false}), decrypt for dotenvx. Config path default cwd/.env, encoding utf8, debug false logs parsing, override false preserves existing env. parse rules: skip empty lines, comments (# unless quoted), trim unquoted, preserve quoted whitespace, expand \n in double quotes, support backticks. Preload: node -r dotenv/config script.js with dotenv_config_path, dotenv_config_debug, dotenv_config_encoding CLI args or DOTENV_CONFIG_* env. Multiline: native breaks (>=v15), or \n. Comments inline allowed, values with # require quotes. Best practices: no VCS commit, one .env per environment, React prefix REACT_APP_. Troubleshooting: config({debug:true}), node -r dotenv/config, polyfill node-polyfill-webpack-plugin or use dotenv-webpack.

## Sanitised Extract
Table of Contents:
1 Installation
2 Basic Usage
3 Config Function
4 Parse Function
5 Populate Function
6 Config Options
7 Parsing Rules
8 Preload
9 Troubleshooting

1 Installation
  Command: npm install dotenv --save
  Alternative: yarn add dotenv, bun add dotenv

2 Basic Usage
  Create .env at project root
  CommonJS import: require('dotenv').config()
  ES Module import: import 'dotenv/config'
  After import, process.env contains variables

3 Config Function
  Signature: config(options?)
  Returns: { parsed: Record<string,string>, error?: Error }
  Options:
    path: string or string[], default cwd/.env
    encoding: string, default 'utf8'
    debug: boolean, default false
    override: boolean, default false
    processEnv: object, default process.env
  Behavior:
    Load files in order, combine values; first wins unless override true

4 Parse Function
  Signature: parse(input: Buffer|string, options?: { debug?: boolean }) => Record<string,string>
  Accepts Buffer or string of KEY=VAL pairs
  Options:
    debug: boolean, default false
  Returns parsed object

5 Populate Function
  Signature: populate(target: object, source: Record<string,string>, options?: { override?: boolean, debug?: boolean })
  Assigns source to target according to override flag

6 Config Options
  Option path: single path or array, default cwd/.env
  Option encoding: 'utf8' or other
  Option debug: true|false
  Option override: true|false
  Option processEnv: destination object

7 Parsing Rules
  empty lines skipped
  lines starting '#' skipped unless inside quoted value
  unquoted values trimmed both ends
  single/double quoted values maintain whitespace
  double quoted values expand 'n into new lines
  backticked values support mixed quotes

8 Preload
  Node CLI: node -r dotenv/config your_script.js
  CLI args: dotenv_config_path, dotenv_config_debug, dotenv_config_encoding
  Env vars: DOTENV_CONFIG_PATH, DOTENV_CONFIG_DEBUG, DOTENV_CONFIG_ENCODING

9 Troubleshooting
  Debug mode: config({ debug: true }) logs parsing reasons
  Missing variables: verify .env location, correct filename
  React: only REACT_APP_ prefixed vars are injected
  Webpack front-end: install node-polyfill-webpack-plugin or use dotenv-webpack

## Original Source
dotenv – Load Environment Variables from .env
https://github.com/motdotla/dotenv

## Digest of DOTENV

# Install

npm install dotenv --save

Supports yarn add dotenv and bun add dotenv

# Usage

Place .env in project root

In CommonJS:

```js
require('dotenv').config()
console.log(process.env)
```

In ES Modules:

```js
import 'dotenv/config'
```

# Multiline Values

- Native line breaks supported (>= v15.0.0)
- Alternative: use \n sequences in quoted values

# Comments

- Lines starting with # are comments
- Inline comments after value
- Values containing # must be quoted

# Parsing Engine

```js
const dotenv = require('dotenv')
const buf = Buffer.from('KEY=value')
const result = dotenv.parse(buf)
// result => { KEY: 'value' }
```

# Preloading

- Use `node -r dotenv/config script.js`
- CLI options: dotenv_config_path, dotenv_config_debug, dotenv_config_encoding
- Env variables: DOTENV_CONFIG_PATH, DOTENV_CONFIG_DEBUG, DOTENV_CONFIG_ENCODING

# Exposed Functions

- config(options?)
- parse(input, options?)
- populate(target, source, options?)
- decrypt (reserved for dotenvx)

# Config Options

| Option      | Default                             | Description                                                                          |
|-------------|-------------------------------------|--------------------------------------------------------------------------------------|
| path        | path.resolve(process.cwd(), '.env') | File path or array of paths to load                                                 |
| encoding    | 'utf8'                              | File encoding                                                                        |
| debug       | false                               | Enable debug logs                                                                    |
| override    | false                               | Override existing process.env values                                                 |
| processEnv  | process.env                         | Object to assign parsed values to                                                    |

# Parsing Rules

- Empty lines skipped
- Leading and trailing whitespace trimmed for unquoted values
- Single/double quoted values preserve internal whitespace
- Double quotes expand \n
- Backticks supported

# Troubleshooting

- Turn on debug: `require('dotenv').config({ debug: true })`
- Confirm .env file location
- React: prefix vars with REACT_APP_
- Front-end: use node-polyfill-webpack-plugin or dotenv-webpack

_Retrieved: 2024-06-18_


## Attribution
- Source: dotenv – Load Environment Variables from .env
- URL: https://github.com/motdotla/dotenv
- License: License: BSD-2-Clause
- Crawl Date: 2025-05-18T21:25:38.414Z
- Data Size: 636062 bytes
- Links Found: 5061

## Retrieved
2025-05-18
