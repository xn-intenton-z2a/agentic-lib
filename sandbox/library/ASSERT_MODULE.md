# ASSERT_MODULE

## Crawl Summary
List of `node:assert` methods with exact signatures and behaviors. Includes legacy vs strict modes, class `AssertionError` options and properties, `CallTracker` API, environment flags to disable colors, stability indices per feature.

## Normalised Extract
Table of Contents:
 1. assert(value[, message]) → void
 2. deepEqual(actual, expected[, message]) → void (legacy deep equality)
 3. deepStrictEqual(actual, expected[, message]) → void (strict deep equality)
 4. strictEqual(actual, expected[, message]) → void
 5. notEqual(actual, expected[, message]) → void
 6. notStrictEqual(actual, expected[, message]) → void
 7. throws(fn[, error][, message]) → void
 8. doesNotThrow(fn[, error][, message]) → void
 9. rejects(asyncFn[, error][, message]) → Promise<void>
10. doesNotReject(asyncFn[, error][, message]) → Promise<void>
11. Class AssertionError(options)
12. Class CallTracker() (deprecated)

Details:
1. assert(value[, message])
   - Input: any truthy check
   - Throws: AssertionError if falsy

2. deepEqual(actual, expected[, message])
   - Uses `==` for primitives except NaN treated equal
   - Compares enumerable own properties unordered
   - Ignores prototypes
   - Compares Error names/messages, RegExp source/flags

3. deepStrictEqual(actual, expected[, message])
   - Uses `Object.is`
   - Compares [[Prototype]] via `===`
   - Compares own Symbol properties
   - WeakMap/WeakSet equal only by reference

4–6. strictEqual/notEqual/notStrictEqual
   - `===`, `!=`, `!==` checks

7–10. throws/doesNotThrow/rejects/doesNotReject
   - `throws(fn[, error][, message])`: fn must throw; `error` matches by constructor, RegExp, or validation fn
   - `rejects(asyncFn[, error][, message])`: returns Promise, rejects if no rejection or wrong error

11. AssertionError:
   - options: message, actual, expected, operator, stackStartFn
   - properties: message, name 'AssertionError', actual, expected, operator, code 'ERR_ASSERTION', generatedMessage

12. CallTracker:
   - calls(fn[, exact=1]) → wrapper fn
   - getCalls(wrapper) → Array<{ thisArg, arguments }>
   - report() → Array<{ message, actual, expected, operator, stack }>
   - reset([wrapper])
   - verify(): throws if counts mismatched


## Supplementary Details
Environment Variables:
 - NODE_DISABLE_COLORS=true disables ANSI colors in errors and REPL
 - NO_COLOR also disables colors

Implementation Steps:
1. import { strict as assert } from 'node:assert';
2. Use `assert.strictEqual(value1, value2, 'optional message')`
3. Wrap async tests in `await assert.rejects(asyncFn, ErrorConstructor, 'msg')`
4. On process exit, call `tracker.verify()` to enforce call counts

Configuration Options:
 - In strict mode: import from 'node:assert/strict'
 - In legacy mode: import from 'node:assert'

Best Practices:
 - Prefer strict methods: `deepStrictEqual`, `strictEqual`
 - Use descriptive messages in assertions
 - Use `assert.rejects` over manual try/catch in async tests
 - Replace `CallTracker` with mocking libraries (deprecated)

Version Compatibility:
 - Node.js v14+: all strict methods available
 - `deepStrictEqual`: v1.2.0+
 - `rejects`/`doesNotReject`: v10+


## Reference Details
API Specs:

assert(value[, message]) → void
 - value: any truthy; message: string|Error
 - Throws: AssertionError

assert.deepEqual(actual, expected[, message]) → void
 - actual: any; expected: any; legacy deep equality rules
 - Throws: AssertionError with message 'Expected inputs to be loosely deep-equal'

assert.deepStrictEqual(actual, expected[, message]) → void
 - strict deep equality rules (Object.is, prototypes, Symbol props)

assert.strictEqual(actual, expected[, message]) → void
 - uses `===`

assert.notEqual(actual, expected[, message]) → void
 - uses `!=`

assert.notStrictEqual(actual, expected[, message]) → void
 - uses `!==`

assert.throws(fn[, error][, message]) → void
 - fn: Function; error: RegExp|Function(validation)|ErrorConstructor; message: string|Error
 - Throws if fn does not throw or throws wrong error

assert.doesNotThrow(fn[, error][, message]) → void
 - Asserts no throw

assert.rejects(asyncFn[, error][, message]) → Promise<void>
 - asyncFn: Function returning Promise or Promise
 - error: RegExp|Function|ErrorConstructor to match rejection
 - Rejects if no rejection or wrong error

assert.doesNotReject(asyncFn[, error][, message]) → Promise<void>
 - Asserts no rejection

Class AssertionError(options)
 - options: { message: string, actual: any, expected: any, operator: string, stackStartFn?: Function }
 - error.code = 'ERR_ASSERTION'

Class CallTracker()
 - calls(fn?: Function, exact?: number) → Function
 - getCalls(wrapper): { thisArg: any, arguments: any[] }[]
 - report(): { message: string, actual: number, expected: number, operator: string, stack: any }[]
 - reset(wrapper?: Function): void
 - verify(): void

Code Examples:
```js
import { strict as assert } from 'node:assert';
// strictEqual example
assert.strictEqual(2+2, 4, 'Math still works');

// deepStrictEqual example
assert.deepStrictEqual({a:1}, {a:1});

// rejects example
await assert.rejects(
  () => Promise.reject(new TypeError('oops')),
  TypeError,
  'Expected TypeError'
);
```

Troubleshooting:
 - If colors still appear, verify `process.env.NODE_DISABLE_COLORS=true`
 - On wrong assertion messages, inspect `err.actual`, `err.expected`, `err.operator`
 - For untracked CallTracker errors, ensure `tracker.verify()` is called before exit
 - To view assertion diffs, enable strict mode import


## Information Dense Extract
assert(value[,message])→void;deepEqual(a,e[,m])→void legacy== rules;deepStrictEqual(a,e[,m])→void Object.is, prototypes, Symbol;strictEqual(a,e[,m])→void;notEqual,notStrictEqual analogs;throws(fn[,err][,m])→void match by RegExp/constructor/fn;doesNotThrow(fn[,err][,m])→void;rejects(async[,err][,m])→Promise;doesNotReject(async[,err][,m])→Promise;AssertionError(opts:{message,actual,expected,operator[,stackStartFn]}) props: code='ERR_ASSERTION';CallTracker():calls(fn?,exact=1)→wrapper;getCalls(w)→[{thisArg,args}];report(),reset([w]),verify();Env:NO_COLOR or NODE_DISABLE_COLORS disable colors;Prefer strict variants;added_assertions:v0.5.9,rejects:v10,deepStrictEqual:v1.2

## Sanitised Extract
Table of Contents:
 1. assert(value[, message])  void
 2. deepEqual(actual, expected[, message])  void (legacy deep equality)
 3. deepStrictEqual(actual, expected[, message])  void (strict deep equality)
 4. strictEqual(actual, expected[, message])  void
 5. notEqual(actual, expected[, message])  void
 6. notStrictEqual(actual, expected[, message])  void
 7. throws(fn[, error][, message])  void
 8. doesNotThrow(fn[, error][, message])  void
 9. rejects(asyncFn[, error][, message])  Promise<void>
10. doesNotReject(asyncFn[, error][, message])  Promise<void>
11. Class AssertionError(options)
12. Class CallTracker() (deprecated)

Details:
1. assert(value[, message])
   - Input: any truthy check
   - Throws: AssertionError if falsy

2. deepEqual(actual, expected[, message])
   - Uses '==' for primitives except NaN treated equal
   - Compares enumerable own properties unordered
   - Ignores prototypes
   - Compares Error names/messages, RegExp source/flags

3. deepStrictEqual(actual, expected[, message])
   - Uses 'Object.is'
   - Compares [[Prototype]] via '==='
   - Compares own Symbol properties
   - WeakMap/WeakSet equal only by reference

46. strictEqual/notEqual/notStrictEqual
   - '===', '!=', '!==' checks

710. throws/doesNotThrow/rejects/doesNotReject
   - 'throws(fn[, error][, message])': fn must throw; 'error' matches by constructor, RegExp, or validation fn
   - 'rejects(asyncFn[, error][, message])': returns Promise, rejects if no rejection or wrong error

11. AssertionError:
   - options: message, actual, expected, operator, stackStartFn
   - properties: message, name 'AssertionError', actual, expected, operator, code 'ERR_ASSERTION', generatedMessage

12. CallTracker:
   - calls(fn[, exact=1])  wrapper fn
   - getCalls(wrapper)  Array<{ thisArg, arguments }>
   - report()  Array<{ message, actual, expected, operator, stack }>
   - reset([wrapper])
   - verify(): throws if counts mismatched

## Original Source
Node.js Standard Library Documentation
https://nodejs.org/api/

## Digest of ASSERT_MODULE

# Assert Module

## 1. Module Overview
The `node:assert` module provides assertion functions for testing invariants in Node.js. Stable since v0.5.9.

## 2. Method Signatures

### assert(value[, message])
Throws an `AssertionError` if `value` is not truthy.

### assert.deepEqual(actual, expected[, message])
Tests for deep equality using `==` (legacy). Throws `AssertionError` on mismatch.

### assert.deepStrictEqual(actual, expected[, message])
Tests for deep equality using `Object.is`, deep comparison of own properties and prototypes.

### assert.strictEqual(actual, expected[, message])
Tests `actual === expected`.

### assert.notEqual(actual, expected[, message])
Tests `actual != expected`.

### assert.notStrictEqual(actual, expected[, message])
Tests `actual !== expected`.

### assert.throws(fn[, error][, message])
Asserts that `fn` throws. `error` may be a RegExp, constructor, or validation function.

### assert.doesNotThrow(fn[, error][, message])
Asserts that `fn` does not throw.

### assert.rejects(asyncFn[, error][, message])
Asserts that `asyncFn` rejects. Returns Promise.

### assert.doesNotReject(asyncFn[, error][, message])
Asserts that `asyncFn` does not reject. Returns Promise.

### Class: AssertionError
**Constructor:** new `assert.AssertionError(options)`
- `options.message` {string}
- `options.actual` {any}
- `options.expected` {any}
- `options.operator` {string}
- `options.stackStartFn` {Function}

Properties after instantiation:
- `message` {string}
- `name` = 'AssertionError'
- `actual`, `expected`, `operator`, `code='ERR_ASSERTION'`, `generatedMessage` {boolean}

### Class: CallTracker (Deprecated)
**Constructor:** new `assert.CallTracker()`

- `tracker.calls(fn[, exact]) → Function`
- `tracker.getCalls(fn) → Array<{ thisArg, arguments }>`
- `tracker.report() → Array<{ message, actual, expected, operator, stack }>`
- `tracker.reset([fn])`
- `tracker.verify()`

## 3. Configuration
- Disable colors: set `NODE_DISABLE_COLORS` or `NO_COLOR` env var.

## 4. Stability Index
- 0 Deprecated, 1 Experimental, 2 Stable, 3 Legacy (see per method above)

## 5. Version History Highlights
- `assert.deepStrictEqual` added in v1.2.0
- `assert.rejects` added in v10.0.0
- `CallTracker` added in v12.19.0, deprecated v20.1.0

---
_Retrieved on: 2024-06-20  (Data Size: 3,691,308 bytes)_

## Attribution
- Source: Node.js Standard Library Documentation
- URL: https://nodejs.org/api/
- License: License if known
- Crawl Date: 2025-05-18T09:26:54.904Z
- Data Size: 3691308 bytes
- Links Found: 3343

## Retrieved
2025-05-18
