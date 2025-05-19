# VITEST_API

## Crawl Summary
type Awaitable<T> = T | PromiseLike<T>  
type TestFunction = () => Awaitable<void>  
interface TestOptions { timeout?: number; retry?: number; repeats?: number }  
test(name, fn, options?), test.skip, test.only, test.concurrent, test.sequential, test.todo, test.fails, test.each, test.for, test.extend(fixtures)  
bench(name, fn, BenchOptions), bench.skip, bench.only, bench.todo  
describe, describe.skip, describe.only, describe.concurrent, describe.sequential, describe.shuffle, describe.todo, describe.each, describe.for  
Hooks: beforeEach, afterEach, beforeAll, afterAll (timeout?), onTestFinished, onTestFailed

## Normalised Extract
Table of Contents:
1. Types and Interfaces
2. Test Function Signatures
3. Test Modifiers and Options
4. Parameterized Tests
5. Fixture Extension
6. Benchmarks API
7. Lifecycle Hooks
8. Test Context Hooks

1. Types and Interfaces
Awaitable<T> = T or PromiseLike<T>
TestFunction = () => Awaitable<void>
TestOptions { timeout: number?, retry: number (default 0), repeats: number (default 0) }

2. Test Function Signatures
function test(name: string, optsOrFn: TestOptions|TestFunction, fnOrTimeout?: TestFunction|number, timeoutMs?: number): void
Modifiers available on test: skip, only, concurrent, sequential, todo, fails

3. Test Modifiers and Options
Usage patterns:
- test.skip('name', fn)
- test('name', { skip: true, concurrent: true, timeout: 10000, retry: 2, repeats: 3 }, fn)
- test.concurrent.only('name', fn, 5000)

4. Parameterized Tests
test.each(cases, namePattern, fn) spreads arrays
test.for(cases, namePattern, fn) passes each case as single arg
Supports printf style placeholders: %s, %d, %i, %f, %j, %o, %#, %$
Template string table syntax with ${value}

5. Fixture Extension
test.extend({ fixtureName: async ({ task }, use) => { ...; await use(value); cleanup } }) → returns new test instance

6. Benchmarks API
bench(name: string, fn: BenchFunction, options?: BenchOptions)
BenchOptions: time (default 500ms), iterations (default 10), now(), signal, throws, warmupTime (100ms), warmupIterations (5), setup, teardown
bench.skip, bench.only, bench.todo
TaskResult properties: error?, totalTime, min, max, hz, period, samples, mean, variance, sd, sem, df, critical, moe, rme, mad, p50, p75, p99, p995, p999

7. Lifecycle Hooks
beforeEach(fn, timeout?), afterEach(fn, timeout?), beforeAll(fn, timeout?), afterAll(fn, timeout?)

8. Test Context Hooks
In test(fn) scope: onTestFinished(callback), onTestFailed(callback)

## Supplementary Details
Parameter Defaults:
- TestOptions.retry = 0
- TestOptions.repeats = 0
- default timeout = 5000ms, override via global testTimeout in config

Configuration steps:
1. Install Vitest: npm install vitest --save-dev
2. Add script: "test": "vitest"
3. Global config in vitest.config.ts: export default { test: { timeout: 10000, sequence: { concurrent: true, shuffle: false } , threads: true }, bench: { time: 1000, iterations: 20 } }

Fixture Implementation Pattern:
- Define fixtures via test.extend
- Use returned `myTest` instance for tests requiring fixtures

Parallel vs Sequential Patterns:
- test.concurrent inside describe.concurrent runs parallel, use expect from context
- test.sequential enforces serial within concurrent suite

Shuffling Tests:
- CLI flag --sequence.shuffle, seed via --sequence.seed
- describe.shuffle('suite', fn, { shuffle: true })

Troubleshooting:
- To debug random failures, set repeats > 0 or --repeat flag
- Increase chaiConfig.truncateThreshold to show full snapshots
- Use onTestFailed to log error.task.result errors

## Reference Details
Complete Method Signatures:
```ts
// Core test
function test(
  name: string,
  optsOrFn: TestOptions | TestFunction,
  fnOrTimeout?: TestFunction | number,
  timeoutMs?: number
): void
// Modifiers
namespace test {
  const skip: (name: string, fn: TestFunction, timeout?: number) => void;
  const only: (name: string, fn: TestFunction, timeout?: number) => void;
  const concurrent: (name: string, fn: TestFunction, timeout?: number) => void;
  const sequential: (name: string, fn: TestFunction, timeout?: number) => void;
  const todo: (name: string) => void;
  const fails: (name: string, fn: TestFunction) => void;
  function each(cases: any[][], namePattern: string, fn: (...args: any[]) => void): void;
  function each<T>(template: TemplateStringsArray, namePattern: string, fn: (ctx:T) => void): void;
  function for(cases: any[][], namePattern: string, fn: (case: any) => void): void;
  function extend(fixtures: Record<string, Fixture>): TestInstance;
}

// Bench API
type BenchFunction = () => Awaitable<void>;
interface BenchOptions {
  time?: number;
  iterations?: number;
  now?: () => number;
  signal?: AbortSignal;
  throws?: boolean;
  warmupTime?: number;
  warmupIterations?: number;
  setup?: Hook;
  teardown?: Hook;
}
function bench(name: string, fn: BenchFunction, options?: BenchOptions): void;
namespace bench {
  const skip: (name: string, fn: BenchFunction, options?: BenchOptions) => void;
  const only: (name: string, fn: BenchFunction, options?: BenchOptions) => void;
  const todo: (name: string) => void;
}

// Hooks
function beforeEach(fn: () => Awaitable<void>, timeout?: number): void;
function afterEach(fn: () => Awaitable<void>, timeout?: number): void;
function beforeAll(fn: () => Awaitable<void>, timeout?: number): void;
function afterAll(fn: () => Awaitable<void>, timeout?: number): void;

// Test Context Hooks (inside test)
interface ExtendedContext {
  onTestFinished: (cb: () => void) => void;
  onTestFailed: (cb: ({ task: TaskResult }) => void) => void;
}
```

Implementation Example:
```ts
import { test, bench, beforeAll, afterAll, test as baseTest } from 'vitest'

beforeAll(async () => { await startServer() });
afterAll(async () => { await stopServer() });
const myTest = baseTest.extend({
  db: async (_, use) => { const conn = await connect(); await use(conn); await conn.close(); }
});

myTest('fetch data', async ({ db }) => {
  const data = await db.query('SELECT * FROM table');
  expect(data).toHaveLength(0);
});

test.concurrent('parallel1', async () => { /* ... */ });

test.only('critical test', () => { expect(true).toBe(true); });

test.each([ [1,2,3], [2,3,5] ])('sum(%i,%i)=%i', (a,b,sum) => {
  expect(a+b).toBe(sum);
});

bench('sort', () => { [3,1,2].sort() }, { time:1000, iterations:50 });
```

Configuration Options:
- vitest.config.ts {
    test: { timeout: number, threads: boolean, sequence: { concurrent: boolean, shuffle: boolean, seed?: number } },
    bench: { time: number, iterations: number, warmupTime: number, warmupIterations: number }
  }

Best Practices:
- Use test.concurrent for IO-bound parallel tests, ensure isolation via fixtures
- Use test.sequential inside describe.concurrent for dependent tests
- Use test.repeat for flakey tests with retry and repeats options; combine with onTestFailed logging
- Leverage onTestFinished for automatic cleanup of allocated resources

Troubleshooting:
Command: vitest --clearCache; vitest --reporter verbose; vitest --run --parallel false
Expected outputs: tests run serially; coverage report; errors show stack traces with file:line



## Information Dense Extract
Awaitable<T>=T|PromiseLike<T>;TestFunction=()=>Awaitable<void>;TestOptions{timeout?:ms;retry?:number=0;repeats?:number=0};
Test API: test(name:string,optsOrFn:TestOptions|TestFunction,fnOrTimeout?:TestFunction|number,timeoutMs?:number):void
Modifiers: test.skip(name,fn,timeout?),test.only, test.concurrent, test.sequential, test.todo(name), test.fails(name,fn);
test.each(cases,pattern,fn), test.for(cases,pattern,fn); printf placeholders: %s,%d,%i,%f,%j,%o,%#, %$,%%; Template table syntax supported
Fixtures: test.extend({key:async({task},use)=>{setup;await use(value);cleanup}})->TestInstance
Bench API: bench(name:string,fn:BenchFunction,options?:{time?:ms=500;iterations?:number=10;warmupTime?:100;warmupIterations?:5;now?:()=>number;signal?:AbortSignal;throws?:boolean;setup?:Hook;teardown?:Hook}); bench.skip, bench.only, bench.todo; TaskResult{error?,totalTime,min,max,hz,period,samples,mean,variance,sd,sem,df,critical,moe,rme,mad,p50,p75,p99,p995,p999}
Lifecycle Hooks: beforeEach/afterEach/beforeAll/afterAll(fn,timeout?);
Test Context Hooks inside test: onTestFinished(cb), onTestFailed(cb({task}))
Config: vitest.config.ts {test:{timeout:number,threads:boolean,sequence:{concurrent:boolean,shuffle:boolean,seed?:number}},bench:{time:number,iterations:number,warmupTime:number,warmupIterations:number}}

## Sanitised Extract
Table of Contents:
1. Types and Interfaces
2. Test Function Signatures
3. Test Modifiers and Options
4. Parameterized Tests
5. Fixture Extension
6. Benchmarks API
7. Lifecycle Hooks
8. Test Context Hooks

1. Types and Interfaces
Awaitable<T> = T or PromiseLike<T>
TestFunction = () => Awaitable<void>
TestOptions { timeout: number?, retry: number (default 0), repeats: number (default 0) }

2. Test Function Signatures
function test(name: string, optsOrFn: TestOptions|TestFunction, fnOrTimeout?: TestFunction|number, timeoutMs?: number): void
Modifiers available on test: skip, only, concurrent, sequential, todo, fails

3. Test Modifiers and Options
Usage patterns:
- test.skip('name', fn)
- test('name', { skip: true, concurrent: true, timeout: 10000, retry: 2, repeats: 3 }, fn)
- test.concurrent.only('name', fn, 5000)

4. Parameterized Tests
test.each(cases, namePattern, fn) spreads arrays
test.for(cases, namePattern, fn) passes each case as single arg
Supports printf style placeholders: %s, %d, %i, %f, %j, %o, %#, %$
Template string table syntax with ${value}

5. Fixture Extension
test.extend({ fixtureName: async ({ task }, use) => { ...; await use(value); cleanup } })  returns new test instance

6. Benchmarks API
bench(name: string, fn: BenchFunction, options?: BenchOptions)
BenchOptions: time (default 500ms), iterations (default 10), now(), signal, throws, warmupTime (100ms), warmupIterations (5), setup, teardown
bench.skip, bench.only, bench.todo
TaskResult properties: error?, totalTime, min, max, hz, period, samples, mean, variance, sd, sem, df, critical, moe, rme, mad, p50, p75, p99, p995, p999

7. Lifecycle Hooks
beforeEach(fn, timeout?), afterEach(fn, timeout?), beforeAll(fn, timeout?), afterAll(fn, timeout?)

8. Test Context Hooks
In test(fn) scope: onTestFinished(callback), onTestFailed(callback)

## Original Source
Vitest Testing Framework & API Reference
https://vitest.dev/api/

## Digest of VITEST_API

# Vitest Testing Framework API Reference

Retrieved: 2023-11-26

## Type Definitions

### Awaitable<T>
```ts
type Awaitable<T> = T | PromiseLike<T>
```

### TestFunction
```ts
type TestFunction = () => Awaitable<void>
```

### TestOptions
```ts
interface TestOptions {
  timeout?: number           // maximum execution time in ms
  retry?: number             // number of retries on failure (default 0)
  repeats?: number           // number of repeats regardless of success (default 0)
}
```

## Core API Signatures

### test(name: string, fn: TestFunction, options?: TestOptions)
alias: it
```ts
function test(
  name: string,
  optsOrFn: TestOptions | TestFunction,
  fnOrTimeout?: TestFunction | number,
  timeoutMs?: number
): void
```
Options can be passed via:
- second argument object `{ skip: boolean, concurrent: boolean, timeout: number, retry: number, repeats: number }`
- chained modifiers: `test.skip`, `test.only`, `test.concurrent`, `test.skip.concurrent`, etc.

### test.skip(name: string, fn: TestFunction, timeout?: number)
alias: it.skip

### test.only(name: string, fn: TestFunction, timeout?: number)
alias: it.only

### test.concurrent(name: string, fn: TestFunction, timeout?: number)
alias: it.concurrent

### test.sequential(name: string, fn: TestFunction, timeout?: number)
alias: it.sequential

### test.todo(name: string)
alias: it.todo

### test.fails(name: string, fn: TestFunction)
alias: it.fails

### test.each(cases: any[][] | TemplateStringsArray, nameFn: string, fn: Function)
alias: it.each

### test.for(cases: any[][], nameFn: string, fn: Function)
alias: it.for

### test.extend(fixtures: Record<string, Fixture>)
alias: it.extend

## Benchmarks

### bench(name: string, fn: BenchFunction, options?: BenchOptions)
```ts
type BenchOptions = {
  time?: number         // ms, default 500
  iterations?: number   // default 10
  now?: () => number
  signal?: AbortSignal
  throws?: boolean
  warmupTime?: number   // default 100
  warmupIterations?: number // default 5
  setup?: Hook
  teardown?: Hook
}
```

## Hooks

### beforeEach(fn: () => Awaitable<void>, timeout?: number)
### afterEach(fn: () => Awaitable<void>, timeout?: number)
### beforeAll(fn: () => Awaitable<void>, timeout?: number)
### afterAll(fn: () => Awaitable<void>, timeout?: number)

## Test Context Hooks

### onTestFinished(callback: () => void)
### onTestFailed(callback: (errorInfo) => void)


## Attribution
- Source: Vitest Testing Framework & API Reference
- URL: https://vitest.dev/api/
- License: License: MIT
- Crawl Date: 2025-05-19T09:28:34.883Z
- Data Size: 24350099 bytes
- Links Found: 20136

## Retrieved
2025-05-19
