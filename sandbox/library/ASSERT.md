# ASSERT

## Crawl Summary
Assert module stability level, strict versus legacy assertion modes with import signatures, AssertionError and deprecated CallTracker class specs, list of all assertion functions with signatures and parameter lists.

## Normalised Extract
Table of Contents:
1 Import Patterns
2 Assertion Modes
3 AssertionError Class
4 CallTracker Class
5 Assertion Functions

1 Import Patterns
import { strict as assert } from node:assert
import assert from node:assert/strict
const assert = require('node:assert').strict
const assert = require('node:assert/strict')
legacy: import assert from node:assert

2 Assertion Modes
strict: non-strict behave as strict, error diffs, disable colors with NO_COLOR or NODE_DISABLE_COLORS
legacy: deepEqual, equal, notDeepEqual, notEqual use == operator

3 AssertionError Class
Signature: new assert.AssertionError(options)
options: { message: string, actual: any, expected: any, operator: string, stackStartFn: Function }
properties: message, name=AssertionError, actual, expected, operator, generatedMessage: boolean, code=ERR_ASSERTION, stack

4 CallTracker Class
Signature: new assert.CallTracker()
methods:
  calls(fn=()=>{}, exact=1) returns wrapper to track calls
  getCalls(fn) => Array of { thisArg, arguments }
  report() => Array of { message, actual, expected, operator, stack }
  reset(fn?) resets tracks
  verify() throws AssertionError if calls mismatch
deprecated in v20.1.0

5 Assertion Functions
assert(value[, message])
assert.ok(value[, message])
assert.deepEqual(actual, expected[, message])
assert.deepStrictEqual(actual, expected[, message])
assert.equal(actual, expected[, message])
assert.strictEqual(actual, expected[, message])
assert.notDeepEqual(actual, expected[, message])
assert.notDeepStrictEqual(actual, expected[, message])
assert.notEqual(actual, expected[, message])
assert.notStrictEqual(actual, expected[, message])
assert.fail([message] | actual, expected, message, operator, stackStartFn)
assert.throws(fn[, error][, message])
assert.doesNotThrow(fn[, error][, message])
assert.rejects(asyncFn[, error][, message]) => Promise
assert.doesNotReject(asyncFn[, error][, message]) => Promise
assert.match(string, regexp[, message])
assert.doesNotMatch(string, regexp[, message])
assert.ifError(value)


## Supplementary Details
Import both ESM and CJS paths, environment variable toggles (NO_COLOR, NODE_DISABLE_COLORS), default CallTracker thresholds, legacy operator behavior details (== vs ===), deep equality config (compare Map, Set, circular refs stops on mismatch), strict deepEquality (Object.is, [[Prototype]] check, Symbol props), error diff display enabled in strict mode.

## Reference Details
Import Syntax:
- ESM strict: import { strict as assert } from 'node:assert'
- ESM strict alternative: import assert from 'node:assert/strict'
- CJS strict: const assert = require('node:assert').strict or require('node:assert/strict')
- CJS legacy: const assert = require('node:assert')
Environment Variables:
- NO_COLOR or NODE_DISABLE_COLORS disable colored diffs in errors and REPL

Class AssertionError
Signature: new assert.AssertionError({ message, actual, expected, operator, stackStartFn })
Throws ERR_ASSERTION with code property 'ERR_ASSERTION'
Properties:
  actual: any
  expected: any
  operator: string
  generatedMessage: boolean

Usage Example:
import assert from 'node:assert/strict'
try {
  assert.strictEqual(1, 2)
} catch (err) {
  // err.code === 'ERR_ASSERTION', err.operator === 'strictEqual'
}

Class CallTracker (deprecated v20.1.0)
Signature: const tracker = new assert.CallTracker()
Usage Pattern:
const callsFunc = tracker.calls(func, exactTimes)
callsFunc(...args)
process.on('exit', () => tracker.verify())
Method Signatures:
- tracker.calls(fn?: Function, exact?: number) => Function
- tracker.getCalls(wrapperFn: Function) => Array<{ thisArg: any, arguments: any[] }>
- tracker.report() => Array<{ message: string, actual: number, expected: number, operator: string, stack: any }>
- tracker.reset(wrapperFn?: Function) => void
- tracker.verify() => void throws on mismatch

Assertion Function Signatures:
assert(value: any, message?: string|Error): void
assert.deepEqual(actual: any, expected: any, message?: string|Error): void
assert.deepStrictEqual(actual: any, expected: any, message?: string|Error): void
assert.equal(actual: any, expected: any, message?: string|Error): void
assert.strictEqual(actual: any, expected: any, message?: string|Error): void
assert.notDeepEqual(actual: any, expected: any, message?: string|Error): void
assert.notDeepStrictEqual(actual: any, expected: any, message?: string|Error): void
assert.notEqual(actual: any, expected: any, message?: string|Error): void
assert.notStrictEqual(actual: any, expected: any, message?: string|Error): void
assert.ok(value: any, message?: string|Error): void
assert.fail(message?: string|Error): never
assert.fail(actual: any, expected: any, message?: string|Error, operator?: string, stackStartFn?: Function): never
assert.throws(fn: Function, error?: RegExp|Function, message?: string|Error): void
assert.doesNotThrow(fn: Function, error?: RegExp|Function, message?: string|Error): void
assert.rejects(asyncFn: Function|Promise<any>, error?: RegExp|Function, message?: string|Error): Promise<void>
assert.doesNotReject(asyncFn: Function|Promise<any>, error?: RegExp|Function, message?: string|Error): Promise<void>
assert.match(string: string, regexp: RegExp, message?: string|Error): void
assert.doesNotMatch(string: string, regexp: RegExp, message?: string|Error): void
assert.ifError(value: any): void

Best Practices:
- Use strict mode import paths for consistent behavior
- Avoid legacy deepEqual for production
- Surround assertion calls in try/catch when expecting failure
- Use tracker.verify() in exit handlers

Troubleshooting:
Check err.code === 'ERR_ASSERTION'
Inspect err.operator and err.stack
Set NO_COLOR=1 to disable colors when capturing logs


## Information Dense Extract
ASSERT module stable; import strict via node:assert/strict or require('node:assert').strict; legacy via require('node:assert'). AssertionError: new AssertionError({message,actual,expected,operator,stackStartFn}), code ERR_ASSERTION. CallTracker deprecated: calls(fn,exact=1)=>wrapper, getCalls, report, reset, verify. Functions: assert(value,message), ok alias; deepEqual (legacy ==, stops on circular), deepStrictEqual (Object.is, proto check, symbol props), equal (==), strictEqual (===), notDeepEqual, notDeepStrictEqual, notEqual, notStrictEqual, fail variants, throws(fn,error?,msg), doesNotThrow(fn,error?,msg), rejects(asyncFn,error?,msg)=>Promise, doesNotReject(asyncFn,error?,msg)=>Promise, match, doesNotMatch, ifError. Env NO_COLOR,NODE_DISABLE_COLORS disable colored diffs.

## Sanitised Extract
Table of Contents:
1 Import Patterns
2 Assertion Modes
3 AssertionError Class
4 CallTracker Class
5 Assertion Functions

1 Import Patterns
import { strict as assert } from node:assert
import assert from node:assert/strict
const assert = require('node:assert').strict
const assert = require('node:assert/strict')
legacy: import assert from node:assert

2 Assertion Modes
strict: non-strict behave as strict, error diffs, disable colors with NO_COLOR or NODE_DISABLE_COLORS
legacy: deepEqual, equal, notDeepEqual, notEqual use == operator

3 AssertionError Class
Signature: new assert.AssertionError(options)
options: { message: string, actual: any, expected: any, operator: string, stackStartFn: Function }
properties: message, name=AssertionError, actual, expected, operator, generatedMessage: boolean, code=ERR_ASSERTION, stack

4 CallTracker Class
Signature: new assert.CallTracker()
methods:
  calls(fn=()=>{}, exact=1) returns wrapper to track calls
  getCalls(fn) => Array of { thisArg, arguments }
  report() => Array of { message, actual, expected, operator, stack }
  reset(fn?) resets tracks
  verify() throws AssertionError if calls mismatch
deprecated in v20.1.0

5 Assertion Functions
assert(value[, message])
assert.ok(value[, message])
assert.deepEqual(actual, expected[, message])
assert.deepStrictEqual(actual, expected[, message])
assert.equal(actual, expected[, message])
assert.strictEqual(actual, expected[, message])
assert.notDeepEqual(actual, expected[, message])
assert.notDeepStrictEqual(actual, expected[, message])
assert.notEqual(actual, expected[, message])
assert.notStrictEqual(actual, expected[, message])
assert.fail([message] | actual, expected, message, operator, stackStartFn)
assert.throws(fn[, error][, message])
assert.doesNotThrow(fn[, error][, message])
assert.rejects(asyncFn[, error][, message]) => Promise
assert.doesNotReject(asyncFn[, error][, message]) => Promise
assert.match(string, regexp[, message])
assert.doesNotMatch(string, regexp[, message])
assert.ifError(value)

## Original Source
Node.js Core API Reference
https://nodejs.org/api/

## Digest of ASSERT

# Assert Module

Stability: 2 - Stable
Source Code: lib/assert.js
Date retrieved: 2024-06-07
Data Size: 3573031 bytes

# Import Patterns
Node.js import and require patterns for strict and legacy assertion modes:
import { strict as assert } from node:assert
import assert from node:assert/strict
const assert = require('node:assert').strict
const assert = require('node:assert/strict')

Legacy mode:
import assert from node:assert
const assert = require('node:assert')

# Strict Assertion Mode
In strict mode non-strict methods behave like strict variants. Error diffs are shown. Disable colors with NO_COLOR or NODE_DISABLE_COLORS.

# Legacy Assertion Mode
assert.deepEqual, equal, notDeepEqual, notEqual use == operator. May yield unexpected results.

# Classes
## AssertionError
Signature: new assert.AssertionError(options)
Options:
  message: string
  actual: any
  expected: any
  operator: string
  stackStartFn: Function
Properties:
  message, name='AssertionError', actual, expected, operator, generatedMessage: boolean, code='ERR_ASSERTION', stack

## CallTracker (deprecated)
Signature: new assert.CallTracker()
Methods:
  calls(fn=()=>{}, exact=1) => wrapper Function
  getCalls(fn) => Array<{ thisArg: Object, arguments: Array }>
  report() => Array<{ message: string, actual: number, expected: number, operator: string, stack: Object }>
  reset(fn?) => void
  verify() => void throws on mismatch

# Assertion Functions
assert(value, message?)
assert.ok(value, message?) alias
assert.deepEqual(actual, expected, message?) Legacy deep equality, uses ==
assert.deepStrictEqual(actual, expected, message?) Strict deep equality, uses Object.is, compares prototypes, symbol props
assert.equal(actual, expected, message?) Legacy shallow, uses ==
assert.strictEqual(actual, expected, message?) Strict shallow, uses ===
assert.notEqual(actual, expected, message?) Legacy not equal, uses !=
assert.notStrictEqual(actual, expected, message?) Strict not equal, uses !==
assert.fail([message] or actual, expected, message, operator, stackStartFn)
assert.throws(fn, error?, message?)
assert.doesNotThrow(fn, error?, message?)
assert.rejects(asyncFn, error?, message?) returns Promise
assert.doesNotReject(asyncFn, error?, message?) returns Promise
assert.match(string, regexp, message?)
assert.doesNotMatch(string, regexp, message?)
assert.ifError(value)


## Attribution
- Source: Node.js Core API Reference
- URL: https://nodejs.org/api/
- License: License: MIT
- Crawl Date: 2025-05-13T03:35:59.326Z
- Data Size: 3573031 bytes
- Links Found: 2796

## Retrieved
2025-05-13
