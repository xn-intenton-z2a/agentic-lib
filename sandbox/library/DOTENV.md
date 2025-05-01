# DOTENV

## Crawl Summary
Dotenv loads environment variables from a .env file. It supports basic key-value parsing, multiline values, and inline comments. The module provides API functions config, parse, and populate with options such as path (default: process.cwd() + '/.env'), encoding (default: utf8), debug (default: false), override (default: false), and processEnv (default: process.env). Preloading via the -r flag and command line configuration options (dotenv_config_path, dotenv_config_debug, dotenv_config_encoding) are supported. Troubleshooting tips include enabling debug mode and ensuring file location correctness.

## Normalised Extract
TABLE OF CONTENTS:
1. Installation and Setup
2. API Functions
3. Configuration Options
4. Parsing Behavior
5. Multiline and Comment Rules
6. Preloading and Command Line Options
7. Troubleshooting and Best Practices

1. Installation and Setup:
- Install using: npm install dotenv --save, yarn add dotenv, or bun add dotenv.
- Place .env in the root folder; values like S3_BUCKET and SECRET_KEY are defined here.
- Import at the top: require('dotenv').config() or import 'dotenv/config'.

2. API Functions:
- config(options): Reads .env, sets process.env. Returns { parsed: { key: value... } } or error field. Full signature: config(options?: { path?: string, encoding?: string, debug?: boolean, override?: boolean, processEnv?: object }): { parsed?: object, error?: Error }.
- parse(buffer, options): Accepts string or Buffer. Returns an object mapping keys to values. Options: { debug?: boolean }.
- populate(target, source, options): Merges source into target. Options: { debug?: boolean, override?: boolean }.

3. Configuration Options (for config method):
- path: string, default = path.resolve(process.cwd(), '.env')
- encoding: string, default 'utf8'
- debug: boolean, default false
- override: boolean, default false
- processEnv: object, default process.env

4. Parsing Behavior:
- Skips empty lines.
- Lines beginning with # are comments.
- Supports quoted values to preserve whitespace and special characters.

5. Multiline and Comment Rules:
- Multiline values are supported using literal newlines or \n.
- Inline comments are recognized if not within quotes.

6. Preloading and Command Line Options:
- Preload with: node -r dotenv/config your_script.js.
- Command line config parameters: dotenv_config_path, dotenv_config_debug, dotenv_config_encoding.
- Environment variable override: DOTENV_CONFIG_<OPTION>.

7. Troubleshooting and Best Practices:
- Enable debug by setting debug: true or passing DOTENV_CONFIG_DEBUG=true.
- Ensure .env file is in the correct directory.
- For multiple files, pass an array to path; first value wins unless override:true is set.
- For React, prepend variables with REACT_APP_.
- Use dotenvx for encryption, command substitution, and secure file syncing.

## Supplementary Details
Configuration for config(options):
- path: default is path.resolve(process.cwd(), '.env'); use custom path if needed.
- encoding: default 'utf8'; can be set to 'latin1' etc.
- debug: default false; enables logging for troubleshooting.
- override: default false; when true, variables in process.env will be overwritten by .env values.
- processEnv: default process.env; can supply a custom object to populate.

API Specifics:
- config(options): Returns { parsed: object } on success, or { error: Error } on failure. Example: const result = config({ debug: true }); if (result.error) { throw result.error; }.
- parse(buffer, options): Expects buffer in KEY=VAL form. Options include debug.
- populate(target, source, options): Merges keys into target. When override:true, target values are replaced.

Command Line Setup:
- Using preloading: node -r dotenv/config index.js
- Multiple files: config({ path: ['.env.local', '.env'] }) with override flag optionally set.

Troubleshooting:
- If variables are not loaded, ensure .env is in the working directory or provide custom path.
- Use debug:true to print detailed logs.

Best Practices:
- Do not commit .env to VCS.
- Use multiple .env files for different environments: .env, .env.production, etc.
- For secure deployment, consider dotenvx features for encryption and variable substitution.

## Reference Details
API SPECIFICATIONS:
1. dotenv.config(options?)
   Parameters:
   - options: Object with optional properties:
     * path: string, default: path.resolve(process.cwd(), '.env')
     * encoding: string, default: 'utf8'
     * debug: boolean, default: false
     * override: boolean, default: false
     * processEnv: object, default: process.env
   Returns: Object with either { parsed: { [key: string]: string } } or { error: Error }.

2. dotenv.parse(buffer, options?)
   Parameters:
   - buffer: string or Buffer containing environment variable definitions
   - options: object, optional { debug?: boolean }
   Returns: Object { [key: string]: string }

3. dotenv.populate(target, source, options?)
   Parameters:
   - target: object to populate
   - source: object containing key-value pairs
   - options: { override?: boolean, debug?: boolean }, default override: false, debug: false
   Returns: Populated target object.

SDK Method Signatures Examples:

// Example using config:
const result = require('dotenv').config({ path: '/custom/path/.env', encoding: 'latin1', debug: true, override: true });
if (result.error) { throw result.error; } else { console.log(result.parsed); }

// Example using parse:
const dotenv = require('dotenv');
const buf = Buffer.from('BASIC=basic');
const configObj = dotenv.parse(buf, { debug: true });
console.log(typeof configObj, configObj);

// Example using populate:
const target = {};
const source = { HELLO: 'world' };
require('dotenv').populate(target, source, { override: true, debug: true });
console.log(target); // { HELLO: 'world' }

Command Line Preloading Example:
node -r dotenv/config your_script.js

Configuration Options Effects:
- path: Determines file location; if file is not found, no variables are loaded.
- encoding: Specifies file encoding; incorrect encoding may lead to misread values.
- debug: When true, logs parsing details and errors.
- override: If true, existing environment variables are replaced by .env values.
- processEnv: Custom target object for variable assignment.

Troubleshooting Procedures:
1. Enable debug mode:
   require('dotenv').config({ debug: true });
   Expected output: Detailed logs indicating loaded keys and any skipped values.
2. Verify .env file location:
   Ensure file exists in working directory or specify custom path.
3. For React/Webpack issues:
   Use dotenv-webpack or add polyfill plugins if encountering module resolution errors (e.g., crypto, os, path).

Best Practices Implementation:
- Use separate .env files per environment (local, production, ci).
- Encrypt .env files with dotenvx for secure version control.
- Preload configuration through command line to avoid early module instantiation issues.

## Information Dense Extract
Dotenv module; functions: config({ path: string (default: path.resolve(process.cwd(), '.env'), encoding: 'utf8', debug: false, override: false, processEnv: process.env }) -> { parsed?: object, error?: Error }, parse(buffer, { debug?: boolean }) -> object, populate(target, source, { override?: boolean, debug?: boolean }) -> target object. Installation via npm/yarn/bun. Supports multiline values via literal newline or \n. Inline comments stripped based on unquoted '#'. Preload using node -r dotenv/config. Command line options: dotenv_config_path, dotenv_config_debug, dotenv_config_encoding; environment overrides use DOTENV_CONFIG_<OPTION>. Troubleshooting: enable debug mode; check file path; do not commit .env. Best practice: one .env per environment; use dotenvx for encryption and secure syncing.

## Sanitised Extract
TABLE OF CONTENTS:
1. Installation and Setup
2. API Functions
3. Configuration Options
4. Parsing Behavior
5. Multiline and Comment Rules
6. Preloading and Command Line Options
7. Troubleshooting and Best Practices

1. Installation and Setup:
- Install using: npm install dotenv --save, yarn add dotenv, or bun add dotenv.
- Place .env in the root folder; values like S3_BUCKET and SECRET_KEY are defined here.
- Import at the top: require('dotenv').config() or import 'dotenv/config'.

2. API Functions:
- config(options): Reads .env, sets process.env. Returns { parsed: { key: value... } } or error field. Full signature: config(options?: { path?: string, encoding?: string, debug?: boolean, override?: boolean, processEnv?: object }): { parsed?: object, error?: Error }.
- parse(buffer, options): Accepts string or Buffer. Returns an object mapping keys to values. Options: { debug?: boolean }.
- populate(target, source, options): Merges source into target. Options: { debug?: boolean, override?: boolean }.

3. Configuration Options (for config method):
- path: string, default = path.resolve(process.cwd(), '.env')
- encoding: string, default 'utf8'
- debug: boolean, default false
- override: boolean, default false
- processEnv: object, default process.env

4. Parsing Behavior:
- Skips empty lines.
- Lines beginning with # are comments.
- Supports quoted values to preserve whitespace and special characters.

5. Multiline and Comment Rules:
- Multiline values are supported using literal newlines or 'n.
- Inline comments are recognized if not within quotes.

6. Preloading and Command Line Options:
- Preload with: node -r dotenv/config your_script.js.
- Command line config parameters: dotenv_config_path, dotenv_config_debug, dotenv_config_encoding.
- Environment variable override: DOTENV_CONFIG_<OPTION>.

7. Troubleshooting and Best Practices:
- Enable debug by setting debug: true or passing DOTENV_CONFIG_DEBUG=true.
- Ensure .env file is in the correct directory.
- For multiple files, pass an array to path; first value wins unless override:true is set.
- For React, prepend variables with REACT_APP_.
- Use dotenvx for encryption, command substitution, and secure file syncing.

## Original Source
dotenv Configuration Documentation
https://github.com/motdotla/dotenv

## Digest of DOTENV

# DOTENV Documentation Digest

Retrieved: 2023-10-06

# Overview
Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. It follows the twelve-factor app principles by separating configuration from code.

# Installation
- npm install dotenv --save
- yarn add dotenv
- bun add dotenv

# Basic Usage
- Create a .env file in the root folder with key-value pairs:
  S3_BUCKET="YOURS3BUCKET"
  SECRET_KEY="YOURSECRETKEYGOESHERE"
- Import and configure at the top of your application:
  require('dotenv').config();
  // or using ES6
  import 'dotenv/config';

# Multiline and Comment Rules
- Multiline values (>=v15.0.0) are supported: use literal line breaks or \n for newlines.
- Comments start with # unless inside quotes. Inline comments are supported if not in quoted values.

# Parsing Engine
- Parses file content into an object. Ignores empty lines and commented lines.
- Trimming and preserving whitespace based on quoting rules.

# Preloading
- Use command line option: node -r dotenv/config your_script.js
- Configure via command line arguments: dotenv_config_path, dotenv_config_debug, dotenv_config_encoding
- Environment variable configuration uses DOTENV_CONFIG_<OPTION> syntax.

# API Functions
- config(options): Reads and parses .env file, assigns key-values to process.env, returns an object with key "parsed" or an error field.
- parse(buffer, [options]): Accepts a String/Buffer, returns an object mapping keys to values. Options include debug flag.
- populate(target, source, [options]): Populates provided target object with source values. Options: override (default false) and debug (default false).
- decrypt: (Mentioned in documentation for encrypted deployment setups. Use dotenvx for encryption support.)

# Configuration Options
For config():
- path: string, default path.resolve(process.cwd(), '.env')
- encoding: string, default 'utf8'
- debug: boolean, default false
- override: boolean, default false
- processEnv: object, default process.env

# Command Substitution & Variable Expansion
- Use dotenvx for command substitution and advanced variable expansion (dotenv-expand recommended).

# Troubleshooting & Best Practices
- Enable debug mode by setting debug: true or DOTENV_CONFIG_DEBUG=true.
- Do not commit .env files to version control.
- For frameworks like React, ensure environment variables are prepended with REACT_APP_.
- For Docker builds, use docker prebuild hooks.

# Attribution
Data Size: 633850 bytes, 5067 links found. Crawled from https://github.com/motdotla/dotenv

## Attribution
- Source: dotenv Configuration Documentation
- URL: https://github.com/motdotla/dotenv
- License: BSD-2-Clause License
- Crawl Date: 2025-05-01T19:23:12.421Z
- Data Size: 633850 bytes
- Links Found: 5067

## Retrieved
2025-05-01
