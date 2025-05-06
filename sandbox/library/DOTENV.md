# DOTENV

## Crawl Summary
Installation commands for npm, yarn, bun. Early import patterns: require('dotenv').config() or import 'dotenv/config'. ConfigOptions defaults: path, encoding utf8, debug false, override false, processEnv process.env. Methods: config(options), parse(input, opt), populate(target, source, opt). .env syntax rules: key=val, empty values, comments, quoting, multiline, backticks. Troubleshooting with debug flag. Best practices on load order and override behavior.

## Normalised Extract
Table of Contents:
1. Installation
2. Initialization
3. Configuration Options
4. API Methods
5. .env File Syntax
6. Troubleshooting
7. Best Practices

1. Installation
  npm install dotenv --save
  yarn add dotenv
  bun add dotenv

2. Initialization
  CommonJS: require('dotenv').config()
  ESM: import 'dotenv/config'
  Preload: node -r dotenv/config script.js

3. Configuration Options
  path: string | string[] - default resolve(process.cwd(),'.env')
  encoding: string - default 'utf8'
  debug: boolean - default false
  override: boolean - default false
  processEnv: object - default process.env

4. API Methods
  config(options?: ConfigOptions): { parsed: Record<string,string>, error?: Error }
  parse(src: string|Buffer, opt?: { debug?: boolean }): Record<string,string>
  populate(target: object, source: Record<string,string>, opt?: { override?: boolean, debug?: boolean }): void

5. .env File Syntax
  KEY=VALUE            simple key/value
  EMPTY=              empty string
  # comment           ignored
  KEY=VAL #cmt        inline comment
  QUOTED="#value"    preserves #
  MULTI="a\n b"     preserves newline
  BACKTICK=`text`      backtick quoted

6. Troubleshooting
  enable debug: require('dotenv').config({ debug: true })
  missing variables: verify .env location and name

7. Best Practices
  Load before any module using process.env
  Use override to supersede existing env
  Combine multiple env files via path array

## Supplementary Details
ConfigOptions:
  path: resolve(process.cwd(),'.env') or override with custom path or array for multiple
  encoding: 'utf8' or custom 'latin1'
  debug: boolean – prints parse/populate logs to stderr
  override: boolean – if true last wins, else first wins or existing processEnv preserved
  processEnv: target object for variables (defaults to process.env)

PopulateOptions:
  override: boolean – if true overwrite target keys
  debug: boolean – log each assignment

ParseOptions:
  debug: boolean – log invalid lines

Supported .env characters:
  Alphanumeric, underscores, hyphens
  Single/double quotes, backticks
  \n sequences

Implementation Steps:
  1. Install package
  2. Create .env file at project root
  3. Call config() before imports
  4. Access process.env.VAR
  5. For parsing custom strings use parse()
  6. For advanced population use populate()


## Reference Details
// API Signatures

interface ConfigOptions {
  path?: string | string[]
  encoding?: string
  debug?: boolean
  override?: boolean
  processEnv?: NodeJS.ProcessEnv | any
}

interface DotenvConfigOutput {
  parsed?: Record<string,string>
  error?: Error
}

interface ParseOptions {
  debug?: boolean
}

interface PopulateOptions {
  override?: boolean
  debug?: boolean
}

// Methods

function config(options?: ConfigOptions): DotenvConfigOutput

function parse(src: string|Buffer, options?: ParseOptions): Record<string,string>

function populate(target: object, source: Record<string,string>, options?: PopulateOptions): void

// Code Examples

// Basic
const result = require('dotenv').config({ path:['.env.local','.env'], override:true })
if(result.error) throw result.error
console.log(result.parsed)

// Custom processEnv
const myEnv = {}
require('dotenv').config({ processEnv: myEnv })
console.log(myEnv.API_KEY)

// Parsing buffer
const dotenv = require('dotenv')
const buf = Buffer.from('FOO=bar')
const out = dotenv.parse(buf, { debug:false })
console.log(out.FOO)

// Populate example
const parsed = { HELLO:'world' }
dotenv.populate(process.env, parsed, { override:true, debug:true })

// ESM Usage Trap
// Correct usage
import 'dotenv/config'
import service from './service.js'

// Preload
// Debug and custom path
DOTENV_CONFIG_PATH=/etc/prod/.env DOTENV_CONFIG_DEBUG=true node -r dotenv/config start.js

// Webpack polyfill
npm install node-polyfill-webpack-plugin

// webpack.config.js snippet
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
module.exports = {
  plugins: [
    new NodePolyfillPlugin(),
    new webpack.DefinePlugin({ 'process.env': JSON.stringify(process.env) })
  ]
}

// Troubleshooting Commands
// Verify load
node -r dotenv/config -e "console.log(process.env.MYVAR)"
// Debug output
node -r dotenv/config script.js dotenv_config_debug=true


## Information Dense Extract
Installation: npm install dotenv; yarn add dotenv; bun add dotenv. Initialization: require('dotenv').config(options?), import 'dotenv/config', preload with -r. ConfigOptions: path:string|array (default .env); encoding:string (utf8); debug:boolean(false); override:boolean(false); processEnv:object(process.env). Methods: config(opts?):{parsed, error?}; parse(string|Buffer, {debug?})=>Record<string,string>; populate(target,source,{override?,debug?})=>void. .env syntax: KEY=val; EMPTY=; #comment; KEY=val #cmt; quoted preserve whitespace/hash; "newline\n" expands newline; backticks support. Usage patterns: call config early; override to supplant existing env; combine multiple env files. Troubleshooting: config({debug:true}); verify .env path; inspect stderr parse logs. Best practices: load before imports; isolate custom processEnv; handle ESM import trap; use preload; polyfill front-end with node-polyfill-webpack-plugin; use definePlugin to inject process.env.

## Sanitised Extract
Table of Contents:
1. Installation
2. Initialization
3. Configuration Options
4. API Methods
5. .env File Syntax
6. Troubleshooting
7. Best Practices

1. Installation
  npm install dotenv --save
  yarn add dotenv
  bun add dotenv

2. Initialization
  CommonJS: require('dotenv').config()
  ESM: import 'dotenv/config'
  Preload: node -r dotenv/config script.js

3. Configuration Options
  path: string | string[] - default resolve(process.cwd(),'.env')
  encoding: string - default 'utf8'
  debug: boolean - default false
  override: boolean - default false
  processEnv: object - default process.env

4. API Methods
  config(options?: ConfigOptions): { parsed: Record<string,string>, error?: Error }
  parse(src: string|Buffer, opt?: { debug?: boolean }): Record<string,string>
  populate(target: object, source: Record<string,string>, opt?: { override?: boolean, debug?: boolean }): void

5. .env File Syntax
  KEY=VALUE            simple key/value
  EMPTY=              empty string
  # comment           ignored
  KEY=VAL #cmt        inline comment
  QUOTED='#value'    preserves #
  MULTI='a'n b'     preserves newline
  BACKTICK='text'      backtick quoted

6. Troubleshooting
  enable debug: require('dotenv').config({ debug: true })
  missing variables: verify .env location and name

7. Best Practices
  Load before any module using process.env
  Use override to supersede existing env
  Combine multiple env files via path array

## Original Source
dotenv – Environment variable loader
https://github.com/motdotla/dotenv

## Digest of DOTENV

# Dotenv Technical Digest

Date Retrieved: 2024-06-24
Source: motdotla/dotenv vX.Y.Z (master)

# Installation

npm install dotenv --save

yarn add dotenv

bun add dotenv

# Basic Usage

Require and configure as early as possible:

require('dotenv').config()

import 'dotenv/config'

# Configuration Options

Interface ConfigOptions:
  path: string | string[] | undefined        default: resolve(process.cwd(), '.env')
  encoding: string                           default: 'utf8'
  debug: boolean                             default: false
  override: boolean                          default: false
  processEnv: NodeJS.ProcessEnv | any        default: process.env

# Methods

## config(options?: ConfigOptions): DotenvConfigOutput
Loads .env files, merges into processEnv, returns { parsed, error? }.

## parse(input: string|Buffer, options?: ParseOptions): Record<string,string>
Parses content string or buffer, returns key/value map.

## populate(target: object, source: object, options?: PopulateOptions): void
Assigns parsed source into target per options override/debug.

# .env File Syntax Rules

BASIC=basic                   -> { BASIC: 'basic' }
EMPTY=                        -> { EMPTY: '' }
COMMENTS:
# comment                  skipped
KEY=value # inline comment  -> KEY: 'value'
Quoted values preserve whitespace and hashes:
SECRET_HASH="val#hash"   -> { SECRET_HASH: 'val#hash' }
Multiline in double quotes expands newlines:
MULTI="line1\nline2"    -> { MULTI: 'line1\nline2' }
Backticks supported:
BACKTICK=`a 'b' "c"`       -> { BACKTICK: "a 'b' \"c\"" }

# Troubleshooting

require('dotenv').config({ debug: true })
Ensure .env path is correct. Inspect console for parse errors.

# Best Practices

Load dotenv before any other import that uses process.env.
Use override flag to force update existing variables.
Use path array to combine multiple files in order.


## Attribution
- Source: dotenv – Environment variable loader
- URL: https://github.com/motdotla/dotenv
- License: License: BSD-2-Clause
- Crawl Date: 2025-05-06T01:59:40.120Z
- Data Size: 1058609 bytes
- Links Found: 6215

## Retrieved
2025-05-06
