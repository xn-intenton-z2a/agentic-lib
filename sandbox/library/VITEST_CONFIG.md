# VITEST_CONFIG

## Crawl Summary
Installation: npm|yarn|pnpm add -D vitest (requires Vite>=5.0.0, Node>=18.0.0). Test files: default include '**/*.{test,spec}.?(c|m)[jt]s?(x)'; in-source tests via includeSource. CLI: vitest [--config, --globals, -u, -w, --environment, --coverage, --reporter, --outputFile, --pool, --port, --https]. Package scripts: "test":"vitest","coverage":"vitest run --coverage". Config resolution: vitest.config.* > CLI --config > process.env.VITEST/mode > vite.config.*. Vitest config supports JS/TS extensions, not .json. Use defineConfig from 'vitest/config' or mergeConfig to extend. Key config options: include, exclude, includeSource, name, server.sourcemap/debug/deps, deps.optimizer, alias, globals, environment, environmentOptions, workspace, runner, benchmark, root, dir, reporters, outputFile, pool, update, watch. Workspaces: list of glob patterns or inline test project objects. Automatic dependency prompts disabled by VITEST_SKIP_INSTALL_CHECKS. IDE: VS Code extension. Playground: StackBlitz. Local linking: pnpm link.

## Normalised Extract
Table of Contents:
1. Installation
2. Test File Patterns
3. CLI Usage
4. Scripts
5. Config File Resolution
6. Basic Config
7. Extending Config
8. Workspaces
9. Dependency Checks
10. IDE & Playground

1. Installation
• Run one of: npm install -D vitest | yarn add -D vitest | pnpm add -D vitest
• Requires Vite>=5.0.0, Node>=18.0.0
• Or run with npx vitest

2. Test File Patterns
• Default include: **/*.{test,spec}.?(c|m)[jt]s?(x)
• In-source tests: add includeSource globs and use import.meta.vitest

3. CLI Usage
• vitest                start in watch mode if TTY and not CI
• vitest run            one-shot run
• Flags:
  --config <path>      override config file
  --globals[=true/false]
  -u, --update         update snapshots
  -w, --watch[=true/false]
  --environment <env>  node|jsdom|happy-dom|edge-runtime
  --coverage           alias for vitest run --coverage
  --reporter <name|path>
  --outputFile <path|{...}>
  --pool <threads|forks|vmThreads|vmForks>
  --port <number>
  --https

4. Scripts
• package.json:{ "scripts": { "test":"vitest", "coverage":"vitest run --coverage" } }
• Bun: use bun run test instead of bun test

5. Config File Resolution
• Priority: vitest.config.* > CLI --config > process.env.VITEST or mode in vite.config.* > vite.config.*
• Supported extensions: .js, .mjs, .cjs, .ts, .mts, .cts
• .json not supported

6. Basic Config
import { defineConfig } from 'vitest/config'
export default defineConfig({ test:{ include: […], exclude: […], environment:'node', globals:false } })

7. Extending Config
import { mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'
export default mergeConfig(viteConfig, defineConfig({ test:{ /* overrides */ } }))

8. Workspaces
import { defineConfig } from 'vitest/config'
export default defineConfig({ test:{ workspace:[ 'packages/*', 'tests/*/vitest.config.ts', { test:{ name:'node', root:'./shared_tests', environment:'node', setupFiles:['./setup.node.ts'] } } ] } })

9. Dependency Checks
• Vitest auto-prompts to install missing peer deps; disable with VITEST_SKIP_INSTALL_CHECKS=1

10. IDE & Playground
• Official VS Code extension from Marketplace
• Online at StackBlitz

## Supplementary Details
• TypeScript Triple-Slash Directives:
  • In vite.config.ts: /// <reference types="vitest/config" />
  • In pure vite.config.ts: /// <reference types="vitest" /> (deprecated in next major)
  • In tests: /// <reference types="vitest/globals" /> for global APIs, /// <reference types="vitest/jsdom" /> for jsdom

• Environment Docblock & Comment:
  • Docblock: /** @vitest-environment jsdom */
  • Comment: // @vitest-environment happy-dom

• Automatic Config Branching:
  • process.env.VITEST or defineConfig({ mode:"benchmark" })

• Unreleased Build & Local Link:
  • npm install https://pkg.pr.new/vitest@{commit}
  • git clone https://github.com/vitest-dev/vitest.git
    pnpm install
    cd packages/vitest
    pnpm run build
    pnpm link --global
    pnpm link --global vitest

• Unplugin-Auto-Import Example:
import AutoImport from 'unplugin-auto-import/vite'
export default defineConfig({ plugins:[ AutoImport({ imports:['vitest'], dts:true }) ] })

## Reference Details
Configuration Schema:
• include: string[] default ["**/*.{test,spec}.?(c|m)[jt]s?(x)"] CLI: vitest [...globs]
• exclude: string[] default ["**/node_modules/**","**/dist/**","**/cypress/**","**/.{idea,git,cache,output,temp}/**","**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*"] CLI: --exclude "<pattern>"
• includeSource: string[] default []
• name: string default undefined
• server: { sourcemap:'inline'|boolean (default 'inline'), debug:{ dumpModules:boolean|string (default false), loadDumpedModules:boolean (default false) }, deps:{ external:(string|RegExp)[] default [/\/node_modules\//], inline:(string|RegExp)[]|true (default []), fallbackCJS:boolean (default false), cacheDir:string (default 'node_modules/.vite') } }
• deps: { optimizer:{ ssr:{ enabled:boolean (default false), include:string[], exclude:string[] }, web:{ enabled:boolean, include:string[], exclude:string[], transformAssets:boolean (default true), transformCss:boolean (default true), transformGlobPattern:RegExp[] } }, interopDefault:boolean (default true), moduleDirectories:string[] (default ['node_modules']) }
• runner: path to custom VitestRunnerConstructor, default 'node' or 'benchmark'
• benchmark: { include:string[] default ['**/*.{bench,benchmark}.?(c|m)[jt]s?(x)'], exclude:string[] default ['node_modules','dist','.idea','.git','.cache'], includeSource:string[], reporters:Reporter[] default ['default'], outputJson:string, compare:string }
• alias: Record<string,string>|Array<{find:string|RegExp,replacement:string,customResolver?:Function}>; merges with Vite resolve.alias
• globals: boolean default false CLI: --globals, --globals=false
• environment: string<'node'|'jsdom'|'happy-dom'|'edge-runtime'> default 'node' CLI: --environment=<env>
• environmentOptions: Record<string,unknown> default {}
• workspace: Array<string|{test:Partial<TestOptions>}> default []
• root: string CLI: -r, --root
• dir: string CLI: --dir default root
• reporters: Reporter|Reporter[] default ['default'] CLI: --reporter
• outputFile: string|Record<string,string> CLI: --outputFile
• pool: 'threads'|'forks'|'vmThreads'|'vmForks' default 'forks' CLI: --pool
• update: boolean default false CLI: -u, --update
• watch: boolean default !CI&&TTY CLI: -w, --watch

CLI Reference:
vitest [run] [--config <path>] [--globals] [-u] [-w] [--environment <env>] [--coverage] [--reporter <name>] [--outputFile <path>] [--pool <mode>] [--port <num>] [--https] [--skip-install-checks]

Best Practices:
• Use defineConfig from 'vitest/config' for full TS support
• Keep Vite and Vitest config in the same file to avoid duplication
• Use mergeConfig to share base Vite config
• Use workspaces to run multiple project configs in one process
• Disable auto-install checks in CI with VITEST_SKIP_INSTALL_CHECKS=1

Troubleshooting:
1. No tests found: verify include patterns and file extensions
2. Named export errors from CJS modules: enable interopDefault
3. Bun running its own runner: use bun run test
4. CSS or asset imports failing: set deps.web.transformCss or .transformAssets to true
5. Merging configs not applied: ensure correct merge order and file extensions


## Information Dense Extract
Requirements: Vite>=5.0.0, Node>=18.0.0; install: npm|yarn|pnpm add -D vitest; test files: **/*.{test,spec}.?(c|m)[jt]s?(x); run: vitest (watch) or vitest run; flags: --config, --globals, -u, -w, --environment, --coverage, --reporter, --outputFile, --pool, --port, --https; config: vitest.config.* > CLI > env/mode > vite.config.*; file ext: js,mjs,cjs,ts,mts,cts; defineConfig from 'vitest/config'; mergeConfig for extending; key options: include, exclude, includeSource, name, server({sourcemap,debug,deps}), deps({optimizer,interopDefault,moduleDirectories}), alias, globals, environment, environmentOptions, workspace, root, dir, reporters, outputFile, pool, update, watch; workspaces: glob patterns or inline objects; disable auto-deps: VITEST_SKIP_INSTALL_CHECKS=1; TS directives: vitest/config, vitest/globals, vitest/jsdom; env docblocks: @vitest-environment; bundler: uses esbuild for optimizer; examples: see mergeConfig and workspace patterns.

## Sanitised Extract
Table of Contents:
1. Installation
2. Test File Patterns
3. CLI Usage
4. Scripts
5. Config File Resolution
6. Basic Config
7. Extending Config
8. Workspaces
9. Dependency Checks
10. IDE & Playground

1. Installation
 Run one of: npm install -D vitest | yarn add -D vitest | pnpm add -D vitest
 Requires Vite>=5.0.0, Node>=18.0.0
 Or run with npx vitest

2. Test File Patterns
 Default include: **/*.{test,spec}.?(c|m)[jt]s?(x)
 In-source tests: add includeSource globs and use import.meta.vitest

3. CLI Usage
 vitest                start in watch mode if TTY and not CI
 vitest run            one-shot run
 Flags:
  --config <path>      override config file
  --globals[=true/false]
  -u, --update         update snapshots
  -w, --watch[=true/false]
  --environment <env>  node|jsdom|happy-dom|edge-runtime
  --coverage           alias for vitest run --coverage
  --reporter <name|path>
  --outputFile <path|{...}>
  --pool <threads|forks|vmThreads|vmForks>
  --port <number>
  --https

4. Scripts
 package.json:{ 'scripts': { 'test':'vitest', 'coverage':'vitest run --coverage' } }
 Bun: use bun run test instead of bun test

5. Config File Resolution
 Priority: vitest.config.* > CLI --config > process.env.VITEST or mode in vite.config.* > vite.config.*
 Supported extensions: .js, .mjs, .cjs, .ts, .mts, .cts
 .json not supported

6. Basic Config
import { defineConfig } from 'vitest/config'
export default defineConfig({ test:{ include: [], exclude: [], environment:'node', globals:false } })

7. Extending Config
import { mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'
export default mergeConfig(viteConfig, defineConfig({ test:{ /* overrides */ } }))

8. Workspaces
import { defineConfig } from 'vitest/config'
export default defineConfig({ test:{ workspace:[ 'packages/*', 'tests/*/vitest.config.ts', { test:{ name:'node', root:'./shared_tests', environment:'node', setupFiles:['./setup.node.ts'] } } ] } })

9. Dependency Checks
 Vitest auto-prompts to install missing peer deps; disable with VITEST_SKIP_INSTALL_CHECKS=1

10. IDE & Playground
 Official VS Code extension from Marketplace
 Online at StackBlitz

## Original Source
Vitest Testing Framework
https://vitest.dev

## Digest of VITEST_CONFIG

# Vitest Configuration and Usage (Retrieved 2024-06-21)

**Data Size:** 30460928 bytes

## 1. Installation Requirements

- Vite >= 5.0.0
- Node >= 18.0.0
- Install locally via:
  - `npm install -D vitest`
  - `yarn add -D vitest`
  - `pnpm add -D vitest`
- Or run with `npx vitest` (checks local bin, then $PATH, then temporary install).

## 2. Writing & Running Tests

### File Naming

- Test files must match `**/*.{test,spec}.?(c|m)[jt]s?(x)` by default.
- In-source tests: use `import.meta.vitest` and configure `includeSource`.

### Example Test Suite

```js
// sum.js
export function sum(a, b) { return a + b }

// sum.test.js
import { expect, test } from 'vitest'
import { sum } from './sum.js'

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})
```

### Package Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage"
  }
}
```

- Run `npm run test` / `yarn test` / `pnpm test`.
- For Bun: use `bun run test` not `bun test`.

## 3. CLI Commands & Flags

- `vitest` : Watch mode (default if TTY and not CI).
- `vitest run` : Single run, no watch.
- Common flags:
  - `--config <path>`
  - `--globals[=true|false]`
  - `-u, --update` (update snapshots)
  - `-w, --watch[=true|false]`
  - `--environment <node|jsdom|happy-dom|edge-runtime>`
  - `--coverage`
  - `--port <number>`
  - `--https`
  - `--reporter <name|path>`
  - `--outputFile <path|JSON object>`
  - `--pool <threads|forks|vmThreads|vmForks>`

## 4. Configuration Files & Ordering

1. `vitest.config.ts|js|mjs|cjs|mts|cts` (highest priority).
2. `--config` CLI override.
3. `process.env.VITEST` or `mode` inside `vite.config.*`.
4. `vite.config.ts|js|mjs|cjs|mts|cts` (if no separate Vitest config).

- **Note:** `.json` extension is not supported for Vitest config.
- **Tip:** Use triple-slash directives or import from `vitest/config` for typings.

## 5. Common Config Patterns

### Basic `vitest.config.ts`
```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: { /* options */ }
})
```

### Extend Vite Config
```ts
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({ test: { /* overrides */ } })
)
```

### Workspaces
```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    workspace: [
      'packages/*',
      'tests/*/vitest.config.ts',
      { test: { name: 'node', environment: 'node', setupFiles: ['./setup.node.ts'] } }
    ]
  }
})
```

## 6. Advanced Features

- **Automatic Dependency Installation:** disable via `VITEST_SKIP_INSTALL_CHECKS=1`.
- **IDE Integration:** Official VS Code extension (Marketplace).
- **Online Playground:** StackBlitz.
- **Unreleased Builds:** `npm i https://pkg.pr.new/vitest@{commit}` or local link via `pnpm link --global vitest`.


## Attribution
- Source: Vitest Testing Framework
- URL: https://vitest.dev
- License: License: MIT License
- Crawl Date: 2025-05-11T04:02:14.969Z
- Data Size: 30460928 bytes
- Links Found: 23987

## Retrieved
2025-05-11
