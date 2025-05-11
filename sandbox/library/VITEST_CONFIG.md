# VITEST_CONFIG

## Crawl Summary
Installation: npm install -D vitest; Node >=18.0.0; Vite >=5.0.0. Writing tests: use .test or .spec suffix; import {test, expect}; add script "test": "vitest". Config: add `test` property in vite.config.ts or create vitest.config.ts; supports defineConfig, mergeConfig. Core options: include, exclude, globals, environment, alias, coverage.reporter, workspace. CLI flags: --config, --watch, --run, --coverage, --update, --environment, --globals.

## Normalised Extract
Table of Contents
1 Installation & Prerequisites
2 Writing & Running Tests
3 Unified Configuration
4 Separate Config & Merging
5 Workspace Support
6 CLI Options

1 Installation & Prerequisites
• npm install -D vitest
• Node>=18.0.0, Vite>=5.0.0
• Skip install checks: VITEST_SKIP_INSTALL_CHECKS=1

2 Writing & Running Tests
Test file suffix: .test. or .spec. in filename
Example:
  sum.js    export function sum(a, b) { return a + b }
  sum.test.js
    import {test, expect} from 'vitest'
    import {sum} from './sum.js'
    test('adds', () => expect(sum(1,2)).toBe(3))
Add to package.json scripts:
  "scripts": { "test": "vitest", "coverage": "vitest run --coverage" }
Run:
  npm run test  or  vitest run

3 Unified Configuration
In vite.config.ts/js:
  import {defineConfig} from 'vite'
  /// <reference types="vitest/config" />
  export default defineConfig({
    resolve: {alias:{'@':'/src'}},
    test:{
      globals:true,
      environment:'jsdom',
      include:['tests/**/*.test.ts'],
      coverage:{reporter:['text','html']}
    }
  })

4 Separate Config & Merging
Use vitest.config.ts:
  import {defineConfig} from 'vitest/config'
  export default defineConfig({ test:{ include:['src/**/*.test.ts'] } })
Merge with Vite config:
  import {defineConfig, mergeConfig} from 'vitest/config'
  import viteConfig from './vite.config'
  export default defineConfig((env)=> mergeConfig(viteConfig(env), defineConfig({ test:{exclude:['packages/template/*']} })))

5 Workspace Support
  import {defineConfig} from 'vitest/config'
  export default defineConfig({ test:{ workspace:[ 'packages/*', {test:{name:'node',root:'./shared',environment:'node'}} ] } })

6 CLI Options
--config <path>  specify config file
--root <path>    set project root
--dir <path>     base directory for discovery
-w, --watch      enable watch mode
--run            run once, disable watch
--coverage       generate coverage
-u, --update     update snapshots
--environment    node|jsdom|happy-dom|edge-runtime
--globals        enable global API
--port <n>       server port for browser mode
--https          enable HTTPS


## Supplementary Details
• Auto-dependency install can be disabled with VITEST_SKIP_INSTALL_CHECKS=1. • For TypeScript global APIs add in tsconfig.json: { "compilerOptions":{ "types":["vitest/globals"] } }. • For jsdom env types add: "vitest/jsdom". • Coverage config nested under test.coverage; options: exclude, reporter, threshold. • Aliases under resolve.alias and test.alias override. • server.sourcemap: 'inline' | boolean (default 'inline'); server.debug.dumpModules, loadDumpedModules. • deps.external default: [/\/node_modules\//]; deps.inline: [] | true. • deps.optimizer.{mode}.enabled: boolean; include: string[]. • pool: threads|forks|vmThreads|vmForks (default forks). • reporters: built-in or custom path; outputFile maps reporter to path.

## Reference Details
Configuration API:
```ts
import type { UserConfig } from 'vitest/config';
export function defineConfig(config: UserConfig): UserConfig;
export function mergeConfig<T extends UserConfig>(base: T, override: T): T;
```
UserConfig.test property fields:
• include: string[] default ['**/*.{test,spec}.?(c|m)[jt]s?(x)']
• exclude: string[] default ['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**', '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*']
• includeSource: string[] default []
• name: string
• globals: boolean default false
• environment: 'node'|'jsdom'|'happy-dom'|'edge-runtime'|string default 'node'
• alias: Record<string,string> | Array<{find:string|RegExp,replacement:string,customResolver?:any}>
• root: string default cwd
• dir: string default root
• cache: { dir?:string }
• coverage: { reporter?:string[], exclude?:string[], include?:string[], reporterOptions?:Record<string,unknown> }
• watch: boolean default !CI && stdin.isTTY
• update: boolean default false
• reporters: string|string[]|Reporter[] default 'default'
• outputFile: string|Record<string,string>
• clearMocks: boolean default false
• testTimeout: number default 5000
• hooks: { beforeAll?:Function[], afterAll?:Function[], beforeEach?:Function[], afterEach?:Function[] }
• transformMode: 'web'|'ssr'
• pool: 'threads'|'forks'|'vmThreads'|'vmForks' default 'forks'
• workspace: Array<string|{test:Partial<UserConfig>}> default []

CLI Options
```text
vitest [root] [--config <path>] [--run] [--watch] [--coverage] [--update] [--environment <env>] [--globals] [--port <n>] [--https]
``` 

Best Practices:
• Use single config file for Vite and Vitest. • Merge Vite config when needed. • Define tsconfig types for globals. • Use workspace for multi-package monorepos.

Troubleshooting:
1. Missing types: add triple slash or tsconfig types.  
2. CJS named exports error: set deps.interopDefault=true.  
3. Debug transformer: set server.debug.dumpModules=true and load files from cache directory.  
4. CLI unknown flag: upgrade to Vitest v3+.


## Information Dense Extract
Node>=18,Vite>=5; install: npm install -D vitest; use npx vitest. Tests: filename *.test.* or *.spec.*; import {test,expect}; use toBe,toEqual,snapshots. package.json scripts: test=vitest,coverage=vitest run --coverage. Config: add test property in vite.config.ts or vitest.config.ts; fields: include,exclude,globals:boolean,environment:string,alias,coverage:{reporter:string[];exclude:string[]},workspace:Array<string|{test:PartialConfig}>. defineConfig(config:UserConfig). mergeConfig(base,override). CLI flags: --config:string, --root:string, --dir:string, --watch:boolean, --run, --coverage, --update, --environment:string, --globals, --port:number, --https. Default patterns: include ['**/*.{test,spec}.?(c|m)[jt]s?(x)'], exclude ['**/node_modules/**','**/dist/**',...]. server.sourcemap:inline|boolean; server.debug.dumpModules:boolean; deps.external: [/\/node_modules\//]; deps.inline:string[]|true; deps.optimizer.{mode}.enabled:boolean. pool:threads|forks|vmThreads|vmForks(default forks). reporters:'default'|string[]|custom; outputFile:string|Record<string,string>. environmentTag: @vitest-environment jsdom/happy-dom. VITEST_SKIP_INSTALL_CHECKS=1 disables prompts.

## Sanitised Extract
Table of Contents
1 Installation & Prerequisites
2 Writing & Running Tests
3 Unified Configuration
4 Separate Config & Merging
5 Workspace Support
6 CLI Options

1 Installation & Prerequisites
 npm install -D vitest
 Node>=18.0.0, Vite>=5.0.0
 Skip install checks: VITEST_SKIP_INSTALL_CHECKS=1

2 Writing & Running Tests
Test file suffix: .test. or .spec. in filename
Example:
  sum.js    export function sum(a, b) { return a + b }
  sum.test.js
    import {test, expect} from 'vitest'
    import {sum} from './sum.js'
    test('adds', () => expect(sum(1,2)).toBe(3))
Add to package.json scripts:
  'scripts': { 'test': 'vitest', 'coverage': 'vitest run --coverage' }
Run:
  npm run test  or  vitest run

3 Unified Configuration
In vite.config.ts/js:
  import {defineConfig} from 'vite'
  /// <reference types='vitest/config' />
  export default defineConfig({
    resolve: {alias:{'@':'/src'}},
    test:{
      globals:true,
      environment:'jsdom',
      include:['tests/**/*.test.ts'],
      coverage:{reporter:['text','html']}
    }
  })

4 Separate Config & Merging
Use vitest.config.ts:
  import {defineConfig} from 'vitest/config'
  export default defineConfig({ test:{ include:['src/**/*.test.ts'] } })
Merge with Vite config:
  import {defineConfig, mergeConfig} from 'vitest/config'
  import viteConfig from './vite.config'
  export default defineConfig((env)=> mergeConfig(viteConfig(env), defineConfig({ test:{exclude:['packages/template/*']} })))

5 Workspace Support
  import {defineConfig} from 'vitest/config'
  export default defineConfig({ test:{ workspace:[ 'packages/*', {test:{name:'node',root:'./shared',environment:'node'}} ] } })

6 CLI Options
--config <path>  specify config file
--root <path>    set project root
--dir <path>     base directory for discovery
-w, --watch      enable watch mode
--run            run once, disable watch
--coverage       generate coverage
-u, --update     update snapshots
--environment    node|jsdom|happy-dom|edge-runtime
--globals        enable global API
--port <n>       server port for browser mode
--https          enable HTTPS

## Original Source
Vitest Testing Framework
https://vitest.dev

## Digest of VITEST_CONFIG

# Getting Started

## Prerequisites

• Node.js ≥ 18.0.0
• Vite ≥ 5.0.0

## Installation

```bash
npm install -D vitest
# or yarn add -D vitest
# or pnpm add -D vitest
# or bun add -D vitest
```  
Vitest can also be run ad-hoc via npx or pnpm npx vitest.  
Set `VITEST_SKIP_INSTALL_CHECKS=1` to disable auto-dependency prompts.

# Writing Tests

Create source module: `sum.js`
```js
export function sum(a, b) {
  return a + b
}
```
Create test file `sum.test.js` or `sum.spec.js`:
```js
import { test, expect } from 'vitest'
import { sum } from './sum.js'

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})
``` 
Default file name patterns: **/*.test.[cm]?[jt]s?(x), **/*.spec.[cm]?[jt]s?(x).

Add script to `package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage"
  }
}
```
Run:
```
npm run test
# or yarn test
# or pnpm test
```  
To run once: `vitest run`.

# Configuration

## Using vite.config.js/ts

Vitest reads top-level `test` property in same file as Vite config:
```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: { alias: { '@': '/src' } },
  plugins: [],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
    coverage: { reporter: ['text', 'html'] }
  }
})
```

## Separate vitest.config.ts

Highest priority. Same extensions as Vite (`.js`, `.mjs`, `.cjs`, `.ts`, `.cts`, `.mts`).
```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: { include: ['src/**/*.test.ts'] }
})
```
Merge with Vite config:
```ts
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig((env) =>
  mergeConfig(viteConfig(env), defineConfig({
    test: { exclude: ['packages/template/*'] }
  }))
)
```

# Workspaces

```ts
export default defineConfig({
  test: {
    workspace: [
      'packages/*',
      { test: { name: 'node', root: './shared', environment: 'node' } }
    ]
  }
})
```

# Command Line Interface

| Flag              | Type        | Default      | Description                                |
| ----------------- | ----------- | ------------ | ------------------------------------------ |
| --config <path>   | string      | vite.config  | Path to config file                        |
| --root <path>     | string      | cwd          | Project root dir                           |
| --dir <path>      | string      | root         | Base directory to scan test files         |
| --watch, -w       | boolean     | TTY & ¬CI    | Watch mode                                 |
| --run             | boolean     | false        | Run tests once, disable watch              |
| --coverage        | boolean     | false        | Generate coverage report                   |
| --update, -u      | boolean     | false        | Update snapshots                           |
| --environment     | string      | "node"      | Test environment: node, jsdom, happy-dom   |
| --globals         | boolean     | false        | Enable global APIs                         |
| --port            | number      | 51204        | Dev server port for browser mode           |
| --https           | boolean     | false        | Enable HTTPS for browser mode              |


## Attribution
- Source: Vitest Testing Framework
- URL: https://vitest.dev
- License: License: MIT License
- Crawl Date: 2025-05-11T04:57:50.803Z
- Data Size: 19474492 bytes
- Links Found: 18331

## Retrieved
2025-05-11
