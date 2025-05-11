# VITEST_CONFIG

## Crawl Summary
Installation: npm/yarn/pnpm install -D vitest; requires Vite>=5, Node>=18. Writing tests: .test/.spec file naming. CLI: vitest[ run] [--config,--root,--dir,--watch,--run,--update,-u,--environment, --globals, --coverage,--port,--https,--reporter,--outputFile]. Config: unified with Vite; defineConfig({ test: { include,exclude,includeSource,name,root,dir,globals,environment,alias,deps.external,deps.inline,deps.moduleDirectories,runner,watch,update,reporters,outputFile,coverage } }). Supported config file extensions: js,mjs,cjs,ts,cts,mts. Workspaces: workspace: [glob|string|object]. Watch default: interactive. Snapshot update: -u. Node env by default. Alias merging with resolve.alias. Globals off by default. Automatic dependency installation prompts; disable via VITEST_SKIP_INSTALL_CHECKS=1.

## Normalised Extract
Table of Contents:
1. Installation
2. Writing Tests
3. CLI Usage
4. Config File Setup
5. Config Options
6. Workspaces
7. Debugging

1. Installation
- Requirements: Vite>=5.0.0, Node>=18.0.0
- Commands:
  npm install -D vitest
  yarn add -D vitest
  pnpm add -D vitest
  bun add -D vitest

2. Writing Tests
- File suffix must include .test. or .spec.
- Example:
  export function sum(a: number,b: number): number{return a+b}
  import {expect,test} from 'vitest'
  test('adds',()=>{expect(sum(1,2)).toBe(3)})
- package.json scripts:
  "test":"vitest"

3. CLI Usage
vitest [--config <file>] [--root <path>] [--dir <path>] [--watch] [--run] [-u] [--environment <env>] [--globals] [--coverage] [--reporter <name>] [--outputFile.<type>=<path>] [--port <n>] [--https]

4. Config File Setup
- Supported files: vite.config.{js,mjs,cjs,ts,cts,mts} or vitest.config.{js,mjs,cjs,ts,cts,mts}
- Vite unified config:
  import {defineConfig} from 'vite';
  /// <reference types="vitest/config" />
  export default defineConfig({test:{...}})
- Separate config:
  import {defineConfig} from 'vitest/config';
  export default defineConfig({test:{...}})

5. Config Options
- include: string[] default ['**/*.{test,spec}.?(c|m)[jt]s?(x)']
- exclude: string[] default ['**/node_modules/**','**/dist/**',...]
- includeSource: string[] default []
- globals: boolean default false
- environment: 'node'|'jsdom'|'happy-dom'|'edge-runtime' default 'node'
- alias: Record<string,string>
- deps.external: Array<string|RegExp> default [/\/node_modules\//]
- deps.inline: Array<string|RegExp>|true default []
- deps.moduleDirectories: string[] default ['node_modules']
- runner: string default 'node'
- watch: boolean default interactive
- update: boolean default false
- reporters: Array<string|object> default ['default']
- outputFile: string|Record<string,string>
- coverage.enabled: boolean default false
- coverage.include/exclude: string[] defaults []

6. Workspaces
- test.workspace: Array<string|object>
- Glob entries or objects: {test:{name,root,environment,setupFiles}}
- Allows multiple configurations in one process

7. Debugging
- server.debug.dumpModules: boolean|string
- server.debug.loadDumppedModules: boolean
- Example:
  test:{server:{debug:{dumpModules:'./tmp',loadDumppedModules:true}}}
- Disable auto install checks: set VITEST_SKIP_INSTALL_CHECKS=1

## Supplementary Details
• defineConfig signature:
  function defineConfig(config: UserConfig<TestOptions>): UserConfig<TestOptions>

• mergeConfig signature:
  function mergeConfig(base: UserConfig, override: UserConfig): UserConfig

• CLI exit codes: 0 success, 1 failures, 2 configuration error

• Environments:
  jsdom: JSDOM instance exposes global jsdom. Types via 'vitest/jsdom'. Default options: {}
  happy-dom: Node-like browser; default options: {}
  edge-runtime: V8 isolate, no DOM; default options: {}
  custom: load 'vitest-environment-<name>' package exporting {name,transformMode,setup}

• Automatic dependency prompts: ENV VITEST_SKIP_INSTALL_CHECKS=1

• Snapshot update:
  vitest -u or vitest --update
  Deletes obsolete and updates changed snapshots



## Reference Details
### Complete CLI Options
--config <string>              path to config file
--root <string>                project root
--dir <string>                 test discovery base dir
--watch, -w                    boolean default true interactive
--run                          boolean default false
--update, -u                   boolean default false
--environment <string>         node|jsdom|happy-dom|edge-runtime default node
--globals                      boolean default false
--coverage                     boolean default false
--port <number>                for browser mode
--https                        boolean default false
--reporter <string>            built-in: default,verbose,junit,json,html
--outputFile.<type>=<string>   type=json|html|junit path
--help                         list options

### defineConfig UserConfig<TestOptions>
interface TestOptions {
  include?: string[]
  exclude?: string[]
  includeSource?: string[]
  name?: string
  root?: string
  dir?: string
  globals?: boolean
  environment?: string
  environmentOptions?: Record<string,unknown>
  alias?: Record<string,string> | Array<{find:string|RegExp;replacement:string;}>
  server?: {sourcemap?:boolean|'inline'; deps?:{external?:Array<string|RegExp>;inline?:Array<string|RegExp>|true;moduleDirectories?:string[];fallbackCJS?:boolean;cacheDir?:string;};debug?:{dumpModules?:boolean|string;loadDumppedModules?:boolean;};}
  deps?: {optimizer?:{ssr?:{include?:string[];exclude?:string[];enabled?:boolean};web?:{include?:string[];exclude?:string[];transformAssets?:boolean;transformCss?:boolean;transformGlobPattern?:RegExp|RegExp[];enabled?:boolean}};external?:Array<string|RegExp>;inline?:Array<string|RegExp>|true;fallbackCJS?:boolean;moduleDirectories?:string[];cacheDir?:string;}
  runner?: string
  watch?: boolean
  update?: boolean
  reporters?: Array<string|object>
  outputFile?: string | Record<string,string>
  coverage?: {enabled?:boolean;reportsDirectory?:string;exclude?:string[];include?:string[]}
  workspace?: Array<string | {test: Partial<TestOptions> & {extends?:boolean}}>
}

### Code Examples
1. Merge Vite and Vitest configs:
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'
export default mergeConfig(viteConfig, defineConfig({test:{exclude:['packages/template/*']}}))

2. Custom environment loader:
export default <Environment>{
  name:'custom',
  transformMode:'ssr',
  setup(){ return {teardown(){}} }
}

### Troubleshooting
1. CJS interop errors:
Error: Named export 'x' not found
Set deps.interopDefault=true

2. Debug dumped modules:
Add server.debug.dumpModules='./tmp', loadDumppedModules=true
Inspect generated files in ./tmp

3. Skip installation checks:
export VITEST_SKIP_INSTALL_CHECKS=1

4. Force dependency rebundling:
deps.optimizer.[mode].force=true



## Information Dense Extract
install: npm|yarn|pnpm|bun add -D vitest; requires Vite>=5, Node>=18;
test naming: file.{test,spec}.{js,ts,jsx,tsx,mjs,cjs};
run: vitest [--config file][--root path][--dir path][--watch/-w][--run][--update/-u][--environment env][--globals][--coverage][--reporter name][--outputFile.<type>=path][--port num][--https];
config via vite.config or vitest.config: defineConfig({test:{include,exclude,includeSource,name,root,dir,globals,environment,alias,deps:{external,inline,moduleDirectories,fallbackCJS,cacheDir,optimizer:{web,ssr}},server:{sourcemap,debug:{dumpModules,loadDumppedModules}},runner,watch,update,reporters,outputFile,coverage:{enabled,include,exclude,reportsDirectory},workspace}});
defaults: include ['**/*.{test,spec}.?(c|m)[jt]s?(x)'], exclude ['**/node_modules/**','**/dist/**',...], globals false, environment 'node', runner 'node', watch interactive, update false, reporters ['default'];
workspace supports globs and objects; mergeConfig(base,override);
environments built-in: node,jsdom,happy-dom,edge-runtime,custom via vitest-environment-<name>;
debug: server.debug.dumpModules, loadDumppedModules;
skip prompts: VITEST_SKIP_INSTALL_CHECKS=1;
CJS interop: deps.interopDefault=true.


## Sanitised Extract
Table of Contents:
1. Installation
2. Writing Tests
3. CLI Usage
4. Config File Setup
5. Config Options
6. Workspaces
7. Debugging

1. Installation
- Requirements: Vite>=5.0.0, Node>=18.0.0
- Commands:
  npm install -D vitest
  yarn add -D vitest
  pnpm add -D vitest
  bun add -D vitest

2. Writing Tests
- File suffix must include .test. or .spec.
- Example:
  export function sum(a: number,b: number): number{return a+b}
  import {expect,test} from 'vitest'
  test('adds',()=>{expect(sum(1,2)).toBe(3)})
- package.json scripts:
  'test':'vitest'

3. CLI Usage
vitest [--config <file>] [--root <path>] [--dir <path>] [--watch] [--run] [-u] [--environment <env>] [--globals] [--coverage] [--reporter <name>] [--outputFile.<type>=<path>] [--port <n>] [--https]

4. Config File Setup
- Supported files: vite.config.{js,mjs,cjs,ts,cts,mts} or vitest.config.{js,mjs,cjs,ts,cts,mts}
- Vite unified config:
  import {defineConfig} from 'vite';
  /// <reference types='vitest/config' />
  export default defineConfig({test:{...}})
- Separate config:
  import {defineConfig} from 'vitest/config';
  export default defineConfig({test:{...}})

5. Config Options
- include: string[] default ['**/*.{test,spec}.?(c|m)[jt]s?(x)']
- exclude: string[] default ['**/node_modules/**','**/dist/**',...]
- includeSource: string[] default []
- globals: boolean default false
- environment: 'node'|'jsdom'|'happy-dom'|'edge-runtime' default 'node'
- alias: Record<string,string>
- deps.external: Array<string|RegExp> default [/'/node_modules'//]
- deps.inline: Array<string|RegExp>|true default []
- deps.moduleDirectories: string[] default ['node_modules']
- runner: string default 'node'
- watch: boolean default interactive
- update: boolean default false
- reporters: Array<string|object> default ['default']
- outputFile: string|Record<string,string>
- coverage.enabled: boolean default false
- coverage.include/exclude: string[] defaults []

6. Workspaces
- test.workspace: Array<string|object>
- Glob entries or objects: {test:{name,root,environment,setupFiles}}
- Allows multiple configurations in one process

7. Debugging
- server.debug.dumpModules: boolean|string
- server.debug.loadDumppedModules: boolean
- Example:
  test:{server:{debug:{dumpModules:'./tmp',loadDumppedModules:true}}}
- Disable auto install checks: set VITEST_SKIP_INSTALL_CHECKS=1

## Original Source
Vitest Testing Framework
https://vitest.dev

## Digest of VITEST_CONFIG

# Vitest Configuration and Usage Reference

**Retrieved on:** 2024-06-19

## 1. Installation Requirements

• Vite >= 5.0.0

• Node.js >= 18.0.0

• Install command examples:

  npm install -D vitest
  yarn add -D vitest
  pnpm add -D vitest
  bun add -D vitest


## 2. Writing and Running Tests

**sum.js**
export function sum(a: number, b: number): number {
  return a + b
}

**sum.test.js**
import { expect, test } from 'vitest'
import { sum } from './sum.js'

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})

Add to package.json scripts:
  "scripts": { "test": "vitest" }
Run:
  npm run test
  yarn test
  pnpm test
  bun run test  (for Bun users)


## 3. Command Line Interface

vitest [options]
vitest run --coverage

**Common Flags**
--config <path>         path to vitest config file
--root <path>           project root directory
--dir <path>            base directory to scan for tests
--watch, -w             boolean, default true iff interactive
--run, --no-watch       run once without watching
--update, -u            update snapshots, default false
--environment <env>     node | jsdom | happy-dom | edge-runtime, default node
--globals               boolean, default false
--coverage              collect coverage
--port <number>         serve port for browser mode
--https                 use HTTPS for browser mode
--reporter <name>       built-in or custom reporter, default default
--outputFile.<type>=<path> write report to file


## 4. Configuration Files

### 4.1 vite.config.[js|ts]
import { defineConfig } from 'vite'
/// <reference types="vitest/config" />
export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    globals: false,
    environment: 'node',
    root: './',
    dir: './',
    watch: !process.env.CI && process.stdin.isTTY,
    update: false,
    reporters: ['default'],
    outputFile: { json: './results.json' },
    coverage: {
      enabled: true,
      reportsDirectory: 'coverage',
      include: ['src/**/*.ts'],
      exclude: ['**/*.d.ts']
    },
    deps: {
      inline: [],
      external: [/node_modules/],
      moduleDirectories: ['node_modules']
    }
  }
})

### 4.2 vitest.config.ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    includeSource: [],
    alias: { '@': '/src' },
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    workspace: [
      'packages/*',
      { test: { name: 'node', root: './shared', environment: 'node' } }
    ]
  }
})


## 5. Configuration Options Reference

| Option                  | Type                | Default                                                         | Description                              |
|-------------------------|---------------------|-----------------------------------------------------------------|------------------------------------------|
| include                 | string[]            | ['**/*.{test,spec}.?(c|m)[jt]s?(x)']                            | Glob patterns for test files            |
| exclude                 | string[]            | ['**/node_modules/**','**/dist/**', ...]                       | Glob patterns to exclude                |
| includeSource           | string[]            | []                                                              | Glob patterns for in-source tests       |
| name                    | string              | undefined                                                       | Custom project name                     |
| root                    | string              | process.cwd()                                                  | Project root directory                  |
| dir                     | string              | same as root                                                   | Base dir to scan for tests              |
| globals                 | boolean             | false                                                           | Enable global APIs                      |
| environment             | string              | 'node'                                                          | Test environment                         |
| environmentOptions      | Record<string,unknown> | {}                                                            | Options passed to environment setup     |
| alias                   | Record<string,string> | {}                                                           | Custom module resolution aliases        |
| deps.external           | Array<string|RegExp> | [/\/node_modules\//]                                         | Dependencies to externalize             |
| deps.inline             | Array<string|RegExp> 
|                         | []                                                              | Dependencies to inline                  |
| deps.moduleDirectories  | string[]            | ['node_modules']                                               | Additional module directories           |
| runner                  | string              | 'node' or 'benchmark'                                         | Custom runner                           |
| watch                   | boolean             | true when interactive, false in CI                             | Watch mode                              |
| update                  | boolean             | false                                                          | Snapshot update                         |
| reporters               | Array<string|object> | ['default']                                                   | Output reporters                        |
| outputFile              | string or Record    | undefined                                                      | File path(s) for reporter output        |
| coverage.enabled        | boolean             | false                                                          | Enable coverage                         |
| coverage.include        | string[]            | []                                                             | Coverage include patterns               |
| coverage.exclude        | string[]            | []                                                             | Coverage exclude patterns               |


## 6. Workspaces Support

Configure multiple test projects in one process:

vitest.config.ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    workspace: [
      'packages/*',
      { test: { name: 'unit', environment: 'jsdom', setupFiles: ['./unit.setup.ts'] } },
      { test: { name: 'e2e', environment: 'node', dir: 'tests/e2e' } }
    ]
  }
})


## 7. Troubleshooting and Best Practices

### 7.1 Module Debugging

Use server.debug:

in vitest.config.ts:
  test: { server: { debug: { dumpModules: './tmp', loadDumppedModules: true } } }

Run tests and inspect dumped modules in ./tmp to trace transformations.

### 7.2 Dependency Issues

To disable automatic install prompts:
ENV VITEST_SKIP_INSTALL_CHECKS=1

### 7.3 Common Errors

Error: Named export 'x' not found
Cause: importing CJS without interopDefault
Fix: set deps.interopDefault to true in config



## Attribution
- Source: Vitest Testing Framework
- URL: https://vitest.dev
- License: License: MIT License
- Crawl Date: 2025-05-11T06:57:48.514Z
- Data Size: 25406638 bytes
- Links Found: 21691

## Retrieved
2025-05-11
