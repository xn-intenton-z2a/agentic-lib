# VITEST_MOCKING

## Crawl Summary
vitest mocking: vi.useFakeTimers/useRealTimers/setSystemTime; vi.fn and vi.spyOn APIs with mockImplementation, mockReturnValue, clearAllMocks, restoreAllMocks; vi.stubGlobal; module mocking via vi.mock with factory; class mocking via vi.fn on constructor, prototype, static; memfs-based fs mock; MSW setup via setupServer and handlers; automocking algorithm; pitfalls on internal calls

## Normalised Extract
Table of Contents
1. Date & Timer Control
2. Function Spies & Mocks
3. Global & Module Mocking
4. Class Mocking
5. File System Mocking
6. Network Request Mocking

1. Date & Timer Control
  vi.useFakeTimers(): switch to fake timer mode
  vi.useRealTimers(): revert timer mode
  vi.setSystemTime(date: Date|number): override Date.now
  vi.runAllTimers(): execute all pending timeouts/intervals
  vi.advanceTimersByTime(ms: number): move timers ahead by ms
  vi.advanceTimersToNextTimer(): jump to next timer

2. Function Spies & Mocks
  vi.spyOn(obj, method, accessType?): SpyInstance
    methods: mockImplementation(fn), mockImplementationOnce(fn), getMockName(), toHaveBeenCalledTimes(n), toHaveBeenCalledWith(...)
  vi.fn(): creates callable MockInstance
    methods: mockImplementation(fn), mockImplementationOnce(fn), mockReturnValue(v), mockResolvedValue(v), mockRejectedValue(err)
  vi.restoreAllMocks(): restore original implementations
  vi.clearAllMocks(): clear call history

3. Global & Module Mocking
  vi.stubGlobal(name, value): define globalThis[name]
  vi.unstubAllGlobals(): remove stubs
  Module mocking:
    vi.mock('module', factory)
    factory returns mocked exports
  Automocking algorithm applies deep clone for objects, empties arrays

4. Class Mocking
  const MockClass = vi.fn(function(args){ constructor body })
  MockClass.prototype.method = vi.fn()
  MockClass.staticMethod = vi.fn()
  Beware new.target undefined

5. File System Mocking
  Setup __mocks__/fs.cjs: module.exports = memfs.fs
  Setup __mocks__/fs/promises.cjs: module.exports = memfs.fs.promises
  vi.mock('node:fs'); vi.mock('node:fs/promises')
  use vol.reset(), vol.fromJSON({...}, cwd)

6. Network Request Mocking
  import { setupServer } from 'msw/node'
  import { http, graphql, ws, HttpResponse } from 'msw'
  const handlers = [http.get(url, () => HttpResponse.json(data)), graphql.query(name, () => HttpResponse.json({data})), ws.link(url).addEventListener('connection', handler)]
  const server = setupServer(...handlers)
  beforeAll(()=>server.listen({onUnhandledRequest:'error'}))
  afterEach(()=>server.resetHandlers())
  afterAll(()=>server.close())


## Supplementary Details
Date & Timer APIs parameters and defaults
- useFakeTimers(): no args
- setSystemTime(date: Date|number): accepts Date object or timestamp number
- advanceTimersByTime(ms:number): integer ms
Function Spy return types
- vi.spyOn returns SpyInstance<OriginalReturnType>
- SpyInstance.mockImplementation returns SpyInstance
Module mocking factory signature
- factory: ()=>Record<string, any>
Class mocking caveats
- new MockClass() instanceof MockClass true only if constructor returns this
Memfs vol API
- vol.reset(): void
- vol.fromJSON(objectMap:Record<string,string>, cwd:string): void
MSW server methods
- server.listen(options:{onUnhandledRequest: 'error'|'warn'|false}): void
- server.resetHandlers(...handlers): void
- server.close(): void


## Reference Details
### vi.useFakeTimers() -> void
### vi.useRealTimers() -> void
### vi.setSystemTime(date: Date|number) -> void
### vi.runAllTimers() -> void
### vi.advanceTimersByTime(ms: number) -> void
### vi.advanceTimersToNextTimer() -> void

### vi.spyOn
Signature: vi.spyOn<T, K extends keyof T>(target: T, property: K, accessType?: 'get'|'set'): SpyInstance<T[K], any[]>
Returns: SpyInstance with:
  mockImplementation(fn: (...args:any[])=>any): this
  mockImplementationOnce(fn: (...args:any[])=>any): this
  getMockName(): string
  toHaveBeenCalledTimes(count: number): Assertion
  toHaveBeenCalledWith(...args:any[]): Assertion

### vi.fn
Signature: vi.fn<T extends (...args:any[])=>any>(implementation?: T): MockInstance<T, Parameters<T>>
MockInstance methods:
  mockImplementation(fn: (...args:Parameters<T>)=>ReturnType<T>): this
  mockImplementationOnce(fn: (...args:Parameters<T>)=>ReturnType<T>): this
  mockReturnValue(value: ReturnType<T>): this
  mockResolvedValue(value: PromiseValue<ReturnType<T>>): this
  mockRejectedValue(error: any): this

### vi.restoreAllMocks() -> void
### vi.clearAllMocks() -> void

### vi.stubGlobal(name: string, value: any) -> void
### vi.unstubAllGlobals() -> void

### vi.mock
Signature: vi.mock(moduleId: string|() => any, factory: () => Record<string, any>): void
Effects: mocks all imports of moduleId with factory return

### Class mocking pattern
const MockClass = vi.fn(function(name:string){ this.name=name })
MockClass.prototype.method = vi.fn()
MockClass.staticMethod = vi.fn()

### Memfs mocks
__mocks__/fs.cjs
  const {fs} = require('memfs')
  module.exports = fs
__mocks__/fs/promises.cjs
  const {fs} = require('memfs')
  module.exports = fs.promises
vol.reset(): void
vol.fromJSON(files:Record<string,string>, cwd:string): void

### MSW usage
import { setupServer } from 'msw/node'
import { http, graphql, ws, HttpResponse } from 'msw'
HTTP handler: http.get(url:string, resolver:()=>HttpResponse)
GraphQL handler: graphql.query(operationName:string, resolver:()=>HttpResponse)
WebSocket: const link = ws.link(url:string)
link.addEventListener('connection', ({client})=>{})
const server = setupServer(...handlers)
server.listen({onUnhandledRequest:'error'| 'warn' | false}): void
server.resetHandlers(...handlers?): void
server.close(): void

### Best Practices
- Clear mocks after each test: afterEach(()=>{vi.clearAllMocks(); vi.restoreAllMocks()})
- Use dependency injection for internal calls to allow mocking
- Use memfs for fs mocking to avoid real disk I/O
- Set onUnhandledRequest:'error' to catch missing handlers

### Troubleshooting
Command: vitest --run
Scenario: Fake timer not applied
  Check: vi.useFakeTimers called before timer creation
Scenario: Module mock not applied
  Check: vi.mock is hoisted above imports
Scenario: FS mock returns undefined
  Check: __mocks__/fs.cjs path and naming correct
Scenario: MSW server not intercepting
  Check: server.listen called in beforeAll and resetHandlers in afterEach


## Information Dense Extract
DateTimers: vi.useFakeTimers(); vi.useRealTimers(); vi.setSystemTime(Date|number); vi.runAllTimers(); vi.advanceTimersByTime(ms); vi.advanceTimersToNextTimer();
Function spies: vi.spyOn(obj,prop,'get'|'set')->SpyInstance
Functions: vi.fn()->MockInstance
Mock methods: mockImplementation(fn); mockImplementationOnce(fn); mockReturnValue(v); mockResolvedValue(v); mockRejectedValue(err)
Restore/Clear: vi.restoreAllMocks(); vi.clearAllMocks()
Global stub: vi.stubGlobal(name,val); vi.unstubAllGlobals()
Module mock: vi.mock(id,factory->Record<string,any>)
Automock: arrays emptied; primitives cloned; objects deep clone; class instances deep clone
Class mock: const C=vi.fn(function(){...}); C.prototype.method=vi.fn(); C.static=vi.fn()
FS mock: __mocks__/fs.cjs->memfs.fs; __mocks__/fs/promises.cjs->memfs.fs.promises; vi.mock('node:fs'); vi.mock('node:fs/promises'); vol.reset(); vol.fromJSON(map,cwd)
Network mock MSW: import {setupServer} from 'msw/node'; import {http,graphql,ws,HttpResponse} from 'msw'; handlers: http.get(url,()=>HttpResponse.json(data)); graphql.query(op,()=>HttpResponse.json({data})); ws.link(url).addEventListener('connection',...); server=setupServer(...handlers); beforeAll(()=>server.listen({onUnhandledRequest:'error'})); afterEach(()=>server.resetHandlers()); afterAll(()=>server.close())

## Sanitised Extract
Table of Contents
1. Date & Timer Control
2. Function Spies & Mocks
3. Global & Module Mocking
4. Class Mocking
5. File System Mocking
6. Network Request Mocking

1. Date & Timer Control
  vi.useFakeTimers(): switch to fake timer mode
  vi.useRealTimers(): revert timer mode
  vi.setSystemTime(date: Date|number): override Date.now
  vi.runAllTimers(): execute all pending timeouts/intervals
  vi.advanceTimersByTime(ms: number): move timers ahead by ms
  vi.advanceTimersToNextTimer(): jump to next timer

2. Function Spies & Mocks
  vi.spyOn(obj, method, accessType?): SpyInstance
    methods: mockImplementation(fn), mockImplementationOnce(fn), getMockName(), toHaveBeenCalledTimes(n), toHaveBeenCalledWith(...)
  vi.fn(): creates callable MockInstance
    methods: mockImplementation(fn), mockImplementationOnce(fn), mockReturnValue(v), mockResolvedValue(v), mockRejectedValue(err)
  vi.restoreAllMocks(): restore original implementations
  vi.clearAllMocks(): clear call history

3. Global & Module Mocking
  vi.stubGlobal(name, value): define globalThis[name]
  vi.unstubAllGlobals(): remove stubs
  Module mocking:
    vi.mock('module', factory)
    factory returns mocked exports
  Automocking algorithm applies deep clone for objects, empties arrays

4. Class Mocking
  const MockClass = vi.fn(function(args){ constructor body })
  MockClass.prototype.method = vi.fn()
  MockClass.staticMethod = vi.fn()
  Beware new.target undefined

5. File System Mocking
  Setup __mocks__/fs.cjs: module.exports = memfs.fs
  Setup __mocks__/fs/promises.cjs: module.exports = memfs.fs.promises
  vi.mock('node:fs'); vi.mock('node:fs/promises')
  use vol.reset(), vol.fromJSON({...}, cwd)

6. Network Request Mocking
  import { setupServer } from 'msw/node'
  import { http, graphql, ws, HttpResponse } from 'msw'
  const handlers = [http.get(url, () => HttpResponse.json(data)), graphql.query(name, () => HttpResponse.json({data})), ws.link(url).addEventListener('connection', handler)]
  const server = setupServer(...handlers)
  beforeAll(()=>server.listen({onUnhandledRequest:'error'}))
  afterEach(()=>server.resetHandlers())
  afterAll(()=>server.close())

## Original Source
Vitest Testing & Mocking
https://vitest.dev/guide/mocking.html

## Digest of VITEST_MOCKING

# Vitest Mocking Guide

Retrieved: 2024-06-14

## Dates and Timers

### Methods

- vi.useFakeTimers() : enable fake timers & date manipulation
- vi.useRealTimers() : restore real timers
- vi.setSystemTime(date: Date|number): override system time
- vi.runAllTimers(): fast-forward all timers
- vi.advanceTimersByTime(ms: number): advance timers by ms
- vi.advanceTimersToNextTimer(): advance to next scheduled timer

### Example Usage

```js
import { beforeEach, afterEach, it, describe, expect, vi } from 'vitest'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

it('executes after two hours', () => {
  const mockFn = vi.fn()
  setTimeout(mockFn, 1000 * 60 * 60 * 2)
  vi.runAllTimers()
  expect(mockFn).toHaveBeenCalledTimes(1)
})
```  

## Function Spies & Mocks

### vi.spyOn(target: object, property: string, accessType?: 'get'|'set')
- Returns SpyInstance with methods:
  - .mockImplementation(fn)
  - .mockImplementationOnce(fn)
  - .getMockName(): string
  - call assertions (.toHaveBeenCalledTimes, .toHaveBeenCalledWith)

### vi.fn(): MockInstance & Callable
- Methods:
  - .mockImplementation(fn)
  - .mockImplementationOnce(fn)
  - .mockReturnValue(value)
  - .mockResolvedValue(value)
  - .mockRejectedValue(error)

### Restoring

- vi.restoreAllMocks(): restore spies to original
- vi.clearAllMocks(): clear mock call history

### Stub Globals

- vi.stubGlobal(name: string, value: any)
- vi.unstubAllGlobals()

## Module & Class Mocking

### Module Factory

```ts
vi.mock('module-name', () => {
  return { export1: vi.fn(), export2: vi.fn() }
})
```

### Virtual Modules

- In vite.config:
  alias: { 'virtual:id': '/path/to/mock.js' }
- Or plugin.resolveId() returns 'virtual:id'

### Class Mocking

```ts
const Dog = vi.fn(function(name: string){ this.name = name })
Dog.prototype.speak = vi.fn(()=>'bark')
Dog.getType = vi.fn(()=> 'animal')
```  

## Module Automocking

- Arrays -> []
- Primitives -> same
- Objects -> deep clone
- Class instances -> deep clone

## File System Mocking

- Use memfs:
  - __mocks__/fs.cjs exports memfs.fs
  - __mocks__/fs/promises.cjs exports memfs.fs.promises
- vi.mock('node:fs') / vi.mock('node:fs/promises')

## Network Mocking with MSW

- setupServer(handlers...)
- handlers: http.get(url, resolver), graphql.query(operationName, resolver), ws.link(url)
- server.listen({ onUnhandledRequest:'error' })
- server.resetHandlers()

## Pitfalls

- Cannot mock internal calls inside same module; use dependency injection.


## Attribution
- Source: Vitest Testing & Mocking
- URL: https://vitest.dev/guide/mocking.html
- License: License: MIT
- Crawl Date: 2025-05-06T16:29:08.804Z
- Data Size: 33436480 bytes
- Links Found: 24750

## Retrieved
2025-05-06
