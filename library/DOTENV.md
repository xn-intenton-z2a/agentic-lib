# DOTENV

## Crawl Summary
Dotenv loads .env file values into process.env with zero dependencies. Technical specifications include installation commands (npm, yarn, bun), usage patterns (require('dotenv').config() / import 'dotenv/config'), support for multiline variables (direct or using \n), inline and block comments, and advanced parsing with Buffer support. It provides CLI preloading via --require, configuration via CLI/environment variables (dotenv_config_path, dotenv_config_encoding, debug, override), variable expansion via dotenv-expand, and secure environment management using dotenvx. Key API functions include config, parse, populate, and decrypt with detailed configuration options and troubleshooting commands.

## Normalised Extract
# Table of Contents
1. Installation
   - npm, yarn, bun commands
2. Usage
   - CommonJS and ES6 import examples
3. Multiline Values
   - Direct line break syntax and \n syntax
4. Comments
   - Inline and standalone comments with examples
5. Parsing
   - Using parse() with Buffer and String inputs
6. Preload & CLI Options
   - Using node -r dotenv/config and CLI configuration (dotenv_config_*)
7. Variable Expansion & Command Substitution
   - dotenv-expand usage and command substitution example
8. Syncing & Multiple Environments
   - Using dotenvx for encryption, multiple .env files, and deployment
9. API Functions
   - config(), parse(), populate(), decrypt()
10. Troubleshooting
   - Debug mode, file location, Webpack polyfills

---

## 1. Installation
Commands:
- npm: `npm install dotenv --save`
- yarn: `yarn add dotenv`
- bun: `bun add dotenv`

## 2. Usage
CommonJS:
```js
require('dotenv').config();
```
ES6:
```js
import 'dotenv/config';
```

## 3. Multiline Values
Example with direct line breaks:
```env
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----"
```
Alternative using \n characters:
```env
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nKh9NV...\n-----END RSA PRIVATE KEY-----\n"
```

## 4. Comments
Example:
```env
# Comment line
SECRET_KEY=YOURSECRETKEYGOESHERE  # Inline comment
```

## 5. Parsing
Example using Buffer:
```js
const buf = Buffer.from('BASIC=basic');
const config = require('dotenv').parse(buf);
console.log(config); // { BASIC: 'basic' }
```

## 6. Preload & CLI Options
Preloading:
```bash
node -r dotenv/config your_script.js
```
CLI configuration:
```bash
node -r dotenv/config your_script.js dotenv_config_path=/custom/path/to/.env dotenv_config_debug=true
```

## 7. Variable Expansion & Command Substitution
Using dotenv-expand:
```js
const myEnv = require('dotenv').config();
require('dotenv-expand')(myEnv);
```
Command substitution within .env:
```env
DATABASE_URL="postgres://$(whoami)@localhost/my_database"
```

## 8. Syncing & Multiple Environments
Using dotenvx for:
- Generating encrypted .env files
- Managing .env.production, .env.local

Example:
```bash
dotenvx run --env-file=.env.local --env-file=.env -- node index.js
```

## 9. API Functions
- **config(options?)**: Reads .env, sets process.env, returns `{ parsed, error }`.
- **parse(source, options?)**: Parses a string or buffer into an object.
- **populate(target, source, options?)**: Populates target with parsed env values.
- **decrypt()**: Decrypts encrypted env files (via dotenvx).

## 10. Troubleshooting
- Enable debug: `require('dotenv').config({ debug: true });`
- Check file location
- For Webpack issues, use node-polyfill-webpack-plugin or dotenv-webpack.


## Supplementary Details
Configuration Options for config():
- path: string | string[] (Default: path.resolve(process.cwd(), '.env'))
- encoding: string (Default: 'utf8')
- debug: boolean (Default: false)
- override: boolean (Default: false)
- processEnv: object (Default: process.env)

Implementation Details:
1. Installation commands: npm, yarn, bun.
2. Usage requires early loading; for ES6 use import 'dotenv/config'.
3. Multiline variables: support direct newlines or explicit '\n'.
4. Comment parsing: Comments start with '#' unless quoted.
5. Parsing function accepts String or Buffer. Example:
   const config = dotenv.parse(Buffer.from('KEY=val'));
6. Preload via CLI with --require option minimizes code modifications.
7. Variable expansion handled via external package dotenv-expand.
8. For secure syncing and multi-environment management, use dotenvx commands for encryption and environment file sequencing.
9. Best practices include not committing the .env file and using debug modes for troubleshooting.

Troubleshooting Procedures:
- If variables do not load, verify file location and use `debug: true`.
- For front-end issues with Webpack, add node-polyfill-webpack-plugin and configure DefinePlugin.
- To prevent accidental commits, use pre-commit hooks with dotenvx.

Exact Code Samples:
```js
// config example
const result = require('dotenv').config({ path: '/custom/path/.env', override: true });
if (result.error) { throw result.error; }
console.log(result.parsed);

// parse example
const buf = Buffer.from('BASIC=basic');
const parsed = require('dotenv').parse(buf, { debug: true });
console.log(parsed);

// populate example
const target = {};
const source = { HELLO: 'world' };
require('dotenv').populate(target, source, { override: true, debug: true });
console.log(target);
```

## Reference Details
**API Specifications and SDK Method Signatures**

1. config(options?: {
     path?: string | string[];    // custom file path(s), default: path.resolve(process.cwd(), '.env')
     encoding?: string;             // file encoding, default: 'utf8'
     debug?: boolean;               // debug mode, default: false
     override?: boolean;            // whether to override existing process.env, default: false
     processEnv?: object;           // target object for variables, default: process.env
   }): { parsed?: { [key: string]: string }, error?: Error }

   Example:
   ```js
   const result = require('dotenv').config({ path: '/custom/.env', override: true });
   if (result.error) { throw result.error; }
   console.log(result.parsed);
   ```

2. parse(source: string | Buffer, options?: { debug?: boolean }): { [key: string]: string }

   Example:
   ```js
   const buf = Buffer.from('KEY=value');
   const config = require('dotenv').parse(buf, { debug: true });
   console.log(config); // { KEY: 'value' }
   ```

3. populate(target: object, source: object, options?: { override?: boolean; debug?: boolean }): void

   Example:
   ```js
   const target = {};
   const source = { HELLO: 'world' };
   require('dotenv').populate(target, source, { override: true, debug: true });
   console.log(target); // { HELLO: 'world' }
   ```

4. decrypt(...): Functionality provided via dotenvx for decrypting encrypted .env files.

**Full Code Example with Comments:**

```js
// Load and parse .env file with custom options
const dotenv = require('dotenv');

// Configuration: override existing env variables using custom .env file
const result = dotenv.config({
  path: '/custom/path/to/.env', // default: path.resolve(process.cwd(), '.env')
  encoding: 'utf8',            // default
  debug: false,                // default
  override: true               // last value wins if duplicate exists
});
if (result.error) {
  throw result.error;
}
console.log('Parsed env:', result.parsed);

// Parsing from a Buffer
const buf = Buffer.from('BASIC=basic');
const parsedConfig = dotenv.parse(buf, { debug: true });
console.log('Parsed from buffer:', parsedConfig);

// Populate: merging new values into target object
const targetEnv = {};
dotenv.populate(targetEnv, { HELLO: 'universe' }, { override: true, debug: true });
console.log('Populated target:', targetEnv);
```

**CLI and Preload Usage:**

- Preload using node CLI:
  ```bash
  node -r dotenv/config your_script.js
  ```
- Set CLI configuration options:
  ```bash
  node -r dotenv/config your_script.js dotenv_config_path=/custom/path/to/.env dotenv_config_debug=true
  ```

**Troubleshooting Commands:**

- Enable debug logging:
  ```js
  require('dotenv').config({ debug: true });
  ```
- For Webpack front-end issues:
  ```bash
  npm install node-polyfill-webpack-plugin
  ```
  and modify webpack.config.js accordingly.

**Best Practices:**

- Do not commit your .env file.
- Use separate .env files per environment (e.g. .env.production, .env.local).
- Use dotenvx for encryption and secure syncing of environment variables.


## Information Dense Extract
Install: npm install dotenv; Usage: require('dotenv').config() or import 'dotenv/config'; Functions: config({path: string|array, encoding: 'utf8', debug: false, override: false, processEnv: process.env}) returns {parsed, error}, parse(source: string|Buffer, {debug}) returns object, populate(target, source, {override, debug}) merges objects; Multiline support: direct newlines or \n notation; Comments: '#' denotes comment unless in quotes; Preload via CLI: node -r dotenv/config; CLI config via dotenv_config_path, dotenv_config_debug, dotenv_config_encoding; Troubleshooting: enable debug, check file location, use polyfills for Webpack; Best practices: do not commit .env, use dotenvx for encryption and environment management.

## Escaped Extract
# Table of Contents
1. Installation
   - npm, yarn, bun commands
2. Usage
   - CommonJS and ES6 import examples
3. Multiline Values
   - Direct line break syntax and 'n syntax
4. Comments
   - Inline and standalone comments with examples
5. Parsing
   - Using parse() with Buffer and String inputs
6. Preload & CLI Options
   - Using node -r dotenv/config and CLI configuration (dotenv_config_*)
7. Variable Expansion & Command Substitution
   - dotenv-expand usage and command substitution example
8. Syncing & Multiple Environments
   - Using dotenvx for encryption, multiple .env files, and deployment
9. API Functions
   - config(), parse(), populate(), decrypt()
10. Troubleshooting
   - Debug mode, file location, Webpack polyfills

---

## 1. Installation
Commands:
- npm: 'npm install dotenv --save'
- yarn: 'yarn add dotenv'
- bun: 'bun add dotenv'

## 2. Usage
CommonJS:
'''js
require('dotenv').config();
'''
ES6:
'''js
import 'dotenv/config';
'''

## 3. Multiline Values
Example with direct line breaks:
'''env
PRIVATE_KEY='-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----'
'''
Alternative using 'n characters:
'''env
PRIVATE_KEY='-----BEGIN RSA PRIVATE KEY-----'nKh9NV...'n-----END RSA PRIVATE KEY-----'n'
'''

## 4. Comments
Example:
'''env
# Comment line
SECRET_KEY=YOURSECRETKEYGOESHERE  # Inline comment
'''

## 5. Parsing
Example using Buffer:
'''js
const buf = Buffer.from('BASIC=basic');
const config = require('dotenv').parse(buf);
console.log(config); // { BASIC: 'basic' }
'''

## 6. Preload & CLI Options
Preloading:
'''bash
node -r dotenv/config your_script.js
'''
CLI configuration:
'''bash
node -r dotenv/config your_script.js dotenv_config_path=/custom/path/to/.env dotenv_config_debug=true
'''

## 7. Variable Expansion & Command Substitution
Using dotenv-expand:
'''js
const myEnv = require('dotenv').config();
require('dotenv-expand')(myEnv);
'''
Command substitution within .env:
'''env
DATABASE_URL='postgres://$(whoami)@localhost/my_database'
'''

## 8. Syncing & Multiple Environments
Using dotenvx for:
- Generating encrypted .env files
- Managing .env.production, .env.local

Example:
'''bash
dotenvx run --env-file=.env.local --env-file=.env -- node index.js
'''

## 9. API Functions
- **config(options?)**: Reads .env, sets process.env, returns '{ parsed, error }'.
- **parse(source, options?)**: Parses a string or buffer into an object.
- **populate(target, source, options?)**: Populates target with parsed env values.
- **decrypt()**: Decrypts encrypted env files (via dotenvx).

## 10. Troubleshooting
- Enable debug: 'require('dotenv').config({ debug: true });'
- Check file location
- For Webpack issues, use node-polyfill-webpack-plugin or dotenv-webpack.

## Original Source
dotenv Documentation
https://github.com/motdotla/dotenv

## Digest of DOTENV

# DOTENV DOCUMENTATION

Content retrieved on: 2023-10-05

## Overview
Dotenv is a zero-dependency Node.js module that loads environment variables from a `.env` file into `process.env`. It adheres to the Twelve-Factor App methodology by separating configuration from code.

## Installation

- Install using npm:
  ```bash
  npm install dotenv --save
  ```
- Install using yarn:
  ```bash
  yarn add dotenv
  ```
- Install using bun:
  ```bash
  bun add dotenv
  ```

## Usage

1. Create a `.env` file in the root directory:
   ```env
   S3_BUCKET="YOURS3BUCKET"
   SECRET_KEY="YOURSECRETKEYGOESHERE"
   ```
2. Configure dotenv early in your application:
   - CommonJS:
     ```js
     require('dotenv').config();
     console.log(process.env);
     ```
   - ES6:
     ```js
     import 'dotenv/config';
     ```
3. Example usage in AWS SDK:
   ```js
   require('dotenv').config();
   s3.getBucketCors({ Bucket: process.env.S3_BUCKET }, function(err, data) {});
   ```

## Multiline Values

- Direct line breaks (>= v15.0.0):
  ```env
  PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
  ...
  Kh9NV...
  ...
  -----END RSA PRIVATE KEY-----"
  ```
- Using double quotes with `\n`:
  ```env
  PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nKh9NV...\n-----END RSA PRIVATE KEY-----\n"
  ```

## Comments

- Standalone or inline comments are supported. Wrap values containing `#` in quotes.
  ```env
  # This is a comment
  SECRET_KEY=YOURSECRETKEYGOESHERE # inline comment
  SECRET_HASH="something-with-a-#-hash"
  ```

## Parsing

- Use the `parse` function to convert a String or Buffer to an object:
  ```js
  const dotenv = require('dotenv');
  const buf = Buffer.from('BASIC=basic');
  const config = dotenv.parse(buf);
  console.log(typeof config, config); // { BASIC: 'basic' }
  ```

## Preload & Command Line Options

- Preload dotenv using `--require`:
  ```bash
  node -r dotenv/config your_script.js
  ```
- Set configuration via CLI arguments (e.g., custom path, debug, encoding):
  ```bash
  node -r dotenv/config your_script.js dotenv_config_path=/custom/path/to/.env dotenv_config_debug=true
  ```
- Alternatively, use environment variables for configuration:
  ```bash
  DOTENV_CONFIG_ENCODING=latin1 DOTENV_CONFIG_DEBUG=true node -r dotenv/config your_script.js dotenv_config_path=/custom/path/to/.env
  ```

## Variable Expansion & Command Substitution

- For variable expansion, use `dotenv-expand`:
  ```js
  const dotenv = require('dotenv');
  const dotenvExpand = require('dotenv-expand');
  const myEnv = dotenv.config();
  dotenvExpand(myEnv);
  ```
- Command substitution with dotenvx (embed command output in a variable):
  ```env
  DATABASE_URL="postgres://$(whoami)@localhost/my_database"
  ```
  And run with:
  ```bash
  dotenvx run --debug -- node index.js
  ```

## Syncing, Multiple Environments & Deploying

- Use dotenvx for:
  - Encrypting and syncing `.env` files
  - Managing multiple environments (e.g., `.env.production`, `.env.local`)
  - Command example for multiple .env files:
    ```bash
    dotenvx run --env-file=.env.local --env-file=.env -- node index.js
    ```
- Deploying with encryption:
  ```bash
  dotenvx set HELLO Production --encrypt -f .env.production
  DOTENV_PRIVATE_KEY_PRODUCTION="<.env.production private key>" dotenvx run -- node index.js
  ```

## API Functions & Configuration Options

### config()

- Reads and parses the `.env` file, populates `process.env`, and returns an object.
- Options:
  - `path`: (Default: `path.resolve(process.cwd(), '.env')`) Specify custom file path.
  - `encoding`: (Default: `utf8`) File encoding.
  - `debug`: (Default: `false`) Enables debug logging.
  - `override`: (Default: `false`) Override existing environment variables.
  - `processEnv`: (Default: `process.env`) Target object for variables.

Example:
```js
const result = require('dotenv').config({ path: '/custom/path/to/.env', override: true });
if (result.error) { throw result.error; }
console.log(result.parsed);
```

### parse()

- Accepts a String or Buffer and returns an object of key-value pairs.
- Option:
  - `debug`: (Default: `false`) Logs parsing issues.

Example:
```js
const buf = Buffer.from('BASIC=basic');
const config = require('dotenv').parse(buf, { debug: true });
console.log(config);
```

### populate()

- Populates environment variables into a given target object.
- Options:
  - `override`: (Default: `false`) Override existing keys.
  - `debug`: (Default: `false`) Enable debug logging.

Example:
```js
const target = {};
const parsed = { HELLO: 'world' };
require('dotenv').populate(target, parsed, { override: true, debug: true });
console.log(target);
```

### decrypt()

- (Functionality for decrypting encrypted environment files, used in conjunction with dotenvx.)

## Troubleshooting & Best Practices

- Ensure the `.env` file is in the correct directory (usually the current working directory).
- Use debug mode to diagnose issues:
  ```js
  require('dotenv').config({ debug: true });
  ```
- Do not commit your `.env` file to version control.
- For front-end projects with Webpack, consider using polyfills or `dotenv-webpack` to resolve missing Node.js modules such as `crypto`, `os`, or `path`.

## Attribution & Data Size

- Data Size: 716399 bytes
- Links Found: 5559
- Retrieved from: https://github.com/motdotla/dotenv


## Attribution
- Source: dotenv Documentation
- URL: https://github.com/motdotla/dotenv
- License: License: MIT License
- Crawl Date: 2025-04-22T01:54:37.526Z
- Data Size: 716399 bytes
- Links Found: 5559

## Retrieved
2025-04-22
