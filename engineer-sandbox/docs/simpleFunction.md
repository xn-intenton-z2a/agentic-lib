# Simple Echo Function

The `simpleEcho` function is a utility that takes a non-empty string input, trims it, and returns a greeting message.

## Usage

Import the functions from the source directory:

```js
import { simpleEcho, simpleReverse } from '../../sandbox/source/simpleFunction.js';

const greeting = simpleEcho("World");
console.log(greeting); // "Hello, World"
```

## simpleReverse Function

The `simpleReverse` function takes a non-empty string input, trims it, and returns the input string reversed. This function logs its operations using the standard logging functions.

### Usage Example

```js
import { simpleReverse } from '../../sandbox/source/simpleFunction.js';

const reversed = simpleReverse("  Hello World  ");
console.log(reversed); // "dlroW olleH"
```

*Note:* For example, passing the string "  World  " will return "dlroW", demonstrating that the function correctly trims and reverses the input.

## Error Handling

If the input is not a non-empty string, both functions will throw an error.

## Logging

These functions use the standard logging functions (`logInfo` and `logError`) from the main module to log their actions and any errors encountered.
