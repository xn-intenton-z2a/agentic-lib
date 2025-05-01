# Simple Echo and Reverse Functions

The `simpleEcho` function is a utility that takes a non-empty string input, trims it, and returns a greeting message. The `simpleReverse` function similarly trims a non-empty string input and returns the reversed string. Both functions log their operations using standard logging functions.

## Usage

Import the functions from the source module:

```js
import { simpleEcho, simpleReverse } from '../../sandbox/source/simpleFunction.js';

const greeting = simpleEcho("World");
console.log(greeting); // "Hello, World"

const reversed = simpleReverse("  Hello  ");
console.log(reversed); // "olleH"
```

## Error Handling

Both functions will throw an error with the message "Invalid input: must be a non-empty string" if provided an empty or whitespace-only string.

Example:

```js
try {
  simpleReverse("   ");
} catch (error) {
  console.error(error.message); // "Invalid input: must be a non-empty string"
}
```

## Logging

Operations and errors in these functions are logged using the `logInfo` and `logError` functions from `src/lib/main.js`.
