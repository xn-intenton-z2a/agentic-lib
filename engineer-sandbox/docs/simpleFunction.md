# Simple Echo Function

The `simpleEcho` function is a utility that takes a non-empty string input, trims it, and returns a greeting message.

## Usage

Import the function from the source directory:

```js
import { simpleEcho } from '../../sandbox/source/simpleFunction.js';

const greeting = simpleEcho("World");
console.log(greeting); // "Hello, World"
```

## Error Handling

If the input is not a non-empty string, the function will throw an error.

## Logging

This function uses the standard logging functions (`logInfo` and `logError`) from the main module to log its actions and any errors encountered.
