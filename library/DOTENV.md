# DOTENV

## Crawl Summary
Installation commands, usage instructions for loading environment variables from a .env file into process.env, details on multiline values, comments, parsing, preloading, variable expansion, command substitution using dotenvx, syncing multiple environments, deployment with encryption, and complete API details for the four functions: config, parse, populate, and decrypt.

## Normalised Extract
## Table of Contents
1. Installation
2. Usage
3. Multiline Values
4. Comments
5. Parsing
6. Preloading
7. Variable Expansion & Command Substitution
8. Syncing and Multiple Environments
9. Deploying & Encryption
10. API Functions
11. Troubleshooting

### 1. Installation
- npm: `npm install dotenv --save`
- yarn: `yarn add dotenv`
- bun: `bun add dotenv`

### 2. Usage
- Create a `.env` file with key-value pairs.
- Load configuration by: 
  - CommonJS: `require('dotenv').config()`
  - ES6: `import 'dotenv/config'`

### 3. Multiline Values
- Direct line breaks supported (>= v15.0.0) and alternative using \n escape.

### 4. Comments
- Lines starting with `#` are ignored. Inline comments require quoting if value contains `#`.

### 5. Parsing
- Use `dotenv.parse(Buffer.from('KEY=val'))` to generate an object.

### 6. Preloading
- Preload with the command: `node -r dotenv/config your_script.js`
- Configure using environment variables or CLI arguments (e.g., `dotenv_config_path` and `dotenv_config_debug`).

### 7. Variable Expansion & Command Substitution
- Expand variables with `dotenv-expand`.
- Use `dotenvx` for command substitution in your `.env` file.

### 8. Syncing and Multiple Environments
- Manage multiple files (.env.production, .env.local) and sync them using dotenvx.

### 9. Deploying & Encryption
- Encrypt .env files with `--encrypt` flag using dotenvx, and deploy with a decryption key provided in environment variables.

### 10. API Functions
- **config(options)**: Reads and parses the .env file to process.env. Options: path, encoding, debug, override, processEnv.
- **parse(src, options?)**: Parses a string/Buffer to an object; option for debug logging.
- **populate(target, source, options?)**: Populates target with source object values; options for override and debug.
- **decrypt**: Decrypts encrypted environment files (via dotenvx integration).

### 11. Troubleshooting
- Enable debug mode to output errors (`{ debug: true }`).
- For React, preface environment variables with REACT_APP_.
- For missing modules in Webpack, use `node-polyfill-webpack-plugin` or `dotenv-webpack`.


## Supplementary Details
### Configuration Options for config()
- path: string, default = path.resolve(process.cwd(), '.env')
- encoding: string, default = 'utf8'
- debug: boolean, default = false
- override: boolean, default = false
- processEnv: object, default = process.env

### Implementation Steps
1. Create .env file with key-value pairs.
2. Import and run `require('dotenv').config(options)` at the start of your application.
3. Validate that process.env contains the loaded values.

### Example Code Snippet for Population

```javascript
const dotenv = require('dotenv');
const parsed = { HELLO: 'world' };

// Option 1: Populate process.env
dotenv.populate(process.env, parsed);
console.log(process.env.HELLO); // 'world'

// Option 2: Populate a custom object with override enabled
const target = { HELLO: 'world' };
dotenv.populate(target, { HELLO: 'universe' }, { override: true, debug: true });
console.log(target); // { HELLO: 'universe' }
```

### Command Line Preloading

```bash
node -r dotenv/config your_script.js
```

Pass configuration via CLI:

```bash
node -r dotenv/config your_script.js dotenv_config_path=/custom/path/to/.env dotenv_config_debug=true
```

### Troubleshooting Commands

Enable debug mode:

```javascript
require('dotenv').config({ debug: true });
```

For Webpack issues, install polyfill:

```bash
npm install node-polyfill-webpack-plugin
```

And configure in webpack.config.js accordingly.


## Reference Details
## API Specifications

### config(options?)

- **Signature:**
  ```javascript
  function config(options?: {
    path?: string,        // Default: path.resolve(process.cwd(), '.env')
    encoding?: string,    // Default: 'utf8'
    debug?: boolean,      // Default: false
    override?: boolean,   // Default: false
    processEnv?: Object   // Default: process.env
  }): { parsed?: { [key: string]: string }, error?: Error }
  ```

- **Example:**
  ```javascript
  const result = require('dotenv').config({
    path: '/custom/path/to/.env',
    encoding: 'latin1',
    debug: true,
    override: true
  });

  if (result.error) {
    throw result.error;
  }
  console.log(result.parsed);
  ```

### parse(src, options?)

- **Signature:**
  ```javascript
  function parse(src: string | Buffer, options?: { debug?: boolean }): { [key: string]: string }
  ```

- **Example:**
  ```javascript
  const dotenv = require('dotenv');
  const buf = Buffer.from('BASIC=basic');
  const config = dotenv.parse(buf, { debug: true });
  console.log(typeof config, config); // { BASIC: 'basic' }
  ```

### populate(target, source, options?)

- **Signature:**
  ```javascript
  function populate(target: { [key: string]: any }, source: { [key: string]: string }, options?: { override?: boolean, debug?: boolean }): void
  ```

- **Example:**
  ```javascript
  const dotenv = require('dotenv');
  const parsed = { HELLO: 'world' };

  // Populate process.env directly
  dotenv.populate(process.env, parsed);
  console.log(process.env.HELLO); // world

  // Populate a custom target with override
  const target = { HELLO: 'world' };
  dotenv.populate(target, { HELLO: 'universe' }, { override: true, debug: true });
  console.log(target); // { HELLO: 'universe' }
  ```

### decrypt (Integration with dotenvx)

- **Note:** The decrypt function is provided when using dotenvx for encrypted environment files. 

- **Usage Example:**
  ```bash
  DOTENV_PRIVATE_KEY_PRODUCTION="<.env.production private key>" dotenvx run -- node index.js
  ```

## Best Practices

- Do not commit your .env file to version control.
- Use different .env files for different environments (.env.development, .env.production).
- Enable debug mode if environment variables are not loading as expected.
- When using dotenv with ES6 modules, preload with `import 'dotenv/config'` to avoid issues with module execution order.

## Detailed Troubleshooting Procedures

1. Verify the .env file exists in the correct directory (usually the project's root).
2. Enable debugging:
   ```javascript
   require('dotenv').config({ debug: true });
   ```
   Inspect logs for errors in key-value parsing.
3. For React/Webpack issues, ensure a proper polyfill is installed:
   ```bash
   npm install node-polyfill-webpack-plugin
   ```
   And update your webpack.config.js accordingly.
4. If variables are not being overridden as expected, pass `override: true` in the options:
   ```javascript
   require('dotenv').config({ override: true });
   ```
5. For encryption issues using dotenvx, ensure the decryption key is correctly set in the environment variable (e.g., DOTENV_PRIVATE_KEY_PRODUCTION).


## Original Source
dotenv Documentation
https://github.com/motdotla/dotenv

## Digest of DOTENV

# DOTENV Documentation

Retrieved: 2023-10-05

## Installation

- Install via npm:

  ```bash
  npm install dotenv --save
  ```

- Alternative package managers:

  ```bash
  yarn add dotenv
  # or
  bun add dotenv
  ```

## Usage (.env Setup)

1. Create a file named `.env` in the root of your project (or in the same folder where your application process is run).

   Example `.env` file:

   ```dotenv
   S3_BUCKET="YOURS3BUCKET"
   SECRET_KEY="YOURSECRETKEYGOESHERE"
   ```

2. Import and configure dotenv as early as possible in your application:

   CommonJS:

   ```javascript
   require('dotenv').config();
   console.log(process.env); // Remove after confirmation
   ```

   ES6:

   ```javascript
   import 'dotenv/config';
   ```

   After configuration, `process.env` contains all keys and values defined in your `.env` file.

## Multiline Values

- For multiline values (>= v15.0.0), you can include line breaks directly:

  ```dotenv
  PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
  ...
  Kh9NV...
  ...
  -----END RSA PRIVATE KEY-----"
  ```

- Alternatively, use the \n escape character:

  ```dotenv
  PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nKh9NV...\n-----END RSA PRIVATE KEY-----\n"
  ```

## Comments

- Comments can be on their own line or inline. Wrap values containing the `#` character in quotes:

  ```dotenv
  # This is a comment
  SECRET_KEY=YOURSECRETKEYGOESHERE # comment
  SECRET_HASH="something-with-a-#-hash"
  ```

## Parsing

- Use the parsing engine to convert a string or Buffer into an object:

  ```javascript
  const dotenv = require('dotenv');
  const buf = Buffer.from('BASIC=basic');
  const config = dotenv.parse(buf);
  console.log(typeof config, config); // object { BASIC: 'basic' }
  ```

## Preloading

- You can preload dotenv so that you do not explicitly require it in your code:

  ```bash
  node -r dotenv/config your_script.js
  ```

- Command line configuration options can be passed using the format `dotenv_config_<option>=value`:

  ```bash
  node -r dotenv/config your_script.js dotenv_config_path=/custom/path/to/.env dotenv_config_debug=true
  ```

- Alternatively, environment variables can be used:

  ```bash
  DOTENV_CONFIG_ENCODING=latin1 DOTENV_CONFIG_DEBUG=true node -r dotenv/config your_script.js dotenv_config_path=/custom/path/to/.env
  ```

## Variable Expansion & Command Substitution

- Variable Expansion: Use `dotenv-expand` to add the value of one variable into another.

- Command Substitution: Use `dotenvx` to substitute command output directly into variables within your `.env` file.

  Example in `.env` file:

  ```dotenv
  DATABASE_URL="postgres://$(whoami)@localhost/my_database"
  ```

  In your JavaScript code:

  ```javascript
  console.log('DATABASE_URL', process.env.DATABASE_URL);
  ```

  Execute using:

  ```bash
  dotenvx run --debug -- node index.js
  ```

## Syncing and Multiple Environments

- To keep `.env` files in sync or to manage multiple environments, consider using `dotenvx`.

- Example for multiple environments:

  ```bash
  echo "HELLO=production" > .env.production
  echo "console.log('Hello ' + process.env.HELLO)" > index.js
  dotenvx run --env-file=.env.production -- node index.js
  ```

- For using multiple .env files:

  ```bash
  echo "HELLO=local" > .env.local
  echo "HELLO=World" > .env
  echo "console.log('Hello ' + process.env.HELLO)" > index.js
  dotenvx run --env-file=.env.local --env-file=.env -- node index.js
  ```

## Deploying and Encryption

- Encrypt your `.env` file with the following command:

  ```bash
  dotenvx set HELLO Production --encrypt -f .env.production
  ```

- Run your script using the decryption key:

  ```bash
  DOTENV_PRIVATE_KEY_PRODUCTION="<.env.production private key>" dotenvx run -- node index.js
  ```

## API Functions

Dotenv exposes four main functions:

### config

- Loads the .env file into `process.env` and returns an object with the key `parsed` or an `error` if it fails.

  **Signature:**

  ```javascript
  function config(options?: {
    path?: string,           // Default: path.resolve(process.cwd(), '.env')
    encoding?: string,       // Default: 'utf8'
    debug?: boolean,         // Default: false
    override?: boolean,      // Default: false
    processEnv?: Object      // Default: process.env
  }): { parsed?: Object, error?: Error }
  ```

- **Example:**

  ```javascript
  const result = require('dotenv').config({
    path: '/custom/path/to/.env',
    encoding: 'latin1',
    debug: process.env.DEBUG,
    override: true
  });

  if (result.error) {
    throw result.error;
  }

  console.log(result.parsed);
  ```

### parse

- Parses a provided string or Buffer into an object.

  **Signature:**

  ```javascript
  function parse(src: string | Buffer, options?: { debug?: boolean }): Object
  ```

- **Example:**

  ```javascript
  const dotenv = require('dotenv');
  const buf = Buffer.from('BASIC=basic');
  const config = dotenv.parse(buf, { debug: true });
  console.log(typeof config, config);
  ```

### populate

- Populates a target object with parsed key-value pairs from a source object.

  **Signature:**

  ```javascript
  function populate(target: Object, source: Object, options?: { override?: boolean, debug?: boolean }): void
  ```

- **Example:**

  ```javascript
  const dotenv = require('dotenv');
  const parsed = { HELLO: 'world' };
  
  // Populating process.env:
  dotenv.populate(process.env, parsed);
  console.log(process.env.HELLO); // world
  
  // Populating a custom target with override enabled:
  const target = { HELLO: 'world' };
  dotenv.populate(target, { HELLO: 'universe' }, { override: true, debug: true });
  console.log(target); // { HELLO: 'universe' }
  ```

### decrypt

- Exposed function for decryption purposes when working with encrypted environment files (used by dotenvx).

  (No detailed signature provided in the documentation; see dotenvx for implementation.)

## Troubleshooting

- **.env file not loading:**

  Ensure the file is in the correct directory. Enable debug logging:

  ```javascript
  require('dotenv').config({ debug: true });
  ```

  This will output helpful error messages.

- **React and process.env:**

  When using React with Webpack, ensure that variables are injected via bundler configuration. For create-react-app, prefix variables with `REACT_APP_`.

- **Module not found (crypto|os|path):**

  Install polyfills for Webpack < 5:

  ```bash
  npm install node-polyfill-webpack-plugin
  ```

  And configure `webpack.config.js`:

  ```javascript
  const path = require('path');
  const webpack = require('webpack');
  const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

  module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new NodePolyfillPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          HELLO: JSON.stringify(process.env.HELLO)
        }
      }),
    ],
  };
  ```

## Attribution

- Data Size: 621779 bytes
- Retrieved from: https://github.com/motdotla/dotenv
- Crawled Links: 5053

---


## Attribution
- Source: dotenv Documentation
- URL: https://github.com/motdotla/dotenv
- License: License: MIT
- Crawl Date: 2025-04-17T16:11:25.633Z
- Data Size: 621779 bytes
- Links Found: 5053

## Retrieved
2025-04-17
