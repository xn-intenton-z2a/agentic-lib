# VITEST

## Crawl Summary
Vitest is a next generation testing framework powered by Vite, supporting ESM, TypeScript, and JSX. Key technical details include installation methods (npm, yarn, pnpm, bun), usage with npx, writing tests using Vitest's `expect` and `test` APIs, configuration through both Vite and dedicated vitest.config files, workspace configurations for monorepos, and a rich CLI with options such as --config, --coverage, --watch, etc. Detailed configuration options include spec definitions for test file inclusion/exclusion, server configurations (sourcemap, debug, deps), dependency optimization parameters, environment settings, and pool options for running tests.

## Normalised Extract
## Table of Contents
1. Installation
2. Writing Tests
3. Configuration
   - Configuring via Vite and vitest.config
   - Merging Configurations
4. Workspaces
5. Command Line Interface
6. Automatic Dependency Installation
7. IDE Integrations
8. Detailed Configuration Options
9. Troubleshooting & Best Practices

## 1. Installation
- Use the following commands to install Vitest:
  - npm: `npm install -D vitest`
  - yarn: `yarn add -D vitest`
  - pnpm: `pnpm add -D vitest`
  - bun: `bun add -D vitest`

## 2. Writing Tests
- Create test files ending with `.test.js` or `.spec.js`.
- Example:

  sum.js:
  ```js
  export function sum(a, b) {
    return a + b;
  }
  ```

  sum.test.js:
  ```js
  import { expect, test } from 'vitest';
  import { sum } from './sum.js';

  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
  ```

- Add test script in package.json:
  ```json
  {
    "scripts": {
      "test": "vitest"
    }
  }
  ```

## 3. Configuration
### Configuring via Vite and vitest.config
- Vitest automatically reads `vite.config.*` files. For different configurations during tests, create a `vitest.config.ts`:

  ```ts
  import { defineConfig } from 'vitest/config';

  export default defineConfig({
    test: {
      // Test-specific options
    },
  });
  ```

- To use Vite's configuration, add a triple slash directive:

  ```ts
  /// <reference types="vitest/config" />
  import { defineConfig } from 'vite';

  export default defineConfig({
    test: {
      // ... Specify options here.
    },
  });
  ```

### Merging Configurations
- Merge Vite and Vitest configurations using `mergeConfig`:

  ```ts
  import { defineConfig, mergeConfig } from 'vitest/config';
  import viteConfig from './vite.config.mjs';

  export default mergeConfig(viteConfig, defineConfig({
    test: {
      // ...
    },
  }));
  ```

## 4. Workspaces
- Define a `vitest.workspace.ts` for multi-config projects:

  ```ts
  import { defineWorkspace } from 'vitest/config';

  export default defineWorkspace([
    'packages/*',
    'tests/*/vitest.config.{e2e,unit}.ts',
    {
      test: {
        name: 'happy-dom',
        root: './shared_tests',
        environment: 'happy-dom',
        setupFiles: ['./setup.happy-dom.ts'],
      },
    },
    {
      test: {
        name: 'node',
        root: './shared_tests',
        environment: 'node',
        setupFiles: ['./setup.node.ts'],
      },
    },
  ]);
  ```

## 5. Command Line Interface
- Basic commands:
  - `vitest` (watch mode)
  - `vitest run` (single execution)
  - Use flags like `--config`, `--coverage`, `--watch`, `--port`, `--https`.

- Example npm scripts:

  ```json
  {
    "scripts": {
      "test": "vitest",
      "coverage": "vitest run --coverage"
    }
  }
  ```

## 6. Automatic Dependency Installation
- Vitest checks and prompts for missing dependencies. Disable with:

  ```sh
  export VITEST_SKIP_INSTALL_CHECKS=1
  ```

## 7. IDE Integrations
- Official VS Code extension available in the VS Code Marketplace for enhanced experience.

## 8. Detailed Configuration Options
- **include**: string[] (Default: ["**/*.{test,spec}.?(c|m)[jt]s?(x)"])
- **exclude**: string[] (Default: ["**/node_modules/**", "**/dist/**", ...])
- **includeSource**: string[] (Default: [])
- **name**: string (Custom test project name)
- **server**: Object with options such as:
  - `sourcemap`: 'inline' | boolean (Default: 'inline')
  - `debug`: { dumpModules: boolean | string, loadDumppedModules: boolean }
  - `deps`: { external: (string|RegExp)[], inline: (string|RegExp)[] | true, fallbackCJS: boolean, cacheDir: string }
- **environment**: 'node' | 'jsdom' | 'happy-dom' | 'edge-runtime' | string (Default: 'node')
- **globals**: boolean (Default: false)
- **pool**: 'threads' | 'forks' | 'vmThreads' | 'vmForks' (Default: 'forks')
- **update**: boolean (Default: false) [Updates snapshot files]
- **watch**: boolean (Default: !process.env.CI)

## 9. Troubleshooting & Best Practices
- Running tests without watch: `vitest run`
- For configuration issues, pass `--config ./path/to/vitest.config.ts` to override defaults.
- If using Bun, use `bun run test` instead of `bun test`.
- Debug module transformation issues by enabling `server.debug.dumpModules` and reviewing the dumped files.


## Supplementary Details
### Technical Specifications and Implementation Details

1. **Installation and Setup**
   - Minimum requirements: Vite >= v5.0.0, Node >= v18.0.0.
   - Installation commands provided for npm, yarn, pnpm, bun.
   - Direct execution via npx: `npx vitest`.

2. **Writing Tests**
   - Tests file naming convention: must include `.test.` or `.spec.` in filenames.
   - Use of Vitest's core API:
     - `import { test, expect } from 'vitest';`
   - Example provided for function testing.

3. **Configuration Options**
   - Options set within the `test` property in config files:
     - `include`: Glob pattern for tests.
     - `exclude`: Default exclusion patterns: node_modules, dist, etc.
     - `server`: Detailed configuration for inline source maps, debugging, dependency resolution:
       > Example:
       > ```ts
       > server: {
       >   sourcemap: 'inline',
       >   debug: { dumpModules: true, loadDumppedModules: false },
       >   deps: { external: [/\/node_modules\//], inline: [], fallbackCJS: false, cacheDir: 'node_modules/.vite' }
       > }
       > ```
   - Environment configuration allowing override via file docblock comments (@vitest-environment, @jest-environment).

4. **Command Line Interface**
   - CLI scripts for watch mode and single run.
   - Use of flags for customization, e.g., `--config`, `--coverage`, `--port`.

5. **Workspaces Support**
   - Allow multiple configurations in a single project.
   - Use glob patterns or explicit configurations in `vitest.workspace.ts`.

6. **Dependency Optimization**
   - `deps` configuration: Externalizing node_modules, inlining modules, CJS fallback mechanisms.
   - Optimizer settings that mirror Vite's optimizeDeps.

7. **Troubleshooting Procedures**
   - Run `vitest --help` for full list of CLI options.
   - If encountering module resolution errors, check the `server.deps` settings.
   - For snapshot issues, use `--update` to refresh outdated snapshots.

8. **Best Practices**
   - Use a unified configuration file for both Vitest and Vite to avoid conflicts.
   - Merge configurations properly if using separate files.
   - Utilize environment-specific configurations for testing browser-like behavior via jsdom or happy-dom.
   - Include comprehensive CLI scripts in package.json for consistency.


## Reference Details
### Complete API Specifications and SDK Method Signatures

1. **Vitest Core APIs**
   - Test Declaration:
     ```ts
     test(name: string, fn: () => void | Promise<void>): void;
     ```
   - Expect API:
     ```ts
     expect<T>(value: T): Expect<T>;
     // Example assertion:
     expect(sum(1,2)).toBe(3);
     ```

2. **Configuration API (vitest/config)**
   - Import and define configuration:
     ```ts
     import { defineConfig } from 'vitest/config';

     export default defineConfig({
       test: {
         include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
         exclude: ['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**', '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*'],
         globals: false,
         environment: 'node',
         server: {
           sourcemap: 'inline',
           debug: {
             dumpModules: true,
             loadDumppedModules: false
           },
           deps: {
             external: [/\/node_modules\//],
             inline: [],
             fallbackCJS: false,
             cacheDir: 'node_modules/.vite'
           }
         },
         pool: 'forks',
         watch: !process.env.CI,
         update: false
       }
     });
     ```

3. **CLI Usage and Flags**
   - Default npm scripts:
     ```json
     {
       "scripts": {
         "test": "vitest",
         "coverage": "vitest run --coverage"
       }
     }
     ```
   - Common CLI commands:
     - `vitest` : Runs in watch mode
     - `vitest run` : Executes tests once
     - `vitest --help` : Lists all available options
     - `vitest --config ./path/to/vitest.config.ts` : Specifies a custom configuration file

4. **Code Examples and Best Practices**
   - **Test Example**:
     ```js
     // sum.js
     export function sum(a, b) {
       return a + b;
     }
     
     // sum.test.js
     import { test, expect } from 'vitest';
     import { sum } from './sum.js';
     
     test('adds 1 + 2 to equal 3', () => {
       expect(sum(1, 2)).toBe(3);
     });
     ```

   - **Configuration Merging Example**:
     ```ts
     import { defineConfig, mergeConfig } from 'vitest/config';
     import viteConfig from './vite.config.mjs';

     export default mergeConfig(viteConfig, defineConfig({
       test: {
         exclude: ['packages/template/*'],
       },
     }));
     ```

5. **Troubleshooting**
   - For dependency related errors, verify the settings in `server.deps` and adjust inline/external rules.
   - To update snapshots use:
     ```sh
     vitest --update
     ```
   - Debug transformation issues by enabling module dumps:
     ```ts
     server: {
       debug: { dumpModules: true }
     }
     ```

6. **Additional Notes on Environments**
   - Define environment in a test file using a docblock:
     ```js
     /**
      * @vitest-environment jsdom
      */
     test('DOM test', () => {
       const div = document.createElement('div');
       expect(div).not.toBeNull();
     });
     ```
   - For TypeScript, add to tsconfig.json:
     ```json
     {
       "compilerOptions": {
         "types": ["vitest/globals"]
       }
     }
     ```


## Original Source
Vitest Testing Framework Documentation
https://vitest.dev/

## Digest of VITEST

# Vitest Testing Framework Documentation

**Retrieved Date:** 2023-10-12

# Overview
Vitest is a Vite-native, next-generation testing framework. It provides out-of-the-box support for ESM, TypeScript and JSX through esbuild. Vitest can be used with Vite configuration files and supports both local and CLI usage. It allows for features like smart & instant watch mode, jest compatibility with built-in functions (expect, snapshot, coverage) and automatic dependency installation.

# Getting Started

## Installation
To add Vitest to your project:

```sh
# Using npm
npm install -D vitest

# Using yarn
yarn add -D vitest

# Using pnpm
pnpm add -D vitest

# Using bun
bun add -D vitest
```

*TIP: Vitest requires Vite >= v5.0.0 and Node >= v18.0.0.*

Additionally, you can run Vitest directly with:

```sh
npx vitest
```

## Writing Tests

Example to test a sum function:

*sum.js*
```js
export function sum(a, b) {
  return a + b;
}
```

*sum.test.js*
```js
import { expect, test } from 'vitest';
import { sum } from './sum.js';

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

In your package.json, add the test script:

```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

Run tests using your package manager:

```sh
npm run test
# or
yarn test
# or
pnpm test
```

# Configuring Vitest

Vitest leverages Vite's unified configuration. If a vite.config.[js|ts|mjs|cjs|mts|cts] file is present, Vitest will pick up the plugins and settings. For separate configuration during testing, you may create a `vitest.config.ts` file.

Example Vitest config:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Specify test options here, e.g., include, exclude, watch
  },
});
```

Alternatively, if using an existing vite.config file, add a reference directive:

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    // ... Specify options here.
  },
});
```

If you decide to keep separate Vite and Vitest config files, ensure to merge the Vite options using `mergeConfig`:

```ts
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.mjs';

export default mergeConfig(viteConfig, defineConfig({
  test: {
    // ... Vitest specific options
  },
}));
```

# Workspaces Support

Vitest supports workspaces to run different project configurations within a monorepo. Define a `vitest.workspace.ts` file with either glob patterns or explicit configurations.

Example:

```ts
import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'packages/*',
  'tests/*/vitest.config.{e2e,unit}.ts',
  {
    test: {
      name: 'happy-dom',
      root: './shared_tests',
      environment: 'happy-dom',
      setupFiles: ['./setup.happy-dom.ts'],
    }
  },
  {
    test: {
      name: 'node',
      root: './shared_tests',
      environment: 'node',
      setupFiles: ['./setup.node.ts'],
    }
  }
]);
```

# Command Line Interface (CLI)

You can invoke Vitest from the terminal using the vitest binary or via npx. Common CLI commands include:

- `vitest`: Start in watch mode.
- `vitest run`: run tests a single time.
- Additional options such as `--config`, `--coverage`, `--watch`, `--port`, `--https` are available.

Example npm scripts:

```json
{
  "scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage"
  }
}
```

Running without watch mode:

```sh
vitest run
```

# Automatic Dependency Installation

Vitest checks for required dependencies and will prompt installation if missing. You can disable this check with:

```sh
export VITEST_SKIP_INSTALL_CHECKS=1
```

# IDE Integrations

Vitest provides an official Visual Studio Code extension to enhance the testing workflow. Install it from the VS Code Marketplace.

# Detailed Configuration Options

Below is a summary of key configuration options available in Vitest. The configuration is provided under the `test` property in the config file:

| Option                      | Type                                                    | Default                                                 | Effect |
|-----------------------------|---------------------------------------------------------|---------------------------------------------------------|--------|
| include                     | string[]                                                | ['**/*.{test,spec}.?(c|m)[jt]s?(x)']                       | Glob patterns to include test files |
| exclude                     | string[]                                                | ['**/node_modules/**', '**/dist/**', ...]                | Glob patterns to exclude from tests |
| includeSource               | string[]                                                | []                                                      | In-source test globs |
| name                        | string                                                  | (none)                                                  | Custom project name |
| server                      | Object (sourcemap, debug, deps)                         | See below                                               | Vite-Node server options |
| environment                 | 'node' \| 'jsdom' \| 'happy-dom' \| 'edge-runtime' \| string | 'node'                                      | Defines test environment |
| globals                     | boolean                                                 | false                                                   | Enable Jest-like global APIs |
| pool                        | 'threads' \| 'forks' \| 'vmThreads' \| 'vmForks'      | 'forks'                                                 | Processes tests using different pooling systems |
| update                      | boolean                                                 | false                                                 | Updates snapshot files |
| watch                       | boolean                                                 | !process.env.CI                                        | Enable watch mode |

For server options, example:

```ts
server: {
  sourcemap: 'inline',
  debug: {
    dumpModules: true,
    loadDumppedModules: false,
  },
  deps: {
    external: [/\/node_modules\//],
    inline: [],
    fallbackCJS: false,
    cacheDir: 'node_modules/.vite'
  }
}
```

# Troubleshooting & Best Practices

- Use the `--config` flag to troubleshoot configuration issues:

  ```sh
  vitest --config ./path/to/vitest.config.ts
  ```

- Enable verbose logging if tests fail unexpectedly.
- If using Bun as your package manager, run tests with:

  ```sh
  bun run test
  ```

- For dependency issues, review the `deps` options and adjust `inline` and `external` settings as necessary.

- For debugging module transformation issues, review the `server.debug.dumpModules` settings to write the transformed modules to disk.

# Attribution

*Data Size during crawl: 39367577 bytes, Links Found: 25982, No Errors Found.*


## Attribution
- Source: Vitest Testing Framework Documentation
- URL: https://vitest.dev/
- License: License: MIT
- Crawl Date: 2025-04-17T19:31:16.705Z
- Data Size: 39367577 bytes
- Links Found: 25982

## Retrieved
2025-04-17
